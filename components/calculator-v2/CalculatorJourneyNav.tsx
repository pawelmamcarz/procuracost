import { calculatorV2T, type Lang } from "@/lib/i18n";

import {
  CALCULATOR_STAGES,
  type CalculatorStage,
} from "./local-draft";

export interface CalculatorJourneyNavProps {
  activeStage: CalculatorStage;
  hasRecord: boolean;
  lang: Lang;
  onStageChange: (stage: CalculatorStage) => void;
}

export function CalculatorJourneyNav({
  activeStage,
  hasRecord,
  lang,
  onStageChange,
}: CalculatorJourneyNavProps) {
  const tx = calculatorV2T[lang].journey;

  return (
    <nav aria-label={tx.navigation} data-calculator-stage-nav>
      <ol className="grid grid-cols-2 border-y border-gray-200 lg:grid-cols-4">
        {CALCULATOR_STAGES.map((stage, index) => {
          const copy = tx.stages[stage];
          const disabled = stage === "record" && !hasRecord;
          const active = stage === activeStage;
          return (
            <li
              className="border-b border-gray-200 odd:border-r even:border-r-0 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              data-calculator-stage={stage}
              key={stage}
            >
              <button
                aria-current={active ? "step" : undefined}
                className={
                  active
                    ? "flex min-h-24 w-full flex-col items-start border-t-4 border-blue-700 bg-blue-50 px-4 py-4 text-left text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                    : "flex min-h-24 w-full flex-col items-start border-t-4 border-transparent px-4 py-4 text-left text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
                }
                disabled={disabled}
                onClick={() => onStageChange(stage)}
                type="button"
              >
                <span className="font-mono text-[11px] font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 text-sm font-bold">{copy.label}</span>
                <span className="mt-1 hidden text-xs leading-5 text-gray-600 sm:block">
                  {copy.description}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
