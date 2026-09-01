import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CalculationResultBar from "@/components/decision-record/CalculationResultBar";
import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
  type CalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import { submitCalculatorWorkspace } from "@/components/calculator-v2/workspace-validation";
import { calculatorV2T, decisionRecordT } from "@/lib/i18n";
import { createScenarioDraft, type DecisionRecordV2 } from "@/lib/model-v2";

function calculatedState(): CalculatorWorkspaceState {
  const result = submitCalculatorWorkspace(
    createCalculatorWorkspaceState(createScenarioDraft("fleet_tco_reframing"))
  );
  if (result.status !== "submitted") {
    throw new Error("The fleet scenario must calculate from its base draft.");
  }
  return result.state;
}

function calculatedRecord(): DecisionRecordV2 {
  const record = calculatedState().record;
  if (!record) throw new Error("Expected a calculated record fixture.");
  return record;
}

function editedState(state: CalculatorWorkspaceState) {
  return calculatorWorkspaceReducer(state, {
    type: "replace-economic-assumptions",
    economicAssumptions: state.draft.economicAssumptions,
  });
}

describe("last calculation retained beside the decision record", () => {
  it("keeps no result before the first calculation", () => {
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );

    expect(state.record).toBeNull();
    expect(state.lastRecord).toBeNull();
  });

  it("retains the calculated record as the authoritative and the last result", () => {
    const state = calculatedState();

    expect(state.record).not.toBeNull();
    expect(state.lastRecord).toBe(state.record);
  });

  it("drops the authoritative record on a draft edit but retains the last result", () => {
    const state = editedState(calculatedState());

    expect(state.record).toBeNull();
    expect(state.lastRecord).not.toBeNull();
  });

  it("clears the last result when the base scenario is replaced", () => {
    const state = calculatorWorkspaceReducer(calculatedState(), {
      type: "replace-draft",
      draft: createScenarioDraft("mrp_release_control"),
      urlOrigin: "empty",
      urlGate: undefined,
      migration: null,
    });

    expect(state.record).toBeNull();
    expect(state.lastRecord).toBeNull();
  });

  it("restores a fresh authoritative record on recalculation", () => {
    const recalculated = submitCalculatorWorkspace(editedState(calculatedState()));

    expect(recalculated.status).toBe("submitted");
    if (recalculated.status !== "submitted") return;
    expect(recalculated.state.record).not.toBeNull();
    expect(recalculated.state.lastRecord).toBe(recalculated.state.record);
  });
});

describe("calculation result bar", () => {
  const record = calculatedRecord();

  function markup(lang: "pl" | "en", stale: boolean) {
    return renderToStaticMarkup(
      createElement(CalculationResultBar, {
        lang,
        record,
        stale,
        onOpenRecord: () => {},
        onRecalculate: () => {},
      })
    );
  }

  it("marks its freshness in text and in a stable data attribute", () => {
    const current = markup("pl", false);
    const stale = markup("pl", true);

    expect(current).toContain('data-calculation-result-bar="current"');
    expect(current).toContain(decisionRecordT.pl.resultBar.currentLabel);
    expect(stale).toContain('data-calculation-result-bar="stale"');
    expect(stale).toContain(decisionRecordT.pl.resultBar.staleLabel);
    expect(stale).toContain(decisionRecordT.pl.resultBar.staleNote);
  });

  it("stays in document flow on narrow screens and becomes sticky only on desktop", () => {
    const html = markup("pl", false);

    expect(html).toContain("lg:sticky");
    expect(html).toContain("lg:bottom-0");
    expect(html).not.toContain('class="sticky bottom-0');
  });

  it("offers recalculation only while the result is stale", () => {
    expect(markup("pl", true)).toContain(
      decisionRecordT.pl.resultBar.recalculate
    );
    expect(markup("pl", false)).not.toContain(
      decisionRecordT.pl.resultBar.recalculate
    );
    expect(markup("pl", false)).toContain(
      decisionRecordT.pl.resultBar.openRecord
    );
    expect(markup("pl", false)).toContain("<button");
    expect(markup("pl", false)).not.toContain('href="#decision-record"');
  });

  it("pairs both alternatives with equal visual status", () => {
    const html = markup("pl", false);

    expect(html).toContain(calculatorV2T.pl.alternatives.formalSequential);
    expect(html).toContain(calculatorV2T.pl.alternatives.adaptiveCompliant);
    expect(html.match(/h-8 w-0\.5 shrink-0 bg-red-500/g)).toHaveLength(1);
    expect(html.match(/h-8 w-0\.5 shrink-0 bg-green-500/g)).toHaveLength(1);
    expect(html.match(/font-mono text-sm tabular-nums text-gray-900/g)).toHaveLength(3);
  });

  it("keeps the difference neutral and never colours it as a verdict", () => {
    const html = markup("pl", false);

    expect(html).toContain("font-mono text-xl font-bold tabular-nums text-blue-700");
    expect(html).not.toMatch(/text-(?:red|green)-\d{3}/);
    expect(html).toContain(decisionRecordT.pl.resultBar.rangeLabel);
  });

  it("renders both languages from the paired dictionaries", () => {
    expect(markup("en", true)).toContain(
      decisionRecordT.en.resultBar.staleNote
    );
    expect(markup("en", false)).toContain(
      decisionRecordT.en.resultBar.openRecord
    );
  });
});
