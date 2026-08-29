import { describe, expect, it } from "vitest";

import { encodeInputsToParams } from "@/components/calculator-url";
import { SCENARIOS } from "@/lib/scenarios";
import { buildCalculationInputFromDraft } from "@/lib/model-v2/calculation-input";
import { stateForScenarioV2 } from "@/lib/model-v2/calculator-url";
import {
  buildDecisionRecordV2 as buildNativeDecisionRecordV2,
  type DecisionRecordMigrationMetadata,
  type DecisionRecordV2,
} from "@/lib/model-v2/decision-record";
import { calculateComparison } from "@/lib/model-v2/engine";
import {
  buildDecisionRecordFromLegacyMigration,
  createScenarioDraftFromLegacyMigration,
  migrateLegacyCalculatorParams,
  migrationMetadataFromLegacyCalculationGate as migrationMetadataFromLegacyGate,
} from "@/lib/model-v2/legacy-adapter";
import {
  createScenarioDraft,
  scenarioV2ById,
  type ScenarioDraft,
  type ScenarioV2Id,
} from "@/lib/model-v2/scenarios";

const migrationMetadataFromCalculationGate =
  migrationMetadataFromLegacyGate as unknown as (
    gate: unknown,
    draft?: ScenarioDraft
  ) => DecisionRecordMigrationMetadata;

function buildDecisionRecordV2(
  draft: ScenarioDraft,
  gate?: unknown
): DecisionRecordV2 {
  if (
    gate &&
    typeof gate === "object" &&
    (gate as { kind?: unknown }).kind === "legacy_migration"
  ) {
    return (
      buildDecisionRecordFromLegacyMigration as unknown as (
        source: ScenarioDraft,
        sourceGate: unknown
      ) => DecisionRecordV2
    )(draft, gate);
  }
  return (
    buildNativeDecisionRecordV2 as unknown as (
      source: ScenarioDraft,
      sourceGate?: unknown
    ) => DecisionRecordV2
  )(draft, gate);
}

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

function userFixed(value: number, evidenceId: string) {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed" as const,
    evidenceClass: "user_input" as const,
    evidenceIds: [evidenceId],
  };
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
        postMigrationEdits: [],
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
      "delay_cost",
      "role_cost",
      "non_labour_cost",
      "competition_transfer",
      "contract_amendment",
      "tco",
    ]);
    expect(record.drivers[0]).toMatchObject({
      id: "delay_cost",
      contribution: { central: 100_000 },
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
    expect(
      record.coverage.flatMap(({ anchors }) =>
        anchors.map(({ path }) => path)
      )
    ).not.toContainEqual(expect.stringContaining("informal_bypass"));
  });

  it("preserves all role hourly rates from the atomic calculation input", () => {
    const { draft, calculationInput, record } = recordFor(
      "fleet_tco_reframing"
    );

    expect(Object.keys(record.roleHourlyRates)).toEqual([
      "requestor",
      "buyer",
      "lawyer",
      "finance",
      "manager",
      "executive",
    ]);
    expect(record.roleHourlyRates).toEqual(calculationInput.roleHourlyRates);
    expect(record.roleHourlyRates).not.toBe(calculationInput.roleHourlyRates);
    for (const roleId of Object.keys(record.roleHourlyRates)) {
      expect(record.roleHourlyRates[roleId]).not.toBe(
        calculationInput.roleHourlyRates[roleId]
      );
      expect(record.roleHourlyRates[roleId].evidenceIds).not.toBe(
        calculationInput.roleHourlyRates[roleId].evidenceIds
      );
    }

    const recordedBuyer = structuredClone(record.roleHourlyRates.buyer);
    draft.roleHourlyRates.buyer.central = 999;
    draft.roleHourlyRates.buyer.evidenceIds.push("draft-mutated");
    expect(record.roleHourlyRates.buyer).toEqual(recordedBuyer);
    record.roleHourlyRates.buyer.evidenceIds.push("record-mutated");
    expect(draft.roleHourlyRates.buyer.evidenceIds).not.toContain(
      "record-mutated"
    );
  });

  it("attaches exact ordered anchors to every coverage row", () => {
    const { record } = recordFor("fleet_tco_reframing");
    const anchors = Object.fromEntries(
      record.coverage.map((entry) => [
        entry.id,
        entry.anchors.map(({ path }) => path),
      ])
    );

    expect(record.coverage.every(({ anchors: entries }) => entries.length > 0)).toBe(
      true
    );
    expect(anchors.role_cost).toContain(
      "alternatives.formalSequential.workflowDesign.steps[0].roleHours.buyer"
    );
    expect(anchors.role_cost).toContain("roleHourlyRates.buyer");
    expect(anchors.non_labour_cost).toContain(
      "alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost"
    );
    expect(anchors.delay_cost).toContain(
      "alternatives.formalSequential.workflowDesign.steps[0].activeDays"
    );
    expect(anchors.delay_cost).toContain(
      "alternatives.formalSequential.workflowDesign.steps[0].queueDays"
    );
    expect(anchors.delay_cost.at(-1)).toBe("dailyCostOfInaction");
    expect(anchors.competition_transfer).toEqual([
      "alternatives.formalSequential.contractDesign.dimensions[0].cost",
      "alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost",
    ]);
    expect(anchors.contract_amendment).toEqual([
      "alternatives.formalSequential.contractDesign.dimensions[1].cost",
      "alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost",
    ]);
    expect(anchors.tco).toEqual([
      "alternatives.formalSequential.contractDesign.dimensions[2].cost",
      "alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost",
    ]);
    expect(Object.values(anchors).flat()).not.toContainEqual(
      expect.stringContaining("economicAssumptions")
    );
    expect(Object.values(anchors).flat()).not.toContainEqual(
      expect.stringContaining("informal_bypass")
    );

    const evidenceClasses = (id: keyof typeof anchors) => [
      ...new Set(
        record.coverage
          .find((entry) => entry.id === id)!
          .anchors.map(({ evidenceClass }) => evidenceClass)
      ),
    ];
    for (const id of [
      "role_cost",
      "delay_cost",
    ] as const) {
      expect(evidenceClasses(id)).toEqual([
        "illustrative_scenario",
        "retained_legacy_assumption",
      ]);
    }
    expect(evidenceClasses("non_labour_cost")).toEqual([
      "illustrative_scenario",
    ]);
    for (const id of [
      "contract_amendment",
      "tco",
    ] as const) {
      expect(evidenceClasses(id)).toEqual(["retained_legacy_assumption"]);
    }
    expect(evidenceClasses("competition_transfer")).toEqual([
      "retained_legacy_assumption",
    ]);

    const publicRecord = recordFor(
      "public_it_open_with_market_consultation"
    ).record;
    expect(
      new Set(
        publicRecord.coverage
          .find(({ id }) => id === "delay_cost")!
          .anchors.map(({ evidenceClass }) => evidenceClass)
      )
    ).toEqual(
      new Set([
        "illustrative_scenario",
        "retained_legacy_assumption",
        "legal_rule",
      ])
    );
  });

  it("keeps coverage anchors isolated from global anchors and sibling rows", () => {
    const { record } = recordFor("fleet_tco_reframing");
    const coverage = record.coverage.find(({ id }) => id === "role_cost")!;
    const copied = coverage.anchors.find(
      ({ path }) => path === "roleHourlyRates.buyer"
    )!;
    const global = record.calculationAnchors.find(
      ({ path }) => path === "roleHourlyRates.buyer"
    )!;
    const siblingAnchor = record.coverage.find(
      ({ id }) => id === "delay_cost"
    )!.anchors[0];

    expect(copied).toEqual(global);
    expect(copied).not.toBe(global);
    expect(copied.evidenceIds).not.toBe(global.evidenceIds);
    copied.evidenceIds.push("coverage-mutated");
    expect(global.evidenceIds).not.toContain("coverage-mutated");
    expect(siblingAnchor.evidenceIds).not.toContain("coverage-mutated");
    global.evidenceIds.push("global-mutated");
    expect(copied.evidenceIds).not.toContain("global-mutated");
  });

  it("recursively separates numeric anchors, qualitative evidence, retained assumptions and legal provenance", () => {
    const { record } = recordFor(
      "public_it_open_with_market_consultation"
    );

    expect(record.externalEvidence.map(({ id }) => id)).toEqual([
      "oecd_rvul_problem_definition",
      "uzp_preliminary_market_consultation",
      "ec_innovation_procurement_guidance",
    ]);
    expect(record.internalEvidence.map(({ id }) => id)).toEqual([
      "model_2_3_mechanism_workflow_allocations",
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
    ).toBe(false);
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
    const retainedDraft = createScenarioDraft("stable_private_standard_service");
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

    const userDraft = createScenarioDraft("stable_private_standard_service");
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
      "workflow.steps.fleet_operating_baseline"
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
    ).toEqual({
      sourceSchemaVersion: "legacy-v1",
      status: "partial",
      confirmed: true,
      legacyScenarioId: "erp",
      fieldsRequiringConfirmation: adapted.gate.result.fieldsRequiringConfirmation,
      audit: adapted.audit,
      postMigrationEdits: [],
    });
    expect(
      buildDecisionRecordV2(
        adapted.draft,
        adapted.gate
      ).metadata.migration
    ).toEqual({
      sourceSchemaVersion: "legacy-v1",
      status: "partial",
      confirmed: true,
      legacyScenarioId: "erp",
      fieldsRequiringConfirmation: adapted.gate.result.fieldsRequiringConfirmation,
      audit: adapted.audit,
      postMigrationEdits: [],
    });
    expect(() =>
      migrationMetadataFromCalculationGate({
        kind: "legacy_migration",
        result: ambiguous,
        confirmed: true,
      })
    ).toThrow(/ambiguous/i);
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
  ] as const)(
    "rejects forged partial-migration %s before decision-record metadata assembly",
    (_label, mutate) => {
      const migration = migrateLegacyCalculatorParams(
        new URLSearchParams({ sid: "erp" })
      );
      const adapted = createScenarioDraftFromLegacyMigration(migration, true);
      if (adapted.status !== "ready") {
        throw new Error("Expected confirmed partial migration fixture");
      }
      mutate(adapted.gate.result as unknown as Record<string, unknown>);

      expect(() =>
        buildDecisionRecordV2(adapted.draft, adapted.gate)
      ).toThrow(/legacy migration|canonical|invariant/i);
    }
  );

  it("rejects allowed but non-authentic partial confirmation ordering", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const adapted = createScenarioDraftFromLegacyMigration(migration, true);
    if (adapted.status !== "ready" || adapted.gate.result.status !== "partial") {
      throw new Error("Expected confirmed partial migration fixture");
    }
    adapted.gate.result.fieldsRequiringConfirmation.reverse();
    adapted.gate.result.validationErrors.reverse();

    expect(() => migrationMetadataFromCalculationGate(adapted.gate)).toThrow(
      /authentic|canonical|migration result/i
    );
  });

  it("rejects a partial alias bound to another canonical scenario state", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const adapted = createScenarioDraftFromLegacyMigration(migration, true);
    if (adapted.status !== "ready" || adapted.gate.result.status !== "partial") {
      throw new Error("Expected confirmed partial migration fixture");
    }
    adapted.gate.result.draftState = {
      ...stateForScenarioV2("fleet_tco_reframing"),
      retainedLegacyInputs:
        adapted.gate.result.draftState.retainedLegacyInputs,
    };

    expect(() => migrationMetadataFromCalculationGate(adapted.gate)).toThrow(
      /authentic|canonical|migration result/i
    );
  });

  it("rejects an exact legacy alias bound to another canonical scenario state", () => {
    const legacyFleet = SCENARIOS.find(({ id }) => id === "fleet")!;
    const migration = migrateLegacyCalculatorParams(
      encodeInputsToParams(legacyFleet.inputs, legacyFleet.id)
    );
    const adapted = createScenarioDraftFromLegacyMigration(migration);
    if (adapted.status !== "ready" || adapted.gate.result.status !== "exact") {
      throw new Error("Expected exact legacy migration fixture");
    }
    adapted.gate.result.state = stateForScenarioV2(
      "erp_transformation_discovery"
    );

    expect(() => migrationMetadataFromCalculationGate(adapted.gate)).toThrow(
      /authentic|canonical|migration result/i
    );
  });

  it("rejects additional runtime calibrated fields before they can enter an edit overlay", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const adapted = createScenarioDraftFromLegacyMigration(migration, true);
    if (adapted.status !== "ready") {
      throw new Error("Expected confirmed partial migration fixture");
    }
    const draft = structuredClone(adapted.draft);
    draft.economicAssumptions.contractValue = userFixed(
      4_200_000,
      "user.contract-value"
    );
    (
      draft.economicAssumptions.contractValue as unknown as Record<
        string,
        unknown
      >
    ).postMigrationEdits = [{ caller: "forged" }];

    expect(() => buildDecisionRecordV2(draft, adapted.gate)).toThrow(
      /canonical|calibrated|postMigrationEdits/i
    );
  });

  it("fails closed when a requested coverage input loses provenance", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    delete (
      draft.roleHourlyRates.buyer as unknown as Record<string, unknown>
    ).evidenceIds;

    expect(() => buildDecisionRecordV2(draft)).toThrow(
      /roleHourlyRates\.buyer must use valid evidence identifiers/i
    );
  });

  it("keeps the partial migration audit and derived edit overlay isolated in every direction", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const adapted = createScenarioDraftFromLegacyMigration(migration, true);
    if (adapted.status !== "ready") {
      throw new Error("Expected confirmed partial migration fixture");
    }
    const draft = structuredClone(adapted.draft);
    const pristineGate = structuredClone(adapted.gate);
    draft.economicAssumptions.contractValue = userFixed(
      4_200_000,
      "user.contract-value"
    );
    const pristineDraft = structuredClone(draft);
    const record = buildDecisionRecordV2(draft, adapted.gate);
    const originalAudit = structuredClone(adapted.audit);
    const originalBefore = structuredClone(
      adapted.draft.economicAssumptions.contractValue
    );
    const originalAfter = structuredClone(
      draft.economicAssumptions.contractValue
    );
    const edit = record.metadata.migration.postMigrationEdits[0];

    expect(edit).toMatchObject({
      field: "contractValue",
      materializedPaths: ["economicAssumptions.contractValue"],
      before: originalBefore,
      after: originalAfter,
    });
    expect(record.metadata.migration.audit).toEqual(originalAudit);

    draft.economicAssumptions.contractValue.evidenceIds.push("draft-mutated");
    adapted.gate.audit.retainedLegacyInputs.contractValue = 1;
    expect(edit.after.evidenceIds).not.toContain("draft-mutated");
    expect(record.metadata.migration.audit).toEqual(originalAudit);

    if (!record.metadata.migration.audit) {
      throw new Error("Expected an isolated migration audit");
    }
    record.metadata.migration.audit.retainedLegacyInputs.contractValue = 2;
    expect(adapted.audit.retainedLegacyInputs.contractValue).toBe(
      originalAudit.retainedLegacyInputs.contractValue
    );

    edit.before.central = 3;
    edit.after.central = 4;
    edit.before.evidenceIds.push("before-mutated");
    edit.after.evidenceIds.push("after-mutated");
    edit.materializedPaths.push("roleHourlyRates.buyer");
    expect(adapted.draft.economicAssumptions.contractValue).toEqual(
      originalBefore
    );
    expect(draft.economicAssumptions.contractValue.central).toBe(4_200_000);
    expect(
      adapted.audit.fieldDispositions.find(
        ({ field }) => field === "contractValue"
      )?.materializedPaths
    ).toEqual(["economicAssumptions.contractValue"]);

    const injected = {
      field: "contractValue",
      materializedPaths: [],
    };
    const rebuilt = (
      buildDecisionRecordV2 as unknown as (
        source: typeof draft,
        gate: typeof adapted.gate,
        postMigrationEdits: unknown[]
      ) => typeof record
    )(pristineDraft, pristineGate, [injected]);
    expect(rebuilt.metadata.migration.postMigrationEdits).toHaveLength(1);
    expect(rebuilt.metadata.migration.postMigrationEdits[0]).not.toBe(
      injected
    );
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

  it("rejects unregistered context drift and mismatched design identities", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.context.purchaseArchetypeId = "complex_service";

    expect(() => buildDecisionRecordV2(draft)).toThrow(
      /registered scenario context/i
    );

    const mismatchedDesign = createScenarioDraft("fleet_tco_reframing");
    mismatchedDesign.designIds.workflow.formalSequential =
      mismatchedDesign.designIds.workflow.adaptiveCompliant;
    expect(() => buildDecisionRecordV2(mismatchedDesign)).toThrow(
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
