import { suitabilityT, type Lang } from "./i18n";
import {
  EXECUTION_CHANNEL_IDS,
  PROCEDURE_FAMILY_IDS,
  PURCHASE_ARCHETYPE_IDS,
} from "./model-v2/domain";

type SuitabilityCopy = (typeof suitabilityT)[Lang];

function suffixAfter(key: string, prefix: string): string | null {
  return key.startsWith(prefix) ? key.slice(prefix.length) : null;
}

function member<const T extends readonly string[]>(
  values: T,
  value: string | null
): value is T[number] {
  return value !== null && values.includes(value as T[number]);
}

/** Resolve only keys emitted by the native suitability model. Unknown keys stay hidden. */
export function resolveSuitabilityCopyKey(
  copy: SuitabilityCopy,
  key: string
): string | null {
  if (Object.prototype.hasOwnProperty.call(copy.keyText, key)) {
    return copy.keyText[key] ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(copy.waitLabels, key)) {
    return copy.waitLabels[key] ?? null;
  }

  const procedure = suffixAfter(key, "suitability.procedures.");
  if (member(PROCEDURE_FAMILY_IDS, procedure)) {
    return copy.procedures[procedure];
  }

  if (key.startsWith("suitability.criteria.legal_boundary.")) {
    return copy.criterionDetail.legal_boundary;
  }

  const requirement = suffixAfter(
    key,
    "suitability.criteria.requirement_definition."
  );
  if (member(PURCHASE_ARCHETYPE_IDS, requirement)) {
    return copy.criterionDetail.requirement_definition[requirement];
  }

  const competition = suffixAfter(
    key,
    "suitability.criteria.competition_access."
  );
  if (member(PROCEDURE_FAMILY_IDS, competition)) {
    return copy.criterionDetail.competition_access[competition];
  }

  const channel = suffixAfter(
    key,
    "suitability.criteria.execution_channel."
  );
  if (member(EXECUTION_CHANNEL_IDS, channel)) {
    return copy.criterionDetail.execution_channel[channel];
  }

  const learning = suffixAfter(
    key,
    "suitability.criteria.workflow_learning."
  );
  if (member(PURCHASE_ARCHETYPE_IDS, learning)) {
    return learning === "incomplete_requirement" || learning === "complex_service"
      ? copy.criterionDetail.workflow_learning.verify
      : copy.criterionDetail.workflow_learning.notAssessed;
  }

  if (key.startsWith("suitability.criteria.system_support.")) {
    return copy.criterionDetail.system_support;
  }

  if (key.startsWith("suitability.conditions.boundary.")) {
    return copy.conditionText.boundary;
  }
  if (key.startsWith("suitability.conditions.archetype.")) {
    return copy.conditionText.archetype;
  }
  const conditionChannel = suffixAfter(
    key,
    "suitability.conditions.channel."
  );
  if (member(EXECUTION_CHANNEL_IDS, conditionChannel)) {
    return copy.conditionText.channel[conditionChannel];
  }
  if (key.startsWith("suitability.conditions.support.")) {
    return copy.conditionText.support;
  }

  return null;
}
