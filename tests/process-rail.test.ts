import { describe, expect, it } from "vitest";

import {
  deriveRailLayout,
  type RailStepTextData,
} from "@/components/process-map/rail-layout";
import {
  createScenarioDraft,
  type ProcessMapStep,
  type WorkflowDesign,
} from "@/lib/model-v2";

function branchedWorkflow(): WorkflowDesign {
  const source = createScenarioDraft("fleet_tco_reframing")
    .alternatives.formalSequential.workflowDesign.steps.filter(
      (step) => !step.lockedLegalProvenance
    )
    .slice(0, 4);
  if (source.length < 4) throw new Error("Expected four fixture steps");
  const spec = [
    ["a", []],
    ["b", ["a"]],
    ["c", ["a"]],
    ["d", ["b", "c"]],
  ] as const;
  return {
    steps: spec.map(
      ([id, predecessorIds], index): ProcessMapStep => ({
        ...structuredClone(source[index]),
        id,
        predecessorIds: [...predecessorIds],
        userLabel: `Step ${id.toUpperCase()}`,
      })
    ),
  };
}

function textData(workflow: WorkflowDesign): Record<string, RailStepTextData> {
  return Object.fromEntries(
    workflow.steps.map((step) => [
      step.id,
      {
        label: step.userLabel ?? step.labelKey,
        predecessorNames: step.predecessorIds.map((id) => `Name ${id}`),
        lockText: step.id === "b" ? "Locked legal wait" : null,
        criticalText: step.id === "b" ? "Critical path" : null,
        invalidText: step.id === "c" ? "Needs correction" : null,
        selectedText: step.id === "c" ? "Selected" : null,
        accessibleName: `Accessible ${step.id}`,
      },
    ])
  );
}

describe("pure process-rail layout", () => {
  it("uses stable topological order, dependency depth, and array-order branch placement", () => {
    const workflow = branchedWorkflow();

    const layout = deriveRailLayout(workflow, {
      textByStepId: textData(workflow),
      selectedStepId: "c",
      criticalPathStepIds: ["a", "b", "d"],
      invalidStepIds: ["c"],
    });

    expect(layout.nodes.map(({ stepId }) => stepId)).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
    expect(
      layout.nodes.map(({ stepId, depth, branchIndex, branchCount }) => ({
        stepId,
        depth,
        branchIndex,
        branchCount,
      }))
    ).toEqual([
      { stepId: "a", depth: 0, branchIndex: 0, branchCount: 1 },
      { stepId: "b", depth: 1, branchIndex: 0, branchCount: 2 },
      { stepId: "c", depth: 1, branchIndex: 1, branchCount: 2 },
      { stepId: "d", depth: 2, branchIndex: 0, branchCount: 1 },
    ]);
    expect(layout.mobileSequence.map(({ stepId }) => stepId)).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
  });

  it("preserves predecessor and explicit lock, critical, invalid, and selected text data", () => {
    const workflow = branchedWorkflow();
    workflow.steps.find(({ id }) => id === "b")!.lockedLegalProvenance = {
      legalRulesetId: "pl-pzp-2026-2027",
      ruleId: "rule-b",
      provision: "Test provision",
      initiatedOn: "2026-08-28",
      lockedActiveDays: 0,
      lockedQueueDays: 1,
    };
    const copy = textData(workflow);

    const layout = deriveRailLayout(workflow, {
      textByStepId: copy,
      selectedStepId: "c",
      criticalPathStepIds: ["a", "b", "d"],
      invalidStepIds: ["c"],
    });
    const locked = layout.nodes.find(({ stepId }) => stepId === "b")!;
    const invalid = layout.nodes.find(({ stepId }) => stepId === "c")!;
    const merge = layout.nodes.find(({ stepId }) => stepId === "d")!;

    expect(locked).toMatchObject({
      predecessorIds: ["a"],
      predecessorNames: ["Name a"],
      locked: true,
      critical: true,
      lockText: "Locked legal wait",
      criticalText: "Critical path",
      accessibleName: "Accessible b",
    });
    expect(invalid).toMatchObject({
      selected: true,
      invalid: true,
      invalidText: "Needs correction",
      selectedText: "Selected",
      parallel: true,
    });
    expect(merge).toMatchObject({
      predecessorIds: ["b", "c"],
      predecessorNames: ["Name b", "Name c"],
      merge: true,
    });
    expect(copy.c).toEqual({
      label: "Step C",
      predecessorNames: ["Name a"],
      lockText: null,
      criticalText: null,
      invalidText: "Needs correction",
      selectedText: "Selected",
      accessibleName: "Accessible c",
    });
  });

  it("derives supplemental connectors without treating geometry as validation", () => {
    const workflow = branchedWorkflow();
    const layout = deriveRailLayout(workflow, {
      textByStepId: textData(workflow),
      criticalPathStepIds: ["a", "b", "d"],
      invalidStepIds: [],
      selectedStepId: null,
    });

    expect(
      layout.connectors.map(({ fromStepId, toStepId, critical }) => ({
        fromStepId,
        toStepId,
        critical,
      }))
    ).toEqual([
      { fromStepId: "a", toStepId: "b", critical: true },
      { fromStepId: "a", toStepId: "c", critical: false },
      { fromStepId: "b", toStepId: "d", critical: true },
      { fromStepId: "c", toStepId: "d", critical: false },
    ]);
  });

  it("keeps cyclic and unknown-predecessor nodes in deterministic mobile order without validating them", () => {
    const workflow = branchedWorkflow();
    workflow.steps[0].predecessorIds = ["d", "missing"];
    const copy = textData(workflow);
    copy.a.predecessorNames = ["Name d", "Missing predecessor"];

    const first = deriveRailLayout(workflow, {
      textByStepId: copy,
      criticalPathStepIds: [],
      invalidStepIds: ["a", "b", "c", "d"],
      selectedStepId: null,
    });
    const second = deriveRailLayout(workflow, {
      textByStepId: copy,
      criticalPathStepIds: [],
      invalidStepIds: ["a", "b", "c", "d"],
      selectedStepId: null,
    });

    expect(first).toEqual(second);
    expect(first.nodes.map(({ stepId }) => stepId)).toEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
    expect(first.nodes[0]).toMatchObject({
      predecessorIds: ["d", "missing"],
      predecessorNames: ["Name d", "Missing predecessor"],
      invalid: true,
    });
    expect(first.connectors.some(({ fromStepId }) => fromStepId === "missing")).toBe(
      false
    );
  });
});
