import { deepFreeze } from "./deep-freeze";

export const RETAINED_WORKFLOW_SOURCE = deepFreeze({
  kind: "retained_workflow_seed",
  sourceModelVersion: "2.2.2",
  sourceCommit: "22c584a0ec9c871a75195257821d5815cfbd52e3",
  evidenceClass: "retained_legacy_assumption",
} as const);

export type RetainedRoleId =
  | "buyer"
  | "lawyer"
  | "finance"
  | "manager"
  | "executive"
  | "requestor";

export interface RetainedWorkflowActivitySeed {
  kind: "activity";
  id: string;
  formalDays: number;
  adaptiveDays: number;
  roleHours: Partial<Record<RetainedRoleId, number>>;
}

export type RetainedLegalWaitSlotId = "bid_submission" | "standstill";

export interface RetainedLegalWaitSlot {
  kind: "legal_wait_slot";
  slotId: RetainedLegalWaitSlotId;
}

export type RetainedWorkflowSeedStep =
  | RetainedWorkflowActivitySeed
  | RetainedLegalWaitSlot;

export interface RetainedWorkflowTemplate {
  steps: readonly RetainedWorkflowSeedStep[];
}

export const RETAINED_WORKFLOW_TEMPLATE_IDS = deepFreeze([
  "strategic_private_formal",
  "pzp_open",
  "policy_control",
  "capex_replacement",
  "discovery_codesign",
  "catalog_calloff",
  "mrp_release",
] as const);

export type RetainedWorkflowTemplateId =
  (typeof RETAINED_WORKFLOW_TEMPLATE_IDS)[number];

function activity(
  id: string,
  formalDays: number,
  adaptiveDays: number,
  roleHours: Partial<Record<RetainedRoleId, number>>
): RetainedWorkflowActivitySeed {
  return { kind: "activity", id, formalDays, adaptiveDays, roleHours };
}

function legalWaitSlot(slotId: RetainedLegalWaitSlotId): RetainedLegalWaitSlot {
  return { kind: "legal_wait_slot", slotId };
}

export const RETAINED_WORKFLOW_TEMPLATES = deepFreeze({
  strategic_private_formal: {
    steps: [
      activity("rfi", 7, 3, { requestor: 8, buyer: 16, finance: 4 }),
      activity("rfq", 10, 7, { buyer: 24, finance: 8 }),
      activity("internal_approval", 7, 2, {
        manager: 4,
        finance: 4,
        executive: 3,
      }),
      activity("negotiation", 10, 7, { buyer: 24, lawyer: 16 }),
      activity("legal_review", 7, 3, { lawyer: 16, finance: 4 }),
      activity("signing", 3, 2, { buyer: 2, executive: 2 }),
    ],
  },
  pzp_open: {
    steps: [
      activity("needs_analysis", 7, 3, {
        requestor: 16,
        buyer: 8,
        finance: 8,
        manager: 4,
      }),
      activity("procurement_documents", 10, 7, {
        requestor: 8,
        buyer: 24,
        lawyer: 16,
      }),
      legalWaitSlot("bid_submission"),
      activity("bid_evaluation", 10, 5, {
        requestor: 8,
        buyer: 24,
        lawyer: 8,
        finance: 8,
      }),
      activity("clarifications", 7, 7, { buyer: 16, lawyer: 8 }),
      activity("award_committee", 3, 1, {
        buyer: 8,
        lawyer: 4,
        executive: 4,
      }),
      legalWaitSlot("standstill"),
      activity("contract_signing", 5, 3, {
        buyer: 4,
        lawyer: 8,
        executive: 2,
      }),
    ],
  },
  policy_control: {
    steps: [
      activity("requirements", 5, 5, {
        requestor: 8,
        buyer: 12,
        manager: 2,
      }),
      activity("evaluation", 7, 7, { requestor: 4, buyer: 16, finance: 4 }),
      activity("approval", 3, 3, { manager: 2, finance: 2 }),
      activity("contract", 5, 5, { buyer: 4, lawyer: 4 }),
    ],
  },
  capex_replacement: {
    steps: [
      activity("business_case", 28, 20, {
        requestor: 24,
        finance: 16,
        manager: 8,
        executive: 4,
      }),
      activity("technical_spec", 20, 14, {
        requestor: 32,
        buyer: 16,
        lawyer: 8,
      }),
      activity("capex_committee", 14, 10, {
        finance: 8,
        manager: 6,
        executive: 4,
      }),
      activity("vendor_selection", 28, 20, {
        requestor: 16,
        buyer: 32,
        finance: 8,
        manager: 8,
      }),
      activity("legal_review", 14, 10, { lawyer: 24, finance: 8 }),
      activity("final_approval", 10, 6, { executive: 4, finance: 4 }),
      activity("contract_signing", 6, 4, {
        buyer: 4,
        lawyer: 8,
        executive: 2,
      }),
    ],
  },
  discovery_codesign: {
    steps: [
      activity("problem_framing", 6, 8, {
        requestor: 12,
        buyer: 10,
        manager: 4,
      }),
      activity("market_codesign", 5, 14, {
        requestor: 16,
        buyer: 24,
        manager: 6,
      }),
      activity("rework_round", 2, 9, {
        requestor: 8,
        buyer: 12,
        lawyer: 4,
      }),
      activity("evaluation", 10, 7, { buyer: 20, finance: 6, manager: 4 }),
      activity("legal_review", 8, 6, { lawyer: 20, finance: 4 }),
      activity("signing", 3, 3, { buyer: 2, executive: 3 }),
    ],
  },
  catalog_calloff: {
    steps: [
      activity("need_identification", 1, 1, { requestor: 1 }),
      activity("catalog_selection", 1, 1, { requestor: 1, buyer: 0.5 }),
      activity("po_approval", 1, 1, { manager: 0.5 }),
    ],
  },
  mrp_release: {
    steps: [
      activity("mrp_trigger", 0, 0, {}),
      activity("po_generation", 1, 1, { buyer: 1 }),
      activity("goods_receipt", 1, 1, { requestor: 1 }),
    ],
  },
} as const satisfies Record<
  RetainedWorkflowTemplateId,
  RetainedWorkflowTemplate
>);

export interface RetainedSupportProfile {
  timeMultiplier: number;
  coordinationCostPerActiveDay: number;
  toolCostPerSourcingEvent: number;
  toolCostPerOperationalOrder: number;
}

export const RETAINED_SUPPORT_PROFILES = deepFreeze({
  manual: {
    timeMultiplier: 1.4,
    coordinationCostPerActiveDay: 500,
    toolCostPerSourcingEvent: 0,
    toolCostPerOperationalOrder: 0,
  },
  sourcing_platform: {
    timeMultiplier: 1.15,
    coordinationCostPerActiveDay: 200,
    toolCostPerSourcingEvent: 800,
    toolCostPerOperationalOrder: 30,
  },
  transactional_erp: {
    timeMultiplier: 1,
    coordinationCostPerActiveDay: 100,
    toolCostPerSourcingEvent: 1200,
    toolCostPerOperationalOrder: 50,
  },
  integrated_source_to_pay: {
    timeMultiplier: 0.7,
    coordinationCostPerActiveDay: 20,
    toolCostPerSourcingEvent: 2000,
    toolCostPerOperationalOrder: 60,
  },
} as const satisfies Record<string, RetainedSupportProfile>);
