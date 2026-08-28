import {
  decisionRecordT,
  modelV2T,
  researchExportV2T,
  type Lang,
} from "@/lib/i18n";
import type { DecisionRecordV2 } from "@/lib/model-v2";

export interface CoverageRecordProps {
  lang: Lang;
  record: DecisionRecordV2;
}

function modelCopy(lang: Lang, key: string): string {
  let value: unknown = modelV2T[lang];
  for (const segment of key.split(".")) {
    value = (value as Record<string, unknown>)[segment];
  }
  if (typeof value !== "string") throw new Error(`Missing model copy ${key}`);
  return value;
}

function formatCurrency(value: number, lang: Lang): string {
  if (lang === "pl") {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return `${new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 2,
  }).format(value)} PLN`;
}

export default function CoverageRecord({
  lang,
  record,
}: CoverageRecordProps) {
  const tx = decisionRecordT[lang].coverage;
  const exportTx = researchExportV2T[lang];
  const labels = exportTx.drivers as Record<string, string>;
  const rangeLabels = decisionRecordT[lang].reference;

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{tx.included}</h4>
        <dl className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
          {record.coverage.map((entry) => {
            const evidenceClasses = [
              ...new Set(entry.anchors.map(({ evidenceClass }) => evidenceClass)),
            ];
            const evidenceIds = [
              ...new Set(entry.anchors.flatMap(({ evidenceIds }) => evidenceIds)),
            ];
            return (
              <div className="grid gap-3 py-4 sm:grid-cols-[minmax(0,12rem)_1fr]" key={entry.id}>
                <dt className="text-sm font-medium text-gray-800">
                  {labels[entry.id]}
                </dt>
                <dd className="space-y-2">
                  <p className="font-mono text-xs tabular-nums text-gray-700">
                    {tx.contributionRange}: {rangeLabels.low}: {formatCurrency(entry.contribution.low, lang)};{" "}
                    {rangeLabels.central}: {formatCurrency(entry.contribution.central, lang)};{" "}
                    {rangeLabels.high}: {formatCurrency(entry.contribution.high, lang)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {tx.evidenceClasses}: {evidenceClasses.map(
                      (value) =>
                        (exportTx.evidenceClasses as Record<string, string>)[value]
                    ).join(", ")}
                  </p>
                  <p className="break-all font-mono text-[11px] text-gray-500">
                    {tx.evidenceIdentifiers}: {evidenceIds.length
                      ? evidenceIds.join(", ")
                      : tx.noEvidenceIdentifiers}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900">
          {tx.nonMonetized}
        </h4>
        <dl className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
          {record.nonMonetizedDimensions.map((dimension) => {
            const reasons = [
              ...new Set(
                Object.values(dimension.alternatives).flatMap((entry) =>
                  entry ? [modelCopy(lang, entry.reasonKey)] : []
                )
              ),
            ];
            const evidenceIds = [
              ...new Set(
                Object.values(dimension.alternatives).flatMap((entry) =>
                  entry ? entry.evidenceIds : []
                )
              ),
            ];
            return (
              <div className="grid gap-3 py-4 sm:grid-cols-[minmax(0,12rem)_1fr]" key={dimension.id}>
                <dt className="text-sm font-medium text-gray-800">
                  {labels[dimension.id]}
                </dt>
                <dd className="space-y-2 text-sm leading-relaxed text-gray-700">
                  {reasons.map((reason) => <p key={reason}>{reason}</p>)}
                  <p className="break-all font-mono text-[11px] text-gray-500">
                    {tx.evidenceIdentifiers}: {evidenceIds.length
                      ? evidenceIds.join(", ")
                      : tx.noEvidenceIdentifiers}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
