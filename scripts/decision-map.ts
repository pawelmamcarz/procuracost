// Decision-threshold map: for each process category × technology × contract value,
// the daily-cost-of-inaction thresholds that separate three regimes:
//
//   ROBUST FORMAL    — even the most adaptive-friendly evidence case favours the
//                      formal path (delta_high(c_d) < 0)
//   UNDECIDED        — the evidence envelope crosses zero; assumptions decide
//   ROBUST ADAPTIVE  — even the most formal-friendly evidence case favours the
//                      adaptive path (delta_low(c_d) > 0)
//
// Exact, not sampled: delta_case(c_d) = intercept_case + dayDiff × c_d is linear in
// c_d (the evidence cases never change day counts), so each boundary is the root of
// one line. Intercepts are read from calculateCosts at c_d = 0 via the evidence-axis
// envelope; the REAL model code is executed, never re-implemented.
//
// Standardised comparator inputs (NOT the built-in scenarios): duration 2y, TCO
// horizon 2y, renegotiation cost 4% CV per amendment (inside the Bajari 7.5–14%
// lifetime band), audit exposure 10% CV (EC C(2019) 3452 correction scale), default
// stakeholder rates, 4% discount. The map is legality-aware: pzp_krajowy appears only
// in its statutory 170k–EU band, pzp_eu only at/above the EU threshold.
//
// Run: npm run map. Writes replication/outputs/decision-thresholds.md.

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { calculateCosts, type ProcurementInputs } from "../lib/calculations";
import type { ProcessType, TechLevelId } from "../lib/process-templates";
import { LEGACY_MODEL_VERSION } from "../lib/version";

const STAKE: ProcurementInputs["stakeholders"] = {
  requestor: { count: 1, dailyRate: 900 },
  buyer: { count: 1, dailyRate: 800 },
  lawyer: { count: 1, dailyRate: 1200 },
  finance: { count: 1, dailyRate: 900 },
  manager: { count: 1, dailyRate: 1500 },
  executive: { count: 1, dailyRate: 2500 },
};

const TECHS: TechLevelId[] = ["manual", "partial_erp", "end_to_end"];
const EU_SUBCENTRAL = 930_960;

// Legality-aware CV grids per category (PLN).
const CV_GRID: Record<Exclude<ProcessType, "custom">, number[]> = {
  pzp_eu: [2_000_000, 5_000_000, 20_000_000],
  pzp_krajowy: [200_000, 500_000, 900_000],
  private_formal: [500_000, 2_000_000, 5_000_000, 20_000_000],
  policy_only: [500_000, 2_000_000, 5_000_000],
  discovery: [500_000, 2_000_000, 5_000_000],
  capex: [2_000_000, 5_000_000, 20_000_000],
  catalog_order: [50_000, 200_000],
  mrp_order: [200_000, 500_000],
};

interface Row {
  type: string;
  tech: TechLevelId;
  cv: number;
  dayDiff: number;
  robustFormalBelow: number | null;   // c_d below which formal wins in every evidence case
  centralAt: number | null;           // c_d at which the central case flips
  robustAdaptiveAbove: number | null; // c_d above which adaptive wins in every evidence case
  verdictNoDelay: string;             // regime when delay cost is ~0
}

function fmt(v: number | null): string {
  if (v === null) return "—";
  if (!Number.isFinite(v)) return "∞";
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(Math.round(v));
}
function fmtCV(v: number): string {
  return v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1000}k`;
}

const rows: Row[] = [];
for (const type of Object.keys(CV_GRID) as Array<Exclude<ProcessType, "custom">>) {
  for (const tech of TECHS) {
    for (const cv of CV_GRID[type]) {
      if (type === "pzp_krajowy" && cv >= EU_SUBCENTRAL) continue;
      const r = calculateCosts({
        contractValue: cv,
        tcoHorizonYears: 2,
        contractDurationYears: 2,
        processType: type,
        techLevel: tech,
        stakeholders: STAKE,
        dailyCostOfInaction: 0,
        renegotiationCost: cv * 0.04,
        bypassAuditExposure: cv * 0.10,
      });
      const dd = r.rigidDays - r.flexibleDays;
      // Intercepts of delta(c_d) at c_d = 0, per evidence case.
      const iLow = r.uncertainty.evidenceLowDelta;   // most formal-friendly
      const iHigh = r.uncertainty.evidenceHighDelta; // most adaptive-friendly
      const iCentral = r.delta;

      let robustFormalBelow: number | null = null;
      let robustAdaptiveAbove: number | null = null;
      let centralAt: number | null = null;
      if (dd > 0) {
        // delta rises in c_d: formal robust below root of the HIGH case, adaptive
        // robust above root of the LOW case.
        robustFormalBelow = Math.max(0, -iHigh / dd);
        robustAdaptiveAbove = Math.max(0, -iLow / dd);
        centralAt = Math.max(0, -iCentral / dd);
      } else if (dd < 0) {
        // Inverted category (discovery): delta FALLS in c_d — the formal path is the
        // faster one, so a higher delay cost helps formality.
        robustFormalBelow = null; // formal region is ABOVE a threshold here
        robustAdaptiveAbove = null;
        centralAt = -iCentral / dd >= 0 ? -iCentral / dd : 0;
      }

      const verdictNoDelay =
        iHigh < 0 ? "formalna (odpornie)"
        : iLow > 0 ? "adaptacyjna (odpornie)"
        : iCentral < 0 ? "formalna (centralnie)"
        : iCentral > 0 ? "adaptacyjna (centralnie)"
        : "remis";

      rows.push({ type, tech, cv, dayDiff: dd, robustFormalBelow, centralAt, robustAdaptiveAbove, verdictNoDelay });
    }
  }
}

// ── Console + markdown output ────────────────────────────────────────────────
const lines: string[] = [];
const P = (s: string) => { console.log(s); lines.push(s); };

P(`# Mapa progów decyzyjnych (archiwalny model ${LEGACY_MODEL_VERSION})`);
P("");
P("> Wyniki deterministyczne przy ustandaryzowanych wejściach porównawczych (czas trwania 2 lata,");
P("> koszt aneksu 4% CV, ekspozycja 10% CV, stawki domyślne, dyskonto 4%). To NIE są scenariusze");
P("> wbudowane. Progi są dokładne (delta jest liniowa w koszcie dnia), nie próbkowane.");
P("");
P("Jak czytać: `formalna ODPORNIE poniżej X` = przy koszcie dnia bezczynności poniżej X zł/dzień");
P("ścieżka formalna wygrywa w KAŻDYM scenariuszu dowodowym; `adaptacyjna ODPORNIE powyżej Y`");
P("= powyżej Y wygrywa adaptacyjna w każdym; między X a Y decydują założenia (pas nierozstrzygnięty).");
P("Oś strukturalna (±30% czasów etapów) przesuwa progi w przybliżeniu proporcjonalnie do różnicy dni —");
P("porównaj wiersze manual vs end_to_end, które rozpinają tę oś naturalnie (×2 na dniach).");
P("");
P("| kategoria | technologia | CV | Δdni | formalna ODPORNIE poniżej [zł/dz] | próg centralny [zł/dz] | adaptacyjna ODPORNIE powyżej [zł/dz] | werdykt przy koszcie zwłoki ≈ 0 |");
P("|---|---|---:|---:|---:|---:|---:|---|");
for (const r of rows) {
  const rf = r.dayDiff < 0 ? "n/d (odwrócona)" : fmt(r.robustFormalBelow);
  const ra = r.dayDiff < 0 ? "n/d (odwrócona)" : fmt(r.robustAdaptiveAbove);
  const c = r.dayDiff === 0 ? "—" : fmt(r.centralAt);
  P(`| ${r.type} | ${r.tech} | ${fmtCV(r.cv)} | ${r.dayDiff.toFixed(1)} | ${rf} | ${c} | ${ra} | ${r.verdictNoDelay} |`);
}
P("");
P("Kategorie z Δdni = 0 (policy_only, catalog, mrp): koszt zwłoki nie różnicuje ścieżek —");
P("decyduje wyłącznie koszt procesu i cyklu życia (kolumna werdyktu).");
P("Kategoria odwrócona (discovery, Δdni < 0): ścieżka FORMALNA jest szybsza, więc im wyższy");
P("koszt dnia, tym mocniej wygrywa formalna; adaptacja broni się tylko przy taniej zwłoce");
P("i wysokiej wartości dopasowania (kanał TCO/cyklu życia w wysokim scenariuszu).");

const outDir = resolve(process.cwd(), "replication/outputs");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "decision-thresholds.md"), lines.join("\n") + "\n");
console.log("\nwritten: replication/outputs/decision-thresholds.md");
