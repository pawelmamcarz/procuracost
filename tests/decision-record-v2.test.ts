import { describe, expect, it } from "vitest";

import { buildCalculationInputFromDraft } from "@/lib/model-v2/calculation-input";
import {
  buildDecisionRecordV2,
  migrationMetadataFromCalculationGate,
  nativeV2MigrationMetadata,
} from "@/lib/model-v2/decision-record";
import { calculateComparison } from "@/lib/model-v2/engine";
import { migrateLegacyCalculatorParams } from "@/lib/model-v2/legacy-migration";
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
    record: buildDecisionRecordV2({
      scenario,
      source: draft,
      calculationInput,
      calculationResult,
      migration: nativeV2MigrationMetadata(),
    }),
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

  it("preserves user-authored labels and critical-path membership without printing label keys as labels", () => {
    const scenario = scenarioV2ById("fleet_tco_reframing")!;
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.alternatives.formalSequential.workflowDesign.steps[0].userLabel =
      "Review scope with operations";
    const calculationInput = buildCalculationInputFromDraft(draft);
    const calculationResult = calculateComparison(calculationInput);
    const record = buildDecisionRecordV2({
      scenario,
      source: draft,
      calculationInput,
      calculationResult,
      migration: nativeV2MigrationMetadata(),
    });
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
    expect(
      migrationMetadataFromCalculationGate({
        kind: "legacy_migration",
        result: partial,
        confirmed: true,
      })
    ).toMatchObject({
      sourceSchemaVersion: "legacy-v1",
      status: "partial",
      confirmed: true,
      legacyScenarioId: "erp",
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
    const {
      scenario,
      draft,
      calculationInput,
      calculationResult,
      record,
    } = recordFor("fleet_tco_reframing");
    const swappedInput = {
      ...calculationInput,
      alternatives: {
        formalSequential: calculationInput.alternatives.adaptiveCompliant,
        adaptiveCompliant: calculationInput.alternatives.formalSequential,
      },
    };
    const swappedDraft = structuredClone(draft);
    swappedDraft.designIds = {
      workflow: {
        formalSequential: draft.designIds.workflow.adaptiveCompliant,
        adaptiveCompliant: draft.designIds.workflow.formalSequential,
      },
      contract: {
        formalSequential: draft.designIds.contract.adaptiveCompliant,
        adaptiveCompliant: draft.designIds.contract.formalSequential,
      },
    };
    const swappedResult = calculateComparison(swappedInput);
    const swappedRecord = buildDecisionRecordV2({
      scenario,
      source: swappedDraft,
      calculationInput: swappedInput,
      calculationResult: swappedResult,
      migration: nativeV2MigrationMetadata(),
    });

    expect(swappedRecord.comparison.deltaCost).toBe(
      -record.comparison.deltaCost
    );
    expect(swappedRecord.comparison.deltaCostOuterEnvelope).toEqual({
      low: -calculationResult.deltaCostOuterEnvelope.high,
      high: -calculationResult.deltaCostOuterEnvelope.low,
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
});
