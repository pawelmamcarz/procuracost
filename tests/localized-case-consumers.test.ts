import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EnCaseStudiesPage from "@/app/(en)/en/case-studies/page";
import * as pdfExport from "@/components/PDFExport";
import HeroSummary from "@/components/cost-comparison/HeroSummary";
import { calculateCosts } from "@/lib/calculations";
import { SCENARIOS, type Scenario } from "@/lib/scenarios";

type PdfCaseStudyRenderer = (
  doc: unknown,
  caseStudy: NonNullable<Scenario["caseStudy"]>,
  lang: "pl" | "en",
  box: { x: number; y: number; width: number },
) => void;

function distinctCaseStudyScenario() {
  return SCENARIOS.find((scenario) =>
    scenario.caseStudy
      && scenario.caseStudy.title !== scenario.caseStudy.titleEn
      && scenario.caseStudy.source !== scenario.caseStudy.sourceEn,
  )!;
}

function renderedText(markup: string) {
  return markup
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
}

describe("localized English case-study consumers", () => {
  it("renders English titles and sources on the English case-study page", () => {
    const markup = renderedText(renderToStaticMarkup(createElement(EnCaseStudiesPage)));

    for (const scenario of SCENARIOS) {
      if (!scenario.caseStudy) continue;
      expect(markup).toContain(scenario.caseStudy.titleEn);
      expect(markup).toContain(scenario.caseStudy.sourceEn);
      expect(markup).not.toContain(scenario.caseStudy.title);
      if (scenario.caseStudy.source !== scenario.caseStudy.sourceEn) {
        expect(markup).not.toContain(scenario.caseStudy.source);
      }
    }
  });

  it("renders English case evidence in the English calculator result", () => {
    const scenario = distinctCaseStudyScenario();
    const markup = renderedText(renderToStaticMarkup(createElement(HeroSummary, {
      result: calculateCosts(scenario.inputs),
      scenario,
      inputs: scenario.inputs,
      lang: "en",
    })));

    expect(markup).toContain(scenario.caseStudy!.titleEn);
    expect(markup).toContain(scenario.caseStudy!.sourceEn);
    expect(markup).not.toContain(scenario.caseStudy!.title);
    expect(markup).not.toContain(scenario.caseStudy!.source);
  });

  it("draws English case evidence into an English PDF", () => {
    const renderCaseStudyPdf = (pdfExport as typeof pdfExport & {
      renderCaseStudyPdf?: PdfCaseStudyRenderer;
    }).renderCaseStudyPdf;
    expect(renderCaseStudyPdf).toBeTypeOf("function");

    const drawnText: string[] = [];
    const doc = {
      setFillColor() {},
      setDrawColor() {},
      roundedRect() {},
      setTextColor() {},
      setFontSize() {},
      text(value: string) { drawnText.push(value); },
    };
    const scenario = distinctCaseStudyScenario();
    renderCaseStudyPdf!(doc, scenario.caseStudy!, "en", { x: 18, y: 24, width: 174 });
    const output = drawnText.join("\n");

    expect(output).toContain(scenario.caseStudy!.titleEn);
    expect(output).toContain(`Source: ${scenario.caseStudy!.sourceEn}`);
    expect(output).not.toContain(scenario.caseStudy!.title);
    expect(output).not.toContain(scenario.caseStudy!.source);
  });
});
