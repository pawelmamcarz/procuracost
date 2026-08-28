import { CheckCircle2, CircleAlert } from "lucide-react";

import { calculatorV2T, type Lang } from "@/lib/i18n";
import type { AlternativeId } from "@/lib/model-v2";

import type { CalculatorWorkspaceState } from "./editor-state";
import type { CalculatorUiIssue } from "./issues";
import { calculatorIssueCopy } from "./workspace-validation";
import { resolveProcessStepLabel } from "../process-map/rail-view-model";

export interface ProcessMapValidationSummaryProps {
  lang: Lang;
  state: CalculatorWorkspaceState;
  issues: readonly CalculatorUiIssue[];
  onFocusIssue: (alternativeId: AlternativeId, stepId: string) => void;
}

function issueStepLabel(
  state: CalculatorWorkspaceState,
  issue: CalculatorUiIssue,
  lang: Lang
): string | null {
  if (!issue.alternativeId || !issue.stepId) return null;
  const step = state.draft.alternatives[
    issue.alternativeId
  ].workflowDesign.steps.find(({ id }) => id === issue.stepId);
  return step ? resolveProcessStepLabel(step, lang) : null;
}

export function ProcessMapValidationSummary({
  lang,
  state,
  issues,
  onFocusIssue,
}: ProcessMapValidationSummaryProps) {
  const tx = calculatorV2T[lang];
  if (issues.length === 0) {
    return (
      <div
        aria-live="polite"
        className="flex items-center gap-2 text-sm text-gray-700"
        id="process-map-status"
        role="status"
      >
        <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-blue-600" />
        {tx.workspace.mapsValid}
      </div>
    );
  }
  return (
    <section
      className="border-l-4 border-amber-400 bg-amber-50 p-4"
      id="process-map-status"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <CircleAlert
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            {tx.workspace.mapNeedsCorrection}
          </h3>
          <ul className="mt-2 space-y-3">
            {issues.map((issue, index) => {
              const stepLabel = issueStepLabel(state, issue, lang);
              const alternativeLabel = issue.alternativeId
                ? tx.alternatives[issue.alternativeId]
                : null;
              return (
                <li className="text-xs leading-relaxed text-gray-700" key={`${issue.source}-${issue.code}-${issue.stepId ?? index}`}>
                  <p>
                    {alternativeLabel ? (
                      <span className="font-semibold">{alternativeLabel}. </span>
                    ) : null}
                    {stepLabel ? (
                      <span className="font-semibold">{stepLabel}: </span>
                    ) : null}
                    {calculatorIssueCopy(issue, lang)}
                  </p>
                  {issue.alternativeId && issue.stepId ? (
                    <button
                      className="mt-1 min-h-11 text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() =>
                        onFocusIssue(issue.alternativeId!, issue.stepId!)
                      }
                      type="button"
                    >
                      {tx.workspace.focusIssue}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
