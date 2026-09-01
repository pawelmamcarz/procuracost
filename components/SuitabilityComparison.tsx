"use client";

import {
  CircleCheck,
  CircleEqual,
  CircleHelp,
  CircleMinus,
  ClipboardList,
  LockKeyhole,
  Scale,
} from "lucide-react";
import { useRef, useState } from "react";

import ContextualToolNotice from "@/components/ContextualToolNotice";
import { suitabilityT, type Lang } from "@/lib/i18n";
import { resolveSuitabilityCopyKey } from "@/lib/suitability-copy";
import {
  MODEL_V2_METADATA,
  compareProcedureSuitability,
  type ExecutionChannelId,
  type LegalGovernanceBoundaryId,
  type PurchaseArchetypeId,
  type SuitabilityCandidate,
  type SuitabilityComparisonResult,
  type SuitabilityCriterion,
  type SuitabilityProfileV2,
  type SystemSupportId,
} from "@/lib/model-v2";

const DEFAULT_PROFILE: SuitabilityProfileV2 = {
  ...MODEL_V2_METADATA,
  boundaryId: "private_policy",
  initiatedOn: "2026-08-28",
  purchaseArchetypeId: "incomplete_requirement",
  executionChannelId: "sourcing_event",
  systemSupportId: "manual",
};

const SELECT_CLASS =
  "mt-2 w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

function criterionIcon(state: SuitabilityCriterion["state"]) {
  if (state === "condition_present") return CircleCheck;
  if (state === "condition_to_verify") return CircleHelp;
  return CircleMinus;
}

function keyedText(copy: (typeof suitabilityT)[Lang], key: string): string {
  return resolveSuitabilityCopyKey(copy, key) ?? copy.unavailableText;
}

function CandidateRow({
  candidate,
  lang,
}: {
  candidate: SuitabilityCandidate;
  lang: Lang;
}) {
  const copy = suitabilityT[lang];

  return (
    <article className="relative border-t border-gray-300 py-8 pl-11 last:border-b sm:pl-16">
      <span
        className="absolute left-0 top-8 grid h-8 w-8 place-items-center border border-blue-700 bg-white text-blue-800 sm:left-2"
        aria-hidden="true"
      >
        <CircleEqual className="h-4 w-4" strokeWidth={1.7} />
      </span>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="text-xl font-semibold tracking-tight text-gray-950">
          {keyedText(copy, candidate.labelKey)}
        </h3>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">
          <CircleEqual className="h-3.5 w-3.5" aria-hidden="true" />
          {copy.equalStatus}
        </p>
      </header>

      <section className="mt-7" aria-labelledby={`${candidate.procedureFamilyId}-criteria`}>
        <h4
          id={`${candidate.procedureFamilyId}-criteria`}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
        >
          {copy.criteriaTitle}
        </h4>
        <dl className="mt-3 grid gap-x-8 border-t border-gray-200 sm:grid-cols-2">
          {candidate.criteria.map((criterion) => {
            const Icon = criterionIcon(criterion.state);
            return (
              <div
                key={criterion.id}
                className="border-b border-gray-200 py-4"
              >
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Icon className="h-4 w-4 text-blue-700" aria-hidden="true" />
                  {copy.criterionLabels[criterion.id]}
                </dt>
                <dd className="mt-1 pl-6 text-sm leading-6 text-gray-600">
                  <span className="font-medium text-gray-800">
                    {copy.states[criterion.state]}.{" "}
                  </span>
                  {keyedText(copy, criterion.detailKey)}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <div className="mt-7 grid gap-8 lg:grid-cols-2">
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
            {copy.conditionsTitle}
          </h4>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
            {candidate.conditionKeys.map((key) => (
              <li key={key} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-blue-700" aria-hidden="true" />
                <span>{keyedText(copy, key)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            {copy.legalWaitsTitle}
          </h4>
          {candidate.legalWaits.length > 0 ? (
            <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200 text-sm">
              {candidate.legalWaits.map((wait) => (
                <li key={wait.id} className="py-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium text-gray-900">
                      {keyedText(copy, wait.labelKey)}
                    </span>
                    <span className="shrink-0 font-mono text-gray-700">
                      {copy.waitDays(wait.queueDays.central)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {wait.provenance.provision}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {copy.noLegalWaits}
            </p>
          )}
        </section>
      </div>

      {candidate.limitationKeys.length > 0 && (
        <section className="mt-7 border-l-2 border-gray-300 pl-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
            {copy.limitationsTitle}
          </h4>
          {candidate.limitationKeys.map((key) => (
            <p key={key} className="mt-2 text-sm leading-6 text-gray-600">
              {keyedText(copy, key)}
            </p>
          ))}
        </section>
      )}
    </article>
  );
}

export default function SuitabilityComparison({
  lang = "pl",
  initialResult = null,
}: {
  lang?: Lang;
  initialResult?: SuitabilityComparisonResult | null;
}) {
  const copy = suitabilityT[lang];
  const [profile, setProfile] = useState<SuitabilityProfileV2>(DEFAULT_PROFILE);
  const [result, setResult] =
    useState<SuitabilityComparisonResult | null>(initialResult);
  const resultRef = useRef<HTMLDivElement>(null);
  const isPzp = profile.boundaryId.startsWith("pzp_classic_");

  function update<K extends keyof SuitabilityProfileV2>(
    key: K,
    value: SuitabilityProfileV2[K]
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
    setResult(null);
  }

  function updateBoundary(boundaryId: LegalGovernanceBoundaryId) {
    setProfile((current) => {
      if (boundaryId.startsWith("pzp_classic_")) {
        return {
          ...current,
          boundaryId,
          buyerRegime: "classic",
          procurementObject: "supplies_services",
          communicationMethod: "electronic",
        };
      }
      return {
        schemaVersion: current.schemaVersion,
        modelVersion: current.modelVersion,
        calibrationId: current.calibrationId,
        legalRulesetId: current.legalRulesetId,
        boundaryId,
        initiatedOn: current.initiatedOn,
        purchaseArchetypeId: current.purchaseArchetypeId,
        executionChannelId: current.executionChannelId,
        systemSupportId: current.systemSupportId,
      };
    });
    setResult(null);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(compareProcedureSuitability(profile));
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <ContextualToolNotice lang={lang} stage="case" />
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          {copy.badge}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-gray-600">{copy.intro}</p>
        <p className="mt-4 border-l-2 border-blue-700 pl-4 text-sm leading-6 text-gray-700">
          {copy.neutralityNote}
        </p>
      </header>

      <div className="relative mt-10 grid grid-cols-3" aria-hidden="true">
        <span className="absolute left-[16.67%] right-[16.67%] top-5 h-px bg-blue-300" />
        {[ClipboardList, Scale, CircleEqual].map((Icon, index) => (
          <div key={copy.visualSteps[index]} className="relative text-center">
            <span className="mx-auto grid h-10 w-10 place-items-center border border-blue-700 bg-white text-blue-800">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.13em] text-gray-500">
              {copy.visualSteps[index]}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-12 border-y border-gray-300">
        <fieldset>
          <legend className="py-5 text-lg font-semibold text-gray-950">
            {copy.formTitle}
          </legend>
          <div className="grid border-t border-gray-200 lg:grid-cols-2 lg:divide-x lg:divide-gray-200">
            <label className="block border-b border-gray-200 px-0 py-5 lg:pr-8">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                {copy.fields.boundary}
              </span>
              <select
                value={profile.boundaryId}
                onChange={(event) =>
                  updateBoundary(event.target.value as LegalGovernanceBoundaryId)
                }
                className={SELECT_CLASS}
              >
                {Object.entries(copy.options.boundary).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="block border-b border-gray-200 py-5 lg:pl-8">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                {copy.fields.archetype}
              </span>
              <select
                value={profile.purchaseArchetypeId}
                onChange={(event) =>
                  update(
                    "purchaseArchetypeId",
                    event.target.value as PurchaseArchetypeId
                  )
                }
                className={SELECT_CLASS}
              >
                {Object.entries(copy.options.archetype).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="block border-b border-gray-200 py-5 lg:pr-8">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                {copy.fields.channel}
              </span>
              <select
                value={profile.executionChannelId}
                onChange={(event) =>
                  update(
                    "executionChannelId",
                    event.target.value as ExecutionChannelId
                  )
                }
                className={SELECT_CLASS}
              >
                {Object.entries(copy.options.channel).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="block border-b border-gray-200 py-5 lg:pl-8">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                {copy.fields.support}
              </span>
              <select
                value={profile.systemSupportId}
                onChange={(event) =>
                  update("systemSupportId", event.target.value as SystemSupportId)
                }
                className={SELECT_CLASS}
              >
                {Object.entries(copy.options.support).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="block border-b border-gray-200 py-5 lg:pr-8">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                {copy.fields.initiatedOn}
              </span>
              <input
                type="date"
                min="2026-01-01"
                max="2027-12-31"
                required
                value={profile.initiatedOn}
                onChange={(event) => update("initiatedOn", event.target.value)}
                className={SELECT_CLASS}
              />
            </label>

            {isPzp && (
              <div className="grid border-b border-gray-200 py-5 lg:pl-8">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    {copy.fields.buyerRegime}
                  </span>
                  <select
                    value={profile.buyerRegime}
                    onChange={(event) =>
                      update(
                        "buyerRegime",
                        event.target.value as SuitabilityProfileV2["buyerRegime"]
                      )
                    }
                    className={SELECT_CLASS}
                  >
                    {Object.entries(copy.options.buyerRegime).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="mt-5 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    {copy.fields.procurementObject}
                  </span>
                  <select
                    value={profile.procurementObject}
                    onChange={(event) =>
                      update(
                        "procurementObject",
                        event.target.value as SuitabilityProfileV2["procurementObject"]
                      )
                    }
                    className={SELECT_CLASS}
                  >
                    {Object.entries(copy.options.procurementObject).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="mt-5 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    {copy.fields.communicationMethod}
                  </span>
                  <select
                    value={profile.communicationMethod}
                    onChange={(event) =>
                      update(
                        "communicationMethod",
                        event.target.value as SuitabilityProfileV2["communicationMethod"]
                      )
                    }
                    className={SELECT_CLASS}
                  >
                    {Object.entries(copy.options.communicationMethod).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>
        </fieldset>

        <div className="flex justify-end py-6">
          <button
            type="submit"
            className="border border-blue-800 bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          >
            {copy.submit}
          </button>
        </div>
      </form>

      {result && (
        <>
        <p className="sr-only" role="status" aria-live="polite">
          {result.status === "ready"
            ? copy.liveReady(result.candidates.length)
            : copy.liveOutOfScope}
        </p>
        <div
          ref={resultRef}
          tabIndex={-1}
          role="region"
          aria-labelledby="suitability-result-title"
          className="mt-14 scroll-mt-8 outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-4"
        >
          {result.status === "out_of_scope" ? (
            <section className="border-y border-gray-400 py-8">
              <h2 id="suitability-result-title" className="text-2xl font-semibold text-gray-950">
                {copy.outOfScopeTitle}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
                {copy.outOfScopeIntro}
              </p>
              <p className="mt-5 border-l-2 border-gray-500 pl-4 text-sm leading-6 text-gray-800">
                {keyedText(copy, result.reasonKey)}
              </p>
            </section>
          ) : (
            <>
              <header className="flex flex-col gap-4 border-b border-gray-300 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="suitability-result-title" className="text-2xl font-semibold tracking-tight text-gray-950">
                    {copy.resultsTitle}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
                    {copy.resultsIntro}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-sm text-gray-700">
                  {copy.candidateCount(result.candidates.length)}
                </p>
              </header>

              <div>
                {result.candidates.map((candidate) => (
                  <CandidateRow
                    key={candidate.procedureFamilyId}
                    candidate={candidate}
                    lang={lang}
                  />
                ))}
              </div>

              {result.withheldProcedureKeys.length > 0 && (
                <section className="mt-10 border-y border-gray-300 py-7">
                  <h2 className="text-lg font-semibold text-gray-950">
                    {copy.withheldTitle}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                    {copy.withheldIntro}
                  </p>
                  <ul className="mt-4 columns-1 gap-8 text-sm text-gray-800 sm:columns-2">
                    {result.withheldProcedureKeys.map((key) => (
                      <li key={key} className="mb-2 break-inside-avoid border-l-2 border-gray-300 pl-3">
                        {keyedText(copy, key)}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

          <section className="mt-10 border-l-2 border-blue-700 pl-5">
            <h2 className="text-sm font-semibold text-gray-950">{copy.methodTitle}</h2>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-gray-600">
              {result.methodLimitationKeys.map((key) => (
                <li key={key}>{keyedText(copy, key)}</li>
              ))}
            </ul>
          </section>
        </div>
        </>
      )}
    </div>
  );
}
