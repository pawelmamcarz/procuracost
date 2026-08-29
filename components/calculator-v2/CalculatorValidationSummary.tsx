import { CircleAlert } from "lucide-react";

import { calculatorV2T, type Lang } from "@/lib/i18n";

import type { CalculatorUiIssue } from "./issues";
import { calculatorIssueCopy } from "./workspace-validation";

export interface CalculatorValidationSummaryProps {
  lang: Lang;
  issues: readonly CalculatorUiIssue[];
}

export function CalculatorValidationSummary({
  lang,
  issues,
}: CalculatorValidationSummaryProps) {
  if (issues.length === 0) return null;

  const tx = calculatorV2T[lang];
  return (
    <section
      className="border-l-4 border-amber-400 bg-amber-50 p-4"
      id="calculator-submit-status"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <CircleAlert
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            {tx.workspace.calculationNeedsCorrection}
          </h3>
          <ul className="mt-2 space-y-2">
            {issues.map((issue, index) => (
              <li
                className="text-xs leading-relaxed text-gray-700"
                key={`${issue.source}-${issue.code}-${issue.field ?? index}`}
              >
                {calculatorIssueCopy(issue, lang)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
