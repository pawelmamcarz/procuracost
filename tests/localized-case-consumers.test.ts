import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EnCaseStudiesPage from "@/app/(en)/en/case-studies/page";
import DecisionRecord from "@/components/decision-record/DecisionRecord";
import EvidenceDocket from "@/components/evidence/EvidenceDocket";
import {
  buildDecisionRecordV2,
  buildPdfCopy,
  createScenarioDraft,
} from "@/lib/model-v2";
import { SCENARIOS } from "@/lib/scenarios";

const EXPORTED_AT = "2026-08-28T14:05:06.000Z";

function fleetRecord() {
  return buildDecisionRecordV2(createScenarioDraft("fleet_tco_reframing"));
}

function renderedText(markup: string) {
  return markup
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
}

describe("localised English evidence consumers", () => {
  it("renders English titles and sources on the English case-study page", () => {
    const markup = renderedText(
      renderToStaticMarkup(createElement(EnCaseStudiesPage))
    );

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

  it("renders English model 2.3 record and supplied evidence copy", () => {
    const record = fleetRecord();
    const english = buildPdfCopy(record, "en", EXPORTED_AT);
    const polish = buildPdfCopy(record, "pl", EXPORTED_AT);
    const recordMarkup = renderedText(
      renderToStaticMarkup(
        createElement(DecisionRecord, { lang: "en", record })
      )
    );
    const evidenceMarkup = renderedText(
      renderToStaticMarkup(
        createElement(EvidenceDocket, {
          lang: "en",
          records: record.externalEvidence,
          variant: "full",
        })
      )
    );

    expect(recordMarkup).toContain(english.scenarioName);
    expect(recordMarkup).not.toContain(polish.scenarioName);
    expect(recordMarkup).toContain(english.externalEvidence[0].supportedClaim);
    expect(recordMarkup).not.toContain(
      polish.externalEvidence[0].supportedClaim
    );
    expect(evidenceMarkup).toContain(
      english.externalEvidence[0].unsupportedClaim
    );
    expect(evidenceMarkup).not.toContain(
      polish.externalEvidence[0].unsupportedClaim
    );
  });

  it("builds complete British-English PDF copy without legacy case-study prose", () => {
    const record = fleetRecord();
    const english = buildPdfCopy(record, "en", EXPORTED_AT);
    const polish = buildPdfCopy(record, "pl", EXPORTED_AT);
    const allEnglishCopy = JSON.stringify(english);

    expect(english.title).toBe("ProcuraCost model 2.3 decision record");
    expect(english.pageLabel(2, 4)).toBe("Page 2 of 4");
    expect(english.externalEvidence[0].supportedClaim).not.toBe(
      polish.externalEvidence[0].supportedClaim
    );
    expect(english.sectionLabels.coverage).toBe("Monetisation coverage");
    expect(allEnglishCopy).toMatch(/non-monetised/i);
    expect(allEnglishCopy).not.toMatch(/\bmonetized\b/i);
    expect(allEnglishCopy).not.toContain(polish.scenarioName);
  });
});
