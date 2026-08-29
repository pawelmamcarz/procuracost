import {
  calculatorV2T,
  modelV2T,
  researchExportV2T,
  suitabilityT,
  type Lang,
} from "@/lib/i18n";
import {
  SCENARIOS_V2,
  resolveLegalWaits,
  type ModelContextV2,
  type ScenarioV2Id,
} from "@/lib/model-v2";

import type { CalculatorWorkspaceState } from "./editor-state";
import { resolveProcessStepLabel } from "../process-map/rail-view-model";

export type EditableContextAxis = "initiatedOn";

export interface ContextAxesProps {
  lang: Lang;
  state: CalculatorWorkspaceState;
  onScenarioChange: (scenarioId: ScenarioV2Id) => void;
  onContextChange: (
    field: EditableContextAxis,
    value: ModelContextV2[EditableContextAxis]
  ) => void;
}

function scenarioCopy(id: ScenarioV2Id, lang: Lang) {
  return modelV2T[lang].scenarios[id];
}

function axisValueLabel(id: string, lang: Lang): string {
  const labels = researchExportV2T[lang].axisValues;
  return labels[id as keyof typeof labels] ?? id;
}

function number(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function ContextAxes({
  lang,
  state,
  onScenarioChange,
  onContextChange,
}: ContextAxesProps) {
  const tx = calculatorV2T[lang].workspace;
  const axes = researchExportV2T[lang].axes;
  const scenario = scenarioCopy(state.scenarioId, lang);
  const suitability = suitabilityT[lang];
  let legalWaits: ReturnType<typeof resolveLegalWaits> | null = null;
  try {
    legalWaits = resolveLegalWaits(state.draft.context);
  } catch {
    legalWaits = null;
  }
  const selectClass =
    "min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  const contextRows = [
    {
      label: axes.legalGovernanceBoundary,
      value: axisValueLabel(state.draft.context.boundaryId, lang),
    },
    {
      label: axes.procedureFamily,
      value: axisValueLabel(state.draft.context.procedureFamilyId, lang),
    },
    {
      label: axes.purchaseArchetype,
      value: axisValueLabel(state.draft.context.purchaseArchetypeId, lang),
    },
    {
      label: axes.executionChannel,
      value: axisValueLabel(state.draft.context.executionChannelId, lang),
    },
    {
      label: axes.systemSupport,
      value: axisValueLabel(state.draft.context.systemSupportId, lang),
    },
    ...(state.draft.context.buyerRegime
      ? [
          {
            label: suitability.fields.buyerRegime,
            value:
              suitability.options.buyerRegime[
                state.draft.context.buyerRegime
              ],
          },
        ]
      : []),
    ...(state.draft.context.procurementObject
      ? [
          {
            label: suitability.fields.procurementObject,
            value:
              suitability.options.procurementObject[
                state.draft.context.procurementObject
              ],
          },
        ]
      : []),
    ...(state.draft.context.communicationMethod
      ? [
          {
            label: suitability.fields.communicationMethod,
            value:
              suitability.options.communicationMethod[
                state.draft.context.communicationMethod
              ],
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block space-y-1" htmlFor="calculator-v2-scenario">
          <span className="block text-xs font-medium text-gray-600">
            {tx.scenario}
          </span>
          <select
            className={selectClass}
            id="calculator-v2-scenario"
            onChange={(event) =>
              onScenarioChange(event.currentTarget.value as ScenarioV2Id)
            }
            value={state.scenarioId}
          >
            {SCENARIOS_V2.map(({ id }) => (
              <option key={id} value={id}>
                {scenarioCopy(id, lang).name}
              </option>
            ))}
          </select>
        </label>
        <dl className="border-l-2 border-blue-500 pl-3 text-xs leading-relaxed">
          <div>
            <dt className="font-medium text-gray-600">
              {tx.scenarioDescription}
            </dt>
            <dd className="mt-1 text-gray-700">{scenario.description}</dd>
          </div>
          <div className="mt-2">
            <dt className="font-medium text-gray-600">
              {tx.scenarioEvidence}
            </dt>
            <dd className="mt-1 text-gray-700">{tx.retainedAssumption}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-4">
        <p className="max-w-3xl text-xs leading-relaxed text-gray-600">
          {tx.registeredContextNote}
        </p>
        <dl className="divide-y divide-gray-100 border-y border-gray-200">
          {contextRows.map(({ label, value }) => (
            <div
              className="grid gap-1 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-6"
              key={label}
            >
              <dt className="text-xs font-medium text-gray-600">{label}</dt>
              <dd className="text-sm text-gray-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <label className="block space-y-1">
          <span className="block text-xs font-medium text-gray-600">
            {axes.initiatedOn}
          </span>
          <input
            className={selectClass}
            onChange={(event) =>
              onContextChange("initiatedOn", event.currentTarget.value)
            }
            type="date"
            value={state.draft.context.initiatedOn}
          />
        </label>
      </div>

      {legalWaits ? (
        <section className="border-l-4 border-amber-400 pl-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            {tx.legalConstraints}
          </h3>
          <p className="mt-2 font-mono text-xs text-gray-600">
            {tx.rulesetLabel}: {state.draft.context.legalRulesetId}
          </p>
          {legalWaits.length ? (
            <dl className="mt-3 divide-y divide-gray-100 border-y border-gray-200">
              {legalWaits.map((wait) => (
                <div className="py-3" key={wait.id}>
                  <dt className="text-sm font-medium text-gray-900">
                    {resolveProcessStepLabel(
                      {
                        labelKey: wait.labelKey.replace(
                          "model.legal.",
                          "workflow.legal."
                        ),
                      },
                      lang
                    )}
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-gray-600">
                    {tx.waitDuration(number(wait.queueDays.central, lang))} · {wait.provenance.provision}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              {tx.noLegalWaits}
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}
