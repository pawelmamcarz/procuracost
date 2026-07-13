"use client";

import {
  ComparisonResult,
  ProcurementInputs,
  COST_DIMENSION_KEYS,
} from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";
import { researchExportT, dimensionMultiplierLabelsT, Lang } from "@/lib/i18n";
import { downloadTextFile, isoDateStamp } from "@/lib/research-export";
import { MODEL_VERSION, VERSION } from "@/lib/version";

interface Props {
  result: ComparisonResult;
  scenario: Scenario;
  inputs: ProcurementInputs;
  lang: Lang;
}

export default function ResearchExportBar({ result, scenario, inputs, lang }: Props) {
  const tx = researchExportT[lang];
  const {
    rigid,
    flexible,
    delta,
    deltaPercent,
    bypassProbability,
    flexibleBypassProbability,
    rigidDays,
    flexibleDays,
    trace,
    sources,
  } = result;

  const baseName = `procura-cost-research-${scenario.id || "scenario"}-${isoDateStamp()}`;

  const handleJsonExport = () => {
    const payload = {
      meta: {
        model: "ProcuraCost",
        modelVersion: MODEL_VERSION,
        appVersion: VERSION,
        exportedAt: new Date().toISOString(),
        note: tx.jsonNote,
      },
      inputs,
      context: { spendType: inputs.spendType, processPhase: inputs.processPhase },
      multipliers: trace.multiplierDetails,
      results: {
        rigidDays,
        flexibleDays,
        bypassProbability,
        flexibleBypassProbability,
        delta,
        deltaPercent,
        rigid,
        flexible,
        trace,
      },
      sources,
    };
    downloadTextFile(`${baseName}.json`, JSON.stringify(payload, null, 2), "application/json");
  };

  const handleCsvExport = () => {
    const lines = [
      "Metric,Rigid,Flexible",
      `Days,${rigidDays},${flexibleDays}`,
      `BypassProbability,${bypassProbability.toFixed(4)},${flexibleBypassProbability.toFixed(4)}`,
      `RenegotiationProbability,${trace.probabilities.renegotiationRigid.toFixed(4)},${trace.probabilities.renegotiationFlexible.toFixed(4)}`,
      ...COST_DIMENSION_KEYS.map(
        (k) => `${k},${trace.dimensions[k].rigid.toFixed(2)},${trace.dimensions[k].flexible.toFixed(2)}`,
      ),
      `TotalPLN,${rigid.total.toFixed(2)},${flexible.total.toFixed(2)}`,
      `DeltaPLN,${delta.toFixed(2)},`,
      `DeltaPercent,${deltaPercent.toFixed(2)},`,
      "",
      "Multiplier,Value",
      ...Object.entries(trace.multipliers).map(([k, v]) => `${k},${v.toFixed(4)}`),
      `modelVersion,${MODEL_VERSION}`,
    ];
    downloadTextFile(`${baseName}.csv`, lines.join("\n"), "text/csv");
  };

  const handleMarkdownExport = () => {
    const md = [
      `### ${scenario.name} (${inputs.spendType || "—"} / ${inputs.processPhase || "—"})`,
      ``,
      `**Model**: ${MODEL_VERSION} | App build: ${VERSION} | Exported: ${new Date().toISOString()}`,
      ``,
      `| Metric | Rigid | Flexible |`,
      `|--------|-------|----------|`,
      `| Days | ${rigidDays} | ${flexibleDays} |`,
      `| Bypass prob. | ${(bypassProbability * 100).toFixed(1)}% | ${(flexibleBypassProbability * 100).toFixed(1)}% |`,
      `| Renegotiation prob. | ${(trace.probabilities.renegotiationRigid * 100).toFixed(1)}% | ${(trace.probabilities.renegotiationFlexible * 100).toFixed(1)}% |`,
      `| Total (PLN) | ${Math.round(rigid.total).toLocaleString("pl-PL")} | ${Math.round(flexible.total).toLocaleString("pl-PL")} |`,
      `| Δ | ${Math.round(delta).toLocaleString("pl-PL")} (${deltaPercent.toFixed(1)}%) | — |`,
      ``,
      `| Dimension | Rigid (PLN) | Flexible (PLN) |`,
      `|-----------|-------------|----------------|`,
      ...COST_DIMENSION_KEYS.map(
        (k) =>
          `| ${k} | ${Math.round(trace.dimensions[k].rigid).toLocaleString("pl-PL")} | ${Math.round(trace.dimensions[k].flexible).toLocaleString("pl-PL")} |`,
      ),
      ``,
      `**Multipliers**: ${
        trace.multiplierDetails.length > 0
          ? trace.multiplierDetails.map((d) => `${dimensionMultiplierLabelsT.en[d.key]} ${d.value.toFixed(2)}x`).join(" • ")
          : "neutral context (all 1.00x)"
      }`,
      ``,
      `_${tx.jsonNote}_`,
    ].join("\n");
    downloadTextFile(`${baseName}.md`, md, "text/markdown");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <span className="mr-1 text-xs text-gray-500">{tx.forPaper}</span>
      <button
        onClick={handleJsonExport}
        title={tx.jsonTitle}
        className="rounded-lg border border-blue-500 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
      >
        {tx.exportJson}
      </button>
      <button
        onClick={handleCsvExport}
        title={tx.csvTitle}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:border-gray-300"
      >
        {tx.exportCsv}
      </button>
      <button
        onClick={handleMarkdownExport}
        title={tx.markdownTitle}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:border-gray-300"
      >
        {tx.exportMarkdown}
      </button>
      <span className="text-xs text-gray-400">{tx.liveTraceNote}</span>
    </div>
  );
}
