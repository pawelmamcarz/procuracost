// Symmetry sweep: exhaustively tests whether any input configuration makes the rigid
// path net-cheaper (delta < 0). Run: npm run sweep. As of 2026-07-05: 0 rigid-wins in
// 3,780 configs here (+8,064 in an extreme-parameter variant) — the structural symmetry
// is numerically inert; minimum observed gap ≈ +0.4% CV (catalog_order/manual, zeroed
// staff/delay inputs). See docs/articles/doktorat/article-2-model-kosztu-PL.md §4.
import { calculateCosts, type ProcurementInputs } from "../lib/calculations.ts";
import { PROCESS_TEMPLATES, TECH_LEVELS, type ProcessType, type TechLevelId, type StakeholderRole } from "../lib/process-templates.ts";

const ROLES: StakeholderRole[] = ["buyer", "lawyer", "finance", "manager", "executive", "requestor"];
const stakeholders = Object.fromEntries(ROLES.map((r) => [r, { count: 1, dailyRate: 1200 }])) as ProcurementInputs["stakeholders"];

const types = Object.keys(PROCESS_TEMPLATES) as Exclude<ProcessType, "custom">[];
const techs = Object.keys(TECH_LEVELS) as TechLevelId[];
const spendOpts = [undefined, "direct", "indirect"] as const;
const phaseOpts = [undefined, "upstream", "downstream"] as const;

let total = 0;
const wins: { key: string; delta: number; pct: number }[] = [];

for (const pt of types)
  for (const tl of techs)
    for (const cv of [20_000, 50_000, 200_000, 1_000_000, 5_000_000])
      for (const dciFactor of [0, 0.0001, 0.001])
        for (const st of spendOpts)
          for (const pp of phaseOpts) {
            const r = calculateCosts({
              contractValue: cv,
              tcoHorizonYears: 3,
              processType: pt,
              techLevel: tl,
              stakeholders,
              dailyCostOfInaction: cv * dciFactor,
              renegotiationCost: cv * 0.05,
              bypassAuditExposure: cv * 0.02,
              spendType: st,
              processPhase: pp,
            });
            total++;
            if (r.delta < 0)
              wins.push({
                key: `${pt}/${tl} cv=${cv} dci=${dciFactor} ${st ?? "-"}/${pp ?? "-"}`,
                delta: r.delta,
                pct: (r.delta / cv) * 100,
              });
          }

console.log(`configs tested: ${total}, rigid-wins (delta<0): ${wins.length}`);
const byCombo = new Map<string, number>();
for (const w of wins) byCombo.set(w.key.split(" cv=")[0], (byCombo.get(w.key.split(" cv=")[0]) ?? 0) + 1);
console.log("by process/tech:", Object.fromEntries(byCombo));
wins.sort((a, b) => a.pct - b.pct);
for (const w of wins.slice(0, 12)) console.log(`  ${w.key}  delta=${Math.round(w.delta)} (${w.pct.toFixed(2)}% CV)`);
