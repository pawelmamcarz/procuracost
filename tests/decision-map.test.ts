import { describe, expect, it } from "vitest";
import {
  buildDecisionRegimes,
  classifyDecisionRange,
} from "@/lib/decision-map";

describe("decision-map uncertainty classification", () => {
  it("calls formal robust only when the whole combined range is negative", () => {
    expect(classifyDecisionRange(-20, -1)).toBe("formal");
  });

  it("calls adaptive robust only when the whole combined range is positive", () => {
    expect(classifyDecisionRange(1, 20)).toBe("adaptive");
  });

  it("calls assumptions decisive whenever the combined range crosses zero", () => {
    expect(classifyDecisionRange(-1, 20)).toBe("undecided");
    expect(classifyDecisionRange(-20, 1)).toBe("undecided");
    expect(classifyDecisionRange(0, 20)).toBe("undecided");
    expect(classifyDecisionRange(-20, 0)).toBe("undecided");
  });
});

describe("decision-map regime construction", () => {
  it("samples the combined envelope in 100 PLN steps and compresses equal regimes", () => {
    const national = buildDecisionRegimes().find(({ id }) => id === "pzpNational");

    expect(national?.segments).toEqual([
      { from: 0, to: 1_300, kind: "undecided" },
      { from: 1_300, to: 6_000, kind: "adaptive" },
    ]);
  });

  it("reads the central marker from the model decision threshold", () => {
    const largeEu = buildDecisionRegimes().find(({ id }) => id === "pzpEuLarge");

    expect(largeEu?.centralAt).toBeCloseTo(878.108269935186, 10);
  });
});
