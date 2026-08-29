import { describe, expect, it } from "vitest";

import {
  CALCULATOR_WORKSPACE_ACTION_TYPES,
  USER_DEFINED_STEP_LABEL_KEY,
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
  visibleStepLabel,
  type CalculatorWorkspaceAction,
  type CalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import {
  buildDecisionRecordV2,
  createScenarioDraft,
  decodeV2CalculatorParams,
  encodeV2CalculatorState,
  stateForScenarioV2,
  type AlternativeId,
  type CalibratedValue,
  type ProcessMapStep,
  type ScenarioDraft,
} from "@/lib/model-v2";

function firstEditableStep(
  draft: ScenarioDraft,
  alternativeId: AlternativeId = "formalSequential"
): ProcessMapStep {
  const step = draft.alternatives[alternativeId].workflowDesign.steps.find(
    (candidate) => !candidate.lockedLegalProvenance
  );
  if (!step) throw new Error("Expected an editable step");
  return step;
}

function withRecord(
  state: CalculatorWorkspaceState
): CalculatorWorkspaceState {
  const gate = state.urlGate?.kind === "v2_url" ? state.urlGate : undefined;
  return { ...state, record: buildDecisionRecordV2(state.draft, gate) };
}

function userRange(value: number): CalibratedValue {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed",
    evidenceClass: "user_input",
    evidenceIds: [],
  };
}

describe("calculator v2 editor state", () => {
  it("keeps selection and focus actions non-semantic", () => {
    const initial = withRecord(
      createCalculatorWorkspaceState(
        createScenarioDraft("fleet_tco_reframing")
      )
    );
    const beforeDraft = structuredClone(initial.draft);
    const step = firstEditableStep(initial.draft, "adaptiveCompliant");

    const selected = calculatorWorkspaceReducer(initial, {
      type: "select-step",
      alternativeId: "adaptiveCompliant",
      stepId: step.id,
    });
    const focused = calculatorWorkspaceReducer(selected, {
      type: "set-focus-target",
      target: {
        kind: "step-node",
        alternativeId: "adaptiveCompliant",
        stepId: step.id,
      },
    });

    expect(focused.draft).toEqual(beforeDraft);
    expect(focused.record).toBe(initial.record);
    expect(focused.undo).toBeNull();
    expect(focused.selectedAlternative).toBe("adaptiveCompliant");
    expect(focused.selectedStepId).toBe(step.id);
  });

  it("clears a current record atomically for every accepted semantic source edit", () => {
    const base = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const step = firstEditableStep(base.draft);
    const v2Result = decodeV2CalculatorParams(
      encodeV2CalculatorState(stateForScenarioV2("fleet_tco_reframing"))
    );
    const alternatives = structuredClone(base.draft.alternatives);
    alternatives.formalSequential.workflowDesign.steps[0].userLabel =
      "Context-accepted edit";
    const changedEconomics = structuredClone(base.draft.economicAssumptions);
    changedEconomics.contractValue = userRange(123456);
    const changedDraft = createScenarioDraft("erp_transformation_discovery");
    const actions: CalculatorWorkspaceAction[] = [
      {
        type: "edit-step-label",
        alternativeId: "formalSequential",
        stepId: step.id,
        userLabel: "Local label",
      },
      {
        type: "edit-step-kind",
        alternativeId: "formalSequential",
        stepId: step.id,
        kind: step.kind === "activity" ? "approval" : "activity",
      },
      {
        type: "edit-step-predecessors",
        alternativeId: "formalSequential",
        stepId: step.id,
        predecessorIds: [],
      },
      {
        type: "edit-step-range",
        alternativeId: "formalSequential",
        stepId: step.id,
        field: { kind: "activeDays" },
        value: userRange(2),
      },
      {
        type: "replace-economic-assumptions",
        economicAssumptions: changedEconomics,
      },
      {
        type: "edit-role-hourly-rate",
        roleId: "buyer",
        value: userRange(200),
      },
      {
        type: "accept-legal-context",
        context: structuredClone(base.draft.context),
        alternatives,
      },
      {
        type: "replace-draft",
        draft: changedDraft,
        urlOrigin: "empty",
        urlGate: undefined,
        migration: null,
      },
      {
        type: "set-url-source",
        urlOrigin: "v2",
        urlGate: { kind: "v2_url", result: v2Result },
        migration: null,
      },
    ];

    for (const action of actions) {
      const next = calculatorWorkspaceReducer(withRecord(base), action);
      expect(next.record, action.type).toBeNull();
    }
  });

  it("adds text-independent collision-free custom steps with a required blank label", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const selected = firstEditableStep(initial.draft);
    const selectedState = calculatorWorkspaceReducer(initial, {
      type: "select-step",
      alternativeId: "formalSequential",
      stepId: selected.id,
    });

    const first = calculatorWorkspaceReducer(selectedState, {
      type: "add-step",
      alternativeId: "formalSequential",
    });
    const second = calculatorWorkspaceReducer(first, {
      type: "add-step",
      alternativeId: "formalSequential",
    });
    const firstAdded = first.draft.alternatives.formalSequential.workflowDesign.steps.find(
      (step) => step.id === first.selectedStepId
    );
    const secondAdded = second.draft.alternatives.formalSequential.workflowDesign.steps.find(
      (step) => step.id === second.selectedStepId
    );

    expect(firstAdded).toMatchObject({
      labelKey: USER_DEFINED_STEP_LABEL_KEY,
      userLabel: "",
      predecessorIds: [selected.id],
      kind: "activity",
    });
    expect(firstAdded?.id).toMatch(/^user-step-\d+$/);
    expect(secondAdded?.id).toMatch(/^user-step-\d+$/);
    expect(secondAdded?.id).not.toBe(firstAdded?.id);
    expect(secondAdded?.id).not.toContain("label");
    expect(first.focusTarget).toEqual({
      kind: "step-label",
      alternativeId: "formalSequential",
      stepId: firstAdded?.id,
    });
    expect(first.locallyEdited).toEqual({
      formalSequential: true,
      adaptiveCompliant: false,
    });
  });

  it("uses the final editable step as the deterministic predecessor without a selection", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("public_it_open_with_market_consultation")
    );
    const editable = initial.draft.alternatives.adaptiveCompliant.workflowDesign.steps.filter(
      (step) => !step.lockedLegalProvenance
    );
    const finalEditable = editable.at(-1);
    if (!finalEditable) throw new Error("Expected an editable step");

    const next = calculatorWorkspaceReducer(initial, {
      type: "add-step",
      alternativeId: "adaptiveCompliant",
    });
    const added = next.draft.alternatives.adaptiveCompliant.workflowDesign.steps.find(
      (step) => step.id === next.selectedStepId
    );

    expect(added?.predecessorIds).toEqual([finalEditable.id]);
  });

  it("preserves user labels through later edits, undo, and decision-record creation", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const step = firstEditableStep(initial.draft);
    const labelled = calculatorWorkspaceReducer(initial, {
      type: "edit-step-label",
      alternativeId: "formalSequential",
      stepId: step.id,
      userLabel: "Commercial review",
    });
    const editedAgain = calculatorWorkspaceReducer(labelled, {
      type: "edit-step-range",
      alternativeId: "formalSequential",
      stepId: step.id,
      field: { kind: "queueDays" },
      value: userRange(1),
    });
    const undone = calculatorWorkspaceReducer(editedAgain, { type: "undo" });

    expect(
      firstEditableStep(undone.draft).userLabel
    ).toBe("Commercial review");
    const gate = undone.urlGate?.kind === "v2_url" ? undone.urlGate : undefined;
    const record = buildDecisionRecordV2(undone.draft, gate);
    expect(
      record.alternatives.formalSequential.workflow.steps.find(
        (candidate) => candidate.id === step.id
      )?.userLabel
    ).toBe("Commercial review");
  });

  it("falls back to labelKey translation after an existing user label is cleared", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const step = firstEditableStep(initial.draft);
    step.userLabel = "Temporary label";
    const cleared = calculatorWorkspaceReducer(initial, {
      type: "edit-step-label",
      alternativeId: "formalSequential",
      stepId: step.id,
      userLabel: "   ",
    });
    const clearedStep = firstEditableStep(cleared.draft);

    expect(visibleStepLabel(clearedStep, (key) => `translated:${key}`)).toBe(
      `translated:${step.labelKey}`
    );
  });

  it.each([
    {
      type: "edit-step-label",
      userLabel: "Changed",
    },
    {
      type: "edit-step-kind",
      kind: "activity",
    },
    {
      type: "edit-step-predecessors",
      predecessorIds: [],
    },
    {
      type: "edit-step-range",
      field: { kind: "activeDays" },
      value: userRange(1),
    },
    { type: "remove-step" },
  ] as const)("rejects $type against a locked legal step", (partialAction) => {
    const initial = withRecord(
      createCalculatorWorkspaceState(
        createScenarioDraft("public_it_open_with_market_consultation")
      )
    );
    const locked = initial.draft.alternatives.formalSequential.workflowDesign.steps.find(
      (step) => step.lockedLegalProvenance
    );
    if (!locked) throw new Error("Expected a locked step");
    const action = {
      ...partialAction,
      alternativeId: "formalSequential",
      stepId: locked.id,
    } as CalculatorWorkspaceAction;

    const next = calculatorWorkspaceReducer(initial, action);

    expect(next.draft).toEqual(initial.draft);
    expect(next.record).toBe(initial.record);
    expect(next.undo).toBe(initial.undo);
    expect(next.issues).toContainEqual(
      expect.objectContaining({
        source: "editor",
        code: "locked_step",
        alternativeId: "formalSequential",
        stepId: locked.id,
      })
    );
  });

  it.each([
    ["descending range", { ...userRange(1), low: 2 }],
    ["negative range", { ...userRange(0), low: -1 }],
    ["non-fixed fixed range", { ...userRange(1), high: 2 }],
  ] as const)("rejects an invalid calibrated %s without invalidating the record", (_label, value) => {
    const initial = withRecord(
      createCalculatorWorkspaceState(
        createScenarioDraft("fleet_tco_reframing")
      )
    );
    const step = firstEditableStep(initial.draft);

    const next = calculatorWorkspaceReducer(initial, {
      type: "edit-step-range",
      alternativeId: "formalSequential",
      stepId: step.id,
      field: { kind: "nonLabourCost" },
      value,
    });

    expect(next.draft).toEqual(initial.draft);
    expect(next.record).toBe(initial.record);
    expect(next.issues).toContainEqual(
      expect.objectContaining({
        source: "editor",
        code: "invalid_calibrated_range",
        stepId: step.id,
        field: "nonLabourCost",
      })
    );
  });

  it.each(["legal_wait", "runtime_unknown"])(
    "rejects runtime step kind %s as user-editable",
    (kind) => {
      const initial = createCalculatorWorkspaceState(
        createScenarioDraft("fleet_tco_reframing")
      );
      const step = firstEditableStep(initial.draft);

      const next = calculatorWorkspaceReducer(initial, {
        type: "edit-step-kind",
        alternativeId: "formalSequential",
        stepId: step.id,
        kind,
      } as unknown as CalculatorWorkspaceAction);

      expect(next.draft).toEqual(initial.draft);
      expect(next.issues).toContainEqual(
        expect.objectContaining({
          source: "editor",
          code: "invalid_step_kind",
          stepId: step.id,
        })
      );
    }
  );

  it("does not expose a drag-only command", () => {
    expect(CALCULATOR_WORKSPACE_ACTION_TYPES).not.toContain("drag-step");
    expect(CALCULATOR_WORKSPACE_ACTION_TYPES).not.toContain("drop-step");
    expect(CALCULATOR_WORKSPACE_ACTION_TYPES).not.toContain("reorder-step");
  });
});
