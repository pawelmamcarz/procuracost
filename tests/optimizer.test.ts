import { describe, it, expect } from "vitest";
import { optimize, type ProcurementFeatures, type PathId } from "../lib/optimizer";

// Mirrors the hard legal filter in lib/optimizer.ts (feasiblePathIds, not exported).
const PZP_EXEMPTION_PLN = 170_000;
const EU_THRESHOLD_CENTRAL_SUPPLIES_SERVICES_PLN = 603_400;
const EU_THRESHOLD_SUBCENTRAL_SUPPLIES_SERVICES_PLN = 930_960;
const EU_THRESHOLD_WORKS_PLN = 23_291_240;
const PUBLIC_DEFAULT_EU: PathId[] = [
  "przetarg_otwarty",
  "przetarg_ograniczony",
];
const PUBLIC_BELOW_EU: PathId[] = ["tryb_podstawowy"];
const ALL_PATHS: PathId[] = [
  "przetarg_otwarty",
  "przetarg_ograniczony",
  "dialog_konkurencyjny",
  "tryb_podstawowy",
  "negocjacje",
  "agile",
  "bezposrednie",
];
const GENERAL = ALL_PATHS.filter((p) => p !== "tryb_podstawowy");

const EU_THRESHOLD_SOCIAL_SERVICES_PLN = 3_232_500;

function expectedFeasible(f: ProcurementFeatures): PathId[] {
  if (!f.isPublicSector) return GENERAL;
  if ((f.buyerRegime ?? "klasyczny") !== "klasyczny") return [];
  if (f.contractValue < PZP_EXEMPTION_PLN) return GENERAL;
  const euThreshold = f.procurementObject === "uslugi_spoleczne"
    ? EU_THRESHOLD_SOCIAL_SERVICES_PLN
    : f.procurementObject === "works"
      ? EU_THRESHOLD_WORKS_PLN
      : f.authorityLevel === "central"
        ? EU_THRESHOLD_CENTRAL_SUPPLIES_SERVICES_PLN
        : EU_THRESHOLD_SUBCENTRAL_SUPPLIES_SERVICES_PLN;
  if (f.contractValue < euThreshold) return PUBLIC_BELOW_EU;
  return PUBLIC_DEFAULT_EU;
}

function base(overrides: Partial<ProcurementFeatures> = {}): ProcurementFeatures {
  return {
    contractValue: 1_000_000,
    supplierCount: 5,
    complexity: 3,
    urgencyDays: 90,
    isPublicSector: true,
    innovationRequired: false,
    supplyRisk: 3,
    strategicImportance: 3,
    marketMaturity: 3,
    procurementObject: "supplies_services",
    authorityLevel: "subcentral",
    ...overrides,
  };
}

describe("(e) optimize() never recommends a legally filtered-out path", () => {
  const values = [50_000, 300_000, 5_000_000, 25_000_000];
  const bools = [true, false];
  const complexities = [1, 3, 5];
  const urgencies = [10, 60, 180];
  const spend: Array<ProcurementFeatures["spendType"]> = [undefined, "direct", "indirect"];
  const phase: Array<ProcurementFeatures["processPhase"]> = [undefined, "upstream", "downstream"];

  it("stays within the feasible set across a wide feature grid", () => {
    for (const contractValue of values) {
      for (const isPublicSector of bools) {
        for (const complexity of complexities) {
          for (const urgencyDays of urgencies) {
            for (const spendType of spend) {
              for (const processPhase of phase) {
                const f = base({ contractValue, isPublicSector, complexity, urgencyDays, spendType, processPhase });
                const rec = optimize(f, "pl").topPath!.path.id;
                expect(expectedFeasible(f)).toContain(rec);
              }
            }
          }
        }
      }
    }
  });

  it("above the EU threshold (public), only procedures without extra grounds are offered", () => {
    const f = base({ contractValue: 5_000_000, isPublicSector: true, supplyRisk: 5, complexity: 5 });
    const rec = optimize(f, "pl").topPath!.path.id;
    expect(PUBLIC_DEFAULT_EU).toContain(rec);
    expect(["bezposrednie", "negocjacje", "dialog_konkurencyjny", "tryb_podstawowy", "agile"]).not.toContain(rec);
    // every ranked candidate is also within the lawful set
    for (const r of optimize(f, "pl").ranked) {
      expect(PUBLIC_DEFAULT_EU).toContain(r.path.id);
    }
  });

  it("in the 170k–EU band (public), single-source/negotiated/agile are excluded", () => {
    const f = base({ contractValue: 300_000, isPublicSector: true, urgencyDays: 10, supplyRisk: 5 });
    const result = optimize(f, "pl");
    const rec = result.topPath!.path.id;
    expect(PUBLIC_BELOW_EU).toContain(rec);
    expect(result.ranked.map((entry) => entry.path.id)).toEqual(["tryb_podstawowy"]);
    expect(result.featureImportance.every((entry) => entry.importance === 0)).toBe(true);
    expect(result.explanation).toMatch(/filtr prawny/);
  });

  it("below 170k (public), the national tryb podstawowy is not offered", () => {
    const f = base({ contractValue: 50_000, isPublicSector: true });
    for (const r of optimize(f, "pl").ranked) {
      expect(r.path.id).not.toBe("tryb_podstawowy");
    }
  });

  it("uses the works threshold instead of misclassifying all public contracts as services", () => {
    const f = base({ contractValue: 5_000_000, procurementObject: "works" });
    expect(optimize(f, "pl").ranked.map((r) => r.path.id)).toContain("tryb_podstawowy");
  });

  // Art. 359 PZP / Annex XIV: 750,000 EUR × 4.31 = 3,232,500 PLN. Model 2.1 omitted this
  // threshold, so a 1.5M PLN social-services contract was pushed above the EU threshold
  // and tryb podstawowy — the correct and cheaper national procedure — was foreclosed.
  it("uses the art. 359 social-services threshold, not the supplies/services one", () => {
    const f = base({
      contractValue: 1_500_000,
      isPublicSector: true,
      procurementObject: "uslugi_spoleczne",
    });
    const result = optimize(f, "pl");
    expect(result.ranked.map((r) => r.path.id)).toEqual(["tryb_podstawowy"]);

    // Above 3,232,500 PLN the same object crosses into the EU regime.
    const above = optimize(base({
      contractValue: 4_000_000,
      isPublicSector: true,
      procurementObject: "uslugi_spoleczne",
    }), "pl");
    expect(above.ranked.map((r) => r.path.id).sort()).toEqual(
      ["przetarg_ograniczony", "przetarg_otwarty"],
    );
  });

  // Sectoral and defence buyers have different application thresholds and a different
  // procedure catalogue (art. 376). Model 2.1 ran them through the classic ladder and
  // returned a confidently wrong band; 2.2 declines instead.
  it("declines to advise sectoral and defence buyers rather than guessing", () => {
    for (const buyerRegime of ["sektorowy", "obronnosc"] as const) {
      const result = optimize(base({ contractValue: 500_000, isPublicSector: true, buyerRegime }), "pl");
      expect(result.outOfScope).toBe(true);
      expect(result.ranked).toEqual([]);
      expect(result.topPath).toBeUndefined();
      expect(result.policyNote).toMatch(/sektorowe/);
    }
  });

  it("suppresses PZP article citations where the Act does not apply", () => {
    expect(optimize(base({ contractValue: 50_000, isPublicSector: true }), "pl").pzpApplies).toBe(false);
    expect(optimize(base({ contractValue: 5_000_000, isPublicSector: false }), "pl").pzpApplies).toBe(false);
    expect(optimize(base({ contractValue: 5_000_000, isPublicSector: true }), "pl").pzpApplies).toBe(true);
  });

  it("discloses the lawful procedures the filter withholds", () => {
    const above = optimize(base({ contractValue: 5_000_000, isPublicSector: true }), "pl");
    expect(above.withheldProcedures.length).toBeGreaterThan(0);
    expect(above.withheldProcedures.join(" ")).toMatch(/partnerstwo innowacyjne/);
    // No statutory procedures are withheld where the statute does not apply.
    expect(optimize(base({ contractValue: 5_000_000, isPublicSector: false }), "pl").withheldProcedures).toEqual([]);
  });
});

describe("(g) suitability curves match their documented bands", () => {
  // Model 2.1 wrote these as nearRating(clamp01(x / T) * 5, 3): the inner clamp saturated
  // at x = 2T, so every value from 2T up scored a flat 0.5 and the peak sat at 1.2T.
  // Competitive dialogue is documented for "2–5 suppliers" but peaked at 1.2 suppliers.
  it("scores competitive dialogue highest inside its documented 2–5 supplier band", () => {
    const scoreAt = (supplierCount: number) =>
      optimize(base({ supplierCount, contractValue: 5_000_000, isPublicSector: false }), "pl")
        .ranked.find((r) => r.path.id === "dialog_konkurencyjny")!
        .featureContributions.supplierCount;

    expect(scoreAt(2)).toBe(100);
    expect(scoreAt(5)).toBe(100);
    expect(scoreAt(1)).toBeLessThan(100);
    expect(scoreAt(20)).toBeLessThan(scoreAt(5));
    // The 2.1 defect: flat across the whole upper range.
    expect(scoreAt(5)).not.toBe(scoreAt(20));
  });

  it("is deterministic and keeps every score and importance finite", () => {
    const f = base({
      contractValue: Number.POSITIVE_INFINITY,
      supplierCount: Number.NaN,
      complexity: -10,
      urgencyDays: Number.NEGATIVE_INFINITY,
      supplyRisk: 99,
    });
    const first = optimize(f, "pl");
    const second = optimize(f, "pl");
    expect(second).toEqual(first);
    for (const entry of first.ranked) {
      expect(Number.isFinite(entry.score)).toBe(true);
      expect(entry.score).toBeGreaterThanOrEqual(0);
      expect(entry.score).toBeLessThanOrEqual(100);
      expect(entry.weightStability).toBeGreaterThanOrEqual(0);
      expect(entry.weightStability).toBeLessThanOrEqual(1);
    }
    for (const feature of first.featureImportance) {
      expect(Number.isFinite(feature.importance)).toBe(true);
    }
  });
});
