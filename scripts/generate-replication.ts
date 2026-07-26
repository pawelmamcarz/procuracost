import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { calculateCosts } from "../lib/calculations";
import { SCENARIOS } from "../lib/scenarios";
import { MODEL_VERSION } from "../lib/version";

const outputDir = resolve(process.cwd(), "replication/outputs");
mkdirSync(outputDir, { recursive: true });

const scenarios = SCENARIOS.filter(({ id }) => id !== "custom").map((scenario) => {
  const result = calculateCosts(scenario.inputs);
  return {
    scenarioId: scenario.id,
    scenarioName: scenario.nameEn,
    context: {
      spendType: scenario.inputs.spendType,
      processPhase: scenario.inputs.processPhase,
    },
    inputs: scenario.inputs,
    results: result,
  };
});

const payload = {
  modelVersion: MODEL_VERSION,
  evidenceStatus:
    "Deterministic model outputs under illustrative inputs; not empirical estimates of realized organizational effects.",
  scenarios,
};

writeFileSync(
  resolve(outputDir, "built-in-scenarios.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
);

const summaryRows = scenarios.map(({ scenarioId, scenarioName, context, results }) => ({
  scenarioId,
  scenarioName,
  spendType: context.spendType ?? "neutral",
  processPhase: context.processPhase ?? "neutral",
  rigidDays: Math.round(results.rigidDays),
  flexibleDays: Math.round(results.flexibleDays),
  rigidTotalPLN: Math.round(results.rigid.total),
  flexibleTotalPLN: Math.round(results.flexible.total),
  deltaProcessPLN: Math.round(results.deltaDecomposition.process),
  deltaDelayPLN: Math.round(results.deltaDecomposition.delay),
  deltaLifecyclePLN: Math.round(results.deltaDecomposition.lifecycle),
  deltaPLN: Math.round(results.delta),
  delayShareOfDeltaPercent: Number(results.deltaDecomposition.delayShareOfDeltaPercent.toFixed(1)),
  deltaPercentOfAdaptiveTotal: Number(results.deltaPercent.toFixed(1)),
  lowDeltaPLN: Math.round(results.uncertainty.lowDelta),
  highDeltaPLN: Math.round(results.uncertainty.highDelta),
  crossesZero: results.uncertainty.crossesZero,
  breakEvenDailyInactionPLN: results.decisionThreshold.breakEvenDailyCostOfInaction === null
    ? "not-applicable"
    : Math.round(results.decisionThreshold.breakEvenDailyCostOfInaction),
  breakEvenStatus: results.decisionThreshold.status,
}));

const csvHeader = Object.keys(summaryRows[0]).join(",");
const csvRows = summaryRows.map((row) => Object.values(row).map((value) => JSON.stringify(value)).join(","));
writeFileSync(
  resolve(outputDir, "built-in-scenarios.csv"),
  `${[csvHeader, ...csvRows].join("\n")}\n`,
);

const markdownRows = summaryRows.map(
  (row) =>
    `| ${row.scenarioId} | ${row.spendType} × ${row.processPhase} | ${row.rigidDays} | ${row.flexibleDays} | ${row.deltaProcessPLN} | ${row.deltaDelayPLN} | ${row.deltaLifecyclePLN} | ${row.deltaPLN} | ${row.delayShareOfDeltaPercent}% | ${row.lowDeltaPLN} – ${row.highDeltaPLN} | ${row.crossesZero} | ${row.breakEvenStatus} |`,
);

const withDelay = summaryRows.filter((row) => row.deltaDelayPLN !== 0);
const shares = withDelay.map((row) => row.delayShareOfDeltaPercent);
const processFavoursFormal = summaryRows.filter((row) => row.deltaProcessPLN < 0);

const markdown = [
  `# Built-in Scenario Outputs (Model ${MODEL_VERSION})`,
  "",
  "> Deterministic model outputs under illustrative inputs. These are not empirical estimates of realized organizational effects.",
  "",
  "ΔC is reported decomposed, because the three buckets have different time bases and very",
  "different evidential standing:",
  "",
  "- **Δ process** — staff, administration, selection and bypass, per procurement event.",
  "- **Δ delay** — (formal days − adaptive days) × the daily cost of inaction the *user* supplies.",
  "  This is an accounting identity between a template and an input, not a modeled effect.",
  "- **Δ lifecycle** — expected formal amendments and foregone lifecycle value, over the contract life.",
  "",
  shares.length
    ? `In the ${withDelay.length} of ${summaryRows.length} scenarios where the paths differ in duration, ` +
      `Δ delay carries ${Math.min(...shares).toFixed(1)}–${Math.max(...shares).toFixed(1)}% of |ΔC|.`
    : "",
  processFavoursFormal.length
    ? `Excluding that identity, the formal path is cheaper on process cost in ` +
      `${processFavoursFormal.length} of ${summaryRows.length} scenarios ` +
      `(${processFavoursFormal.map((r) => r.scenarioId).join(", ")}).`
    : "",
  "",
  "| Scenario | Context | Formal days | Adaptive days | Δ process (PLN) | Δ delay (PLN) | Δ lifecycle (PLN) | Δ total (PLN) | Delay share | Scenario range (PLN) | Crosses zero | Break-even status |",
  "|---|---|---:|---:|---:|---:|---:|---:|---:|---:|:---:|---|",
  ...markdownRows,
  "",
].join("\n");
writeFileSync(resolve(outputDir, "built-in-scenarios.md"), markdown);
