import { describe, expect, it } from "vitest";

import { assertValidCalibratedValue } from "@/lib/model-v2/calibrated-value";
import {
  MODEL_V2_METADATA,
  createComparisonAlternatives,
  type ContractDesign,
  type WorkflowDesign,
} from "@/lib/model-v2/domain";
import { resolveLegalWaits } from "@/lib/model-v2/legal";
import {
  assertValidProcessMap,
  createLockedLegalWaitStep,
} from "@/lib/model-v2/process-map";
import type { CalibratedValue } from "@/lib/model-v2/calibrated-value";
import type { ProcessMapStep } from "@/lib/model-v2/domain";
import { buildCalculationInputFromDraft } from "@/lib/model-v2/calculation-input";
import {
  calculateComparison,
  calculateSwappedComparisonForDiagnostics,
} from "@/lib/model-v2/engine";
import { createScenarioDraft } from "@/lib/model-v2/scenarios";

function fixed(value: number): CalibratedValue {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed",
    evidenceClass: "illustrative_scenario",
    evidenceIds: ["fixture.fixed"],
  };
}

function calibrated(low: number, central: number, high: number): CalibratedValue {
  return {
    low,
    central,
    high,
    rangeKind: "calibrated",
    evidenceClass: "illustrative_scenario",
    evidenceIds: ["fixture.calibrated"],
  };
}

function activityStep(
  id: string,
  predecessorIds: string[] = [],
  activeDays = 1
): ProcessMapStep {
  return {
    id,
    labelKey: `fixture.${id}`,
    predecessorIds,
    activeDays: fixed(activeDays),
    queueDays: fixed(0),
    roleHours: {},
    nonLabourCost: fixed(0),
    kind: "activity",
  };
}

describe("model 2.3 calibrated values", () => {
  it("rejects an interval whose central value is outside its bounds", () => {
    expect(() =>
      assertValidCalibratedValue({
        low: 5,
        central: 4,
        high: 8,
        rangeKind: "calibrated",
        evidenceClass: "illustrative_scenario",
        evidenceIds: ["fixture.range"],
      })
    ).toThrow(/low.*central.*high/i);
  });

  it("rejects a fixed value whose bounds differ", () => {
    expect(() =>
      assertValidCalibratedValue({
        low: 5,
        central: 5,
        high: 6,
        rangeKind: "fixed",
        evidenceClass: "legal_rule",
        evidenceIds: ["fixture.fixed"],
      })
    ).toThrow(/fixed/i);
  });

  it("rejects unknown range and evidence classes at runtime", () => {
    const base = calibrated(1, 2, 3);

    expect(() =>
      assertValidCalibratedValue({
        ...base,
        rangeKind: "estimated" as CalibratedValue["rangeKind"],
      })
    ).toThrow(/range kind/i);
    expect(() =>
      assertValidCalibratedValue({
        ...base,
        evidenceClass: "anecdote" as CalibratedValue["evidenceClass"],
      })
    ).toThrow(/evidence class/i);
  });

  it("rejects malformed evidence identifiers while allowing an empty user-input list", () => {
    expect(() =>
      assertValidCalibratedValue({
        ...calibrated(1, 2, 3),
        evidenceIds: ["fixture.valid", ""],
      })
    ).toThrow(/evidence identifiers/i);
    expect(() =>
      assertValidCalibratedValue({
        ...calibrated(1, 2, 3),
        evidenceIds: "fixture.invalid" as unknown as string[],
      })
    ).toThrow(/evidence identifiers/i);
    expect(() =>
      assertValidCalibratedValue({
        ...calibrated(1, 2, 3),
        evidenceClass: "user_input",
        evidenceIds: [],
      })
    ).not.toThrow();
  });
});

describe("model 2.3 domain contract", () => {
  it("creates independent alternatives with the same contract design by default", () => {
    const workflowDesign: WorkflowDesign = { steps: [] };
    const contractDesign: ContractDesign = {
      dimensions: [
        {
          id: "informal_bypass",
          status: "notMonetized",
          reasonKey: "model.dimensions.informalBypass.unpriced",
          evidenceIds: [],
        },
      ],
    };

    const alternatives = createComparisonAlternatives(
      {
        formalSequential: workflowDesign,
        adaptiveCompliant: workflowDesign,
      },
      contractDesign
    );

    expect(MODEL_V2_METADATA).toEqual({
      schemaVersion: 2,
      modelVersion: "2.3.0",
      calibrationId: "source-scenario-2026-08-28",
      legalRulesetId: "pl-pzp-2026-2027",
    });
    expect(alternatives.formalSequential.contractDesign).toEqual(
      alternatives.adaptiveCompliant.contractDesign
    );
    expect(alternatives.formalSequential.contractDesign).not.toBe(
      alternatives.adaptiveCompliant.contractDesign
    );
    expect(alternatives.formalSequential.contractDesign.dimensions).not.toBe(
      alternatives.adaptiveCompliant.contractDesign.dimensions
    );
    expect(alternatives.formalSequential.workflowDesign).not.toBe(
      alternatives.adaptiveCompliant.workflowDesign
    );
    expect(alternatives.formalSequential.workflowDesign.steps).not.toBe(
      alternatives.adaptiveCompliant.workflowDesign.steps
    );
  });
});

describe("model 2.3 legal resolution", () => {
  it("resolves versioned EU-open waits from the explicit initiation date", () => {
    const waits = resolveLegalWaits({
      boundaryId: "pzp_classic_eu",
      procedureFamilyId: "pzp_open",
      initiatedOn: "2026-08-28",
      legalRulesetId: "pl-pzp-2026-2027",
      buyerRegime: "classic",
      procurementObject: "supplies_services",
      communicationMethod: "electronic",
    });

    expect(
      waits.map((wait) => ({
        id: wait.id,
        queueDays: wait.queueDays.central,
        provision: wait.provenance.provision,
      }))
    ).toEqual([
      {
        id: "legal.pzp_open.bid_submission",
        queueDays: 35,
        provision: "PZP art. 138 ust. 1",
      },
      {
        id: "legal.pzp_open.standstill",
        queueDays: 10,
        provision: "PZP art. 264 ust. 1",
      },
    ]);
  });

  it.each(["sectoral", "defence_security"] as const)(
    "fails closed for the out-of-scope %s regime",
    (buyerRegime) => {
      expect(() =>
        resolveLegalWaits({
          boundaryId: "pzp_classic_eu",
          procedureFamilyId: "pzp_open",
          initiatedOn: "2026-08-28",
          legalRulesetId: "pl-pzp-2026-2027",
          buyerRegime,
        })
      ).toThrow(/outside.*scope/i);
    }
  );

  it("rejects a procedure that is illegal under the selected boundary", () => {
    expect(() =>
      resolveLegalWaits({
        boundaryId: "private_policy",
        procedureFamilyId: "pzp_open",
        initiatedOn: "2026-08-28",
        legalRulesetId: "pl-pzp-2026-2027",
      })
    ).toThrow(/procedure.*boundary/i);
  });

  it("rejects dates outside the versioned ruleset instead of reading the clock", () => {
    expect(() =>
      resolveLegalWaits({
        boundaryId: "pzp_classic_national",
        procedureFamilyId: "pzp_basic",
        initiatedOn: "2028-01-01",
        legalRulesetId: "pl-pzp-2026-2027",
        buyerRegime: "classic",
      })
    ).toThrow(/initiatedOn.*ruleset/i);
  });

  it("fails closed when pzp_basic omits the procurement object", () => {
    expect(() =>
      resolveLegalWaits({
        boundaryId: "pzp_classic_national",
        procedureFamilyId: "pzp_basic",
        initiatedOn: "2026-08-28",
        legalRulesetId: "pl-pzp-2026-2027",
        buyerRegime: "classic",
        communicationMethod: "electronic",
      })
    ).toThrow(/procurementObject.*required.*pzp_basic/i);
  });

  it.each([
    ["pzp_classic_national", "pzp_basic"],
    ["pzp_classic_eu", "pzp_open"],
    ["pzp_classic_eu", "pzp_restricted"],
  ] as const)(
    "fails closed when %s/%s omits the communication method",
    (boundaryId, procedureFamilyId) => {
      expect(() =>
        resolveLegalWaits({
          boundaryId,
          procedureFamilyId,
          initiatedOn: "2026-08-28",
          legalRulesetId: "pl-pzp-2026-2027",
          buyerRegime: "classic",
          procurementObject: "supplies_services",
        })
      ).toThrow(
        new RegExp(`communicationMethod.*required.*${procedureFamilyId}`, "i")
      );
    }
  );
});

describe("model 2.3 process-map validation", () => {
  it("rejects an unknown predecessor", () => {
    expect(() =>
      assertValidProcessMap({
        steps: [activityStep("award", ["missing-evaluation"])],
      })
    ).toThrow(/unknown predecessor/i);
  });

  it("rejects a cycle", () => {
    expect(() =>
      assertValidProcessMap({
        steps: [activityStep("a", ["b"]), activityStep("b", ["a"])],
      })
    ).toThrow(/cycle/i);
  });

  it("rejects any change to a resolved mandatory legal wait", () => {
    const waits = resolveLegalWaits({
      boundaryId: "pzp_classic_eu",
      procedureFamilyId: "pzp_open",
      initiatedOn: "2026-08-28",
      legalRulesetId: "pl-pzp-2026-2027",
      buyerRegime: "classic",
      communicationMethod: "electronic",
    });
    const steps = waits.map((wait) => createLockedLegalWaitStep(wait));

    steps[0] = {
      ...steps[0],
      queueDays: fixed(34),
    };

    expect(() => assertValidProcessMap({ steps }, waits)).toThrow(
      /locked legal wait/i
    );
  });

  it("rejects removal of a resolved mandatory legal wait", () => {
    const waits = resolveLegalWaits({
      boundaryId: "pzp_classic_eu",
      procedureFamilyId: "pzp_open",
      initiatedOn: "2026-08-28",
      legalRulesetId: "pl-pzp-2026-2027",
      buyerRegime: "classic",
      communicationMethod: "electronic",
    });
    const steps = [createLockedLegalWaitStep(waits[0])];

    expect(() => assertValidProcessMap({ steps }, waits)).toThrow(
      /missing locked legal wait/i
    );
  });

  it("rejects a graph that parallelises sequential mandatory waits", () => {
    const waits = resolveLegalWaits({
      boundaryId: "pzp_classic_eu",
      procedureFamilyId: "pzp_open",
      initiatedOn: "2026-08-28",
      legalRulesetId: "pl-pzp-2026-2027",
      buyerRegime: "classic",
      communicationMethod: "electronic",
    });
    const steps = waits.map((wait, index) =>
      createLockedLegalWaitStep(
        wait,
        index === 0 ? [] : [waits[index - 1].id]
      )
    );
    expect(() => assertValidProcessMap({ steps }, waits)).not.toThrow();

    steps[1] = { ...steps[1], predecessorIds: [] };

    expect(() => assertValidProcessMap({ steps }, waits)).toThrow(
      /mandatory legal wait.*must follow/i
    );
  });
});

describe("model 2.3 DAG engine", () => {
  it("uses the critical path for elapsed days and low, central, and high costs", () => {
    const first = activityStep("first");
    first.activeDays = calibrated(2, 3, 4);
    first.queueDays = fixed(1);
    first.roleHours = { buyer: calibrated(8, 10, 12) };
    first.nonLabourCost = calibrated(100, 150, 200);

    const workflowDesign: WorkflowDesign = {
      steps: [
        first,
        activityStep("long-branch", ["first"], 5),
        activityStep("short-branch", ["first"], 2),
        activityStep("finish", ["long-branch", "short-branch"], 1),
      ],
    };
    const emptyWorkflow: WorkflowDesign = { steps: [] };
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.alternatives.formalSequential.workflowDesign = workflowDesign;
    draft.alternatives.adaptiveCompliant.workflowDesign = emptyWorkflow;
    draft.roleHourlyRates = { buyer: fixed(100) };
    draft.economicAssumptions.dailyCostOfInaction = fixed(100);

    const result = calculateComparison(buildCalculationInputFromDraft(draft));

    expect(result.formalSequential.elapsedDays).toEqual({
      low: 9,
      central: 10,
      high: 11,
    });
    expect(result.formalSequential.totalCost).toEqual({
      low: 1_800,
      central: 2_150,
      high: 2_500,
    });
    expect(result.formalSequential.criticalPathStepIds.central).toEqual([
      "first",
      "long-branch",
      "finish",
    ]);
  });

  it("reports unpriced dimensions and includes priced contract dimensions", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.alternatives.formalSequential.workflowDesign = { steps: [] };
    draft.alternatives.adaptiveCompliant.workflowDesign = { steps: [] };
    draft.roleHourlyRates = {};
    draft.economicAssumptions.contractValue = fixed(100);
    draft.economicAssumptions.dailyCostOfInaction = fixed(0);
    draft.economicAssumptions.pathCompetitionDiffers = true;
    draft.economicAssumptions.competitionDisadvantagedAlternative =
      "formalSequential";
    draft.economicAssumptions.competitionTransferRate = calibrated(
      0.1,
      0.2,
      0.3
    );

    const result = calculateComparison(buildCalculationInputFromDraft(draft));

    expect(result.formalSequential.contractCost).toEqual({
      low: 10,
      central: 20,
      high: 30,
    });
    expect(result.formalSequential.totalCost).toEqual({
      low: 10,
      central: 20,
      high: 30,
    });
    expect(result.formalSequential.nonMonetizedDimensions).toEqual([
      {
        id: "informal_bypass",
        reasonKey: "reasons.bypassNotMonetized",
        evidenceIds: [],
      },
    ]);
  });

  it("preserves totals and reverses the outer envelope when paths are swapped", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.alternatives.formalSequential.workflowDesign = { steps: [] };
    draft.alternatives.adaptiveCompliant.workflowDesign = { steps: [] };
    draft.roleHourlyRates = {};
    draft.economicAssumptions.contractValue = fixed(100);
    draft.economicAssumptions.dailyCostOfInaction = fixed(0);
    draft.economicAssumptions.pathCompetitionDiffers = true;
    draft.economicAssumptions.competitionDisadvantagedAlternative =
      "formalSequential";
    draft.economicAssumptions.competitionTransferRate = calibrated(
      0.1,
      0.2,
      0.5
    );
    const input = buildCalculationInputFromDraft(draft);

    const original = calculateComparison(input);
    const swapped = calculateSwappedComparisonForDiagnostics(input);

    expect(swapped.formalSequential.totalCost).toEqual(
      original.adaptiveCompliant.totalCost
    );
    expect(swapped.adaptiveCompliant.totalCost).toEqual(
      original.formalSequential.totalCost
    );
    expect(original.deltaCost).toBe(20);
    expect(swapped.deltaCost).toBe(-20);
    expect(original.deltaCostOuterEnvelope).toEqual({ low: 10, high: 50 });
    expect(swapped.deltaCostOuterEnvelope).toEqual({ low: -50, high: -10 });
  });
});
