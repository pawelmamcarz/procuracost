import { afterEach, describe, expect, it, vi } from "vitest";
import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import { submitCalculatorWorkspace } from "@/components/calculator-v2/workspace-validation";
import { revealResult, scrollBehaviorFor } from "@/components/result-reveal";
import { createScenarioDraft } from "@/lib/model-v2";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("disables smooth scrolling for reduced motion", () => {
  expect(scrollBehaviorFor(true)).toBe("auto");
  expect(scrollBehaviorFor(false)).toBe("smooth");
});

it.each([
  { reducedMotion: true, behavior: "auto" },
  { reducedMotion: false, behavior: "smooth" },
] as const)(
  "reads motion preference, focuses without scrolling, and uses $behavior scrolling",
  ({ reducedMotion, behavior }) => {
    const matchMedia = vi.fn(() => ({ matches: reducedMotion }) as MediaQueryList);
    const focus = vi.fn();
    const scrollIntoView = vi.fn();
    const element = { focus, scrollIntoView } as unknown as HTMLElement;
    vi.stubGlobal("window", { matchMedia });

    revealResult(element);

    expect(matchMedia).toHaveBeenCalledOnce();
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    expect(focus).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(scrollIntoView).toHaveBeenCalledOnce();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior, block: "start" });
    expect(focus.mock.invocationCallOrder[0]).toBeLessThan(
      scrollIntoView.mock.invocationCallOrder[0]
    );
  }
);

describe("decision-record reveal state", () => {
  it("creates one reveal target only after a successful atomic submit", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );

    const submitted = submitCalculatorWorkspace(initial);

    expect(submitted.status).toBe("submitted");
    if (submitted.status !== "submitted") throw new Error("Expected submit");
    expect(submitted.state.record).not.toBeNull();
    expect(submitted.state.focusTarget).toEqual({ kind: "decision-record" });
    expect(initial.record).toBeNull();

    const focusConsumed = calculatorWorkspaceReducer(submitted.state, {
      type: "set-focus-target",
      target: null,
    });
    expect(focusConsumed.record).toBe(submitted.state.record);
    expect(focusConsumed.focusTarget).toBeNull();
  });

  it("preserves the record for selection and clears it for blocked or semantic changes", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const submitted = submitCalculatorWorkspace(initial);
    if (submitted.status !== "submitted") throw new Error("Expected submit");
    const step = submitted.state.draft.alternatives.formalSequential.workflowDesign.steps.find(
      ({ lockedLegalProvenance }) => !lockedLegalProvenance
    );
    if (!step) throw new Error("Expected an editable step");

    const selected = calculatorWorkspaceReducer(submitted.state, {
      type: "select-step",
      alternativeId: "formalSequential",
      stepId: step.id,
    });
    expect(selected.record).toBe(submitted.state.record);

    const edited = calculatorWorkspaceReducer(selected, {
      type: "edit-step-label",
      alternativeId: "formalSequential",
      stepId: step.id,
      userLabel: "Reviewed scope",
    });
    expect(edited.record).toBeNull();
    expect(edited.focusTarget).not.toEqual({ kind: "decision-record" });

    const invalid = calculatorWorkspaceReducer(initial, {
      type: "add-step",
      alternativeId: "formalSequential",
    });
    const blocked = submitCalculatorWorkspace(invalid);
    expect(blocked.status).toBe("blocked");
    expect(blocked.state.record).toBeNull();
    expect(blocked.state.focusTarget).not.toEqual({ kind: "decision-record" });
  });
});
