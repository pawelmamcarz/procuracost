import {
  V2_URL_KEYS,
  createScenarioDraft,
  decodeV2CalculatorParams,
  type ScenarioDraft,
  type ScenarioV2Id,
  type V2CalculatorUrlDecodeResult,
} from "@/lib/model-v2";
import { loadLegacyAdapter } from "@/lib/load-legacy-adapter";
import type {
  CalculationInputGateV2,
  LegacyMigrationDraftResult,
  LegacyMigrationResult,
} from "@/lib/model-v2/legacy-adapter";

export const DEFAULT_SCENARIO_V2_ID =
  "fleet_tco_reframing" as const satisfies ScenarioV2Id;

export const LEGACY_CALCULATOR_KEYS = [
  "sid",
  "pt",
  "tl",
  "cv",
  "tco",
  "dur",
  "dci",
  "rc",
  "bae",
  "dr",
  "st",
  "pp",
  "sh",
] as const;

export type CalculatorUrlOrigin = "empty" | "v2" | "legacy";

export type CalculatorUrlBootstrap =
  | {
      origin: "empty";
      draft: ScenarioDraft;
      gate: undefined;
    }
  | {
      origin: "v2";
      result: V2CalculatorUrlDecodeResult;
      draft: ScenarioDraft | null;
      gate: Extract<CalculationInputGateV2, { kind: "v2_url" }>;
    }
  | {
      origin: "legacy";
      result: LegacyMigrationResult;
      adaptation: LegacyMigrationDraftResult;
      draft: ScenarioDraft | null;
      gate:
        | Extract<CalculationInputGateV2, { kind: "legacy_migration" }>
        | null;
    };

export function classifyCalculatorUrl(
  params: URLSearchParams
): CalculatorUrlOrigin {
  if (params.has("sv")) return "v2";
  if (LEGACY_CALCULATOR_KEYS.some((key) => params.has(key))) {
    return "legacy";
  }
  if (V2_URL_KEYS.some((key) => params.has(key))) return "legacy";
  return "empty";
}

export async function adaptLegacyCalculatorBootstrap(
  result: LegacyMigrationResult,
  confirmed = false
): Promise<LegacyMigrationDraftResult> {
  const { createScenarioDraftFromLegacyMigration } =
    await loadLegacyAdapter();
  return createScenarioDraftFromLegacyMigration(result, confirmed);
}

export async function bootstrapCalculatorUrl(
  params: URLSearchParams,
  defaultScenarioId: ScenarioV2Id = DEFAULT_SCENARIO_V2_ID
): Promise<CalculatorUrlBootstrap> {
  const origin = classifyCalculatorUrl(params);
  if (origin === "empty") {
    return {
      origin: "empty",
      draft: createScenarioDraft(defaultScenarioId),
      gate: undefined,
    };
  }

  if (origin === "v2") {
    const result = decodeV2CalculatorParams(params);
    return {
      origin: "v2",
      result,
      draft:
        result.status === "valid"
          ? createScenarioDraft(result.state.scenarioId)
          : null,
      gate: { kind: "v2_url", result },
    };
  }

  const { migrateLegacyCalculatorParams } = await loadLegacyAdapter();
  const result = migrateLegacyCalculatorParams(params);
  const adaptation = await adaptLegacyCalculatorBootstrap(result);
  return {
    origin: "legacy",
    result,
    adaptation,
    draft: adaptation.status === "ready" ? adaptation.draft : null,
    gate: adaptation.status === "ready" ? adaptation.gate : null,
  };
}
