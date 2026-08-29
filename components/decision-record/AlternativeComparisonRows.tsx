import {
  decisionRecordT,
  researchExportV2T,
  type Lang,
} from "@/lib/i18n";
import type {
  AlternativeId,
  DecisionRecordV2,
  WorkflowDesign,
} from "@/lib/model-v2";
import { cn } from "@/lib/utils";

import { ProcessRail } from "@/components/process-map/ProcessRail";
import { buildProcessRailViewModel } from "@/components/process-map/rail-view-model";

export interface AlternativeComparisonRowsProps {
  lang: Lang;
  record: DecisionRecordV2;
}

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

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

function labelledRange(
  range: { low: number; central: number; high: number },
  lang: Lang,
  formatter: (value: number, lang: Lang) => string,
  unit?: string
): string {
  const labels = decisionRecordT[lang].reference;
  const suffix = unit ? ` ${unit}` : "";
  return `${labels.low}: ${formatter(range.low, lang)}${suffix}; ${labels.central}: ${formatter(range.central, lang)}${suffix}; ${labels.high}: ${formatter(range.high, lang)}${suffix}`;
}

function workflowForRail(
  record: DecisionRecordV2,
  alternativeId: AlternativeId
): WorkflowDesign {
  return {
    steps: record.alternatives[alternativeId].workflow.steps.map((step) => ({
      ...step,
      userLabel: step.userLabel ?? undefined,
      lockedLegalProvenance: step.lockedLegalProvenance ?? undefined,
    })),
  };
}

export default function AlternativeComparisonRows({
  lang,
  record,
}: AlternativeComparisonRowsProps) {
  const tx = decisionRecordT[lang].alternatives;
  const exportTx = researchExportV2T[lang];
  const railViewModel = buildProcessRailViewModel({
    lang,
    workflows: {
      formalSequential: workflowForRail(record, "formalSequential"),
      adaptiveCompliant: workflowForRail(record, "adaptiveCompliant"),
    },
    selectedAlternative: "formalSequential",
    selectedStepId: null,
    criticalPathStepIds: {
      formalSequential: record.alternatives.formalSequential.workflow.steps
        .filter(({ criticalPathCases }) =>
          criticalPathCases.includes("central")
        )
        .map(({ id }) => id),
      adaptiveCompliant: record.alternatives.adaptiveCompliant.workflow.steps
        .filter(({ criticalPathCases }) =>
          criticalPathCases.includes("central")
        )
        .map(({ id }) => id),
    },
    invalidStepIds: {
      formalSequential: [],
      adaptiveCompliant: [],
    },
  });

  return (
    <div>
      <div className="divide-y divide-gray-200 border-y border-gray-200">
        {ALTERNATIVE_IDS.map((alternativeId) => {
          const alternative = record.alternatives[alternativeId];
          const result = alternative.result;
          const lockCount = alternative.workflow.steps.filter(
            ({ lockedLegalProvenance }) => lockedLegalProvenance !== null
          ).length;
          return (
            <div
              className={cn(
                "space-y-5 border-l-[3px] py-6 pl-4",
                alternativeId === "formalSequential"
                  ? "border-red-500"
                  : "border-green-500"
              )}
              data-alternative-row={alternativeId}
              key={alternativeId}
            >
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {exportTx.alternatives[alternativeId]}
                </h4>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">
                      {exportTx.fields.workflowDesign}
                    </dt>
                    <dd className="mt-1 break-all font-mono text-xs text-gray-700">
                      {alternative.designIds.workflowDesignId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">
                      {exportTx.fields.contractDesign}
                    </dt>
                    <dd className="mt-1 break-all font-mono text-xs text-gray-700">
                      {alternative.designIds.contractDesignId}
                    </dd>
                  </div>
                </dl>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div data-total-range="true">
                  <dt className="text-xs font-medium text-gray-500">{tx.total}</dt>
                  <dd className="mt-1 font-mono text-xs tabular-nums text-gray-800">
                    {labelledRange(result.totalCost, lang, formatCurrency)}
                  </dd>
                </div>
                <div data-duration-range="true">
                  <dt className="text-xs font-medium text-gray-500">
                    {tx.duration}
                  </dt>
                  <dd className="mt-1 font-mono text-xs tabular-nums text-gray-800">
                    {labelledRange(
                      result.elapsedDays,
                      lang,
                      formatNumber,
                      tx.days
                    )}
                  </dd>
                </div>
                <div data-step-count={alternative.workflow.steps.length}>
                  <dt className="text-xs font-medium text-gray-500">
                    {tx.stepCount}
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-gray-800">
                    {alternative.workflow.steps.length}
                  </dd>
                </div>
                <div data-lock-count={lockCount}>
                  <dt className="text-xs font-medium text-gray-500">
                    {tx.lockCount}
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-gray-800">
                    {lockCount}
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <details className="mt-6">
        <summary className="min-h-11 cursor-pointer py-3 text-xs font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
          {tx.steps}
        </summary>
        <div className="mt-3">
          <ProcessRail
            idPrefix="decision-record"
            mode="read-only"
            viewModel={railViewModel}
          />
        </div>
      </details>
    </div>
  );
}
