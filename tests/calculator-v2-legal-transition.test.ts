import { describe, expect, it } from "vitest";

import {
  applyLegalContextTransition,
} from "@/components/calculator-v2/legal-transition";
import {
  createCalculatorWorkspaceState,
  type CalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import {
  buildDecisionRecordV2,
  createScenarioDraft,
  resolveLegalWaits,
  validateProcessMap,
  type AlternativeId,
  type ModelContextV2,
} from "@/lib/model-v2";

const ALTERNATIVES: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

function publicItState(): CalculatorWorkspaceState {
  const state = createCalculatorWorkspaceState(
    createScenarioDraft("public_it_open_with_market_consultation")
  );
  return { ...state, record: buildDecisionRecordV2(state.draft) };
}

function lockedQueueDays(state: CalculatorWorkspaceState, alternativeId: AlternativeId) {
  return state.draft.alternatives[alternativeId].workflowDesign.steps
    .filter((step) => step.lockedLegalProvenance)
    .map((step) => ({ id: step.id, days: step.queueDays.central }));
}

describe("calculator v2 transactional legal transitions", () => {
  it("reconciles same-shape date and communication changes identically in both lanes", () => {
    const initial = publicItState();
    const firstLocked = initial.draft.alternatives.formalSequential.workflowDesign.steps.find(
      (step) => step.lockedLegalProvenance
    );
    if (!firstLocked) throw new Error("Expected a locked legal step");
    firstLocked.userLabel = "Preserved legal label";
    const nextContext: ModelContextV2 = {
      ...initial.draft.context,
      initiatedOn: "2027-02-03",
      communicationMethod: "other",
    };

    const result = applyLegalContextTransition(initial, nextContext);

    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") throw new Error("Expected acceptance");
    expect(result.state).not.toBe(initial);
    expect(result.state.draft).not.toBe(initial.draft);
    expect(result.state.draft.context).toEqual(nextContext);
    expect(lockedQueueDays(result.state, "formalSequential")).toEqual(
      lockedQueueDays(result.state, "adaptiveCompliant")
    );
    expect(lockedQueueDays(result.state, "formalSequential")).toEqual([
      { id: "legal.pzp_open.bid_submission", days: 35 },
      { id: "legal.pzp_open.standstill", days: 15 },
    ]);
    expect(
      result.state.draft.alternatives.formalSequential.workflowDesign.steps.find(
        ({ id }) => id === firstLocked.id
      )?.userLabel
    ).toBe("Preserved legal label");
  });

  it("preserves the prior state and returns a typed issue for an illegal context", () => {
    const initial = publicItState();
    const illegal: ModelContextV2 = {
      ...initial.draft.context,
      boundaryId: "private_policy",
      procedureFamilyId: "pzp_open",
    };

    const result = applyLegalContextTransition(initial, illegal);

    expect(result).toMatchObject({
      status: "rejected",
      state: initial,
      issues: [
        {
          source: "context",
          code: "illegal_context",
          messageKey: "calculatorV2.validation.illegalContext",
        },
      ],
    });
    expect(result.state).toBe(initial);
    expect(result.state.record).toBe(initial.record);
  });

  it("preserves the prior state instead of patching a different locked-wait shape", () => {
    const initial = publicItState();
    const differentShape: ModelContextV2 = {
      ...initial.draft.context,
      procedureFamilyId: "pzp_restricted",
    };

    const result = applyLegalContextTransition(initial, differentShape);

    expect(result).toMatchObject({
      status: "rejected",
      state: initial,
      issues: [
        {
          source: "context",
          code: "incompatible_locked_wait_shape",
          messageKey: "calculatorV2.validation.incompatibleLockedWaitShape",
        },
      ],
    });
    expect(result.state).toBe(initial);
    expect(lockedQueueDays(result.state, "formalSequential")).toEqual([
      { id: "legal.pzp_open.bid_submission", days: 35 },
      { id: "legal.pzp_open.standstill", days: 10 },
    ]);
  });

  it("clears the record and validates both accepted maps against one resolved wait set", () => {
    const initial = publicItState();
    const nextContext: ModelContextV2 = {
      ...initial.draft.context,
      initiatedOn: "2026-11-19",
    };

    const result = applyLegalContextTransition(initial, nextContext);

    expect(result.status).toBe("accepted");
    if (result.status !== "accepted") throw new Error("Expected acceptance");
    expect(result.state.record).toBeNull();
    expect(result.legalWaits).toEqual(resolveLegalWaits(nextContext));
    for (const alternativeId of ALTERNATIVES) {
      const workflow =
        result.state.draft.alternatives[alternativeId].workflowDesign;
      expect(result.validation[alternativeId]).toEqual([]);
      expect(validateProcessMap(workflow, result.legalWaits)).toEqual([]);
    }
  });
});
