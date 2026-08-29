import { LockKeyhole, Trash2 } from "lucide-react";

import { calculatorV2T, type Lang } from "@/lib/i18n";
import type {
  AlternativeId,
  CalibratedValue,
  EvidenceClass,
  ProcessMapStep,
} from "@/lib/model-v2";

import {
  EDITABLE_PROCESS_STEP_KINDS,
  type CalculatorWorkspaceAction,
  type CalculatorWorkspaceState,
  type EditableStepRangeField,
} from "./editor-state";
import type { CalculatorUiIssue } from "./issues";
import { calculatorIssueCopy } from "./workspace-validation";
import { resolveProcessStepLabel } from "../process-map/rail-view-model";

export interface ProcessStepInspectorProps {
  lang: Lang;
  state: CalculatorWorkspaceState;
  issues: readonly CalculatorUiIssue[];
  onAction: (action: CalculatorWorkspaceAction) => void;
}

type RangeMember = "low" | "central" | "high";

function stepIssue(
  issues: readonly CalculatorUiIssue[],
  alternativeId: AlternativeId,
  stepId: string,
  field: string
): CalculatorUiIssue | undefined {
  return issues.find(
    (issue) =>
      issue.alternativeId === alternativeId &&
      issue.stepId === stepId &&
      issue.field === field
  );
}

function editedRange(
  value: CalibratedValue,
  member: RangeMember,
  nextNumber: number
): CalibratedValue {
  return {
    ...value,
    [member]: nextNumber,
    rangeKind: "calibrated",
    evidenceClass: "user_input",
    evidenceIds: [],
  };
}

interface RangeEditorProps {
  lang: Lang;
  alternativeId: AlternativeId;
  stepId: string;
  legend: string;
  idPrefix: string;
  unit: string;
  value: CalibratedValue;
  field: EditableStepRangeField;
  issue?: CalculatorUiIssue;
  onAction: (action: CalculatorWorkspaceAction) => void;
}

function RangeEditor({
  lang,
  alternativeId,
  stepId,
  legend,
  idPrefix,
  unit,
  value,
  field,
  issue,
  onAction,
}: RangeEditorProps) {
  const tx = calculatorV2T[lang].inspector;
  const errorId = `${idPrefix}-error`;
  const labels: Array<[RangeMember, string]> = [
    ["low", tx.low],
    ["central", tx.central],
    ["high", tx.high],
  ];
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold text-gray-700">{legend}</legend>
      <div className="grid grid-cols-3 gap-2">
        {labels.map(([member, label]) => {
          const id = `${idPrefix}-${member}`;
          return (
            <label className="space-y-1" htmlFor={id} key={member}>
              <span className="block text-xs font-medium text-gray-600">
                {label}
              </span>
              <span className="flex items-center gap-1">
                <input
                  aria-describedby={issue ? errorId : undefined}
                  aria-invalid={issue ? true : undefined}
                  className="min-h-11 min-w-0 w-full rounded-lg border border-gray-200 bg-white px-2 font-mono text-xs text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  id={id}
                  inputMode="decimal"
                  min={0}
                  onChange={(event) =>
                    onAction({
                      type: "edit-step-range",
                      alternativeId,
                      stepId,
                      field,
                      value: editedRange(
                        value,
                        member,
                        Number(event.currentTarget.value)
                      ),
                    })
                  }
                  step="any"
                  type="number"
                  value={value[member]}
                />
                <span className="font-mono text-[10px] text-gray-500">
                  {unit}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {issue ? (
        <p className="text-xs text-amber-800" id={errorId}>
          {calculatorIssueCopy(issue, lang)}
        </p>
      ) : null}
    </fieldset>
  );
}

function roleLabel(roleId: string, lang: Lang): string {
  const roles = calculatorV2T[lang].inspector.roles;
  return roleId in roles
    ? roles[roleId as keyof typeof roles]
    : `${roles.unknown} (${roleId})`;
}

function LockedInspector({
  lang,
  step,
}: {
  lang: Lang;
  step: ProcessMapStep;
}) {
  const tx = calculatorV2T[lang].inspector;
  const provenance = step.lockedLegalProvenance!;
  const rows = [
    [tx.legalRuleset, provenance.legalRulesetId],
    [tx.ruleId, provenance.ruleId],
    [tx.provision, provenance.provision],
    [tx.initiatedOn, provenance.initiatedOn],
    [tx.lockedActive, `${provenance.lockedActiveDays} ${tx.daysUnit}`],
    [tx.lockedQueue, `${provenance.lockedQueueDays} ${tx.daysUnit}`],
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 border-l-4 border-amber-400 pl-3">
        <LockKeyhole
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {tx.lockedHeading}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            {tx.lockedDescription}
          </p>
        </div>
      </div>
      <dl className="divide-y divide-gray-100 border-y border-gray-200">
        {rows.map(([label, value]) => (
          <div className="py-3" key={label}>
            <dt className="text-xs font-medium text-gray-600">{label}</dt>
            <dd className="mt-1 break-words font-mono text-xs text-gray-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function evidenceSummary(step: ProcessMapStep): {
  classes: EvidenceClass[];
  ids: string[];
} {
  const values = [
    step.activeDays,
    step.queueDays,
    step.nonLabourCost,
    ...Object.values(step.roleHours),
  ];
  return {
    classes: [...new Set(values.map(({ evidenceClass }) => evidenceClass))],
    ids: [...new Set(values.flatMap(({ evidenceIds }) => evidenceIds))],
  };
}

export function ProcessStepInspector({
  lang,
  state,
  issues,
  onAction,
}: ProcessStepInspectorProps) {
  const tx = calculatorV2T[lang].inspector;
  const alternativeId = state.selectedAlternative;
  const workflow = state.draft.alternatives[alternativeId].workflowDesign;
  const step = workflow.steps.find(({ id }) => id === state.selectedStepId);

  return (
    <aside
      aria-live="polite"
      className="border-t border-gray-200 pt-6 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
      id="process-step-inspector"
    >
      {!step ? (
        <p className="text-sm leading-relaxed text-gray-600">{tx.selectStep}</p>
      ) : (
        <div className="space-y-6">
          <header>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {tx.title}
            </p>
            <h3 className="mt-1 break-words text-lg font-bold text-gray-900">
              {resolveProcessStepLabel(step, lang)}
            </h3>
          </header>

          {step.lockedLegalProvenance ? (
            <LockedInspector lang={lang} step={step} />
          ) : (
            <>
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {tx.identity}
                </legend>
                <label
                  className="block space-y-1"
                  htmlFor={`process-step-label-${alternativeId}-${step.id}`}
                >
                  <span className="block text-xs font-medium text-gray-600">
                    {tx.stepLabel}
                  </span>
                  <input
                    aria-describedby={
                      stepIssue(
                        issues,
                        alternativeId,
                        step.id,
                        "userLabel"
                      )
                        ? `process-step-label-${alternativeId}-${step.id}-error`
                        : `process-step-label-${alternativeId}-${step.id}-hint`
                    }
                    aria-invalid={
                      stepIssue(
                        issues,
                        alternativeId,
                        step.id,
                        "userLabel"
                      )
                        ? true
                        : undefined
                    }
                    className="min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    id={`process-step-label-${alternativeId}-${step.id}`}
                    onChange={(event) =>
                      onAction({
                        type: "edit-step-label",
                        alternativeId,
                        stepId: step.id,
                        userLabel: event.currentTarget.value,
                      })
                    }
                    type="text"
                    value={step.userLabel ?? ""}
                  />
                </label>
                {stepIssue(issues, alternativeId, step.id, "userLabel") ? (
                  <p
                    className="text-xs text-amber-800"
                    id={`process-step-label-${alternativeId}-${step.id}-error`}
                  >
                    {calculatorIssueCopy(
                      stepIssue(
                        issues,
                        alternativeId,
                        step.id,
                        "userLabel"
                      )!,
                      lang
                    )}
                  </p>
                ) : (
                  <p
                    className="text-xs leading-relaxed text-gray-500"
                    id={`process-step-label-${alternativeId}-${step.id}-hint`}
                  >
                    {tx.stepLabelHint}
                  </p>
                )}
                <label className="block space-y-1">
                  <span className="block text-xs font-medium text-gray-600">
                    {tx.kind}
                  </span>
                  <select
                    className="min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    onChange={(event) =>
                      onAction({
                        type: "edit-step-kind",
                        alternativeId,
                        stepId: step.id,
                        kind: event.currentTarget.value as ProcessMapStep["kind"],
                      })
                    }
                    value={step.kind}
                  >
                    {EDITABLE_PROCESS_STEP_KINDS.map((kind) => (
                      <option key={kind} value={kind}>
                        {tx.kinds[kind]}
                      </option>
                    ))}
                  </select>
                </label>
              </fieldset>

              <RangeEditor
                alternativeId={alternativeId}
                field={{ kind: "activeDays" }}
                idPrefix={`process-step-${alternativeId}-${step.id}-active`}
                issue={stepIssue(issues, alternativeId, step.id, "activeDays")}
                lang={lang}
                legend={tx.activeWork}
                onAction={onAction}
                stepId={step.id}
                unit={tx.daysUnit}
                value={step.activeDays}
              />
              <RangeEditor
                alternativeId={alternativeId}
                field={{ kind: "queueDays" }}
                idPrefix={`process-step-${alternativeId}-${step.id}-queue`}
                issue={stepIssue(issues, alternativeId, step.id, "queueDays")}
                lang={lang}
                legend={tx.queue}
                onAction={onAction}
                stepId={step.id}
                unit={tx.daysUnit}
                value={step.queueDays}
              />

              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {tx.predecessors}
                </legend>
                {workflow.steps.map((candidate) => {
                  const checked = step.predecessorIds.includes(candidate.id);
                  return (
                    <label
                      className="flex min-h-11 items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                      key={candidate.id}
                    >
                      <input
                        checked={checked}
                        className="mt-1 h-4 w-4 accent-blue-600"
                        disabled={candidate.id === step.id}
                        onChange={(event) => {
                          const next = event.currentTarget.checked
                            ? [...step.predecessorIds, candidate.id]
                            : step.predecessorIds.filter(
                                (id) => id !== candidate.id
                              );
                          onAction({
                            type: "edit-step-predecessors",
                            alternativeId,
                            stepId: step.id,
                            predecessorIds: next,
                          });
                        }}
                        type="checkbox"
                        value={candidate.id}
                      />
                      <span>
                        <span className="block font-mono text-[10px] text-gray-500">
                          {candidate.id}
                        </span>
                        <span className="block break-words">
                          {resolveProcessStepLabel(candidate, lang)}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {tx.roleHours}
                </legend>
                {Object.entries(step.roleHours).map(([roleId, value]) => (
                  <RangeEditor
                    alternativeId={alternativeId}
                    field={{ kind: "roleHours", roleId }}
                    idPrefix={`process-step-${alternativeId}-${step.id}-role-${roleId}`}
                    issue={stepIssue(
                      issues,
                      alternativeId,
                      step.id,
                      `roleHours.${roleId}`
                    )}
                    key={roleId}
                    lang={lang}
                    legend={roleLabel(roleId, lang)}
                    onAction={onAction}
                    stepId={step.id}
                    unit={tx.hoursUnit}
                    value={value}
                  />
                ))}
              </fieldset>

              <RangeEditor
                alternativeId={alternativeId}
                field={{ kind: "nonLabourCost" }}
                idPrefix={`process-step-${alternativeId}-${step.id}-non-labour`}
                issue={stepIssue(
                  issues,
                  alternativeId,
                  step.id,
                  "nonLabourCost"
                )}
                lang={lang}
                legend={tx.nonLabourCost}
                onAction={onAction}
                stepId={step.id}
                unit={tx.currencyUnit}
                value={step.nonLabourCost}
              />

              <section className="space-y-2 border-y border-gray-200 py-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {tx.rangeEvidence}
                </h4>
                <dl className="space-y-2 text-xs">
                  <div>
                    <dt className="font-medium text-gray-600">
                      {tx.evidenceClass}
                    </dt>
                    <dd className="mt-1 text-gray-900">
                      {evidenceSummary(step).classes
                        .map((value) => tx.evidenceClasses[value])
                        .join(", ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-600">
                      {tx.evidenceIds}
                    </dt>
                    <dd className="mt-1 break-words font-mono text-gray-900">
                      {evidenceSummary(step).ids.join(", ") || tx.noEvidenceIds}
                    </dd>
                  </div>
                </dl>
              </section>

              <p className="text-xs leading-relaxed text-gray-500">
                {tx.appliesImmediately}
              </p>
              <button
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() =>
                  onAction({
                    type: "remove-step",
                    alternativeId,
                    stepId: step.id,
                  })
                }
                type="button"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                {tx.removeStep}
              </button>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
