// Model 2.1 sign-robustness sweep. Run: npm run sweep.
// Each configuration is evaluated at the low/central/high evidence cases embedded
// in calculateCosts(). The envelope is a scenario range, not a confidence interval.
import { calculateCosts, type ProcurementInputs } from "../lib/calculations.ts";
import { PROCESS_TEMPLATES, TECH_LEVELS, type ProcessType, type TechLevelId, type StakeholderRole } from "../lib/process-templates.ts";

const ROLES: StakeholderRole[] = ["buyer", "lawyer", "finance", "manager", "executive", "requestor"];
const stakeholders = Object.fromEntries(ROLES.map((role) => [role, { count: 1, dailyRate: 1200 }])) as ProcurementInputs["stakeholders"];
const types = Object.keys(PROCESS_TEMPLATES) as Exclude<ProcessType, "custom">[];
const techs = Object.keys(TECH_LEVELS) as TechLevelId[];
const spendOptions = [undefined, "direct", "indirect"] as const;
const phaseOptions = [undefined, "upstream", "downstream"] as const;

let total = 0;
let centralFormal = 0;
let robustFormal = 0;
let robustAdaptive = 0;
let crossesZero = 0;
let lowest: { key: string; delta: number; pct: number } | undefined;
let lowestCentral: { key: string; delta: number } | undefined;

// COUPLING WARNING (corrected in 2.2). Model 2.1's grid tied renegotiationCost and
// bypassAuditExposure to a fixed fraction of contract value, so two pro-adaptive channels
// scaled with CV while the only pro-formal channel (selection) is analytically bounded at
// roughly 0.3% of CV. The sweep therefore could not produce a robust formal win in ANY of
// its 3,780 configurations — a property of the grid, not of the model. Presenting that as a
// symmetry test was the mistake. The grid now varies the two exposures independently of
// contract value so the test can fail in both directions.
const EXPOSURE_MODES = [
  { label: "coupled-to-CV", reneg: (cv: number) => cv * 0.05, bypass: (cv: number) => cv * 0.02 },
  { label: "fixed-low", reneg: () => 20_000, bypass: () => 10_000 },
  { label: "zero", reneg: () => 0, bypass: () => 0 },
] as const;

const byMode: Record<string, { n: number; centralFormal: number; robustFormal: number }> = {};

for (const mode of EXPOSURE_MODES)
for (const processType of types)
  for (const techLevel of techs)
    for (const contractValue of [20_000, 50_000, 200_000, 1_000_000, 5_000_000])
      for (const delayFactor of [0, 0.0001, 0.001])
        for (const spendType of spendOptions)
          for (const processPhase of phaseOptions) {
            const result = calculateCosts({
              contractValue,
              tcoHorizonYears: 3,
              contractDurationYears: 3,
              processType,
              techLevel,
              stakeholders,
              dailyCostOfInaction: contractValue * delayFactor,
              renegotiationCost: mode.reneg(contractValue),
              bypassAuditExposure: mode.bypass(contractValue),
              spendType,
              processPhase,
            });
            byMode[mode.label] ??= { n: 0, centralFormal: 0, robustFormal: 0 };
            byMode[mode.label].n++;
            if (result.delta < 0) byMode[mode.label].centralFormal++;
            if (result.uncertainty.highDelta < 0) byMode[mode.label].robustFormal++;
            total++;
            if (result.delta < 0) centralFormal++;
            if (result.uncertainty.highDelta < 0) robustFormal++;
            if (result.uncertainty.lowDelta > 0) robustAdaptive++;
            if (result.uncertainty.crossesZero) crossesZero++;
            if (!lowestCentral || result.delta < lowestCentral.delta) {
              lowestCentral = {
                key: `${processType}/${techLevel} cv=${contractValue} delay=${delayFactor} ${spendType ?? "-"}/${processPhase ?? "-"}`,
                delta: result.delta,
              };
            }
            const pct = (result.uncertainty.lowDelta / contractValue) * 100;
            if (!lowest || pct < lowest.pct) {
              lowest = {
                key: `${processType}/${techLevel} cv=${contractValue} delay=${delayFactor} ${spendType ?? "-"}/${processPhase ?? "-"}`,
                delta: result.uncertainty.lowDelta,
                pct,
              };
            }
          }

console.log(`configurations: ${total}`);
console.log(`central result favours formal: ${centralFormal}`);
console.log(`scenario range robustly favours formal: ${robustFormal}`);
console.log(`scenario range robustly favours adaptive: ${robustAdaptive}`);
console.log(`scenario range crosses zero: ${crossesZero}`);

console.log("\n### Sign robustness by exposure mode (the 2.1 grid used only the first row)");
console.log("| exposure mode | configs | central favours formal | range robustly favours formal |");
console.log("|--|--:|--:|--:|");
for (const mode of EXPOSURE_MODES) {
  const m = byMode[mode.label];
  if (!m) continue;
  console.log(`| ${mode.label} | ${m.n} | ${m.centralFormal} | ${m.robustFormal} |`);
}
console.log(
  "\nHOW TO READ THIS.\n" +
  "\n" +
  "'Robustly favours X' means the whole scenario envelope stays on X's side. Since 2.2.1 that\n" +
  "envelope covers TWO axes: the five evidence scalars, and the structural inputs — the daily\n" +
  "cost of inaction (x0.25 to x4) and non-mandatory step durations (x0.7 to x1.3). Statutory\n" +
  "PZP waits are invariant under both.\n" +
  "\n" +
  "Two corrections are folded into these numbers, and both moved them a long way.\n" +
  "\n" +
  "1. Through 2.1 every template had flexibleDays <= rigidDays in every step, so the process\n" +
  "   baseline was pro-adaptive by construction and the sweep returned 0 robustly-formal\n" +
  "   results out of 11,340. That zero described the templates, not procurement. The\n" +
  "   `discovery` type — requirement emerging in flight, adaptive execution genuinely slower\n" +
  "   — lets the test fail in both directions.\n" +
  "2. Through 2.2.0 the envelope varied only the evidence axis, holding fixed the two inputs\n" +
  "   that carry 80-99% of the result. Adding the structural axis widens it several-fold and\n" +
  "   collapses both robustness counts, because most configurations genuinely do not identify\n" +
  "   a winner once the dominant inputs are allowed to move.\n" +
  "\n" +
  "A low robustness count is therefore the honest reading, not a defect. The earlier high\n" +
  "counts came from an envelope that bracketed the small quantities and froze the large ones."
);
if (lowest) console.log(`lowest low-case delta: ${Math.round(lowest.delta)} (${lowest.pct.toFixed(2)}% CV), ${lowest.key}`);
if (lowestCentral) console.log(`lowest central delta: ${Math.round(lowestCentral.delta)}, ${lowestCentral.key}`);
