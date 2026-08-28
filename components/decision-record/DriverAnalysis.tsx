import {
  decisionRecordT,
  researchExportV2T,
  type Lang,
} from "@/lib/i18n";
import type { DecisionRecordV2 } from "@/lib/model-v2";

export interface DriverAnalysisProps {
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

function rangeText(
  range: { low: number; central: number; high: number },
  lang: Lang
): string {
  const labels = decisionRecordT[lang].reference;
  return `${labels.low}: ${formatCurrency(range.low, lang)}; ${labels.central}: ${formatCurrency(range.central, lang)}; ${labels.high}: ${formatCurrency(range.high, lang)}`;
}

export default function DriverAnalysis({ lang, record }: DriverAnalysisProps) {
  const tx = decisionRecordT[lang].drivers;
  const labels = researchExportV2T[lang].drivers as Record<string, string>;

  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {record.drivers.map((driver) => {
        const direction =
          driver.contribution.central > 0
            ? tx.directionFormal
            : driver.contribution.central < 0
              ? tx.directionAdaptive
              : tx.directionEqual;
        return (
          <div
            className="space-y-4 py-5"
            data-driver-id={driver.id}
            key={driver.id}
          >
            <h4 className="text-sm font-semibold text-gray-900">
              {labels[driver.id]}
            </h4>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium text-gray-500">{tx.formal}</dt>
                <dd className="mt-1 font-mono text-xs tabular-nums text-gray-700">
                  {rangeText(driver.formalSequential, lang)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  {tx.adaptive}
                </dt>
                <dd className="mt-1 font-mono text-xs tabular-nums text-gray-700">
                  {rangeText(driver.adaptiveCompliant, lang)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">
                  {tx.contribution}
                </dt>
                <dd className="mt-1 font-mono text-xs tabular-nums text-blue-700">
                  {rangeText(driver.contribution, lang)}
                </dd>
              </div>
            </dl>
            <p className="text-xs leading-relaxed text-gray-600">{direction}</p>
          </div>
        );
      })}
    </div>
  );
}
