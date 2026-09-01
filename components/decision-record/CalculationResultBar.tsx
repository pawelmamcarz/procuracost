import { History, RefreshCw } from "lucide-react";

import {
  calculatorV2T,
  decisionRecordT,
  type Lang,
} from "@/lib/i18n";
import type { AlternativeId, DecisionRecordV2 } from "@/lib/model-v2";

export interface CalculationResultBarProps {
  lang: Lang;
  record: DecisionRecordV2;
  stale: boolean;
  onRecalculate: () => void;
  recordHref: string;
}

const LANE_ORDER: AlternativeId[] = ["formalSequential", "adaptiveCompliant"];

function laneRule(alternativeId: AlternativeId): string {
  return alternativeId === "formalSequential" ? "bg-red-500" : "bg-green-500";
}

function formatCurrency(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDays(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 1,
  }).format(value);
}

export default function CalculationResultBar({
  lang,
  record,
  stale,
  onRecalculate,
  recordHref,
}: CalculationResultBarProps) {
  const tx = decisionRecordT[lang].resultBar;
  const alternativeLabels = calculatorV2T[lang].alternatives;
  const { deltaCost, deltaCostOuterEnvelope } = record.comparison;

  return (
    <aside
      aria-label={tx.regionLabel}
      className="z-10 -mx-5 border-t border-gray-200 bg-white px-5 py-3 sm:-mx-6 sm:px-6 lg:sticky lg:bottom-0"
      data-calculation-result-bar={stale ? "stale" : "current"}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
              {stale ? (
                <History aria-hidden="true" className="h-3.5 w-3.5" />
              ) : null}
              {stale ? tx.staleLabel : tx.currentLabel}
            </p>
            <p className="mt-1 font-mono text-xl font-bold tabular-nums text-blue-700">
              {formatCurrency(deltaCost, lang)}
            </p>
            <p className="font-mono text-[11px] text-gray-500">
              {tx.deltaLabel} · {record.metadata.currency}
            </p>
          </div>

          {LANE_ORDER.map((alternativeId) => (
            <div className="flex items-center gap-2.5" key={alternativeId}>
              <span
                aria-hidden="true"
                className={`h-8 w-0.5 shrink-0 ${laneRule(alternativeId)}`}
              />
              <div>
                <p className="max-w-40 text-xs leading-snug text-gray-600">
                  {alternativeLabels[alternativeId]}
                </p>
                <p className="mt-0.5 font-mono text-sm tabular-nums text-gray-900">
                  {formatCurrency(
                    record.alternatives[alternativeId].result.totalCost.central,
                    lang
                  )}
                  <span className="ml-2 text-xs text-gray-500">
                    {formatDays(
                      record.alternatives[alternativeId].result.elapsedDays
                        .central,
                      lang
                    )}{" "}
                    {tx.daysUnit}
                  </span>
                </p>
              </div>
            </div>
          ))}

          <div>
            <p className="text-xs font-medium text-gray-600">{tx.rangeLabel}</p>
            <p className="mt-1 font-mono text-sm tabular-nums text-gray-900">
              {formatCurrency(deltaCostOuterEnvelope.low, lang)} …{" "}
              {formatCurrency(deltaCostOuterEnvelope.high, lang)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          {stale ? (
            <>
              <p
                aria-live="polite"
                className="max-w-sm text-xs leading-relaxed text-gray-600"
              >
                {tx.staleNote}
              </p>
              <button
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={onRecalculate}
                type="button"
              >
                <RefreshCw aria-hidden="true" className="h-4 w-4" />
                {tx.recalculate}
              </button>
            </>
          ) : (
            <a
              className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-blue-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              href={recordHref}
            >
              {tx.openRecord}
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
