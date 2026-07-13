// Deterministic recompute over the ACTUAL model code (no re-implementation).
// Run: npm run recompute   (tsx runner — lib/ uses extensionless imports that
// plain Node type-stripping cannot resolve)
//
// Prints:
//  (a) the per-dimension central Δ table for all reference scenarios,
//  (b) sign and low/high scenario range,
//  (c) the context-uplift audit: every (spendType × processPhase) combo re-run per
//      scenario, reporting each dimension's total context uplift factor vs the unset
//      baseline — invariant: no dimension's total uplift exceeds ~×1.5.

import { calculateCosts, type ComparisonResult } from "../lib/calculations.ts";
import { SCENARIOS } from "../lib/scenarios.ts";

const DIMS = [
  "timeCost",
  "adminCost",
  "opportunityCost",
  "productivityCost",
  "renegotiationCost",
  "tcoCost",
  "bypassCost",
] as const;

const DIM_SHORT: Record<(typeof DIMS)[number], string> = {
  timeCost: "time",
  adminCost: "admin",
  opportunityCost: "opp",
  productivityCost: "favor.",
  renegotiationCost: "reneg",
  tcoCost: "tco",
  bypassCost: "bypass",
};

function fmt(v: number): string {
  const sign = v < 0 ? "−" : "";
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${sign}${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 1_000) return `${sign}${(a / 1_000).toFixed(0)}k`;
  return `${sign}${Math.round(a)}`;
}

function fmtCV(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  return `${(v / 1_000).toFixed(0)}k`;
}

// ── (a) §5.1 table ────────────────────────────────────────────────────────────
console.log("### Central per-dimension Δ (formal − adaptive), PLN. Positive favours adaptive.\n");
console.log("| scenario (type / tech) | CV | time | admin | opp | selection | reneg | tco | bypass | TOT formal | TOT adaptive | **central Δ** | **low…high Δ** | **% CV** | dominant |");
console.log("|--|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--|");

const results: Array<{ id: string; r: ComparisonResult; cv: number }> = [];

for (const s of SCENARIOS) {
  const r = calculateCosts(s.inputs);
  const cv = s.inputs.contractValue;
  results.push({ id: s.id, r, cv });

  const deltas = DIMS.map((d) => r.rigid[d] - r.flexible[d]);
  const dominantIdx = deltas.reduce((best, v, i) => (Math.abs(v) > Math.abs(deltas[best]) ? i : best), 0);
  const deltaC = r.delta;
  const pctCV = (deltaC / cv) * 100;

  console.log(
    `| ${s.id} (${s.inputs.processType}/${s.inputs.techLevel}) | ${fmtCV(cv)} | ` +
    deltas.map(fmt).join(" | ") +
    ` | ${fmt(r.rigid.total)} | ${fmt(r.flexible.total)} | **${deltaC >= 0 ? "+" : ""}${fmt(deltaC)}** | ${fmt(r.uncertainty.lowDelta)}…${fmt(r.uncertainty.highDelta)} | ${pctCV >= 0 ? "+" : ""}${pctCV.toFixed(2)}% | ${DIM_SHORT[DIMS[dominantIdx]]} |`
  );
}

// ── (b) sign robustness ───────────────────────────────────────────────────────
const negatives = results.filter(({ r }) => r.delta < 0);
const favRigid = results.filter(({ r }) => r.rigid.productivityCost - r.flexible.productivityCost < 0);
const crossing = results.filter(({ r }) => r.uncertainty.crossesZero);
console.log(`\n### Sign test: central Δ < 0 in ${negatives.length} of ${results.length} scenarios` +
  (negatives.length ? ` (${negatives.map((n) => n.id).join(", ")})` : "") + ".");
console.log(`Scenario envelope crosses zero in ${crossing.length}/${results.length} scenarios` +
  (crossing.length ? ` (${crossing.map((n) => n.id).join(", ")})` : "") + ".");
console.log(`Selection dimension favours the formal path in ${favRigid.length}/${results.length} central scenarios.`);

// ── (c) context-uplift audit ──────────────────────────────────────────────────
console.log("\n### Context-uplift audit (formal path): total per-dimension factor vs unset baseline");
console.log("Invariant: no dimension's total context uplift exceeds ~×1.5.\n");

const COMBOS: Array<{ label: string; spendType?: "direct" | "indirect"; processPhase?: "upstream" | "downstream" }> = [
  { label: "direct+upstream", spendType: "direct", processPhase: "upstream" },
  { label: "direct+downstream", spendType: "direct", processPhase: "downstream" },
  { label: "indirect+upstream", spendType: "indirect", processPhase: "upstream" },
  { label: "indirect+downstream", spendType: "indirect", processPhase: "downstream" },
];

let maxUplift = 0;
let maxUpliftDesc = "";

console.log("| combo | " + DIMS.map((d) => DIM_SHORT[d]).join(" | ") + " | (max over scenarios) |");
console.log("|--|" + DIMS.map(() => "--:").join("|") + "|--|");

for (const combo of COMBOS) {
  const upliftPerDim = DIMS.map((d) => {
    let worst = 0;
    for (const s of SCENARIOS) {
      const base = calculateCosts(s.inputs).rigid[d];
      const ctx = calculateCosts({ ...s.inputs, spendType: combo.spendType, processPhase: combo.processPhase }).rigid[d];
      if (base > 0) {
        const factor = ctx / base;
        if (factor > worst) worst = factor;
        if (factor > maxUplift) {
          maxUplift = factor;
          maxUpliftDesc = `${DIM_SHORT[d]} / ${combo.label} / ${s.id}`;
        }
      }
    }
    return worst;
  });
  console.log(`| ${combo.label} | ` + upliftPerDim.map((u) => `×${u.toFixed(2)}`).join(" | ") + " | |");
}

console.log(`\nMax observed uplift: ×${maxUplift.toFixed(3)} (${maxUpliftDesc}) — invariant ${maxUplift <= 1.5 ? "HOLDS (≤ ×1.5)" : "VIOLATED (> ×1.5)"}.`);
