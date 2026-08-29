import { describe, expect, it } from "vitest";

import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
  type CalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import {
  createScenarioDraft,
  type ProcessMapStep,
  type ScenarioDraft,
} from "@/lib/model-v2";

function controlledLinearDraft(): ScenarioDraft {
  const draft = createScenarioDraft("fleet_tco_reframing");
  const source = draft.alternatives.formalSequential.workflowDesign.steps
    .filter((step) => !step.lockedLegalProvenance)
    .slice(0, 4);
  if (source.length < 4) throw new Error("Expected four editable fixture steps");
  const ids = ["step-a", "step-b", "step-c", "step-d"];
  const steps = source.map(
    (step, index): ProcessMapStep => ({
      ...structuredClone(step),
      id: ids[index],
      predecessorIds: index === 0 ? [] : [ids[index - 1]],
      userLabel: `Step ${ids[index]}`,
    })
  );
  draft.alternatives.formalSequential.workflowDesign.steps = steps;
  return draft;
}

function select(
  state: CalculatorWorkspaceState,
  stepId: string
): CalculatorWorkspaceState {
  return calculatorWorkspaceReducer(state, {
    type: "select-step",
    alternativeId: "formalSequential",
    stepId,
  });
}

describe("process-map reducer removal and undo", () => {
  it("repairs only declared successor references by splicing in removed predecessors", () => {
    const initial = select(
      createCalculatorWorkspaceState(controlledLinearDraft()),
      "step-b"
    );

    const removed = calculatorWorkspaceReducer(initial, {
      type: "remove-step",
      alternativeId: "formalSequential",
      stepId: "step-b",
    });
    const steps = removed.draft.alternatives.formalSequential.workflowDesign.steps;

    expect(steps.map(({ id }) => id)).toEqual(["step-a", "step-c", "step-d"]);
    expect(steps.find(({ id }) => id === "step-c")?.predecessorIds).toEqual([
      "step-a",
    ]);
    expect(steps.find(({ id }) => id === "step-d")?.predecessorIds).toEqual([
      "step-c",
    ]);
    expect(removed.selectedStepId).toBe("step-a");
    expect(removed.focusTarget).toEqual({
      kind: "step-node",
      alternativeId: "formalSequential",
      stepId: "step-a",
    });
  });

  it("deduplicates predecessor references deterministically during repair", () => {
    const draft = controlledLinearDraft();
    const stepC = draft.alternatives.formalSequential.workflowDesign.steps.find(
      ({ id }) => id === "step-c"
    );
    if (!stepC) throw new Error("Missing fixture step");
    stepC.predecessorIds = ["step-b", "step-a"];
    const initial = select(createCalculatorWorkspaceState(draft), "step-b");

    const removed = calculatorWorkspaceReducer(initial, {
      type: "remove-step",
      alternativeId: "formalSequential",
      stepId: "step-b",
    });

    expect(
      removed.draft.alternatives.formalSequential.workflowDesign.steps.find(
        ({ id }) => id === "step-c"
      )?.predecessorIds
    ).toEqual(["step-a"]);
  });

  it("focuses lane-add when a removed root has no surviving predecessor", () => {
    const initial = select(
      createCalculatorWorkspaceState(controlledLinearDraft()),
      "step-a"
    );

    const removed = calculatorWorkspaceReducer(initial, {
      type: "remove-step",
      alternativeId: "formalSequential",
      stepId: "step-a",
    });

    expect(removed.selectedStepId).toBeNull();
    expect(removed.focusTarget).toEqual({
      kind: "lane-add",
      alternativeId: "formalSequential",
    });
  });

  it("restores the exact prior draft, selection, focus, and lane edit flags with one undo", () => {
    const initial = {
      ...select(
        createCalculatorWorkspaceState(controlledLinearDraft()),
        "step-b"
      ),
      focusTarget: {
        kind: "step-node" as const,
        alternativeId: "formalSequential" as const,
        stepId: "step-b",
      },
      locallyEdited: {
        formalSequential: false,
        adaptiveCompliant: true,
      },
    };
    const removed = calculatorWorkspaceReducer(initial, {
      type: "remove-step",
      alternativeId: "formalSequential",
      stepId: "step-b",
    });

    const restored = calculatorWorkspaceReducer(removed, { type: "undo" });

    expect(restored.draft).toEqual(initial.draft);
    expect(restored.selectedAlternative).toBe(initial.selectedAlternative);
    expect(restored.selectedStepId).toBe(initial.selectedStepId);
    expect(restored.focusTarget).toEqual(initial.focusTarget);
    expect(restored.locallyEdited).toEqual(initial.locallyEdited);
    expect(restored.undo).toBeNull();
    expect(restored.record).toBeNull();
  });
});
