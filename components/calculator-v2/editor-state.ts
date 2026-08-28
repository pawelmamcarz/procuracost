import {
  assertValidCalibratedValue,
  type AlternativeId,
  type CalibratedValue,
  type CalculationInputGateV2,
  type ComparisonAlternatives,
  type DecisionRecordV2,
  type LegacyMigrationDraftResult,
  type ModelContextV2,
  type ProcessMapStep,
  type ProcessMapStepKind,
  type ScenarioDraft,
  type ScenarioEconomicAssumptions,
  type ScenarioV2Id,
} from "@/lib/model-v2";

import type { CalculatorUiIssue, EditorUiIssue } from "./issues";
import type { CalculatorUrlOrigin } from "./url-bootstrap";

export const USER_DEFINED_STEP_LABEL_KEY = "workflow.steps.userDefined";

export const EDITABLE_PROCESS_STEP_KINDS = [
  "activity",
  "approval",
  "milestone",
] as const satisfies readonly Exclude<ProcessMapStepKind, "legal_wait">[];

export function isEditableProcessStepKind(
  value: unknown
): value is (typeof EDITABLE_PROCESS_STEP_KINDS)[number] {
  return (
    typeof value === "string" &&
    EDITABLE_PROCESS_STEP_KINDS.includes(
      value as (typeof EDITABLE_PROCESS_STEP_KINDS)[number]
    )
  );
}

export type CalculatorFocusTarget =
  | { kind: "step-node"; alternativeId: AlternativeId; stepId: string }
  | { kind: "step-label"; alternativeId: AlternativeId; stepId: string }
  | { kind: "lane-add"; alternativeId: AlternativeId }
  | { kind: "migration-confirmation" }
  | { kind: "decision-record" }
  | null;

export interface ProcessMapEditUndo {
  draft: ScenarioDraft;
  selectedAlternative: AlternativeId;
  selectedStepId: string | null;
  focusTarget: CalculatorFocusTarget;
  locallyEdited: Record<AlternativeId, boolean>;
}

export interface CalculatorWorkspaceState {
  draft: ScenarioDraft;
  scenarioId: ScenarioV2Id;
  urlOrigin: CalculatorUrlOrigin;
  urlGate: CalculationInputGateV2 | undefined;
  migration: LegacyMigrationDraftResult | null;
  selectedAlternative: AlternativeId;
  selectedStepId: string | null;
  focusTarget: CalculatorFocusTarget;
  undo: ProcessMapEditUndo | null;
  locallyEdited: Record<AlternativeId, boolean>;
  issues: CalculatorUiIssue[];
  record: DecisionRecordV2 | null;
}

export interface CreateCalculatorWorkspaceOptions {
  urlOrigin?: CalculatorUrlOrigin;
  urlGate?: CalculationInputGateV2;
  migration?: LegacyMigrationDraftResult | null;
}

export type EditableStepRangeField =
  | { kind: "activeDays" }
  | { kind: "queueDays" }
  | { kind: "nonLabourCost" }
  | { kind: "roleHours"; roleId: string };

export type CalculatorWorkspaceAction =
  | {
      type: "select-step";
      alternativeId: AlternativeId;
      stepId: string;
    }
  | { type: "set-focus-target"; target: CalculatorFocusTarget }
  | { type: "add-step"; alternativeId: AlternativeId }
  | {
      type: "edit-step-label";
      alternativeId: AlternativeId;
      stepId: string;
      userLabel: string;
    }
  | {
      type: "edit-step-kind";
      alternativeId: AlternativeId;
      stepId: string;
      kind: ProcessMapStepKind;
    }
  | {
      type: "edit-step-predecessors";
      alternativeId: AlternativeId;
      stepId: string;
      predecessorIds: string[];
    }
  | {
      type: "edit-step-range";
      alternativeId: AlternativeId;
      stepId: string;
      field: EditableStepRangeField;
      value: CalibratedValue;
    }
  | {
      type: "remove-step";
      alternativeId: AlternativeId;
      stepId: string;
    }
  | { type: "undo" }
  | {
      type: "replace-economic-assumptions";
      economicAssumptions: ScenarioEconomicAssumptions;
    }
  | {
      type: "edit-role-hourly-rate";
      roleId: string;
      value: CalibratedValue;
    }
  | {
      type: "accept-legal-context";
      context: ModelContextV2;
      alternatives: ComparisonAlternatives;
    }
  | {
      type: "replace-draft";
      draft: ScenarioDraft;
      urlOrigin: CalculatorUrlOrigin;
      urlGate: CalculationInputGateV2 | undefined;
      migration: LegacyMigrationDraftResult | null;
    }
  | {
      type: "set-url-source";
      urlOrigin: CalculatorUrlOrigin;
      urlGate: CalculationInputGateV2 | undefined;
      migration: LegacyMigrationDraftResult | null;
    };

export const CALCULATOR_WORKSPACE_ACTION_TYPES = [
  "select-step",
  "set-focus-target",
  "add-step",
  "edit-step-label",
  "edit-step-kind",
  "edit-step-predecessors",
  "edit-step-range",
  "remove-step",
  "undo",
  "replace-economic-assumptions",
  "edit-role-hourly-rate",
  "accept-legal-context",
  "replace-draft",
  "set-url-source",
] as const satisfies readonly CalculatorWorkspaceAction["type"][];

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

export function createCalculatorWorkspaceState(
  draft: ScenarioDraft,
  options: CreateCalculatorWorkspaceOptions = {}
): CalculatorWorkspaceState {
  return {
    draft: structuredClone(draft),
    scenarioId: draft.derivedFromScenarioId,
    urlOrigin: options.urlOrigin ?? "empty",
    urlGate: options.urlGate ? structuredClone(options.urlGate) : undefined,
    migration: options.migration ? structuredClone(options.migration) : null,
    selectedAlternative: "formalSequential",
    selectedStepId: null,
    focusTarget: null,
    undo: null,
    locallyEdited: {
      formalSequential: false,
      adaptiveCompliant: false,
    },
    issues: [],
    record: null,
  };
}

export function visibleStepLabel(
  step: ProcessMapStep,
  translate: (labelKey: string) => string
): string {
  return step.userLabel?.trim() ? step.userLabel : translate(step.labelKey);
}

function editorIssue(
  code: EditorUiIssue["code"],
  alternativeId?: AlternativeId,
  stepId?: string,
  field?: string
): EditorUiIssue {
  const messageKeys: Record<EditorUiIssue["code"], EditorUiIssue["messageKey"]> = {
    locked_step: "calculatorV2.validation.lockedStep",
    unknown_step: "calculatorV2.validation.unknownStep",
    unknown_role: "calculatorV2.validation.unknownRole",
    invalid_calibrated_range:
      "calculatorV2.validation.invalidCalibratedRange",
    invalid_step_kind: "calculatorV2.validation.invalidStepKind",
  };
  return {
    source: "editor",
    code,
    messageKey: messageKeys[code],
    ...(alternativeId ? { alternativeId } : {}),
    ...(stepId ? { stepId } : {}),
    ...(field ? { field } : {}),
  };
}

function rejectEditorAction(
  state: CalculatorWorkspaceState,
  issue: EditorUiIssue
): CalculatorWorkspaceState {
  return { ...state, issues: [issue] };
}

function workflowSteps(
  state: CalculatorWorkspaceState,
  alternativeId: AlternativeId
): ProcessMapStep[] {
  return state.draft.alternatives[alternativeId].workflowDesign.steps;
}

function stepById(
  state: CalculatorWorkspaceState,
  alternativeId: AlternativeId,
  stepId: string
): ProcessMapStep | undefined {
  return workflowSteps(state, alternativeId).find(({ id }) => id === stepId);
}

function undoSnapshot(state: CalculatorWorkspaceState): ProcessMapEditUndo {
  return {
    draft: structuredClone(state.draft),
    selectedAlternative: state.selectedAlternative,
    selectedStepId: state.selectedStepId,
    focusTarget: structuredClone(state.focusTarget),
    locallyEdited: { ...state.locallyEdited },
  };
}

function acceptedMapEdit(
  state: CalculatorWorkspaceState,
  draft: ScenarioDraft,
  alternativeId: AlternativeId,
  changes: Partial<CalculatorWorkspaceState> = {}
): CalculatorWorkspaceState {
  return {
    ...state,
    draft,
    focusTarget:
      state.focusTarget?.kind === "decision-record" ? null : state.focusTarget,
    record: null,
    issues: [],
    undo: undoSnapshot(state),
    locallyEdited: {
      ...state.locallyEdited,
      [alternativeId]: true,
    },
    ...changes,
  };
}

function zeroUserInputValue(): CalibratedValue {
  return {
    low: 0,
    central: 0,
    high: 0,
    rangeKind: "fixed",
    evidenceClass: "user_input",
    evidenceIds: [],
  };
}

function collisionFreeStepId(draft: ScenarioDraft): string {
  const ids = new Set(
    ALTERNATIVE_IDS.flatMap((alternativeId) =>
      draft.alternatives[alternativeId].workflowDesign.steps.map(({ id }) => id)
    )
  );
  let sequence = 1;
  while (ids.has(`user-step-${sequence}`)) sequence += 1;
  return `user-step-${sequence}`;
}

function validateRange(value: CalibratedValue): boolean {
  try {
    assertValidCalibratedValue(value);
    return value.low >= 0;
  } catch {
    return false;
  }
}

function editableStepOrRejection(
  state: CalculatorWorkspaceState,
  alternativeId: AlternativeId,
  stepId: string
): ProcessMapStep | EditorUiIssue {
  const step = stepById(state, alternativeId, stepId);
  if (!step) return editorIssue("unknown_step", alternativeId, stepId);
  if (step.lockedLegalProvenance) {
    return editorIssue("locked_step", alternativeId, stepId);
  }
  return step;
}

function mapStepEdit(
  state: CalculatorWorkspaceState,
  alternativeId: AlternativeId,
  stepId: string,
  mutate: (step: ProcessMapStep) => void
): CalculatorWorkspaceState {
  const current = editableStepOrRejection(state, alternativeId, stepId);
  if ("source" in current) return rejectEditorAction(state, current);
  const draft = structuredClone(state.draft);
  const next = draft.alternatives[alternativeId].workflowDesign.steps.find(
    ({ id }) => id === stepId
  )!;
  mutate(next);
  return acceptedMapEdit(state, draft, alternativeId);
}

function addStep(
  state: CalculatorWorkspaceState,
  alternativeId: AlternativeId
): CalculatorWorkspaceState {
  const draft = structuredClone(state.draft);
  const steps = draft.alternatives[alternativeId].workflowDesign.steps;
  const selected =
    state.selectedAlternative === alternativeId && state.selectedStepId
      ? steps.find(
          ({ id, lockedLegalProvenance }) =>
            id === state.selectedStepId && !lockedLegalProvenance
        )
      : undefined;
  const predecessor =
    selected ?? [...steps].reverse().find((step) => !step.lockedLegalProvenance);
  const id = collisionFreeStepId(draft);
  const step: ProcessMapStep = {
    id,
    labelKey: USER_DEFINED_STEP_LABEL_KEY,
    userLabel: "",
    predecessorIds: predecessor ? [predecessor.id] : [],
    activeDays: zeroUserInputValue(),
    queueDays: zeroUserInputValue(),
    roleHours: Object.fromEntries(
      Object.keys(draft.roleHourlyRates).map((roleId) => [
        roleId,
        zeroUserInputValue(),
      ])
    ),
    nonLabourCost: zeroUserInputValue(),
    kind: "activity",
  };
  const insertionIndex = predecessor ? steps.indexOf(predecessor) + 1 : steps.length;
  steps.splice(insertionIndex, 0, step);
  return acceptedMapEdit(state, draft, alternativeId, {
    selectedAlternative: alternativeId,
    selectedStepId: id,
    focusTarget: { kind: "step-label", alternativeId, stepId: id },
  });
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function removeStep(
  state: CalculatorWorkspaceState,
  alternativeId: AlternativeId,
  stepId: string
): CalculatorWorkspaceState {
  const current = editableStepOrRejection(state, alternativeId, stepId);
  if ("source" in current) return rejectEditorAction(state, current);
  const draft = structuredClone(state.draft);
  const steps = draft.alternatives[alternativeId].workflowDesign.steps;
  const removedIndex = steps.findIndex(({ id }) => id === stepId);
  const [removed] = steps.splice(removedIndex, 1);
  for (const step of steps) {
    step.predecessorIds = unique(
      step.predecessorIds.flatMap((predecessorId) =>
        predecessorId === removed.id
          ? removed.predecessorIds
          : [predecessorId]
      )
    );
  }
  const closestPredecessor = removed.predecessorIds.find((predecessorId) =>
    steps.some(({ id }) => id === predecessorId)
  );
  return acceptedMapEdit(state, draft, alternativeId, {
    selectedAlternative: alternativeId,
    selectedStepId: closestPredecessor ?? null,
    focusTarget: closestPredecessor
      ? { kind: "step-node", alternativeId, stepId: closestPredecessor }
      : { kind: "lane-add", alternativeId },
  });
}

function rangeFieldName(field: EditableStepRangeField): string {
  return field.kind === "roleHours"
    ? `roleHours.${field.roleId}`
    : field.kind;
}

export function calculatorWorkspaceReducer(
  state: CalculatorWorkspaceState,
  action: CalculatorWorkspaceAction
): CalculatorWorkspaceState {
  switch (action.type) {
    case "select-step":
      return {
        ...state,
        selectedAlternative: action.alternativeId,
        selectedStepId: action.stepId,
      };
    case "set-focus-target":
      return { ...state, focusTarget: action.target };
    case "add-step":
      return addStep(state, action.alternativeId);
    case "edit-step-label":
      return mapStepEdit(
        state,
        action.alternativeId,
        action.stepId,
        (step) => {
          step.userLabel = action.userLabel;
        }
      );
    case "edit-step-kind": {
      const current = editableStepOrRejection(
        state,
        action.alternativeId,
        action.stepId
      );
      if ("source" in current) return rejectEditorAction(state, current);
      if (!isEditableProcessStepKind(action.kind)) {
        return rejectEditorAction(
          state,
          editorIssue(
            "invalid_step_kind",
            action.alternativeId,
            action.stepId,
            "kind"
          )
        );
      }
      return mapStepEdit(
        state,
        action.alternativeId,
        action.stepId,
        (step) => {
          step.kind = action.kind;
        }
      );
    }
    case "edit-step-predecessors":
      return mapStepEdit(
        state,
        action.alternativeId,
        action.stepId,
        (step) => {
          step.predecessorIds = unique(action.predecessorIds);
        }
      );
    case "edit-step-range": {
      const current = editableStepOrRejection(
        state,
        action.alternativeId,
        action.stepId
      );
      if ("source" in current) return rejectEditorAction(state, current);
      const field = rangeFieldName(action.field);
      if (!validateRange(action.value)) {
        return rejectEditorAction(
          state,
          editorIssue(
            "invalid_calibrated_range",
            action.alternativeId,
            action.stepId,
            field
          )
        );
      }
      if (
        action.field.kind === "roleHours" &&
        !(action.field.roleId in state.draft.roleHourlyRates)
      ) {
        return rejectEditorAction(
          state,
          editorIssue(
            "unknown_role",
            action.alternativeId,
            action.stepId,
            field
          )
        );
      }
      return mapStepEdit(
        state,
        action.alternativeId,
        action.stepId,
        (step) => {
          if (action.field.kind === "roleHours") {
            step.roleHours[action.field.roleId] = structuredClone(action.value);
          } else {
            step[action.field.kind] = structuredClone(action.value);
          }
        }
      );
    }
    case "remove-step":
      return removeStep(state, action.alternativeId, action.stepId);
    case "undo":
      return state.undo
        ? {
            ...state,
            draft: structuredClone(state.undo.draft),
            scenarioId: state.undo.draft.derivedFromScenarioId,
            selectedAlternative: state.undo.selectedAlternative,
            selectedStepId: state.undo.selectedStepId,
            focusTarget:
              state.undo.focusTarget?.kind === "decision-record"
                ? null
                : structuredClone(state.undo.focusTarget),
            locallyEdited: { ...state.undo.locallyEdited },
            undo: null,
            issues: [],
            record: null,
          }
        : state;
    case "replace-economic-assumptions": {
      const draft = structuredClone(state.draft);
      draft.economicAssumptions = structuredClone(action.economicAssumptions);
      draft.dailyCostOfInaction = structuredClone(
        action.economicAssumptions.dailyCostOfInaction
      );
      return {
        ...state,
        draft,
        focusTarget:
          state.focusTarget?.kind === "decision-record" ? null : state.focusTarget,
        issues: [],
        record: null,
      };
    }
    case "edit-role-hourly-rate": {
      if (!(action.roleId in state.draft.roleHourlyRates)) {
        return rejectEditorAction(
          state,
          editorIssue("unknown_role", undefined, undefined, action.roleId)
        );
      }
      if (!validateRange(action.value)) {
        return rejectEditorAction(
          state,
          editorIssue(
            "invalid_calibrated_range",
            undefined,
            undefined,
            `roleHourlyRates.${action.roleId}`
          )
        );
      }
      const draft = structuredClone(state.draft);
      draft.roleHourlyRates[action.roleId] = structuredClone(action.value);
      return {
        ...state,
        draft,
        focusTarget:
          state.focusTarget?.kind === "decision-record" ? null : state.focusTarget,
        issues: [],
        record: null,
      };
    }
    case "accept-legal-context": {
      const draft = structuredClone(state.draft);
      draft.context = structuredClone(action.context);
      draft.alternatives = structuredClone(action.alternatives);
      return {
        ...state,
        draft,
        focusTarget:
          state.focusTarget?.kind === "decision-record" ? null : state.focusTarget,
        undo: null,
        issues: [],
        record: null,
      };
    }
    case "replace-draft":
      return {
        ...state,
        draft: structuredClone(action.draft),
        scenarioId: action.draft.derivedFromScenarioId,
        urlOrigin: action.urlOrigin,
        urlGate: action.urlGate ? structuredClone(action.urlGate) : undefined,
        migration: action.migration ? structuredClone(action.migration) : null,
        selectedAlternative: "formalSequential",
        selectedStepId: null,
        focusTarget: null,
        undo: null,
        locallyEdited: {
          formalSequential: false,
          adaptiveCompliant: false,
        },
        issues: [],
        record: null,
      };
    case "set-url-source":
      return {
        ...state,
        urlOrigin: action.urlOrigin,
        urlGate: action.urlGate ? structuredClone(action.urlGate) : undefined,
        migration: action.migration ? structuredClone(action.migration) : null,
        focusTarget:
          state.focusTarget?.kind === "decision-record" ? null : state.focusTarget,
        issues: [],
        record: null,
      };
  }
}
