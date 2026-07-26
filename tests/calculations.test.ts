import { describe, it, expect } from "vitest";
import {
  calculateCosts,
  type ProcurementInputs,
  type CostBreakdown,
} from "../lib/calculations";
import { SCENARIOS } from "../lib/scenarios";
import {
  PROCESS_RIGIDITY,
  PROCESS_TEMPLATES,
  TECH_LEVELS,
  deriveStepTimings,
  type ProcessType,
  type TechLevelId,
} from "../lib/process-templates";

// A base stakeholder map reused across cases.
const STAKEHOLDERS: ProcurementInputs["stakeholders"] = {
  buyer: { count: 1, dailyRate: 800 },
  lawyer: { count: 1, dailyRate: 1200 },
  finance: { count: 1, dailyRate: 900 },
  manager: { count: 1, dailyRate: 1500 },
  executive: { count: 1, dailyRate: 2500 },
  requestor: { count: 1, dailyRate: 900 },
};

function makeInputs(overrides: Partial<ProcurementInputs> = {}): ProcurementInputs {
  return {
    contractValue: 5_000_000,
    tcoHorizonYears: 5,
    contractDurationYears: 5,
    processType: "pzp_eu",
    techLevel: "manual",
    stakeholders: STAKEHOLDERS,
    dailyCostOfInaction: 10_000,
    renegotiationCost: 100_000,
    bypassAuditExposure: 100_000,
    ...overrides,
  };
}

describe("(a) renegotiation is an annual contract-amendment frequency", () => {
  const REN_COST = 1_000_000;

  it("uses annual frequency rather than an event probability", () => {
    const processTypes = Object.keys(PROCESS_RIGIDITY) as ProcessType[];
    const spendTypes: Array<ProcurementInputs["spendType"]> = [undefined, "direct", "indirect"];
    const phases: Array<ProcurementInputs["processPhase"]> = [undefined, "upstream", "downstream"];

    for (const processType of processTypes) {
      for (const spendType of spendTypes) {
        for (const processPhase of phases) {
          const r = calculateCosts(
            makeInputs({ processType, spendType, processPhase, renegotiationCost: REN_COST }),
          );
          const { renegotiation } = r.trace;
          expect(renegotiation.annualFrequencyRigid).toBeLessThanOrEqual(0.105 + 1e-9);
          expect(renegotiation.annualFrequencyFlexible).toBeLessThanOrEqual(0.105 + 1e-9);
          expect(renegotiation.expectedCountRigid).toBeCloseTo(
            renegotiation.annualFrequencyRigid * 5,
            12,
          );
          // The reported cost is the PRESENT VALUE of the amendment stream, so it must
          // be strictly below the undiscounted expectation whenever the frequency and
          // the duration are both non-zero.
          const undiscounted = renegotiation.expectedCountRigid * REN_COST;
          if (undiscounted > 0) {
            expect(r.rigid.renegotiationCost).toBeLessThan(undiscounted);
          }
        }
      }
    }
  });

  // Model 2.1 had no discount rate and multiplied the annual frequency by contract
  // duration, so a ten-year contract contributed ten full-value amendment years and
  // `total` mixed a per-event cost with an undiscounted lifetime stream.
  it("discounts the amendment stream to present value at award", () => {
    const undiscounted = calculateCosts(
      makeInputs({ renegotiationCost: REN_COST, contractDurationYears: 10, discountRatePct: 0 }),
    );
    const discounted = calculateCosts(
      makeInputs({ renegotiationCost: REN_COST, contractDurationYears: 10, discountRatePct: 4 }),
    );

    // At a zero rate the model reproduces the undiscounted 2.1 arithmetic exactly.
    expect(undiscounted.rigid.renegotiationCost).toBeCloseTo(
      undiscounted.trace.renegotiation.expectedCountRigid * REN_COST,
      6,
    );

    // A 4% real rate over ten years is worth roughly a fifth of the stream.
    const ratio = discounted.rigid.renegotiationCost / undiscounted.rigid.renegotiationCost;
    expect(ratio).toBeGreaterThan(0.75);
    expect(ratio).toBeLessThan(0.85);
  });

  it("gives both lifecycle channels the same discount treatment", () => {
    // TCO only bites in the high evidence case, so compare the full high-case delta.
    const undiscounted = calculateCosts(makeInputs({ tcoHorizonYears: 3, discountRatePct: 0 }));
    const discounted = calculateCosts(makeInputs({ tcoHorizonYears: 3, discountRatePct: 8 }));
    expect(discounted.uncertainty.highDelta).toBeLessThan(undiscounted.uncertainty.highDelta);
  });

  it("uses separate contract profiles rather than PROCESS_RIGIDITY", () => {
    const publicResult = calculateCosts(makeInputs({ processType: "pzp_eu", renegotiationCost: REN_COST }));
    const operationalResult = calculateCosts(makeInputs({ processType: "mrp_order", renegotiationCost: REN_COST }));
    expect(publicResult.rigid.renegotiationCost).toBeGreaterThan(operationalResult.rigid.renegotiationCost);
    expect(publicResult.trace.renegotiation.annualFrequencyRigid).toBeLessThan(0.22);
  });
});

describe("(b) mandatory legal waits are invariant", () => {
  it("retains PZP publication and standstill in both paths at every tech level", () => {
    for (const processType of ["pzp_eu", "pzp_krajowy"] as const) {
      for (const tech of Object.values(TECH_LEVELS)) {
        const timing = deriveStepTimings(PROCESS_TEMPLATES[processType], tech.timeMultiplier);
        for (const item of timing.steps.filter(({ step }) => step.mandatoryWait)) {
          expect(item.flexibleDays).toBe(item.rigidDays);
          expect(item.rigidDays).toBe(item.step.rigidDays);
        }
        if (processType === "pzp_krajowy") {
          const standstill = timing.steps.find(({ step }) => step.id === "standstill");
          expect(standstill?.rigidDays).toBe(5);
          expect(standstill?.flexibleDays).toBe(5);
        }
      }
    }
  });
});

describe("(c) central break-even threshold", () => {
  it("reconstructs the central delta from non-delay costs and the delay slope", () => {
    const result = calculateCosts(makeInputs({ dailyCostOfInaction: 4_321 }));
    const threshold = result.decisionThreshold;
    const reconstructed = threshold.nonDelayDelta + threshold.effectiveDayDifference * 4_321;
    expect(reconstructed).toBeCloseTo(result.delta, 8);
  });

  // Model 2.1 clamped the threshold at zero, which made "the formal path is already
  // more expensive with the delay bucket removed" indistinguishable from "any positive
  // delay cost tips the result". Those are different claims and the status must
  // separate them. No 2.1 test could fail on the clamp, so it survived unnoticed.
  it("reports a negative threshold instead of clamping it to zero", () => {
    const result = calculateCosts(makeInputs({ dailyCostOfInaction: 4_321 }));
    const { breakEvenDailyCostOfInaction, nonDelayDelta, status } = result.decisionThreshold;
    expect(nonDelayDelta).toBeGreaterThan(0);
    expect(status).toBe("formal_costlier_at_zero_delay");
    expect(breakEvenDailyCostOfInaction).toBeLessThan(0);
  });

  it("reports a genuinely positive threshold when the non-delay delta favours formality", () => {
    // Drive the selection channel hard enough to outweigh process and lifecycle costs:
    // a large contract on a process type with a wide competition gap.
    const result = calculateCosts(
      makeInputs({
        processType: "capex",
        contractValue: 900_000_000,
        renegotiationCost: 0,
        dailyCostOfInaction: 1,
      }),
    );
    const { breakEvenDailyCostOfInaction, nonDelayDelta, status } = result.decisionThreshold;
    expect(nonDelayDelta).toBeLessThan(0);
    expect(status).toBe("threshold_above_zero");
    expect(breakEvenDailyCostOfInaction).toBeGreaterThan(0);
    // Below the threshold the formal path must actually win.
    const below = calculateCosts(
      makeInputs({
        processType: "capex",
        contractValue: 900_000_000,
        renegotiationCost: 0,
        dailyCostOfInaction: Math.floor(breakEvenDailyCostOfInaction! / 2),
      }),
    );
    expect(below.delta).toBeLessThan(0);
  });

  it("reports no threshold when both paths take the same time", () => {
    const result = calculateCosts(makeInputs({ processType: "catalog_order" }));
    expect(result.decisionThreshold.effectiveDayDifference).toBe(0);
    expect(result.decisionThreshold.breakEvenDailyCostOfInaction).toBeNull();
    expect(result.decisionThreshold.status).toBe("no_day_difference");
  });
});

describe("(c3) the uncertainty envelope covers both axes", () => {
  // Through 2.2.0 the envelope varied only the five evidence scalars and held the daily
  // cost of inaction and the step-day templates fixed — the two inputs carrying 80–99% of
  // ΔC. It therefore reported its narrowest uncertainty exactly where the model is least
  // defensible.
  it("reports the evidence and structural axes separately and combines them", () => {
    for (const scenario of SCENARIOS) {
      const u = calculateCosts(scenario.inputs).uncertainty;
      // The combined envelope must contain both single-axis envelopes.
      expect(u.lowDelta).toBeLessThanOrEqual(u.evidenceLowDelta + 1e-6);
      expect(u.lowDelta).toBeLessThanOrEqual(u.structuralLowDelta + 1e-6);
      expect(u.highDelta).toBeGreaterThanOrEqual(u.evidenceHighDelta - 1e-6);
      expect(u.highDelta).toBeGreaterThanOrEqual(u.structuralHighDelta - 1e-6);
      // And it must contain the central point.
      expect(u.lowDelta).toBeLessThanOrEqual(u.centralDelta + 1e-6);
      expect(u.highDelta).toBeGreaterThanOrEqual(u.centralDelta - 1e-6);
    }
  });

  // Before the 2.2.2 recalibration this asserted that the structural axis dominates in
  // EVERY scenario with a day gap — true only because several dailyCostOfInaction values
  // were inflated 3–10× beyond any citable benchmark. After recalibration the property
  // that actually holds is mechanistic, not universal: the structural axis dominates
  // where the delay bucket is large, and the flag must agree with the computed widths.
  it("makes the structural axis dominate when the delay bucket is large", () => {
    const u = calculateCosts(makeInputs({ dailyCostOfInaction: 10_000 })).uncertainty;
    const evidenceWidth = u.evidenceHighDelta - u.evidenceLowDelta;
    const structuralWidth = u.structuralHighDelta - u.structuralLowDelta;
    expect(structuralWidth).toBeGreaterThan(evidenceWidth);
    expect(u.widthDrivenBy).toBe("structural");
  });

  it("keeps widthDrivenBy consistent with the computed axis widths", () => {
    for (const scenario of SCENARIOS) {
      const u = calculateCosts(scenario.inputs).uncertainty;
      const evidenceWidth = u.evidenceHighDelta - u.evidenceLowDelta;
      const structuralWidth = u.structuralHighDelta - u.structuralLowDelta;
      if (u.widthDrivenBy === "structural") {
        expect(structuralWidth).toBeGreaterThan(evidenceWidth * 1.25 - 1);
      } else if (u.widthDrivenBy === "evidence") {
        expect(evidenceWidth).toBeGreaterThan(structuralWidth * 1.25 - 1);
      }
    }
  });

  it("leaves statutory waits invariant under the structural duration perturbation", () => {
    // The structural axis rides on the technology multiplier, which never touches a
    // mandatory wait. A pzp_eu process must keep its 35 + 10 statutory days in every
    // corner of the envelope, so the day gap can never exceed the non-mandatory span.
    const r = calculateCosts(makeInputs({ processType: "pzp_eu", techLevel: "partial_erp" }));
    const mandatory = PROCESS_TEMPLATES.pzp_eu
      .filter((s) => s.mandatoryWait)
      .reduce((sum, s) => sum + s.rigidDays, 0);
    expect(mandatory).toBe(45);
    expect(r.rigidDays).toBeGreaterThanOrEqual(mandatory);
    expect(r.flexibleDays).toBeGreaterThanOrEqual(mandatory);
  });
});

describe("(c2) ΔC decomposition separates the user-supplied delay identity", () => {
  it("splits the delta into process, delay and lifecycle buckets that sum to it", () => {
    for (const scenario of SCENARIOS) {
      const r = calculateCosts(scenario.inputs);
      const d = r.deltaDecomposition;
      expect(d.process + d.delay + d.lifecycle).toBeCloseTo(r.delta, 6);
      expect(r.rigid.processCost + r.rigid.delayCost + r.rigid.lifecycleCost).toBeCloseTo(
        r.rigid.total,
        6,
      );
      expect(r.flexible.processCost + r.flexible.delayCost + r.flexible.lifecycleCost).toBeCloseTo(
        r.flexible.total,
        6,
      );
    }
  });

  it("computes the delay bucket as exactly the day difference times the user's daily cost", () => {
    const dailyCost = 7_777;
    const r = calculateCosts(makeInputs({ dailyCostOfInaction: dailyCost }));
    expect(r.deltaDecomposition.delay).toBeCloseTo(
      (r.rigidDays - r.flexibleDays) * dailyCost,
      6,
    );
  });
});

describe("(d) no dimension's total context uplift exceeds ~x1.5", () => {
  // Mirrors the audit in scripts/recompute.ts.
  const DIMS: Array<keyof CostBreakdown> = [
    "timeCost",
    "adminCost",
    "opportunityCost",
    "productivityCost",
    "renegotiationCost",
    "tcoCost",
    "bypassCost",
  ];
  const COMBOS: Array<{ spendType: "direct" | "indirect"; processPhase: "upstream" | "downstream" }> = [
    { spendType: "direct", processPhase: "upstream" },
    { spendType: "direct", processPhase: "downstream" },
    { spendType: "indirect", processPhase: "upstream" },
    { spendType: "indirect", processPhase: "downstream" },
  ];
  const INVARIANT_MAX = 1.5;

  it("holds for the rigid path across every scenario x combo x dimension", () => {
    let worst = 0;
    for (const s of SCENARIOS) {
      const base = calculateCosts({
        ...s.inputs,
        spendType: undefined,
        processPhase: undefined,
      }).rigid;
      for (const combo of COMBOS) {
        const ctx = calculateCosts({ ...s.inputs, ...combo }).rigid;
        for (const d of DIMS) {
          const b = base[d] as number;
          if (b > 0) {
            const factor = (ctx[d] as number) / b;
            worst = Math.max(worst, factor);
            expect(factor).toBeLessThanOrEqual(INVARIANT_MAX + 1e-9);
          }
        }
      }
    }
    // Sanity: the audit actually exercised the declared combined ×1.265 staff factor.
    expect(worst).toBeGreaterThan(1.2);
  });
});

describe("(e) bypass and uncertainty remain scenario-based", () => {
  it("uses the same neutral central bypass assumption for both paths", () => {
    const processTypes = Object.keys(PROCESS_RIGIDITY) as ProcessType[];
    const techs: TechLevelId[] = ["manual", "sourcing_tool", "partial_erp", "end_to_end"];
    for (const processType of processTypes) {
      for (const techLevel of techs) {
        const r = calculateCosts(makeInputs({ processType, techLevel }));
        expect(r.flexibleBypassProbability).toBeCloseTo(r.bypassProbability, 12);
      }
    }
  });

  it("keeps a formal-path win inside the declared range for operational cases", () => {
    for (const id of ["catalog", "mrp"]) {
      const scenario = SCENARIOS.find((item) => item.id === id)!;
      const result = calculateCosts(scenario.inputs);
      expect(result.uncertainty.lowDelta).toBeLessThan(0);
      expect(result.uncertainty.highDelta).toBeGreaterThan(0);
      expect(result.uncertainty.crossesZero).toBe(true);
    }
  });
});

describe("(f) calculateCosts returns finite numbers with a zero-total deltaPercent guard", () => {
  it("produces only finite numeric outputs for the reference scenarios", () => {
    for (const s of SCENARIOS) {
      const r = calculateCosts(s.inputs);
      for (const d of [r.rigid, r.flexible]) {
        for (const v of Object.values(d)) {
          expect(Number.isFinite(v)).toBe(true);
        }
      }
      expect(Number.isFinite(r.delta)).toBe(true);
      expect(Number.isFinite(r.deltaPercent)).toBe(true);
      expect(Number.isFinite(r.bypassProbability)).toBe(true);
      expect(Number.isFinite(r.flexibleBypassProbability)).toBe(true);
    }
  });

  it("guards deltaPercent to 0 when the flexible total is 0 (no division by zero)", () => {
    // custom process with an empty step list -> zero days and zero staff cost;
    // manual tooling has zero tool cost; zero contract value zeroes every value dim.
    const zeroStakeholders: ProcurementInputs["stakeholders"] = {
      buyer: { count: 0, dailyRate: 0 },
      lawyer: { count: 0, dailyRate: 0 },
      finance: { count: 0, dailyRate: 0 },
      manager: { count: 0, dailyRate: 0 },
      executive: { count: 0, dailyRate: 0 },
      requestor: { count: 0, dailyRate: 0 },
    };
    const r = calculateCosts(
      makeInputs({
        contractValue: 0,
        tcoHorizonYears: 0,
        contractDurationYears: 0,
        processType: "custom",
        customSteps: [],
        techLevel: "manual",
        stakeholders: zeroStakeholders,
        dailyCostOfInaction: 0,
        renegotiationCost: 0,
        bypassAuditExposure: 0,
      }),
    );
    expect(r.flexible.total).toBe(0);
    expect(r.rigid.total).toBe(0);
    expect(r.delta).toBe(0);
    expect(r.deltaPercent).toBe(0);
    expect(Number.isFinite(r.deltaPercent)).toBe(true);
  });

  it("sanitizes negative inputs without producing NaN/Infinity", () => {
    const r = calculateCosts(
      makeInputs({
        contractValue: -1_000_000,
        tcoHorizonYears: -5,
        contractDurationYears: -5,
        dailyCostOfInaction: -100,
        renegotiationCost: -10,
        bypassAuditExposure: -10,
      }),
    );
    expect(Number.isFinite(r.deltaPercent)).toBe(true);
    expect(Number.isFinite(r.rigid.total)).toBe(true);
    expect(r.rigid.total).toBeGreaterThanOrEqual(0);
  });

  it("sanitizes non-finite financial and stakeholder inputs", () => {
    const r = calculateCosts(
      makeInputs({
        contractValue: Number.POSITIVE_INFINITY,
        dailyCostOfInaction: Number.NaN,
        stakeholders: {
          ...STAKEHOLDERS,
          buyer: { count: -2, dailyRate: Number.POSITIVE_INFINITY },
        },
      }),
    );
    expect(Number.isFinite(r.rigid.total)).toBe(true);
    expect(Number.isFinite(r.flexible.total)).toBe(true);
    expect(Number.isFinite(r.delta)).toBe(true);
  });
});
