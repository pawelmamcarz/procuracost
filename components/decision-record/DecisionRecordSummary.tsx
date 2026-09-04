import { decisionRecordT, researchExportV2T, type Lang } from "@/lib/i18n";
import type { DecisionRecordV2 } from "@/lib/model-v2";

export interface DecisionRecordSummaryProps {
  lang: Lang;
  record: DecisionRecordV2;
}

function formatCurrency(value: number, lang: Lang): string {
  if (lang === "pl") {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return `${new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} PLN`;
}

export default function DecisionRecordSummary({
  lang,
  record,
}: DecisionRecordSummaryProps) {
  const tx = decisionRecordT[lang].delta;
  const rangeTx = researchExportV2T[lang].range;
  const { deltaCost, deltaCostOuterEnvelope } = record.comparison;
  const centralInterpretation =
    deltaCost > 0 ? tx.positive : deltaCost < 0 ? tx.negative : tx.zero;
  const crossesZero =
    deltaCostOuterEnvelope.low < 0 && deltaCostOuterEnvelope.high > 0;
  const touchesZero =
    (deltaCostOuterEnvelope.low === 0) !== (deltaCostOuterEnvelope.high === 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-700">{tx.identity}</p>
        <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-blue-700">
          {formatCurrency(deltaCost, lang)}
        </p>
        <p className="mt-1 text-xs text-gray-500">{tx.centralLabel}</p>
      </div>

      <dl className="grid gap-3 border-y border-gray-200 py-4 font-mono text-xs tabular-nums text-gray-700 sm:grid-cols-3">
        <div>
          <dt className="font-sans text-[11px] text-gray-500">{rangeTx.low}</dt>
          <dd>{formatCurrency(deltaCostOuterEnvelope.low, lang)}</dd>
        </div>
        <div className="sm:text-center">
          <dt className="font-sans text-[11px] text-gray-500">
            {rangeTx.central}
          </dt>
          <dd>{formatCurrency(deltaCost, lang)}</dd>
        </div>
        <div className="sm:text-right">
          <dt className="font-sans text-[11px] text-gray-500">{rangeTx.high}</dt>
          <dd>{formatCurrency(deltaCostOuterEnvelope.high, lang)}</dd>
        </div>
      </dl>
      <p className="text-xs font-medium text-gray-500">
        {tx.outerRangeLabel}
      </p>

      <div className="space-y-2 text-sm leading-relaxed text-gray-700">
        <p>{centralInterpretation}</p>
        <p>{crossesZero ? tx.crossing : touchesZero ? tx.touching : tx.stable}</p>
      </div>
    </div>
  );
}
