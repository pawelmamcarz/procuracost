import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AlternativeDesignControls } from "@/components/calculator-v2/AlternativeDesignControls";
import {
  CALCULATOR_RESULT_HEADING_ID,
  CalculatorResultBoundary,
  CalculatorWorkspaceView,
} from "@/components/calculator-v2/CalculatorWorkspace";
import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import { LegacyMigrationConfirmation } from "@/components/calculator-v2/LegacyMigrationConfirmation";
import { bootstrapCalculatorUrl } from "@/components/calculator-v2/url-bootstrap";
import {
  applyLegacyMigrationConfirmation,
  createRenderableCalculatorWorkspaceState,
} from "@/components/calculator-v2/workspace-bootstrap";
import {
  deriveCalculatorWorkspaceValidation,
  submitCalculatorWorkspace,
} from "@/components/calculator-v2/workspace-validation";
import { calculatorV2T } from "@/lib/i18n";
import {
  createScenarioDraft,
  encodeV2CalculatorState,
  stateForScenarioV2,
} from "@/lib/model-v2";

function renderWorkspace(
  state = createCalculatorWorkspaceState(
    createScenarioDraft("fleet_tco_reframing")
  ),
  lang: "pl" | "en" = "en",
  resultSlot?: ReturnType<typeof createElement>
) {
  return renderToStaticMarkup(
    createElement(CalculatorWorkspaceView, {
      lang,
      state,
      onStateChange: () => {},
      onCopyBaseScenario: () => {},
      resultSlot,
    })
  );
}

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

function exactFleetLegacyParams(): URLSearchParams {
  return new URLSearchParams({
    sid: "fleet",
    pt: "private_formal",
    tl: "partial_erp",
    cv: "5000000",
    tco: "2",
    dur: "2",
    dci: "5000",
    rc: "150000",
    bae: "500000",
    sh: "1:900,3:800,1:1200,1:900,1:1500,1:2500",
  });
}

describe("calculator workspace UI", () => {
  it("renders the professional three-stage workspace and exact context-axis order", () => {
    const html = renderWorkspace();
    const labels = [
      "Legal and governance boundary",
      "Procedure family",
      "Purchase archetype",
      "Purchase execution channel",
      "System support",
      "Initiated on",
    ];

    expect(html).toContain("Procurement process cost comparison");
    expect(html).toContain("Model 2.3.0");
    expect(html).toContain("1. Define the purchasing context");
    expect(html).toContain("2. Compare the alternative workflows");
    expect(html).toContain("3. Set the economic assumptions");
    expect(html).toContain("Fleet TCO reframing");
    labels.reduce((previousIndex, label) => {
      const index = html.indexOf(label);
      expect(index).toBeGreaterThan(previousIndex);
      return index;
    }, -1);
    expect(html).toContain("Resolved mandatory legal constraints");
    expect(html).toContain("Base-design provenance");
    expect(html).toContain("Role hourly rates");
  });

  it("shows compatible workflow and contract IDs as read-only provenance without design selectors", () => {
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const html = renderToStaticMarkup(
      createElement(AlternativeDesignControls, { lang: "en", state })
    );

    expect(html).toContain(
      "fleet_tco_reframing.workflow.formalSequential"
    );
    expect(html).toContain(
      "fleet_tco_reframing.contract.adaptiveCompliant"
    );
    expect(html).toContain("Procurement workflow design");
    expect(html).toContain("Contract design");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<option");
  });

  it("renders typed actionable validation and blocks calculation with an associated reason", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const invalid = calculatorWorkspaceReducer(initial, {
      type: "add-step",
      alternativeId: "formalSequential",
    });
    const html = renderWorkspace(invalid);

    expect(html).toContain('id="process-map-status"');
    expect(html).toContain('role="alert"');
    expect(html).toContain("The map needs correction");
    expect(html).toContain("Formal sequential alternative");
    expect(html).toContain("User-defined step");
    expect(html).toContain("Enter a name for the added step before calculation.");
    expect(html).toContain('aria-describedby="process-map-status"');
    expect(html).toContain("disabled");
    expect(html).toContain("Calculation is blocked until the listed issues are corrected.");
    expect(html).not.toContain("RAW ENGINE MESSAGE");
  });

  it("permits calculation for a valid default draft and keeps the exact local-only sharing disclosure", () => {
    const html = renderWorkspace();

    expect(html).toContain("Calculate and create decision record");
    expect(html).not.toMatch(/Calculate and create decision record<\/button>[^]*disabled/);
    expect(html).toContain("Copy base-scenario link");
    expect(html).toContain(
      "Process-map edits, custom step labels, the initiated-on date and economic assumptions remain only in this browser tab."
    );
    expect(html).not.toContain("Share comparison");
  });

  it("provides a typed result slot inside the single focusable reveal boundary", () => {
    const valid = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const submitted = submitCalculatorWorkspace(valid);
    if (submitted.status !== "submitted") {
      throw new Error("Expected valid record fixture");
    }
    const slot = createElement(
      "div",
      null,
      createElement(
        "h2",
        { id: CALCULATOR_RESULT_HEADING_ID },
        "Decision record fixture"
      )
    );
    const html = renderWorkspace(submitted.state, "en", slot);

    expect(html).toContain('id="decision-record"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain(
      `aria-labelledby="${CALCULATOR_RESULT_HEADING_ID}"`
    );
    expect(html).toContain('data-result-reveal="true"');
    expect(html).toContain("Decision record fixture");
    expect(html.match(/data-result-reveal/g)).toHaveLength(1);
  });

  it("keeps invalid v2 and blocked legacy URLs renderable but fail-closed", () => {
    const invalidV2Params = encodeV2CalculatorState(
      stateForScenarioV2("fleet_tco_reframing")
    );
    invalidV2Params.set("sid", "unknown-scenario");
    const invalidV2 = createRenderableCalculatorWorkspaceState(
      bootstrapCalculatorUrl(invalidV2Params)
    );
    const blockedLegacy = createRenderableCalculatorWorkspaceState(
      bootstrapCalculatorUrl(new URLSearchParams({ sid: "custom" }))
    );

    expect(invalidV2.draft.derivedFromScenarioId).toBe(
      "fleet_tco_reframing"
    );
    expect(invalidV2.urlOrigin).toBe("v2");
    expect(deriveCalculatorWorkspaceValidation(invalidV2).canSubmit).toBe(false);
    expect(blockedLegacy.urlOrigin).toBe("legacy");
    expect(deriveCalculatorWorkspaceValidation(blockedLegacy).canSubmit).toBe(
      false
    );
    expect(renderWorkspace(invalidV2)).toContain("The map needs correction");
    expect(renderWorkspace(blockedLegacy)).toContain("The map needs correction");
    expect(renderWorkspace(blockedLegacy)).toContain(
      "Discard imported link state and use this base scenario"
    );
  });

  it("hydrates the public workspace through the reviewed URL bootstrap without route duplication", () => {
    const source = readFileSync(
      "components/calculator-v2/CalculatorWorkspace.tsx",
      "utf8"
    );

    expect(source).toContain("bootstrapCalculatorUrl(");
    expect(source).toContain("createRenderableCalculatorWorkspaceState(");
    expect(source).toContain("window.location.search");
    expect(source).not.toContain("useSearchParams");
  });

  it("renders explicit partial-legacy confirmation with localised field names", () => {
    const bootstrap = bootstrapCalculatorUrl(
      new URLSearchParams({ sid: "erp" })
    );
    if (
      bootstrap.origin !== "legacy" ||
      bootstrap.result.status !== "partial"
    ) {
      throw new Error("Expected partial legacy fixture");
    }
    const html = renderToStaticMarkup(
      createElement(LegacyMigrationConfirmation, {
        lang: "en",
        result: bootstrap.result,
        confirmed: false,
        onConfirm: () => {},
      })
    );

    expect(html).toContain("Confirm migrated inputs");
    expect(html).toContain('id="migration-confirmation"');
    expect(html).toContain("Fields requiring confirmation");
    expect(html).toContain("retained legacy values");
    expect(html).toContain("Contract value");
    expect(html).toContain("Formal alternative process map");
    expect(html).toContain("Business requestor: daily rate");
    expect(html).not.toContain("retainedLegacyInputs.contractValue");
    expect(html).toContain(
      "The former result is not being reproduced. The inputs will be recalculated under model 2.3.0."
    );
  });

  it("materialises a confirmed representable migration and keeps an unrepresentable one blocked", () => {
    const representableParams = exactFleetLegacyParams();
    representableParams.set("cv", "5100000");
    const representableBootstrap = bootstrapCalculatorUrl(representableParams);
    if (representableBootstrap.origin !== "legacy") {
      throw new Error("Expected representable legacy fixture");
    }
    const ready = applyLegacyMigrationConfirmation(
      createRenderableCalculatorWorkspaceState(representableBootstrap),
      representableBootstrap.result,
      true
    );

    expect(ready.migration?.status).toBe("ready");
    expect(ready.urlGate).toMatchObject({
      kind: "legacy_migration",
      confirmed: true,
    });
    expect(ready.draft.economicAssumptions.contractValue.central).toBe(
      5_100_000
    );
    expect(deriveCalculatorWorkspaceValidation(ready).canSubmit).toBe(true);

    const blockedParams = exactFleetLegacyParams();
    blockedParams.set("tco", "4");
    const blockedBootstrap = bootstrapCalculatorUrl(blockedParams);
    if (blockedBootstrap.origin !== "legacy") {
      throw new Error("Expected blocked legacy fixture");
    }
    const blocked = applyLegacyMigrationConfirmation(
      createRenderableCalculatorWorkspaceState(blockedBootstrap),
      blockedBootstrap.result,
      true
    );
    expect(blocked.migration?.status).toBe("blocked");
    expect(deriveCalculatorWorkspaceValidation(blocked).canSubmit).toBe(false);
  });

  it("keeps the complete calculator-v2 dictionary in exact PL/EN leaf parity", () => {
    expect(leafPaths(calculatorV2T.pl).sort()).toEqual(
      leafPaths(calculatorV2T.en).sort()
    );
  });

  it("keeps the primary workspace free of rejected visual patterns", () => {
    const files = [
      "components/calculator-v2/CalculatorWorkspace.tsx",
      "components/calculator-v2/ContextAxes.tsx",
      "components/calculator-v2/AlternativeDesignControls.tsx",
      "components/calculator-v2/ProcessMapEditor.tsx",
      "components/calculator-v2/EconomicAssumptions.tsx",
      "components/process-map/ProcessStepNode.tsx",
    ];
    const source = files
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(source).not.toMatch(/gradient|shadow-|<table|grid-cols-5/);
    expect(source).not.toContain("overflow-x-auto");
    expect(
      readFileSync("components/process-map/ProcessRail.tsx", "utf8").match(
        /overflow-x-auto/g
      )
    ).toHaveLength(1);
  });
});

describe("calculator result boundary", () => {
  it("does not invent result content and renders only the supplied typed slot", () => {
    const html = renderToStaticMarkup(
      createElement(
        CalculatorResultBoundary,
        null,
        createElement(
          "h2",
          { id: CALCULATOR_RESULT_HEADING_ID },
          "Supplied result"
        )
      )
    );

    expect(html).toContain("Supplied result");
    expect(html).not.toContain("winner");
    expect(html).not.toContain("recommended");
  });
});
