import {
  assertValidCalibratedValue,
  type CalibratedValue,
  type RangeValues,
} from "./calibrated-value";
import { assertMaterializedCalculationInputIntegrity } from "./calculation-input";
import type {
  ComparisonAlternatives,
  ContractDesign,
  ContractCostDimensionId,
  ModelContextV2,
  ProcessMapStep,
  WorkflowDesign,
} from "./domain";
import { resolveRegisteredWorkflowDesign } from "./design-registry";
import { resolveLegalWaits, type ResolvedLegalWait } from "./legal";
import { assertValidProcessMap } from "./process-map";
import { assertSameRegisteredScenarioContext } from "./registered-context";
import { scenarioV2ById, type ScenarioV2Id } from "./scenarios";

type RangeCase = keyof RangeValues;
const RANGE_CASES: RangeCase[] = ["low", "central", "high"];

export interface AlternativeCostResult {
  elapsedDays: RangeValues;
  criticalPathStepIds: Record<RangeCase, string[]>;
  roleCost: RangeValues;
  nonLabourCost: RangeValues;
  delayCost: RangeValues;
  contractCost: RangeValues;
  totalCost: RangeValues;
  nonMonetizedDimensions: Array<{
    id: ContractCostDimensionId;
    reasonKey: string;
    evidenceIds: string[];
  }>;
}

export interface ComparisonCalculationInput {
  kind: "materialized_calculation_input";
  registeredScenarioId: ScenarioV2Id;
  context: ModelContextV2;
  alternatives: ComparisonAlternatives;
  roleHourlyRates: Record<string, CalibratedValue>;
  dailyCostOfInaction: CalibratedValue;
}

export interface ComparisonCalculationResult {
  formalSequential: AlternativeCostResult;
  adaptiveCompliant: AlternativeCostResult;
  deltaCost: number;
  deltaCostOuterEnvelope: {
    low: number;
    high: number;
  };
}

interface CriticalPathCaseResult {
  elapsedDays: number;
  stepIds: string[];
}

function criticalPathForCase(
  workflowDesign: WorkflowDesign,
  rangeCase: RangeCase
): CriticalPathCaseResult {
  if (workflowDesign.steps.length === 0) {
    return { elapsedDays: 0, stepIds: [] };
  }

  const stepsById = new Map(
    workflowDesign.steps.map((step) => [step.id, step] as const)
  );
  const memo = new Map<string, CriticalPathCaseResult>();

  const finishAt = (step: ProcessMapStep): CriticalPathCaseResult => {
    const cached = memo.get(step.id);
    if (cached) return cached;

    let predecessorResult: CriticalPathCaseResult = {
      elapsedDays: 0,
      stepIds: [],
    };
    for (const predecessorId of step.predecessorIds) {
      const predecessor = stepsById.get(predecessorId);
      if (!predecessor) continue;
      const candidate = finishAt(predecessor);
      if (
        candidate.elapsedDays > predecessorResult.elapsedDays ||
        (candidate.elapsedDays === predecessorResult.elapsedDays &&
          candidate.stepIds.length > predecessorResult.stepIds.length)
      ) {
        predecessorResult = candidate;
      }
    }

    const result = {
      elapsedDays:
        predecessorResult.elapsedDays +
        step.activeDays[rangeCase] +
        step.queueDays[rangeCase],
      stepIds: [...predecessorResult.stepIds, step.id],
    };
    memo.set(step.id, result);
    return result;
  };

  let critical: CriticalPathCaseResult = { elapsedDays: 0, stepIds: [] };
  for (const step of workflowDesign.steps) {
    const candidate = finishAt(step);
    if (
      candidate.elapsedDays > critical.elapsedDays ||
      (candidate.elapsedDays === critical.elapsedDays &&
        candidate.stepIds.length > critical.stepIds.length)
    ) {
      critical = candidate;
    }
  }
  return critical;
}

function calculateAlternative(
  workflowDesign: WorkflowDesign,
  contractDesign: ContractDesign,
  expectedLegalWaits: readonly ResolvedLegalWait[],
  roleHourlyRates: Record<string, CalibratedValue>,
  dailyCostOfInaction: CalibratedValue
): AlternativeCostResult {
  const hasLockedLegalWait = workflowDesign.steps.some(
    ({ lockedLegalProvenance }) => lockedLegalProvenance !== undefined
  );
  let registeredDependencies = workflowDesign.requiredLegalDependencies;
  if (hasLockedLegalWait) {
    if (!workflowDesign.registeredDesignId) {
      throw new Error(
        "A workflow with mandatory legal waits requires registered design provenance"
      );
    }
    registeredDependencies = resolveRegisteredWorkflowDesign(
      workflowDesign.registeredDesignId
    ).requiredLegalDependencies ?? [];
  }
  assertValidProcessMap(
    workflowDesign,
    expectedLegalWaits,
    registeredDependencies
  );
  assertValidCalibratedValue(dailyCostOfInaction, "dailyCostOfInaction");
  if (dailyCostOfInaction.low < 0) {
    throw new Error("dailyCostOfInaction cannot be negative");
  }

  for (const [roleId, rate] of Object.entries(roleHourlyRates)) {
    assertValidCalibratedValue(rate, `roleHourlyRates.${roleId}`);
    if (rate.low < 0) {
      throw new Error(`roleHourlyRates.${roleId} cannot be negative`);
    }
  }

  const contractDimensionIds = new Set<ContractCostDimensionId>();
  for (const dimension of contractDesign.dimensions) {
    if (contractDimensionIds.has(dimension.id)) {
      throw new Error(`Duplicate contract cost dimension ${dimension.id}`);
    }
    contractDimensionIds.add(dimension.id);
    if (dimension.status === "monetized") {
      assertValidCalibratedValue(
        dimension.cost,
        `contractDesign.${dimension.id}`
      );
    }
  }

  const elapsedDays = {} as RangeValues;
  const criticalPathStepIds = {} as Record<RangeCase, string[]>;
  const roleCost = {} as RangeValues;
  const nonLabourCost = {} as RangeValues;
  const delayCost = {} as RangeValues;
  const contractCost = {} as RangeValues;
  const totalCost = {} as RangeValues;

  for (const rangeCase of RANGE_CASES) {
    const criticalPath = criticalPathForCase(workflowDesign, rangeCase);
    elapsedDays[rangeCase] = criticalPath.elapsedDays;
    criticalPathStepIds[rangeCase] = criticalPath.stepIds;

    roleCost[rangeCase] = workflowDesign.steps.reduce((stepTotal, step) => {
      return (
        stepTotal +
        Object.entries(step.roleHours).reduce((roleTotal, [roleId, hours]) => {
          if (hours[rangeCase] === 0) return roleTotal;
          const rate = roleHourlyRates[roleId];
          if (!rate) {
            throw new Error(`Missing hourly rate for role ${roleId}`);
          }
          return roleTotal + hours[rangeCase] * rate[rangeCase];
        }, 0)
      );
    }, 0);

    nonLabourCost[rangeCase] = workflowDesign.steps.reduce(
      (total, step) => total + step.nonLabourCost[rangeCase],
      0
    );
    delayCost[rangeCase] =
      elapsedDays[rangeCase] * dailyCostOfInaction[rangeCase];
    contractCost[rangeCase] = contractDesign.dimensions.reduce(
      (total, dimension) =>
        dimension.status === "monetized"
          ? total + dimension.cost[rangeCase]
          : total,
      0
    );
    totalCost[rangeCase] =
      roleCost[rangeCase] +
      nonLabourCost[rangeCase] +
      delayCost[rangeCase] +
      contractCost[rangeCase];

    for (const [field, values] of Object.entries({
      elapsedDays, roleCost, nonLabourCost, delayCost, contractCost, totalCost,
    })) {
      if (!Number.isFinite(values[rangeCase])) {
        throw new RangeError(`Non-finite calculation result: ${field}.${rangeCase}`);
      }
    }
  }

  return {
    elapsedDays,
    criticalPathStepIds,
    roleCost,
    nonLabourCost,
    delayCost,
    contractCost,
    totalCost,
    nonMonetizedDimensions: contractDesign.dimensions.flatMap((dimension) =>
      dimension.status === "notMonetized"
        ? [
            {
              id: dimension.id,
              reasonKey: dimension.reasonKey,
              evidenceIds: [...dimension.evidenceIds],
            },
          ]
        : []
    ),
  };
}

function assertTrustedCalculationInput(
  input: ComparisonCalculationInput
): void {
  if (
    (input as ComparisonCalculationInput & { kind?: unknown }).kind !==
    "materialized_calculation_input"
  ) {
    throw new Error(
      "calculateComparison requires a materialized calculation input"
    );
  }
  const registeredScenario = scenarioV2ById(input.registeredScenarioId);
  if (!registeredScenario) {
    throw new Error(
      `Unknown registered model 2.3 scenario: ${String(input.registeredScenarioId)}`
    );
  }
  assertSameRegisteredScenarioContext(
    input.context,
    registeredScenario.context
  );
  if (input !== registeredScenario.calculationInput) {
    assertMaterializedCalculationInputIntegrity(input);
  }
}

function calculateComparisonCore(
  input: ComparisonCalculationInput
): ComparisonCalculationResult {
  const expectedLegalWaits = resolveLegalWaits(input.context);
  const formalSequential = calculateAlternative(
    input.alternatives.formalSequential.workflowDesign,
    input.alternatives.formalSequential.contractDesign,
    expectedLegalWaits,
    input.roleHourlyRates,
    input.dailyCostOfInaction
  );
  const adaptiveCompliant = calculateAlternative(
    input.alternatives.adaptiveCompliant.workflowDesign,
    input.alternatives.adaptiveCompliant.contractDesign,
    expectedLegalWaits,
    input.roleHourlyRates,
    input.dailyCostOfInaction
  );

  return {
    formalSequential,
    adaptiveCompliant,
    deltaCost:
      formalSequential.totalCost.central - adaptiveCompliant.totalCost.central,
    deltaCostOuterEnvelope: {
      low: formalSequential.totalCost.low - adaptiveCompliant.totalCost.high,
      high: formalSequential.totalCost.high - adaptiveCompliant.totalCost.low,
    },
  };
}

export function calculateComparison(
  input: ComparisonCalculationInput
): ComparisonCalculationResult {
  assertTrustedCalculationInput(input);
  return calculateComparisonCore(input);
}

export function calculateSwappedComparisonForDiagnostics(
  input: ComparisonCalculationInput
): ComparisonCalculationResult {
  assertTrustedCalculationInput(input);
  return calculateComparisonCore({
    ...input,
    alternatives: {
      formalSequential: input.alternatives.adaptiveCompliant,
      adaptiveCompliant: input.alternatives.formalSequential,
    },
  });
}
