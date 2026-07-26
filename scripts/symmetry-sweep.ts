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
  "'Robustly favours adaptive' asks whether the LOW evidence case still favours adaptive.\n" +
  "'Robustly favours formal' asks whether the HIGH case still favours formal. EVIDENCE_CASES\n" +
  "varies five scalars — the discretion premium, the rigidity slope, the TCO pool and the two\n" +
  "bypass rates — and does NOT perturb the step-day templates or the daily cost of inaction.\n" +
  "So both questions are asked from whatever process baseline the template supplies.\n" +
  "\n" +
  "Through model 2.1 every template had flexibleDays <= rigidDays in every step, which made\n" +
  "that baseline pro-adaptive by construction: the sweep returned 0 robustly-formal results\n" +
  "out of 11,340 configurations, and decoupling the exposures did not change that. The zero\n" +
  "was a property of the templates, not a finding about procurement.\n" +
  "\n" +
  "Model 2.2 adds the `discovery` process type, where the requirement emerges in flight and\n" +
  "adaptive execution is genuinely slower and more effortful (co-design, a re-scoping round).\n" +
  "The test can now fail in both directions, which is the minimum a symmetry claim requires.\n" +
  "\n" +
  "Still missing, and still worth building: a second sensitivity axis over the daily cost of\n" +
  "inaction and over non-mandatory step durations. Until it exists, the envelope brackets the\n" +
  "evidence parameters only, not the two inputs that carry most of the result."
);
if (lowest) console.log(`lowest low-case delta: ${Math.round(lowest.delta)} (${lowest.pct.toFixed(2)}% CV), ${lowest.key}`);
if (lowestCentral) console.log(`lowest central delta: ${Math.round(lowestCentral.delta)}, ${lowestCentral.key}`);
