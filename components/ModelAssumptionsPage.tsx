import Link from "next/link";

import {
  MODEL_ASSUMPTIONS_DATA,
  type ModelAssumptionCalibratedValue,
  type ModelAssumptionUnit,
} from "@/components/model-assumptions/model-assumptions-data";
import {
  modelAssumptionsT,
  type Lang,
  type ModelAssumptionsCopy,
} from "@/lib/i18n";
import type {
  DecisionAxisRecord,
  EvidenceConstruct,
  EvidenceRecord,
} from "@/lib/model-v2";

const EVIDENCE_COPY_KEYS = {
  california_modular_it_procurement: "californiaModular",
  oecd_rvul_problem_definition: "oecdRvul",
  uzp_preliminary_market_consultation: "uzpConsultation",
  ec_innovation_procurement_guidance: "ecInnovation",
  szucs_discretion_price_2024: "szucs",
} as const;

function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatValue(
  value: number,
  unit: ModelAssumptionUnit,
  lang: Lang,
  copy: ModelAssumptionsCopy
): string {
  if (unit === "percentage") {
    return `${formatNumber(value * 100, lang)}${copy.units.percentage}`;
  }
  return `${formatNumber(value, lang)} ${copy.units[unit]}`;
}

function formatIsoDate(value: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function axisValue(
  axis: DecisionAxisRecord,
  lang: Lang,
  copy: ModelAssumptionsCopy
): string {
  if (axis.id === "initiatedOn") return formatIsoDate(axis.value, lang);
  return copy.axisValues[axis.value as keyof typeof copy.axisValues];
}

function evidenceIds(ids: readonly string[], copy: ModelAssumptionsCopy) {
  return ids.length > 0 ? ids.join(", ") : copy.values.none;
}

function translatedConstructs(
  constructs: readonly EvidenceConstruct[],
  copy: ModelAssumptionsCopy
): string {
  return constructs.map((construct) => copy.constructs[construct]).join(", ");
}

function CalibratedValueLedger({
  assumption,
  lang,
  copy,
}: {
  assumption: ModelAssumptionCalibratedValue;
  lang: Lang;
  copy: ModelAssumptionsCopy;
}) {
  const { value } = assumption;
  return (
    <article
      className="border-t border-gray-300 py-5 first:border-t-0"
      data-assumption-id={assumption.id}
    >
      <h4 className="font-semibold text-gray-950">
        {copy.assumptions[assumption.id]}
      </h4>
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
        {(["low", "central", "high"] as const).map((rangeCase) => (
          <div key={rangeCase}>
            <dt className="text-sm font-medium text-gray-600">
              {copy.fields[rangeCase]}
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-gray-950">
              {formatValue(value[rangeCase], assumption.unit, lang, copy)}
            </dd>
          </div>
        ))}
      </dl>
      <dl className="mt-5 grid gap-x-6 gap-y-4 border-l-2 border-blue-200 pl-4 md:grid-cols-3">
        <div>
          <dt className="text-sm font-medium text-gray-600">
            {copy.fields.rangeKind}
          </dt>
          <dd className="mt-1 text-sm text-gray-950">
            {copy.rangeKinds[value.rangeKind]}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-600">
            {copy.fields.evidenceClass}
          </dt>
          <dd className="mt-1 text-sm text-gray-950">
            {copy.evidenceClasses[value.evidenceClass]}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-600">
            {copy.fields.evidenceIds}
          </dt>
          <dd className="mt-1 break-words font-mono text-sm text-gray-950">
            {evidenceIds(value.evidenceIds, copy)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function ScenarioLedger({
  lang,
  copy,
}: {
  lang: Lang;
  copy: ModelAssumptionsCopy;
}) {
  const data = MODEL_ASSUMPTIONS_DATA;
  return (
    <div className="mt-10 border-b border-gray-950">
      {data.scenarios.map((scenario) => {
        const scenarioCopy = copy.scenarios[scenario.id];
        return (
          <details
            key={scenario.id}
            className="group border-t border-gray-950"
            data-scenario-id={scenario.id}
          >
            <summary className="min-h-16 cursor-pointer list-none py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden">
              <h3 className="grid gap-4 font-normal lg:grid-cols-[9rem_minmax(0,1fr)_15rem] lg:items-start">
                <span className="font-mono text-sm font-semibold uppercase tracking-wider text-blue-800">
                  {copy.scenarioPosition(
                    scenario.ordinal,
                    data.scenarios.length
                  )}
                </span>
                <span>
                  <span className="block text-xl font-semibold tracking-tight text-gray-950">
                    {scenarioCopy.name}
                  </span>
                  <span className="mt-2 block max-w-3xl text-sm leading-6 text-gray-700">
                    {scenarioCopy.description}
                  </span>
                </span>
                <span className="flex flex-col items-start gap-3 lg:items-end">
                  <code className="break-all font-mono text-sm text-gray-600">
                    {scenario.id}
                  </code>
                  <span
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-blue-800"
                    data-disclosure-affordance="true"
                  >
                    <span className="group-open:hidden">
                      {copy.showScenarioDetails}
                    </span>
                    <span className="hidden group-open:inline">
                      {copy.hideScenarioDetails}
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-5 w-5 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    >
                      <path
                        d="M5 7.5 10 12.5 15 7.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                      />
                    </svg>
                  </span>
                </span>
              </h3>
            </summary>

            <div className="grid gap-10 border-t border-gray-300 py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:pl-36">
              <section aria-labelledby={`${scenario.id}-context`}>
                <h4
                  id={`${scenario.id}-context`}
                  className="text-sm font-semibold uppercase tracking-wider text-gray-950"
                >
                  {copy.fields.context}
                </h4>
                <dl className="mt-4 border-t border-gray-300">
                  {scenario.axes.map((axis) => (
                    <div
                      key={axis.id}
                      className="border-b border-gray-200 py-4"
                      data-axis-id={axis.id}
                    >
                      <dt className="text-sm font-medium text-gray-600">
                        {copy.axes[axis.id]}
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-950">
                        {axisValue(axis, lang, copy)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby={`${scenario.id}-economics`}>
                <h4
                  id={`${scenario.id}-economics`}
                  className="text-sm font-semibold uppercase tracking-wider text-gray-950"
                >
                  {copy.fields.economicAssumptions}
                </h4>
                <p className="mt-3 border-l-2 border-gray-400 pl-4 text-sm leading-6 text-gray-700">
                  <span className="font-medium text-gray-950">
                    {copy.fields.pathCompetitionDiffers}:
                  </span>{" "}
                  {scenario.pathCompetitionDiffers
                    ? copy.values.applies
                    : copy.values.notApplicable}
                </p>
                <div className="mt-4">
                  {scenario.calibratedValues.map((assumption) => (
                    <CalibratedValueLedger
                      key={assumption.id}
                      assumption={assumption}
                      lang={lang}
                      copy={copy}
                    />
                  ))}
                </div>
                <div className="border-l-4 border-amber-500 bg-amber-50 px-5 py-5">
                  <h4 className="font-semibold text-gray-950">
                    {copy.fields.bypass}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    <span className="font-medium text-gray-950">
                      {copy.fields.reason}:
                    </span>{" "}
                    {copy.bypassReason}
                  </p>
                  <p className="mt-2 break-words font-mono text-sm text-gray-700">
                    {copy.fields.evidenceIds}: {evidenceIds(
                      scenario.bypass.evidenceIds,
                      copy
                    )}
                  </p>
                </div>
              </section>
            </div>
          </details>
        );
      })}
    </div>
  );
}

function RetainedProvenance({ copy }: { copy: ModelAssumptionsCopy }) {
  const data = MODEL_ASSUMPTIONS_DATA;
  return (
    <section
      className="border-l-4 border-blue-700 bg-blue-50/40 px-6 py-8 md:px-8"
      data-provenance-collection="retained"
    >
      <h3 className="text-2xl font-semibold tracking-tight text-gray-950">
        {copy.sections.retainedTitle}
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        {copy.sections.retainedIntro}
      </p>
      <div className="mt-8 border-b border-blue-200">
        {data.provenance.retainedAssumptions.map((assumption) => {
          const scenario = data.scenarios.find(({ retainedAssumptionIds }) =>
            retainedAssumptionIds.includes(assumption.id)
          );
          if (!scenario) return null;
          const scenarioCopy = copy.scenarios[scenario.id];
          return (
            <article key={assumption.id} className="border-t border-blue-200 py-6">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_15rem]">
                <div>
                  <h4 className="font-semibold text-gray-950">
                    {scenarioCopy.assumptionLabel}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {scenarioCopy.assumptionDetail}
                  </p>
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-gray-600">
                      {copy.fields.scenarioId}
                    </dt>
                    <dd className="mt-1 break-all font-mono text-gray-950">
                      {scenario.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">
                      {copy.fields.sourceModelVersion}
                    </dt>
                    <dd className="mt-1 font-mono text-gray-950">
                      {assumption.source.sourceModelVersion}
                    </dd>
                  </div>
                </dl>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                <span className="font-medium text-gray-950">
                  {copy.fields.constructs}:
                </span>{" "}
                {translatedConstructs(assumption.constructs, copy)}
              </p>
              <p className="mt-2 break-words font-mono text-sm text-gray-600">
                {assumption.id}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function evidenceTranslation(
  record: EvidenceRecord,
  copy: ModelAssumptionsCopy
) {
  const key = EVIDENCE_COPY_KEYS[record.id as keyof typeof EVIDENCE_COPY_KEYS];
  if (!key) throw new Error(`Missing assumptions evidence copy for ${record.id}`);
  return copy.evidence[key];
}

function ExternalProvenance({
  lang,
  copy,
}: {
  lang: Lang;
  copy: ModelAssumptionsCopy;
}) {
  return (
    <section
      className="border-l-4 border-amber-500 bg-amber-50/40 px-6 py-8 md:px-8"
      data-provenance-collection="external"
    >
      <h3 className="text-2xl font-semibold tracking-tight text-gray-950">
        {copy.sections.externalTitle}
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        {copy.sections.externalIntro}
      </p>
      <div className="mt-8 border-b border-amber-200">
        {MODEL_ASSUMPTIONS_DATA.provenance.externalEvidence.map((record) => {
          const translated = evidenceTranslation(record, copy);
          return (
            <article key={record.id} className="border-t border-amber-200 py-6">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_15rem]">
                <div>
                  <h4 className="font-semibold text-gray-950">
                    {translated.sourceTitle}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {translated.publisher}
                  </p>
                </div>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-gray-600">
                      {copy.fields.sourceClass}
                    </dt>
                    <dd className="mt-1 text-gray-950">
                      {copy.evidenceTypes[record.type]}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">
                      {copy.fields.publicationKind}
                    </dt>
                    <dd className="mt-1 text-gray-950">
                      {copy.publicationKinds[record.source.publicationKind]}
                    </dd>
                  </div>
                  {record.source.publishedOn ? (
                    <div>
                      <dt className="font-medium text-gray-600">
                        {copy.fields.publishedOn}
                      </dt>
                      <dd className="mt-1 text-gray-950">
                        {formatIsoDate(record.source.publishedOn, lang)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
              <dl className="mt-5 grid gap-5 md:grid-cols-3">
                <div className="border-t border-amber-200 pt-4">
                  <dt className="text-sm font-medium text-gray-600">
                    {copy.fields.supportedClaim}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-gray-950">
                    {translated.supported}
                  </dd>
                </div>
                <div className="border-t border-amber-200 pt-4">
                  <dt className="text-sm font-medium text-gray-600">
                    {copy.fields.unsupportedClaim}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-gray-950">
                    {translated.unsupported}
                  </dd>
                </div>
                <div className="border-t border-amber-200 pt-4">
                  <dt className="text-sm font-medium text-gray-600">
                    {copy.fields.population}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-gray-950">
                    {translated.population}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-col gap-3 border-t border-amber-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <code className="break-all font-mono text-sm text-gray-700">
                  {record.id}
                </code>
                <a
                  href={record.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={copy.sourceLinkLabel(translated.sourceTitle)}
                  className="inline-flex min-h-11 items-center font-semibold text-blue-800 underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
                >
                  {copy.sourceLink}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LegalProvenance({
  lang,
  copy,
}: {
  lang: Lang;
  copy: ModelAssumptionsCopy;
}) {
  return (
    <section
      className="border-l-4 border-gray-950 bg-gray-100 px-6 py-8 md:px-8"
      data-provenance-collection="legal"
    >
      <h3 className="text-2xl font-semibold tracking-tight text-gray-950">
        {copy.sections.legalTitle}
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        {copy.sections.legalIntro}
      </p>
      <div className="mt-8 border-b border-gray-300">
        {MODEL_ASSUMPTIONS_DATA.provenance.lockedLegalProvenance.map(
          (record) => (
            <article key={record.ruleId} className="border-t border-gray-300 py-6">
              <div className="grid gap-6 md:grid-cols-2">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">
                      {copy.fields.provision}
                    </dt>
                    <dd className="mt-1 font-semibold text-gray-950">
                      {record.provision}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">
                      {copy.fields.ruleId}
                    </dt>
                    <dd className="mt-1 break-all font-mono text-sm text-gray-950">
                      {record.ruleId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">
                      {copy.fields.initiatedOn}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-950">
                      {formatIsoDate(record.initiatedOn, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">
                      {copy.metadataLabels.legalRulesetId}
                    </dt>
                    <dd className="mt-1 break-all font-mono text-sm text-gray-950">
                      {record.legalRulesetId}
                    </dd>
                  </div>
                </dl>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">
                      {copy.fields.lockedActiveDays}
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-semibold text-gray-950">
                      {formatNumber(record.lockedActiveDays, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">
                      {copy.fields.lockedQueueDays}
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-semibold text-gray-950">
                      {formatNumber(record.lockedQueueDays, lang)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-600">
                      {copy.fields.occurrences}
                    </dt>
                    <dd className="mt-2 space-y-1 text-sm text-gray-950">
                      {record.occurrences.map((occurrence) => (
                        <span key={`${occurrence.alternativeId}.${occurrence.stepId}`} className="block">
                          {copy.occurrenceLabel(
                            copy.scenarios[occurrence.scenarioId].name,
                            copy.alternatives[occurrence.alternativeId]
                          )}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}

function NeutralControl({
  lang,
  copy,
}: {
  lang: Lang;
  copy: ModelAssumptionsCopy;
}) {
  const { record, mapsIdentical } = MODEL_ASSUMPTIONS_DATA.neutralControl;
  const formal = record.alternatives.formalSequential.result.totalCost.central;
  const adaptive =
    record.alternatives.adaptiveCompliant.result.totalCost.central;
  const envelope = record.comparison.deltaCostOuterEnvelope;

  return (
    <section
      className="border-y-2 border-blue-900 py-10"
      data-neutral-control="true"
      data-neutral-maps-identical={mapsIdentical}
      data-neutral-delta={record.comparison.deltaCost}
    >
      <div className="grid gap-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="font-mono text-sm font-semibold uppercase tracking-wider text-blue-800">
            {record.metadata.scenarioId}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
            {copy.sections.neutralTitle}
          </h2>
          <p className="mt-4 text-sm leading-6 text-gray-700">
            {copy.sections.neutralIntro}
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            {copy.sections.neutralStress}
          </p>
        </div>
        <dl className="grid gap-x-6 gap-y-5 border-l-4 border-blue-700 pl-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-600">
              {copy.fields.mapsIdentical}
            </dt>
            <dd className="mt-1 font-semibold text-gray-950">
              {mapsIdentical ? copy.values.yes : copy.values.no}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">
              {copy.fields.delta}
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-gray-950">
              {formatValue(record.comparison.deltaCost, "pln", lang, copy)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">
              {copy.fields.formalCentralTotal}
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-gray-950">
              {formatValue(formal, "pln", lang, copy)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">
              {copy.fields.adaptiveCentralTotal}
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-gray-950">
              {formatValue(adaptive, "pln", lang, copy)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-600">
              {copy.fields.outerStressRange}
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-gray-950">
              {formatValue(envelope.low, "pln", lang, copy)} {"–"}{" "}
              {formatValue(envelope.high, "pln", lang, copy)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default function ModelAssumptionsPage({ lang }: { lang: Lang }) {
  const copy: ModelAssumptionsCopy = modelAssumptionsT[lang];
  const data = MODEL_ASSUMPTIONS_DATA;
  const methodologyHref = lang === "pl" ? "/methodology" : "/en/methodology";
  const metadataRows = [
    [copy.metadataLabels.schemaVersion, data.metadata.schemaVersion],
    [copy.metadataLabels.modelVersion, data.metadata.modelVersion],
    [copy.metadataLabels.calibrationId, data.metadata.calibrationId],
    [copy.metadataLabels.legalRulesetId, data.metadata.legalRulesetId],
  ] as const;

  return (
    <main
      className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8"
      data-model-assumptions-ledger="true"
    >
      <header className="border-t-4 border-gray-950 pt-8">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-blue-800">
          {copy.eyebrow}
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-700">
              {copy.lead}
            </p>
            <p className="mt-4 max-w-3xl border-l-4 border-amber-500 pl-5 text-sm leading-6 text-gray-700">
              {copy.scopeNote}
            </p>
          </div>
          <dl className="border-y border-gray-950">
            {metadataRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 border-t border-gray-300 py-3 first:border-t-0"
              >
                <dt className="text-sm font-medium text-gray-600">{label}</dt>
                <dd className="break-all text-right font-mono text-sm text-gray-950">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="mt-20" aria-labelledby="scenario-register-title">
        <div className="grid gap-5 md:grid-cols-[9rem_1fr]">
          <p className="font-mono text-sm font-semibold uppercase tracking-wider text-blue-800">
            {copy.productName}
          </p>
          <div>
            <h2
              id="scenario-register-title"
              className="text-3xl font-semibold tracking-tight text-gray-950"
            >
              {copy.sections.scenariosTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
              {copy.sections.scenariosIntro}
            </p>
          </div>
        </div>
        <ScenarioLedger lang={lang} copy={copy} />
      </section>

      <section className="mt-24" aria-labelledby="provenance-register-title">
        <div className="border-b border-gray-950 pb-8">
          <h2
            id="provenance-register-title"
            className="text-3xl font-semibold tracking-tight text-gray-950"
          >
            {copy.sections.provenanceTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
            {copy.sections.provenanceIntro}
          </p>
        </div>
        <div className="mt-8 space-y-8">
          <RetainedProvenance copy={copy} />
          <ExternalProvenance lang={lang} copy={copy} />
          <LegalProvenance lang={lang} copy={copy} />
        </div>
      </section>

      <div className="mt-24">
        <NeutralControl lang={lang} copy={copy} />
      </div>

      <section className="mt-16 border-t border-gray-950 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">
          {copy.sections.methodTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          {copy.sections.methodIntro}
        </p>
        <Link
          href={methodologyHref}
          className="mt-5 inline-flex min-h-11 items-center font-semibold text-blue-800 underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          {copy.methodologyLink}
        </Link>
      </section>
    </main>
  );
}
