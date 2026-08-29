import { describe, expect, it } from "vitest";

import {
  auditSwapSymmetry,
  classifyComparisonSign,
  renderSymmetrySweepMarkdown,
  runCanonicalSymmetrySweep,
} from "@/lib/model-v2/diagnostics";
import { SCENARIOS_V2 } from "@/lib/model-v2/scenarios";

describe("native model 2.3 swap-symmetry sweep", () => {
  it("exchanges both results and negates the comparison for every canonical input", () => {
    for (const scenario of SCENARIOS_V2) {
      const audit = auditSwapSymmetry(scenario.calculationInput);
      expect(audit.scenarioId).toBe(scenario.id);
      expect(audit.swapped.formalSequential).toEqual(
        audit.original.adaptiveCompliant
      );
      expect(audit.swapped.adaptiveCompliant).toEqual(
        audit.original.formalSequential
      );
      expect(audit.swapped.deltaCost === -audit.original.deltaCost).toBe(true);
      expect(
        audit.swapped.deltaCostOuterEnvelope.low ===
          -audit.original.deltaCostOuterEnvelope.high
      ).toBe(true);
      expect(
        audit.swapped.deltaCostOuterEnvelope.high ===
          -audit.original.deltaCostOuterEnvelope.low
      ).toBe(true);
      expect(audit.failures).toEqual([]);
    }
  });

  it("covers both directions, equality and crossing without a canonical sign quota", () => {
    const examples = [
      { deltaCost: -3, deltaCostOuterEnvelope: { low: -5, high: -1 } },
      { deltaCost: 3, deltaCostOuterEnvelope: { low: 1, high: 5 } },
      { deltaCost: 0, deltaCostOuterEnvelope: { low: 0, high: 0 } },
      { deltaCost: 1, deltaCostOuterEnvelope: { low: -2, high: 4 } },
    ];
    expect(examples.map(classifyComparisonSign)).toEqual([
      "formalSequential_lower",
      "adaptiveCompliant_lower",
      "equal",
      "crosses_zero",
    ]);
  });

  it("reports only examined inputs and invariant failures", () => {
    const report = runCanonicalSymmetrySweep(
      SCENARIOS_V2.map(({ id, calculationInput }) => ({ id, calculationInput }))
    );
    expect(report).toEqual({
      schemaVersion: 2,
      modelVersion: "2.3.0",
      examined: 10,
      failures: [],
    });
    const rendered = renderSymmetrySweepMarkdown(report);
    expect(rendered).toContain("Examined inputs: 10");
    expect(rendered).toContain("Invariant failures: 0");
    expect(rendered).not.toMatch(/favours|winner|positive|negative|confidence/i);
  });
});
