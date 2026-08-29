import { describe, expect, it } from "vitest";

import {
  buildModelAssumptionsData,
  MODEL_ASSUMPTIONS_DATA,
} from "@/components/model-assumptions/model-assumptions-data";
import {
  EVIDENCE_REGISTRY,
  MODEL_V2_METADATA,
  OFFICIAL_EVIDENCE_IDS,
  SCENARIO_V2_IDS,
  SCENARIOS_V2,
} from "@/lib/model-v2";

const CALIBRATED_VALUE_FIELDS = [
  "central",
  "evidenceClass",
  "evidenceIds",
  "high",
  "low",
  "rangeKind",
] as const;

function expectDeeplyFrozen(value: unknown, path = "root"): void {
  if (!value || typeof value !== "object") return;
  expect(Object.isFrozen(value), `${path} must be frozen`).toBe(true);
  for (const [key, nested] of Object.entries(value)) {
    expectDeeplyFrozen(nested, `${path}.${key}`);
  }
}

describe("server-safe model assumptions data", () => {
  it("projects all scenarios in canonical order with the exact six context axes", () => {
    expect(MODEL_ASSUMPTIONS_DATA.metadata).toEqual(MODEL_V2_METADATA);
    expect(MODEL_ASSUMPTIONS_DATA.scenarios.map(({ id }) => id)).toEqual(
      SCENARIO_V2_IDS
    );

    for (const [index, scenario] of MODEL_ASSUMPTIONS_DATA.scenarios.entries()) {
      const source = SCENARIOS_V2[index];
      expect(scenario.axes).toEqual([
        { id: "legalGovernanceBoundary", value: source.context.boundaryId },
        { id: "procedureFamily", value: source.context.procedureFamilyId },
        { id: "purchaseArchetype", value: source.context.purchaseArchetypeId },
        { id: "executionChannel", value: source.context.executionChannelId },
        { id: "systemSupport", value: source.context.systemSupportId },
        { id: "initiatedOn", value: source.context.initiatedOn },
      ]);
    }
  });

  it("discloses every calibrated field without changing native economics", () => {
    for (const [index, scenario] of MODEL_ASSUMPTIONS_DATA.scenarios.entries()) {
      const source = SCENARIOS_V2[index];
      const expectedIds = [
        "contractValue",
        "dailyCostOfInaction",
        ...(source.economicAssumptions.pathCompetitionDiffers
          ? ["competitionTransferRate" as const]
          : []),
        "amendmentDifferential",
        "tcoDifferential",
      ];

      expect(scenario.calibratedValues.map(({ id }) => id)).toEqual(expectedIds);
      for (const { id, value } of scenario.calibratedValues) {
        expect(Object.keys(value).sort()).toEqual(CALIBRATED_VALUE_FIELDS);
        expect(value).toEqual(source.economicAssumptions[id]);
      }

      const competition = scenario.calibratedValues.find(
        ({ id }) => id === "competitionTransferRate"
      );
      if (source.economicAssumptions.pathCompetitionDiffers) {
        expect(competition?.value).toEqual({
          low: 0.02,
          central: 0.06,
          high: 0.09,
          rangeKind: "stress",
          evidenceClass: "empirical_anchor",
          evidenceIds: ["szucs_discretion_price_2024"],
        });
      } else {
        expect(competition).toBeUndefined();
      }

      for (const id of ["amendmentDifferential", "tcoDifferential"] as const) {
        const value = scenario.calibratedValues.find(
          (candidate) => candidate.id === id
        )!.value;
        expect(value.central).toBe(0);
        expect(value.low).toBeLessThanOrEqual(0);
        expect(value.high).toBeGreaterThanOrEqual(0);
      }
      expect(scenario.bypass).toEqual({
        id: "informal_bypass",
        status: "notMonetized",
        reasonKey: "reasons.bypassNotMonetized",
        evidenceIds: [],
      });
    }
  });

  it("keeps retained, external, and locked legal provenance separate", () => {
    const retainedIds = MODEL_ASSUMPTIONS_DATA.provenance.retainedAssumptions.map(
      ({ id }) => id
    );
    expect(retainedIds).toEqual(
      SCENARIOS_V2.flatMap(({ assumptions }) => assumptions.map(({ id }) => id))
    );
    expect(MODEL_ASSUMPTIONS_DATA.provenance.externalEvidence).toEqual(
      EVIDENCE_REGISTRY
    );
    expect(
      MODEL_ASSUMPTIONS_DATA.provenance.externalEvidence.some(
        ({ type }) => type === "practitioner_observation"
      )
    ).toBe(false);
    expect(MODEL_ASSUMPTIONS_DATA.provenance.lockedLegalProvenance.length).toBe(
      2
    );

    const calibratedEvidenceIds = new Set(
      MODEL_ASSUMPTIONS_DATA.scenarios.flatMap(({ calibratedValues }) =>
        calibratedValues.flatMap(({ value }) => value.evidenceIds)
      )
    );
    for (const officialId of OFFICIAL_EVIDENCE_IDS) {
      expect(calibratedEvidenceIds.has(officialId)).toBe(false);
    }
    expect(calibratedEvidenceIds.has("procurement-beyond-8")).toBe(false);
  });

  it("derives one genuinely neutral catalogue control from its decision record", () => {
    const { record, mapsIdentical } = MODEL_ASSUMPTIONS_DATA.neutralControl;
    const formal = record.alternatives.formalSequential;
    const adaptive = record.alternatives.adaptiveCompliant;

    expect(record.metadata.scenarioId).toBe("catalog_calloff_control");
    expect(mapsIdentical).toBe(true);
    expect(formal.workflow.steps).toEqual(adaptive.workflow.steps);
    expect(formal.result.totalCost.central).toBe(
      adaptive.result.totalCost.central
    );
    expect(record.comparison.deltaCost).toBe(0);
  });

  it("returns isolated, frozen presentation data without exposing model-owned objects", () => {
    const isolated = buildModelAssumptionsData();

    expectDeeplyFrozen(MODEL_ASSUMPTIONS_DATA);
    expectDeeplyFrozen(isolated);
    expect(MODEL_ASSUMPTIONS_DATA.metadata).not.toBe(MODEL_V2_METADATA);
    expect(MODEL_ASSUMPTIONS_DATA.scenarios[0]).not.toBe(SCENARIOS_V2[0]);
    expect(MODEL_ASSUMPTIONS_DATA.scenarios[0].calibratedValues[0].value).not.toBe(
      SCENARIOS_V2[0].economicAssumptions.contractValue
    );
    expect(MODEL_ASSUMPTIONS_DATA.provenance.externalEvidence[0]).not.toBe(
      EVIDENCE_REGISTRY[0]
    );
    expect(isolated.scenarios[0]).not.toBe(MODEL_ASSUMPTIONS_DATA.scenarios[0]);

    const sharedCentral =
      MODEL_ASSUMPTIONS_DATA.scenarios[0].calibratedValues[0].value.central;
    expect(() => {
      MODEL_ASSUMPTIONS_DATA.scenarios[0].calibratedValues[0].value.central = -1;
    }).toThrow(TypeError);
    expect(() => {
      isolated.provenance.externalEvidence[0].source.titleKey = "changed";
    }).toThrow(TypeError);
    expect(MODEL_ASSUMPTIONS_DATA.scenarios[0].calibratedValues[0].value.central)
      .toBe(sharedCentral);
    expect(sharedCentral).toBe(
      SCENARIOS_V2[0].economicAssumptions.contractValue.central
    );
    expect(EVIDENCE_REGISTRY[0].source.titleKey).not.toBe("changed");
  });
});
