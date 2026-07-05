import { describe, it, expect } from "vitest";
import { optimize, type ProcurementFeatures, type PathId } from "../lib/optimizer";

// Mirrors the hard legal filter in lib/optimizer.ts (feasiblePathIds, not exported).
const PZP_EXEMPTION_PLN = 130_000;
const EU_THRESHOLD_SUPPLIES_SERVICES_PLN = 930_960;
const PUBLIC_COMPETITIVE: PathId[] = [
  "przetarg_otwarty",
  "przetarg_ograniczony",
  "dialog_konkurencyjny",
];
const PUBLIC_BELOW_EU: PathId[] = [
  "tryb_podstawowy",
  "przetarg_otwarty",
  "przetarg_ograniczony",
  "dialog_konkurencyjny",
];
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
  if (f.contractValue < EU_THRESHOLD_SUPPLIES_SERVICES_PLN) return PUBLIC_BELOW_EU;
  return PUBLIC_COMPETITIVE;
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

  it("above the EU threshold (public), only competitive trybów are offered", () => {
    const f = base({ contractValue: 5_000_000, isPublicSector: true, supplyRisk: 5, complexity: 5 });
    const rec = optimize(f, "pl").topPath.path.id;
    expect(PUBLIC_COMPETITIVE).toContain(rec);
    expect(["bezposrednie", "negocjacje", "tryb_podstawowy", "agile"]).not.toContain(rec);
    // every ranked candidate is also within the lawful set
    for (const r of optimize(f, "pl").ranked) {
      expect(PUBLIC_COMPETITIVE).toContain(r.path.id);
    }
  });

  it("in the 130k–EU band (public), single-source/negotiated/agile are excluded", () => {
    const f = base({ contractValue: 300_000, isPublicSector: true, urgencyDays: 10, supplyRisk: 5 });
    const rec = optimize(f, "pl").topPath.path.id;
    expect(PUBLIC_BELOW_EU).toContain(rec);
    expect(["bezposrednie", "negocjacje", "agile"]).not.toContain(rec);
  });

  it("below 130k (public), the national tryb podstawowy is not offered", () => {
    const f = base({ contractValue: 50_000, isPublicSector: true });
    for (const r of optimize(f, "pl").ranked) {
      expect(r.path.id).not.toBe("tryb_podstawowy");
    }
  });
});
