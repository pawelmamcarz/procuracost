import {
  decisionRecordT,
  researchExportV2T,
  type Lang,
} from "@/lib/i18n";
import type { DecisionRecordV2 } from "@/lib/model-v2";
import {
  centralDelayShare,
  pairedComponentDifferences,
} from "@/lib/decision-record-view";

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
  const rangeLabels = decisionRecordT[lang].reference;
  const members = ["low", "central", "high"] as const;
  const delayShare = centralDelayShare(record);
  const pairedComponents = pairedComponentDifferences(record);

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
      <div className="space-y-3 py-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-gray-700">
            <caption className="pb-3 text-left text-sm font-semibold text-gray-900">
              {tx.pairedCaption}
            </caption>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-3 text-left font-medium" scope="col">
                  {tx.component}
                </th>
                {members.map((member) => (
                  <th className="px-2 py-2 text-right font-medium" key={member} scope="col">
                    {rangeLabels[member]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pairedComponents.map(({ id, difference }) => (
                <tr className="border-b border-gray-200" key={id}>
                  <th className="py-3 pr-3 text-left font-medium" scope="row">
                    {id === "contract_cost" ? tx.contractCost : labels[id]}
                  </th>
                  {members.map((member) => (
                    <td className="whitespace-nowrap px-2 py-3 text-right font-mono tabular-nums" key={member}>
                      {formatCurrency(difference[member], lang)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-b border-gray-200">
                <th className="py-3 pr-3 text-left font-semibold" scope="row">
                  {tx.pairedTotal}
                </th>
                {members.map((member) => (
                  <td className="whitespace-nowrap px-2 py-3 text-right font-mono tabular-nums" key={member}>
                    {formatCurrency(record.comparison.deltaCostPairedCases[member], lang)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="border-l-2 border-gray-300 pl-3 text-xs leading-relaxed text-gray-600">
          {tx.pairedCaveat}
          {delayShare !== null ? ` ${tx.delayShare(
            new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
              style: "percent",
              maximumFractionDigits: 1,
            }).format(delayShare)
          )}` : null}
        </p>
      </div>
    </div>
  );
}
