import {
  V2_URL_KEYS,
  createScenarioDraft,
  createScenarioDraftFromLegacyMigration,
  decodeV2CalculatorParams,
  migrateLegacyCalculatorParams,
  type CalculationInputGateV2,
  type LegacyMigrationDraftResult,
  type LegacyMigrationResult,
  type ScenarioDraft,
  type ScenarioV2Id,
  type V2CalculatorUrlDecodeResult,
} from "@/lib/model-v2";

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

const RECOGNISED_CALCULATOR_KEYS = new Set<string>([
  ...V2_URL_KEYS,
  ...LEGACY_CALCULATOR_KEYS,
]);

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

function hasRecognisedCalculatorKey(params: URLSearchParams): boolean {
  return [...params.keys()].some((key) => RECOGNISED_CALCULATOR_KEYS.has(key));
}

export function adaptLegacyCalculatorBootstrap(
  result: LegacyMigrationResult,
  confirmed = false
): LegacyMigrationDraftResult {
  return createScenarioDraftFromLegacyMigration(result, confirmed);
}

export function bootstrapCalculatorUrl(
  params: URLSearchParams,
  defaultScenarioId: ScenarioV2Id = DEFAULT_SCENARIO_V2_ID
): CalculatorUrlBootstrap {
  if (!hasRecognisedCalculatorKey(params)) {
    return {
      origin: "empty",
      draft: createScenarioDraft(defaultScenarioId),
      gate: undefined,
    };
  }

  if (params.has("sv")) {
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

  const result = migrateLegacyCalculatorParams(params);
  const adaptation = adaptLegacyCalculatorBootstrap(result);
  return {
    origin: "legacy",
    result,
    adaptation,
    draft: adaptation.status === "ready" ? adaptation.draft : null,
    gate: adaptation.status === "ready" ? adaptation.gate : null,
  };
}
