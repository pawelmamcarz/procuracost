import { describe, expect, it } from "vitest";

import {
  applyLegalContextTransition,
} from "@/components/calculator-v2/legal-transition";
import {
  createCalculatorWorkspaceState,
  type CalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import {
  buildCalculationInputFromDraft,
  buildDecisionRecordV2,
  calculateComparison,
  createScenarioDraft,
  resolveLegalWaits,
  validateProcessMap,
  type AlternativeId,
  type ModelContextV2,
} from "@/lib/model-v2";
import {
  deriveCalculatorWorkspaceValidation,
  submitCalculatorWorkspace,
} from "@/components/calculator-v2/workspace-validation";

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

function privateFleetState(): CalculatorWorkspaceState {
  const state = createCalculatorWorkspaceState(
    createScenarioDraft("fleet_tco_reframing")
  );
  return { ...state, record: buildDecisionRecordV2(state.draft) };
}

function lockedQueueDays(state: CalculatorWorkspaceState, alternativeId: AlternativeId) {
  return state.draft.alternatives[alternativeId].workflowDesign.steps
    .filter((step) => step.lockedLegalProvenance)
    .map((step) => ({ id: step.id, days: step.queueDays.central }));
}

describe("calculator v2 transactional legal transitions", () => {
  it("reconciles an initiation-date change identically in both lanes", () => {
    const initial = publicItState();
    const firstLocked = initial.draft.alternatives.formalSequential.workflowDesign.steps.find(
      (step) => step.lockedLegalProvenance
    );
    if (!firstLocked) throw new Error("Expected a locked legal step");
    firstLocked.userLabel = "Preserved legal label";
    const nextContext: ModelContextV2 = {
      ...initial.draft.context,
      initiatedOn: "2027-02-03",
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
      { id: "legal.pzp_open.standstill", days: 10 },
    ]);
    expect(
      result.state.draft.alternatives.formalSequential.workflowDesign.steps.find(
        ({ id }) => id === firstLocked.id
      )?.userLabel
    ).toBe("Preserved legal label");
    for (const alternativeId of ALTERNATIVES) {
      expect(
        result.state.draft.alternatives[alternativeId].workflowDesign
          .requiredLegalDependencies
      ).toEqual(
        initial.draft.alternatives[alternativeId].workflowDesign
          .requiredLegalDependencies
      );
    }
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

  it("requires a registered scenario when the legal boundary or procedure changes", () => {
    const initial = privateFleetState();
    const differentProcedure: ModelContextV2 = {
      ...initial.draft.context,
      procedureFamilyId: "private_negotiated",
    };

    const result = applyLegalContextTransition(initial, differentProcedure);

    expect(result).toMatchObject({
      status: "rejected",
      state: initial,
      issues: [
        {
          source: "context",
          code: "registered_design_required",
          messageKey: "calculatorV2.validation.registeredDesignRequired",
        },
      ],
    });
    expect(result.state).toBe(initial);
    expect(result.state.record).toBe(initial.record);
  });

  it.each([
    ["purchaseArchetypeId", "complex_service"],
    ["executionChannelId", "catalog_calloff"],
    ["systemSupportId", "manual"],
    ["buyerRegime", "classic"],
    ["procurementObject", "works"],
    ["communicationMethod", "other"],
  ] as const)(
    "requires a registered scenario when %s changes",
    (axis, value) => {
      const initial = privateFleetState();
      const nextContext: ModelContextV2 = {
        ...initial.draft.context,
        [axis]: value,
      };

      const result = applyLegalContextTransition(initial, nextContext);

      expect(result).toMatchObject({
        status: "rejected",
        state: initial,
        issues: [
          {
            source: "context",
            code: "registered_design_required",
            messageKey: "calculatorV2.validation.registeredDesignRequired",
          },
        ],
      });
      expect(result.state).toBe(initial);
      expect(result.state.record).toBe(initial.record);
    }
  );

  it.each([
    ["purchaseArchetypeId", "complex_service"],
    ["executionChannelId", "catalog_calloff"],
    ["systemSupportId", "manual"],
    ["buyerRegime", "classic"],
    ["procurementObject", "works"],
    ["communicationMethod", "other"],
  ] as const)(
    "rejects a post-materialization mutation of registered context field %s",
    (axis, value) => {
      const input = structuredClone(
        buildCalculationInputFromDraft(
          createScenarioDraft("fleet_tco_reframing")
        )
      );
      input.context = { ...input.context, [axis]: value } as ModelContextV2;

      expect(() => calculateComparison(input)).toThrow(
        /registered scenario context/i
      );
    }
  );

  it("materializes a positive engine contract tied to the scenario registry", () => {
    const input = buildCalculationInputFromDraft(
      createScenarioDraft("fleet_tco_reframing")
    );

    expect(input).toMatchObject({
      kind: "materialized_calculation_input",
      registeredScenarioId: "fleet_tco_reframing",
    });
  });

  it.each([
    ["purchaseArchetypeId", "complex_service"],
    ["executionChannelId", "catalog_calloff"],
    ["systemSupportId", "manual"],
    ["buyerRegime", "classic"],
    ["procurementObject", "works"],
    ["communicationMethod", "other"],
  ] as const)(
    "blocks a direct draft mutation of registered context field %s",
    (axis, value) => {
      const draft = createScenarioDraft("fleet_tco_reframing");
      draft.context = { ...draft.context, [axis]: value };
      const state = createCalculatorWorkspaceState(draft);

      expect(() => buildCalculationInputFromDraft(draft)).toThrow(
        /registered scenario context/i
      );
      expect(deriveCalculatorWorkspaceValidation(state)).toMatchObject({
        canSubmit: false,
        issues: [
          expect.objectContaining({
            source: "context",
            code: "registered_design_required",
          }),
        ],
      });
      expect(submitCalculatorWorkspace(state).status).toBe("blocked");
    }
  );

  it("preserves the prior state instead of patching a different registered design", () => {
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
          code: "registered_design_required",
          messageKey: "calculatorV2.validation.registeredDesignRequired",
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
