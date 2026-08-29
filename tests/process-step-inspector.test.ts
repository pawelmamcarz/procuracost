import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProcessStepInspector } from "@/components/calculator-v2/ProcessStepInspector";
import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import { deriveCalculatorWorkspaceValidation } from "@/components/calculator-v2/workspace-validation";
import { createScenarioDraft } from "@/lib/model-v2";

function renderEditable(lang: "pl" | "en" = "en") {
  const initial = createCalculatorWorkspaceState(
    createScenarioDraft("fleet_tco_reframing")
  );
  const state = calculatorWorkspaceReducer(initial, {
    type: "add-step",
    alternativeId: "formalSequential",
  });
  if (!state.selectedStepId) throw new Error("Expected added selected step");
  return renderToStaticMarkup(
    createElement(ProcessStepInspector, {
      lang,
      state,
      issues: deriveCalculatorWorkspaceValidation(state).issues,
      onAction: () => {},
    })
  );
}

function renderLocked(lang: "pl" | "en" = "en") {
  const state = createCalculatorWorkspaceState(
    createScenarioDraft("public_it_open_with_market_consultation")
  );
  const locked = state.draft.alternatives.formalSequential.workflowDesign.steps.find(
    (step) => step.lockedLegalProvenance
  );
  if (!locked) throw new Error("Expected a locked legal step");
  state.selectedAlternative = "formalSequential";
  state.selectedStepId = locked.id;
  return renderToStaticMarkup(
    createElement(ProcessStepInspector, {
      lang,
      state,
      issues: [],
      onAction: () => {},
    })
  );
}

function renderSigning(lang: "pl" | "en" = "en") {
  const state = createCalculatorWorkspaceState(
    createScenarioDraft("public_it_open_with_market_consultation")
  );
  const signing = state.draft.alternatives.formalSequential.workflowDesign.steps.find(
    ({ id }) => id.endsWith(".public_it_contract_signing")
  );
  if (!signing) throw new Error("Expected the public IT signing step");
  state.selectedAlternative = "formalSequential";
  state.selectedStepId = signing.id;
  return renderToStaticMarkup(
    createElement(ProcessStepInspector, {
      lang,
      state,
      issues: [],
      onAction: () => {},
    })
  );
}

describe("process step inspector", () => {
  it("renders continuous editable fieldsets for identity, ranges, predecessors, roles and cost", () => {
    const html = renderEditable();

    expect(html).toContain('id="process-step-inspector"');
    expect(html).toContain("Edit step");
    expect(html).toContain("Identity");
    expect(html).toContain("Active work");
    expect(html).toContain("Waiting and queue");
    expect(html).toContain("Predecessors");
    expect(html).toContain("Role hours");
    expect(html).toContain("Non-labour cost");
    expect(html).toContain("Range and evidence note");
    expect(html).toContain("Changes apply to this comparison immediately");
    expect(html).toContain('type="number"');
    expect(html).toContain('inputMode="decimal"');
    expect(html).toContain('min="0"');
    expect(html).toContain("Low");
    expect(html).toContain("Central");
    expect(html).toContain("High");
    expect(html).toContain("Business requestor");
    expect(html).toContain("Buyer");
    expect(html).toContain("PLN");
    expect(html).not.toContain("<table");
  });

  it("associates the blank custom-label issue with the required label field", () => {
    const html = renderEditable();

    expect(html).toContain('id="process-step-label-formalSequential-user-step-1"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain(
      'aria-describedby="process-step-label-formalSequential-user-step-1-error"'
    );
    expect(html).toContain("Enter a name for the added step before calculation.");
    expect(html).toContain("Remove step");
  });

  it("renders predecessor checkboxes with the current step disabled, not a drag-only control", () => {
    const html = renderEditable();

    expect(html).toContain('<legend class="text-xs font-semibold');
    expect(html).toContain('type="checkbox"');
    expect(html).toMatch(/<input[^>]+disabled=""[^>]+value="user-step-1"/);
    expect(html).not.toContain("draggable");
    expect(html).not.toContain("drag handle");
  });

  it("disables removal of the sole direct path from a required legal ancestor", () => {
    const html = renderSigning();

    expect(html).toMatch(
      /<input[^>]+disabled=""[^>]+value="legal\.pzp_open\.standstill"/
    );
    expect(html).toContain("Required sequence after a mandatory legal wait");
    expect(html).not.toContain("Remove step");
  });

  it("renders a locked step as full read-only legal provenance with no edit or remove controls", () => {
    const html = renderLocked();

    expect(html).toContain("Locked legal wait");
    expect(html).toContain(
      "This step is fixed by the selected legal ruleset and cannot be edited or removed."
    );
    expect(html).toContain("pl-pzp-2026-2027");
    expect(html).toContain("Legal provision");
    expect(html).toContain("Initiated on");
    expect(html).toContain("Locked active work");
    expect(html).toContain("Locked waiting period");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("Remove step");
  });

  it("keeps Polish inspector copy fully localised", () => {
    const editable = renderEditable("pl");
    const locked = renderLocked("pl");
    const signing = renderSigning("pl");

    expect(editable).toContain("Edytuj krok");
    expect(editable).toContain("Wnioskodawca biznesowy");
    expect(editable).toContain("Usuń krok");
    expect(editable).not.toContain("Edit step");
    expect(locked).toContain("Zablokowany termin prawny");
    expect(locked).toContain("Podstawa prawna");
    expect(locked).not.toContain("Legal provision");
    expect(signing).toContain(
      "Wymagane następstwo po obowiązkowym terminie prawnym"
    );
    expect(signing).not.toContain(
      "Required sequence after a mandatory legal wait"
    );
  });
});
