import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProcessMapEditor } from "@/components/calculator-v2/ProcessMapEditor";
import { createCalculatorWorkspaceState } from "@/components/calculator-v2/editor-state";
import { deriveProcessMapCriticalPathPreview } from "@/components/calculator-v2/process-map-preview";
import { bootstrapCalculatorUrl } from "@/components/calculator-v2/url-bootstrap";
import { createRenderableCalculatorWorkspaceState } from "@/components/calculator-v2/workspace-bootstrap";
import { createScenarioDraft } from "@/lib/model-v2";

describe("process-map calculation preview controller", () => {
  it("derives both critical paths through the reviewed calculation-input builder", () => {
    const preview = deriveProcessMapCriticalPathPreview(
      createCalculatorWorkspaceState(
        createScenarioDraft("fleet_tco_reframing")
      )
    );

    expect(preview.formalSequential.length).toBeGreaterThan(0);
    expect(preview.adaptiveCompliant.length).toBeGreaterThan(0);
  });

  it("fails closed for a blocked URL gate and renders no critical highlight", () => {
    const blocked = createRenderableCalculatorWorkspaceState(
      bootstrapCalculatorUrl(new URLSearchParams({ sid: "custom" }))
    );

    expect(deriveProcessMapCriticalPathPreview(blocked)).toEqual({
      formalSequential: [],
      adaptiveCompliant: [],
    });
    const html = renderToStaticMarkup(
      createElement(ProcessMapEditor, {
        lang: "en",
        state: blocked,
        onStateChange: () => {},
      })
    );
    expect(html).not.toContain("Critical path");
  });

  it("keeps manual calculation assembly out of the React component", () => {
    const source = readFileSync(
      "components/calculator-v2/ProcessMapEditor.tsx",
      "utf8"
    );

    expect(source).not.toMatch(/\bcalculateComparison\s*\(/);
    expect(source).toContain("deriveProcessMapCriticalPathPreview(state)");
  });
});
