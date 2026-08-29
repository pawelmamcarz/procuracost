"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  CircleDashed,
  CircleMinus,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { readinessT, type Lang } from "@/lib/i18n";
import {
  READINESS_DOMAINS,
  READINESS_RESPONSE_OPTIONS,
  summariseReadinessResponses,
  type ReadinessQuestionId,
  type ReadinessResponseOption,
  type ReadinessResponses,
} from "@/lib/readiness";

type ResponsePresentation = {
  Icon: LucideIcon;
  border: string;
  background: string;
  text: string;
  selected: string;
};

const RESPONSE_PRESENTATION: Record<ReadinessResponseOption, ResponsePresentation> = {
  not_met: {
    Icon: CircleMinus,
    border: "border-gray-300",
    background: "bg-gray-100",
    text: "text-gray-800",
    selected: "ring-gray-700",
  },
  to_complete: {
    Icon: CircleDashed,
    border: "border-amber-300",
    background: "bg-amber-50",
    text: "text-amber-800",
    selected: "ring-amber-500",
  },
  confirmed: {
    Icon: CircleCheck,
    border: "border-blue-300",
    background: "bg-blue-50",
    text: "text-blue-800",
    selected: "ring-blue-500",
  },
};

export default function ReadinessDiagnostic({ lang }: { lang: Lang }) {
  const tx = readinessT[lang];
  const [responses, setResponses] = useState<ReadinessResponses>({});
  const [domainIndex, setDomainIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingFromSummary, setEditingFromSummary] = useState(false);
  const summaryHeadingRef = useRef<HTMLHeadingElement>(null);
  const currentDomain = READINESS_DOMAINS[domainIndex];
  const currentComplete = currentDomain.questions.every(
    ({ id }) => responses[id] !== undefined,
  );
  const totalQuestions = READINESS_DOMAINS.reduce(
    (count, domain) => count + domain.questions.length,
    0,
  );
  const summary = summariseReadinessResponses(responses);

  useEffect(() => {
    if (showSummary) summaryHeadingRef.current?.focus();
  }, [showSummary]);

  function answer(questionId: ReadinessQuestionId, response: ReadinessResponseOption) {
    setResponses((current) => ({ ...current, [questionId]: response }));
  }

  function continueForward() {
    if (!currentComplete) return;
    if (editingFromSummary || domainIndex === READINESS_DOMAINS.length - 1) {
      setEditingFromSummary(false);
      setShowSummary(true);
      return;
    }
    setDomainIndex((current) => current + 1);
  }

  function editDomain(index: number) {
    setDomainIndex(index);
    setEditingFromSummary(true);
    setShowSummary(false);
  }

  function restart() {
    setResponses({});
    setDomainIndex(0);
    setEditingFromSummary(false);
    setShowSummary(false);
  }

  if (showSummary && summary) {
    return (
      <div className="space-y-8" aria-describedby="readiness-source-note">
        <section
          className="border-y border-gray-200 py-6 sm:py-8"
          aria-labelledby="readiness-summary-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            {tx.summary.eyebrow}
          </p>
          <h2
            id="readiness-summary-heading"
            ref={summaryHeadingRef}
            tabIndex={-1}
            className="mt-3 text-2xl font-bold text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            {tx.summary.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-700">
            {tx.summary.body}
          </p>
          <dl className="mt-6 grid gap-px border-y border-gray-200 bg-gray-200 sm:grid-cols-3">
            {READINESS_RESPONSE_OPTIONS.map((response) => {
              const presentation = RESPONSE_PRESENTATION[response];
              const ResponseIcon = presentation.Icon;
              return (
                <div key={response} className="bg-white px-4 py-4">
                  <dt className={`flex items-center gap-2 text-xs font-semibold ${presentation.text}`}>
                    <ResponseIcon aria-hidden="true" className="h-4 w-4" />
                    {tx.responseLabels[response]}
                  </dt>
                  <dd className="mt-2 font-mono text-xl font-semibold text-gray-900">
                    {summary.responseCounts[response]} / {totalQuestions}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>

        <section aria-labelledby="readiness-domain-summary">
          <h3
            id="readiness-domain-summary"
            className="text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            {tx.domainSummary}
          </h3>
          <ol className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
            {summary.domains.map((domainSummary, index) => {
              const domainCopy = tx.domains[domainSummary.domainId];
              const actions = [
                {
                  response: "not_met" as const,
                  text: domainCopy.notMetAction,
                },
                {
                  response: "to_complete" as const,
                  text: domainCopy.toCompleteAction,
                },
              ].filter(
                ({ response }) => domainSummary.questionIds[response].length > 0,
              );

              return (
                <li key={domainSummary.domainId} className="py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{domainCopy.label}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                        {READINESS_RESPONSE_OPTIONS.map((response) => {
                          const presentation = RESPONSE_PRESENTATION[response];
                          return (
                            <span key={response} className={`text-xs font-semibold ${presentation.text}`}>
                              {tx.responseLabels[response]}: {domainSummary.questionIds[response].length}
                            </span>
                          );
                        })}
                      </div>
                      {actions.map(({ response, text }) => (
                        <p key={response} className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
                          <span className="mr-1 font-semibold text-gray-700">
                            {tx.nextStep} ({tx.responseLabels[response]}):
                          </span>
                          {text}
                        </p>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => editDomain(index)}
                      className="shrink-0 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      {tx.editDomain}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={lang === "en" ? "/en/calculator" : "/calculator"}
            className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {tx.calculatorCta}
          </Link>
          <Link
            href={lang === "en" ? "/en/practice/procurement-beyond-8" : "/practice/procurement-beyond-8"}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {tx.practiceCta}
          </Link>
        </div>

        <button
          type="button"
          onClick={restart}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          {tx.startOver}
        </button>

        <aside
          id="readiness-source-note"
          className="border-l-2 border-gray-300 pl-4 text-xs leading-relaxed text-gray-500"
        >
          {tx.sourceNote}
        </aside>
      </div>
    );
  }

  return (
    <div className="space-y-8" aria-describedby="readiness-source-note">
      <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
        <p className="font-mono text-xs font-semibold text-blue-700">
          {tx.progress(domainIndex + 1, READINESS_DOMAINS.length)}
        </p>
        <p className="text-right text-xs text-gray-500">
          {tx.domains[currentDomain.id].label}
        </p>
      </div>

      <div className="space-y-6">
        {currentDomain.questions.map((question, questionIndex) => {
          const copy = tx.questions[question.id];
          return (
            <fieldset
              key={question.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
            >
              <legend className="px-1 text-base font-semibold leading-relaxed text-gray-900">
                <span className="mr-2 font-mono text-xs text-gray-400">
                  {domainIndex + 1}.{questionIndex + 1}
                </span>
                {copy.prompt}
              </legend>
              <div className="mt-4 space-y-3">
                {READINESS_RESPONSE_OPTIONS.map((response) => {
                  const presentation = RESPONSE_PRESENTATION[response];
                  const ResponseIcon = presentation.Icon;
                  const inputId = `readiness-${question.id}-${response}`;
                  const checked = responses[question.id] === response;
                  return (
                    <div key={response}>
                      <input
                        id={inputId}
                        className="peer sr-only"
                        type="radio"
                        name={question.id}
                        value={response}
                        checked={checked}
                        onChange={() => answer(question.id, response)}
                      />
                      <label
                        htmlFor={inputId}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border ${presentation.border} ${presentation.background} p-3 text-sm ${presentation.text} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 ${checked ? `ring-2 ${presentation.selected}` : ""}`}
                      >
                        <ResponseIcon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          <span className="block text-xs font-bold uppercase tracking-wide">
                            {tx.responseLabels[response]}
                          </span>
                          <span className="mt-1 block leading-relaxed text-gray-700">
                            {copy.answers[response]}
                          </span>
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setDomainIndex((current) => Math.max(0, current - 1))}
          disabled={domainIndex === 0 || editingFromSummary}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {tx.previous}
        </button>
        <button
          type="button"
          onClick={continueForward}
          disabled={!currentComplete}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {editingFromSummary
            ? tx.returnToSummary
            : domainIndex === READINESS_DOMAINS.length - 1
              ? tx.showSummary
              : tx.next}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <aside
        id="readiness-source-note"
        className="border-l-2 border-gray-300 pl-4 text-xs leading-relaxed text-gray-500"
      >
        {tx.sourceNote}
      </aside>
    </div>
  );
}
