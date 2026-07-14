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
              renegotiationCost: contractValue * 0.05,
              bypassAuditExposure: contractValue * 0.02,
              spendType,
              processPhase,
            });
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
if (lowest) console.log(`lowest low-case delta: ${Math.round(lowest.delta)} (${lowest.pct.toFixed(2)}% CV), ${lowest.key}`);
if (lowestCentral) console.log(`lowest central delta: ${Math.round(lowestCentral.delta)}, ${lowestCentral.key}`);
