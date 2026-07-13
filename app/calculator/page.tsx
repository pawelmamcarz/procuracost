"use client";

import { useState } from "react";
import CostCalculator from "@/components/CostCalculator";
import CostComparison from "@/components/CostComparison";
import PDFExport from "@/components/PDFExport";
import { calculateCosts, ComparisonResult, ProcurementInputs, getDimensionMultiplierDetails } from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";
import { MODEL_VERSION, VERSION } from "@/lib/version";

export default function CalculatorPage() {
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [activeInputs, setActiveInputs] = useState<ProcurementInputs | null>(null);

  function handleCalculate(inputs: ProcurementInputs, scenario: Scenario) {
    const r = calculateCosts(inputs);
    setResult(r);
    setActiveScenario(scenario);
    setActiveInputs(inputs);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kalkulator kosztów procedur zakupowych</h1>
        <p className="mt-1 text-sm text-gray-500">
          Porównaj całkowite koszty dla trzech klas procesów: zakupów strategicznych, zakupów
          operacyjnych oraz strategicznych zakupów PZP. Czas i koszty wynikają z szablonu procesu
          i stawek uczestników — nie są wpisywane ręcznie.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <CostCalculator onCalculate={handleCalculate} />
      </div>

      {result && activeScenario && activeInputs && (
        <div id="results" className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Wyniki: {activeScenario.name}
            </h2>
            <div className="flex items-center gap-2">
              <PDFExport result={result} scenario={activeScenario} />
              <button
                onClick={() => {
                  const dims = getDimensionMultiplierDetails(activeInputs.spendType, activeInputs.processPhase);
                  const payload = {
                    meta: {
                      model: "ProcuraCost",
                      modelVersion: MODEL_VERSION,
                      appVersion: VERSION,
                      exportedAt: new Date().toISOString(),
                      note: "Researcher export for replication. Use with model_specification_draft.md and frozen step templates.",
                      source: "calculateCosts + getDimensionMultipliers (live)",
                    },
                    inputs: activeInputs,
                    context: {
                      spendType: activeInputs.spendType,
                      processPhase: activeInputs.processPhase,
                    },
                    multipliers: dims,
                    results: {
                      rigidDays: result.rigidDays,
                      flexibleDays: result.flexibleDays,
                      bypassProbability: result.bypassProbability,
                      flexibleBypassProbability: result.flexibleBypassProbability,
                      delta: result.delta,
                      deltaPercent: result.deltaPercent,
                      rigid: result.rigid,
                      flexible: result.flexible,
                      trace: result.trace,
                    },
                    sources: result.sources,
                  };
                  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `procura-cost-research-export-${activeScenario.id || "scenario"}-${new Date().toISOString().slice(0,10)}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 print:hidden"
                title="Export full inputs, multipliers, days, and cost components for replication / paper tables"
              >
                Export for Research (JSON)
              </button>
              <button
                onClick={(event) => {
                  const dims = getDimensionMultiplierDetails(activeInputs.spendType, activeInputs.processPhase);
                  const md = [
                    `### Scenario: ${activeScenario.name} (${activeInputs.spendType || '—'} / ${activeInputs.processPhase || '—'})`,
                    ``,
                    `**Model**: ${MODEL_VERSION} | App build: ${VERSION} | Exported: ${new Date().toISOString().slice(0,10)}`,
                    ``,
                    `| Metric | Rigid | Flexible |`,
                    `|--------|-------|----------|`,
                    `| Days | ${result.rigidDays} | ${result.flexibleDays} |`,
                    `| Bypass prob. | ${(result.bypassProbability * 100).toFixed(1)}% | — |`,
                    `| Total cost (PLN) | ${Math.round(result.rigid.total).toLocaleString('pl-PL')} | ${Math.round(result.flexible.total).toLocaleString('pl-PL')} |`,
                    `| Δ (PLN) | ${Math.round(result.delta).toLocaleString('pl-PL')} | — |`,
                    `| Δ (%) | ${result.deltaPercent.toFixed(1)}% | — |`,
                    ``,
                    `**Multipliers applied** (from getDimensionMultipliers):`,
                    dims.map(d => `- ${d.labelEn || d.label}: ${d.value.toFixed(2)}x`).join('\n'),
                    ``,
                    `_Full JSON export available in the same results bar. See model_specification_draft.md for exact formulas._`,
                  ].join('\n');
                  navigator.clipboard.writeText(md);
                  // brief visual feedback (use the button via currentTarget if available)
                  const btn = event.currentTarget;
                  if (btn) {
                    const orig = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => { if (btn) btn.textContent = orig || 'Copy Markdown'; }, 1200);
                  }
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 print:hidden"
                title="Copy a clean Markdown table (multipliers + key results) ready to paste into the paper"
              >
                Copy Markdown table
              </button>
              <button
                onClick={() => {
                  const dims = getDimensionMultiplierDetails(activeInputs.spendType, activeInputs.processPhase);
                  const csvHeader = 'Metric,Rigid,Flexible\n';
                  const rows = [
                    `Days,${result.rigidDays},${result.flexibleDays}`,
                    `BypassProb,${(result.bypassProbability * 100).toFixed(1)}%,—`,
                    `TotalPLN,${Math.round(result.rigid.total)},${Math.round(result.flexible.total)}`,
                    `DeltaPLN,${Math.round(result.delta)},—`,
                    `DeltaPercent,${result.deltaPercent.toFixed(1)}%,—`,
                  ];
                  const multRows = dims.map(d => `${d.labelEn || d.label},${d.value.toFixed(2)}x,${d.value.toFixed(2)}x`);
                  const csv = csvHeader + rows.join('\n') + '\n' + multRows.join('\n');
                  navigator.clipboard.writeText(csv);
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 print:hidden"
                title="Copy key results and multipliers as CSV (easy for paper tables/spreadsheets)"
              >
                Copy CSV
              </button>
            </div>
          </div>
          <CostComparison result={result} scenario={activeScenario} inputs={activeInputs} />
        </div>
      )}
    </div>
  );
}
