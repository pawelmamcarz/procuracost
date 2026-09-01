"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clipboard, FileCheck2 } from "lucide-react";

import CalculationResultBar from "@/components/decision-record/CalculationResultBar";
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
import { CalculatorJourneyNav } from "./CalculatorJourneyNav";
import { CalculatorValidationSummary } from "./CalculatorValidationSummary";
import { ComparisonNameFields } from "./ComparisonNameFields";
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
import {
  LocalDraftControls,
  type LocalDraftCandidateStatus,
} from "./LocalDraftControls";
import { ProcessMapEditor } from "./ProcessMapEditor";
import { buildBaseScenarioShareParams } from "./share";
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
import {
  calculatorStageFromHash,
  calculatorStageHash,
  nextCalculatorStage,
  previousCalculatorStage,
  resolveCalculatorStageLocation,
  resolveCalculatorStageRequest,
} from "./calculator-journey";
import {
  LOCAL_CALCULATOR_DRAFT_KEY,
  createLocalCalculatorDraft,
  parseLocalCalculatorDraft,
  shouldOfferLocalDraft,
  type CalculatorStage,
  type ComparisonDisplayNames,
  type LocalCalculatorDraftV1,
} from "./local-draft";

export const CALCULATOR_RESULT_HEADING_ID = "decision-record-heading";
export const CALCULATOR_RESULT_REGION_ID = "decision-record";

function syncCalculatorStageFromLocation(
  hasRecord: boolean,
  setStage: (stage: CalculatorStage) => void,
) {
  const resolution = resolveCalculatorStageLocation(
    window.location.hash,
    hasRecord,
  );
  setStage(resolution.stage);
  if (!resolution.shouldReplace) return;
  const nextUrl = `${window.location.pathname}${window.location.search}${resolution.normalizedHash}`;
  window.history.replaceState(window.history.state, "", nextUrl);
}

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
  activeStage?: CalculatorStage;
  displayNames?: ComparisonDisplayNames;
  draftControls?: ReactNode;
  migrationControl?: CalculatorMigrationControl;
  onDisplayNamesChange?: (displayNames: ComparisonDisplayNames) => void;
  onStageChange?: (stage: CalculatorStage, hasRecord?: boolean) => void;
  resultSlot?: ReactNode;
}

export function CalculatorWorkspaceView({
  activeStage = "case",
  displayNames,
  draftControls,
  lang,
  migrationControl,
  onCopyBaseScenario,
  onDisplayNamesChange,
  onStageChange,
  onStateChange,
  resultSlot,
  state,
}: CalculatorWorkspaceViewProps) {
  const tx = calculatorV2T[lang];
  const names = displayNames ?? tx.journey.defaultNames;
  const [shareStatus, setShareStatus] = useState("");
  const validation = deriveCalculatorWorkspaceValidation(state);
  const submitDescriptionIds =
    validation.issues.length > 0 ? "calculator-submit-status" : "";
  const stageOrder: CalculatorStage[] = [
    "case",
    "workflows",
    "costs",
    "record",
  ];
  const stageIndex = stageOrder.indexOf(activeStage);
  const stageCopy = tx.journey.stages[activeStage];

  useEffect(() => {
    document.getElementById(`calculator-stage-heading-${activeStage}`)?.focus({
      preventScroll: true,
    });
  }, [activeStage]);

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

  const runCalculation = () => {
    const result = submitCalculatorWorkspace(state);
    onStateChange(
      result.status === "submitted"
        ? result.state
        : { ...result.state, issues: result.issues }
    );
    if (result.status === "submitted") onStageChange?.("record", true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCalculation();
  };

  const copyBaseScenario = async () => {
    try {
      await onCopyBaseScenario();
      setShareStatus(tx.workspace.shareCopied);
    } catch {
      setShareStatus(tx.workspace.shareFailed);
    }
  };

  const setStage = (stage: CalculatorStage) => onStageChange?.(stage);
  const openRecord = () => {
    onStageChange?.("record", true);
    onStateChange(
      calculatorWorkspaceReducer(state, {
        type: "set-focus-target",
        target: { kind: "decision-record" },
      })
    );
  };
  const numberFormat = new Intl.NumberFormat(
    lang === "pl" ? "pl-PL" : "en-GB",
    { maximumFractionDigits: 2 }
  );
  const assumptions = state.draft.economicAssumptions;

  return (
    <div className="space-y-8">
      <header className="border-b border-gray-200 pb-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          {tx.journey.eyebrow}
        </p>
        <div className="mt-4 border-l-4 border-blue-700 pl-5 sm:pl-7">
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {tx.journey.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
            {tx.journey.introduction}
          </p>
        </div>
        <details className="mt-6 max-w-3xl border-y border-gray-200 py-3">
          <summary className="cursor-pointer text-xs font-semibold text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
            {tx.workspace.modelLabel} {MODEL_V2_METADATA.modelVersion}
          </summary>
          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-gray-500">
            <span>
              {tx.workspace.calibrationLabel}: {MODEL_V2_METADATA.calibrationId}
            </span>
            <span>
              {tx.workspace.rulesetLabel}: {MODEL_V2_METADATA.legalRulesetId}
            </span>
          </p>
        </details>
      </header>

      <CalculatorJourneyNav
        activeStage={activeStage}
        hasRecord={state.record !== null}
        lang={lang}
        onStageChange={setStage}
      />

      {draftControls}

      {activeStage !== "record" ? (
        <form noValidate onSubmit={submit}>
          <section
            aria-labelledby={`calculator-stage-heading-${activeStage}`}
            className="space-y-7"
            data-stage-panel={activeStage}
          >
            <div className="border-b border-gray-200 pb-4">
              <p className="font-mono text-xs text-blue-700">
                {tx.journey.stepOf(stageIndex + 1, stageOrder.length)}
              </p>
              <h2
                className="mt-2 text-2xl font-bold text-gray-900"
                id={`calculator-stage-heading-${activeStage}`}
                tabIndex={-1}
              >
                {stageCopy.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {stageCopy.description}
              </p>
            </div>

            {activeStage === "case" ? (
              <>
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
                <details className="border-y border-gray-200 py-4">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                    {tx.workspace.baseDesignProvenance}
                  </summary>
                  <div className="mt-5">
                    <AlternativeDesignControls lang={lang} state={state} />
                  </div>
                </details>
                <div className="border-l-2 border-blue-500 pl-4 text-sm text-gray-600">
                  <p>{tx.journey.caseSupport}</p>
                  <Link className="mt-2 inline-flex min-h-11 items-center font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4" href={lang === "en" ? "/en/optimizer" : "/optimizer"}>
                    {tx.journey.suitabilityAction}
                  </Link>
                </div>
              </>
            ) : null}

            {activeStage === "workflows" ? (
              <>
                <ComparisonNameFields
                  displayNames={names}
                  lang={lang}
                  onChange={(nextNames) => onDisplayNamesChange?.(nextNames)}
                />
                <ProcessMapEditor
                  lang={lang}
                  onStateChange={onStateChange}
                  state={state}
                />
                <div className="border-l-2 border-blue-500 pl-4 text-sm text-gray-600">
                  <p>{tx.journey.workflowSupport}</p>
                  <Link className="mt-2 inline-flex min-h-11 items-center font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4" href={lang === "en" ? "/en/assessment" : "/assessment"}>
                    {tx.journey.assessmentAction}
                  </Link>
                </div>
              </>
            ) : null}

            {activeStage === "costs" ? (
              <>
                <dl className="grid gap-5 border-y border-gray-200 py-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-600">
                      {tx.economics.contractValue}
                    </dt>
                    <dd className="mt-2 font-mono text-2xl font-bold tabular-nums text-blue-700">
                      {numberFormat.format(assumptions.contractValue.central)} {tx.economics.currencyUnit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-600">
                      {tx.economics.dailyCostOfDelay}
                    </dt>
                    <dd className="mt-2 font-mono text-2xl font-bold tabular-nums text-blue-700">
                      {numberFormat.format(assumptions.dailyCostOfInaction.central)} {tx.economics.currencyUnit}
                    </dd>
                  </div>
                </dl>
                <details className="border-y border-gray-200 py-4" data-advanced-economics>
                  <summary className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                    <span className="block text-sm font-semibold text-gray-900">
                      {tx.journey.advancedEconomics}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-600">
                      {tx.journey.advancedEconomicsDescription}
                    </span>
                  </summary>
                  <div className="mt-6">
                    <EconomicAssumptions lang={lang} onAction={dispatch} state={state} />
                  </div>
                </details>

                <CalculatorValidationSummary issues={validation.issues} lang={lang} />

                <div className="grid gap-6 border-t border-gray-200 pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
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
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
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
              </>
            ) : null}

            {activeStage !== "costs" ? (
              <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-6">
                {activeStage !== "case" ? (
                  <button className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gray-700" onClick={() => setStage(previousCalculatorStage(activeStage))} type="button">
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                    {tx.journey.back}
                  </button>
                ) : (
                  <span />
                )}
                <button className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={() => setStage(nextCalculatorStage(activeStage, state.record !== null))} type="button">
                  {tx.journey.next}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gray-700" onClick={() => setStage("workflows")} type="button">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                {tx.journey.back}
              </button>
            )}
          </section>
        </form>
      ) : (
        <section
          aria-labelledby="calculator-stage-heading-record"
          className="space-y-7"
          data-stage-panel="record"
        >
          <div className="border-b border-gray-200 pb-4">
            <p className="font-mono text-xs text-blue-700">
              {tx.journey.stepOf(4, 4)}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900" id="calculator-stage-heading-record" tabIndex={-1}>
              {tx.journey.stages.record.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {tx.journey.stages.record.description}
            </p>
          </div>
          {state.record && resultSlot ? (
            <CalculatorResultBoundary>{resultSlot}</CalculatorResultBoundary>
          ) : (
            <p className="text-sm leading-6 text-gray-600">
              {tx.workspace.preCalculation}
            </p>
          )}
          {state.record ? (
            <aside className="grid gap-5 border-l-4 border-blue-700 bg-blue-50 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center" data-post-result-readiness>
              <div>
                <h3 className="font-bold text-gray-900">{tx.journey.readinessTitle}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{tx.journey.readinessBody}</p>
              </div>
              <Link className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4" href={lang === "en" ? "/en/readiness" : "/readiness"} rel="noreferrer" target="_blank">
                {tx.journey.readinessAction}
              </Link>
            </aside>
          ) : null}
          <button className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gray-700" onClick={() => setStage("costs")} type="button">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {tx.journey.back}
          </button>
        </section>
      )}

      {state.lastRecord ? (
        <CalculationResultBar
          lang={lang}
          onOpenRecord={openRecord}
          onRecalculate={runCalculation}
          record={state.lastRecord}
          stale={state.record === null}
        />
      ) : null}
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
  const [activeStage, setActiveStage] = useState<CalculatorStage>("case");
  const [displayNames, setDisplayNames] = useState<ComparisonDisplayNames>(
    () => ({ ...calculatorV2T[lang].journey.defaultNames })
  );
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);
  const [draftCandidate, setDraftCandidate] =
    useState<LocalCalculatorDraftV1 | null>(null);
  const [draftCandidateStatus, setDraftCandidateStatus] =
    useState<LocalDraftCandidateStatus>("none");
  const [draftSaveFailed, setDraftSaveFailed] = useState(false);
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
        syncCalculatorStageFromLocation(
          resolution.state.record !== null,
          setActiveStage,
        );
        setMigrationResult(
          bootstrap.origin === "legacy" &&
            bootstrap.result.status === "partial"
            ? bootstrap.result
            : null
        );
        setMigrationConfirmed(false);
        if (shouldOfferLocalDraft(resolution.state.urlOrigin)) {
          try {
            const raw = window.localStorage.getItem(
              LOCAL_CALCULATOR_DRAFT_KEY
            );
            if (raw) {
              const parsed = parseLocalCalculatorDraft(raw);
              setDraftCandidateStatus(parsed.status);
              setDraftCandidate(
                parsed.status === "ready" ? parsed.draft : null
              );
            }
          } catch {
            setDraftCandidateStatus("none");
          }
        }
        setBootstrapStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setBootstrapStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (bootstrapStatus !== "ready" || !persistenceEnabled) return;
    let cancelled = false;
    let saveFailed = false;
    try {
      const draft = createLocalCalculatorDraft(
        state,
        displayNames,
        activeStage,
        new Date().toISOString()
      );
      window.localStorage.setItem(
        LOCAL_CALCULATOR_DRAFT_KEY,
        JSON.stringify(draft)
      );
    } catch {
      saveFailed = true;
    }
    queueMicrotask(() => {
      if (!cancelled) setDraftSaveFailed(saveFailed);
    });
    return () => {
      cancelled = true;
    };
  }, [activeStage, bootstrapStatus, displayNames, persistenceEnabled, state]);

  useEffect(() => {
    if (bootstrapStatus !== "ready") return;
    const syncStageFromHash = () => {
      syncCalculatorStageFromLocation(state.record !== null, setActiveStage);
    };
    window.addEventListener("hashchange", syncStageFromHash);
    return () => {
      window.removeEventListener("hashchange", syncStageFromHash);
    };
  }, [bootstrapStatus, state.record]);

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

  const changeStage = (
    stage: CalculatorStage,
    hasRecord = state.record !== null,
  ) => {
    const safeStage = resolveCalculatorStageRequest(stage, hasRecord);
    setActiveStage(safeStage);
    const nextHash = calculatorStageHash(safeStage);
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  };

  const discardLocalDraft = () => {
    try {
      window.localStorage.removeItem(LOCAL_CALCULATOR_DRAFT_KEY);
    } catch {
      setDraftSaveFailed(true);
    }
    setDraftCandidate(null);
    setDraftCandidateStatus("none");
    setPersistenceEnabled(false);
  };

  const resumeLocalDraft = () => {
    if (!draftCandidate) return;
    const resumedState = createCalculatorWorkspaceState(draftCandidate.draft);
    setState(resumedState);
    setDisplayNames({ ...draftCandidate.displayNames });
    setDraftCandidate(null);
    setDraftCandidateStatus("none");
    setPersistenceEnabled(true);
    changeStage(
      calculatorStageFromHash(
        calculatorStageHash(draftCandidate.activeStage),
        false
      )
    );
  };

  const setLocalPersistence = (enabled: boolean) => {
    setPersistenceEnabled(enabled);
    setDraftSaveFailed(false);
    if (!enabled) discardLocalDraft();
  };

  const updateState = (nextState: CalculatorWorkspaceState) => {
    if (nextState.urlOrigin !== "legacy") {
      setMigrationResult(null);
      setMigrationConfirmed(false);
    }
    if (activeStage === "record" && nextState.record === null) {
      changeStage("costs");
    }
    setState(nextState);
  };

  return (
    <CalculatorWorkspaceView
      activeStage={activeStage}
      displayNames={displayNames}
      draftControls={
        <LocalDraftControls
          candidateStatus={draftCandidateStatus}
          enabled={persistenceEnabled}
          lang={lang}
          onDiscard={discardLocalDraft}
          onEnabledChange={setLocalPersistence}
          onResume={resumeLocalDraft}
          saveFailed={draftSaveFailed}
        />
      }
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
      onDisplayNamesChange={setDisplayNames}
      onStageChange={changeStage}
      onStateChange={updateState}
      resultSlot={
        state.record ? (
          <DecisionRecord
            actions={
              <DecisionRecordActions
                displayNames={displayNames}
                lang={lang}
                record={state.record}
              />
            }
            displayNames={displayNames}
            lang={lang}
            record={state.record}
          />
        ) : undefined
      }
      state={state}
    />
  );
}
