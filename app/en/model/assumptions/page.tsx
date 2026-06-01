"use client";

import { useState } from "react";
import { getDimensionMultipliers, getDimensionMultiplierDetails } from "@/lib/calculations";

export default function AssumptionsExplorerEn() {
  const [spendType, setSpendType] = useState<"direct" | "indirect">("direct");
  const [processPhase, setProcessPhase] = useState<"upstream" | "downstream">("upstream");

  const multipliers = getDimensionMultipliers(spendType, processPhase);
  const details = getDimensionMultiplierDetails(spendType, processPhase);

  const illustrativeImpact = (multipliers.tcoMultiplier * 0.6 + multipliers.delayMultiplier * 0.4) - 1;

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Live multipliers (production model)</h3>
          
          <div className="space-y-2 text-sm">
            {details.length > 0 ? (
              details.map((d) => (
                <div key={d.key} className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                  <span className="text-gray-700">{d.labelEn}</span>
                  <span className="font-mono font-semibold tabular-nums text-blue-700">{d.value.toFixed(2)}x</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No adjustments — neutral context (all multipliers = 1.0x)</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t text-xs text-gray-500">
            These values are consumed by <strong>calculateCosts</strong>, <strong>deriveStaffCost</strong>, the path optimizer, and PDF export.
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Directional impact on cost gap</h3>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">Estimated rigid-path premium (TCO + delay)</div>
            <div className={`mt-2 text-6xl font-bold tabular-nums ${illustrativeImpact > 0.08 ? "text-red-600" : "text-blue-700"}`}>
              +{(illustrativeImpact * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500 mt-1">vs baseline</div>
          </div>

          <div className="mt-6 text-xs text-gray-600 leading-relaxed">
            The strongest effect appears at <strong>Direct × Upstream</strong> — high TCO leverage and senior effort intensity make the cost of rigid procedures rise the most.
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
        <strong>Research note:</strong> These multipliers are calibrated modeling assumptions (2026). They are the primary target of the empirical validation plan.
      </div>
    </div>
  );
}
