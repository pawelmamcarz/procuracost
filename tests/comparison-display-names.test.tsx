import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import DecisionRecord from "@/components/decision-record/DecisionRecord";
import { renderDecisionRecordPdf } from "@/components/pdf/render-decision-record-pdf";
import { buildPdfCopy, buildDecisionRecordV2, createScenarioDraft } from "@/lib/model-v2";
import {
  buildResearchCsv,
  buildResearchJson,
  buildResearchMarkdown,
} from "@/lib/research-export";

const displayNames = {
  formalSequential: "Current workflow",
  adaptiveCompliant: "Pilot workflow",
};

class TextOnlyPdf {
  readonly drawn: string[] = [];
  internal = {
    pageSize: {
      getWidth: () => 210,
      getHeight: () => 2000,
    },
  };
  setFont() { return this; }
  setFontSize() { return this; }
  setTextColor() { return this; }
  setDrawColor() { return this; }
  setLineWidth() { return this; }
  line() { return this; }
  splitTextToSize(value: string | string[]) { return Array.isArray(value) ? value : [value]; }
  text(value: string | string[]) {
    this.drawn.push(...(Array.isArray(value) ? value : [value]));
    return this;
  }
  addPage() { return this; }
  getNumberOfPages() { return 1; }
  setPage() { return this; }
}

describe("comparison display names", () => {
  it("shows user names beside canonical types in the visible record", () => {
    const record = buildDecisionRecordV2(
      createScenarioDraft("fleet_tco_reframing")
    );
    const html = renderToStaticMarkup(
      createElement(DecisionRecord, {
        displayNames,
        lang: "en",
        record,
      })
    );

    expect(html).toContain("Current workflow");
    expect(html).toContain("Pilot workflow");
    expect(html).toContain("Formal sequential alternative");
    expect(html).toContain("Adaptive compliant alternative");
  });

  it("decorates the PDF without changing canonical JSON, CSV or Markdown", () => {
    const record = buildDecisionRecordV2(
      createScenarioDraft("fleet_tco_reframing")
    );
    const copy = buildPdfCopy(record, "en", "2026-09-01T15:30:00.000Z");
    const doc = new TextOnlyPdf();

    renderDecisionRecordPdf(
      doc as unknown as Parameters<typeof renderDecisionRecordPdf>[0],
      copy,
      displayNames
    );
    const pdfText = doc.drawn.join(" ");
    const research = JSON.stringify(
      buildResearchJson(record, "en", "2026-09-01T15:30:00.000Z")
    );
    const csv = buildResearchCsv(record, "en");
    const markdown = buildResearchMarkdown(record, "en");

    expect(pdfText).toContain("Current workflow");
    expect(pdfText).toContain("Pilot workflow");
    expect(pdfText).toContain("Formal sequential alternative");
    expect(pdfText).toContain("Adaptive compliant alternative");
    expect(research).not.toContain("Current workflow");
    expect(research).not.toContain("Pilot workflow");
    expect(csv).not.toContain("Current workflow");
    expect(csv).not.toContain("Pilot workflow");
    expect(markdown).not.toContain("Current workflow");
    expect(markdown).not.toContain("Pilot workflow");
    expect(csv).toContain("formalSequential");
    expect(csv).toContain("adaptiveCompliant");
    expect(markdown).toContain("formalSequential");
    expect(markdown).toContain("adaptiveCompliant");
  });
});
