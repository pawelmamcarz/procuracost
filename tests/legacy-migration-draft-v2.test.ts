import { describe, expect, it } from "vitest";

import { encodeInputsToParams } from "@/components/calculator-url";
import {
  buildCalculationInputFromDraft,
  buildDecisionRecordV2,
  createScenarioDraft,
  createScenarioDraftFromLegacyMigration,
  migrateLegacyCalculatorParams,
  type CalibratedValue,
  validateLegacyMigrationDraftForCalculation,
  type LegacyMigrationDraftBlocked,
  type LegacyMigrationDraftReady,
  type LegacyMigrationDraftResult,
  type LegacyMigrationResult,
  type LegacyRetainedInputField,
} from "@/lib/model-v2";
import { SCENARIOS } from "@/lib/scenarios";

const STAKEHOLDER_ROLES = [
  "requestor",
  "buyer",
  "lawyer",
  "finance",
  "manager",
  "executive",
] as const;

const NON_LITERAL_CONFIRMATIONS = [
  ["false", false],
  ["undefined", undefined],
  ["number one", 1],
  ["yes string", "yes"],
  ["Boolean object", new Boolean(false)],
] as const;

const runtimeLegacyAdapter = createScenarioDraftFromLegacyMigration as unknown as (
  migration: LegacyMigrationResult,
  confirmed?: unknown
) => LegacyMigrationDraftResult;

function legacyParams(alias: string): URLSearchParams {
  const scenario = SCENARIOS.find(({ id }) => id === alias);
  if (!scenario) throw new Error(`Missing legacy fixture ${alias}`);
  return encodeInputsToParams(scenario.inputs, scenario.id);
}

function ready(
  result: ReturnType<typeof createScenarioDraftFromLegacyMigration>
): LegacyMigrationDraftReady {
  expect(result.status).toBe("ready");
  if (result.status !== "ready") {
    throw new Error("Expected a ready legacy migration adaptation");
  }
  return result;
}

function blocked(
  result: ReturnType<typeof createScenarioDraftFromLegacyMigration>
): LegacyMigrationDraftBlocked {
  expect(result.status).toBe("blocked");
  if (result.status !== "blocked") {
    throw new Error("Expected a blocked legacy migration adaptation");
  }
  return result;
}

function disposition(
  result: LegacyMigrationDraftReady | LegacyMigrationDraftBlocked,
  field: LegacyRetainedInputField
) {
  const entry = result.audit?.fieldDispositions.find(
    (candidate) => candidate.field === field
  );
  if (!entry) throw new Error(`Missing disposition for ${field}`);
  return entry;
}

function stakeholderParam(
  alias: string,
  edit: (
    values: Record<(typeof STAKEHOLDER_ROLES)[number], { count: number; dailyRate: number }>
  ) => void
): string {
  const scenario = SCENARIOS.find(({ id }) => id === alias);
  if (!scenario) throw new Error(`Missing legacy fixture ${alias}`);
  const stakeholders = structuredClone(scenario.inputs.stakeholders);
  edit(stakeholders);
  return STAKEHOLDER_ROLES.map(
    (role) => `${stakeholders[role].count}:${stakeholders[role].dailyRate}`
  ).join(",");
}

function editedFixed(value: number, evidenceId = ""): CalibratedValue {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed",
    evidenceClass: "user_input",
    evidenceIds: evidenceId ? [evidenceId] : [],
  };
}

describe("model 2.3 lossless legacy migration draft adapter", () => {
  it("creates an isolated canonical draft and matching audited gate for every exact alias", () => {
    for (const scenario of SCENARIOS.filter(({ id }) => id !== "custom")) {
      const migration = migrateLegacyCalculatorParams(legacyParams(scenario.id));
      expect(migration.status, scenario.id).toBe("exact");

      const first = ready(createScenarioDraftFromLegacyMigration(migration));
      const second = ready(createScenarioDraftFromLegacyMigration(migration));
      const canonical = createScenarioDraft(first.draft.derivedFromScenarioId);

      expect(first.draft).toEqual(canonical);
      expect(first.gate).toMatchObject({
        kind: "legacy_migration",
        result: { status: "exact", legacyScenarioId: scenario.id },
      });
      expect(first.audit).toMatchObject({
        sourceClass: "legacy_migration_input",
        legacyScenarioId: scenario.id,
        retainedLegacyInputs: scenario.inputs,
      });
      expect(first.audit.fieldDispositions).toHaveLength(24);
      expect(
        first.audit.fieldDispositions.every(
          ({ disposition: value }) => value === "retained_only"
        )
      ).toBe(true);
      expect(first.draft).not.toBe(second.draft);
      expect(first.audit).not.toBe(second.audit);
      expect(first.gate.result).not.toBe(migration);

      first.draft.economicAssumptions.contractValue.central += 1;
      first.audit.retainedLegacyInputs.contractValue += 2;
      first.gate.result.legacyScenarioId = "mutated";
      expect(second.draft).toEqual(canonical);
      expect(second.audit.retainedLegacyInputs).toEqual(scenario.inputs);
      expect(migration.legacyScenarioId).toBe(scenario.id);
    }
  });

  it("keeps a partial migration blocked until confirmation without returning a draft or gate", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );

    const result = blocked(createScenarioDraftFromLegacyMigration(migration));

    expect(result.draft).toBeNull();
    expect(result.gate).toBeNull();
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "confirmation_required",
        field: "retainedLegacyInputs.contractValue",
      })
    );
    expect(result.audit?.retainedLegacyInputs).toEqual(
      SCENARIOS.find(({ id }) => id === "erp")?.inputs
    );
  });

  it.each(NON_LITERAL_CONFIRMATIONS)(
    "requires primitive literal true and blocks runtime confirmation value %s",
    (_label, confirmed) => {
      const migration = migrateLegacyCalculatorParams(
        new URLSearchParams({ sid: "erp" })
      );

      const result = blocked(runtimeLegacyAdapter(migration, confirmed));

      expect(result.draft).toBeNull();
      expect(result.gate).toBeNull();
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "confirmation_required",
          field: "retainedLegacyInputs.contractValue",
        })
      );
    }
  );

  it("keeps exact and ambiguous outcomes independent of confirmation runtime values", () => {
    const exact = migrateLegacyCalculatorParams(legacyParams("fleet"));
    const ambiguous = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "not-registered" })
    );
    const expectedAmbiguous = runtimeLegacyAdapter(ambiguous);

    for (const [, confirmed] of NON_LITERAL_CONFIRMATIONS) {
      expect(runtimeLegacyAdapter(exact, confirmed).status).toBe("ready");
      expect(runtimeLegacyAdapter(ambiguous, confirmed)).toEqual(
        expectedAmbiguous
      );
    }
  });

  it("rejects a forged exact-migration audit instead of exporting unrelated retained values", () => {
    const migration = migrateLegacyCalculatorParams(legacyParams("fleet"));
    const result = ready(createScenarioDraftFromLegacyMigration(migration));
    result.gate.audit.retainedLegacyInputs.contractValue = 1;

    expect(() =>
      buildDecisionRecordV2(result.draft, result.gate)
    ).toThrow(/adapter audit.*retained inputs/i);
  });

  it("never adapts an ambiguous migration even when confirmation is supplied", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "not-registered" })
    );

    const result = blocked(
      createScenarioDraftFromLegacyMigration(migration, true)
    );

    expect(result).toMatchObject({
      status: "blocked",
      draft: null,
      gate: null,
      audit: null,
    });
    expect(result.issues).toContainEqual({
      code: "ambiguous_migration",
      field: "sid",
      retainedValue: "not-registered",
      messageKey: "validation.legacyUnknownScenario",
    });
  });

  it("materialises every directly representable partial value with legacy provenance", () => {
    const params = legacyParams("erp");
    params.set("cv", "3750000");
    params.set("dci", "9999");
    params.set(
      "sh",
      stakeholderParam("erp", (stakeholders) => {
        for (const role of STAKEHOLDER_ROLES) {
          stakeholders[role].dailyRate += 80;
        }
      })
    );
    const migration = migrateLegacyCalculatorParams(params);

    const result = ready(
      createScenarioDraftFromLegacyMigration(migration, true)
    );

    expect(result.draft.economicAssumptions.contractValue).toEqual({
      low: 3_750_000,
      central: 3_750_000,
      high: 3_750_000,
      rangeKind: "fixed",
      evidenceClass: "user_input",
      evidenceIds: [
        "legacy-v1.erp.retainedLegacyInputs.contractValue",
      ],
    });
    expect(result.draft.economicAssumptions.dailyCostOfInaction).toEqual({
      low: 9_999,
      central: 9_999,
      high: 9_999,
      rangeKind: "fixed",
      evidenceClass: "user_input",
      evidenceIds: [
        "legacy-v1.erp.retainedLegacyInputs.dailyCostOfInaction",
      ],
    });
    expect(result.draft.dailyCostOfInaction).toEqual(
      result.draft.economicAssumptions.dailyCostOfInaction
    );
    expect(result.draft.dailyCostOfInaction).not.toBe(
      result.draft.economicAssumptions.dailyCostOfInaction
    );
    for (const role of STAKEHOLDER_ROLES) {
      const retained = migration.status === "partial"
        ? migration.draftState.retainedLegacyInputs.stakeholders[role].dailyRate
        : 0;
      expect(result.draft.roleHourlyRates[role]).toEqual({
        low: retained / 8,
        central: retained / 8,
        high: retained / 8,
        rangeKind: "fixed",
        evidenceClass: "user_input",
        evidenceIds: [
          `legacy-v1.erp.retainedLegacyInputs.stakeholders.${role}.dailyRate`,
        ],
      });
      expect(disposition(result, `stakeholders.${role}.dailyRate`)).toMatchObject({
        disposition: "materialised",
        changedFromLegacyScenario: true,
        materializedPaths: [`roleHourlyRates.${role}`],
      });
    }
    expect(disposition(result, "contractValue")).toMatchObject({
      disposition: "materialised",
      materializedPaths: ["economicAssumptions.contractValue"],
      provenance: {
        sourceClass: "legacy_migration_input",
        sourceField: "retainedLegacyInputs.contractValue",
      },
    });
    expect(disposition(result, "dailyCostOfInaction")).toMatchObject({
      disposition: "materialised",
      materializedPaths: [
        "economicAssumptions.dailyCostOfInaction",
        "dailyCostOfInaction",
      ],
    });
    expect(disposition(result, "tcoHorizonYears").disposition).toBe(
      "retained_only"
    );
  });

  it("derives eight ordered, isolated post-migration edits from the submitted partial draft", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const adapted = ready(
      createScenarioDraftFromLegacyMigration(migration, true)
    );
    const submitted = structuredClone(adapted.draft);
    const baseline = structuredClone(adapted.draft);

    submitted.economicAssumptions.contractValue = editedFixed(
      4_100_000,
      "user.contract-value"
    );
    const dailyCost = editedFixed(12_345, "user.daily-cost");
    submitted.economicAssumptions.dailyCostOfInaction = structuredClone(
      dailyCost
    );
    submitted.dailyCostOfInaction = structuredClone(dailyCost);
    STAKEHOLDER_ROLES.forEach((role, index) => {
      submitted.roleHourlyRates[role] = editedFixed(
        201 + index,
        `user.hourly-rate.${role}`
      );
    });

    const validated = validateLegacyMigrationDraftForCalculation(
      submitted,
      adapted.gate
    );

    expect(validated.postMigrationEdits.map(({ field }) => field)).toEqual([
      "contractValue",
      "dailyCostOfInaction",
      ...STAKEHOLDER_ROLES.map((role) =>
        `stakeholders.${role}.dailyRate` as const
      ),
    ]);
    expect(validated.postMigrationEdits).toHaveLength(8);
    expect(validated.postMigrationEdits[0].materializedPaths).toEqual([
      "economicAssumptions.contractValue",
    ]);
    expect(validated.postMigrationEdits[1].materializedPaths).toEqual([
      "economicAssumptions.dailyCostOfInaction",
      "dailyCostOfInaction",
    ]);

    validated.postMigrationEdits.forEach((edit, index) => {
      const role = STAKEHOLDER_ROLES[index - 2];
      if (role) {
        expect(edit.materializedPaths).toEqual([
          `roleHourlyRates.${role}`,
        ]);
      }
      const before = index === 0
        ? baseline.economicAssumptions.contractValue
        : index === 1
          ? baseline.economicAssumptions.dailyCostOfInaction
          : baseline.roleHourlyRates[STAKEHOLDER_ROLES[index - 2]];
      const after = index === 0
        ? submitted.economicAssumptions.contractValue
        : index === 1
          ? submitted.economicAssumptions.dailyCostOfInaction
          : submitted.roleHourlyRates[STAKEHOLDER_ROLES[index - 2]];
      expect(edit.before).toEqual(before);
      expect(edit.before.evidenceIds[0]).toMatch(/^legacy-v1\.erp\./);
      expect(edit.after).toEqual(after);
      expect(edit.provenance).toEqual({
        sourceClass: "post_migration_user_edit",
        sourceSchemaVersion: "legacy-v1",
        legacyScenarioId: "erp",
        sourceField: `retainedLegacyInputs.${edit.field}`,
        originalDisposition: "materialised",
      });
    });

    validated.postMigrationEdits[0].before.evidenceIds.push("mutated");
    validated.postMigrationEdits[0].after.evidenceIds.push("mutated");
    validated.postMigrationEdits[0].materializedPaths.push(
      "roleHourlyRates.buyer"
    );
    expect(baseline.economicAssumptions.contractValue.evidenceIds).not.toContain(
      "mutated"
    );
    expect(submitted.economicAssumptions.contractValue.evidenceIds).not.toContain(
      "mutated"
    );
    expect(adapted.audit.fieldDispositions[2].materializedPaths).not.toContain(
      "roleHourlyRates.buyer"
    );
  });

  it.each([
    ["processType", "pt", "pzp_krajowy"],
    ["techLevel", "tl", "manual"],
    ["tcoHorizonYears", "tco", "4"],
    ["contractDurationYears", "dur", "1.5"],
    ["renegotiationCost", "rc", "425000"],
    ["bypassAuditExposure", "bae", "475000"],
    ["discountRatePct", "dr", "7"],
    ["spendType", "st", "direct"],
    ["processPhase", "pp", "upstream"],
  ] as const)(
    "blocks a confirmed partial migration when changed %s has no lawful v2 representation",
    (field, compactField, value) => {
      const params = legacyParams("erp");
      params.set(compactField, value);
      const migration = migrateLegacyCalculatorParams(params);

      const result = blocked(
        createScenarioDraftFromLegacyMigration(migration, true)
      );

      expect(result.draft).toBeNull();
      expect(result.gate).toBeNull();
      expect(result.issues).toEqual([
        expect.objectContaining({
          code: "unrepresentable_changed_field",
          field: `retainedLegacyInputs.${field}`,
        }),
      ]);
      expect(disposition(result, field)).toMatchObject({
        disposition: "blocked",
        changedFromLegacyScenario: true,
        materializedPaths: [],
      });
    }
  );

  it.each(STAKEHOLDER_ROLES)(
    "blocks a changed %s stakeholder count independently of its mappable daily rate",
    (changedRole) => {
      const params = legacyParams("erp");
      params.set(
        "sh",
        stakeholderParam("erp", (stakeholders) => {
          stakeholders[changedRole].count += 1;
          stakeholders[changedRole].dailyRate += 80;
        })
      );
      const migration = migrateLegacyCalculatorParams(params);

      const result = blocked(
        createScenarioDraftFromLegacyMigration(migration, true)
      );

      expect(result.issues).toEqual([
        expect.objectContaining({
          code: "unrepresentable_changed_field",
          field: `retainedLegacyInputs.stakeholders.${changedRole}.count`,
        }),
      ]);
      expect(disposition(result, `stakeholders.${changedRole}.count`).disposition).toBe(
        "blocked"
      );
      expect(
        disposition(result, `stakeholders.${changedRole}.dailyRate`).disposition
      ).toBe("materialised");
    }
  );

  it("enumerates every unrepresentable changed field in one blocked result", () => {
    const params = legacyParams("erp");
    params.set("pt", "pzp_krajowy");
    params.set("tl", "manual");
    params.set("tco", "4");
    params.set("dur", "1.5");
    params.set("rc", "425000");
    params.set("bae", "475000");
    params.set("dr", "7");
    params.set("st", "direct");
    params.set("pp", "upstream");
    params.set(
      "sh",
      stakeholderParam("erp", (stakeholders) => {
        for (const role of STAKEHOLDER_ROLES) stakeholders[role].count += 1;
      })
    );
    const migration = migrateLegacyCalculatorParams(params);

    const result = blocked(
      createScenarioDraftFromLegacyMigration(migration, true)
    );

    expect(result.issues.map(({ field }) => field)).toEqual([
      "retainedLegacyInputs.processType",
      "retainedLegacyInputs.techLevel",
      "retainedLegacyInputs.tcoHorizonYears",
      "retainedLegacyInputs.contractDurationYears",
      "retainedLegacyInputs.renegotiationCost",
      "retainedLegacyInputs.bypassAuditExposure",
      "retainedLegacyInputs.discountRatePct",
      "retainedLegacyInputs.spendType",
      "retainedLegacyInputs.processPhase",
      ...STAKEHOLDER_ROLES.map(
        (role) => `retainedLegacyInputs.stakeholders.${role}.count`
      ),
    ]);
    expect(
      result.audit?.fieldDispositions.filter(
        ({ disposition: value }) => value === "blocked"
      )
    ).toHaveLength(15);
  });

  it("returns isolated partial drafts, retained payloads, audits and gates", () => {
    const params = legacyParams("erp");
    params.set("cv", "3750000");
    const migration = migrateLegacyCalculatorParams(params);
    const original = structuredClone(migration);
    const first = ready(
      createScenarioDraftFromLegacyMigration(migration, true)
    );
    const second = ready(
      createScenarioDraftFromLegacyMigration(migration, true)
    );

    first.draft.economicAssumptions.contractValue.central = 1;
    first.audit.retainedLegacyInputs.contractValue = 2;
    if (first.gate.result.status === "partial") {
      first.gate.result.draftState.retainedLegacyInputs.contractValue = 3;
    }
    first.gate.audit.fieldDispositions[0].materializedPaths.push("mutated");

    expect(second.draft.economicAssumptions.contractValue.central).toBe(
      3_750_000
    );
    expect(second.audit.retainedLegacyInputs.contractValue).toBe(3_750_000);
    expect(second.gate.audit).toEqual(second.audit);
    expect(migration).toEqual(original);
  });

  it("rejects confirmation-only canonical-draft bypass and accepts only the adapter-bound partial gate", () => {
    const params = legacyParams("erp");
    params.set("cv", "3750000");
    params.set("dci", "9999");
    const migration = migrateLegacyCalculatorParams(params);
    const canonical = createScenarioDraft("erp_transformation_discovery");

    expect(() =>
      buildCalculationInputFromDraft(canonical, {
        kind: "legacy_migration",
        result: migration,
        confirmed: true,
      })
    ).toThrow(/adapter.*audit/i);

    const result = ready(
      createScenarioDraftFromLegacyMigration(migration, true)
    );
    const input = buildCalculationInputFromDraft(result.draft, result.gate);
    expect(input.dailyCostOfInaction.central).toBe(9_999);

    result.draft.economicAssumptions.contractValue.central = 3_000_000;
    expect(() =>
      buildCalculationInputFromDraft(result.draft, result.gate)
    ).toThrow(/contractValue.*(?:low <= central|range)/i);
  });

  it("builds one atomic record whose assumptions, calculation and migration audit agree", () => {
    const params = legacyParams("erp");
    params.set("cv", "3750000");
    params.set("dci", "100");
    const result = ready(
      createScenarioDraftFromLegacyMigration(
        migrateLegacyCalculatorParams(params),
        true
      )
    );

    const record = buildDecisionRecordV2(result.draft, result.gate);

    expect(record.assumptions.contractValue.central).toBe(3_750_000);
    expect(record.assumptions.dailyCostOfInaction.central).toBe(100);
    expect(record.metadata.migration.audit).toEqual(result.audit);
    expect(record.metadata.migration.audit).not.toBe(result.audit);
    expect(record.metadata.migration.audit?.retainedLegacyInputs).toEqual(
      result.gate.result.status === "partial"
        ? result.gate.result.draftState.retainedLegacyInputs
        : null
    );
    expect(record.calculationAnchors).toContainEqual(
      expect.objectContaining({
        path: "dailyCostOfInaction",
        evidenceClass: "user_input",
        evidenceIds: [
          "legacy-v1.erp.retainedLegacyInputs.dailyCostOfInaction",
        ],
      })
    );
    expect(record.externalEvidence.map(({ id }) => id)).not.toContain(
      "legacy-v1.erp.retainedLegacyInputs.contractValue"
    );
    expect(record.retainedAssumptions.map(({ id }) => id)).not.toContain(
      "legacy-v1.erp.retainedLegacyInputs.contractValue"
    );
  });
});
