"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { ArrowRight, Clipboard, FileCheck2 } from "lucide-react";

import DecisionRecord from "@/components/decision-record/DecisionRecord";
import DecisionRecordActions from "@/components/decision-record/DecisionRecordActions";
import { calculatorV2T, type Lang } from "@/lib/i18n";
import {
  MODEL_V2_METADATA,
  createScenarioDraft,
  type ScenarioV2Id,
} from "@/lib/model-v2";
import type { LegacyMigrationResult } from "@/lib/model-v2/legacy-adapter";

import { AlternativeDesignControls } from "./AlternativeDesignControls";
import { CalculatorValidationSummary } from "./CalculatorValidationSummary";
import { ContextAxes, type EditableContextAxis } from "./ContextAxes";
import { EconomicAssumptions } from "./EconomicAssumptions";
import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
  type CalculatorFocusTarget,
  type CalculatorWorkspaceAction,
  type CalculatorWorkspaceState,
} from "./editor-state";
import { applyLegalContextTransition } from "./legal-transition";
import { LegacyMigrationConfirmation } from "./LegacyMigrationConfirmation";
import { ProcessMapEditor } from "./ProcessMapEditor";
import { buildBaseScenarioShareParams } from "./share";
import { partitionCalculatorIssues } from "./validation-presentation";
import {
  DEFAULT_SCENARIO_V2_ID,
  bootstrapCalculatorUrl,
  type CalculatorUrlBootstrap,
} from "./url-bootstrap";
import {
  deriveCalculatorWorkspaceValidation,
  submitCalculatorWorkspace,
} from "./workspace-validation";
import {
  applyLegacyMigrationControlTransition,
  createRenderableCalculatorWorkspaceState,
} from "./workspace-bootstrap";
import { revealResult } from "../result-reveal";

export const CALCULATOR_RESULT_HEADING_ID = "decision-record-heading";
export const CALCULATOR_RESULT_REGION_ID = "decision-record";

export interface CalculatorResultBoundaryProps {
  children: ReactNode;
}

export function CalculatorResultBoundary({
  children,
}: CalculatorResultBoundaryProps) {
  return (
    <article
      aria-labelledby={CALCULATOR_RESULT_HEADING_ID}
      className="scroll-mt-6 border-y border-gray-200 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      data-result-reveal="true"
      id={CALCULATOR_RESULT_REGION_ID}
      role="region"
      tabIndex={-1}
    >
      {children}
    </article>
  );
}

export function calculatorFocusTargetElementId(
  target: Exclude<CalculatorFocusTarget, null>,
  viewport: "desktop" | "mobile" = "desktop"
): string {
  switch (target.kind) {
    case "step-node":
      return `process-step-${target.alternativeId}-${target.stepId}${
        viewport === "mobile" ? "-mobile" : ""
      }`;
    case "step-label":
      return `process-step-label-${target.alternativeId}-${target.stepId}`;
    case "lane-add":
      return `process-lane-add-${target.alternativeId}`;
    case "migration-confirmation":
      return "migration-confirmation";
    case "decision-record":
      return CALCULATOR_RESULT_HEADING_ID;
  }
}

export interface CalculatorMigrationControl {
  result: Extract<LegacyMigrationResult, { status: "partial" }>;
  confirmed: boolean;
  onConfirm: (confirmed: boolean) => void;
}

export interface CalculatorWorkspaceViewProps {
  lang: Lang;
  state: CalculatorWorkspaceState;
  onStateChange: (state: CalculatorWorkspaceState) => void;
  onCopyBaseScenario: () => void | Promise<void>;
  migrationControl?: CalculatorMigrationControl;
  resultSlot?: ReactNode;
}

export function CalculatorWorkspaceView({
  lang,
  state,
  onStateChange,
  onCopyBaseScenario,
  migrationControl,
  resultSlot,
}: CalculatorWorkspaceViewProps) {
  const tx = calculatorV2T[lang];
  const [shareStatus, setShareStatus] = useState("");
  const validation = deriveCalculatorWorkspaceValidation(state);
  const { processMapIssues, generalIssues } = partitionCalculatorIssues(
    validation.issues
  );
  const submitDescriptionIds = [
    processMapIssues.length > 0 ? "process-map-status" : null,
    generalIssues.length > 0 ? "calculator-submit-status" : null,
  ]
    .filter((id): id is string => id !== null)
    .join(" ");

  useEffect(() => {
    if (!state.focusTarget) return;
    const viewport =
      state.focusTarget.kind === "step-node" &&
      typeof window.matchMedia === "function" &&
      !window.matchMedia("(min-width: 1024px)").matches
        ? "mobile"
        : "desktop";
    const targetId = calculatorFocusTargetElementId(
      state.focusTarget,
      viewport
    );
    const element = document.getElementById(targetId);
    if (state.focusTarget.kind === "decision-record") {
      revealResult(element);
    } else {
      element?.focus({ preventScroll: true });
    }
    onStateChange(
      calculatorWorkspaceReducer(state, {
        type: "set-focus-target",
        target: null,
      })
    );
  }, [onStateChange, state]);

  const dispatch = (action: CalculatorWorkspaceAction) => {
    onStateChange(calculatorWorkspaceReducer(state, action));
  };

  const replaceScenario = (scenarioId: ScenarioV2Id) => {
    dispatch({
      type: "replace-draft",
      draft: createScenarioDraft(scenarioId),
      urlOrigin: "empty",
      urlGate: undefined,
      migration: null,
    });
  };

  const replaceContextAxis = (
    field: EditableContextAxis,
    value: string
  ) => {
    const nextContext = { ...state.draft.context, [field]: value };
    const transition = applyLegalContextTransition(state, nextContext);
    onStateChange(
      transition.status === "accepted"
        ? transition.state
        : { ...transition.state, issues: transition.issues }
    );
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = submitCalculatorWorkspace(state);
    onStateChange(
      result.status === "submitted"
        ? result.state
        : { ...result.state, issues: result.issues }
    );
  };

  const copyBaseScenario = async () => {
    try {
      await onCopyBaseScenario();
      setShareStatus(tx.workspace.shareCopied);
    } catch {
      setShareStatus(tx.workspace.shareFailed);
    }
  };

  return (
    <div className="space-y-10">
      <header className="max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {tx.workspace.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600">
          {tx.workspace.introduction}
        </p>
        <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-gray-500">
          <span>
            {tx.workspace.modelLabel} {MODEL_V2_METADATA.modelVersion}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {tx.workspace.calibrationLabel}: {MODEL_V2_METADATA.calibrationId}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {tx.workspace.rulesetLabel}: {MODEL_V2_METADATA.legalRulesetId}
          </span>
        </p>
      </header>

      <form className="space-y-10" noValidate onSubmit={submit}>
        <section aria-labelledby="calculator-stage-context" className="space-y-6">
          <h2
            className="border-b border-gray-200 pb-3 text-xl font-bold text-gray-900"
            id="calculator-stage-context"
          >
            {tx.workspace.stageContext}
          </h2>
          {migrationControl ? (
            <LegacyMigrationConfirmation
              confirmed={migrationControl.confirmed}
              lang={lang}
              onConfirm={migrationControl.onConfirm}
              result={migrationControl.result}
            />
          ) : null}
          {state.urlOrigin !== "empty" && !validation.canSubmit ? (
            <button
              className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => replaceScenario(state.scenarioId)}
              type="button"
            >
              {tx.workspace.discardUrlState}
            </button>
          ) : null}
          <ContextAxes
            lang={lang}
            onContextChange={replaceContextAxis}
            onScenarioChange={replaceScenario}
            state={state}
          />
          <AlternativeDesignControls lang={lang} state={state} />
        </section>

        <section aria-labelledby="calculator-stage-workflows" className="space-y-6">
          <h2
            className="border-b border-gray-200 pb-3 text-xl font-bold text-gray-900"
            id="calculator-stage-workflows"
          >
            {tx.workspace.stageWorkflows}
          </h2>
          <ProcessMapEditor
            lang={lang}
            onStateChange={onStateChange}
            state={state}
          />
        </section>

        <section aria-labelledby="calculator-stage-economics" className="space-y-6">
          <h2
            className="border-b border-gray-200 pb-3 text-xl font-bold text-gray-900"
            id="calculator-stage-economics"
          >
            {tx.workspace.stageEconomics}
          </h2>
          <EconomicAssumptions lang={lang} onAction={dispatch} state={state} />

          <CalculatorValidationSummary issues={generalIssues} lang={lang} />

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl space-y-2">
                <button
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={copyBaseScenario}
                  type="button"
                >
                  <Clipboard aria-hidden="true" className="h-4 w-4" />
                  {tx.share.action}
                </button>
                <p className="text-xs leading-relaxed text-gray-600">
                  {tx.share.disclosure}
                </p>
                <p aria-live="polite" className="text-xs text-gray-600">
                  {shareStatus}
                </p>
              </div>

              <div className="sm:text-right">
                <button
                  aria-describedby={
                    validation.canSubmit || !submitDescriptionIds
                      ? undefined
                      : submitDescriptionIds
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
                  disabled={!validation.canSubmit}
                  type="submit"
                >
                  <FileCheck2 aria-hidden="true" className="h-4 w-4" />
                  {tx.workspace.calculate}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
                {!validation.canSubmit ? (
                  <p className="mt-2 max-w-sm text-xs leading-relaxed text-gray-600">
                    {tx.workspace.calculationBlocked}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </form>

      {state.record && resultSlot ? (
        <CalculatorResultBoundary>{resultSlot}</CalculatorResultBoundary>
      ) : (
        <p className="border-t border-gray-200 pt-6 text-sm leading-relaxed text-gray-600">
          {tx.workspace.preCalculation}
        </p>
      )}
    </div>
  );
}

export interface CalculatorWorkspaceProps {
  lang: Lang;
}

export interface CalculatorWorkspaceBootstrapStatusProps {
  lang: Lang;
  status: "pending" | "failed";
}

export type CalculatorWorkspaceBootstrapResolution =
  | {
      status: "ready";
      bootstrap: CalculatorUrlBootstrap;
      state: CalculatorWorkspaceState;
    }
  | { status: "failed" };

export async function resolveCalculatorWorkspaceBootstrap(
  bootstrapTask: Promise<CalculatorUrlBootstrap>,
  transform: (
    bootstrap: CalculatorUrlBootstrap
  ) => CalculatorWorkspaceState = createRenderableCalculatorWorkspaceState
): Promise<CalculatorWorkspaceBootstrapResolution> {
  try {
    const bootstrap = await bootstrapTask;
    return {
      status: "ready",
      bootstrap,
      state: transform(bootstrap),
    };
  } catch {
    return { status: "failed" };
  }
}

export function CalculatorWorkspaceBootstrapStatus({
  lang,
  status,
}: CalculatorWorkspaceBootstrapStatusProps) {
  const failed = status === "failed";
  return (
    <section
      aria-busy={failed ? undefined : true}
      aria-live="polite"
      className="border-y border-gray-200 py-10"
      data-calculator-bootstrap={status}
      role={failed ? "alert" : "status"}
    >
      <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
        {failed
          ? calculatorV2T[lang].workspace.urlBootstrapFailed
          : calculatorV2T[lang].workspace.loadingUrl}
      </p>
    </section>
  );
}

export default function CalculatorWorkspace({ lang }: CalculatorWorkspaceProps) {
  const [state, setState] = useState(() =>
    createCalculatorWorkspaceState(createScenarioDraft(DEFAULT_SCENARIO_V2_ID))
  );
  const [bootstrapStatus, setBootstrapStatus] = useState<
    "pending" | "ready" | "failed"
  >("pending");
  const [migrationResult, setMigrationResult] =
    useState<CalculatorMigrationControl["result"] | null>(null);
  const [migrationConfirmed, setMigrationConfirmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void resolveCalculatorWorkspaceBootstrap(
      bootstrapCalculatorUrl(new URLSearchParams(window.location.search))
    )
      .then((resolution) => {
        if (cancelled) return;
        if (resolution.status === "failed") {
          setBootstrapStatus("failed");
          return;
        }
        const { bootstrap } = resolution;
        setState(resolution.state);
        setMigrationResult(
          bootstrap.origin === "legacy" &&
            bootstrap.result.status === "partial"
            ? bootstrap.result
            : null
        );
        setMigrationConfirmed(false);
        setBootstrapStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setBootstrapStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (bootstrapStatus !== "ready") {
    return (
      <CalculatorWorkspaceBootstrapStatus
        lang={lang}
        status={bootstrapStatus}
      />
    );
  }

  const copyBaseScenario = async () => {
    const params = buildBaseScenarioShareParams(state.draft);
    const path = lang === "pl" ? "/calculator" : "/en/calculator";
    const url = new URL(path, window.location.origin);
    url.search = params.toString();
    await navigator.clipboard.writeText(url.toString());
  };

  const updateState = (nextState: CalculatorWorkspaceState) => {
    if (nextState.urlOrigin !== "legacy") {
      setMigrationResult(null);
      setMigrationConfirmed(false);
    }
    setState(nextState);
  };

  return (
    <CalculatorWorkspaceView
      lang={lang}
      migrationControl={
        migrationResult
          ? {
              result: migrationResult,
              confirmed: migrationConfirmed,
              onConfirm: (confirmed) => {
                const transition = applyLegacyMigrationControlTransition(
                  state,
                  migrationResult,
                  confirmed
                );
                setState(transition.state);
                setMigrationResult(transition.migrationResult);
                setMigrationConfirmed(
                  transition.migrationResult ? confirmed : false
                );
              },
            }
          : undefined
      }
      onCopyBaseScenario={copyBaseScenario}
      onStateChange={updateState}
      resultSlot={
        state.record ? (
          <DecisionRecord
            actions={<DecisionRecordActions lang={lang} record={state.record} />}
            lang={lang}
            record={state.record}
          />
        ) : undefined
      }
      state={state}
    />
  );
}
