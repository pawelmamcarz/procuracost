import {
  CONTRACT_DESIGN_REGISTRY,
  WORKFLOW_DESIGN_REGISTRY,
  type AlternativeId,
  type ContractDesignIdV2,
  type WorkflowDesignIdV2,
} from "@/lib/model-v2";

import type { CalculatorWorkspaceState } from "./editor-state";

export interface DesignLaneProvenance {
  alternativeId: AlternativeId;
  compatibleWorkflowIds: WorkflowDesignIdV2[];
  compatibleContractIds: ContractDesignIdV2[];
  selectedWorkflowId: WorkflowDesignIdV2;
  selectedContractId: ContractDesignIdV2;
  locallyEdited: boolean;
}

export interface CalculatorDesignProvenance {
  controlMode: "read-only-base-provenance";
  workflowSwitchAvailable: false;
  contractSwitchAvailable: false;
  lanes: Record<AlternativeId, DesignLaneProvenance>;
}

function deriveLaneProvenance(
  state: CalculatorWorkspaceState,
  alternativeId: AlternativeId
): DesignLaneProvenance {
  return {
    alternativeId,
    compatibleWorkflowIds: WORKFLOW_DESIGN_REGISTRY.filter(
      (entry) =>
        entry.scenarioId === state.scenarioId &&
        entry.alternativeId === alternativeId
    ).map(({ id }) => id),
    compatibleContractIds: CONTRACT_DESIGN_REGISTRY.filter(
      (entry) =>
        entry.scenarioId === state.scenarioId &&
        entry.alternativeId === alternativeId
    ).map(({ id }) => id),
    selectedWorkflowId: state.draft.designIds.workflow[alternativeId],
    selectedContractId: state.draft.designIds.contract[alternativeId],
    locallyEdited: state.locallyEdited[alternativeId],
  };
}

export function deriveDesignProvenance(
  state: CalculatorWorkspaceState
): CalculatorDesignProvenance {
  return {
    controlMode: "read-only-base-provenance",
    workflowSwitchAvailable: false,
    contractSwitchAvailable: false,
    lanes: {
      formalSequential: deriveLaneProvenance(state, "formalSequential"),
      adaptiveCompliant: deriveLaneProvenance(state, "adaptiveCompliant"),
    },
  };
}
