"use client";

import { useState } from "react";
import Link from "next/link";
import { assessmentT, Lang } from "@/lib/i18n";

interface Props {
  lang?: Lang;
}

export default function AssessmentQuiz({ lang = "pl" }: Props) {
  const tx = assessmentT[lang];
  const questions = tx.questions as typeof assessmentT.pl.questions;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const totalScore = answers.reduce((s, a) => s + a, 0);

  function handleAnswer(score: number) {
    const next = [...answers, score];
    setAnswers(next);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setCurrent(0);
    setAnswers([]);
    setDone(false);
  }

  const level =
    totalScore <= 7
      ? tx.levels.pipe
      : totalScore <= 14
      ? tx.levels.transition
      : tx.levels.field;

  const levelColor =
    totalScore <= 7
      ? { border: "border-red-200", bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500" }
      : totalScore <= 14
      ? { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" }
      : { border: "border-green-200", bg: "bg-green-50", text: "text-green-700", bar: "bg-green-500" };

  if (done) {
    const pct = Math.round((totalScore / 20) * 100);
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-6 py-12">
        <div className={`rounded-2xl border ${levelColor.border} ${levelColor.bg} p-6`}>
          <p className={`text-xs font-bold uppercase tracking-wide ${levelColor.text}`}>
            {level.label}
          </p>
          <p className="mt-2 text-xl font-bold text-gray-900">{level.headline}</p>
          <p className="mt-2 text-sm text-gray-600">{level.desc}</p>

          <div className="mt-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold text-gray-700">{tx.yourScore}</span>
              <span className="font-mono text-2xl font-bold text-gray-900">
                {totalScore}
                <span className="text-sm font-normal text-gray-400"> {tx.outOf}</span>
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-3 rounded-full transition-all ${levelColor.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            {lang === "pl" ? "Twoje odpowiedzi" : "Your answers"}
          </p>
          <div className="space-y-1.5">
            {questions.map((q, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 font-mono font-bold ${
                    answers[i] === 0
                      ? "bg-red-100 text-red-700"
                      : answers[i] === 1
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {answers[i]}
                </span>
                <span className="text-gray-600">{q.dim}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={lang === "en" ? "/en/calculator" : "/calculator"}
            className="flex-1 rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            {tx.ctaCalculator}
          </Link>
          <Link
            href="/research"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-600 hover:border-gray-300"
          >
            {tx.ctaResearch}
          </Link>
        </div>

        <button
          onClick={restart}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-600"
        >
          {tx.restart}
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-12">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {tx.questionOf(current + 1, questions.length)}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">{q.dim}</p>
        <p className="text-base font-semibold text-gray-900">{q.q}</p>
      </div>

      <div className="space-y-2">
        {(q.answers as readonly string[]).map((answer, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all hover:shadow-sm ${
              i === 0
                ? "border-red-200 bg-red-50 text-red-800 hover:border-red-300"
                : i === 1
                ? "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300"
                : "border-green-200 bg-green-50 text-green-800 hover:border-green-300"
            }`}
          >
            <span className="font-mono mr-2 text-xs opacity-60">
              {i === 0 ? "0 pkt" : i === 1 ? "1 pkt" : "2 pkt"}
            </span>
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}
