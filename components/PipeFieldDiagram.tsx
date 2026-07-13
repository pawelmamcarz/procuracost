"use client";

import { PHI_SET } from "@/lib/i18n";

interface Props {
  lang?: "pl" | "en";
}

const PIPE_STEPS = [
  { namePl: "Analiza potrzeb + SIWZ", nameEn: "Needs analysis + spec", days: "17", mandatory: false },
  { namePl: "Publikacja BZP/TED", nameEn: "Publication BZP/TED", days: "35+", mandatory: true },
  { namePl: "Ocena ofert + komisja", nameEn: "Bid evaluation + committee", days: "13", mandatory: false },
  { namePl: "Standstill (art. 264 PZP)", nameEn: "Standstill period (art. 264)", days: "10/15", mandatory: true },
  { namePl: "Podpisanie umowy", nameEn: "Contract signing", days: "5", mandatory: false },
];

const FIELD_PATHS_PL = ["dialog", "warianty trybu", "umowa ramowa", "katalog", "negocjacje z przesłanką"];
const FIELD_PATHS_EN = ["dialogue", "procedure variants", "framework", "catalog", "negotiation with grounds"];

const CONSTRAINTS_PL = ["uprawnienia", "konkurencja", "etyka", "dokumentacja"];
const CONSTRAINTS_EN = ["authorisation", "competition", "ethics", "documentation"];

export default function PipeFieldDiagram({ lang = "pl" }: Props) {
  const isPl = lang === "pl";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col rounded-xl border border-red-200 bg-red-50 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-red-700">
            {isPl ? "Ścieżka formalna = Tunel" : "Formal path = Tunnel"}
          </p>
          <p className="mt-0.5 font-mono text-xs text-red-400">a₁ → a₂ → a₃ → ··· → aₙ</p>
        </div>

        <div className="mt-3 flex-1 space-y-0.5">
          {PIPE_STEPS.map((step, i) => (
            <div key={step.namePl}>
              <div
                className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs ${
                  step.mandatory
                    ? "border-red-300 bg-red-200 text-red-900"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <span className="font-medium leading-tight">
                  {isPl ? step.namePl : step.nameEn}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className={`font-mono ${step.mandatory ? "font-bold text-red-700" : "text-gray-400"}`}>
                    {step.days} {isPl ? "dni" : "d"}
                  </span>
                  {step.mandatory && (
                    <span className="rounded bg-red-600 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      wait
                    </span>
                  )}
                </div>
              </div>
              {i < PIPE_STEPS.length - 1 && (
                <div className="flex justify-center py-0.5 text-xs text-red-300">↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex justify-between rounded bg-red-100 px-3 py-1.5 text-red-800">
            <span className="font-semibold">{isPl ? "Czas zależy od kroków i danych" : "Timing depends on steps and inputs"}</span>
            <span className="text-red-600">{isPl ? "wartość: konkurencja i audyt" : "value: competition and auditability"}</span>
          </div>
          <p className="leading-relaxed text-red-500">
            {isPl
              ? "Sekwencyjność może zwiększać czas. Obejście jest scenariuszowym ryzykiem do zmierzenia, nie automatycznym skutkiem."
              : "Sequencing can increase timing. Bypass is a scenario risk to measure, not an automatic consequence."}
          </p>
        </div>
      </div>

      <div className="flex flex-col rounded-xl border border-green-200 bg-green-50 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-green-700">
            {isPl ? "Ścieżka adaptacyjna = Pole" : "Adaptive path = Field"}
          </p>
          <p className="mt-0.5 font-mono text-xs text-green-400">
            {PHI_SET[lang]}
          </p>
        </div>

        <div className="relative mt-3 flex-1 overflow-hidden rounded-xl border-2 border-dashed border-green-400 bg-white" style={{ minHeight: "180px" }}>
          {(isPl ? CONSTRAINTS_PL : CONSTRAINTS_EN).map((label, i) => (
            <span
              key={label}
              className={`absolute rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 ${
                i === 0 ? "left-2 top-2" :
                i === 1 ? "right-2 top-2" :
                i === 2 ? "bottom-2 left-2" :
                           "bottom-2 right-2"
              }`}
            >
              {label}
            </span>
          ))}

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <p className="text-3xl font-bold text-green-200">∞</p>
            <p className="text-xs font-medium text-green-600">
              {isPl ? "zgodnych ścieżek" : "compliant paths"}
            </p>
            <div className="flex flex-wrap justify-center gap-1">
              {(isPl ? FIELD_PATHS_PL : FIELD_PATHS_EN).map((m) => (
                <span key={m} className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] text-green-700">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex justify-between rounded bg-green-100 px-3 py-1.5 text-green-800">
            <span className="font-semibold">{isPl ? "Możliwe równoległe ścieżki" : "Parallel paths may be possible"}</span>
            <span className="text-green-600">{isPl ? "ta sama granica prawna" : "the same legal boundary"}</span>
          </div>
          <p className="leading-relaxed text-green-600">
            {isPl
              ? "Adaptacja nie gwarantuje zgodności ani niższego kosztu; wymaga skutecznej konkurencji, dokumentacji i kontroli."
              : "Adaptation guarantees neither compliance nor lower cost; it requires effective competition, documentation and controls."}
          </p>
        </div>
      </div>
    </div>
  );
}
