import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProcessRail } from "@/components/process-map/ProcessRail";
import {
  buildProcessRailViewModel,
  type ProcessRailViewModel,
} from "@/components/process-map/rail-view-model";
import {
  createScenarioDraft,
  type ProcessMapStep,
  type WorkflowDesign,
} from "@/lib/model-v2";

function branchedWorkflow(withLock = false): WorkflowDesign {
  const source = createScenarioDraft("fleet_tco_reframing")
    .alternatives.formalSequential.workflowDesign.steps.filter(
      (step) => !step.lockedLegalProvenance
    )
    .slice(0, 4);
  if (source.length < 4) throw new Error("Expected four fixture steps");
  const spec = [
    ["brief", []],
    ["legal", ["brief"]],
    ["market", ["brief"]],
    ["award", ["legal", "market"]],
  ] as const;
  const steps = spec.map(
    ([id, predecessorIds], index): ProcessMapStep => ({
      ...structuredClone(source[index]),
      id,
      predecessorIds: [...predecessorIds],
      userLabel: [
        "Define requirement",
        "Mandatory review",
        "Market engagement",
        "Contract award",
      ][index],
    })
  );
  if (withLock) {
    steps[1].kind = "legal_wait";
    steps[1].activeDays = {
      low: 0,
      central: 0,
      high: 0,
      rangeKind: "fixed",
      evidenceClass: "legal_rule",
      evidenceIds: ["legal-source"],
    };
    steps[1].queueDays = {
      low: 7,
      central: 7,
      high: 7,
      rangeKind: "fixed",
      evidenceClass: "legal_rule",
      evidenceIds: ["legal-source"],
    };
    steps[1].roleHours = {};
    steps[1].nonLabourCost = {
      low: 0,
      central: 0,
      high: 0,
      rangeKind: "fixed",
      evidenceClass: "legal_rule",
      evidenceIds: ["legal-source"],
    };
    steps[1].lockedLegalProvenance = {
      legalRulesetId: "pl-pzp-2026-2027",
      ruleId: "test-wait",
      provision: "Test provision",
      initiatedOn: "2026-08-28",
      lockedActiveDays: 0,
      lockedQueueDays: 7,
    };
  }
  return { steps };
}

function viewModel(lang: "pl" | "en" = "en"): ProcessRailViewModel {
  return buildProcessRailViewModel({
    lang,
    workflows: {
      formalSequential: branchedWorkflow(true),
      adaptiveCompliant: branchedWorkflow(false),
    },
    selectedAlternative: "formalSequential",
    selectedStepId: "market",
    criticalPathStepIds: {
      formalSequential: ["brief", "legal", "award"],
      adaptiveCompliant: ["brief", "market", "award"],
    },
    invalidStepIds: {
      formalSequential: ["market"],
      adaptiveCompliant: [],
    },
  });
}

function renderRail(model = viewModel()) {
  return renderToStaticMarkup(
    createElement(ProcessRail, {
      viewModel: model,
      mode: "editable",
      onSelectStep: () => {},
      onAddStep: () => {},
    })
  );
}

describe("process rail UI", () => {
  it("exports one resolved view model with professional lane labels and graph geometry", () => {
    const model = viewModel();

    expect(model.boundaryLabel).toBe("Shared legal and governance boundary");
    expect(model.lanes.formalSequential.label).toBe(
      "Formal sequential alternative"
    );
    expect(model.lanes.adaptiveCompliant.label).toBe(
      "Adaptive compliant alternative"
    );
    expect(model.lanes.formalSequential.nodes.map(({ stepId }) => stepId)).toEqual(
      ["brief", "legal", "market", "award"]
    );
    expect(model.lanes.formalSequential.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stepId: "legal",
          locked: true,
          critical: true,
          lockText: "Locked legal wait",
        }),
        expect.objectContaining({
          stepId: "market",
          parallel: true,
          invalid: true,
          selected: true,
          invalidText: "Needs correction",
        }),
        expect.objectContaining({
          stepId: "award",
          merge: true,
          predecessorNames: ["Mandatory review", "Market engagement"],
        }),
      ])
    );
    expect(model.lanes.formalSequential.canvasWidth).toBeGreaterThan(500);
    expect(model.lanes.formalSequential.canvasHeight).toBeGreaterThanOrEqual(224);
  });

  it("renders the shared boundary once, two written lane identities and supplemental SVG connectors", () => {
    const html = renderRail();

    expect(html.match(/Shared legal and governance boundary/g)).toHaveLength(1);
    expect(html).toContain("Formal sequential alternative");
    expect(html).toContain("Adaptive compliant alternative");
    expect(html).not.toContain(">formalSequential<");
    expect(html).not.toContain(">adaptiveCompliant<");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).toContain("<path");
    expect(html).not.toContain("<table");
  });

  it("keeps every editable node a native button with explicit non-colour status text", () => {
    const html = renderRail();

    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-controls="process-step-inspector"');
    expect(html).toContain("Locked legal wait");
    expect(html).toContain("Critical path");
    expect(html).toContain("Parallel branch");
    expect(html).toContain("Needs correction");
    expect(html).toContain("Selected");
    expect(html).toContain("Predecessors: Define requirement");
    expect(html).toContain(
      "Formal sequential alternative, step 3, Market engagement"
    );
  });

  it("uses the visible topological position in every node's accessible name", () => {
    const workflow = branchedWorkflow(false);
    workflow.steps = [
      workflow.steps[3],
      workflow.steps[0],
      workflow.steps[2],
      workflow.steps[1],
    ];
    const model = buildProcessRailViewModel({
      lang: "en",
      workflows: {
        formalSequential: workflow,
        adaptiveCompliant: structuredClone(workflow),
      },
      selectedAlternative: "formalSequential",
      selectedStepId: null,
      criticalPathStepIds: {
        formalSequential: [],
        adaptiveCompliant: [],
      },
      invalidStepIds: {
        formalSequential: [],
        adaptiveCompliant: [],
      },
    });

    expect(
      model.lanes.formalSequential.nodes.map(({ stepId }) => stepId)
    ).toEqual(["brief", "market", "legal", "award"]);
    for (const node of model.lanes.formalSequential.nodes) {
      expect(node.accessibleName).toContain(`step ${node.position},`);
    }
  });

  it("contains a focusable desktop graph viewport and a separate vertical mobile sequence", () => {
    const html = renderRail();

    expect(html).toContain('role="region"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("overflow-x-auto");
    expect(html).toContain("hidden lg:block");
    expect(html).toContain("lg:hidden");
    expect(html).toContain('data-mobile-sequence="true"');
    expect(html).toContain("Split");
    expect(html).toContain("Merge");
    expect(html).not.toContain("min-w-[");
  });

  it("gives the desktop and mobile copies of every editable node unique focus IDs", () => {
    const html = renderRail();

    expect(
      html.match(/id="process-step-formalSequential-brief"/g)
    ).toHaveLength(1);
    expect(
      html.match(/id="process-step-formalSequential-brief-mobile"/g)
    ).toHaveLength(1);
  });

  it("supports a read-only rail without editor actions or selection semantics", () => {
    const html = renderToStaticMarkup(
      createElement(ProcessRail, {
        viewModel: viewModel("pl"),
        mode: "read-only",
      })
    );

    expect(html).toContain("Wspólna granica prawna i ładu");
    expect(html).toContain("Formalna ścieżka sekwencyjna");
    expect(html).toContain("Adaptacyjna ścieżka zgodna z ramami");
    expect(html).toContain("Poprzednicy:");
    expect(html).not.toContain("Predecessors:");
    expect(html).not.toContain("Dodaj krok");
    expect(html).not.toContain("aria-pressed");
    expect(html).toContain(
      'id="process-step-formalSequential-brief" tabindex="0"'
    );
    expect(html).toContain(
      'id="process-step-formalSequential-brief-mobile" tabindex="0"'
    );
    expect(
      html.match(/id="process-step-formalSequential-brief"/g)
    ).toHaveLength(1);
    expect(
      html.match(/id="process-step-formalSequential-brief-mobile"/g)
    ).toHaveLength(1);
    const topologicalIds = ["brief", "legal", "market", "award"];
    topologicalIds.reduce((previousIndex, stepId) => {
      const index = html.indexOf(
        `id="process-step-formalSequential-${stepId}"`
      );
      expect(index).toBeGreaterThan(previousIndex);
      return index;
    }, -1);
  });
});
