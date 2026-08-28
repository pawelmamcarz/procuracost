import type { ReactNode } from "react";

import EvidenceDocket from "@/components/evidence/EvidenceDocket";
import {
  decisionRecordT,
  modelV2T,
  researchExportV2T,
  type Lang,
} from "@/lib/i18n";
import type { DecisionRecordV2 } from "@/lib/model-v2";

import AlternativeComparisonRows from "./AlternativeComparisonRows";
import AssumptionsRecord from "./AssumptionsRecord";
import CoverageRecord from "./CoverageRecord";
import DecisionRecordSummary from "./DecisionRecordSummary";
import DriverAnalysis from "./DriverAnalysis";
import ReferenceScenarioComparison from "./ReferenceScenarioComparison";
import { buildReferenceScenarioComparisonData } from "./reference-scenarios";

export interface DecisionRecordProps {
  lang: Lang;
  record: DecisionRecordV2;
  actions?: ReactNode;
}

const REFERENCE_SCENARIOS = buildReferenceScenarioComparisonData();

function RecordSection({
  children,
  id,
  title,
}: {
  children: ReactNode;
  id:
    | "summary"
    | "alternatives"
    | "drivers"
    | "coverage"
    | "assumptions"
    | "evidence"
    | "reference"
    | "actions";
  title: string;
}) {
  return (
    <section
      aria-labelledby={`decision-record-section-${id}`}
      className="border-t border-gray-200 py-8 sm:py-10"
      data-decision-record-section={id}
    >
      <h3
        className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl"
        id={`decision-record-section-${id}`}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function DecisionRecord({
  lang,
  record,
  actions,
}: DecisionRecordProps) {
  const tx = decisionRecordT[lang];
  const exportTx = researchExportV2T[lang];
  const scenario = modelV2T[lang].scenarios[record.metadata.scenarioId];
  const metadata = [
    [exportTx.fields.schemaVersion, String(record.metadata.schemaVersion)],
    [exportTx.fields.modelVersion, record.metadata.modelVersion],
    [exportTx.fields.calibrationId, record.metadata.calibrationId],
    [exportTx.fields.legalRulesetId, record.metadata.legalRulesetId],
    [exportTx.fields.scenarioId, record.metadata.scenarioId],
    [exportTx.fields.currency, record.metadata.currency],
    [
      exportTx.fields.status,
      exportTx.migration[record.metadata.migration.status],
    ],
  ] as const;

  return (
    <div data-decision-record="true">
      <header className="border-b border-gray-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tx.eyebrow}
        </p>
        <h2
          className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          id="decision-record-heading"
          tabIndex={-1}
        >
          {scenario.name}
        </h2>
        <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-3 font-mono text-xs text-gray-600">
          {metadata.map(([label, value]) => (
            <div className="flex gap-1" key={label}>
              <dt className="text-gray-500">{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <RecordSection id="summary" title={tx.sections.summary}>
        <DecisionRecordSummary lang={lang} record={record} />
      </RecordSection>
      <RecordSection id="alternatives" title={tx.sections.alternatives}>
        <AlternativeComparisonRows lang={lang} record={record} />
      </RecordSection>
      <RecordSection id="drivers" title={tx.sections.drivers}>
        <DriverAnalysis lang={lang} record={record} />
      </RecordSection>
      <RecordSection id="coverage" title={tx.sections.coverage}>
        <CoverageRecord lang={lang} record={record} />
      </RecordSection>
      <RecordSection id="assumptions" title={tx.sections.assumptions}>
        <AssumptionsRecord lang={lang} record={record} />
      </RecordSection>
      <RecordSection id="evidence" title={tx.sections.evidence}>
        <EvidenceDocket
          lang={lang}
          records={record.externalEvidence}
          variant="decision-record"
        />
      </RecordSection>
      <RecordSection id="reference" title={tx.sections.reference}>
        <ReferenceScenarioComparison
          activeScenarioId={record.metadata.scenarioId}
          data={REFERENCE_SCENARIOS}
          lang={lang}
        />
      </RecordSection>
      <RecordSection id="actions" title={tx.sections.actions}>
        <div className="space-y-5">
          {actions}
          <p className="max-w-3xl text-xs leading-relaxed text-gray-600">
            {tx.actions.methodology}
          </p>
        </div>
      </RecordSection>
    </div>
  );
}
