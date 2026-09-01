import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import DecisionRecord from "@/components/decision-record/DecisionRecord";
import { CalculatorWorkspaceView } from "@/components/calculator-v2/CalculatorWorkspace";
import { createCalculatorWorkspaceState } from "@/components/calculator-v2/editor-state";
import { submitCalculatorWorkspace } from "@/components/calculator-v2/workspace-validation";
import { createScenarioDraft } from "@/lib/model-v2";

const displayNames = {
  formalSequential: "Current workflow",
  adaptiveCompliant: "Pilot workflow",
};

function renderStage(
  activeStage: "case" | "workflows" | "costs" | "record",
  options: { submitted?: boolean } = {}
) {
  const initial = createCalculatorWorkspaceState(
    createScenarioDraft("fleet_tco_reframing")
  );
  const submission = options.submitted
    ? submitCalculatorWorkspace(initial)
    : null;
  const state =
    submission?.status === "submitted" ? submission.state : initial;
  return renderToStaticMarkup(
    createElement(CalculatorWorkspaceView, {
      activeStage,
      displayNames,
      lang: "en",
      onCopyBaseScenario: () => {},
      onDisplayNamesChange: () => {},
      onStageChange: () => {},
      onStateChange: () => {},
      resultSlot: state.record
        ? createElement(DecisionRecord, { lang: "en", record: state.record })
        : undefined,
      state,
    })
  );
}

describe("guided calculator UI", () => {
  it("renders a four-step semantic navigator and only the current panel", () => {
    const html = renderStage("case");

    expect(html).toContain('data-calculator-stage-nav="true"');
    expect(html.match(/data-calculator-stage=/g)).toHaveLength(4);
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('data-stage-panel="case"');
    expect(html).not.toContain('data-stage-panel="workflows"');
    expect(html).not.toContain('data-stage-panel="costs"');
    expect(html).not.toContain('data-stage-panel="record"');
  });

  it("keeps user names beside canonical alternative types", () => {
    const html = renderStage("workflows");

    expect(html).toContain('data-stage-panel="workflows"');
    expect(html).toContain('id="comparison-name-formalSequential"');
    expect(html).toContain('value="Current workflow"');
    expect(html).toContain('id="comparison-name-adaptiveCompliant"');
    expect(html).toContain('value="Pilot workflow"');
    expect(html).toContain("Formal sequential alternative");
    expect(html).toContain("Adaptive compliant alternative");
    expect(html).toContain('href="/en/assessment"');
  });

  it("shows essential economics before explicitly advanced assumptions", () => {
    const html = renderStage("costs");

    expect(html).toContain('data-stage-panel="costs"');
    expect(html).toContain("Contract value");
    expect(html).toContain("Daily cost of delay");
    expect(html).toContain('data-advanced-economics="true"');
    expect(html).toContain("Calculate and create decision record");
  });

  it("offers readiness only after a result exists", () => {
    const before = renderStage("costs");
    const after = renderStage("record", { submitted: true });

    expect(before).not.toContain('data-post-result-readiness="true"');
    expect(after).toContain('data-stage-panel="record"');
    expect(after).toContain('data-post-result-readiness="true"');
    expect(after).toContain('href="/en/readiness"');
  });

  it("passes the newly created record availability into the stage transition", () => {
    const source = readFileSync(
      "components/calculator-v2/CalculatorWorkspace.tsx",
      "utf8",
    );

    expect(source).toContain('onStageChange?.("record", true)');
  });

  it("keeps the visible stage in sync with browser hash navigation", () => {
    const source = readFileSync(
      "components/calculator-v2/CalculatorWorkspace.tsx",
      "utf8",
    );

    expect(source).toContain(
      'window.addEventListener("hashchange", syncStageFromHash)',
    );
    expect(source).toContain(
      'window.removeEventListener("hashchange", syncStageFromHash)',
    );
    expect(source).not.toContain(
      'window.dispatchEvent(new HashChangeEvent("hashchange"))',
    );
  });
});
