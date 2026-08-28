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

  it("returns partial and exposes confirmation fields for a changed legacy axis", () => {
    const scenario = SCENARIOS.find(({ id }) => id === "fleet")!;
    const params = encodeInputsToParams(scenario.inputs, scenario.id);
    params.set("tl", "manual");

    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("partial");
    expect(migration.canCalculate).toBe(false);
    expect(migration.readinessInferred).toBe(false);
    expect(migration.fieldsRequiringConfirmation).toContain("systemSupportId");
    expect(migration.fieldsRequiringConfirmation).not.toContain("readiness");
    expect(migration.validationErrors).toContainEqual({
      code: "confirmation_required",
      field: "ss",
      value: "manual",
      messageKey: "validation.legacyConfirmationRequired",
    });
  });

  it("returns partial for changed economics without defaulting the old value", () => {
    const scenario = SCENARIOS.find(({ id }) => id === "erp")!;
    const params = encodeInputsToParams(scenario.inputs, scenario.id);
    params.set("dci", "9999");

    const migration = migrateLegacyCalculatorParams(params);

    expect(migration.status).toBe("partial");
    expect(migration.canCalculate).toBe(false);
    expect(migration.fieldsRequiringConfirmation).toContain(
      "economicAssumptions"
    );
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
