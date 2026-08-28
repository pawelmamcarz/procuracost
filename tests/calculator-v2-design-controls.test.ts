import { describe, expect, it } from "vitest";

import {
  deriveDesignProvenance,
} from "@/components/calculator-v2/design-provenance";
import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import {
  CONTRACT_DESIGN_REGISTRY,
  WORKFLOW_DESIGN_REGISTRY,
  createScenarioDraft,
} from "@/lib/model-v2";

describe("calculator v2 narrowed design controls", () => {
  it("exposes only each lane's compatible base IDs as read-only provenance", () => {
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );

    const provenance = deriveDesignProvenance(state);

    expect(provenance.controlMode).toBe("read-only-base-provenance");
    expect(provenance.workflowSwitchAvailable).toBe(false);
    expect(provenance.contractSwitchAvailable).toBe(false);
    expect(provenance.lanes.formalSequential).toMatchObject({
      alternativeId: "formalSequential",
      compatibleWorkflowIds: [
        "fleet_tco_reframing.workflow.formalSequential",
      ],
      compatibleContractIds: [
        "fleet_tco_reframing.contract.formalSequential",
      ],
      selectedWorkflowId: "fleet_tco_reframing.workflow.formalSequential",
      selectedContractId: "fleet_tco_reframing.contract.formalSequential",
      locallyEdited: false,
    });
    expect(provenance.lanes.adaptiveCompliant).toMatchObject({
      alternativeId: "adaptiveCompliant",
      compatibleWorkflowIds: [
        "fleet_tco_reframing.workflow.adaptiveCompliant",
      ],
      compatibleContractIds: [
        "fleet_tco_reframing.contract.adaptiveCompliant",
      ],
      locallyEdited: false,
    });
  });

  it("excludes cross-scenario and opposite-alternative registry entries", () => {
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("erp_transformation_discovery")
    );
    const provenance = deriveDesignProvenance(state);

    for (const alternativeId of [
      "formalSequential",
      "adaptiveCompliant",
    ] as const) {
      const lane = provenance.lanes[alternativeId];
      const expectedWorkflow = WORKFLOW_DESIGN_REGISTRY.filter(
        (entry) =>
          entry.scenarioId === state.scenarioId &&
          entry.alternativeId === alternativeId
      ).map(({ id }) => id);
      const expectedContract = CONTRACT_DESIGN_REGISTRY.filter(
        (entry) =>
          entry.scenarioId === state.scenarioId &&
          entry.alternativeId === alternativeId
      ).map(({ id }) => id);

      expect(lane.compatibleWorkflowIds).toEqual(expectedWorkflow);
      expect(lane.compatibleContractIds).toEqual(expectedContract);
      expect(
        lane.compatibleWorkflowIds.every((id) =>
          id.includes(`.${alternativeId}`)
        )
      ).toBe(true);
      expect(
        lane.compatibleContractIds.every((id) =>
          id.includes(`.${alternativeId}`)
        )
      ).toBe(true);
    }
  });

  it("marks only the independently edited lane", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const adaptiveStep = initial.draft.alternatives.adaptiveCompliant.workflowDesign.steps.find(
      (step) => !step.lockedLegalProvenance
    );
    if (!adaptiveStep) throw new Error("Expected an editable step");

    const edited = calculatorWorkspaceReducer(initial, {
      type: "edit-step-label",
      alternativeId: "adaptiveCompliant",
      stepId: adaptiveStep.id,
      userLabel: "Local adaptive label",
    });
    const provenance = deriveDesignProvenance(edited);

    expect(provenance.lanes.formalSequential.locallyEdited).toBe(false);
    expect(provenance.lanes.adaptiveCompliant.locallyEdited).toBe(true);
  });
});
