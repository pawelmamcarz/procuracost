import { describe, expect, it } from "vitest";

import {
  buildCalculationInputFromDraft,
  calculateComparison,
  createScenarioDraft,
  resolveWorkflowDesign,
  resolveLegalWaits,
  type ComparisonCalculationInput,
  validateProcessMap,
} from "@/lib/model-v2";

describe("model 2.3 locked legal dependencies", () => {
  it.each([
    ["formalSequential", "public_it_bid_evaluation", "bid_submission"],
    ["formalSequential", "public_it_contract_signing", "standstill"],
    ["adaptiveCompliant", "public_it_bid_evaluation", "bid_submission"],
    ["adaptiveCompliant", "public_it_contract_signing", "standstill"],
  ] as const)(
    "registers the %s %s dependency explicitly",
    (alternativeId, governedSuffix, waitSuffix) => {
      const draft = createScenarioDraft(
        "public_it_open_with_market_consultation"
      );
      const workflow = draft.alternatives[alternativeId].workflowDesign;

      expect(workflow.registeredDesignId).toBe(
        draft.designIds.workflow[alternativeId]
      );
      expect(workflow.requiredLegalDependencies).toContainEqual({
        stepId: expect.stringMatching(new RegExp(`\\.${governedSuffix}$`)),
        ancestorId: expect.stringMatching(new RegExp(`\\.${waitSuffix}$`)),
      });
    }
  );

  it("rejects contract signing detached from the mandatory standstill", () => {
    const draft = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    const workflow =
      draft.alternatives.formalSequential.workflowDesign;
    const signing = workflow.steps.find(({ id }) =>
      id.endsWith(".public_it_contract_signing")
    );
    if (!signing) throw new Error("Expected the public IT signing step");

    signing.predecessorIds = [];

    expect(
      validateProcessMap(workflow, resolveLegalWaits(draft.context))
    ).toContainEqual(
      expect.objectContaining({
        code: "missing_required_legal_ancestor",
        stepId: signing.id,
      })
    );
  });

  it("allows an intermediate step while retaining the standstill as an ancestor", () => {
    const draft = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    const workflow =
      draft.alternatives.formalSequential.workflowDesign;
    const signing = workflow.steps.find(({ id }) =>
      id.endsWith(".public_it_contract_signing")
    );
    const standstill = workflow.steps.find(({ id }) =>
      id.endsWith(".standstill")
    );
    if (!signing || !standstill) {
      throw new Error("Expected public IT signing and standstill steps");
    }
    const intermediate = {
      ...structuredClone(signing),
      id: "user-step-between-standstill-and-signing",
      predecessorIds: [standstill.id],
    };
    workflow.steps.splice(workflow.steps.indexOf(signing), 0, intermediate);
    signing.predecessorIds = [intermediate.id];

    expect(
      validateProcessMap(workflow, resolveLegalWaits(draft.context))
    ).toEqual([]);
  });

  it("rejects removal of a step governed by a required legal dependency", () => {
    const draft = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    const workflow =
      draft.alternatives.formalSequential.workflowDesign;
    const signing = workflow.steps.find(({ id }) =>
      id.endsWith(".public_it_contract_signing")
    );
    if (!signing) throw new Error("Expected the public IT signing step");

    workflow.steps = workflow.steps.filter(({ id }) => id !== signing.id);

    expect(
      validateProcessMap(workflow, resolveLegalWaits(draft.context))
    ).toContainEqual(
      expect.objectContaining({
        code: "missing_required_legal_ancestor",
        stepId: signing.id,
      })
    );
  });

  it("fails closed when the dependency contract is removed with the governed edge", () => {
    const draft = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    const workflow = draft.alternatives.formalSequential.workflowDesign;
    const signing = workflow.steps.find(({ id }) =>
      id.endsWith(".public_it_contract_signing")
    );
    if (!signing) throw new Error("Expected the public IT signing step");

    signing.predecessorIds = [];
    workflow.requiredLegalDependencies =
      workflow.requiredLegalDependencies?.filter(
        ({ stepId }) => stepId !== signing.id
      );

    expect(
      validateProcessMap(workflow, resolveLegalWaits(draft.context))
    ).toContainEqual(
      expect.objectContaining({
        code: "invalid_required_legal_dependency_contract",
      })
    );
    expect(() => buildCalculationInputFromDraft(draft)).toThrow();
    expect(() =>
      calculateComparison(draft as unknown as ComparisonCalculationInput)
    ).toThrow();
  });

  it("checks retargeted dependency metadata against the registered design", () => {
    const draft = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    const workflow = draft.alternatives.formalSequential.workflowDesign;
    const signing = workflow.steps.find(({ id }) =>
      id.endsWith(".public_it_contract_signing")
    );
    const standstill = workflow.steps.find(({ id }) =>
      id.endsWith(".standstill")
    );
    const signingDependency = workflow.requiredLegalDependencies?.find(
      ({ stepId }) => stepId === signing?.id
    );
    if (!signing || !standstill || !signingDependency) {
      throw new Error("Expected signing dependency fixtures");
    }

    const substitute = {
      ...structuredClone(signing),
      id: "user-step-substituted-for-signing-contract",
      predecessorIds: [standstill.id],
    };
    workflow.steps.splice(workflow.steps.indexOf(signing), 0, substitute);
    signing.predecessorIds = [];
    signingDependency.stepId = substitute.id;
    const registered = resolveWorkflowDesign(
      draft.designIds.workflow.formalSequential,
      draft.derivedFromScenarioId,
      "formalSequential"
    );

    expect(
      validateProcessMap(
        workflow,
        resolveLegalWaits(draft.context),
        registered.requiredLegalDependencies
      )
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid_required_legal_dependency_contract",
        }),
        expect.objectContaining({
          code: "missing_required_legal_ancestor",
          stepId: signing.id,
        }),
      ])
    );
    expect(() => buildCalculationInputFromDraft(draft)).toThrow();
    expect(() =>
      calculateComparison(draft as unknown as ComparisonCalculationInput)
    ).toThrow();

    workflow.registeredDesignId =
      "fleet_tco_reframing.workflow.formalSequential";
    expect(() =>
      calculateComparison(draft as unknown as ComparisonCalculationInput)
    ).toThrow();
  });

  it("rejects a materialized map of bare legal waits under nonlegal provenance", () => {
    const input = structuredClone(
      buildCalculationInputFromDraft(
        createScenarioDraft("public_it_open_with_market_consultation")
      )
    );
    for (const alternativeId of [
      "formalSequential",
      "adaptiveCompliant",
    ] as const) {
      const workflow = input.alternatives[alternativeId].workflowDesign;
      const legalSteps = workflow.steps.filter(
        ({ lockedLegalProvenance }) => lockedLegalProvenance
      );
      workflow.steps = legalSteps.map((step, index) => ({
        ...step,
        predecessorIds: index === 0 ? [] : [legalSteps[index - 1].id],
      }));
      workflow.requiredLegalDependencies = undefined;
      workflow.registeredDesignId =
        `fleet_tco_reframing.workflow.${alternativeId}`;
    }

    expect(() => calculateComparison(input)).toThrow(
      /materialized calculation input|registered legal dependency contract/i
    );
  });

  it("rejects a user draft even after its context and all legal waits are stripped", () => {
    const draft = createScenarioDraft(
      "public_it_open_with_market_consultation"
    );
    draft.context = createScenarioDraft("fleet_tco_reframing").context;
    for (const alternativeId of [
      "formalSequential",
      "adaptiveCompliant",
    ] as const) {
      const workflow = draft.alternatives[alternativeId].workflowDesign;
      const removedIds = new Set(
        workflow.steps
          .filter(({ lockedLegalProvenance }) => lockedLegalProvenance)
          .map(({ id }) => id)
      );
      workflow.steps = workflow.steps
        .filter(({ id }) => !removedIds.has(id))
        .map((step) => ({
          ...step,
          predecessorIds: step.predecessorIds.filter(
            (id) => !removedIds.has(id)
          ),
        }));
      workflow.requiredLegalDependencies = undefined;
      workflow.registeredDesignId = undefined;
    }

    expect(() =>
      calculateComparison(draft as unknown as ComparisonCalculationInput)
    ).toThrow(/materialized calculation input/i);
  });

  it("rejects an input whose positive materialization tag was removed", () => {
    const materialized = buildCalculationInputFromDraft(
      createScenarioDraft("fleet_tco_reframing")
    );
    const withoutTag: Partial<ComparisonCalculationInput> = {
      ...materialized,
    };
    delete withoutTag.kind;

    expect(() =>
      calculateComparison(withoutTag as ComparisonCalculationInput)
    ).toThrow(/materialized calculation input/i);
  });

  it("rejects relabelling a materialized input as a same-context scenario", () => {
    const input = structuredClone(
      buildCalculationInputFromDraft(
        createScenarioDraft("fleet_tco_reframing")
      )
    );
    input.registeredScenarioId = "stable_capex_replacement";

    expect(() => calculateComparison(input)).toThrow(
      /materialized calculation input/i
    );
  });

  it("rejects coordinated scenario relabelling and legal-wait removal after materialization", () => {
    const input = structuredClone(
      buildCalculationInputFromDraft(
        createScenarioDraft("public_it_open_with_market_consultation")
      )
    );
    input.registeredScenarioId = "fleet_tco_reframing";
    input.context = structuredClone(
      createScenarioDraft("fleet_tco_reframing").context
    );
    for (const alternativeId of [
      "formalSequential",
      "adaptiveCompliant",
    ] as const) {
      const workflow = input.alternatives[alternativeId].workflowDesign;
      const legalIds = new Set(
        workflow.steps
          .filter(({ lockedLegalProvenance }) => lockedLegalProvenance)
          .map(({ id }) => id)
      );
      workflow.steps = workflow.steps
        .filter(({ id }) => !legalIds.has(id))
        .map((step) => ({
          ...step,
          predecessorIds: step.predecessorIds.filter(
            (id) => !legalIds.has(id)
          ),
        }));
      workflow.requiredLegalDependencies = undefined;
      workflow.registeredDesignId = undefined;
    }

    expect(() => calculateComparison(input)).toThrow(
      /materialized calculation input/i
    );
  });

  it("rejects a nested cost mutation after materialization", () => {
    const input = structuredClone(
      buildCalculationInputFromDraft(
        createScenarioDraft("fleet_tco_reframing")
      )
    );
    input.dailyCostOfInaction.central += 1;

    expect(() => calculateComparison(input)).toThrow(
      /materialized calculation input/i
    );
  });

  it("rejects a copied object that did not cross the materialization boundary", () => {
    const input = buildCalculationInputFromDraft(
      createScenarioDraft("fleet_tco_reframing")
    );
    const copied = structuredClone(input);

    expect(() => calculateComparison(copied)).toThrow(
      /materialized calculation input/i
    );
  });

  it("deeply freezes a registered input so custom serialization cannot mask changes", () => {
    const input = buildCalculationInputFromDraft(
      createScenarioDraft("fleet_tco_reframing")
    );

    expect(Object.isFrozen(input)).toBe(true);
    expect(Object.isFrozen(input.context)).toBe(true);
    expect(Object.isFrozen(input.dailyCostOfInaction)).toBe(true);
    expect(() =>
      Object.defineProperty(input, "toJSON", {
        value: () => ({ registeredScenarioId: "fleet_tco_reframing" }),
      })
    ).toThrow();
    expect(() => calculateComparison(input)).not.toThrow();
  });

  it("uses one plain draft snapshot across validation and materialization", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    let reads = 0;
    Object.defineProperty(draft, "derivedFromScenarioId", {
      configurable: true,
      enumerable: true,
      get: () => {
        reads += 1;
        return reads <= 6
          ? "fleet_tco_reframing"
          : "stable_capex_replacement";
      },
    });

    const input = buildCalculationInputFromDraft(draft);

    expect(reads).toBe(1);
    expect(input.registeredScenarioId).toBe("fleet_tco_reframing");
    expect(() => calculateComparison(input)).not.toThrow();
  });
});
