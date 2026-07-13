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

export default function AssumptionsExplorer() {
  // Live controls for the two main dimensions (what the real model uses)
  const [spendType, setSpendType] = useState<"direct" | "indirect">("direct");
  const [processPhase, setProcessPhase] = useState<"upstream" | "downstream">("upstream");

  // Get the *actual* multipliers from the production model code
  const baseMultipliers = getDimensionMultipliers(spendType, processPhase);
  const details = getDimensionMultiplierDetails(spendType, processPhase);

  // === Manual overrides (for sensitivity analysis) ===
  const [overrides, setOverrides] = useState<Partial<Record<DimensionMultiplierKey, number>>>({});

  const effectiveMultipliers = { ...baseMultipliers, ...overrides };

  const hasOverrides = Object.keys(overrides).length > 0;

  function setOverride(key: DimensionMultiplierKey, value: number) {
    setOverrides(prev => ({ ...prev, [key]: value }));
  }

  function resetOverrides() {
    setOverrides({});
  }

  // === Example scenario simulator (for UX + deeper research value) ===
  const [exampleValue, setExampleValue] = useState(2_000_000); // 2M PLN contract
  const [dailyInaction, setDailyInaction] = useState(15_000);   // daily cost of delay

  // Simplified assumption-sensitivity simulator; separate from calculateCosts.
  const rigidDaysBase = 85;
  const flexibleDaysBase = 42;
  const delayDays = Math.max(0, rigidDaysBase - flexibleDaysBase);

  const tcoImpact = exampleValue * 0.10 * (effectiveMultipliers.tcoMultiplier - 1) * 3; // 3 years rough
  const delayImpact = delayDays * dailyInaction * effectiveMultipliers.delayMultiplier;
  const renegotiationImpact = exampleValue * 0.03 * (effectiveMultipliers.renegotiationMultiplier - 1);
  const simulatedHiddenGap = Math.max(0, tcoImpact + delayImpact + renegotiationImpact);
  const baseGap = (() => {
    const b = baseMultipliers;
    return Math.max(0,
      exampleValue * 0.10 * (b.tcoMultiplier - 1) * 3 +
      delayDays * dailyInaction * b.delayMultiplier +
      exampleValue * 0.03 * (b.renegotiationMultiplier - 1)
    );
  })();

  const gapChange = simulatedHiddenGap - baseGap;
  const gapChangePercent = baseGap > 0 ? ((simulatedHiddenGap / baseGap) - 1) * 100 : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
          Research Tool • Live from model
        </span>
        <h1 className="mt-3 text-3xl font-bold">Eksplorator założeń modelu (2026)</h1>
        <p className="mt-2 text-lg text-gray-600">
          Dostosuj dwa wymiary kontekstowe (Spend Type × Process Phase) i zobacz dokładnie, jakie mnożniki stosuje produkcyjny model w czasie rzeczywistym.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Wszystkie wartości poniżej pochodzą bezpośrednio z <code>getDimensionMultipliers()</code> — tego samego kodu, którego używa kalkulator i optimizer.
        </p>
      </div>

      {/* Dimension selectors */}
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
                {t === "direct" ? "Direct (strategiczne)" : "Indirect (wspierające)"}
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
                {p === "upstream" ? "Upstream (strategiczny)" : "Downstream (operacyjny)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manual overrides for sensitivity analysis (points 2 + 3) */}
      <div className="mb-8 rounded-2xl border border-purple-200 bg-purple-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-purple-900">Ręczne nadpisywanie mnożników (analiza wrażliwości)</h3>
            <p className="text-sm text-purple-700 mt-1">Zmieniaj wartości, żeby zobaczyć jak model zachowuje się przy innych założeniach.</p>
          </div>
          {hasOverrides && (
            <button
              onClick={resetOverrides}
              className="text-xs px-3 py-1.5 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Resetuj do wartości modelu
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {([
            { key: "tcoMultiplier", label: "Dźwignia TCO", min: 0.8, max: 2.2, step: 0.05 },
            { key: "delayMultiplier", label: "Koszt opóźnienia", min: 0.5, max: 2.5, step: 0.05 },
            { key: "renegotiationMultiplier", label: "Ryzyko renegocjacji", min: 0.5, max: 2.5, step: 0.05 },
            { key: "staffIntensityMultiplier", label: "Intensywność pracy zespołu", min: 0.6, max: 2.0, step: 0.05 },
            { key: "coordinationIntensityMultiplier", label: "Intensywność koordynacji", min: 0.6, max: 2.0, step: 0.05 },
          ] as const).map(({ key, label, min, max, step }) => {
            const baseVal = baseMultipliers[key];
            const effVal = effectiveMultipliers[key];
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-mono tabular-nums text-purple-700 font-semibold">
                    {effVal.toFixed(2)}x
                    {effVal !== baseVal && <span className="text-xs text-purple-500 ml-1">(bazowo {baseVal.toFixed(2)}x)</span>}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={effVal}
                  onChange={(e) => setOverride(key, parseFloat(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live multipliers table (with override awareness) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {hasOverrides ? "Efektywne mnożniki (z nadpisaniem)" : "Aktualne mnożniki (produkcyjne)"}
          </h3>
          
          <div className="space-y-2 text-sm">
            {details.length > 0 ? (
              details.map((d) => {
                const multiplierKey = DIMENSION_DETAIL_TO_MULTIPLIER[d.key];
                const baseVal = baseMultipliers[multiplierKey];
                const effVal = effectiveMultipliers[multiplierKey];

                return (
                  <div key={d.key} className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-gray-700">{d.label}</span>
                    <span className="font-mono font-semibold tabular-nums text-blue-700">
                      {effVal.toFixed(2)}x
                      {effVal !== baseVal && <span className="text-purple-600 text-xs ml-1">({baseVal.toFixed(2)}x)</span>}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">Brak korekt — kontekst neutralny</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t text-xs text-gray-500">
            Te wartości są używane w <strong>calculateCosts</strong>, <strong>deriveStaffCost</strong>, optimizerze i raporcie PDF.
          </div>
        </div>

        {/* Enhanced impact simulator (points 2 + 3) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Symulator wpływu na przykładzie</h3>

          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Wartość kontraktu</label>
              <input 
                type="number" 
                value={exampleValue} 
                onChange={e => setExampleValue(Number(e.target.value))} 
                className="w-full border rounded px-3 py-1.5 text-sm" 
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Koszt bezczynności dziennie (PLN)</label>
              <input 
                type="number" 
                value={dailyInaction} 
                onChange={e => setDailyInaction(Number(e.target.value))} 
                className="w-full border rounded px-3 py-1.5 text-sm" 
              />
            </div>
          </div>

          <div className="text-center py-4 border-y">
            <div className="text-xs text-gray-500">Uproszczona modelowana różnica (sztywna ścieżka)</div>
            <div className="mt-1 text-4xl font-bold tabular-nums text-red-600">
              {simulatedHiddenGap.toLocaleString("pl-PL")} zł
            </div>
            {hasOverrides && (
              <div className={`text-sm mt-1 ${gapChange > 0 ? "text-red-600" : "text-green-600"}`}>
                {gapChange > 0 ? "+" : ""}{gapChange.toLocaleString("pl-PL")} zł 
                ({gapChangePercent > 0 ? "+" : ""}{gapChangePercent.toFixed(1)}% vs wartości bazowe modelu)
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            To uproszczona symulacja pokazująca kierunkowy wpływ zmian mnożników. 
            Pełny model zawiera dodatkowe interakcje (bypass, staff hours per step itd.).
          </p>
        </div>
      </div>

      {/* Deep integration with the main calculator (point 4) */}
      <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Użyj tych ustawień w kalkulatorze</h3>
        <p className="text-sm text-blue-800 mb-4">
          Otwórz kalkulator z wybranym kontekstem. Ręczne nadpisania powyżej dotyczą wyłącznie uproszczonej analizy wrażliwości.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/calculator"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Otwórz kalkulator i wybierz ten kontekst
          </Link>
          
          <Link 
            href="/calculator"
            className="inline-flex items-center px-5 py-2.5 rounded-xl border border-blue-300 text-blue-700 text-sm font-medium hover:bg-white transition"
          >
            Idź do kalkulatora (bez predefiniowanego kontekstu)
          </Link>
        </div>
        
        <p className="mt-3 text-xs text-blue-700">
          Kalkulator użyje bazowych mnożników modelu dla wybranego Spend Type i Process Phase. Nadpisania nie są przekazywane do głównego silnika obliczeń.
        </p>
      </div>

      <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
        <strong>Uwaga badawcza:</strong> Te mnożniki to obecnie kalibrowane założenia modelowe (2026). Są one głównym obiektem planu walidacji empirycznej (patrz docs/EMPIRICAL_VALIDATION_PLAN.md). 
        Nadpisane wartości powyżej służą wyłącznie analizie wrażliwości.
      </div>

      {/* Researcher Export – directly supports replication package and paper */}
      <div className="mt-6 flex justify-end print:hidden">
        <button
          onClick={() => {
            const dims = getDimensionMultiplierDetails(spendType, processPhase);
            const effective = effectiveMultipliers;

            // Build a representative full scenario using the explorer controls + sensible defaults
            // (researcher can override in their own runs; this captures the exact context + multipliers)
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
                note: "Live multipliers from getDimensionMultipliers + getDimensionMultiplierDetails. Full result uses calculateCosts with the displayed context. See model_specification_draft.md for exact adjustment rules.",
              },
              context: { spendType, processPhase },
              multipliers: {
                base: baseMultipliers,
                effective,
                details: dims,
              },
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
          title="Export current multipliers (base + effective), details, and a full computed scenario for the replication package or paper tables"
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
