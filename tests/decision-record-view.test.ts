import { describe, expect, it } from "vitest";

import { pairedComponentDifferences } from "@/lib/decision-record-view";
import {
  buildDecisionRecordV2,
  createScenarioDraft,
  SCENARIOS_V2,
} from "@/lib/model-v2";

describe("paired component differences", () => {
  it.each(SCENARIOS_V2)("reconciles each paired case for $id", ({ id }) => {
    const record = buildDecisionRecordV2(createScenarioDraft(id));
    const before = structuredClone(record);
    const components = pairedComponentDifferences(record);
    const fields = [
      ["role_cost", "roleCost"],
      ["non_labour_cost", "nonLabourCost"],
      ["delay_cost", "delayCost"],
      ["contract_cost", "contractCost"],
    ] as const;

    expect(components.map(({ id }) => id)).toEqual(fields.map(([id]) => id));
    for (const member of ["low", "central", "high"] as const) {
      for (const [index, [, field]] of fields.entries()) {
        expect(components[index].difference[member]).toBe(
          record.alternatives.formalSequential.result[field][member]
            - record.alternatives.adaptiveCompliant.result[field][member]
        );
      }
      const sum = components.reduce(
        (total, { difference }) => total + difference[member],
        0
      );
      expect(Math.abs(sum - record.comparison.deltaCostPairedCases[member]))
        .toBeLessThanOrEqual(1e-6);
    }
    expect(record).toEqual(before);
  });
});
