"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  LineChart,
  Line,
  Cell,
} from "recharts";
import {
  ComparisonResult,
  ProcurementInputs,
  formatPLN,
  formatPercent,
  formatCompact,
  calculateMatrix,
  calculateCosts,
  MatrixCell,
  TechLevelId,
  getDimensionMultiplierDetails,
} from "@/lib/calculations";
import { Scenario, SCENARIOS } from "@/lib/scenarios";
import { comparisonT, Lang } from "@/lib/i18n";
import {
  getSteps,
  TECH_LEVELS,
  PROCESS_TYPE_META,
  ProcessStep,
} from "@/lib/process-templates";

const SENSITIVITY_MULTIPLIERS = [0.1, 0.25, 0.5, 1, 2, 5, 10];

interface Props {
  result: ComparisonResult;
  scenario: Scenario;
  inputs: ProcurementInputs;
  lang?: Lang;
}

const TECH_LEVEL_IDS: TechLevelId[] = ["manual", "sourcing_tool", "partial_erp", "end_to_end"];

function matrixColor(cost: number, min: number, max: number): string {
  const ratio = max === min ? 0.5 : (cost - min) / (max - min);
  // green (low cost) → yellow → red (high cost)
  if (ratio < 0.5) {
    const g = Math.round(200 + ratio * 2 * 55);
    return `rgb(${Math.round(ratio * 2 * 255)}, ${g}, 60)`;
  }
  const r = 255;
  const g = Math.round(200 - (ratio - 0.5) * 2 * 180);
  return `rgb(${r}, ${Math.max(20, g)}, 40)`;
}

export default function CostComparison({ result, scenario, inputs, lang = "pl" }: Props) {
  const tx = comparisonT[lang];
  const COST_LABELS = tx.costLabels;
  const { rigid, flexible, delta, deltaPercent, bypassProbability, sources, rigidDays, flexibleDays } = result;

  // Steps for explanation table
  const steps = getSteps(inputs.processType, inputs.customSteps);

  // Display selected dimensions (Direct/Indirect + Upstream/Downstream) if provided
  const spendLabel = inputs.spendType 
    ? (inputs.spendType === "direct" ? (lang === "en" ? "Direct" : "Direct") : (lang === "en" ? "Indirect" : "Indirect"))
    : null;

  const phaseLabel = inputs.processPhase
    ? (inputs.processPhase === "upstream" ? (lang === "en" ? "Upstream" : "Upstream") : (lang === "en" ? "Downstream" : "Downstream"))
    : null;

  // 2D matrix
  const matrix = calculateMatrix(inputs);
  const allCosts = matrix.map((c) => c.totalCost);
  const minCost = Math.min(...allCosts);
  const maxCost = Math.max(...allCosts);

  const chartData = (Object.keys(COST_LABELS) as Array<keyof typeof COST_LABELS>).map((key) => ({
    name: COST_LABELS[key],
    [tx.rigidLabel]: rigid[key as keyof typeof rigid] as number,
    [tx.flexibleLabel]: flexible[key as keyof typeof flexible] as number,
  }));

  const sourcesEntries = Object.entries(sources);

  // Radar chart: 5 cost dimensions normalized to 100
  const radarDimensions = [
    { key: "timeCost", label: lang === "en" ? "Time" : "Czas" },
    { key: "opportunityCost", label: lang === "en" ? "Opportunity" : "Okazje" },
    { key: "renegotiationCost", label: lang === "en" ? "Renegotiation" : "Renegocjacje" },
    { key: "tcoCost", label: "TCO" },
    { key: "bypassCost", label: lang === "en" ? "Bypass" : "Obejście" },
    { key: "productivityCost", label: lang === "en" ? "Productivity" : "Produktywność" },
  ] as const;

  const radarData = radarDimensions.map(({ key, label }) => {
    const r = rigid[key as keyof typeof rigid] as number;
    const f = flexible[key as keyof typeof flexible] as number;
    const maxVal = Math.max(r, f, 1);
    return {
      dimension: label,
      [tx.rigidLabel]: Math.round((r / maxVal) * 100),
      [tx.flexibleLabel]: Math.round((f / maxVal) * 100),
    };
  });

  // Sensitivity analysis: sweep contract value 10%–1000% of current
  const baseValue = inputs.contractValue;
  const sensitivityData = SENSITIVITY_MULTIPLIERS.map((mult) => {
    const r = calculateCosts({ ...inputs, contractValue: baseValue * mult });
    const label = formatCompact(baseValue * mult);
    return {
      value: label,
      [tx.rigidLabel]: Math.round(r.rigid.total),
      [tx.flexibleLabel]: Math.round(r.flexible.total),
      delta: Math.round(r.delta),
    };
  });

  function getCell(tl: TechLevelId, mode: "rigid" | "flexible"): MatrixCell {
    return matrix.find((c) => c.techLevel === tl && c.processMode === mode)!;
  }

  const processLabel = inputs.processType !== "custom"
    ? (lang === "en" ? PROCESS_TYPE_META[inputs.processType].nameEn : PROCESS_TYPE_META[inputs.processType].name)
    : (lang === "en" ? "Custom" : "Własny");

  const benchmarkData = useMemo(() => {
    const refItems = SCENARIOS.filter((s) => s.caseStudy).map((s) => {
      const r = calculateCosts(s.inputs);
      const premium = r.flexible.total > 0 ? Math.round((r.delta / r.flexible.total) * 100) : 0;
      return { name: lang === "en" ? s.nameEn : s.name, premium, isUser: false as boolean };
    });
    const userPremium = flexible.total > 0 ? Math.round((delta / flexible.total) * 100) : 0;
    const userEntry = { name: lang === "en" ? tx.benchmarkYours : tx.benchmarkYours, premium: userPremium, isUser: true as boolean };
    const sorted = [...refItems, userEntry].sort((a, b) => a.premium - b.premium);
    const higherThanCount = refItems.filter((x) => x.premium < userPremium).length;
    return { data: sorted, userPremium, higherThanCount, total: refItems.length };
  }, [lang, delta, flexible.total, tx.benchmarkYours]);

  return (
    <div className="space-y-8">
      {/* Delta headline */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white">
        <p className="text-sm font-medium uppercase tracking-wide opacity-80">
          {tx.deltaHeadline}
        </p>
        <p className="mt-1 text-4xl font-bold">{formatPLN(delta)}</p>
        <p className="mt-1 text-lg opacity-90">
          {formatPercent(deltaPercent)} {tx.higherThan}
        </p>
        {/* Days comparison */}
        <div className="mt-3 flex gap-4 text-sm">
          <span className="rounded-lg bg-white/10 px-3 py-1">
            {tx.rigidLabel}: <strong>{rigidDays}</strong> {lang === "en" ? "days" : "dni"}
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1">
            {tx.flexibleLabel}: <strong>{flexibleDays}</strong> {lang === "en" ? "days" : "dni"}
          </span>
        </div>

        {/* New dimensions display (Direct/Indirect + Upstream/Downstream) */}
        {(spendLabel || phaseLabel) && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {spendLabel && (
              <span className="rounded-full bg-white/20 px-3 py-0.5">
                {lang === "en" ? "Spend" : "Wydatki"}: <strong>{spendLabel}</strong>
              </span>
            )}
            {phaseLabel && (
              <span className="rounded-full bg-white/20 px-3 py-0.5">
                {lang === "en" ? "Phase" : "Faza"}: <strong>{phaseLabel}</strong>
              </span>
            )}
            <span className="text-white/60 italic ml-1">• model adjusted for context</span>
          </div>
        )}

        {/* Explanation of dimension-based adjustments (new) */}
        {(inputs.spendType || inputs.processPhase) && (
          <div className="mt-4 rounded-xl border border-white/20 bg-white/5 p-3 text-xs text-white/90">
            <p className="font-medium mb-1">Model adjustments applied:</p>
            <ul className="space-y-0.5 pl-1 text-white/80">
              {inputs.spendType === "direct" && (
                <li>• Higher TCO optimization potential (+35%)</li>
              )}
              {inputs.processPhase === "upstream" && (
                <li>• Higher bypass risk in rigid scenarios (+25%)</li>
              )}
              {inputs.processPhase === "downstream" && (
                <li>• Slightly lower productivity impact from rigidity</li>
              )}
              {inputs.spendType === "direct" && inputs.processPhase === "upstream" && (
                <li>• Strongest combined effect (strategic Direct spend)</li>
              )}
            </ul>
          </div>
        )}

        {/* Bypass probability indicator */}
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-white/10 p-3">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
              {tx.bypassLabel}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-orange-400"
                  style={{ width: `${Math.round(bypassProbability * 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold">{Math.round(bypassProbability * 100)}%</span>
            </div>
            <p className="mt-1 text-xs opacity-60">{tx.bypassNote}</p>
          </div>
        </div>
        {scenario.caseStudy && (
          <div className="mt-3 rounded-xl bg-white/10 p-3 text-sm">
            <p className="font-semibold">{scenario.caseStudy.title}</p>
            <p className="mt-1 opacity-90">
              {lang === "en" ? scenario.caseStudy.insightEn : scenario.caseStudy.insight}
            </p>
            <p className="mt-1 text-xs opacity-60">
              {lang === "en" ? "Source" : "Źródło"}: {scenario.caseStudy.source}
            </p>
          </div>
        )}
      </div>

      {/* Pipe vs Field interpretation */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {tx.pipeFieldTitle}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
              {tx.pipeLabel}
            </p>
            <p className="mt-1 font-mono text-xs text-gray-500">a₁ → a₂ → a₃ → ··· → aₙ</p>
            <p className="mt-2 text-xs leading-relaxed text-red-700">{tx.pipeDesc}</p>
          </div>
          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
              {tx.fieldLabel}
            </p>
            <p className="mt-1 font-mono text-xs text-gray-500">
              {lang === "en"
                ? "∂Φ = {authorisation, competition, ethics, documentation}"
                : "∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-green-700">{tx.fieldDesc}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">{tx.pipeFieldSource}</p>
      </div>

      {/* Side-by-side totals with sub-breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-500">{tx.rigidLabel}</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{formatPLN(rigid.total)}</p>
          <div className="mt-2 space-y-0.5 text-xs text-red-400">
            <div>{tx.staffCost}: {formatPLN(rigid.staffCost)}</div>
            <div>{tx.coordCost}: {formatPLN(rigid.coordCost)}</div>
            <div>{tx.toolCost}: {formatPLN(rigid.toolCost)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-500">{tx.flexibleLabel}</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{formatPLN(flexible.total)}</p>
          <div className="mt-2 space-y-0.5 text-xs text-green-400">
            <div>{tx.staffCost}: {formatPLN(flexible.staffCost)}</div>
            <div>{tx.coordCost}: {formatPLN(flexible.coordCost)}</div>
            <div>{tx.toolCost}: {formatPLN(flexible.toolCost)}</div>
          </div>
        </div>
      </div>

      {/* Process steps table */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">{tx.stepsTitle}</h3>
        <p className="mb-3 text-xs text-gray-400">{processLabel} — {TECH_LEVELS[inputs.techLevel][lang === "en" ? "nameEn" : "name"]}</p>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-500">
                  {lang === "en" ? "Step" : "Krok"}
                </th>
                <th className="px-3 py-2 text-right font-medium text-red-400">{tx.stepsRigidDays}</th>
                <th className="px-3 py-2 text-right font-medium text-green-400">{tx.stepsFlexDays}</th>
                <th className="px-3 py-2 text-center font-medium text-gray-400">{tx.stepsMandatory}</th>
                <th className="px-3 py-2 text-left font-medium text-gray-400 hidden sm:table-cell">{tx.stepsParticipants}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {steps.map((step: ProcessStep) => (
                <tr key={step.id} className={step.mandatoryWait ? "bg-orange-50" : "hover:bg-gray-50"}>
                  <td className="px-3 py-2 font-medium text-gray-700">
                    {lang === "en" ? step.nameEn : step.name}
                    {step.mandatoryWait && (
                      <span className="ml-1.5 rounded bg-orange-100 px-1 py-0.5 text-xs text-orange-600">
                        {lang === "en" ? "⚖ legal" : "⚖ prawo"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-red-600">
                    {Math.round(step.rigidDays * TECH_LEVELS[inputs.techLevel].timeMultiplier)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {step.flexibleDays === null ? (
                      <span className="italic text-gray-300">{tx.stepsEliminated}</span>
                    ) : (
                      <span className="text-green-600">
                        {Math.round(step.flexibleDays * TECH_LEVELS[inputs.techLevel].timeMultiplier * 0.85)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {step.mandatoryWait ? "✓" : ""}
                  </td>
                  <td className="px-3 py-2 text-gray-400 hidden sm:table-cell">
                    {Object.entries(step.participation)
                      .map(([r, h]) => `${r} ${h}h`)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-3 py-2">{lang === "en" ? "TOTAL" : "SUMA"}</td>
                <td className="px-3 py-2 text-right text-red-600">{rigidDays}</td>
                <td className="px-3 py-2 text-right text-green-600">{flexibleDays}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 2D matrix — visibly context-adjusted (pogłębienie) */}
      <div>
        <h3 className="mb-1.5 text-sm font-semibold text-gray-700">{tx.matrixTitle}</h3>
        {(inputs.spendType || inputs.processPhase) ? (
          <div className="mb-2 rounded-md bg-blue-50 border border-blue-100 px-2.5 py-1.5 text-[11px] text-blue-700">
            <span className="font-medium">
              {lang === "en" ? "Matrix reflects current context:" : "Macierz uwzględnia bieżący kontekst:"}
            </span>{" "}
            <span className="font-semibold">
              {inputs.spendType === "direct" ? (lang === "en" ? "Direct spend" : "Wydatki Direct") : inputs.spendType === "indirect" ? (lang === "en" ? "Indirect spend" : "Wydatki Indirect") : ""}
              {inputs.spendType && inputs.processPhase ? " × " : ""}
              {inputs.processPhase === "upstream" ? (lang === "en" ? "Upstream (strategic)" : "Upstream (strategiczny)") : inputs.processPhase === "downstream" ? (lang === "en" ? "Downstream (operational)" : "Downstream (operacyjny)") : ""}
            </span>
            <span className="ml-1 text-blue-600/70">
              — {lang === "en"
                ? "higher senior involvement, elevated TCO leverage and risk premia in Upstream+Direct; lighter overhead in Downstream+Indirect."
                : "wyższa rola kadry zarządzającej, większa dźwignia TCO i premie ryzyka w Upstream+Direct; mniejsze narzuty w Downstream+Indirect."}
            </span>
          </div>
        ) : (
          <p className="mb-2 text-[10px] text-gray-500">
            {lang === "en"
              ? "Matrix shows all technology × process mode combinations for the selected procurement type."
              : "Macierz pokazuje wszystkie kombinacje technologii × trybu procesu dla wybranego typu zakupu."}
          </p>
        )}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-500">{tx.matrixTechLabel}</th>
                <th className="px-3 py-2 text-center font-medium text-red-400" colSpan={2}>{tx.matrixRigid}</th>
                <th className="px-3 py-2 text-center font-medium text-green-500" colSpan={2}>{tx.matrixFlexible}</th>
              </tr>
              <tr className="bg-gray-50 text-gray-400">
                <th />
                <th className="px-3 py-1 text-right">{tx.matrixTotalCost}</th>
                <th className="px-3 py-1 text-right">{tx.matrixDays}</th>
                <th className="px-3 py-1 text-right">{tx.matrixTotalCost}</th>
                <th className="px-3 py-1 text-right">{tx.matrixDays}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TECH_LEVEL_IDS.map((tl) => {
                const rigidCell = getCell(tl, "rigid");
                const flexCell = getCell(tl, "flexible");
                const isActive = tl === inputs.techLevel;
                return (
                  <tr key={tl} className={isActive ? "ring-1 ring-inset ring-blue-300 bg-blue-50" : "hover:bg-gray-50"}>
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {lang === "en" ? TECH_LEVELS[tl].nameEn : TECH_LEVELS[tl].name}
                      {isActive && (
                        <span className="ml-1.5 rounded bg-blue-100 px-1 py-0.5 text-xs text-blue-600">
                          {lang === "en" ? "current" : "aktualne"}
                        </span>
                      )}
                    </td>
                    <td
                      className="px-3 py-2 text-right font-semibold tabular-nums"
                      style={{ color: matrixColor(rigidCell.totalCost, minCost, maxCost) }}
                    >
                      {formatPLN(rigidCell.totalCost)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-400 tabular-nums">{rigidCell.days}</td>
                    <td
                      className="px-3 py-2 text-right font-semibold tabular-nums"
                      style={{ color: matrixColor(flexCell.totalCost, minCost, maxCost) }}
                    >
                      {formatPLN(flexCell.totalCost)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-400 tabular-nums">{flexCell.days}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          {lang === "en"
            ? "Color gradient: green = lowest cost, red = highest. Row highlighted = current selection. Numbers already incorporate Spend Type × Process Phase effects."
            : "Gradient kolorów: zielony = najniższy koszt, czerwony = najwyższy. Wiersz podświetlony = aktualne ustawienie. Wartości uwzględniają efekty Spend Type × Process Phase."}
        </p>
      </div>

      {/* Live numeric context multipliers (pogłębienie — visible without PDF) */}
      {(inputs.spendType || inputs.processPhase) && (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-[11px]">
          <div className="mb-1 font-medium text-blue-800">
            {lang === "en" ? "Applied context multipliers" : "Zastosowane mnożniki kontekstu"}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-blue-700 tabular-nums">
            {getDimensionMultiplierDetails(inputs.spendType, inputs.processPhase).map((d) => (
              <span key={d.key}>
                {lang === "en" ? d.labelEn : d.label}: <span className="font-semibold">{d.value.toFixed(2)}x</span>
              </span>
            ))}
          </div>
          <div className="mt-1 text-[10px] text-blue-600/70">
            {lang === "en"
              ? "These factors directly scale TCO opportunity cost, delay penalty, renegotiation exposure, staff hours intensity and coordination overhead in the calculations above."
              : "Te czynniki skalują bezpośrednio koszt alternatywny TCO, karę za opóźnienie, ekspozycję na renegocjacje, intensywność godzin zespołu i narzut koordynacyjny w powyższych wyliczeniach."}
          </div>
        </div>
      )}

      {/* Stacked bar chart */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">{tx.chartTitle}</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={formatCompact}
              tick={{ fontSize: 11, fill: "#6b7280" }}
            />
            <Tooltip
              formatter={(value) => [formatPLN(Number(value ?? 0)), ""]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: "8px" }} />
            <Bar dataKey={tx.rigidLabel} fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey={tx.flexibleLabel} fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart — cost profile */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">
          {lang === "en" ? "Cost profile — 6 dimensions (normalized)" : "Profil kosztów — 6 wymiarów (znormalizowane)"}
        </h3>
        <p className="mb-3 text-xs text-gray-400">
          {lang === "en"
            ? "Each axis shows the cost in that dimension as a % of the higher value (100 = maximum). Smaller area = lower cost."
            : "Każda oś pokazuje koszt w danym wymiarze jako % wartości wyższej (100 = max). Mniejsza powierzchnia = niższy koszt."}
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Radar
              name={tx.rigidLabel}
              dataKey={tx.rigidLabel}
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.18}
            />
            <Radar
              name={tx.flexibleLabel}
              dataKey={tx.flexibleLabel}
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.18}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Sensitivity analysis */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">
          {lang === "en"
            ? "Sensitivity: cost vs. contract value"
            : "Wrażliwość: koszty vs. wartość kontraktu"}
        </h3>
        <p className="mb-3 text-xs text-gray-400">
          {lang === "en"
            ? "How total costs change as contract value varies. All other parameters fixed."
            : "Jak zmieniają się koszty całkowite przy zmianie wartości kontraktu. Pozostałe parametry stałe."}
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={sensitivityData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="value"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              label={{ value: "PLN", position: "insideBottomRight", offset: -4, fontSize: 10 }}
            />
            <YAxis
              tickFormatter={formatCompact}
              tick={{ fontSize: 11, fill: "#6b7280" }}
            />
            <Tooltip
              formatter={(value) => [formatPLN(Number(value ?? 0)), ""]}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey={tx.rigidLabel}
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={tx.flexibleLabel}
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="delta"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
              name={lang === "en" ? "Cost gap" : "Różnica"}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-1 text-xs text-gray-400">
          {lang === "en"
            ? "Blue dashed line = cost gap (rigid − flexible). Current scenario marked at 100% (contract value 1×)."
            : "Niebieska przerywana = różnica kosztów (sztywny − elastyczny). Aktualny scenariusz przy 100% (wartość kontraktu 1×)."}
        </p>
      </div>

      {/* Detailed breakdown table */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">{tx.tableTitle}</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">{tx.colCostDim}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-red-500">{tx.rigidLabel}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-green-500">{tx.flexibleLabel}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">{tx.colDiff}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(Object.keys(COST_LABELS) as Array<keyof typeof COST_LABELS>).map((key) => {
                const r = rigid[key as keyof typeof rigid] as number;
                const f = flexible[key as keyof typeof flexible] as number;
                const diff = r - f;
                return (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{COST_LABELS[key]}</td>
                    <td className="px-4 py-3 text-right text-red-600">{formatPLN(r)}</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatPLN(f)}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {diff > 0 ? (
                        <span className="text-red-500">+{formatPLN(diff)}</span>
                      ) : diff < 0 ? (
                        <span className="text-green-500">{formatPLN(diff)}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-3">{lang === "en" ? "TOTAL" : "SUMA"}</td>
                <td className="px-4 py-3 text-right text-red-600">{formatPLN(rigid.total)}</td>
                <td className="px-4 py-3 text-right text-green-600">{formatPLN(flexible.total)}</td>
                <td className="px-4 py-3 text-right text-red-600">+{formatPLN(delta)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Benchmark comparison */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700">{tx.benchmarkTitle}</h3>
        <p className="mb-3 text-xs text-gray-400">{tx.benchmarkSubtitle}</p>
        <ResponsiveContainer width="100%" height={Math.max(180, benchmarkData.data.length * 28)}>
          <BarChart
            data={benchmarkData.data}
            layout="vertical"
            margin={{ top: 0, right: 50, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} unit="%" />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#374151" }}
              width={140}
            />
            <Tooltip formatter={(v) => [`${v}%`, lang === "en" ? "Premium" : "Premia"]} contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="premium" radius={[0, 4, 4, 0]}>
              {benchmarkData.data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.isUser ? "#3b82f6" : "#d1d5db"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-gray-500">
          {tx.benchmarkSummary(benchmarkData.userPremium, benchmarkData.higherThanCount, benchmarkData.total)}
        </p>
      </div>

      {/* Sources */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {tx.sourcesTitle}
        </h3>
        <ul className="space-y-1">
          {sourcesEntries.map(([key, src]) => (
            <li key={key} className="text-xs text-gray-500">
              <span className="font-medium text-gray-600">
                {COST_LABELS[key as keyof typeof COST_LABELS]}:
              </span>{" "}
              {src}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
