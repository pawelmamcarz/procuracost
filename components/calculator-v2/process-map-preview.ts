import {
  calculateComparison,
  type AlternativeId,
} from "@/lib/model-v2";

import type { CalculatorWorkspaceState } from "./editor-state";
import {
  buildWorkspaceCalculationInput,
  deriveCalculatorWorkspaceValidation,
} from "./workspace-validation";

export type ProcessMapCriticalPathPreview = Record<
  AlternativeId,
  string[]
>;

function emptyCriticalPathPreview(): ProcessMapCriticalPathPreview {
  return {
    formalSequential: [],
    adaptiveCompliant: [],
  };
}

export function deriveProcessMapCriticalPathPreview(
  state: CalculatorWorkspaceState
): ProcessMapCriticalPathPreview {
  if (!deriveCalculatorWorkspaceValidation(state).canSubmit) {
    return emptyCriticalPathPreview();
  }

  try {
    const input = buildWorkspaceCalculationInput(state);
    const result = calculateComparison(input);
    return {
      formalSequential: [
        ...result.formalSequential.criticalPathStepIds.central,
      ],
      adaptiveCompliant: [
        ...result.adaptiveCompliant.criticalPathStepIds.central,
      ],
    };
  } catch {
    return emptyCriticalPathPreview();
  }
}
