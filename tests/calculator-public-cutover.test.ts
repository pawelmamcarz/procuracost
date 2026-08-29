import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const LIVE_FILES = [
  "components/CalculatorClient.tsx",
  "components/EnCalculatorClient.tsx",
  "components/calculator-v2/CalculatorWorkspace.tsx",
  "components/CostComparison.tsx",
  "components/PDFExport.tsx",
  "components/cost-comparison/ResearchExportBar.tsx",
  "components/decision-record/AlternativeComparisonRows.tsx",
  "components/decision-record/AssumptionsRecord.tsx",
  "components/decision-record/CoverageRecord.tsx",
  "components/decision-record/DecisionRecord.tsx",
  "components/decision-record/DecisionRecordActions.tsx",
  "components/decision-record/DecisionRecordSummary.tsx",
  "components/decision-record/DriverAnalysis.tsx",
  "components/decision-record/ReferenceScenarioComparison.tsx",
  "components/decision-record/export-actions.ts",
  "components/decision-record/reference-scenarios.ts",
  "components/evidence/EvidenceDocket.tsx",
  "components/pdf/render-decision-record-pdf.ts",
] as const;

const RETIRED_LEAVES = [
  "HeroSummary",
  "CostTotals",
  "StepsTable",
  "CostMatrix",
  "DimensionCharts",
  "SensitivityChart",
  "DetailTable",
  "BenchmarkChart",
  "SourcesList",
  "PipeFieldExplainer",
] as const;

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("public calculator model 2.3 cutover", () => {
  it("removes every legacy calculation, scenario and URL-codec import from live calculator and result files", () => {
    for (const path of LIVE_FILES) {
      const content = source(path);
      expect(content, path).not.toContain('from "@/lib/calculations"');
      expect(content, path).not.toContain('from "@/lib/scenarios"');
      expect(content, path).not.toContain(
        'from "@/components/calculator-url"'
      );
      for (const leaf of RETIRED_LEAVES) {
        expect(content, path).not.toContain(
          `@/components/cost-comparison/${leaf}`
        );
      }
    }
  });

  it("keeps both language clients as stateless adapters over one shared workspace", () => {
    const polish = source("components/CalculatorClient.tsx");
    const english = source("components/EnCalculatorClient.tsx");

    expect(polish).toContain('<CalculatorWorkspace lang="pl" />');
    expect(english).toContain('<CalculatorWorkspace lang="en" />');
    for (const content of [polish, english]) {
      expect(content).not.toMatch(/useState|useRef|useSearchParams|dynamic\(/);
      expect(content).not.toMatch(/calculateCosts|ComparisonResult|ProcurementInputs/);
    }
  });

  it("renders the already submitted record and never rebuilds it in the workspace", () => {
    const workspace = source(
      "components/calculator-v2/CalculatorWorkspace.tsx"
    );

    expect(workspace).toContain("<DecisionRecord");
    expect(workspace).toContain("record={state.record}");
    expect(workspace).toContain("<DecisionRecordActions");
    expect(workspace).not.toContain("buildDecisionRecordV2");
  });

  it("retains async connection wrappers and routes both languages through their thin adapters", () => {
    const polish = source("app/(pl)/calculator/page.tsx");
    const english = source("app/(en)/en/calculator/page.tsx");

    expect(polish).toContain("await connection()");
    expect(polish).toContain("<CalculatorClient />");
    expect(english).toContain("await connection()");
    expect(english).toContain("<EnCalculatorClient />");
  });
});
