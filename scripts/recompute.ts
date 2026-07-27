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
// `custom` is an editable form seed, not a fixed reference case. Keep it in the
// table, but exclude it from aggregate diagnostics cited in the articles.
const referenceResults = results.filter(({ id }) => id !== "custom");
const negatives = referenceResults.filter(({ r }) => r.delta < 0);
const favRigid = referenceResults.filter(({ r }) => r.rigid.productivityCost - r.flexible.productivityCost < 0);
const crossing = referenceResults.filter(({ r }) => r.uncertainty.crossesZero);
console.log("\nAggregate diagnostics exclude `custom`, the editable form seed.");
console.log(`\n### Sign test: central Δ < 0 in ${negatives.length} of ${referenceResults.length} fixed reference scenarios` +
  (negatives.length ? ` (${negatives.map((n) => n.id).join(", ")})` : "") + ".");
console.log(`Scenario envelope crosses zero in ${crossing.length}/${referenceResults.length} fixed reference scenarios` +
  (crossing.length ? ` (${crossing.map((n) => n.id).join(", ")})` : "") + ".");
console.log(`Selection dimension favours the formal path in ${favRigid.length}/${referenceResults.length} fixed reference scenarios.`);

// ── (b2) ΔC decomposition ─────────────────────────────────────────────────────
// The single most important disclosure in the model. The delay bucket is the product
// of a template-derived day count and a daily cost the USER supplies — an accounting
// identity, not a modeled result. Reporting only the summed Δ let that identity carry
// most of the headline while reading as a finding.
console.log("\n### ΔC decomposition: how much of the headline is the user-supplied delay identity?\n");
console.log("| scenario | Δ process | Δ delay | Δ lifecycle | **Δ total** | delay share | break-even (PLN/day) | status |");
console.log("|--|--:|--:|--:|--:|--:|--:|--|");

for (const { id, r } of results) {
  const d = r.deltaDecomposition;
  const t = r.decisionThreshold;
  const breakEven = t.breakEvenDailyCostOfInaction === null
    ? "n/a"
    : fmt(t.breakEvenDailyCostOfInaction);
  console.log(
    `| ${id} | ${fmt(d.process)} | ${fmt(d.delay)} | ${fmt(d.lifecycle)} | **${r.delta >= 0 ? "+" : ""}${fmt(r.delta)}** | ` +
    `${d.delayShareOfDeltaPercent.toFixed(1)}% | ${breakEven} | ${t.status} |`
  );
}

const withDelay = referenceResults.filter(({ r }) => r.deltaDecomposition.delay !== 0);
const delayShares = withDelay.map(({ r }) => r.deltaDecomposition.delayShareOfDeltaPercent);
if (delayShares.length) {
  console.log(
    `\nWhere the two paths differ in duration (${delayShares.length}/${referenceResults.length} fixed reference scenarios), the delay ` +
    `bucket carries ${Math.min(...delayShares).toFixed(1)}–${Math.max(...delayShares).toFixed(1)}% of |Δ|. ` +
    `That bucket is (template day difference) × (user-supplied daily cost): an identity, not a modeled effect.`
  );
}

// ── (b3) uncertainty by axis ──────────────────────────────────────────────────
// Through 2.2.0 the envelope varied only the five evidence scalars. It held the daily cost
// of inaction and the step-day templates fixed — the two inputs carrying most of ΔC — and
// so reported its narrowest uncertainty exactly where the model is least defensible.
console.log("\n### Uncertainty by axis: which one actually carries the width?\n");
console.log("| scenario | central Δ | evidence axis | structural axis | combined | crosses zero | width driven by |");
console.log("|--|--:|--:|--:|--:|:--:|--|");

for (const { id, r } of results) {
  const u = r.uncertainty;
  console.log(
    `| ${id} | ${fmt(u.centralDelta)} | ${fmt(u.evidenceLowDelta)}…${fmt(u.evidenceHighDelta)} | ` +
    `${fmt(u.structuralLowDelta)}…${fmt(u.structuralHighDelta)} | ${fmt(u.lowDelta)}…${fmt(u.highDelta)} | ` +
    `${u.crossesZero ? "yes" : "no"} | ${u.widthDrivenBy} |`
  );
}

const crossingCombined = referenceResults.filter(({ r }) => r.uncertainty.crossesZero);
const crossingEvidenceOnly = referenceResults.filter(
  ({ r }) => r.uncertainty.evidenceLowDelta <= 0 && r.uncertainty.evidenceHighDelta >= 0,
);
console.log(
  `\nOn the evidence axis alone ${crossingEvidenceOnly.length}/${referenceResults.length} fixed reference scenarios cross zero. ` +
  `Adding the structural axis takes that to ${crossingCombined.length}/${referenceResults.length}. ` +
  `The model identifies a robust winner in far fewer cases than model 2.1 reported, and that is ` +
  `the honest reading: the narrow envelope was an artefact of bracketing only the small quantities.`
);

const processFavoursFormal = referenceResults.filter(({ r }) => r.deltaDecomposition.process < 0);
console.log(
  `Excluding the delay identity, the FORMAL path is cheaper on process cost in ` +
  `${processFavoursFormal.length}/${referenceResults.length} fixed reference scenarios` +
  (processFavoursFormal.length ? ` (${processFavoursFormal.map((n) => n.id).join(", ")})` : "") +
  `. The Tunnel–Field advantage in this parameterisation is a delay story, not a process-cost story.`
);

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
    let observed = false;
    for (const s of SCENARIOS) {
      const base = calculateCosts({
        ...s.inputs,
        spendType: undefined,
        processPhase: undefined,
      }).rigid[d];
      const ctx = calculateCosts({ ...s.inputs, spendType: combo.spendType, processPhase: combo.processPhase }).rigid[d];
      if (base > 0) {
        observed = true;
        const factor = ctx / base;
        if (factor > worst) worst = factor;
        if (factor > maxUplift) {
          maxUplift = factor;
          maxUpliftDesc = `${DIM_SHORT[d]} / ${combo.label} / ${s.id}`;
        }
      }
    }
    return observed ? worst : null;
  });
  console.log(`| ${combo.label} | ` + upliftPerDim.map((u) => u === null ? "—" : `×${u.toFixed(2)}`).join(" | ") + " | |");
}

console.log(`\nMax observed uplift: ×${maxUplift.toFixed(3)} (${maxUpliftDesc}) — invariant ${maxUplift <= 1.5 ? "HOLDS (≤ ×1.5)" : "VIOLATED (> ×1.5)"}.`);
