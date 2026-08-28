import { calculatorV2T, type Lang } from "@/lib/i18n";
import {
  encodeV2CalculatorState,
  stateForScenarioV2,
  type ScenarioDraft,
} from "@/lib/model-v2";

export function buildBaseScenarioShareParams(
  draft: ScenarioDraft
): URLSearchParams {
  return encodeV2CalculatorState(
    stateForScenarioV2(draft.derivedFromScenarioId)
  );
}

export function baseScenarioShareCopy(lang: Lang) {
  return calculatorV2T[lang].share;
}
