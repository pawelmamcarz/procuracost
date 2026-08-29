import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import { calculateComparison } from "@/lib/model-v2/engine";
import {
  createScenarioDraft,
  LEGACY_SCENARIO_ALIASES,
  SCENARIO_V2_IDS,
  SCENARIOS_V2,
} from "@/lib/model-v2/scenarios";

const EXPECTED_ELAPSED_DAYS = {
  fleet_tco_reframing: [44, 24],
  erp_transformation_discovery: [50.6, 27.6],
  logistics_service_redesign: [44, 24],
  critical_material_continuity: [61.6, 33.6],
  public_it_open_with_market_consultation: [87, 71],
  stable_private_standard_service: [14, 14],
  stable_capex_replacement: [120, 84],
  discovery_solution_codesign: [34, 47],
  catalog_calloff_control: [2.1, 2.1],
  mrp_release_control: [1.4, 1.4],
} as const;

function calculationBoundaryDigest(): string {
  const projection = SCENARIOS_V2.map(
    ({
      id,
      context,
      designIds,
      economicAssumptions,
      calculationInput,
    }) => ({
      id,
      context,
      designIds,
      economicAssumptions,
      calculationInput,
    })
  );

  return createHash("sha256")
    .update(JSON.stringify(projection))
    .digest("hex");
}

function expectDeeplyFrozen(value: unknown, path = "root"): void {
  if (!value || typeof value !== "object") return;
  expect(Object.isFrozen(value), `${path} must be frozen`).toBe(true);
  for (const [key, nested] of Object.entries(value)) {
    expectDeeplyFrozen(nested, `${path}.${key}`);
  }
}

describe("native model 2.3 retained calculation boundary", () => {
  it("preserves the reviewed model-owned calculation inputs without drift", () => {
    expect(calculationBoundaryDigest()).toBe(
      "760a9f819ecfe4b7cb87695b7bd4336391b87b492e6afa45f344f37cc6e078d8"
    );
  });

  it("keeps canonical scenario order and the reviewed elapsed-day centres", () => {
    expect(SCENARIOS_V2.map(({ id }) => id)).toEqual(SCENARIO_V2_IDS);

    for (const scenario of SCENARIOS_V2) {
      const result = calculateComparison(scenario.calculationInput);
      const [formalDays, adaptiveDays] = EXPECTED_ELAPSED_DAYS[scenario.id];

      expect(result.formalSequential.elapsedDays.central).toBeCloseTo(
        formalDays,
        10
      );
      expect(result.adaptiveCompliant.elapsedDays.central).toBeCloseTo(
        adaptiveDays,
        10
      );
      expect(scenario.source.sourceModelVersion).toBe("2.2.2");
    }
  });

  it("keeps the catalogue and MRP controls neutral when their designs match", () => {
    for (const scenarioId of [
      "catalog_calloff_control",
      "mrp_release_control",
    ] as const) {
      const scenario = SCENARIOS_V2.find(({ id }) => id === scenarioId)!;
      const result = calculateComparison(scenario.calculationInput);

      expect(
        scenario.calculationInput.alternatives.formalSequential
      ).toEqual(scenario.calculationInput.alternatives.adaptiveCompliant);
      expect(result.formalSequential.totalCost).toEqual(
        result.adaptiveCompliant.totalCost
      );
      expect(result.deltaCost).toBe(0);
    }
  });

  it("keeps resolved PZP waits fixed and identical between alternatives", () => {
    const scenario = SCENARIOS_V2.find(
      ({ id }) => id === "public_it_open_with_market_consultation"
    )!;

    for (const alternative of [
      scenario.calculationInput.alternatives.formalSequential,
      scenario.calculationInput.alternatives.adaptiveCompliant,
    ]) {
      const legalWaits = alternative.workflowDesign.steps
        .filter(({ kind }) => kind === "legal_wait")
        .map(({ queueDays, lockedLegalProvenance }) => ({
          queueDays,
          lockedLegalProvenance,
        }));

      expect(legalWaits).toEqual([
        {
          queueDays: {
            low: 35,
            central: 35,
            high: 35,
            rangeKind: "fixed",
            evidenceClass: "legal_rule",
            evidenceIds: ["pl-pzp-art-138-1"],
          },
          lockedLegalProvenance: {
            legalRulesetId: "pl-pzp-2026-2027",
            ruleId: "pl-pzp-art-138-1",
            provision: "PZP art. 138 ust. 1",
            initiatedOn: "2026-08-28",
            lockedActiveDays: 0,
            lockedQueueDays: 35,
          },
        },
        {
          queueDays: {
            low: 10,
            central: 10,
            high: 10,
            rangeKind: "fixed",
            evidenceClass: "legal_rule",
            evidenceIds: ["pl-pzp-art-264-1"],
          },
          lockedLegalProvenance: {
            legalRulesetId: "pl-pzp-2026-2027",
            ruleId: "pl-pzp-art-264-1",
            provision: "PZP art. 264 ust. 1",
            initiatedOn: "2026-08-28",
            lockedActiveDays: 0,
            lockedQueueDays: 10,
          },
        },
      ]);
    }
  });

  it("protects the canonical registry while returning isolated mutable drafts", () => {
    expectDeeplyFrozen(SCENARIO_V2_IDS, "scenarioIds");
    expectDeeplyFrozen(SCENARIOS_V2, "scenarios");
    expectDeeplyFrozen(LEGACY_SCENARIO_ALIASES, "legacyAliases");

    const first = createScenarioDraft("fleet_tco_reframing");
    const second = createScenarioDraft("fleet_tco_reframing");
    first.economicAssumptions.contractValue.central = 123;
    first.alternatives.formalSequential.workflowDesign.steps[0].activeDays.central =
      456;

    expect(second.economicAssumptions.contractValue.central).toBe(5_000_000);
    expect(
      second.alternatives.formalSequential.workflowDesign.steps[0].activeDays
        .central
    ).toBe(4);
    expect(calculationBoundaryDigest()).toBe(
      "760a9f819ecfe4b7cb87695b7bd4336391b87b492e6afa45f344f37cc6e078d8"
    );
  });
});
