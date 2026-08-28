import { describe, expect, it } from "vitest";

import {
  buildCalculationInputFromDraft,
  type CalculationInputGateV2,
} from "@/lib/model-v2/calculation-input";
import { decodeV2CalculatorParams } from "@/lib/model-v2/calculator-url";
import {
  CONTRACT_DESIGN_REGISTRY,
  WORKFLOW_DESIGN_REGISTRY,
  reconcileAlternativeLegalWaits,
  resolveContractDesign,
  resolveWorkflowDesign,
} from "@/lib/model-v2/design-registry";
import { calculateComparison } from "@/lib/model-v2/engine";
import { migrateLegacyCalculatorParams } from "@/lib/model-v2/legacy-migration";
import {
  SCENARIO_V2_IDS,
  SCENARIOS_V2,
  createScenarioDraft,
} from "@/lib/model-v2/scenarios";

function competitionCost(
  input: ReturnType<typeof buildCalculationInputFromDraft>,
  alternative: "formalSequential" | "adaptiveCompliant"
) {
  const dimension = input.alternatives[alternative].contractDesign.dimensions.find(
    ({ id }) => id === "competition_transfer"
  );
  if (!dimension || dimension.status !== "monetized") {
    throw new Error("Fixture requires a monetized competition dimension");
  }
  return dimension.cost;
}

describe("model 2.3 draft calculation materialisation", () => {
  it("rebuilds edited daily and competition economics without mutating registry or sibling drafts", () => {
    const sourceBefore = JSON.stringify(SCENARIOS_V2);
    const draft = createScenarioDraft("fleet_tco_reframing");
    const sibling = createScenarioDraft("fleet_tco_reframing");
    const siblingBefore = JSON.stringify(sibling);

    draft.economicAssumptions.contractValue = {
      low: 2_000_000,
      central: 4_000_000,
      high: 8_000_000,
      rangeKind: "stress",
      evidenceClass: "user_input",
      evidenceIds: ["user.contract-value"],
    };
    draft.economicAssumptions.competitionTransferRate = {
      low: 0.02,
      central: 0.06,
      high: 0.09,
      rangeKind: "stress",
      evidenceClass: "empirical_anchor",
      evidenceIds: ["szucs_discretion_price_2024"],
    };
    draft.economicAssumptions.dailyCostOfInaction = {
      low: 1_250,
      central: 5_000,
      high: 20_000,
      rangeKind: "stress",
      evidenceClass: "user_input",
      evidenceIds: ["user.daily-cost"],
    };
    draft.dailyCostOfInaction = {
      low: 0,
      central: 0,
      high: 0,
      rangeKind: "fixed",
      evidenceClass: "user_input",
      evidenceIds: ["stale.materialised-value"],
    };

    const input = buildCalculationInputFromDraft(draft);

    expect(input.dailyCostOfInaction).toEqual({
      low: 1_250,
      central: 5_000,
      high: 20_000,
      rangeKind: "stress",
      evidenceClass: "user_input",
      evidenceIds: ["user.daily-cost"],
    });
    expect(input.dailyCostOfInaction).not.toBe(
      draft.economicAssumptions.dailyCostOfInaction
    );
    expect(competitionCost(input, "formalSequential")).toMatchObject({
      low: 0,
      central: 0,
      high: 0,
    });
    expect(competitionCost(input, "adaptiveCompliant")).toEqual({
      low: 40_000,
      central: 240_000,
      high: 720_000,
      rangeKind: "stress",
      evidenceClass: "empirical_anchor",
      evidenceIds: ["szucs_discretion_price_2024"],
    });
    expect(JSON.stringify(SCENARIOS_V2)).toBe(sourceBefore);
    expect(JSON.stringify(sibling)).toBe(siblingBefore);
  });

  it("keeps bypass non-monetised and accepts only fixed legal waits", () => {
    const draft = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    const input = buildCalculationInputFromDraft(draft);

    for (const alternative of [
      "formalSequential",
      "adaptiveCompliant",
    ] as const) {
      expect(
        input.alternatives[alternative].contractDesign.dimensions.find(
          ({ id }) => id === "informal_bypass"
        )
      ).toEqual({
        id: "informal_bypass",
        status: "notMonetized",
        reasonKey: "reasons.bypassNotMonetized",
        evidenceIds: [],
      });
    }

    const legalSteps = (alternative: "formalSequential" | "adaptiveCompliant") =>
      input.alternatives[alternative].workflowDesign.steps
        .filter(({ kind }) => kind === "legal_wait")
        .map(({ id, activeDays, queueDays, lockedLegalProvenance }) => ({
          id,
          activeDays,
          queueDays,
          lockedLegalProvenance,
        }));
    expect(legalSteps("formalSequential")).toEqual(
      legalSteps("adaptiveCompliant")
    );

    const edited = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    const wait = edited.alternatives.formalSequential.workflowDesign.steps.find(
      ({ kind }) => kind === "legal_wait"
    )!;
    wait.queueDays = { ...wait.queueDays, low: 34, central: 34, high: 34 };
    expect(() => buildCalculationInputFromDraft(edited)).toThrow(
      /locked legal wait/i
    );
  });

  it("blocks invalid URL state and unconfirmed or ambiguous legacy migration", () => {
    const draft = createScenarioDraft("erp_transformation_discovery");
    const invalidV2 = decodeV2CalculatorParams(
      new URLSearchParams({ sv: "2", sid: "unknown" })
    );
    const partial = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const ambiguous = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "not-registered" })
    );

    expect(() =>
      buildCalculationInputFromDraft(draft, {
        kind: "v2_url",
        result: invalidV2,
      })
    ).toThrow(/URL.*blocked/i);
    expect(() =>
      buildCalculationInputFromDraft(draft, {
        kind: "legacy_migration",
        result: partial,
        confirmed: false,
      })
    ).toThrow(/confirmation/i);
    expect(() =>
      buildCalculationInputFromDraft(draft, {
        kind: "legacy_migration",
        result: ambiguous,
        confirmed: true,
      } as CalculationInputGateV2)
    ).toThrow(/ambiguous/i);
  });

  it("rejects unsupported fixed metadata and non-zero amendment or TCO semantics", () => {
    const badMetadata = createScenarioDraft("fleet_tco_reframing");
    (badMetadata.context as { modelVersion: string }).modelVersion = "2.3.1";
    expect(() => buildCalculationInputFromDraft(badMetadata)).toThrow(
      /modelVersion/i
    );

    for (const dimensionId of ["contract_amendment", "tco"] as const) {
      const draft = createScenarioDraft("fleet_tco_reframing");
      const dimension =
        draft.alternatives.formalSequential.contractDesign.dimensions.find(
          ({ id }) => id === dimensionId
        )!;
      if (dimension.status !== "monetized") {
        throw new Error("Fixture requires a monetized dimension");
      }
      dimension.cost = {
        ...dimension.cost,
        low: 1,
        central: 1,
        high: 1,
      };

      expect(() => buildCalculationInputFromDraft(draft)).toThrow(
        new RegExp(`${dimensionId}.*allocation`, "i")
      );
    }
  });

  it("remains sign-neutral when the materialised alternatives are swapped", () => {
    const input = buildCalculationInputFromDraft(
      createScenarioDraft("fleet_tco_reframing")
    );
    const original = calculateComparison(input);
    const swapped = calculateComparison({
      ...input,
      alternatives: {
        formalSequential: input.alternatives.adaptiveCompliant,
        adaptiveCompliant: input.alternatives.formalSequential,
      },
    });

    expect(swapped.deltaCost).toBe(-original.deltaCost);
    expect(swapped.deltaCostOuterEnvelope).toEqual({
      low: -original.deltaCostOuterEnvelope.high,
      high: -original.deltaCostOuterEnvelope.low,
    });
  });
});

describe("model 2.3 design-domain prerequisites", () => {
  it("resolves every typed scenario design ID as an isolated compatible clone", () => {
    expect(WORKFLOW_DESIGN_REGISTRY).toHaveLength(20);
    expect(CONTRACT_DESIGN_REGISTRY).toHaveLength(20);

    for (const scenarioId of SCENARIO_V2_IDS) {
      const scenario = SCENARIOS_V2.find(({ id }) => id === scenarioId)!;
      for (const alternative of [
        "formalSequential",
        "adaptiveCompliant",
      ] as const) {
        const workflow = resolveWorkflowDesign(
          scenario.designIds.workflow[alternative],
          scenarioId,
          alternative
        );
        const contract = resolveContractDesign(
          scenario.designIds.contract[alternative],
          scenarioId,
          alternative
        );

        expect(workflow).toEqual(
          scenario.calculationInput.alternatives[alternative].workflowDesign
        );
        expect(contract).toEqual(
          scenario.calculationInput.alternatives[alternative].contractDesign
        );
        expect(workflow).not.toBe(
          scenario.calculationInput.alternatives[alternative].workflowDesign
        );
        expect(contract).not.toBe(
          scenario.calculationInput.alternatives[alternative].contractDesign
        );
      }
    }
  });

  it("fails explicitly instead of coercing a cross-scenario or cross-alternative design", () => {
    const scenario = SCENARIOS_V2[0];

    expect(() =>
      resolveWorkflowDesign(
        scenario.designIds.workflow.formalSequential,
        "erp_transformation_discovery",
        "formalSequential"
      )
    ).toThrow(/incompatible.*scenario/i);
    expect(() =>
      resolveContractDesign(
        scenario.designIds.contract.formalSequential,
        scenario.id,
        "adaptiveCompliant"
      )
    ).toThrow(/incompatible.*alternative/i);
    expect(() =>
      resolveWorkflowDesign(
        "unknown.workflow.formalSequential" as typeof scenario.designIds.workflow.formalSequential,
        scenario.id,
        "formalSequential"
      )
    ).toThrow(/unknown.*workflow design/i);
  });

  it("preserves an optional user-authored step label through draft materialisation", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    const step = draft.alternatives.formalSequential.workflowDesign.steps[0];
    step.userLabel = "Review, risk and scope";

    const input = buildCalculationInputFromDraft(draft);
    const materializedStep =
      input.alternatives.formalSequential.workflowDesign.steps[0];

    expect(materializedStep.labelKey).toBe(step.labelKey);
    expect(materializedStep.userLabel).toBe("Review, risk and scope");
    materializedStep.userLabel = "Changed returned clone";
    expect(step.userLabel).toBe("Review, risk and scope");
  });

  it("reconciles changed legal values identically and rejects a different lock shape", () => {
    const draft = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    const sourceBefore = JSON.stringify(draft.alternatives);
    const changedContext = {
      ...draft.context,
      communicationMethod: "other" as const,
    };
    const alternatives = reconcileAlternativeLegalWaits(
      draft.alternatives,
      changedContext
    );

    const waitDays = (alternative: "formalSequential" | "adaptiveCompliant") =>
      alternatives[alternative].workflowDesign.steps
        .filter(({ kind }) => kind === "legal_wait")
        .map(({ queueDays }) => queueDays.central);
    expect(waitDays("formalSequential")).toEqual([35, 15]);
    expect(waitDays("adaptiveCompliant")).toEqual([35, 15]);
    expect(JSON.stringify(draft.alternatives)).toBe(sourceBefore);

    draft.context = changedContext;
    draft.alternatives = alternatives;
    expect(() => buildCalculationInputFromDraft(draft)).not.toThrow();

    expect(() =>
      reconcileAlternativeLegalWaits(alternatives, {
        ...changedContext,
        procedureFamilyId: "pzp_restricted",
      })
    ).toThrow(/incompatible.*locked legal wait/i);
  });
});
