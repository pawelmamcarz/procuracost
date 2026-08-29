import { deepFreeze } from "./deep-freeze";
import {
  MODEL_V2_METADATA,
  isBuyerRegime,
  isCommunicationMethod,
  isExecutionChannelId,
  isLegalGovernanceBoundaryId,
  isProcurementObject,
  isPurchaseArchetypeId,
  isSystemSupportId,
  type BuyerRegime,
  type CommunicationMethod,
  type ExecutionChannelId,
  type LegalGovernanceBoundaryId,
  type ProcurementObject,
  type ProcedureFamilyId,
  type PurchaseArchetypeId,
  type SystemSupportId,
} from "./domain";
import {
  assertInitiatedOnIsCovered,
  procedureCandidatesForBoundary,
  resolveLegalWaits,
  type ResolvedLegalWait,
} from "./legal";

export interface SuitabilityProfileV2 {
  schemaVersion: typeof MODEL_V2_METADATA.schemaVersion;
  modelVersion: typeof MODEL_V2_METADATA.modelVersion;
  calibrationId: typeof MODEL_V2_METADATA.calibrationId;
  legalRulesetId: typeof MODEL_V2_METADATA.legalRulesetId;
  boundaryId: LegalGovernanceBoundaryId;
  initiatedOn: string;
  buyerRegime?: BuyerRegime;
  procurementObject?: ProcurementObject;
  communicationMethod?: CommunicationMethod;
  purchaseArchetypeId: PurchaseArchetypeId;
  executionChannelId: ExecutionChannelId;
  systemSupportId: SystemSupportId;
}

/** External form, URL and JSON payloads all enter through the same runtime checks. */
export type SuitabilityComparisonInput = unknown;

export const SUITABILITY_CRITERION_IDS = deepFreeze([
  "legal_boundary",
  "requirement_definition",
  "competition_access",
  "execution_channel",
  "workflow_learning",
  "system_support",
] as const);

export type SuitabilityCriterionId =
  (typeof SUITABILITY_CRITERION_IDS)[number];
export type SuitabilityCriterionState =
  | "condition_present"
  | "condition_to_verify"
  | "not_assessed";

export interface SuitabilityCriterion {
  id: SuitabilityCriterionId;
  state: SuitabilityCriterionState;
  detailKey: string;
}

export interface SuitabilityCandidate {
  procedureFamilyId: ProcedureFamilyId;
  labelKey: string;
  criteria: SuitabilityCriterion[];
  conditionKeys: string[];
  limitationKeys: string[];
  legalWaits: ResolvedLegalWait[];
}

export type SuitabilityWithheldProcedureKey =
  | "suitability.withheld.competitive_dialogue"
  | "suitability.withheld.negotiation_with_notice"
  | "suitability.withheld.innovation_partnership"
  | "suitability.withheld.negotiation_without_notice"
  | "suitability.withheld.direct_award";

interface SuitabilityResultBase {
  metadata: typeof MODEL_V2_METADATA;
  withheldProcedureKeys: SuitabilityWithheldProcedureKey[];
  methodLimitationKeys: string[];
}

export interface SuitabilityReadyResult extends SuitabilityResultBase {
  status: "ready";
  profile: SuitabilityProfileV2;
  candidates: SuitabilityCandidate[];
}

export interface SuitabilityOutOfScopeResult extends SuitabilityResultBase {
  status: "out_of_scope";
  candidates: [];
  reasonKey: string;
}

export type SuitabilityComparisonResult =
  | SuitabilityReadyResult
  | SuitabilityOutOfScopeResult;

const METHOD_LIMITATION_KEYS = [
  "suitability.limitations.equalStatus",
  "suitability.limitations.notLegalAdvice",
  "suitability.limitations.noReadinessInference",
] as const;

const EU_WITHHELD: SuitabilityWithheldProcedureKey[] = [
  "suitability.withheld.competitive_dialogue",
  "suitability.withheld.negotiation_with_notice",
  "suitability.withheld.innovation_partnership",
  "suitability.withheld.direct_award",
];

const NATIONAL_WITHHELD: SuitabilityWithheldProcedureKey[] = [
  "suitability.withheld.innovation_partnership",
  "suitability.withheld.negotiation_without_notice",
  "suitability.withheld.direct_award",
];

const COMPETITIVE_FAMILIES = new Set<ProcedureFamilyId>([
  "private_competitive",
  "public_internal_competitive",
  "pzp_basic",
  "pzp_open",
  "pzp_restricted",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function metadataClone(): typeof MODEL_V2_METADATA {
  return { ...MODEL_V2_METADATA };
}

function outOfScope(reasonKey: string): SuitabilityOutOfScopeResult {
  return deepFreeze({
    status: "out_of_scope",
    metadata: metadataClone(),
    candidates: [],
    withheldProcedureKeys: [],
    methodLimitationKeys: [...METHOD_LIMITATION_KEYS],
    reasonKey,
  });
}

function competitionState(
  procedureFamilyId: ProcedureFamilyId
): SuitabilityCriterionState {
  if (COMPETITIVE_FAMILIES.has(procedureFamilyId)) return "condition_present";
  if (
    procedureFamilyId === "private_negotiated" ||
    procedureFamilyId === "framework_calloff"
  ) {
    return "condition_to_verify";
  }
  return "not_assessed";
}

function workflowLearningState(
  purchaseArchetypeId: PurchaseArchetypeId
): SuitabilityCriterionState {
  return purchaseArchetypeId === "incomplete_requirement" ||
    purchaseArchetypeId === "complex_service"
    ? "condition_to_verify"
    : "not_assessed";
}

function buildCriteria(
  profile: SuitabilityProfileV2,
  procedureFamilyId: ProcedureFamilyId
): SuitabilityCriterion[] {
  return [
    {
      id: "legal_boundary",
      state: "condition_to_verify",
      detailKey: `suitability.criteria.legal_boundary.${profile.boundaryId}`,
    },
    {
      id: "requirement_definition",
      state: "condition_present",
      detailKey: `suitability.criteria.requirement_definition.${profile.purchaseArchetypeId}`,
    },
    {
      id: "competition_access",
      state: competitionState(procedureFamilyId),
      detailKey: `suitability.criteria.competition_access.${procedureFamilyId}`,
    },
    {
      id: "execution_channel",
      state: "condition_present",
      detailKey: `suitability.criteria.execution_channel.${profile.executionChannelId}`,
    },
    {
      id: "workflow_learning",
      state: workflowLearningState(profile.purchaseArchetypeId),
      detailKey: `suitability.criteria.workflow_learning.${profile.purchaseArchetypeId}`,
    },
    {
      id: "system_support",
      state: "condition_to_verify",
      detailKey: `suitability.criteria.system_support.${profile.systemSupportId}`,
    },
  ];
}

function conditionKeys(
  profile: SuitabilityProfileV2,
  procedureFamilyId: ProcedureFamilyId
): string[] {
  const keys = [
    `suitability.conditions.boundary.${profile.boundaryId}`,
    `suitability.conditions.archetype.${profile.purchaseArchetypeId}`,
    `suitability.conditions.channel.${profile.executionChannelId}`,
    `suitability.conditions.support.${profile.systemSupportId}`,
  ];
  if (procedureFamilyId === "framework_calloff") {
    keys.push("suitability.conditions.frameworkApplicable");
  }
  if (
    profile.purchaseArchetypeId === "incomplete_requirement" ||
    profile.purchaseArchetypeId === "complex_service"
  ) {
    keys.push("suitability.conditions.learningMayAddWork");
  }
  return keys;
}

function limitationKeys(procedureFamilyId: ProcedureFamilyId): string[] {
  return procedureFamilyId === "custom_lawful"
    ? ["suitability.limitations.customGroundsNotEvaluated"]
    : [];
}

function withheldKeys(
  boundaryId: LegalGovernanceBoundaryId
): SuitabilityWithheldProcedureKey[] {
  if (boundaryId === "pzp_classic_eu") return [...EU_WITHHELD];
  if (boundaryId === "pzp_classic_national") return [...NATIONAL_WITHHELD];
  return [];
}

function parseProfile(
  rawInput: Record<string, unknown>
): SuitabilityProfileV2 | null {
  if (
    rawInput.schemaVersion !== MODEL_V2_METADATA.schemaVersion ||
    rawInput.modelVersion !== MODEL_V2_METADATA.modelVersion ||
    rawInput.calibrationId !== MODEL_V2_METADATA.calibrationId ||
    rawInput.legalRulesetId !== MODEL_V2_METADATA.legalRulesetId ||
    !isLegalGovernanceBoundaryId(rawInput.boundaryId) ||
    !isPurchaseArchetypeId(rawInput.purchaseArchetypeId) ||
    !isExecutionChannelId(rawInput.executionChannelId) ||
    !isSystemSupportId(rawInput.systemSupportId)
  ) {
    return null;
  }
  if (
    (rawInput.buyerRegime !== undefined && !isBuyerRegime(rawInput.buyerRegime)) ||
    (rawInput.procurementObject !== undefined &&
      !isProcurementObject(rawInput.procurementObject)) ||
    (rawInput.communicationMethod !== undefined &&
      !isCommunicationMethod(rawInput.communicationMethod))
  ) {
    return null;
  }

  try {
    assertInitiatedOnIsCovered(rawInput.initiatedOn);
  } catch {
    return null;
  }

  return {
    schemaVersion: MODEL_V2_METADATA.schemaVersion,
    modelVersion: MODEL_V2_METADATA.modelVersion,
    calibrationId: MODEL_V2_METADATA.calibrationId,
    legalRulesetId: MODEL_V2_METADATA.legalRulesetId,
    boundaryId: rawInput.boundaryId,
    initiatedOn: rawInput.initiatedOn,
    buyerRegime: isBuyerRegime(rawInput.buyerRegime)
      ? rawInput.buyerRegime
      : undefined,
    procurementObject: isProcurementObject(rawInput.procurementObject)
      ? rawInput.procurementObject
      : undefined,
    communicationMethod: isCommunicationMethod(rawInput.communicationMethod)
      ? rawInput.communicationMethod
      : undefined,
    purchaseArchetypeId: rawInput.purchaseArchetypeId,
    executionChannelId: rawInput.executionChannelId,
    systemSupportId: rawInput.systemSupportId,
  };
}

export function compareProcedureSuitability(
  rawInput: SuitabilityComparisonInput
): SuitabilityComparisonResult {
  if (!isRecord(rawInput)) return outOfScope("suitability.reasons.invalidInput");

  const profile = parseProfile(rawInput);
  if (!profile) return outOfScope("suitability.reasons.invalidOrUnsupportedProfile");

  if (
    profile.buyerRegime === "sectoral" ||
    profile.buyerRegime === "defence_security"
  ) {
    return outOfScope("suitability.reasons.unsupportedBuyerRegime");
  }

  const isPzp = profile.boundaryId.startsWith("pzp_classic_");
  if (isPzp) {
    if (
      profile.buyerRegime === undefined ||
      profile.procurementObject === undefined ||
      profile.communicationMethod === undefined
    ) {
      return outOfScope("suitability.reasons.missingPzpDeclaration");
    }
    if (profile.buyerRegime !== "classic") {
      return outOfScope("suitability.reasons.incompatibleDeclaration");
    }
  } else if (
    profile.buyerRegime !== undefined ||
    profile.procurementObject !== undefined ||
    profile.communicationMethod !== undefined
  ) {
    return outOfScope("suitability.reasons.incompatibleDeclaration");
  }

  const procedureFamilyIds = procedureCandidatesForBoundary(profile.boundaryId);
  if (!procedureFamilyIds) {
    return outOfScope("suitability.reasons.invalidOrUnsupportedProfile");
  }

  try {
    const candidates = procedureFamilyIds.map((procedureFamilyId) => ({
      procedureFamilyId,
      labelKey: `suitability.procedures.${procedureFamilyId}`,
      criteria: buildCriteria(profile, procedureFamilyId),
      conditionKeys: conditionKeys(profile, procedureFamilyId),
      limitationKeys: limitationKeys(procedureFamilyId),
      legalWaits: resolveLegalWaits({
        boundaryId: profile.boundaryId,
        procedureFamilyId,
        initiatedOn: profile.initiatedOn,
        legalRulesetId: profile.legalRulesetId,
        buyerRegime: profile.buyerRegime,
        procurementObject: profile.procurementObject,
        communicationMethod: profile.communicationMethod,
      }),
    }));

    return deepFreeze({
      status: "ready",
      metadata: metadataClone(),
      profile: { ...profile },
      candidates,
      withheldProcedureKeys: withheldKeys(profile.boundaryId),
      methodLimitationKeys: [...METHOD_LIMITATION_KEYS],
    });
  } catch {
    return outOfScope("suitability.reasons.legalResolutionFailed");
  }
}
