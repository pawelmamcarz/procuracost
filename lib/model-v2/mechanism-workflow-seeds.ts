import { deepFreeze } from "./deep-freeze";
import type {
  RetainedLegalWaitSlotId,
  RetainedRoleId,
} from "./retained-workflow-seeds";

export const MECHANISM_WORKFLOW_EVIDENCE_ID =
  "model_2_3_mechanism_workflow_allocations";

export const MECHANISM_WORKFLOW_SOURCE = deepFreeze({
  kind: "internal_model_record",
  modelVersion: "2.3.0",
  evidenceClass: "illustrative_scenario",
  evidenceId: MECHANISM_WORKFLOW_EVIDENCE_ID,
  sourceUrl: "https://www.procuracost.com/model/assumptions",
} as const);

export const MECHANISM_WORKFLOW_SCENARIO_IDS = deepFreeze([
  "fleet_tco_reframing",
  "erp_transformation_discovery",
  "logistics_service_redesign",
  "critical_material_continuity",
  "public_it_open_with_market_consultation",
] as const);

export type MechanismWorkflowScenarioId =
  (typeof MECHANISM_WORKFLOW_SCENARIO_IDS)[number];

export interface MechanismWorkflowActivitySeed {
  kind: "activity";
  id: string;
  formalDays: number;
  adaptiveDays: number;
  roleHours: Partial<Record<RetainedRoleId, number>>;
}

export interface MechanismLegalWaitSlot {
  kind: "legal_wait_slot";
  slotId: RetainedLegalWaitSlotId;
}

export type MechanismWorkflowSeedStep =
  | MechanismWorkflowActivitySeed
  | MechanismLegalWaitSlot;

export interface MechanismWorkflowTemplate {
  steps: readonly MechanismWorkflowSeedStep[];
}

function activity(
  id: string,
  formalDays: number,
  adaptiveDays: number,
  roleHours: Partial<Record<RetainedRoleId, number>>
): MechanismWorkflowActivitySeed {
  return { kind: "activity", id, formalDays, adaptiveDays, roleHours };
}

function legalWaitSlot(
  slotId: RetainedLegalWaitSlotId
): MechanismLegalWaitSlot {
  return { kind: "legal_wait_slot", slotId };
}

export const MECHANISM_WORKFLOW_TEMPLATES = deepFreeze({
  fleet_tco_reframing: {
    steps: [
      activity("fleet_operating_baseline", 4, 6, {
        requestor: 12,
        buyer: 8,
        finance: 4,
      }),
      activity("fleet_lifecycle_cost_workshop", 3, 7, {
        requestor: 12,
        buyer: 10,
        finance: 12,
        manager: 4,
      }),
      activity("fleet_use_case_requirements", 10, 4, {
        requestor: 16,
        buyer: 12,
        manager: 4,
      }),
      activity("fleet_market_sounding", 7, 2, {
        requestor: 4,
        buyer: 16,
      }),
      activity("fleet_offer_evaluation", 13, 3, {
        buyer: 24,
        finance: 8,
        manager: 4,
      }),
      activity("fleet_contract_award", 7, 2, {
        buyer: 6,
        lawyer: 16,
        executive: 2,
      }),
    ],
  },
  erp_transformation_discovery: {
    steps: [
      activity("erp_current_state_baseline", 5, 7, {
        requestor: 16,
        buyer: 8,
        manager: 4,
      }),
      activity("erp_problem_framing", 5, 6, {
        requestor: 20,
        buyer: 10,
        manager: 6,
      }),
      activity("erp_supplier_discovery", 5, 6, {
        requestor: 8,
        buyer: 20,
        finance: 4,
      }),
      activity("erp_modular_scope", 9, 2, {
        requestor: 20,
        buyer: 12,
        lawyer: 8,
      }),
      activity("erp_offer_evaluation", 12, 2, {
        buyer: 24,
        finance: 8,
        manager: 4,
      }),
      activity("erp_contract_award", 8, 1, {
        buyer: 6,
        lawyer: 20,
        executive: 3,
      }),
    ],
  },
  logistics_service_redesign: {
    steps: [
      activity("logistics_service_baseline", 5, 6, {
        requestor: 16,
        buyer: 8,
        finance: 4,
      }),
      activity("logistics_market_engagement", 4, 7, {
        requestor: 8,
        buyer: 20,
      }),
      activity("logistics_sla_interfaces", 5, 6, {
        requestor: 20,
        buyer: 10,
        lawyer: 6,
        manager: 4,
      }),
      activity("logistics_service_requirements", 10, 2, {
        requestor: 16,
        buyer: 12,
      }),
      activity("logistics_offer_evaluation", 12, 2, {
        buyer: 24,
        finance: 8,
        manager: 4,
      }),
      activity("logistics_contract_award", 8, 1, {
        buyer: 6,
        lawyer: 18,
        executive: 2,
      }),
    ],
  },
  critical_material_continuity: {
    steps: [
      activity("critical_continuity_risk", 4, 6, {
        requestor: 12,
        buyer: 8,
        manager: 6,
      }),
      activity("critical_supply_mapping", 5, 7, {
        requestor: 8,
        buyer: 20,
        finance: 4,
      }),
      activity("critical_contingency_design", 5, 6, {
        requestor: 16,
        buyer: 12,
        manager: 8,
      }),
      activity("critical_sourcing_strategy", 8, 2, {
        buyer: 16,
        finance: 8,
        lawyer: 6,
      }),
      activity("critical_supplier_selection", 13, 2, {
        requestor: 8,
        buyer: 24,
        finance: 8,
      }),
      activity("critical_contract_award", 9, 1, {
        buyer: 6,
        lawyer: 18,
        executive: 3,
      }),
    ],
  },
  public_it_open_with_market_consultation: {
    steps: [
      activity("public_it_needs_definition", 6, 7, {
        requestor: 20,
        buyer: 10,
        finance: 8,
        manager: 4,
      }),
      activity("public_it_preliminary_market_consultation", 1, 6, {
        requestor: 12,
        buyer: 20,
        lawyer: 8,
      }),
      activity("public_it_consultation_synthesis", 1, 3, {
        requestor: 12,
        buyer: 12,
        lawyer: 6,
      }),
      activity("public_it_procurement_documents", 12, 4, {
        requestor: 12,
        buyer: 28,
        lawyer: 20,
      }),
      legalWaitSlot("bid_submission"),
      activity("public_it_bid_evaluation", 9, 3, {
        requestor: 8,
        buyer: 24,
        lawyer: 8,
        finance: 8,
      }),
      activity("public_it_clarifications", 6, 1, {
        buyer: 16,
        lawyer: 8,
      }),
      activity("public_it_award_committee", 3, 1, {
        buyer: 8,
        lawyer: 4,
        executive: 4,
      }),
      legalWaitSlot("standstill"),
      activity("public_it_contract_signing", 4, 1, {
        buyer: 4,
        lawyer: 8,
        executive: 2,
      }),
    ],
  },
} as const satisfies Record<
  MechanismWorkflowScenarioId,
  MechanismWorkflowTemplate
>);
