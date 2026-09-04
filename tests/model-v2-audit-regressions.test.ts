import { describe, expect, it } from "vitest";

import {
  buildCalculationInputFromDraft,
  buildDecisionRecordV2,
  calculateComparison,
  createScenarioDraft,
  type CalibratedValue,
  type ProcessMapStep,
} from "@/lib/model-v2";
import { calculateSwappedComparisonForDiagnostics } from "@/lib/model-v2/engine";

function fixed(value: number): CalibratedValue {
  return { low: value, central: value, high: value, rangeKind: "fixed", evidenceClass: "user_input", evidenceIds: [] };
}

function step(id: string, days: number, predecessors: string[] = [], hours = 0): ProcessMapStep {
  return { id, labelKey: id, predecessorIds: predecessors, activeDays: fixed(days), queueDays: fixed(0), roleHours: { buyer: fixed(hours) }, nonLabourCost: fixed(0), kind: "activity" };
}

function draftWithSteps(steps: ProcessMapStep[]) {
  const draft = createScenarioDraft("catalog_calloff_control");
  draft.alternatives.formalSequential.workflowDesign.steps = steps;
  draft.alternatives.adaptiveCompliant.workflowDesign.steps = structuredClone(steps);
  draft.economicAssumptions.dailyCostOfInaction = fixed(100);
  draft.roleHourlyRates.buyer = fixed(50);
  return draft;
}

describe("independent model arithmetic audit", () => {
  it("counts elapsed time on the longest branch and effort on every branch", () => {
    const draft = draftWithSteps([
      step("start", 2, [], 1),
      step("short", 3, ["start"], 2),
      step("long", 7, ["start"], 4),
      step("join", 1, ["short", "long"], 3),
    ]);
    draft.alternatives.formalSequential.workflowDesign.steps[2].queueDays = fixed(2);
    draft.alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost = fixed(75);
    const input = buildCalculationInputFromDraft(draft);
    const result = calculateComparison(input);
    expect(result.formalSequential.elapsedDays.central).toBe(12);
    expect(result.formalSequential.roleCost.central).toBe(500);
    expect(result.formalSequential.nonLabourCost.central).toBe(75);
    expect(result.formalSequential.delayCost.central).toBe(1200);
    expect(result.formalSequential.totalCost.central).toBe(1775);
    expect(result.adaptiveCompliant.totalCost.central).toBe(1500);
    expect(result.deltaCost).toBe(275);
    expect(result.deltaCostOuterEnvelope).toEqual({ low: 275, high: 275 });
    expect(calculateSwappedComparisonForDiagnostics(input).deltaCost).toBe(-275);
  });

  it("retains zero-duration prerequisites and the terminal milestone on the critical path", () => {
    const draft = draftWithSteps([step("start", 0), step("work", 2, ["start"]), step("end", 0, ["work"])]);
    const result = calculateComparison(buildCalculationInputFromDraft(draft));
    expect(result.formalSequential.criticalPathStepIds.central).toEqual(["start", "work", "end"]);
  });

  it("retains a connected critical path when all durations are zero", () => {
    const draft = draftWithSteps([step("start", 0), step("end", 0, ["start"])]);
    const result = calculateComparison(buildCalculationInputFromDraft(draft));
    expect(result.formalSequential.elapsedDays.central).toBe(0);
    expect(result.formalSequential.criticalPathStepIds.central).toEqual(["start", "end"]);
  });

  it.each(["duration", "role", "delay", "nonLabour", "total"] as const)("rejects arithmetic overflow in %s instead of exporting Infinity or null", (field) => {
    const draft = draftWithSteps([step("start", 2, [], 2), step("end", 2, ["start"], 2)]);
    const steps = draft.alternatives.formalSequential.workflowDesign.steps;
    if (field === "duration") steps.forEach((entry) => { entry.activeDays = fixed(1e308); });
    if (field === "role") draft.roleHourlyRates.buyer = fixed(1e308);
    if (field === "delay") draft.economicAssumptions.dailyCostOfInaction = fixed(1e308);
    if (field === "nonLabour") steps.forEach((entry) => { entry.nonLabourCost = fixed(1e308); });
    if (field === "total") {
      steps[0].nonLabourCost = fixed(1e308);
      draft.economicAssumptions.dailyCostOfInaction = fixed(2.5e307);
    }
    expect(() => buildDecisionRecordV2(draft)).toThrow(/finite|overflow/i);
  });

  it("uses one snapshot for both the economic calculation and its recorded assumptions", () => {
    const draft = draftWithSteps([step("work", 2)]);
    const assumptions = structuredClone(draft.economicAssumptions);
    let reads = 0;
    Object.defineProperty(draft, "economicAssumptions", {
      enumerable: true,
      get: () => ({ ...assumptions, dailyCostOfInaction: fixed(++reads === 1 ? 100 : 999) }),
    });
    const record = buildDecisionRecordV2(draft);
    expect(reads).toBe(1);
    expect(record.assumptions.dailyCostOfInaction.central).toBe(100);
    expect(record.alternatives.formalSequential.result.delayCost.central).toBe(200);
  });

  it("shows why an outer envelope crossing zero does not prove a paired sign reversal", () => {
    const draft = createScenarioDraft("catalog_calloff_control");
    const result = calculateComparison(buildCalculationInputFromDraft(draft));
    for (const rangeCase of ["low", "central", "high"] as const) {
      expect(result.formalSequential.totalCost[rangeCase] - result.adaptiveCompliant.totalCost[rangeCase]).toBe(0);
    }
    expect(result.deltaCostOuterEnvelope.low).toBeLessThan(0);
    expect(result.deltaCostOuterEnvelope.high).toBeGreaterThan(0);
  });
});
