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

function expectedFeasible(f: ProcurementFeatures): PathId[] {
  if (!f.isPublicSector) return GENERAL;
  if (f.contractValue < PZP_EXEMPTION_PLN) return GENERAL;
  const euThreshold = f.procurementObject === "works"
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
                const rec = optimize(f, "pl").topPath.path.id;
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
    const rec = optimize(f, "pl").topPath.path.id;
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
    const rec = result.topPath.path.id;
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
      expect(entry.confidence).toBeGreaterThanOrEqual(0);
      expect(entry.confidence).toBeLessThanOrEqual(1);
    }
    for (const feature of first.featureImportance) {
      expect(Number.isFinite(feature.importance)).toBe(true);
    }
  });
});
