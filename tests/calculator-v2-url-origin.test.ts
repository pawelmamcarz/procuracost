import { describe, expect, it } from "vitest";

import {
  DEFAULT_SCENARIO_V2_ID,
  adaptLegacyCalculatorBootstrap,
  bootstrapCalculatorUrl,
} from "@/components/calculator-v2/url-bootstrap";
import {
  encodeV2CalculatorState,
  stateForScenarioV2,
} from "@/lib/model-v2";

function exactFleetLegacyParams(): URLSearchParams {
  return new URLSearchParams({
    sid: "fleet",
    pt: "private_formal",
    tl: "partial_erp",
    cv: "5000000",
    tco: "2",
    dur: "2",
    dci: "5000",
    rc: "150000",
    bae: "500000",
    sh: "1:900,3:800,1:1200,1:900,1:1500,1:2500",
  });
}

describe("calculator v2 URL bootstrap", () => {
  it.each([
    ["tracking only", new URLSearchParams({ utm_source: "newsletter" })],
    ["unrelated only", new URLSearchParams({ panel: "evidence" })],
  ])("treats %s query state as empty and opens the declared default", (_label, params) => {
    const result = bootstrapCalculatorUrl(params);

    expect(result).toMatchObject({
      origin: "empty",
      gate: undefined,
      draft: {
        kind: "user_draft",
        derivedFromScenarioId: DEFAULT_SCENARIO_V2_ID,
      },
    });
  });

  it.each(["", "1", "unsupported"])(
    "uses the v2 decoder for a present sv=%j without legacy fallback",
    (schemaVersion) => {
      const result = bootstrapCalculatorUrl(
        new URLSearchParams({ sv: schemaVersion, sid: "fleet" })
      );

      expect(result.origin).toBe("v2");
      expect(result.draft).toBeNull();
      expect(result.gate).toMatchObject({
        kind: "v2_url",
        result: { status: "invalid", canCalculate: false },
      });
      expect(result).not.toHaveProperty("adaptation");
    }
  );

  it("creates the matching draft and v2 gate for a valid native URL", () => {
    const params = encodeV2CalculatorState(
      stateForScenarioV2("public_it_open_with_market_consultation")
    );

    const result = bootstrapCalculatorUrl(params);

    expect(result).toMatchObject({
      origin: "v2",
      result: { status: "valid", canCalculate: true },
      draft: {
        derivedFromScenarioId: "public_it_open_with_market_consultation",
      },
      gate: { kind: "v2_url", result: { status: "valid" } },
    });
  });

  it.each([
    ["v2-era state without sv", new URLSearchParams({ mv: "2.3.0" })],
    ["unknown legacy scenario", new URLSearchParams({ sid: "unknown" })],
    ["missing legacy scenario", new URLSearchParams({ cv: "1000" })],
  ])("routes recognised %s through explicit blocked migration", (_label, params) => {
    const result = bootstrapCalculatorUrl(params);

    expect(result).toMatchObject({
      origin: "legacy",
      result: { status: "ambiguous", canCalculate: false },
      adaptation: { status: "blocked", draft: null, gate: null },
      draft: null,
      gate: null,
    });
  });

  it("uses the reviewed adapter for an exact legacy link without confirmation", () => {
    const result = bootstrapCalculatorUrl(exactFleetLegacyParams());

    expect(result).toMatchObject({
      origin: "legacy",
      result: { status: "exact", canCalculate: true },
      adaptation: {
        status: "ready",
        draft: { derivedFromScenarioId: "fleet_tco_reframing" },
        gate: {
          kind: "legacy_migration",
          result: { status: "exact" },
          audit: { legacyScenarioId: "fleet" },
        },
      },
      draft: { derivedFromScenarioId: "fleet_tco_reframing" },
      gate: { kind: "legacy_migration", result: { status: "exact" } },
    });
  });

  it("materialises a representable partial migration only through the reviewed adapter", () => {
    const params = exactFleetLegacyParams();
    params.set("cv", "5100000");
    const initial = bootstrapCalculatorUrl(params);

    expect(initial).toMatchObject({
      origin: "legacy",
      result: { status: "partial" },
      adaptation: { status: "blocked", draft: null, gate: null },
    });
    if (initial.origin !== "legacy") throw new Error("Expected legacy bootstrap");

    const confirmed = adaptLegacyCalculatorBootstrap(initial.result, true);

    expect(confirmed).toMatchObject({
      status: "ready",
      draft: {
        economicAssumptions: {
          contractValue: { low: 5100000, central: 5100000, high: 5100000 },
        },
      },
      gate: {
        kind: "legacy_migration",
        confirmed: true,
        audit: { legacyScenarioId: "fleet" },
      },
    });
  });

  it("keeps confirmation from silently dropping an unrepresentable legacy change", () => {
    const params = exactFleetLegacyParams();
    params.set("tco", "4");
    const initial = bootstrapCalculatorUrl(params);
    if (initial.origin !== "legacy") throw new Error("Expected legacy bootstrap");

    const confirmed = adaptLegacyCalculatorBootstrap(initial.result, true);

    expect(confirmed).toMatchObject({
      status: "blocked",
      draft: null,
      gate: null,
      issues: [
        expect.objectContaining({
          code: "unrepresentable_changed_field",
          field: "retainedLegacyInputs.tcoHorizonYears",
        }),
      ],
    });
  });

  it("ignores unrelated query parameters alongside valid calculator state", () => {
    const params = encodeV2CalculatorState(
      stateForScenarioV2("fleet_tco_reframing")
    );
    params.set("utm_campaign", "model-2-3");

    expect(bootstrapCalculatorUrl(params)).toMatchObject({
      origin: "v2",
      result: { status: "valid" },
      draft: { derivedFromScenarioId: "fleet_tco_reframing" },
    });
  });
});
