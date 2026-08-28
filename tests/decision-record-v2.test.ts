import { describe, expect, it } from "vitest";

import { buildCalculationInputFromDraft } from "@/lib/model-v2/calculation-input";
import {
  buildDecisionRecordV2,
  migrationMetadataFromCalculationGate,
} from "@/lib/model-v2/decision-record";
import { calculateComparison } from "@/lib/model-v2/engine";
import { migrateLegacyCalculatorParams } from "@/lib/model-v2/legacy-migration";
import { createScenarioDraftFromLegacyMigration } from "@/lib/model-v2/legacy-migration-draft";
import {
  createScenarioDraft,
  scenarioV2ById,
  type ScenarioV2Id,
} from "@/lib/model-v2/scenarios";

function recordFor(scenarioId: ScenarioV2Id) {
  const scenario = scenarioV2ById(scenarioId)!;
  const draft = createScenarioDraft(scenarioId);
  const calculationInput = buildCalculationInputFromDraft(draft);
  const calculationResult = calculateComparison(calculationInput);
  return {
    scenario,
    draft,
    calculationInput,
    calculationResult,
    record: buildDecisionRecordV2(draft),
  };
}

function allKeys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(allKeys);
  return Object.entries(value).flatMap(([key, child]) => [key, ...allKeys(child)]);
}

describe("model 2.3 neutral decision record", () => {
  it("serialises exact metadata, ordered axes, independent designs and engine-owned results", () => {
    const {
      draft,
      calculationResult,
      record,
    } = recordFor("fleet_tco_reframing");

    expect(record.metadata).toEqual({
      schemaVersion: 2,
      modelVersion: "2.3.0",
      calibrationId: "source-scenario-2026-08-28",
      legalRulesetId: "pl-pzp-2026-2027",
      scenarioId: "fleet_tco_reframing",
      currency: "PLN",
      migration: {
        sourceSchemaVersion: "v2",
        status: "native",
        confirmed: true,
        legacyScenarioId: null,
        fieldsRequiringConfirmation: [],
        audit: null,
      },
    });
    expect(record.axes).toEqual([
      { id: "legalGovernanceBoundary", value: "private_policy" },
      { id: "procedureFamily", value: "private_competitive" },
      { id: "purchaseArchetype", value: "capital_investment" },
      { id: "executionChannel", value: "sourcing_event" },
      { id: "systemSupport", value: "transactional_erp" },
      { id: "initiatedOn", value: "2026-08-28" },
    ]);
    expect(record.alternatives.formalSequential.designIds).toEqual({
      workflowDesignId: draft.designIds.workflow.formalSequential,
      contractDesignId: draft.designIds.contract.formalSequential,
    });
    expect(record.alternatives.adaptiveCompliant.designIds).toEqual({
      workflowDesignId: draft.designIds.workflow.adaptiveCompliant,
      contractDesignId: draft.designIds.contract.adaptiveCompliant,
    });
    expect(record.alternatives.formalSequential.result).toEqual(
      calculationResult.formalSequential
    );
    expect(record.alternatives.adaptiveCompliant.result).toEqual(
      calculationResult.adaptiveCompliant
    );
    expect(record.comparison).toEqual({
      operation: "formalSequential_minus_adaptiveCompliant",
      deltaCost: calculationResult.deltaCost,
      deltaCostOuterEnvelope: calculationResult.deltaCostOuterEnvelope,
    });
    expect(JSON.parse(JSON.stringify(record))).toEqual(record);
  });

  it("sorts neutral drivers by absolute central contribution and excludes non-monetised dimensions", () => {
    const { record } = recordFor("fleet_tco_reframing");

    expect(record.drivers.map(({ id }) => id)).toEqual([
      "competition_transfer",
      "delay_cost",
      "role_cost",
      "non_labour_cost",
      "contract_amendment",
      "tco",
    ]);
    expect(record.drivers[0]).toMatchObject({
      id: "competition_transfer",
      contribution: { low: -450_000, central: -300_000, high: -100_000 },
    });
    expect(record.coverage.map(({ id }) => id)).toEqual([
      "role_cost",
      "non_labour_cost",
      "delay_cost",
      "competition_transfer",
      "contract_amendment",
      "tco",
    ]);
    expect(record.nonMonetizedDimensions).toEqual([
      {
        id: "informal_bypass",
        alternatives: {
          formalSequential: {
            reasonKey: "reasons.bypassNotMonetized",
            evidenceIds: [],
          },
          adaptiveCompliant: {
            reasonKey: "reasons.bypassNotMonetized",
            evidenceIds: [],
          },
        },
      },
    ]);
    const driverIds: string[] = record.drivers.map(({ id }) => id);
    const coverageIds: string[] = record.coverage.map(({ id }) => id);
    expect(driverIds).not.toContain("informal_bypass");
    expect(coverageIds).not.toContain("informal_bypass");
  });

  it("recursively separates numeric anchors, qualitative evidence, retained assumptions and legal provenance", () => {
    const { record } = recordFor(
      "public_it_open_with_market_consultation"
    );

    expect(record.externalEvidence.map(({ id }) => id)).toEqual([
      "oecd_rvul_problem_definition",
      "uzp_preliminary_market_consultation",
      "ec_innovation_procurement_guidance",
      "szucs_discretion_price_2024",
    ]);
    expect(record.retainedAssumptions.map(({ id }) => id)).toEqual([
      "scenario.public_it_open_with_market_consultation.retained-legacy",
    ]);
    expect(record.legalProvenance.map(({ ruleId }) => ruleId)).toEqual([
      "pl-pzp-art-138-1",
      "pl-pzp-art-264-1",
    ]);
    expect(
      record.legalProvenance.every(({ occurrences }) => occurrences.length === 2)
    ).toBe(true);
    expect(
      record.calculationAnchors.some(
        ({ evidenceClass, evidenceIds }) =>
          evidenceClass === "empirical_anchor" &&
          evidenceIds.includes("szucs_discretion_price_2024")
      )
    ).toBe(true);
    expect(
      record.externalEvidence.some(({ id }) =>
        id.startsWith("scenario.public_it_open_with_market_consultation")
      )
    ).toBe(false);
    expect(
      record.retainedAssumptions.some(({ id }) => id.startsWith("pl-pzp-"))
    ).toBe(false);
  });

  it("keeps retained and user contract values separate from empirical rate anchors", () => {
    const retainedDraft = createScenarioDraft("fleet_tco_reframing");
    const retainedContractValue = structuredClone(
      retainedDraft.economicAssumptions.contractValue
    );
    const retainedRecord = buildDecisionRecordV2(retainedDraft);

    expect(retainedRecord.assumptions.contractValue).toEqual(
      retainedContractValue
    );
    expect(retainedRecord.assumptions.contractValue.evidenceClass).toBe(
      "retained_legacy_assumption"
    );
    expect(
      retainedRecord.calculationAnchors.some(
        ({ evidenceClass, evidenceIds }) =>
          evidenceClass === "empirical_anchor" &&
          evidenceIds.some((id) => retainedContractValue.evidenceIds.includes(id))
      )
    ).toBe(false);

    const userDraft = createScenarioDraft("fleet_tco_reframing");
    userDraft.economicAssumptions.contractValue = {
      low: 2_000_000,
      central: 4_000_000,
      high: 8_000_000,
      rangeKind: "stress",
      evidenceClass: "user_input",
      evidenceIds: ["user.contract-value"],
    };
    const userRecord = buildDecisionRecordV2(userDraft);

    expect(userRecord.assumptions.contractValue).toEqual(
      userDraft.economicAssumptions.contractValue
    );
    expect(
      userRecord.calculationAnchors.some(
        ({ evidenceClass, evidenceIds }) =>
          evidenceClass === "empirical_anchor" &&
          evidenceIds.includes("user.contract-value")
      )
    ).toBe(false);
    expect(
      userRecord.calculationAnchors.some(
        ({ evidenceClass, evidenceIds }) =>
          evidenceClass === "empirical_anchor" &&
          evidenceIds.includes("szucs_discretion_price_2024")
      )
    ).toBe(true);
  });

  it("preserves user-authored labels and critical-path membership without printing label keys as labels", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.alternatives.formalSequential.workflowDesign.steps[0].userLabel =
      "Review scope with operations";
    const record = buildDecisionRecordV2(draft);
    const step = record.alternatives.formalSequential.workflow.steps[0];

    expect(step.userLabel).toBe("Review scope with operations");
    expect(step.labelKey).toBe(
      "workflow.steps.rfi"
    );
    expect(step.criticalPathCases).toEqual(["low", "central", "high"]);
  });

  it("carries confirmed legacy status but cannot create metadata from a blocked migration", () => {
    const partial = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const ambiguous = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "not-registered" })
    );

    expect(() =>
      migrationMetadataFromCalculationGate({
        kind: "legacy_migration",
        result: partial,
        confirmed: false,
      })
    ).toThrow(/confirmation/i);
    expect(() =>
      migrationMetadataFromCalculationGate({
        kind: "legacy_migration",
        result: partial,
        confirmed: true,
      })
    ).toThrow(/adapter.*audit/i);
    const adapted = createScenarioDraftFromLegacyMigration(partial, true);
    expect(adapted.status).toBe("ready");
    if (adapted.status !== "ready") {
      throw new Error("Expected confirmed canonical partial migration to adapt");
    }
    expect(
      migrationMetadataFromCalculationGate(adapted.gate)
    ).toMatchObject({
      sourceSchemaVersion: "legacy-v1",
      status: "partial",
      confirmed: true,
      legacyScenarioId: "erp",
      audit: adapted.audit,
    });
    expect(
      buildDecisionRecordV2(
        adapted.draft,
        adapted.gate
      ).metadata.migration
    ).toMatchObject({
      sourceSchemaVersion: "legacy-v1",
      status: "partial",
      confirmed: true,
      legacyScenarioId: "erp",
      audit: adapted.audit,
    });
    expect(() =>
      migrationMetadataFromCalculationGate({
        kind: "legacy_migration",
        result: ambiguous,
        confirmed: true,
      })
    ).toThrow(/ambiguous/i);
  });

  it("stays swap-neutral and exposes no prescriptive result field", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.economicAssumptions.pathCompetitionDiffers = false;
    draft.economicAssumptions.competitionTransferRate = null;
    for (const alternative of [
      "formalSequential",
      "adaptiveCompliant",
    ] as const) {
      const competition = draft.alternatives[
        alternative
      ].contractDesign.dimensions.find(
        ({ id }) => id === "competition_transfer"
      );
      if (!competition || competition.status !== "monetized") {
        throw new Error("Fixture requires a monetized competition dimension");
      }
      competition.cost = {
        ...competition.cost,
        low: 0,
        central: 0,
        high: 0,
      };
    }
    const record = buildDecisionRecordV2(draft);
    const swappedDraft = structuredClone(draft);
    swappedDraft.alternatives = {
      formalSequential: structuredClone(draft.alternatives.adaptiveCompliant),
      adaptiveCompliant: structuredClone(draft.alternatives.formalSequential),
    };
    const swappedRecord = buildDecisionRecordV2(swappedDraft);

    expect(swappedRecord.comparison.deltaCost).toBe(
      -record.comparison.deltaCost
    );
    expect(swappedRecord.comparison.deltaCostOuterEnvelope).toEqual({
      low: -record.comparison.deltaCostOuterEnvelope.high,
      high: -record.comparison.deltaCostOuterEnvelope.low,
    });
    expect(
      swappedRecord.drivers.map(({ id, contribution }) => [
        id,
        contribution.central,
      ])
    ).toEqual(
      record.drivers.map(({ id, contribution }) => [
        id,
        contribution.central === 0 ? 0 : -contribution.central,
      ])
    );
    const keys = allKeys(record);
    for (const forbidden of [
      "winner",
      "recommendation",
      "recommended",
      "optimalPath",
      "preference",
      "confidence",
    ]) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("atomically rematerialises edited assumptions before calculating the record", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.economicAssumptions.dailyCostOfInaction = {
      low: 100,
      central: 100,
      high: 100,
      rangeKind: "fixed",
      evidenceClass: "user_input",
      evidenceIds: ["user.daily-cost"],
    };

    const record = buildDecisionRecordV2(draft);

    expect(record.assumptions.dailyCostOfInaction.central).toBe(100);
    expect(record.alternatives.formalSequential.result.delayCost.central).toBe(
      4_400
    );
    expect(record.alternatives.adaptiveCompliant.result.delayCost.central).toBe(
      2_400
    );
    expect(
      record.drivers.find(({ id }) => id === "delay_cost")?.contribution.central
    ).toBe(2_000);
  });

  it("derives axes from the same draft and rejects mismatched design identities", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.context.purchaseArchetypeId = "complex_service";

    expect(
      buildDecisionRecordV2(draft).axes.find(
        ({ id }) => id === "purchaseArchetype"
      )?.value
    ).toBe("complex_service");

    draft.designIds.workflow.formalSequential =
      draft.designIds.workflow.adaptiveCompliant;
    expect(() => buildDecisionRecordV2(draft)).toThrow(
      /workflow design.*formalSequential/i
    );
  });

  it("does not accept detached scenario/input/result payloads", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    const calculationInput = buildCalculationInputFromDraft(draft);
    const calculationResult = calculateComparison(calculationInput);
    const detached = {
      scenario: scenarioV2ById("fleet_tco_reframing")!,
      source: draft,
      calculationInput,
      calculationResult: {
        ...calculationResult,
        deltaCost: calculationResult.deltaCost + 1,
      },
    };

    expect(() =>
      buildDecisionRecordV2(
        detached as unknown as Parameters<typeof buildDecisionRecordV2>[0]
      )
    ).toThrow(/ScenarioDraft/i);
  });
});
