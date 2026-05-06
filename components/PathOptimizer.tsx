"use client";

import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  ProcurementFeatures,
  optimize,
  OptimizationResult,
  PATHS,
} from "@/lib/optimizer";
import { optimizerT, Lang } from "@/lib/i18n";
import { formatCompact } from "@/lib/calculations";

const defaultFeatures: ProcurementFeatures = {
  contractValue: 2_000_000,
  supplierCount: 5,
  complexity: 3,
  urgencyDays: 90,
  isPublicSector: false,
  innovationRequired: false,
  supplyRisk: 2,
  strategicImportance: 3,
  marketMaturity: 3,
};

function formatPLNShort(v: number) {
  return `${formatCompact(v)} PLN`;
}

export default function PathOptimizer({ lang = "pl" }: { lang?: Lang }) {
  const tx = optimizerT[lang];
  const [features, setFeatures] = useState<ProcurementFeatures>(defaultFeatures);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  function handleChange<K extends keyof ProcurementFeatures>(
    key: K,
    value: ProcurementFeatures[K]
  ) {
    setFeatures((prev) => ({ ...prev, [key]: value }));
  }

  function handleOptimize() {
    setResult(optimize(features, lang));
    setTimeout(() => {
      document.getElementById("optimizer-results")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  const sliderLabels = tx.sliderLevels;

  return (
    <div className="space-y-8">
      {/* Input form */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-bold text-gray-900">{tx.parametersTitle}</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contract value */}
          <div>
            <label className={labelClass}>
              {tx.contractValue}{" "}
              <span className="font-semibold text-gray-800">
                {formatPLNShort(features.contractValue)}
              </span>
            </label>
            <input
              type="range"
              min={50000}
              max={50_000_000}
              step={50000}
              value={features.contractValue}
              onChange={(e) => handleChange("contractValue", +e.target.value)}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>50k</span>
              <span>50M PLN</span>
            </div>
          </div>

          {/* Supplier count */}
          <div>
            <label className={labelClass}>
              {tx.supplierCount}{" "}
              <span className="font-semibold text-gray-800">{features.supplierCount}</span>
            </label>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={features.supplierCount}
              onChange={(e) => handleChange("supplierCount", +e.target.value)}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{tx.monopoly}</span>
              <span>{tx.supplierMax}</span>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className={labelClass}>
              {tx.timeAvailable}{" "}
              <span className="font-semibold text-gray-800">{features.urgencyDays} {tx.days}</span>
            </label>
            <input
              type="range"
              min={7}
              max={365}
              step={7}
              value={features.urgencyDays}
              onChange={(e) => handleChange("urgencyDays", +e.target.value)}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{tx.urgent}</span>
              <span>{tx.daysMax}</span>
            </div>
          </div>
        </div>

        {/* 5-scale sliders */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["complexity", tx.complexity],
              ["supplyRisk", tx.supplyRisk],
              ["strategicImportance", tx.strategicImportance],
              ["marketMaturity", tx.marketMaturity],
            ] as [keyof ProcurementFeatures, string][]
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>
                {label}:{" "}
                <span className="font-semibold text-gray-800">
                  {sliderLabels[features[key] as number]}
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={features[key] as number}
                onChange={(e) => handleChange(key, +e.target.value as ProcurementFeatures[typeof key])}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1</span>
                <span>5</span>
              </div>
            </div>
          ))}
        </div>

        {/* Toggles */}
        <div className="mt-5 flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={features.isPublicSector}
              onChange={(e) => handleChange("isPublicSector", e.target.checked)}
              className="h-4 w-4 rounded accent-blue-500"
            />
            <span className="text-sm text-gray-700">{tx.publicSector}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={features.innovationRequired}
              onChange={(e) => handleChange("innovationRequired", e.target.checked)}
              className="h-4 w-4 rounded accent-blue-500"
            />
            <span className="text-sm text-gray-700">{tx.innovationRequired}</span>
          </label>
        </div>

        <button
          onClick={handleOptimize}
          className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {tx.findPath}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div id="optimizer-results" className="space-y-6">
          {/* Top recommendation */}
          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: `linear-gradient(135deg, ${result.topPath.path.color}, ${result.topPath.path.color}cc)` }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
              {tx.recommended}
            </p>
            <p className="mt-2 text-3xl font-bold">
              {lang === "en" ? result.topPath.path.nameEn : result.topPath.path.name}
            </p>
            {result.topPath.path.pzpArticle && (
              <p className="mt-1 text-sm opacity-80">{result.topPath.path.pzpArticle}</p>
            )}
            <p className="mt-3 opacity-90">
              {lang === "en" ? result.topPath.path.descriptionEn : result.topPath.path.description}
            </p>

            <div className="mt-4 flex gap-4">
              <div className="rounded-xl bg-white/15 px-4 py-2 text-center">
                <p className="text-xs opacity-70">{tx.modelConfidence}</p>
                <p className="text-xl font-bold">
                  {Math.round(result.topPath.confidence * 100)}%
                </p>
              </div>
              <div className="rounded-xl bg-white/15 px-4 py-2 text-center">
                <p className="text-xs opacity-70">{tx.treeVotes}</p>
                <p className="text-xl font-bold">{result.topPath.votes}/30</p>
              </div>
              <div className="rounded-xl bg-white/15 px-4 py-2 text-center">
                <p className="text-xs opacity-70">{tx.typicalTime}</p>
                <p className="text-xl font-bold">
                  {result.topPath.path.typicalDays[0]}–{result.topPath.path.typicalDays[1]} {tx.days}
                </p>
              </div>
            </div>

            {/* PZP note */}
            <div className="mt-4 rounded-xl bg-white/10 p-3 text-sm">
              <p className="font-semibold opacity-80">{tx.pzpNote}</p>
              <p className="mt-1 opacity-90">{result.policyNote}</p>
            </div>
          </div>

          {/* Explanation card */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2">
              {tx.explanationTitle}
            </p>
            <p className="text-sm text-blue-900 leading-relaxed">{result.explanation}</p>
          </div>

          {/* All paths ranked */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              {tx.rankingTitle}
            </h3>
            <div className="space-y-3">
              {result.ranked.map((r, i) => (
                <div key={r.path.id} className="flex items-center gap-3">
                  <span className="w-4 text-xs font-bold text-gray-400">{i + 1}</span>
                  <div className="w-36 shrink-0">
                    <p className="text-xs font-medium text-gray-700">
                      {lang === "en" ? r.path.nameEn : r.path.name}
                    </p>
                    {r.path.pzpArticle && (
                      <p className="text-xs text-gray-400">{r.path.pzpArticle}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="h-5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(r.votes / 30) * 100}%`,
                          background: r.path.color,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-xs font-semibold text-gray-600">
                    {r.votes}/30
                  </span>
                  <span
                    className="w-14 rounded-full px-2 py-0.5 text-center text-xs font-bold text-white"
                    style={{ background: r.path.color }}
                  >
                    {Math.round(r.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature importance */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              {tx.importanceTitle}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={result.featureImportance.map((fi) => ({
                  name: fi.label,
                  wartość: Math.round(fi.importance * 100),
                }))}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 130, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#374151" }}
                  width={128}
                />
                <Tooltip formatter={(v) => [`${v}%`, tx.importance ?? "Ważność"]} />
                <Bar dataKey="wartość" radius={[0, 4, 4, 0]}>
                  {result.featureImportance.map((fi, i) => (
                    <Cell
                      key={fi.feature}
                      fill={i === 0 ? "#3b82f6" : i === 1 ? "#60a5fa" : "#93c5fd"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-gray-400">{tx.importanceNote}</p>
          </div>

          {/* Conditions & risks for top 2 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {result.ranked.slice(0, 2).map((r) => (
              <div
                key={r.path.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: r.path.color }}
                  />
                  <h4 className="font-bold text-gray-900">{r.path.name}</h4>
                </div>
                <div className="mt-3">
                  <p className="mb-1 text-xs font-semibold text-green-600">{tx.whenToUse}</p>
                  <ul className="space-y-0.5">
                    {(lang === "en" ? r.path.conditionsEn : r.path.conditions).map((c) => (
                      <li key={c} className="text-xs text-gray-600 before:mr-1 before:content-['✓']">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <p className="mb-1 text-xs font-semibold text-red-500">{tx.risks}</p>
                  <ul className="space-y-0.5">
                    {(lang === "en" ? r.path.risksEn : r.path.risks).map((risk) => (
                      <li key={risk} className="text-xs text-gray-600 before:mr-1 before:content-['⚠']">
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800">
            {tx.modelNote}{" "}
            <em>Machine Learning</em>, 45, 5–32.{" "}
            {lang === "en"
              ? "Class weights based on procurement theory: Williamson (1985) TCE, Kraljic (1983) portfolio."
              : "Wagi klas oparte na teorii zakupów: Williamson (1985) TCE, Kraljic (1983) portfolio."}
          </div>
        </div>
      )}
    </div>
  );
}
