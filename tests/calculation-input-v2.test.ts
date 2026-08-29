import { describe, expect, it } from "vitest";

import {
  buildCalculationInputFromDraft as buildNativeCalculationInputFromDraft,
} from "@/lib/model-v2/calculation-input";
import { decodeV2CalculatorParams } from "@/lib/model-v2/calculator-url";
import {
  CONTRACT_DESIGN_REGISTRY,
  WORKFLOW_DESIGN_REGISTRY,
  reconcileAlternativeLegalWaits,
  resolveContractDesign,
  resolveWorkflowDesign,
} from "@/lib/model-v2/design-registry";
import {
  calculateComparison,
  type ComparisonCalculationInput,
} from "@/lib/model-v2/engine";
import {
  buildCalculationInputFromLegacyMigration,
  type CalculationInputGateV2,
} from "@/lib/model-v2/legacy-adapter";
import { migrateLegacyCalculatorParams } from "@/lib/model-v2/legacy-migration";
import {
  createScenarioDraftFromLegacyMigration,
  type LegacyMigrationDraftReady,
} from "@/lib/model-v2/legacy-migration-draft";
import {
  SCENARIO_V2_IDS,
  SCENARIOS_V2,
  createScenarioDraft,
  type ScenarioDraft,
} from "@/lib/model-v2/scenarios";

function buildCalculationInputFromDraft(
  draft: ScenarioDraft,
  gate?: unknown
): ComparisonCalculationInput {
  if (
    gate &&
    typeof gate === "object" &&
    (gate as { kind?: unknown }).kind === "legacy_migration"
  ) {
    return (
      buildCalculationInputFromLegacyMigration as unknown as (
        source: ScenarioDraft,
        sourceGate: unknown
      ) => ComparisonCalculationInput
    )(draft, gate);
  }
  return (
    buildNativeCalculationInputFromDraft as unknown as (
      source: ScenarioDraft,
      sourceGate?: unknown
    ) => ComparisonCalculationInput
  )(draft, gate);
}

function userFixed(value: number, evidenceIds: string[] = []) {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed" as const,
    evidenceClass: "user_input" as const,
    evidenceIds,
  };
}

function confirmedPartialMigration(): LegacyMigrationDraftReady {
  const migration = migrateLegacyCalculatorParams(
    new URLSearchParams({ sid: "erp" })
  );
  const adapted = createScenarioDraftFromLegacyMigration(migration, true);
  if (adapted.status !== "ready") {
    throw new Error("Expected a confirmed partial migration fixture");
  }
  return adapted;
}

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

  it("accepts a confirmed partial migration edit and materialises the edited value", () => {
    const adapted = confirmedPartialMigration();
    const draft = structuredClone(adapted.draft);
    draft.economicAssumptions.contractValue = userFixed(
      4_200_000,
      ["user.contract-value"]
    );

    const input = buildCalculationInputFromDraft(draft, adapted.gate);

    expect(competitionCost(input, "adaptiveCompliant").central).toBe(252_000);
  });

  it("requires primitive confirmation and the original unmodified adapter audit", () => {
    const adapted = confirmedPartialMigration();
    const runtimeGate = structuredClone(adapted.gate) as unknown as Record<
      string,
      unknown
    >;
    runtimeGate.confirmed = 1;
    expect(() =>
      buildCalculationInputFromDraft(
        adapted.draft,
        runtimeGate as unknown as CalculationInputGateV2
      )
    ).toThrow(/confirmation/i);

    const forgedAudit = structuredClone(adapted.gate);
    forgedAudit.audit.retainedLegacyInputs.contractValue += 1;
    expect(() =>
      buildCalculationInputFromDraft(adapted.draft, forgedAudit)
    ).toThrow(/audit.*retained inputs/i);
  });

  it.each([
    ["source schema", (result: Record<string, unknown>) => {
      result.sourceSchemaVersion = "runtime-forged";
    }],
    ["readiness", (result: Record<string, unknown>) => {
      result.readinessInferred = true;
    }],
    ["calculation status", (result: Record<string, unknown>) => {
      result.canCalculate = true;
    }],
    ["confirmation fields", (result: Record<string, unknown>) => {
      result.fieldsRequiringConfirmation = [];
    }],
    ["validation errors", (result: Record<string, unknown>) => {
      result.validationErrors = [];
    }],
  ] as const)("rejects forged partial-migration %s invariants", (_label, mutate) => {
    const adapted = confirmedPartialMigration();
    mutate(adapted.gate.result as unknown as Record<string, unknown>);

    expect(() =>
      buildCalculationInputFromDraft(adapted.draft, adapted.gate)
    ).toThrow(/legacy migration|canonical|invariant/i);
  });

  it.each([
    [
      "gate root",
      (adapted: LegacyMigrationDraftReady) => {
        (adapted.gate as unknown as Record<string, unknown>).postMigrationEdits = [];
      },
    ],
    [
      "migration result",
      (adapted: LegacyMigrationDraftReady) => {
        (adapted.gate.result as unknown as Record<string, unknown>).postMigrationEdits = [];
      },
    ],
    [
      "migration audit",
      (adapted: LegacyMigrationDraftReady) => {
        (adapted.gate.audit as unknown as Record<string, unknown>).postMigrationEdits = [];
      },
    ],
  ] as const)("rejects a caller-added postMigrationEdits list at the %s", (_label, mutate) => {
    const adapted = confirmedPartialMigration();
    mutate(adapted);

    expect(() =>
      buildCalculationInputFromDraft(adapted.draft, adapted.gate)
    ).toThrow(/legacy migration|canonical|audit/i);
  });

  it("rejects an edited value that retains imported evidence provenance", () => {
    const adapted = confirmedPartialMigration();
    const draft = structuredClone(adapted.draft);
    draft.economicAssumptions.contractValue = userFixed(4_200_000, [
      "legacy-v1.erp.retainedLegacyInputs.contractValue",
    ]);

    expect(() =>
      buildCalculationInputFromDraft(draft, adapted.gate)
    ).toThrow(/evidence|user/i);
  });

  it.each(["empirical_anchor", "official_case", "legal_rule"] as const)(
    "rejects an edited materialised value claiming %s provenance",
    (evidenceClass) => {
      const adapted = confirmedPartialMigration();
      const draft = structuredClone(adapted.draft);
      draft.economicAssumptions.contractValue = {
        ...userFixed(4_200_000),
        evidenceClass,
      };

      expect(() =>
        buildCalculationInputFromDraft(draft, adapted.gate)
      ).toThrow(/evidence|user_input/i);
    }
  );

  it("rejects an edited user input that cites a registry evidence identifier", () => {
    const adapted = confirmedPartialMigration();
    const draft = structuredClone(adapted.draft);
    draft.economicAssumptions.contractValue = userFixed(4_200_000, [
      "szucs_discretion_price_2024",
    ]);

    expect(() =>
      buildCalculationInputFromDraft(draft, adapted.gate)
    ).toThrow(/evidence|user/i);
  });

  it("rejects divergent submitted daily-cost mirrors", () => {
    const adapted = confirmedPartialMigration();
    const draft = structuredClone(adapted.draft);
    draft.economicAssumptions.dailyCostOfInaction = userFixed(1_001);
    draft.dailyCostOfInaction = userFixed(1_002);

    expect(() =>
      buildCalculationInputFromDraft(draft, adapted.gate)
    ).toThrow(/daily.*mirror|dailyCostOfInaction/i);
  });

  it("rejects a partial migration draft missing one materialised role rate", () => {
    const adapted = confirmedPartialMigration();
    const draft = structuredClone(adapted.draft);
    delete draft.roleHourlyRates.executive;

    expect(() =>
      buildCalculationInputFromDraft(draft, adapted.gate)
    ).toThrow(/roleHourlyRates\.executive|role rate|materialised/i);
  });

  it("rejects an invalid negative edited calibrated range", () => {
    const adapted = confirmedPartialMigration();
    const draft = structuredClone(adapted.draft);
    draft.roleHourlyRates.buyer = userFixed(-1);

    expect(() =>
      buildCalculationInputFromDraft(draft, adapted.gate)
    ).toThrow(/negative|calibrated|range/i);
  });

  it("rejects an unknown runtime range kind and additional calibrated-value fields", () => {
    const unknownRange = confirmedPartialMigration();
    const unknownRangeDraft = structuredClone(unknownRange.draft);
    (
      unknownRangeDraft.economicAssumptions.contractValue as unknown as Record<
        string,
        unknown
      >
    ).rangeKind = "runtime_unknown";
    unknownRangeDraft.economicAssumptions.contractValue.low = 4_200_000;
    unknownRangeDraft.economicAssumptions.contractValue.central = 4_200_000;
    unknownRangeDraft.economicAssumptions.contractValue.high = 4_200_000;
    unknownRangeDraft.economicAssumptions.contractValue.evidenceIds = [
      "user.contract-value",
    ];

    expect(() =>
      buildCalculationInputFromDraft(unknownRangeDraft, unknownRange.gate)
    ).toThrow(/rangeKind|canonical|calibrated/i);

    const additionalField = confirmedPartialMigration();
    const additionalFieldDraft = structuredClone(additionalField.draft);
    additionalFieldDraft.economicAssumptions.contractValue = userFixed(
      4_200_000,
      ["user.contract-value"]
    );
    (
      additionalFieldDraft.economicAssumptions
        .contractValue as unknown as Record<string, unknown>
    ).postMigrationEdits = [{ caller: "forged" }];

    expect(() =>
      buildCalculationInputFromDraft(additionalFieldDraft, additionalField.gate)
    ).toThrow(/canonical|calibrated|postMigrationEdits/i);
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
