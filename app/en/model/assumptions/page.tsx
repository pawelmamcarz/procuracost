"use client";

import { useState } from "react";
import {
  calculateCosts,
  DIMENSION_DETAIL_TO_MULTIPLIER,
  DimensionMultiplierKey,
  getDimensionMultiplierDetails,
  getDimensionMultipliers,
  ProcurementInputs,
} from "@/lib/calculations";
import { MODEL_VERSION, VERSION } from "@/lib/version";
import Link from "next/link";

export default function AssumptionsExplorerEn() {
  const [spendType, setSpendType] = useState<"direct" | "indirect">("direct");
  const [processPhase, setProcessPhase] = useState<"upstream" | "downstream">("upstream");

  const baseMultipliers = getDimensionMultipliers(spendType, processPhase);
  const details = getDimensionMultiplierDetails(spendType, processPhase);

  // Manual overrides
  const [overrides, setOverrides] = useState<Partial<Record<DimensionMultiplierKey, number>>>({});

  const effectiveMultipliers = { ...baseMultipliers, ...overrides };

  const hasOverrides = Object.keys(overrides).length > 0;

  function setOverride(key: DimensionMultiplierKey, value: number) {
    setOverrides(prev => ({ ...prev, [key]: value }));
  }
  function resetOverrides() { setOverrides({}); }

  // Example scenario simulator
  const [exampleValue, setExampleValue] = useState(2_000_000);
  const [dailyInaction, setDailyInaction] = useState(15_000);

  const rigidDaysBase = 85;
  const flexibleDaysBase = 42;
  const delayDays = Math.max(0, rigidDaysBase - flexibleDaysBase);

  const simulatedHiddenGap = Math.max(0,
    exampleValue * 0.10 * (effectiveMultipliers.tcoMultiplier - 1) * 3 +
    delayDays * dailyInaction * effectiveMultipliers.delayMultiplier +
    exampleValue * 0.03 * (effectiveMultipliers.renegotiationMultiplier - 1)
  );

  const baseGap = Math.max(0,
    exampleValue * 0.10 * (baseMultipliers.tcoMultiplier - 1) * 3 +
    delayDays * dailyInaction * baseMultipliers.delayMultiplier +
    exampleValue * 0.03 * (baseMultipliers.renegotiationMultiplier - 1)
  );

  const gapChange = simulatedHiddenGap - baseGap;
  const gapChangePercent = baseGap > 0 ? ((simulatedHiddenGap / baseGap) - 1) * 100 : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
          Research Tool • Live from model
        </span>
        <h1 className="mt-3 text-3xl font-bold">Model Assumptions Explorer (2026)</h1>
        <p className="mt-2 text-lg text-gray-600">
          Adjust the two contextual dimensions (Spend Type × Process Phase) and see the exact multipliers the production model applies in real time.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          All values below come directly from <code>getDimensionMultipliers()</code> — the same code used by the calculator, optimizer, and PDF reports.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Spend Type</div>
          <div className="flex gap-2">
            {(["direct", "indirect"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSpendType(t)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${spendType === t ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 hover:bg-gray-50"}`}
              >
                {t === "direct" ? "Direct (strategic)" : "Indirect (support)"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Process Phase</div>
          <div className="flex gap-2">
            {(["upstream", "downstream"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProcessPhase(p)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${processPhase === p ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 hover:bg-gray-50"}`}
              >
                {p === "upstream" ? "Upstream (strategic)" : "Downstream (operational)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual overrides */}
      <div className="mb-8 rounded-2xl border border-purple-200 bg-purple-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-purple-900">Manual multiplier overrides (sensitivity analysis)</h3>
            <p className="text-sm text-purple-700 mt-1">Tweak the values to explore how the model behaves under different assumptions.</p>
          </div>
          {hasOverrides && (
            <button onClick={resetOverrides} className="text-xs px-3 py-1.5 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-100">
              Reset to model defaults
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {([
            { key: "tcoMultiplier", label: "TCO leverage", min: 0.8, max: 2.2, step: 0.05 },
            { key: "delayMultiplier", label: "Delay penalty", min: 0.5, max: 2.5, step: 0.05 },
            { key: "renegotiationMultiplier", label: "Renegotiation exposure", min: 0.5, max: 2.5, step: 0.05 },
            { key: "staffIntensityMultiplier", label: "Team effort intensity", min: 0.6, max: 2.0, step: 0.05 },
            { key: "coordinationIntensityMultiplier", label: "Coordination overhead", min: 0.6, max: 2.0, step: 0.05 },
          ] as const).map(({ key, label, min, max, step }) => {
            const baseVal = baseMultipliers[key];
            const effVal = effectiveMultipliers[key];
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-mono tabular-nums text-purple-700 font-semibold">
                    {effVal.toFixed(2)}x {effVal !== baseVal && <span className="text-xs text-purple-500">({baseVal.toFixed(2)}x)</span>}
                  </span>
                </div>
                <input type="range" min={min} max={max} step={step} value={effVal} onChange={e => setOverride(key, parseFloat(e.target.value))} className="w-full accent-purple-600" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {hasOverrides ? "Effective multipliers (with overrides)" : "Live multipliers (production model)"}
          </h3>
          
          <div className="space-y-2 text-sm">
            {details.length > 0 ? (
              details.map((d) => {
                const multiplierKey = DIMENSION_DETAIL_TO_MULTIPLIER[d.key];
                const baseVal = baseMultipliers[multiplierKey];
                const effVal = effectiveMultipliers[multiplierKey];
                return (
                  <div key={d.key} className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-gray-700">{d.labelEn}</span>
                    <span className="font-mono font-semibold tabular-nums text-blue-700">
                      {effVal.toFixed(2)}x {effVal !== baseVal && <span className="text-purple-600 text-xs ml-1">({baseVal.toFixed(2)}x)</span>}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No adjustments — neutral context</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t text-xs text-gray-500">
            These values are consumed by <strong>calculateCosts</strong>, <strong>deriveStaffCost</strong>, the path optimizer, and PDF export.
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Scenario impact simulator</h3>

          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Contract value (PLN)</label>
              <input type="number" value={exampleValue} onChange={e => setExampleValue(Number(e.target.value))} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Daily cost of inaction (PLN)</label>
              <input type="number" value={dailyInaction} onChange={e => setDailyInaction(Number(e.target.value))} className="w-full border rounded px-3 py-1.5 text-sm" />
            </div>
          </div>

          <div className="text-center py-4 border-y">
            <div className="text-xs text-gray-500">Simplified modeled difference (rigid path)</div>
            <div className="mt-1 text-4xl font-bold tabular-nums text-red-600">
              {simulatedHiddenGap.toLocaleString("en-US")} PLN
            </div>
            {hasOverrides && (
              <div className={`text-sm mt-1 ${gapChange > 0 ? "text-red-600" : "text-green-600"}`}>
                {gapChange > 0 ? "+" : ""}{Math.round(gapChange).toLocaleString("en-US")} PLN ({gapChangePercent > 0 ? "+" : ""}{gapChangePercent.toFixed(1)}% vs model baseline)
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-gray-500">Simplified simulation for sensitivity testing.</p>
        </div>
      </div>

      {/* Deep integration */}
      <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Use these settings in the main calculator</h3>
        <p className="text-sm text-blue-800 mb-4">Open the calculator with this context. Manual overrides above apply only to the simplified sensitivity analysis.</p>
        
        <div className="flex flex-wrap gap-3">
          <Link href="/en/calculator" className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
            Open calculator and select this context
          </Link>
          <Link href="/en/calculator" className="inline-flex items-center px-5 py-2.5 rounded-xl border border-blue-300 text-blue-700 text-sm font-medium hover:bg-white transition">
            Go to calculator
          </Link>
        </div>
        <p className="mt-3 text-xs text-blue-700">The calculator uses the model baseline for the selected Spend Type × Process Phase. Overrides are not passed into the main calculation engine.</p>
      </div>

      <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
        <strong>Research note:</strong> These multipliers are calibrated modeling assumptions (2026). They are the primary target of the empirical validation plan.
        Overridden values above are for sensitivity analysis only.
      </div>

      {/* Researcher Export – English mirror */}
      <div className="mt-6 flex justify-end print:hidden">
        <button
          onClick={() => {
            const dims = getDimensionMultiplierDetails(spendType, processPhase);
            const effective = effectiveMultipliers;

            const repInputs: ProcurementInputs = {
              contractValue: exampleValue,
              tcoHorizonYears: 3,
              processType: "pzp_eu",
              techLevel: "partial_erp",
              stakeholders: {
                buyer: { count: 1, dailyRate: 1200 },
                lawyer: { count: 1, dailyRate: 1400 },
                finance: { count: 1, dailyRate: 1100 },
                manager: { count: 1, dailyRate: 1500 },
                executive: { count: 1, dailyRate: 2200 },
                requestor: { count: 1, dailyRate: 900 },
              },
              dailyCostOfInaction: dailyInaction,
              renegotiationCost: Math.round(exampleValue * 0.08),
              bypassAuditExposure: Math.round(exampleValue * 0.05),
              spendType,
              processPhase,
            };

            const fullResult = calculateCosts(repInputs);

            const payload = {
              meta: {
                model: "ProcuraCost",
                modelVersion: MODEL_VERSION,
                appVersion: VERSION,
                exportedAt: new Date().toISOString(),
                surface: "Assumptions Explorer (research tool)",
                note: "Live multipliers from getDimensionMultipliers + getDimensionMultiplierDetails. Full result uses calculateCosts. See model_specification_draft.md.",
              },
              context: { spendType, processPhase },
              multipliers: { base: baseMultipliers, effective, details: dims },
              representativeScenario: {
                inputs: repInputs,
                results: {
                  rigidDays: fullResult.rigidDays,
                  flexibleDays: fullResult.flexibleDays,
                  delta: fullResult.delta,
                  deltaPercent: fullResult.deltaPercent,
                  bypassProbability: fullResult.bypassProbability,
                  flexibleBypassProbability: fullResult.flexibleBypassProbability,
                  rigid: fullResult.rigid,
                  flexible: fullResult.flexible,
                  trace: fullResult.trace,
                },
                sources: fullResult.sources,
              },
              simulator: {
                exampleValue,
                dailyInaction,
                simulatedHiddenGap,
                baseGap,
                gapChange,
                gapChangePercent,
              },
            };

            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `procura-research-multipliers-${spendType}-${processPhase}-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="rounded-xl border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
          title="Export current multipliers (base + effective), details, and a full computed scenario for replication / paper"
        >
          Export for Research (JSON + multipliers + scenario)
        </button>
        <button
          onClick={() => {
            const dims = getDimensionMultiplierDetails(spendType, processPhase);
            const csvHeader = 'Key,Value\n';
            const multRows = dims.map((d) => {
              const key = DIMENSION_DETAIL_TO_MULTIPLIER[d.key];
              return `${d.labelEn || d.label},${effectiveMultipliers[key].toFixed(2)}x`;
            }).join('\n');
            const simRows = `ExampleValue,${exampleValue}\nDailyInaction,${dailyInaction}\nSimulatedGap,${simulatedHiddenGap}\nBaseGap,${baseGap}`;
            const csv = csvHeader + multRows + '\n' + simRows;
            navigator.clipboard.writeText(csv);
          }}
          className="ml-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          title="Copy multipliers and simulator values as CSV for easy pasting into paper or spreadsheet"
        >
          Copy multipliers CSV
        </button>
      </div>
    </div>
  );
}
