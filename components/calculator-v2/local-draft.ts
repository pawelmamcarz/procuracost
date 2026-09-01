import {
  MODEL_V2_METADATA,
  SCENARIO_V2_IDS,
  type ScenarioDraft,
  type ScenarioV2Id,
} from "@/lib/model-v2";

import {
  createCalculatorWorkspaceState,
  type CalculatorWorkspaceState,
} from "./editor-state";
import type { CalculatorUrlOrigin } from "./url-bootstrap";
import { deriveCalculatorWorkspaceValidation } from "./workspace-validation";

export const LOCAL_CALCULATOR_DRAFT_KEY =
  "procuracost:calculator-draft:v1";

export const CALCULATOR_STAGES = [
  "case",
  "workflows",
  "costs",
  "record",
] as const;

export type CalculatorStage = (typeof CALCULATOR_STAGES)[number];

export interface ComparisonDisplayNames {
  formalSequential: string;
  adaptiveCompliant: string;
}

export interface LocalCalculatorDraftV1 {
  storageVersion: 1;
  metadata: typeof MODEL_V2_METADATA;
  savedAt: string;
  scenarioId: ScenarioV2Id;
  draft: ScenarioDraft;
  displayNames: ComparisonDisplayNames;
  activeStage: CalculatorStage;
}

export type LocalCalculatorDraftParseResult =
  | { status: "ready"; draft: LocalCalculatorDraftV1 }
  | { status: "invalid" | "incompatible" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCalculatorStage(value: unknown): value is CalculatorStage {
  return (
    typeof value === "string" &&
    CALCULATOR_STAGES.includes(value as CalculatorStage)
  );
}

function isScenarioId(value: unknown): value is ScenarioV2Id {
  return (
    typeof value === "string" &&
    SCENARIO_V2_IDS.includes(value as ScenarioV2Id)
  );
}

function hasCompatibleMetadata(value: Record<string, unknown>): boolean {
  return (
    value.schemaVersion === MODEL_V2_METADATA.schemaVersion &&
    value.modelVersion === MODEL_V2_METADATA.modelVersion &&
    value.calibrationId === MODEL_V2_METADATA.calibrationId &&
    value.legalRulesetId === MODEL_V2_METADATA.legalRulesetId
  );
}

function hasDraftShape(value: unknown, scenarioId: ScenarioV2Id): boolean {
  if (!isRecord(value)) return false;
  return (
    value.derivedFromScenarioId === scenarioId &&
    isRecord(value.context) &&
    isRecord(value.alternatives) &&
    isRecord(value.economicAssumptions) &&
    isRecord(value.roleHourlyRates)
  );
}

function isRenderableDraft(value: unknown, scenarioId: ScenarioV2Id): boolean {
  if (!hasDraftShape(value, scenarioId)) return false;
  try {
    deriveCalculatorWorkspaceValidation(
      createCalculatorWorkspaceState(value as ScenarioDraft),
    );
    return true;
  } catch {
    return false;
  }
}

export function createLocalCalculatorDraft(
  state: CalculatorWorkspaceState,
  displayNames: ComparisonDisplayNames,
  activeStage: CalculatorStage,
  savedAt: string
): LocalCalculatorDraftV1 {
  return {
    storageVersion: 1,
    metadata: { ...MODEL_V2_METADATA },
    savedAt,
    scenarioId: state.scenarioId,
    draft: structuredClone(state.draft),
    displayNames: { ...displayNames },
    activeStage,
  };
}

export function parseLocalCalculatorDraft(
  raw: string
): LocalCalculatorDraftParseResult {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { status: "invalid" };
  }
  if (!isRecord(value) || value.storageVersion !== 1) {
    return { status: "invalid" };
  }
  if (!isRecord(value.metadata)) return { status: "invalid" };
  if (!hasCompatibleMetadata(value.metadata)) {
    return { status: "incompatible" };
  }
  if (
    typeof value.savedAt !== "string" ||
    !isScenarioId(value.scenarioId) ||
    !isCalculatorStage(value.activeStage) ||
    !isRenderableDraft(value.draft, value.scenarioId) ||
    !isRecord(value.displayNames) ||
    typeof value.displayNames.formalSequential !== "string" ||
    value.displayNames.formalSequential.length > 80 ||
    typeof value.displayNames.adaptiveCompliant !== "string" ||
    value.displayNames.adaptiveCompliant.length > 80
  ) {
    return { status: "invalid" };
  }
  return {
    status: "ready",
    draft: structuredClone(value) as unknown as LocalCalculatorDraftV1,
  };
}

export function shouldOfferLocalDraft(origin: CalculatorUrlOrigin): boolean {
  return origin === "empty";
}
