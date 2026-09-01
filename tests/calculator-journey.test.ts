import { describe, expect, it } from "vitest";

import * as journeyModule from "@/components/calculator-v2/calculator-journey";

type Stage = "case" | "workflows" | "costs" | "record";

const journey = journeyModule as unknown as {
  calculatorStageFromHash: (hash: string, hasRecord: boolean) => Stage;
  calculatorStageHash: (stage: Stage) => string;
  nextCalculatorStage: (stage: Stage, hasRecord: boolean) => Stage;
  previousCalculatorStage: (stage: Stage) => Stage;
  resolveCalculatorStageRequest: (stage: Stage, hasRecord: boolean) => Stage;
};

describe("guided calculator journey", () => {
  it("normalises direct hashes and never opens a missing record", () => {
    expect(journey.calculatorStageFromHash("#case", false)).toBe("case");
    expect(journey.calculatorStageFromHash("#workflows", false)).toBe(
      "workflows"
    );
    expect(journey.calculatorStageFromHash("#costs", false)).toBe("costs");
    expect(journey.calculatorStageFromHash("#record", true)).toBe("record");
    expect(journey.calculatorStageFromHash("#record", false)).toBe("costs");
    expect(journey.calculatorStageFromHash("#unknown", false)).toBe("case");
    expect(journey.calculatorStageFromHash("", false)).toBe("case");
  });

  it("uses stable language-neutral fragments", () => {
    expect(journey.calculatorStageHash("case")).toBe("#case");
    expect(journey.calculatorStageHash("workflows")).toBe("#workflows");
    expect(journey.calculatorStageHash("costs")).toBe("#costs");
    expect(journey.calculatorStageHash("record")).toBe("#record");
  });

  it("moves sequentially while keeping record access conditional", () => {
    expect(journey.nextCalculatorStage("case", false)).toBe("workflows");
    expect(journey.nextCalculatorStage("workflows", false)).toBe("costs");
    expect(journey.nextCalculatorStage("costs", false)).toBe("costs");
    expect(journey.nextCalculatorStage("costs", true)).toBe("record");
    expect(journey.previousCalculatorStage("record")).toBe("costs");
    expect(journey.previousCalculatorStage("costs")).toBe("workflows");
    expect(journey.previousCalculatorStage("workflows")).toBe("case");
    expect(journey.previousCalculatorStage("case")).toBe("case");
  });

  it("accepts a just-created record without reading stale component state", () => {
    expect(journey.resolveCalculatorStageRequest("record", true)).toBe(
      "record",
    );
    expect(journey.resolveCalculatorStageRequest("record", false)).toBe(
      "costs",
    );
  });
});
