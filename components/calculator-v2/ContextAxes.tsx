import {
  calculatorV2T,
  modelV2T,
  researchExportV2T,
  type Lang,
} from "@/lib/i18n";
import {
  EXECUTION_CHANNEL_IDS,
  LEGAL_GOVERNANCE_BOUNDARY_IDS,
  PROCEDURE_FAMILY_IDS,
  PURCHASE_ARCHETYPE_IDS,
  SCENARIOS_V2,
  SYSTEM_SUPPORT_IDS,
  resolveLegalWaits,
  type ModelContextV2,
  type ScenarioV2Id,
} from "@/lib/model-v2";

import type { CalculatorWorkspaceState } from "./editor-state";
import { resolveProcessStepLabel } from "../process-map/rail-view-model";

export type EditableContextAxis =
  | "boundaryId"
  | "procedureFamilyId"
  | "purchaseArchetypeId"
  | "executionChannelId"
  | "systemSupportId"
  | "initiatedOn";

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
  let legalWaits: ReturnType<typeof resolveLegalWaits> | null = null;
  try {
    legalWaits = resolveLegalWaits(state.draft.context);
  } catch {
    legalWaits = null;
  }
  const selectClass =
    "min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  const fields = [
    {
      field: "boundaryId" as const,
      label: axes.legalGovernanceBoundary,
      value: state.draft.context.boundaryId,
      ids: LEGAL_GOVERNANCE_BOUNDARY_IDS,
    },
    {
      field: "procedureFamilyId" as const,
      label: axes.procedureFamily,
      value: state.draft.context.procedureFamilyId,
      ids: PROCEDURE_FAMILY_IDS,
    },
    {
      field: "purchaseArchetypeId" as const,
      label: axes.purchaseArchetype,
      value: state.draft.context.purchaseArchetypeId,
      ids: PURCHASE_ARCHETYPE_IDS,
    },
    {
      field: "executionChannelId" as const,
      label: axes.executionChannel,
      value: state.draft.context.executionChannelId,
      ids: EXECUTION_CHANNEL_IDS,
    },
    {
      field: "systemSupportId" as const,
      label: axes.systemSupport,
      value: state.draft.context.systemSupportId,
      ids: SYSTEM_SUPPORT_IDS,
    },
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

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ field, label, value, ids }) => (
          <label className="block space-y-1" key={field}>
            <span className="block text-xs font-medium text-gray-600">
              {label}
            </span>
            <select
              className={selectClass}
              onChange={(event) =>
                onContextChange(field, event.currentTarget.value)
              }
              value={value}
            >
              {ids.map((id) => (
                <option key={id} value={id}>
                  {axisValueLabel(id, lang)}
                </option>
              ))}
            </select>
          </label>
        ))}
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
