import type { CalibratedValue } from "@/lib/model-v2/calibrated-value";
import { buildDecisionRecordV2 } from "@/lib/model-v2/decision-record";
import type { ProcessMapStep } from "@/lib/model-v2/domain";
import { createScenarioDraft } from "@/lib/model-v2/scenarios";

function fixed(value: number): CalibratedValue {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed",
    evidenceClass: "illustrative_scenario",
    evidenceIds: ["fixture.branch"],
  };
}

function calibrated(low: number, central: number, high: number): CalibratedValue {
  return {
    low,
    central,
    high,
    rangeKind: "calibrated",
    evidenceClass: "illustrative_scenario",
    evidenceIds: ["fixture.branch"],
  };
}

function branchSteps(topology: "branched" | "sequential"): ProcessMapStep[] {
  const steps: ProcessMapStep[] = [
    {
      id: "fixture.root",
      labelKey: "workflow.steps.fixture_root",
      userLabel: "Scope root",
      predecessorIds: [],
      activeDays: fixed(1),
      queueDays: fixed(0.5),
      roleHours: {
        buyer: calibrated(1, 2, 3),
        lawyer: fixed(0.5),
      },
      nonLabourCost: calibrated(10, 20, 30),
      kind: "activity",
    },
    {
      id: "fixture.long",
      labelKey: "workflow.steps.fixture_long",
      userLabel: "Long review",
      predecessorIds: ["fixture.root"],
      activeDays: calibrated(1, 5, 5),
      queueDays: fixed(0),
      roleHours: { manager: fixed(1) },
      nonLabourCost: fixed(0),
      kind: "approval",
    },
    {
      id: "fixture.short",
      labelKey: "workflow.steps.fixture_short",
      userLabel: "Variable review",
      predecessorIds:
        topology === "branched" ? ["fixture.root"] : ["fixture.long"],
      activeDays: calibrated(4, 4, 6),
      queueDays: fixed(0),
      roleHours: { requestor: fixed(1) },
      nonLabourCost: fixed(0),
      kind: "activity",
    },
    {
      id: "fixture.finish",
      labelKey: "workflow.steps.fixture_finish",
      userLabel: "Finish",
      predecessorIds:
        topology === "branched"
          ? ["fixture.long", "fixture.short"]
          : ["fixture.short"],
      activeDays: fixed(1),
      queueDays: fixed(0),
      roleHours: {},
      nonLabourCost: fixed(0),
      kind: "milestone",
    },
  ];
  return steps;
}

export function decisionRecordWithTopology(
  topology: "branched" | "sequential"
) {
  const draft = createScenarioDraft("fleet_tco_reframing");
  draft.alternatives.formalSequential.workflowDesign.steps = branchSteps(topology);
  return buildDecisionRecordV2(draft);
}
