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
  rigidDays: results.rigidDays,
  flexibleDays: results.flexibleDays,
  rigidTotalPLN: Math.round(results.rigid.total),
  flexibleTotalPLN: Math.round(results.flexible.total),
  deltaPLN: Math.round(results.delta),
  deltaPercent: Number(results.deltaPercent.toFixed(1)),
  lowDeltaPLN: Math.round(results.uncertainty.lowDelta),
  highDeltaPLN: Math.round(results.uncertainty.highDelta),
  crossesZero: results.uncertainty.crossesZero,
}));

const csvHeader = Object.keys(summaryRows[0]).join(",");
const csvRows = summaryRows.map((row) => Object.values(row).map((value) => JSON.stringify(value)).join(","));
writeFileSync(
  resolve(outputDir, "built-in-scenarios.csv"),
  `${[csvHeader, ...csvRows].join("\n")}\n`,
);

const markdownRows = summaryRows.map(
  (row) =>
    `| ${row.scenarioId} | ${row.spendType} × ${row.processPhase} | ${row.rigidDays} | ${row.flexibleDays} | ${row.rigidTotalPLN} | ${row.flexibleTotalPLN} | ${row.deltaPercent}% | ${row.lowDeltaPLN} – ${row.highDeltaPLN} | ${row.crossesZero} |`,
);
const markdown = [
  `# Built-in Scenario Outputs (Model ${MODEL_VERSION})`,
  "",
  "> Deterministic model outputs under illustrative inputs. These are not empirical estimates of realized organizational effects.",
  "",
  "| Scenario | Context | Formal days | Adaptive days | Formal total (PLN) | Adaptive total (PLN) | Central delta | Scenario range (PLN) | Crosses zero |",
  "|---|---|---:|---:|---:|---:|---:|---:|:---:|",
  ...markdownRows,
  "",
].join("\n");
writeFileSync(resolve(outputDir, "built-in-scenarios.md"), markdown);
