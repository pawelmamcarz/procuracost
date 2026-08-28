import { decisionRecordT, modelV2T, type Lang } from "@/lib/i18n";
import type { ScenarioV2Id } from "@/lib/model-v2";
import { cn } from "@/lib/utils";

import type { ReferenceScenarioComparisonData } from "./reference-scenarios";

export interface ReferenceScenarioComparisonProps {
  lang: Lang;
  activeScenarioId: ScenarioV2Id;
  data: ReferenceScenarioComparisonData;
}

function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 2,
  }).format(value);
}

function scenarioName(lang: Lang, scenarioId: ScenarioV2Id): string {
  return modelV2T[lang].scenarios[scenarioId].name;
}

function position(value: number, denominator: number): string {
  if (denominator === 0) return "50%";
  return `${50 + (value / denominator) * 50}%`;
}

export default function ReferenceScenarioComparison({
  lang,
  activeScenarioId,
  data,
}: ReferenceScenarioComparisonProps) {
  const tx = decisionRecordT[lang].reference;
  const denominator = formatNumber(data.denominator, lang);

  return (
    <div>
      <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
        {tx.subtitle(denominator, data.unit)}
      </p>
      <ol className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
        {data.rows.map((row) => {
          const active = row.scenarioId === activeScenarioId;
          const name = scenarioName(lang, row.scenarioId);
          const low = formatNumber(row.low, lang);
          const central = formatNumber(row.central, lang);
          const high = formatNumber(row.high, lang);
          const lowPosition = position(row.low, data.denominator);
          const highPosition = position(row.high, data.denominator);
          const centralPosition = position(row.central, data.denominator);
          return (
            <li
              aria-label={tx.accessibleRange(
                name,
                low,
                central,
                high,
                data.unit
              )}
              className="space-y-4 py-5"
              data-central={row.central}
              data-high={row.high}
              data-low={row.low}
              data-reference-active={active ? "true" : "false"}
              data-scenario-id={row.scenarioId}
              key={row.scenarioId}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    active ? "text-blue-700" : "text-gray-900"
                  )}
                >
                  {name}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  {active ? tx.active : tx.other}
                </p>
              </div>

              <div
                aria-hidden="true"
                className="relative h-5"
              >
                <span className="absolute left-1/2 top-0 h-5 border-l border-gray-400" />
                <span
                  className="absolute top-2 h-px bg-gray-400"
                  style={{
                    left: lowPosition,
                    width: `calc(${highPosition} - ${lowPosition})`,
                  }}
                />
                <span
                  className={cn(
                    "absolute top-1.5 h-2.5 w-2.5 -translate-x-1/2 rotate-45",
                    active
                      ? "border border-blue-600 bg-blue-600"
                      : "border border-gray-500 bg-white"
                  )}
                  style={{ left: centralPosition }}
                />
              </div>

              <dl className="grid grid-cols-3 gap-3 font-mono text-xs tabular-nums text-gray-600">
                <div>
                  <dt className="font-sans text-[11px] text-gray-500">
                    {tx.low}
                  </dt>
                  <dd>{low} {data.unit}</dd>
                </div>
                <div className="text-center">
                  <dt className="font-sans text-[11px] text-gray-500">
                    {tx.central}
                  </dt>
                  <dd>{central} {data.unit}</dd>
                </div>
                <div className="text-right">
                  <dt className="font-sans text-[11px] text-gray-500">
                    {tx.high}
                  </dt>
                  <dd>{high} {data.unit}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
