import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { calculatorV2T, type Lang } from "@/lib/i18n";
import {
  calculateComparison,
  type AlternativeId,
} from "@/lib/model-v2";

import {
  calculatorWorkspaceReducer,
  type CalculatorWorkspaceAction,
  type CalculatorWorkspaceState,
} from "./editor-state";
import { ProcessMapValidationSummary } from "./ProcessMapValidationSummary";
import { ProcessStepInspector } from "./ProcessStepInspector";
import { deriveCalculatorWorkspaceValidation } from "./workspace-validation";
import { ProcessRail } from "../process-map/ProcessRail";
import { buildProcessRailViewModel } from "../process-map/rail-view-model";

export interface ProcessMapEditorProps {
  lang: Lang;
  state: CalculatorWorkspaceState;
  onStateChange: (state: CalculatorWorkspaceState) => void;
}

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

function criticalPaths(state: CalculatorWorkspaceState) {
  try {
    const result = calculateComparison({
      context: state.draft.context,
      alternatives: state.draft.alternatives,
      roleHourlyRates: state.draft.roleHourlyRates,
      dailyCostOfInaction: state.draft.dailyCostOfInaction,
    });
    return {
      formalSequential:
        result.formalSequential.criticalPathStepIds.central,
      adaptiveCompliant:
        result.adaptiveCompliant.criticalPathStepIds.central,
    };
  } catch {
    return { formalSequential: [], adaptiveCompliant: [] };
  }
}

export function ProcessMapEditor({
  lang,
  state,
  onStateChange,
}: ProcessMapEditorProps) {
  const tx = calculatorV2T[lang];
  const [announcement, setAnnouncement] = useState("");
  const validation = deriveCalculatorWorkspaceValidation(state);
  const invalidStepIds = Object.fromEntries(
    ALTERNATIVE_IDS.map((alternativeId) => [
      alternativeId,
      validation.issues.flatMap((issue) =>
        issue.alternativeId === alternativeId && issue.stepId
          ? [issue.stepId]
          : []
      ),
    ])
  ) as Record<AlternativeId, string[]>;
  const viewModel = buildProcessRailViewModel({
    lang,
    workflows: {
      formalSequential:
        state.draft.alternatives.formalSequential.workflowDesign,
      adaptiveCompliant:
        state.draft.alternatives.adaptiveCompliant.workflowDesign,
    },
    selectedAlternative: state.selectedAlternative,
    selectedStepId: state.selectedStepId,
    criticalPathStepIds: criticalPaths(state),
    invalidStepIds,
  });

  const dispatch = (action: CalculatorWorkspaceAction) => {
    onStateChange(calculatorWorkspaceReducer(state, action));
  };

  return (
    <div className="space-y-5">
      <ProcessMapValidationSummary
        issues={validation.issues}
        lang={lang}
        onFocusIssue={(alternativeId, stepId) => {
          const selected = calculatorWorkspaceReducer(state, {
            type: "select-step",
            alternativeId,
            stepId,
          });
          onStateChange(
            calculatorWorkspaceReducer(selected, {
              type: "set-focus-target",
              target: { kind: "step-node", alternativeId, stepId },
            })
          );
        }}
        state={state}
      />

      {state.undo ? (
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span>{tx.workspace.undoAvailable}</span>
          <button
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => dispatch({ type: "undo" })}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            {tx.workspace.undo}
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ProcessRail
          mode="editable"
          onAddStep={(alternativeId) => {
            onStateChange(
              calculatorWorkspaceReducer(state, {
                type: "add-step",
                alternativeId,
              })
            );
            setAnnouncement(tx.workspace.stepAdded);
          }}
          onSelectStep={(alternativeId, stepId) =>
            dispatch({ type: "select-step", alternativeId, stepId })
          }
          viewModel={viewModel}
        />
        <ProcessStepInspector
          issues={validation.issues}
          lang={lang}
          onAction={dispatch}
          state={state}
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
