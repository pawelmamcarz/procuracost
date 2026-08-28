import { describe, expect, it } from "vitest";

import { encodeInputsToParams } from "@/components/calculator-url";
import { modelV2T } from "@/lib/i18n";
import {
  V2_URL_KEYS,
  decodeV2CalculatorParams,
  encodeV2CalculatorState,
  stateForScenarioV2,
} from "@/lib/model-v2/calculator-url";
import {
  LEGACY_SCENARIO_MIGRATIONS,
  migrateLegacyCalculatorParams,
} from "@/lib/model-v2/legacy-migration";
import { SCENARIOS } from "@/lib/scenarios";

const REQUIRED_KEYS = [
  "sv",
  "mv",
  "cid",
  "sid",
  "gb",
  "pf",
  "pa",
  "ec",
  "ss",
  "wdf",
  "wda",
  "cdf",
  "cda",
] as const;

function validationCopyExists(messageKey: string): boolean {
  const key = messageKey.replace(/^validation\./, "") as keyof typeof modelV2T.pl.validation;
  return Boolean(modelV2T.pl.validation[key] && modelV2T.en.validation[key]);
}

describe("model 2.3 calculator URL codec", () => {
  it("round-trips every approved compact axis and metadata field", () => {
    const state = stateForScenarioV2("public_it_open_with_market_consultation");
    const params = encodeV2CalculatorState(state);
    const decoded = decodeV2CalculatorParams(params);

    expect(V2_URL_KEYS).toEqual(REQUIRED_KEYS);
    expect([...params.keys()]).toEqual(REQUIRED_KEYS);
    expect(params.get("sv")).toBe("2");
    expect(params.get("mv")).toBe("2.3.0");
    expect(params.get("cid")).toBe("source-scenario-2026-08-28");
    expect(decoded).toEqual({
      status: "valid",
      canCalculate: true,
      state,
      validationErrors: [],
    });
  });

  it("does not serialize a custom process map or readiness state", () => {
    const state = {
      ...stateForScenarioV2("fleet_tco_reframing"),
      customProcessMap: { steps: [{ id: "private-step" }] },
      readiness: "ready",
    };
    const params = encodeV2CalculatorState(state);

    expect([...params.keys()]).toEqual(REQUIRED_KEYS);
    expect(params.toString()).not.toContain("private-step");
    expect(params.has("readiness")).toBe(false);
  });

  it("rejects an unknown scenario ID with a visible validation error", () => {
    const params = encodeV2CalculatorState(
      stateForScenarioV2("fleet_tco_reframing")
    );
    params.set("sid", "unknown-scenario");

    const decoded = decodeV2CalculatorParams(params);

    expect(decoded.status).toBe("invalid");
    expect(decoded.canCalculate).toBe(false);
    expect(decoded.validationErrors).toContainEqual({
      code: "unknown_id",
      field: "sid",
      value: "unknown-scenario",
      messageKey: "validation.unknownScenario",
    });
    expect(
      decoded.validationErrors.every(({ messageKey }) =>
        validationCopyExists(messageKey)
      )
    ).toBe(true);
  });

  it("rejects a known axis value that belongs to a different scenario", () => {
    const params = encodeV2CalculatorState(
      stateForScenarioV2("fleet_tco_reframing")
    );
    params.set("gb", "pzp_classic_eu");

    const decoded = decodeV2CalculatorParams(params);

    expect(decoded.status).toBe("invalid");
    expect(decoded.validationErrors).toContainEqual({
      code: "scenario_mismatch",
      field: "gb",
      value: "pzp_classic_eu",
      messageKey: "validation.axisMismatch",
    });
  });

  it("rejects incomplete v2 state instead of silently defaulting an axis", () => {
    const params = encodeV2CalculatorState(
      stateForScenarioV2("fleet_tco_reframing")
    );
    params.delete("cda");

    const decoded = decodeV2CalculatorParams(params);

    expect(decoded.status).toBe("invalid");
    expect(decoded.canCalculate).toBe(false);
    expect(decoded.validationErrors).toContainEqual({
      code: "missing_field",
      field: "cda",
      value: null,
      messageKey: "validation.missingField",
    });
  });
});

describe("model 2.3 legacy URL migration", () => {
  it("maps every legacy alias exactly through a manual scenario-specific record", () => {
    expect(Object.keys(LEGACY_SCENARIO_MIGRATIONS)).toEqual([
      "fleet",
      "erp",
      "logistics",
      "production",
      "pipe_vs_field",
      "governance_control",
      "capex_investment",
      "discovery_rd",
      "catalog",
      "mrp",
    ]);

    for (const legacyScenario of SCENARIOS.filter(({ id }) => id !== "custom")) {
      const params = encodeInputsToParams(
        legacyScenario.inputs,
        legacyScenario.id
      );
      const migration = migrateLegacyCalculatorParams(params);

      expect(migration.status, legacyScenario.id).toBe("exact");
      expect(migration.canCalculate, legacyScenario.id).toBe(true);
      expect(migration.readinessInferred).toBe(false);
      if (migration.status === "exact") {
        expect(migration.state.scenarioId).toBe(
          LEGACY_SCENARIO_MIGRATIONS[legacyScenario.id].scenarioId
        );
        expect(migration.fieldsRequiringConfirmation).toEqual([]);
      }
    }
  });

  it("treats an alias-only legacy link as partial and blocked", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );

    expect(migration.status).toBe("partial");
    expect(migration.canCalculate).toBe(false);
    expect(migration.fieldsRequiringConfirmation).toContain(
      "workflowDesignFormalId"
    );
    expect(migration.fieldsRequiringConfirmation).toContain(
      "retainedLegacyInputs.contractValue"
    );
    expect(migration.fieldsRequiringConfirmation).toContain(
      "retainedLegacyInputs.stakeholders.requestor.count"
    );
  });

  it.each([
    ["pt", "workflowDesignFormalId"],
    ["tl", "systemSupportId"],
    ["cv", "retainedLegacyInputs.contractValue"],
    ["tco", "retainedLegacyInputs.tcoHorizonYears"],
    ["dur", "retainedLegacyInputs.contractDurationYears"],
    ["dci", "retainedLegacyInputs.dailyCostOfInaction"],
    ["rc", "retainedLegacyInputs.renegotiationCost"],
    ["bae", "retainedLegacyInputs.bypassAuditExposure"],
    ["sh", "retainedLegacyInputs.stakeholders.requestor.count"],
  ] as const)(
    "blocks a truncated legacy permalink missing %s",
    (missingKey, expectedField) => {
      const scenario = SCENARIOS.find(({ id }) => id === "erp")!;
      const params = encodeInputsToParams(scenario.inputs, scenario.id);
      params.delete(missingKey);

      const migration = migrateLegacyCalculatorParams(params);

      expect(migration.status).toBe("partial");
      expect(migration.canCalculate).toBe(false);
      expect(migration.fieldsRequiringConfirmation).toContain(expectedField);
      expect(migration.validationErrors).toContainEqual(
        expect.objectContaining({
          code: "confirmation_required",
          field: expectedField,
          value: null,
        })
      );
    }
  );

  it("enumerates both designs and preserves a changed legacy process type", () => {
    const scenario = SCENARIOS.find(({ id }) => id === "fleet")!;
    const params = encodeInputsToParams(scenario.inputs, scenario.id);
    params.set("pt", "pzp_krajowy");

    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("partial");
    expect(migration.canCalculate).toBe(false);
    expect(migration.readinessInferred).toBe(false);
    expect(migration.fieldsRequiringConfirmation).toEqual([
      "governanceBoundaryId",
      "procedureFamilyId",
      "purchaseArchetypeId",
      "executionChannelId",
      "workflowDesignFormalId",
      "workflowDesignAdaptiveId",
      "contractDesignFormalId",
      "contractDesignAdaptiveId",
    ]);
    expect(migration.validationErrors.map(({ field }) => field)).toEqual(
      migration.fieldsRequiringConfirmation
    );
    if (migration.status === "partial") {
      expect(migration.draftState.retainedLegacyInputs.processType).toBe(
        "pzp_krajowy"
      );
    }
  });

  it("enumerates retained workflow assumptions and preserves a changed technology level", () => {
    const scenario = SCENARIOS.find(({ id }) => id === "fleet")!;
    const params = encodeInputsToParams(scenario.inputs, scenario.id);
    params.set("tl", "manual");

    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("partial");
    expect(migration.canCalculate).toBe(false);
    expect(migration.readinessInferred).toBe(false);
    expect(migration.fieldsRequiringConfirmation).toEqual([
      "systemSupportId",
      "retainedProcessMap.formalSequential",
      "retainedProcessMap.adaptiveCompliant",
      "retainedRoleEffort.formalSequential",
      "retainedRoleEffort.adaptiveCompliant",
      "retainedNonLabourCost.formalSequential",
      "retainedNonLabourCost.adaptiveCompliant",
    ]);
    expect(migration.fieldsRequiringConfirmation).not.toContain("readiness");
    expect(migration.validationErrors.map(({ field }) => field)).toEqual(
      migration.fieldsRequiringConfirmation
    );
    if (migration.status === "partial") {
      expect(migration.draftState.retainedLegacyInputs.techLevel).toBe(
        "manual"
      );
    }
  });

  it("keeps separate paths and draft values for multiple changed economics", () => {
    const scenario = SCENARIOS.find(({ id }) => id === "erp")!;
    const params = encodeInputsToParams(scenario.inputs, scenario.id);
    params.set("cv", "3750000");
    params.set("tco", "4");
    params.set("dur", "1.5");
    params.set("dci", "9999");
    params.set("rc", "425000");
    params.set("bae", "475000");
    params.set("dr", "7");
    params.set("st", "direct");
    params.set("pp", "upstream");

    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("partial");
    expect(migration.canCalculate).toBe(false);
    expect(migration.fieldsRequiringConfirmation).toEqual([
      "retainedLegacyInputs.contractValue",
      "retainedLegacyInputs.tcoHorizonYears",
      "retainedLegacyInputs.contractDurationYears",
      "retainedLegacyInputs.dailyCostOfInaction",
      "retainedLegacyInputs.renegotiationCost",
      "retainedLegacyInputs.bypassAuditExposure",
      "retainedLegacyInputs.discountRatePct",
      "retainedLegacyInputs.spendType",
      "retainedLegacyInputs.processPhase",
    ]);
    expect(migration.validationErrors.map(({ field }) => field)).toEqual(
      migration.fieldsRequiringConfirmation
    );
    if (migration.status === "partial") {
      expect(migration.draftState.retainedLegacyInputs).toMatchObject({
        contractValue: 3_750_000,
        tcoHorizonYears: 4,
        contractDurationYears: 1.5,
        dailyCostOfInaction: 9_999,
        renegotiationCost: 425_000,
        bypassAuditExposure: 475_000,
        discountRatePct: 7,
        spendType: "direct",
        processPhase: "upstream",
      });
    }
  });

  it("preserves and identifies each changed stakeholder leaf", () => {
    const scenario = SCENARIOS.find(({ id }) => id === "erp")!;
    const params = encodeInputsToParams(scenario.inputs, scenario.id);
    params.set(
      "sh",
      "3:1200,2:1350,1:1500,1:1000,2:1800,1:3000"
    );

    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("partial");
    expect(migration.canCalculate).toBe(false);
    expect(migration.fieldsRequiringConfirmation).toEqual([
      "retainedLegacyInputs.stakeholders.requestor.count",
      "retainedLegacyInputs.stakeholders.buyer.dailyRate",
    ]);
    expect(migration.validationErrors.map(({ field }) => field)).toEqual(
      migration.fieldsRequiringConfirmation
    );
    if (migration.status === "partial") {
      expect(migration.draftState.retainedLegacyInputs.stakeholders).toMatchObject(
        {
          requestor: { count: 3, dailyRate: 1200 },
          buyer: { count: 2, dailyRate: 1350 },
        }
      );
    }
  });

  it.each([
    ["pt", "not-a-process"],
    ["tl", "not-a-technology"],
    ["cv", "not-a-number"],
    ["sh", "broken-stakeholders"],
  ])("returns ambiguous for an unrecognized %s value", (field, value) => {
    const scenario = SCENARIOS.find(({ id }) => id === "erp")!;
    const params = encodeInputsToParams(scenario.inputs, scenario.id);
    params.set(field, value);

    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("ambiguous");
    expect(migration.canCalculate).toBe(false);
    expect(migration.validationErrors).toContainEqual({
      code: "invalid_legacy_value",
      field,
      value,
      messageKey: "validation.legacyInvalidValue",
    });
    expect(validationCopyExists("validation.legacyInvalidValue")).toBe(true);
  });

  it.each([
    ["governance_control", "dci", " "],
    ["governance_control", "tco", "\t"],
    ["catalog", "rc", "\n"],
  ])(
    "rejects whitespace in zero-valued legacy economics (%s.%s)",
    (scenarioId, field, value) => {
      const scenario = SCENARIOS.find(({ id }) => id === scenarioId)!;
      const params = encodeInputsToParams(scenario.inputs, scenario.id);
      params.set(field, value);

      const migration = migrateLegacyCalculatorParams(params);

      expect(migration.status).toBe("ambiguous");
      expect(migration.canCalculate).toBe(false);
      expect(migration.validationErrors).toContainEqual({
        code: "invalid_legacy_value",
        field,
        value,
        messageKey: "validation.legacyInvalidValue",
      });
    }
  );

  it.each([
    ["catalog", "2:800,1:800, :1200,0:900,1:1500,0:2500"],
    ["mrp", "1:800,1:800,0:1200,0:900,\t:1500,0:2500"],
  ])(
    "rejects whitespace in a zero-count stakeholder leaf (%s)",
    (scenarioId, value) => {
      const scenario = SCENARIOS.find(({ id }) => id === scenarioId)!;
      const params = encodeInputsToParams(scenario.inputs, scenario.id);
      params.set("sh", value);

      const migration = migrateLegacyCalculatorParams(params);

      expect(migration.status).toBe("ambiguous");
      expect(migration.canCalculate).toBe(false);
      expect(migration.validationErrors).toContainEqual({
        code: "invalid_legacy_value",
        field: "sh",
        value,
        messageKey: "validation.legacyInvalidValue",
      });
    }
  );

  it("keeps dr, st, and pp optional for an otherwise complete legacy link", () => {
    const scenario = SCENARIOS.find(
      ({ id }) => id === "governance_control"
    )!;
    const params = encodeInputsToParams(scenario.inputs, scenario.id);
    params.delete("dr");
    params.delete("st");
    params.delete("pp");

    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("exact");
    expect(migration.canCalculate).toBe(true);
  });

  it.each([
    [new URLSearchParams(), "missing scenario"],
    [new URLSearchParams({ sid: "custom" }), "custom scenario"],
    [new URLSearchParams({ sid: "not-registered" }), "unknown scenario"],
  ])("returns ambiguous and blocks calculation for %s (%s)", (params) => {
    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("ambiguous");
    expect(migration.canCalculate).toBe(false);
    expect(migration.readinessInferred).toBe(false);
    expect(migration.fieldsRequiringConfirmation.length).toBeGreaterThan(0);
    expect(
      migration.validationErrors.every(({ messageKey }) =>
        validationCopyExists(messageKey)
      )
    ).toBe(true);
  });
});
