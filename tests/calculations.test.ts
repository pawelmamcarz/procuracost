import { describe, it, expect } from "vitest";
import {
  calculateCosts,
  type ProcurementInputs,
  type CostBreakdown,
} from "../lib/calculations";
import { SCENARIOS } from "../lib/scenarios";
import { PROCESS_RIGIDITY, type ProcessType, type TechLevelId } from "../lib/process-templates";

// A base stakeholder map reused across cases (values are irrelevant to the
// rigidity-driven invariants under test, which depend only on process/tech/context).
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
    processType: "pzp_eu",
    techLevel: "manual",
    stakeholders: STAKEHOLDERS,
    dailyCostOfInaction: 10_000,
    renegotiationCost: 100_000,
    bypassAuditExposure: 100_000,
    ...overrides,
  };
}

// Mirrors the constants in lib/calculations.ts (not exported).
const BASE_RENEGOTIATION_PROBABILITY = 0.22;
const RENEGOTIATION_PREMIUM_MAX = 0.105;

describe("(a) renegotiation premium is capped at RENEGOTIATION_PREMIUM_MAX", () => {
  const REN_COST = 1_000_000;

  it("never exceeds the base + max-premium ceiling across all process/context combos", () => {
    const processTypes = Object.keys(PROCESS_RIGIDITY) as ProcessType[];
    const spendTypes: Array<ProcurementInputs["spendType"]> = [undefined, "direct", "indirect"];
    const phases: Array<ProcurementInputs["processPhase"]> = [undefined, "upstream", "downstream"];
    const ceiling = BASE_RENEGOTIATION_PROBABILITY + RENEGOTIATION_PREMIUM_MAX;

    for (const processType of processTypes) {
      for (const spendType of spendTypes) {
        for (const processPhase of phases) {
          const r = calculateCosts(
            makeInputs({ processType, spendType, processPhase, renegotiationCost: REN_COST }),
          );
          const rigidProb = r.rigid.renegotiationCost / REN_COST;
          const flexProb = r.flexible.renegotiationCost / REN_COST;
          expect(rigidProb).toBeLessThanOrEqual(ceiling + 1e-9);
          expect(flexProb).toBeLessThanOrEqual(ceiling + 1e-9);
          // premium itself never exceeds the hard cap
          expect(rigidProb - BASE_RENEGOTIATION_PROBABILITY).toBeLessThanOrEqual(
            RENEGOTIATION_PREMIUM_MAX + 1e-9,
          );
        }
      }
    }
  });

  it("actually binds the cap at max rigidity under the strongest context multiplier", () => {
    // pzp_eu (rho=0.95) with direct+upstream (1.15*1.20*1.15 = 1.587) drives
    // 0.077*0.95*1.587 = 0.116 > 0.105 -> clamped to exactly 0.105.
    const r = calculateCosts(
      makeInputs({
        processType: "pzp_eu",
        spendType: "direct",
        processPhase: "upstream",
        renegotiationCost: REN_COST,
      }),
    );
    const rigidProb = r.rigid.renegotiationCost / REN_COST;
    expect(rigidProb).toBeCloseTo(BASE_RENEGOTIATION_PROBABILITY + RENEGOTIATION_PREMIUM_MAX, 9);
  });
});

describe("(b) no dimension's total context uplift exceeds ~x1.5", () => {
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
      const base = calculateCosts(s.inputs).rigid;
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
    // Sanity: the audit actually exercised meaningful uplift (documented max ~1.483).
    expect(worst).toBeGreaterThan(1.2);
  });
});

describe("(c) bypass-fix regression: flexible bypass never exceeds rigid bypass", () => {
  const OPERATIONAL: ProcessType[] = ["catalog_order", "mrp_order"];
  const TECHS: TechLevelId[] = ["manual", "sourcing_tool"];

  for (const processType of OPERATIONAL) {
    for (const techLevel of TECHS) {
      it(`${processType} @ ${techLevel}: flexible <= rigid`, () => {
        const r = calculateCosts(makeInputs({ processType, techLevel }));
        expect(r.flexibleBypassProbability).toBeLessThanOrEqual(r.bypassProbability + 1e-12);
      });
    }
  }

  it("holds for every process type at every tech level (Tunnel/Field invariant)", () => {
    const processTypes = Object.keys(PROCESS_RIGIDITY) as ProcessType[];
    const techs: TechLevelId[] = ["manual", "sourcing_tool", "partial_erp", "end_to_end"];
    for (const processType of processTypes) {
      for (const techLevel of techs) {
        const r = calculateCosts(makeInputs({ processType, techLevel }));
        expect(r.flexibleBypassProbability).toBeLessThanOrEqual(r.bypassProbability + 1e-12);
      }
    }
  });
});

describe("(d) calculateCosts returns finite numbers with a zero-total deltaPercent guard", () => {
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
        dailyCostOfInaction: -100,
        renegotiationCost: -10,
        bypassAuditExposure: -10,
      }),
    );
    expect(Number.isFinite(r.deltaPercent)).toBe(true);
    expect(Number.isFinite(r.rigid.total)).toBe(true);
    expect(r.rigid.total).toBeGreaterThanOrEqual(0);
  });
});
