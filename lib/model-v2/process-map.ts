import {
  assertValidCalibratedValue,
  type CalibratedValue,
} from "./calibrated-value";
import type {
  ProcessMapStep,
  RequiredLegalDependency,
  WorkflowDesign,
} from "./domain";
import type { ResolvedLegalWait } from "./legal";

export type ProcessMapValidationCode =
  | "duplicate_step"
  | "unknown_predecessor"
  | "cycle"
  | "invalid_value"
  | "invalid_required_legal_dependency_contract"
  | "missing_required_legal_ancestor"
  | "invalid_locked_legal_wait"
  | "missing_locked_legal_wait"
  | "unexpected_locked_legal_wait";

export interface ProcessMapValidationIssue {
  code: ProcessMapValidationCode;
  stepId?: string;
  message: string;
}

export class ProcessMapValidationError extends Error {
  readonly issues: ProcessMapValidationIssue[];

  constructor(issues: ProcessMapValidationIssue[]) {
    super(issues.map((issue) => issue.message).join("; "));
    this.name = "ProcessMapValidationError";
    this.issues = issues;
  }
}

function cloneCalibratedValue(value: CalibratedValue): CalibratedValue {
  return { ...value, evidenceIds: [...value.evidenceIds] };
}

function fixedLegalZero(evidenceIds: string[]): CalibratedValue {
  return {
    low: 0,
    central: 0,
    high: 0,
    rangeKind: "fixed",
    evidenceClass: "legal_rule",
    evidenceIds: [...evidenceIds],
  };
}

export function createLockedLegalWaitStep(
  wait: ResolvedLegalWait,
  predecessorIds: string[] = []
): ProcessMapStep {
  return {
    id: wait.id,
    labelKey: wait.labelKey,
    predecessorIds: [...predecessorIds],
    activeDays: fixedLegalZero(wait.queueDays.evidenceIds),
    queueDays: cloneCalibratedValue(wait.queueDays),
    roleHours: {},
    nonLabourCost: fixedLegalZero(wait.queueDays.evidenceIds),
    kind: "legal_wait",
    lockedLegalProvenance: { ...wait.provenance },
  };
}

function sameStringArray(left: readonly string[], right: readonly string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function sameCalibratedValue(
  left: CalibratedValue,
  right: CalibratedValue
): boolean {
  return (
    left.low === right.low &&
    left.central === right.central &&
    left.high === right.high &&
    left.rangeKind === right.rangeKind &&
    left.evidenceClass === right.evidenceClass &&
    sameStringArray(left.evidenceIds, right.evidenceIds)
  );
}

function isFixedAt(value: CalibratedValue, expected: number): boolean {
  return (
    value.rangeKind === "fixed" &&
    value.low === expected &&
    value.central === expected &&
    value.high === expected
  );
}

function validateStepValues(
  step: ProcessMapStep,
  issues: ProcessMapValidationIssue[]
): void {
  const values: Array<[string, CalibratedValue]> = [
    ["activeDays", step.activeDays],
    ["queueDays", step.queueDays],
    ["nonLabourCost", step.nonLabourCost],
    ...Object.entries(step.roleHours).map(
      ([roleId, value]) => [`roleHours.${roleId}`, value] as [string, CalibratedValue]
    ),
  ];

  for (const [fieldName, value] of values) {
    try {
      assertValidCalibratedValue(value, `${step.id}.${fieldName}`);
      if (value.low < 0) {
        throw new Error(`${step.id}.${fieldName} cannot be negative`);
      }
    } catch (error) {
      issues.push({
        code: "invalid_value",
        stepId: step.id,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

function validateSelfLockedStep(
  step: ProcessMapStep,
  issues: ProcessMapValidationIssue[]
): void {
  const provenance = step.lockedLegalProvenance;
  if (!provenance) return;

  const roleHoursAreZero = Object.values(step.roleHours).every(
    (hours) => isFixedAt(hours, 0)
  );
  if (
    step.kind !== "legal_wait" ||
    !isFixedAt(step.activeDays, provenance.lockedActiveDays) ||
    !isFixedAt(step.queueDays, provenance.lockedQueueDays) ||
    !isFixedAt(step.nonLabourCost, 0) ||
    !roleHoursAreZero
  ) {
    issues.push({
      code: "invalid_locked_legal_wait",
      stepId: step.id,
      message: `Step ${step.id} changes a locked legal wait`,
    });
  }
}

function hasAncestor(
  stepsById: ReadonlyMap<string, ProcessMapStep>,
  step: ProcessMapStep,
  ancestorId: string,
  visited = new Set<string>()
): boolean {
  if (visited.has(step.id)) return false;
  visited.add(step.id);
  if (step.predecessorIds.includes(ancestorId)) return true;
  return step.predecessorIds.some((predecessorId) => {
    const predecessor = stepsById.get(predecessorId);
    return predecessor
      ? hasAncestor(stepsById, predecessor, ancestorId, visited)
      : false;
  });
}

function validateExpectedLegalWaits(
  steps: ProcessMapStep[],
  expectedLegalWaits: readonly ResolvedLegalWait[],
  issues: ProcessMapValidationIssue[]
): void {
  const stepsById = new Map(steps.map((step) => [step.id, step]));
  const expectedIds = new Set(expectedLegalWaits.map((wait) => wait.id));

  for (const wait of expectedLegalWaits) {
    const step = stepsById.get(wait.id);
    if (!step) {
      issues.push({
        code: "missing_locked_legal_wait",
        stepId: wait.id,
        message: `Process map is missing locked legal wait ${wait.id}`,
      });
      continue;
    }

    const provenance = step.lockedLegalProvenance;
    if (
      step.kind !== "legal_wait" ||
      !sameCalibratedValue(step.queueDays, wait.queueDays) ||
      !isFixedAt(step.activeDays, wait.provenance.lockedActiveDays) ||
      !provenance ||
      provenance.legalRulesetId !== wait.provenance.legalRulesetId ||
      provenance.ruleId !== wait.provenance.ruleId ||
      provenance.provision !== wait.provenance.provision ||
      provenance.initiatedOn !== wait.provenance.initiatedOn ||
      provenance.lockedActiveDays !== wait.provenance.lockedActiveDays ||
      provenance.lockedQueueDays !== wait.provenance.lockedQueueDays
    ) {
      issues.push({
        code: "invalid_locked_legal_wait",
        stepId: wait.id,
        message: `Step ${wait.id} changes a locked legal wait`,
      });
    }
  }

  for (let index = 1; index < expectedLegalWaits.length; index += 1) {
    const wait = expectedLegalWaits[index];
    const previousWait = expectedLegalWaits[index - 1];
    const step = stepsById.get(wait.id);
    if (step && !hasAncestor(stepsById, step, previousWait.id)) {
      issues.push({
        code: "invalid_locked_legal_wait",
        stepId: wait.id,
        message: `Mandatory legal wait ${wait.id} must follow ${previousWait.id}`,
      });
    }
  }

  for (const step of steps) {
    if (step.lockedLegalProvenance && !expectedIds.has(step.id)) {
      issues.push({
        code: "unexpected_locked_legal_wait",
        stepId: step.id,
        message: `Process map contains unexpected locked legal wait ${step.id}`,
      });
    }
  }
}

function validateRequiredLegalAncestors(
  workflowDesign: WorkflowDesign,
  issues: ProcessMapValidationIssue[],
  expectedDependencies?: readonly RequiredLegalDependency[]
): void {
  const { steps } = workflowDesign;
  const stepsById = new Map(steps.map((step) => [step.id, step]));
  const declaredDependencies = workflowDesign.requiredLegalDependencies;
  const dependencyKey = ({ stepId, ancestorId }: RequiredLegalDependency) =>
    `${ancestorId}\u0000${stepId}`;
  const sameContract =
    expectedDependencies === undefined ||
    JSON.stringify([...expectedDependencies].map(dependencyKey).sort()) ===
      JSON.stringify([...(declaredDependencies ?? [])].map(dependencyKey).sort());
  const dependencies = expectedDependencies ?? declaredDependencies ?? [];
  const lockedStepIds = steps
    .filter(({ lockedLegalProvenance }) => lockedLegalProvenance !== undefined)
    .map(({ id }) => id);
  const hasEditableProcessSteps = steps.some(
    ({ lockedLegalProvenance }) => lockedLegalProvenance === undefined
  );

  if (
    !sameContract ||
    ((expectedDependencies !== undefined || hasEditableProcessSteps) &&
      lockedStepIds.some(
        (lockedStepId) =>
          !dependencies.some(({ ancestorId }) => ancestorId === lockedStepId)
      ))
  ) {
    issues.push({
      code: "invalid_required_legal_dependency_contract",
      message:
        "Process map does not retain the complete registered legal dependency contract",
    });
  }

  for (const dependency of dependencies) {
    const step = stepsById.get(dependency.stepId);
    const ancestor = stepsById.get(dependency.ancestorId);
    if (
      !step ||
      !ancestor?.lockedLegalProvenance ||
      !hasAncestor(stepsById, step, dependency.ancestorId)
    ) {
      issues.push({
        code: "missing_required_legal_ancestor",
        stepId: dependency.stepId,
        message: `Step ${dependency.stepId} must follow locked legal step ${dependency.ancestorId}`,
      });
    }
  }
}

function validateCycles(
  steps: ProcessMapStep[],
  knownIds: Set<string>,
  issues: ProcessMapValidationIssue[]
): void {
  const stepsById = new Map(steps.map((step) => [step.id, step]));
  const state = new Map<string, "visiting" | "visited">();

  const visit = (stepId: string): boolean => {
    if (state.get(stepId) === "visiting") return true;
    if (state.get(stepId) === "visited") return false;

    state.set(stepId, "visiting");
    const step = stepsById.get(stepId);
    const hasCycle =
      step?.predecessorIds.some(
        (predecessorId) => knownIds.has(predecessorId) && visit(predecessorId)
      ) ?? false;
    state.set(stepId, "visited");
    return hasCycle;
  };

  for (const step of steps) {
    if (visit(step.id)) {
      issues.push({
        code: "cycle",
        stepId: step.id,
        message: `Process map contains a cycle involving ${step.id}`,
      });
      return;
    }
  }
}

export function validateProcessMap(
  workflowDesign: WorkflowDesign,
  expectedLegalWaits?: readonly ResolvedLegalWait[],
  expectedRequiredLegalDependencies?: readonly RequiredLegalDependency[]
): ProcessMapValidationIssue[] {
  const issues: ProcessMapValidationIssue[] = [];
  const knownIds = new Set<string>();

  for (const step of workflowDesign.steps) {
    if (knownIds.has(step.id)) {
      issues.push({
        code: "duplicate_step",
        stepId: step.id,
        message: `Process map contains duplicate step ${step.id}`,
      });
    }
    knownIds.add(step.id);
    validateStepValues(step, issues);
    validateSelfLockedStep(step, issues);
  }

  for (const step of workflowDesign.steps) {
    for (const predecessorId of step.predecessorIds) {
      if (!knownIds.has(predecessorId)) {
        issues.push({
          code: "unknown_predecessor",
          stepId: step.id,
          message: `Step ${step.id} has unknown predecessor ${predecessorId}`,
        });
      }
    }
  }

  validateCycles(workflowDesign.steps, knownIds, issues);
  validateRequiredLegalAncestors(
    workflowDesign,
    issues,
    expectedRequiredLegalDependencies
  );
  if (expectedLegalWaits) {
    validateExpectedLegalWaits(workflowDesign.steps, expectedLegalWaits, issues);
  }

  return issues;
}

export function assertValidProcessMap(
  workflowDesign: WorkflowDesign,
  expectedLegalWaits?: readonly ResolvedLegalWait[],
  expectedRequiredLegalDependencies?: readonly RequiredLegalDependency[]
): void {
  const issues = validateProcessMap(
    workflowDesign,
    expectedLegalWaits,
    expectedRequiredLegalDependencies
  );
  if (issues.length > 0) {
    throw new ProcessMapValidationError(issues);
  }
}
