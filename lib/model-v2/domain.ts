import type { CalibratedValue } from "./calibrated-value";
import { deepFreeze } from "./deep-freeze";

export const MODEL_V2_METADATA = deepFreeze({
  schemaVersion: 2,
  modelVersion: "2.3.0",
  calibrationId: "source-scenario-2026-08-28",
  legalRulesetId: "pl-pzp-2026-2027",
} as const);

export const LEGAL_GOVERNANCE_BOUNDARY_IDS = deepFreeze([
  "private_policy",
  "public_internal_rules",
  "pzp_classic_national",
  "pzp_classic_eu",
] as const);

export type LegalGovernanceBoundaryId =
  (typeof LEGAL_GOVERNANCE_BOUNDARY_IDS)[number];

export const PROCEDURE_FAMILY_IDS = deepFreeze([
  "private_competitive",
  "private_negotiated",
  "public_internal_competitive",
  "pzp_basic",
  "pzp_open",
  "pzp_restricted",
  "framework_calloff",
  "custom_lawful",
] as const);

export type ProcedureFamilyId = (typeof PROCEDURE_FAMILY_IDS)[number];

export const PURCHASE_ARCHETYPE_IDS = deepFreeze([
  "standardized_recurring",
  "incomplete_requirement",
  "complex_service",
  "continuity_critical",
  "capital_investment",
] as const);

export type PurchaseArchetypeId = (typeof PURCHASE_ARCHETYPE_IDS)[number];

export const EXECUTION_CHANNEL_IDS = deepFreeze([
  "sourcing_event",
  "catalog_calloff",
  "mrp_release",
  "custom",
] as const);

export type ExecutionChannelId = (typeof EXECUTION_CHANNEL_IDS)[number];

export const SYSTEM_SUPPORT_IDS = deepFreeze([
  "manual",
  "sourcing_platform",
  "transactional_erp",
  "integrated_source_to_pay",
] as const);

export type SystemSupportId = (typeof SYSTEM_SUPPORT_IDS)[number];

export type AlternativeId = "formalSequential" | "adaptiveCompliant";

export const BUYER_REGIME_IDS = deepFreeze([
  "classic",
  "sectoral",
  "defence_security",
] as const);
export type BuyerRegime = (typeof BUYER_REGIME_IDS)[number];

export const PROCUREMENT_OBJECT_IDS = deepFreeze([
  "supplies_services",
  "works",
] as const);
export type ProcurementObject = (typeof PROCUREMENT_OBJECT_IDS)[number];

export const COMMUNICATION_METHOD_IDS = deepFreeze([
  "electronic",
  "other",
] as const);
export type CommunicationMethod = (typeof COMMUNICATION_METHOD_IDS)[number];

function isMember<const T extends readonly string[]>(
  values: T,
  value: unknown
): value is T[number] {
  return typeof value === "string" && values.includes(value as T[number]);
}

export function isLegalGovernanceBoundaryId(
  value: unknown
): value is LegalGovernanceBoundaryId {
  return isMember(LEGAL_GOVERNANCE_BOUNDARY_IDS, value);
}

export function isProcedureFamilyId(value: unknown): value is ProcedureFamilyId {
  return isMember(PROCEDURE_FAMILY_IDS, value);
}

export function isPurchaseArchetypeId(value: unknown): value is PurchaseArchetypeId {
  return isMember(PURCHASE_ARCHETYPE_IDS, value);
}

export function isExecutionChannelId(value: unknown): value is ExecutionChannelId {
  return isMember(EXECUTION_CHANNEL_IDS, value);
}

export function isSystemSupportId(value: unknown): value is SystemSupportId {
  return isMember(SYSTEM_SUPPORT_IDS, value);
}

export function isBuyerRegime(value: unknown): value is BuyerRegime {
  return isMember(BUYER_REGIME_IDS, value);
}

export function isProcurementObject(value: unknown): value is ProcurementObject {
  return isMember(PROCUREMENT_OBJECT_IDS, value);
}

export function isCommunicationMethod(
  value: unknown
): value is CommunicationMethod {
  return isMember(COMMUNICATION_METHOD_IDS, value);
}

export interface LegalContext {
  boundaryId: LegalGovernanceBoundaryId;
  procedureFamilyId: ProcedureFamilyId;
  initiatedOn: string;
  legalRulesetId: typeof MODEL_V2_METADATA.legalRulesetId;
  buyerRegime?: BuyerRegime;
  procurementObject?: ProcurementObject;
  communicationMethod?: CommunicationMethod;
}

export interface ModelContextV2 extends LegalContext {
  schemaVersion: typeof MODEL_V2_METADATA.schemaVersion;
  modelVersion: typeof MODEL_V2_METADATA.modelVersion;
  calibrationId: typeof MODEL_V2_METADATA.calibrationId;
  purchaseArchetypeId: PurchaseArchetypeId;
  executionChannelId: ExecutionChannelId;
  systemSupportId: SystemSupportId;
}

export interface LockedLegalProvenance {
  legalRulesetId: typeof MODEL_V2_METADATA.legalRulesetId;
  ruleId: string;
  provision: string;
  initiatedOn: string;
  lockedActiveDays: number;
  lockedQueueDays: number;
}

export type ProcessMapStepKind =
  | "activity"
  | "approval"
  | "legal_wait"
  | "milestone";

export interface ProcessMapStep {
  id: string;
  labelKey: string;
  userLabel?: string;
  predecessorIds: string[];
  activeDays: CalibratedValue;
  queueDays: CalibratedValue;
  roleHours: Record<string, CalibratedValue>;
  nonLabourCost: CalibratedValue;
  kind: ProcessMapStepKind;
  lockedLegalProvenance?: LockedLegalProvenance;
}

export interface WorkflowDesign {
  steps: ProcessMapStep[];
}

export type ContractCostDimensionId =
  | "competition_transfer"
  | "contract_amendment"
  | "tco"
  | "informal_bypass";

export interface MonetizedContractDimension {
  id: ContractCostDimensionId;
  status: "monetized";
  cost: CalibratedValue;
}

export interface NonMonetizedContractDimension {
  id: ContractCostDimensionId;
  status: "notMonetized";
  reasonKey: string;
  evidenceIds: string[];
}

export type ContractCostDimension =
  | MonetizedContractDimension
  | NonMonetizedContractDimension;

export interface ContractDesign {
  dimensions: ContractCostDimension[];
}

export interface AlternativeDesign {
  workflowDesign: WorkflowDesign;
  contractDesign: ContractDesign;
}

export interface ComparisonAlternatives {
  formalSequential: AlternativeDesign;
  adaptiveCompliant: AlternativeDesign;
}

function cloneCalibratedValue(value: CalibratedValue): CalibratedValue {
  return { ...value, evidenceIds: [...value.evidenceIds] };
}

function cloneWorkflowDesign(design: WorkflowDesign): WorkflowDesign {
  return {
    steps: design.steps.map((step) => ({
      ...step,
      predecessorIds: [...step.predecessorIds],
      activeDays: cloneCalibratedValue(step.activeDays),
      queueDays: cloneCalibratedValue(step.queueDays),
      roleHours: Object.fromEntries(
        Object.entries(step.roleHours).map(([roleId, hours]) => [
          roleId,
          cloneCalibratedValue(hours),
        ])
      ),
      nonLabourCost: cloneCalibratedValue(step.nonLabourCost),
      lockedLegalProvenance: step.lockedLegalProvenance
        ? { ...step.lockedLegalProvenance }
        : undefined,
    })),
  };
}

function cloneContractDesign(design: ContractDesign): ContractDesign {
  return {
    dimensions: design.dimensions.map((dimension) =>
      dimension.status === "monetized"
        ? { ...dimension, cost: cloneCalibratedValue(dimension.cost) }
        : {
            ...dimension,
            evidenceIds: [...dimension.evidenceIds],
          }
    ),
  };
}

export function createComparisonAlternatives(
  workflowDesigns: Record<AlternativeId, WorkflowDesign>,
  sharedContractDesign: ContractDesign = { dimensions: [] }
): ComparisonAlternatives {
  return {
    formalSequential: {
      workflowDesign: cloneWorkflowDesign(workflowDesigns.formalSequential),
      contractDesign: cloneContractDesign(sharedContractDesign),
    },
    adaptiveCompliant: {
      workflowDesign: cloneWorkflowDesign(workflowDesigns.adaptiveCompliant),
      contractDesign: cloneContractDesign(sharedContractDesign),
    },
  };
}
