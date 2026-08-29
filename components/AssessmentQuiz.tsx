"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import {
  buildProcessProfileResult,
  createProcessProfileState,
  processProfileReducer,
  type ProcessOrientation,
  type ProcessProfileState,
} from "@/components/process-design-profile/profile-state";
import { revealResult } from "@/components/result-reveal";
import { assessmentT, type Lang } from "@/lib/i18n";

export const PROCESS_PROFILE_RESULT_HEADING_ID =
  "process-profile-result-heading";

const ORIENTATIONS = ["sequential", "mixed", "adaptive"] as const;

interface AssessmentQuizProps {
  lang?: Lang;
}

interface AssessmentQuizViewProps {
  lang: Lang;
  state: ProcessProfileState;
  onStateChange: (state: ProcessProfileState) => void;
}

function routeFor(lang: Lang, path: "calculator" | "readiness") {
  const suffix = path === "calculator" ? "/calculator" : "/readiness";
  return lang === "en" ? `/en${suffix}` : suffix;
}

function orientationLabel(
  labels: Record<ProcessOrientation, string>,
  orientation: ProcessOrientation
) {
  return labels[orientation];
}

export function AssessmentQuizView({
  lang,
  state,
  onStateChange,
}: AssessmentQuizViewProps) {
  const tx = assessmentT[lang];
  const questions = tx.questions as typeof assessmentT.pl.questions;
  const result = buildProcessProfileResult(state.answers, questions.length);
  const answers = new Map(
    state.answers.map((answer) => [answer.questionIndex, answer])
  );

  function selectAnswer(
    questionIndex: number,
    orientation: ProcessOrientation,
    answerIndex: 0 | 1 | 2
  ) {
    onStateChange(
      processProfileReducer(state, {
        type: "answer",
        answer: { questionIndex, orientation, answerIndex },
        questionCount: questions.length,
      })
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="max-w-3xl border-b border-gray-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          {tx.badge}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {tx.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          {tx.subtitle}
        </p>
        <p className="mt-5 font-mono text-sm text-gray-600">
          {tx.answeredCount(state.answers.length, questions.length)}
        </p>
      </header>

      <form className="mt-4" onSubmit={(event) => event.preventDefault()}>
        {questions.map((question, questionIndex) => {
          const selected = answers.get(questionIndex);

          return (
            <fieldset
              key={question.dimension}
              className="grid gap-5 border-b border-gray-100 py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]"
              data-profile-row={questionIndex}
            >
              <legend className="contents">
                <span className="pr-5">
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                    {question.dimension}
                  </span>
                  <span className="mt-2 block text-base font-semibold leading-6 text-gray-900">
                    {question.prompt}
                  </span>
                </span>
              </legend>

              <span className="grid gap-2">
                {question.answers.map((answer, answerIndex) => {
                  const orientation = ORIENTATIONS[answerIndex];
                  const isSelected = selected?.orientation === orientation;

                  return (
                    <label
                      key={orientation}
                      className={`grid min-h-11 cursor-pointer grid-cols-[auto_1fr] gap-x-3 rounded-lg border px-4 py-3 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`profile-question-${questionIndex}`}
                        value={orientation}
                        checked={isSelected}
                        onChange={() =>
                          selectAnswer(
                            questionIndex,
                            orientation,
                            answerIndex as 0 | 1 | 2
                          )
                        }
                        className="mt-1 h-4 w-4 accent-blue-700"
                      />
                      <span>
                        <span className="flex items-center justify-between gap-3">
                          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">
                            {orientationLabel(tx.orientations, orientation)}
                          </span>
                          {isSelected ? (
                            <span
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800"
                              data-selected-indicator
                            >
                              <Check aria-hidden="true" className="h-4 w-4" />
                              {tx.selected}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-gray-700">
                          {answer}
                        </span>
                      </span>
                    </label>
                  );
                })}

                <span
                  className="mt-1 block text-sm font-medium text-gray-600"
                  {...(selected
                    ? { "data-selected-orientation": selected.orientation }
                    : {})}
                >
                  {selected
                    ? tx.selectedOrientation(
                        orientationLabel(tx.orientations, selected.orientation)
                      )
                    : tx.unanswered}
                </span>
              </span>
            </fieldset>
          );
        })}
      </form>

      {result ? (
        <section
          className="mt-10 border-t-2 border-blue-700 pt-8"
          aria-labelledby={PROCESS_PROFILE_RESULT_HEADING_ID}
          aria-live="polite"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            {tx.result.eyebrow}
          </p>
          <h2
            id={PROCESS_PROFILE_RESULT_HEADING_ID}
            tabIndex={-1}
            className="mt-2 text-2xl font-bold tracking-tight text-gray-900"
          >
            {tx.result.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
            {tx.result.description}
          </p>

          <h3 className="mt-7 text-sm font-semibold text-gray-900">
            {tx.result.countsTitle}
          </h3>
          <dl className="mt-3 grid border-y border-gray-200 sm:grid-cols-3">
            {ORIENTATIONS.map((orientation) => (
              <div
                key={orientation}
                className="flex items-baseline justify-between gap-4 border-b border-gray-100 px-1 py-4 last:border-b-0 sm:block sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-1 sm:last:border-r-0"
                data-orientation-count={orientation}
              >
                <dt className="text-sm text-gray-600">
                  {orientationLabel(tx.orientations, orientation)}
                </dt>
                <dd className="font-mono text-2xl font-semibold text-gray-900 sm:mt-2">
                  {result.counts[orientation]}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-8 text-sm font-semibold text-gray-900">
            {tx.result.selectionsTitle}
          </h3>
          <ol className="mt-3 border-y border-gray-200">
            {questions.map((question, questionIndex) => {
              const selected = answers.get(questionIndex)!;
              return (
                <li
                  key={question.dimension}
                  className="grid gap-3 border-b border-gray-100 py-4 last:border-b-0 sm:grid-cols-[2rem_minmax(0,1fr)_9rem] sm:items-start"
                  data-profile-result-row={questionIndex}
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-gray-500"
                  >
                    {String(questionIndex + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      {question.dimension}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-gray-700">
                      {question.answers[selected.answerIndex]}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-gray-700 sm:text-right">
                    {orientationLabel(tx.orientations, selected.orientation)}
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="mt-6 max-w-3xl border-l-2 border-gray-400 pl-4 text-sm leading-6 text-gray-700">
            {tx.result.validationCaveat}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={routeFor(lang, "calculator")}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
            >
              {tx.actions.calculator}
            </Link>
            <Link
              href={routeFor(lang, "readiness")}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-400 px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:border-gray-600"
            >
              {tx.actions.readiness}
            </Link>
          </div>
          <button
            type="button"
            onClick={() =>
              onStateChange(processProfileReducer(state, { type: "reset" }))
            }
            className="mt-5 min-h-11 text-sm font-semibold text-gray-600 underline decoration-gray-200 underline-offset-4 hover:text-gray-900"
          >
            {tx.actions.restart}
          </button>
        </section>
      ) : null}
    </div>
  );
}

export default function AssessmentQuiz({ lang = "pl" }: AssessmentQuizProps) {
  const [state, setState] = useState(createProcessProfileState);

  useEffect(() => {
    if (state.focusTarget !== "result-heading") return;
    revealResult(document.getElementById(PROCESS_PROFILE_RESULT_HEADING_ID));
  }, [state.focusTarget]);

  return (
    <AssessmentQuizView lang={lang} state={state} onStateChange={setState} />
  );
}
