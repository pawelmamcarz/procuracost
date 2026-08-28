import {
  decisionRecordT,
  researchExportV2T,
  type Lang,
} from "@/lib/i18n";
import type { CalibratedValue, DecisionRecordV2 } from "@/lib/model-v2";

export interface AssumptionsRecordProps {
  lang: Lang;
  record: DecisionRecordV2;
}

function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number, lang: Lang): string {
  if (lang === "pl") {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return `${formatNumber(value, lang)} PLN`;
}

function rangeText(value: CalibratedValue, lang: Lang, currency = true) {
  const format = currency ? formatCurrency : formatNumber;
  const labels = decisionRecordT[lang].reference;
  return `${labels.low}: ${format(value.low, lang)}; ${labels.central}: ${format(value.central, lang)}; ${labels.high}: ${format(value.high, lang)}`;
}

function evidenceClass(value: CalibratedValue, lang: Lang): string {
  return (researchExportV2T[lang].evidenceClasses as Record<string, string>)[
    value.evidenceClass
  ];
}

function localDate(value: string, lang: Lang): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function countUserSuppliedAssumptions(record: DecisionRecordV2): number {
  let count = 0;
  const include = (value: CalibratedValue | null) => {
    if (value?.evidenceClass === "user_input") count += 1;
  };

  include(record.assumptions.contractValue);
  include(record.assumptions.dailyCostOfInaction);
  include(record.assumptions.competitionTransferRate);
  include(record.assumptions.amendmentDifferential);
  include(record.assumptions.tcoDifferential);

  for (const rate of Object.values(record.roleHourlyRates)) include(rate);
  for (const alternative of Object.values(record.alternatives)) {
    for (const step of alternative.workflow.steps) {
      include(step.activeDays);
      include(step.queueDays);
      include(step.nonLabourCost);
      for (const hours of Object.values(step.roleHours)) include(hours);
    }
  }

  return count;
}

export default function AssumptionsRecord({
  lang,
  record,
}: AssumptionsRecordProps) {
  const tx = decisionRecordT[lang].assumptions;
  const exportTx = researchExportV2T[lang];
  const assumptions = record.assumptions;
  const userSupplied = countUserSuppliedAssumptions(record);
  const economicRows: Array<{
    id: string;
    label: string;
    value: string;
    evidence: string;
  }> = [
    {
      id: "contractValue",
      label: exportTx.assumptions.contractValue,
      value: rangeText(assumptions.contractValue, lang),
      evidence: evidenceClass(assumptions.contractValue, lang),
    },
    {
      id: "dailyCostOfInaction",
      label: exportTx.assumptions.dailyCostOfInaction,
      value: rangeText(assumptions.dailyCostOfInaction, lang),
      evidence: evidenceClass(assumptions.dailyCostOfInaction, lang),
    },
    {
      id: "pathCompetitionDiffers",
      label: tx.pathCompetitionDiffers,
      value: assumptions.pathCompetitionDiffers ? tx.yes : tx.no,
      evidence: exportTx.words.notApplicable,
    },
    {
      id: "competitionTransferRate",
      label: exportTx.assumptions.competitionTransferRate,
      value: assumptions.competitionTransferRate
        ? rangeText(assumptions.competitionTransferRate, lang, false)
        : tx.competitionTransferNotApplicable,
      evidence: assumptions.competitionTransferRate
        ? evidenceClass(assumptions.competitionTransferRate, lang)
        : exportTx.words.notApplicable,
    },
    {
      id: "amendmentDifferential",
      label: exportTx.assumptions.amendmentDifferential,
      value: rangeText(assumptions.amendmentDifferential, lang),
      evidence: evidenceClass(assumptions.amendmentDifferential, lang),
    },
    {
      id: "tcoDifferential",
      label: exportTx.assumptions.tcoDifferential,
      value: rangeText(assumptions.tcoDifferential, lang),
      evidence: evidenceClass(assumptions.tcoDifferential, lang),
    },
  ];

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed text-gray-700">
        {tx.summary(record.retainedAssumptions.length, userSupplied)}
      </p>

      <div>
        <h4 className="text-sm font-semibold text-gray-900">{tx.context}</h4>
        <dl className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
          {record.axes.map((axis) => (
            <div className="grid gap-2 py-3 sm:grid-cols-[12rem_1fr]" key={axis.id}>
              <dt className="text-xs font-medium text-gray-500">
                {exportTx.axes[axis.id]}
              </dt>
              <dd className="font-mono text-xs text-gray-700">
                {axis.id === "initiatedOn"
                  ? localDate(axis.value, lang)
                  : (exportTx.axisValues as Record<string, string>)[axis.value]}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900">{tx.economics}</h4>
        <dl className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
          {economicRows.map((row) => (
            <div className="grid gap-2 py-3 sm:grid-cols-[12rem_1fr]" key={row.id}>
              <dt className="text-xs font-medium text-gray-500">{row.label}</dt>
              <dd>
                <p className="font-mono text-xs tabular-nums text-gray-700">
                  {row.value}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  {tx.evidenceClass}: {row.evidence}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900">{tx.designs}</h4>
        <dl className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
          {(["formalSequential", "adaptiveCompliant"] as const).map(
            (alternativeId) => (
              <div className="grid gap-2 py-3 sm:grid-cols-[12rem_1fr]" key={alternativeId}>
                <dt className="text-xs font-medium text-gray-500">
                  {exportTx.alternatives[alternativeId]}
                </dt>
                <dd className="break-all font-mono text-xs text-gray-700">
                  {record.alternatives[alternativeId].designIds.workflowDesignId}
                  <span aria-hidden="true"> · </span>
                  {record.alternatives[alternativeId].designIds.contractDesignId}
                </dd>
              </div>
            )
          )}
        </dl>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900">{tx.roleRates}</h4>
        <dl className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
          {Object.entries(record.roleHourlyRates).map(([roleId, rate]) => (
            <div className="grid gap-2 py-3 sm:grid-cols-[12rem_1fr]" key={roleId}>
              <dt className="text-xs font-medium text-gray-500">
                {(exportTx.roles as Record<string, string>)[roleId] ??
                  exportTx.roles.unknown}
              </dt>
              <dd>
                <p className="font-mono text-xs tabular-nums text-gray-700">
                  {rangeText(rate, lang)}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  {tx.evidenceClass}: {evidenceClass(rate, lang)}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
