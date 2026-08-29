import type { CalibratedValue } from "./calibrated-value";
import {
  MODEL_V2_METADATA,
  isBuyerRegime,
  isCommunicationMethod,
  isLegalGovernanceBoundaryId,
  isProcurementObject,
  isProcedureFamilyId,
  type LegalContext,
  type LegalGovernanceBoundaryId,
  type LockedLegalProvenance,
  type ProcedureFamilyId,
} from "./domain";
import { deepFreeze } from "./deep-freeze";

export interface ResolvedLegalWait {
  id: string;
  labelKey: string;
  queueDays: CalibratedValue;
  provenance: LockedLegalProvenance;
}

export const PROCEDURE_CANDIDATES_BY_BOUNDARY: Readonly<
  Record<
  LegalGovernanceBoundaryId,
  readonly ProcedureFamilyId[]
  >
> = deepFreeze({
  private_policy: [
    "private_competitive",
    "private_negotiated",
    "framework_calloff",
    "custom_lawful",
  ],
  public_internal_rules: [
    "public_internal_competitive",
    "framework_calloff",
    "custom_lawful",
  ],
  pzp_classic_national: ["pzp_basic", "framework_calloff"],
  pzp_classic_eu: ["pzp_open", "pzp_restricted", "framework_calloff"],
});

interface LegalWaitDefinition {
  suffix: string;
  labelKey: string;
  days: number;
  provision: string;
  evidenceId: string;
}

export function assertInitiatedOnIsCovered(initiatedOn: unknown): asserts initiatedOn is string {
  if (typeof initiatedOn !== "string") {
    throw new Error("initiatedOn must be an ISO calendar date (YYYY-MM-DD)");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(initiatedOn)) {
    throw new Error("initiatedOn must be an ISO calendar date (YYYY-MM-DD)");
  }

  const parsed = new Date(`${initiatedOn}T00:00:00.000Z`);
  if (
    Number.isNaN(parsed.valueOf()) ||
    parsed.toISOString().slice(0, 10) !== initiatedOn
  ) {
    throw new Error("initiatedOn must be a valid ISO calendar date");
  }

  if (initiatedOn < "2026-01-01" || initiatedOn > "2027-12-31") {
    throw new Error(
      "initiatedOn is outside the pl-pzp-2026-2027 ruleset coverage"
    );
  }
}

export function procedureCandidatesForBoundary(
  boundaryId: unknown
): readonly ProcedureFamilyId[] | null {
  return isLegalGovernanceBoundaryId(boundaryId)
    ? PROCEDURE_CANDIDATES_BY_BOUNDARY[boundaryId]
    : null;
}

function fixedLegalValue(days: number, evidenceId: string): CalibratedValue {
  return {
    low: days,
    central: days,
    high: days,
    rangeKind: "fixed",
    evidenceClass: "legal_rule",
    evidenceIds: [evidenceId],
  };
}

function legalWaitDefinitions(context: LegalContext): LegalWaitDefinition[] {
  const electronic = context.communicationMethod === "electronic";

  switch (context.procedureFamilyId) {
    case "pzp_basic":
      return [
        {
          suffix: "bid_submission",
          labelKey: "model.legal.pzpBasic.bidSubmission",
          days: context.procurementObject === "works" ? 14 : 7,
          provision: "PZP art. 283",
          evidenceId: "pl-pzp-art-283",
        },
        {
          suffix: "standstill",
          labelKey: "model.legal.pzpBasic.standstill",
          days: electronic ? 5 : 10,
          provision: "PZP art. 308 ust. 2",
          evidenceId: "pl-pzp-art-308-2",
        },
      ];
    case "pzp_open":
      return [
        {
          suffix: "bid_submission",
          labelKey: "model.legal.pzpOpen.bidSubmission",
          days: 35,
          provision: "PZP art. 138 ust. 1",
          evidenceId: "pl-pzp-art-138-1",
        },
        {
          suffix: "standstill",
          labelKey: "model.legal.pzpOpen.standstill",
          days: electronic ? 10 : 15,
          provision: "PZP art. 264 ust. 1",
          evidenceId: "pl-pzp-art-264-1",
        },
      ];
    case "pzp_restricted":
      return [
        {
          suffix: "request_to_participate",
          labelKey: "model.legal.pzpRestricted.requestToParticipate",
          days: 30,
          provision: "PZP art. 144 ust. 1",
          evidenceId: "pl-pzp-art-144-1",
        },
        {
          suffix: "bid_submission",
          labelKey: "model.legal.pzpRestricted.bidSubmission",
          days: 30,
          provision: "PZP art. 151 ust. 1",
          evidenceId: "pl-pzp-art-151-1",
        },
        {
          suffix: "standstill",
          labelKey: "model.legal.pzpRestricted.standstill",
          days: electronic ? 10 : 15,
          provision: "PZP art. 264 ust. 1",
          evidenceId: "pl-pzp-art-264-1",
        },
      ];
    default:
      return [];
  }
}

export function resolveLegalWaits(context: LegalContext): ResolvedLegalWait[] {
  if (context.legalRulesetId !== MODEL_V2_METADATA.legalRulesetId) {
    throw new Error(`Unsupported legal ruleset: ${context.legalRulesetId}`);
  }

  assertInitiatedOnIsCovered(context.initiatedOn);

  if (!isLegalGovernanceBoundaryId(context.boundaryId)) {
    throw new Error(`Unsupported legal boundary: ${String(context.boundaryId)}`);
  }
  if (!isProcedureFamilyId(context.procedureFamilyId)) {
    throw new Error(`Unsupported procedure family: ${String(context.procedureFamilyId)}`);
  }
  if (context.buyerRegime !== undefined && !isBuyerRegime(context.buyerRegime)) {
    throw new Error(`Unsupported buyer regime: ${String(context.buyerRegime)}`);
  }
  if (
    context.procurementObject !== undefined &&
    !isProcurementObject(context.procurementObject)
  ) {
    throw new Error(`Unsupported procurement object: ${String(context.procurementObject)}`);
  }
  if (
    context.communicationMethod !== undefined &&
    !isCommunicationMethod(context.communicationMethod)
  ) {
    throw new Error(`Unsupported communication method: ${String(context.communicationMethod)}`);
  }

  if (
    context.buyerRegime === "sectoral" ||
    context.buyerRegime === "defence_security"
  ) {
    throw new Error(`${context.buyerRegime} context is outside model 2.3 scope`);
  }

  if (
    !PROCEDURE_CANDIDATES_BY_BOUNDARY[context.boundaryId].includes(context.procedureFamilyId)
  ) {
    throw new Error(
      `Procedure ${context.procedureFamilyId} is not lawful under boundary ${context.boundaryId}`
    );
  }

  if (
    context.boundaryId.startsWith("pzp_classic_") &&
    context.buyerRegime !== "classic"
  ) {
    throw new Error("Classic PZP boundaries require the classic buyer regime");
  }

  if (
    context.procedureFamilyId === "pzp_basic" &&
    context.procurementObject === undefined
  ) {
    throw new Error("procurementObject is required for pzp_basic");
  }

  if (
    ["pzp_basic", "pzp_open", "pzp_restricted"].includes(
      context.procedureFamilyId
    ) &&
    context.communicationMethod === undefined
  ) {
    throw new Error(
      `communicationMethod is required for ${context.procedureFamilyId}`
    );
  }

  return legalWaitDefinitions(context).map((definition) => ({
    id: `legal.${context.procedureFamilyId}.${definition.suffix}`,
    labelKey: definition.labelKey,
    queueDays: fixedLegalValue(definition.days, definition.evidenceId),
    provenance: {
      legalRulesetId: context.legalRulesetId,
      ruleId: definition.evidenceId,
      provision: definition.provision,
      initiatedOn: context.initiatedOn,
      lockedActiveDays: 0,
      lockedQueueDays: definition.days,
    },
  }));
}
