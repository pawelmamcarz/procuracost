import { describe, expect, it } from "vitest";

import { buildDecisionRecordV2 } from "@/lib/model-v2/decision-record";
import {
  buildScenarioDiagnostic,
  classifyComparisonSign,
  renderDiagnosticsMarkdown,
  runCanonicalDiagnostics,
} from "@/lib/model-v2/diagnostics";
import {
  SCENARIO_V2_IDS,
  createScenarioDraft,
} from "@/lib/model-v2/scenarios";

function records() {
  return SCENARIO_V2_IDS.map((id) =>
    buildDecisionRecordV2(createScenarioDraft(id))
  );
}

describe("native model 2.3 diagnostics", () => {
  it.each([
    [-10, -20, -1, "formalSequential_lower"],
    [10, 1, 20, "adaptiveCompliant_lower"],
    [0, 0, 0, "equal"],
    [3, -2, 8, "crosses_zero"],
    [-3, -8, 2, "crosses_zero"],
  ] as const)(
    "classifies delta %s in range %s..%s as %s",
    (deltaCost, low, high, expected) => {
      expect(
        classifyComparisonSign({
          deltaCost,
          deltaCostOuterEnvelope: { low, high },
        })
      ).toBe(expected);
    }
  );

  it("builds finite ordered diagnostics for all canonical records", () => {
    const report = runCanonicalDiagnostics(records());

    expect(report.scenarioOrder).toEqual(SCENARIO_V2_IDS);
    expect(report.scenarios).toHaveLength(10);
    expect(report.invariants).toEqual({
      metadataConsistent: true,
      rangesOrdered: true,
      deltaIdentity: true,
      controlsNeutral: true,
      publicLegalWaitsLockedAndShared: true,
    });
    for (const scenario of report.scenarios) {
      for (const range of [
        scenario.formalSequential.totalCost,
        scenario.adaptiveCompliant.totalCost,
      ]) {
        expect(Object.values(range).every(Number.isFinite)).toBe(true);
        expect(range.low).toBeLessThanOrEqual(range.central);
        expect(range.central).toBeLessThanOrEqual(range.high);
      }
      expect(scenario.comparison.deltaCost).toBe(
        scenario.formalSequential.totalCost.central -
          scenario.adaptiveCompliant.totalCost.central
      );
      expect(scenario.comparison.deltaCostOuterEnvelope).toEqual({
        low:
          scenario.formalSequential.totalCost.low -
          scenario.adaptiveCompliant.totalCost.high,
        high:
          scenario.formalSequential.totalCost.high -
          scenario.adaptiveCompliant.totalCost.low,
      });
    }
  });

  it("keeps catalogue and MRP controls neutral without collapsing declared ranges", () => {
    const report = runCanonicalDiagnostics(records());
    for (const id of ["catalog_calloff_control", "mrp_release_control"] as const) {
      const scenario = report.scenarios.find(({ scenarioId }) => scenarioId === id)!;
      expect(scenario.formalSequential).toEqual(scenario.adaptiveCompliant);
      expect(scenario.comparison.operation).toBe(
        "formalSequential_minus_adaptiveCompliant"
      );
      expect(scenario.comparison.deltaCost).toBe(0);
      expect(scenario.comparison.deltaCostOuterEnvelope.low).toBe(
        -scenario.comparison.deltaCostOuterEnvelope.high
      );
      expect(scenario.sign).toBe("crosses_zero");
    }
  });

  it("keeps public legal waits locked and shared between alternatives", () => {
    const record = records().find(
      ({ metadata }) =>
        metadata.scenarioId === "public_it_open_with_market_consultation"
    )!;
    const diagnostic = buildScenarioDiagnostic(record);
    expect(diagnostic.legalWaits).toEqual([
      {
        ruleId: "pl-pzp-art-138-1",
        provision: "PZP art. 138 ust. 1",
        lockedActiveDays: 0,
        lockedQueueDays: 35,
        alternativeIds: ["formalSequential", "adaptiveCompliant"],
      },
      {
        ruleId: "pl-pzp-art-264-1",
        provision: "PZP art. 264 ust. 1",
        lockedActiveDays: 0,
        lockedQueueDays: 10,
        alternativeIds: ["formalSequential", "adaptiveCompliant"],
      },
    ]);
  });

  it.each([
    ["metadata", (values: ReturnType<typeof records>) => {
      (values[0].metadata as { modelVersion: string }).modelVersion = "forged";
    }],
    ["range", (values: ReturnType<typeof records>) => {
      values[0].alternatives.formalSequential.result.totalCost.low =
        values[0].alternatives.formalSequential.result.totalCost.high + 1;
    }],
    ["delta identity", (values: ReturnType<typeof records>) => {
      values[0].comparison.deltaCost += 1;
    }],
    ["control neutrality", (values: ReturnType<typeof records>) => {
      const control = values.find(
        ({ metadata }) => metadata.scenarioId === "catalog_calloff_control"
      )!;
      control.comparison.deltaCost = 1;
    }],
    ["legal wait", (values: ReturnType<typeof records>) => {
      const publicRecord = values.find(
        ({ metadata }) =>
          metadata.scenarioId === "public_it_open_with_market_consultation"
      )!;
      publicRecord.legalProvenance[0].lockedQueueDays += 1;
    }],
  ] as const)("rejects a deliberately corrupted %s", (_label, mutate) => {
    const values = structuredClone(records());
    mutate(values);
    expect(() => runCanonicalDiagnostics(values)).toThrow();
  });

  it("renders deterministic diagnostics without a preferred-sign claim", () => {
    const report = runCanonicalDiagnostics(records());
    const first = renderDiagnosticsMarkdown(report);
    const second = renderDiagnosticsMarkdown(report);
    expect(second).toBe(first);
    expect(first).toContain("formalSequential − adaptiveCompliant");
    expect(first).not.toMatch(/winner|recommended|confidence|robustly favours/i);
  });
});
