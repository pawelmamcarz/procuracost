import { calculatorV2T, modelV2T, type Lang } from "@/lib/i18n";
import {
  CONTRACT_DESIGN_REGISTRY,
  WORKFLOW_DESIGN_REGISTRY,
  assertValidCalibratedValue,
  buildCalculationInputFromDraft,
  buildDecisionRecordV2,
  createScenarioDraftFromLegacyMigration,
  resolveLegalWaits,
  validateProcessMap,
  type AlternativeId,
  type CalibratedValue,
  type ProcessMapValidationCode,
  type ProcessMapValidationIssue,
  type LegacyMigrationResult,
} from "@/lib/model-v2";

import {
  isEditableProcessStepKind,
  USER_DEFINED_STEP_LABEL_KEY,
  type CalculatorWorkspaceState,
} from "./editor-state";
import type {
  CalculatorUiIssue,
  ContextUiIssue,
  CustomLabelUiIssue,
  DesignUiIssue,
  EditorUiIssue,
  MigrationUiIssue,
  ProcessMapUiIssue,
  RangeUiIssue,
  SubmitUiIssue,
  UrlUiIssue,
  WorkspaceSourceUiIssue,
} from "./issues";

export const PROCESS_MAP_VALIDATION_CODES = [
  "duplicate_step",
  "unknown_predecessor",
  "cycle",
  "invalid_value",
  "invalid_locked_legal_wait",
  "missing_locked_legal_wait",
  "unexpected_locked_legal_wait",
] as const satisfies readonly ProcessMapValidationCode[];

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

export interface CalculatorWorkspaceValidation {
  canSubmit: boolean;
  issues: CalculatorUiIssue[];
}

export type CalculatorWorkspaceSubmitResult =
  | {
      status: "submitted";
      state: CalculatorWorkspaceState;
      issues: [];
    }
  | {
      status: "blocked";
      state: CalculatorWorkspaceState;
      issues: CalculatorUiIssue[];
    };

export function processMapIssueFromEngine(
  issue: ProcessMapValidationIssue,
  alternativeId: AlternativeId,
  details: { predecessorId?: string } = {}
): ProcessMapUiIssue {
  return {
    source: "process-map",
    code: issue.code,
    messageKey: `calculatorV2.validation.processMap.${issue.code}`,
    alternativeId,
    ...(issue.stepId ? { stepId: issue.stepId } : {}),
    ...(details.predecessorId
      ? { predecessorId: details.predecessorId }
      : {}),
  };
}

function contextIssue(): ContextUiIssue {
  return {
    source: "context",
    code: "illegal_context",
    messageKey: "calculatorV2.validation.illegalContext",
  };
}

function rangeIssue(
  field: string,
  alternativeId?: AlternativeId,
  stepId?: string
): RangeUiIssue {
  return {
    source: "range",
    code: "invalid_calibrated_range",
    messageKey: "calculatorV2.validation.invalidCalibratedRange",
    field,
    ...(alternativeId ? { alternativeId } : {}),
    ...(stepId ? { stepId } : {}),
  };
}

function isValidNonNegativeRange(value: CalibratedValue): boolean {
  try {
    assertValidCalibratedValue(value);
    return value.low >= 0;
  } catch {
    return false;
  }
}

function collectRangeIssues(state: CalculatorWorkspaceState): RangeUiIssue[] {
  const issues: RangeUiIssue[] = [];
  const check = (
    value: CalibratedValue,
    field: string,
    alternativeId?: AlternativeId,
    stepId?: string
  ) => {
    if (!isValidNonNegativeRange(value)) {
      issues.push(rangeIssue(field, alternativeId, stepId));
    }
  };

  for (const [roleId, value] of Object.entries(state.draft.roleHourlyRates)) {
    check(value, `roleHourlyRates.${roleId}`);
  }
  const assumptions = state.draft.economicAssumptions;
  check(assumptions.contractValue, "economicAssumptions.contractValue");
  check(
    assumptions.dailyCostOfInaction,
    "economicAssumptions.dailyCostOfInaction"
  );
  check(
    assumptions.amendmentDifferential,
    "economicAssumptions.amendmentDifferential"
  );
  check(assumptions.tcoDifferential, "economicAssumptions.tcoDifferential");
  if (assumptions.competitionTransferRate) {
    check(
      assumptions.competitionTransferRate,
      "economicAssumptions.competitionTransferRate"
    );
  }

  for (const alternativeId of ALTERNATIVE_IDS) {
    const steps =
      state.draft.alternatives[alternativeId].workflowDesign.steps;
    for (const step of steps) {
      check(step.activeDays, "activeDays", alternativeId, step.id);
      check(step.queueDays, "queueDays", alternativeId, step.id);
      check(step.nonLabourCost, "nonLabourCost", alternativeId, step.id);
      for (const [roleId, value] of Object.entries(step.roleHours)) {
        check(value, `roleHours.${roleId}`, alternativeId, step.id);
      }
    }
  }
  return issues;
}

function collectUrlIssues(state: CalculatorWorkspaceState): UrlUiIssue[] {
  if (state.urlGate?.kind !== "v2_url") return [];
  return state.urlGate.result.status === "invalid" &&
    Array.isArray(state.urlGate.result.validationErrors)
    ? state.urlGate.result.validationErrors.map((issue) => ({
        source: "url",
        code: issue.code,
        field: issue.field,
        value: issue.value,
        messageKey: issue.messageKey,
      }))
    : [];
}

function collectMigrationIssues(
  state: CalculatorWorkspaceState
): MigrationUiIssue[] {
  if (
    !state.migration ||
    state.migration.status === "ready" ||
    !Array.isArray(state.migration.issues)
  ) {
    return [];
  }
  return state.migration.issues.map((issue) => ({
    source: "migration",
    code: issue.code,
    field: issue.field,
    messageKey: issue.messageKey,
  }));
}

function workspaceSourceIssue(): WorkspaceSourceUiIssue {
  return {
    source: "workspace-source",
    code: "incoherent_workspace_source",
    messageKey: "calculatorV2.validation.incoherentWorkspaceSource",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasGateKind<Kind extends "v2_url" | "legacy_migration">(
  value: unknown,
  kind: Kind
): value is { kind: Kind; result: Record<string, unknown> } {
  return isRecord(value) && value.kind === kind && isRecord(value.result);
}

function hasV2GateShape(value: unknown): boolean {
  if (!hasGateKind(value, "v2_url")) return false;
  const result = value.result;
  if (!isRecord(result) || !Array.isArray(result.validationErrors)) {
    return false;
  }
  if (result.status === "valid") {
    return (
      result.canCalculate === true &&
      result.validationErrors.length === 0 &&
      isRecord(result.state)
    );
  }
  return result.status === "invalid" && result.canCalculate === false;
}

function sameRuntimeContract(left: unknown, right: unknown): boolean {
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return false;
  }
}

function collectWorkspaceSourceIssues(
  state: CalculatorWorkspaceState
): WorkspaceSourceUiIssue[] {
  if (state.urlOrigin === "empty") {
    return state.urlGate === undefined && state.migration === null
      ? []
      : [workspaceSourceIssue()];
  }

  if (state.urlOrigin === "v2") {
    return hasV2GateShape(state.urlGate) && state.migration === null
      ? []
      : [workspaceSourceIssue()];
  }

  if (state.urlOrigin !== "legacy" || !isRecord(state.migration)) {
    return [workspaceSourceIssue()];
  }
  if (state.migration.status === "blocked") {
    return state.urlGate === undefined &&
      Array.isArray(state.migration.issues) &&
      state.migration.issues.length > 0
      ? []
      : [workspaceSourceIssue()];
  }
  if (state.migration.status !== "ready") {
    return [workspaceSourceIssue()];
  }
  if (!hasGateKind(state.urlGate, "legacy_migration")) {
    return [workspaceSourceIssue()];
  }

  try {
    const gate = state.urlGate as Extract<
      NonNullable<CalculatorWorkspaceState["urlGate"]>,
      { kind: "legacy_migration" }
    >;
    const adaptation = createScenarioDraftFromLegacyMigration(
      gate.result as LegacyMigrationResult,
      gate.confirmed === true
    );
    return adaptation.status === "ready" &&
      sameRuntimeContract(state.migration, adaptation) &&
      sameRuntimeContract(gate, adaptation.gate)
      ? []
      : [workspaceSourceIssue()];
  } catch {
    return [workspaceSourceIssue()];
  }
}

function collectStepKindIssues(
  state: CalculatorWorkspaceState
): EditorUiIssue[] {
  return ALTERNATIVE_IDS.flatMap((alternativeId) =>
    state.draft.alternatives[alternativeId].workflowDesign.steps.flatMap(
      (step): EditorUiIssue[] => {
        const validKind = step.lockedLegalProvenance
          ? step.kind === "legal_wait"
          : isEditableProcessStepKind(step.kind);
        return validKind
          ? []
          : [
              {
                source: "editor",
                code: "invalid_step_kind",
                messageKey: "calculatorV2.validation.invalidStepKind",
                alternativeId,
                stepId: step.id,
                field: "kind",
              },
            ];
      }
    )
  );
}

function collectDesignIssues(state: CalculatorWorkspaceState): DesignUiIssue[] {
  return ALTERNATIVE_IDS.flatMap((alternativeId) => {
    const workflowId = state.draft.designIds.workflow[alternativeId];
    const contractId = state.draft.designIds.contract[alternativeId];
    const workflowCompatible = WORKFLOW_DESIGN_REGISTRY.some(
      (entry) =>
        entry.id === workflowId &&
        entry.scenarioId === state.scenarioId &&
        entry.alternativeId === alternativeId
    );
    const contractCompatible = CONTRACT_DESIGN_REGISTRY.some(
      (entry) =>
        entry.id === contractId &&
        entry.scenarioId === state.scenarioId &&
        entry.alternativeId === alternativeId
    );
    const issues: DesignUiIssue[] = [];
    if (!workflowCompatible) {
      issues.push({
        source: "design",
        code: "incompatible_workflow_design",
        messageKey: "calculatorV2.validation.incompatibleWorkflowDesign",
        alternativeId,
        field: "workflowDesign",
      });
    }
    if (!contractCompatible) {
      issues.push({
        source: "design",
        code: "incompatible_contract_design",
        messageKey: "calculatorV2.validation.incompatibleContractDesign",
        alternativeId,
        field: "contractDesign",
      });
    }
    return issues;
  });
}

function collectCustomLabelIssues(
  state: CalculatorWorkspaceState
): CustomLabelUiIssue[] {
  return ALTERNATIVE_IDS.flatMap((alternativeId) =>
    state.draft.alternatives[alternativeId].workflowDesign.steps
      .filter(
        (step) =>
          step.labelKey === USER_DEFINED_STEP_LABEL_KEY &&
          !step.userLabel?.trim()
      )
      .map((step) => ({
        source: "custom-label" as const,
        code: "blank_custom_label" as const,
        messageKey: "calculatorV2.validation.blankCustomLabel" as const,
        alternativeId,
        stepId: step.id,
        field: "userLabel",
      }))
  );
}

function uniqueIssues(issues: CalculatorUiIssue[]): CalculatorUiIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = JSON.stringify(issue);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function deriveCalculatorWorkspaceValidation(
  state: CalculatorWorkspaceState
): CalculatorWorkspaceValidation {
  const issues: CalculatorUiIssue[] = [
    ...state.issues,
    ...collectWorkspaceSourceIssues(state),
    ...collectUrlIssues(state),
    ...collectMigrationIssues(state),
    ...collectRangeIssues(state),
    ...collectDesignIssues(state),
    ...collectCustomLabelIssues(state),
    ...collectStepKindIssues(state),
  ];

  let expectedLegalWaits: ReturnType<typeof resolveLegalWaits> | undefined;
  try {
    expectedLegalWaits = resolveLegalWaits(state.draft.context);
  } catch {
    issues.push(contextIssue());
  }

  for (const alternativeId of ALTERNATIVE_IDS) {
    const workflow =
      state.draft.alternatives[alternativeId].workflowDesign;
    const knownIds = new Set(workflow.steps.map(({ id }) => id));
    for (const engineIssue of validateProcessMap(
      workflow,
      expectedLegalWaits
    )) {
      const step = engineIssue.stepId
        ? workflow.steps.find(({ id }) => id === engineIssue.stepId)
        : undefined;
      const predecessorId =
        engineIssue.code === "unknown_predecessor"
          ? step?.predecessorIds.find((id) => !knownIds.has(id))
          : undefined;
      issues.push(
        processMapIssueFromEngine(engineIssue, alternativeId, {
          predecessorId,
        })
      );
    }
  }

  let combined = uniqueIssues(issues);
  if (combined.length === 0) {
    try {
      buildCalculationInputFromDraft(state.draft, state.urlGate);
    } catch {
      const issue: SubmitUiIssue = {
        source: "submit",
        code: "calculation_rejected",
        messageKey: "calculatorV2.validation.calculationRejected",
      };
      combined = [issue];
    }
  }
  return { canSubmit: combined.length === 0, issues: combined };
}

export function submitCalculatorWorkspace(
  state: CalculatorWorkspaceState
): CalculatorWorkspaceSubmitResult {
  const validation = deriveCalculatorWorkspaceValidation(state);
  if (!validation.canSubmit) {
    return { status: "blocked", state, issues: validation.issues };
  }
  try {
    const record = buildDecisionRecordV2(state.draft, state.urlGate);
    return {
      status: "submitted",
      state: {
        ...state,
        record,
        focusTarget: { kind: "decision-record" },
        issues: [],
      },
      issues: [],
    };
  } catch {
    const issue: SubmitUiIssue = {
      source: "submit",
      code: "calculation_rejected",
      messageKey: "calculatorV2.validation.calculationRejected",
    };
    return { status: "blocked", state, issues: [issue] };
  }
}

export function calculatorIssueCopy(
  issue: CalculatorUiIssue,
  lang: Lang
): string {
  if (issue.source === "process-map") {
    return calculatorV2T[lang].validation.processMap[issue.code];
  }
  if (issue.source === "url" || issue.source === "migration") {
    const key = issue.messageKey.replace(
      /^validation\./,
      ""
    ) as keyof typeof modelV2T.pl.validation;
    return modelV2T[lang].validation[key];
  }
  const validation = calculatorV2T[lang].validation;
  switch (issue.code) {
    case "locked_step":
      return validation.lockedStep;
    case "unknown_step":
      return validation.unknownStep;
    case "unknown_role":
      return validation.unknownRole;
    case "invalid_calibrated_range":
      return validation.invalidCalibratedRange;
    case "invalid_step_kind":
      return validation.invalidStepKind;
    case "illegal_context":
      return validation.illegalContext;
    case "incompatible_locked_wait_shape":
      return validation.incompatibleLockedWaitShape;
    case "context_reconciliation_failed":
      return validation.contextReconciliationFailed;
    case "blank_custom_label":
      return validation.blankCustomLabel;
    case "incompatible_workflow_design":
      return validation.incompatibleWorkflowDesign;
    case "incompatible_contract_design":
      return validation.incompatibleContractDesign;
    case "incoherent_workspace_source":
      return validation.incoherentWorkspaceSource;
    case "calculation_rejected":
      return validation.calculationRejected;
  }
}
