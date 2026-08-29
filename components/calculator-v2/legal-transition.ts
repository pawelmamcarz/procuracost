import {
  reconcileAlternativeLegalWaits,
  resolveLegalWaits,
  hasSameRegisteredScenarioContext,
  validateProcessMap,
  type AlternativeId,
  type ModelContextV2,
  type ProcessMapValidationIssue,
  type ResolvedLegalWait,
} from "@/lib/model-v2";

import {
  calculatorWorkspaceReducer,
  type CalculatorWorkspaceState,
} from "./editor-state";
import type { ContextUiIssue } from "./issues";

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

export type LegalContextTransitionResult =
  | {
      status: "accepted";
      state: CalculatorWorkspaceState;
      legalWaits: ResolvedLegalWait[];
      validation: Record<AlternativeId, ProcessMapValidationIssue[]>;
      issues: [];
    }
  | {
      status: "rejected";
      state: CalculatorWorkspaceState;
      issues: ContextUiIssue[];
    };

function contextIssue(code: ContextUiIssue["code"]): ContextUiIssue {
  const messageKeys: Record<
    ContextUiIssue["code"],
    ContextUiIssue["messageKey"]
  > = {
    illegal_context: "calculatorV2.validation.illegalContext",
    registered_design_required:
      "calculatorV2.validation.registeredDesignRequired",
    incompatible_locked_wait_shape:
      "calculatorV2.validation.incompatibleLockedWaitShape",
    context_reconciliation_failed:
      "calculatorV2.validation.contextReconciliationFailed",
  };
  return {
    source: "context",
    code,
    messageKey: messageKeys[code],
  };
}

function lockedWaitIds(
  state: CalculatorWorkspaceState,
  alternativeId: AlternativeId
): string[] {
  return state.draft.alternatives[alternativeId].workflowDesign.steps
    .filter(({ lockedLegalProvenance }) => lockedLegalProvenance !== undefined)
    .map(({ id }) => id);
}

function sameIds(left: readonly string[], right: readonly string[]): boolean {
  return (
    left.length === right.length &&
    left.every((id, index) => id === right[index])
  );
}

export function applyLegalContextTransition(
  state: CalculatorWorkspaceState,
  nextContext: ModelContextV2
): LegalContextTransitionResult {
  let legalWaits: ResolvedLegalWait[];
  try {
    legalWaits = resolveLegalWaits(nextContext);
  } catch {
    return {
      status: "rejected",
      state,
      issues: [contextIssue("illegal_context")],
    };
  }

  if (!hasSameRegisteredScenarioContext(state.draft.context, nextContext)) {
    return {
      status: "rejected",
      state,
      issues: [contextIssue("registered_design_required")],
    };
  }

  const expectedIds = legalWaits.map(({ id }) => id);
  if (
    ALTERNATIVE_IDS.some(
      (alternativeId) =>
        !sameIds(lockedWaitIds(state, alternativeId), expectedIds)
    )
  ) {
    return {
      status: "rejected",
      state,
      issues: [contextIssue("incompatible_locked_wait_shape")],
    };
  }

  try {
    const alternatives = reconcileAlternativeLegalWaits(
      state.draft.alternatives,
      nextContext
    );
    const validation = Object.fromEntries(
      ALTERNATIVE_IDS.map((alternativeId) => [
        alternativeId,
        validateProcessMap(
          alternatives[alternativeId].workflowDesign,
          legalWaits
        ),
      ])
    ) as Record<AlternativeId, ProcessMapValidationIssue[]>;
    if (ALTERNATIVE_IDS.some((alternativeId) => validation[alternativeId].length)) {
      return {
        status: "rejected",
        state,
        issues: [contextIssue("context_reconciliation_failed")],
      };
    }
    return {
      status: "accepted",
      state: calculatorWorkspaceReducer(state, {
        type: "accept-legal-context",
        context: nextContext,
        alternatives,
      }),
      legalWaits,
      validation,
      issues: [],
    };
  } catch {
    return {
      status: "rejected",
      state,
      issues: [contextIssue("context_reconciliation_failed")],
    };
  }
}
