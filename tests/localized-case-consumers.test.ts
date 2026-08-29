import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EnCaseStudiesPage from "@/app/(en)/en/case-studies/page";
import PlCaseStudiesPage from "@/app/(pl)/case-studies/page";
import MechanismsEvidencePage from "@/components/MechanismsEvidencePage";
import DecisionRecord from "@/components/decision-record/DecisionRecord";
import EvidenceDocket from "@/components/evidence/EvidenceDocket";
import { mechanismsEvidenceT, modelV2T } from "@/lib/i18n";
import {
  EVIDENCE_REGISTRY,
  buildDecisionRecordV2,
  buildPdfCopy,
  createScenarioDraft,
} from "@/lib/model-v2";

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

function modelCopy(lang: "pl" | "en", key: string): string {
  let value: unknown = modelV2T[lang];
  for (const segment of key.split(".")) {
    value = (value as Record<string, unknown>)[segment];
  }
  if (typeof value !== "string") throw new Error(`Missing ${lang} ${key}`);
  return value;
}

describe("localised English evidence consumers", () => {
  it("renders one shared five-record evidence register from both thin routes", () => {
    const polishRoute = renderToStaticMarkup(createElement(PlCaseStudiesPage));
    const englishRoute = renderToStaticMarkup(createElement(EnCaseStudiesPage));
    const polishShared = renderToStaticMarkup(
      createElement(MechanismsEvidencePage, { lang: "pl" })
    );
    const englishShared = renderToStaticMarkup(
      createElement(MechanismsEvidencePage, { lang: "en" })
    );

    expect(polishRoute).toBe(polishShared);
    expect(englishRoute).toBe(englishShared);
    for (const [lang, markup] of [
      ["pl", polishRoute],
      ["en", englishRoute],
    ] as const) {
      expect(renderedText(markup)).toContain(mechanismsEvidenceT[lang].title);
      expect(
        [...markup.matchAll(/data-evidence-id="([^"]+)"/g)].map(([, id]) => id)
      ).toEqual(EVIDENCE_REGISTRY.map(({ id }) => id));
      expect(markup.match(/data-evidence-id=/g)).toHaveLength(5);
    }
  });

  it("keeps supported and unsupported claims adjacent with population, constructs and source links", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(MechanismsEvidencePage, { lang })
      );
      for (const record of EVIDENCE_REGISTRY) {
        const supported = modelCopy(lang, record.supportedClaimKey);
        const unsupported = modelCopy(lang, record.unsupportedClaimKey);
        const population = modelCopy(lang, record.jurisdictionOrPopulationKey);
        const rowStart = markup.indexOf(`data-evidence-id="${record.id}"`);
        const supportedIndex = markup.indexOf(supported, rowStart);
        const unsupportedIndex = markup.indexOf(unsupported, rowStart);

        expect(rowStart, record.id).toBeGreaterThan(-1);
        expect(supportedIndex, record.supportedClaimKey).toBeGreaterThan(rowStart);
        expect(unsupportedIndex, record.unsupportedClaimKey).toBeGreaterThan(
          supportedIndex
        );
        expect(markup.indexOf(population, rowStart)).toBeGreaterThan(
          unsupportedIndex
        );
        expect(markup).toContain(`href="${record.sourceUrl}"`);
        for (const construct of record.constructs) {
          expect(markup).toContain(`data-evidence-construct="${construct}"`);
        }
      }
    }
  });

  it("keeps calculations, legacy cases and practitioner media out of the shared routes", () => {
    const ownedFiles = [
      "components/MechanismsEvidencePage.tsx",
      "app/(pl)/case-studies/page.tsx",
      "app/(en)/en/case-studies/page.tsx",
    ];

    for (const file of ownedFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(
        /calculateCosts|@\/lib\/scenarios|PROCESS_TYPE_META|TECH_LEVELS|PROCUREMENT_BEYOND_8|youtu(?:be|\.be)|Enforcement Fallacy/
      );
    }
    const markup = renderToStaticMarkup(
      createElement(MechanismsEvidencePage, { lang: "en" })
    );
    expect(markup).not.toMatch(/Enforcement Fallacy|5KYUdTLlvvg|data-result-reveal/);
    expect(markup).not.toContain("<table");
    expect(markup).not.toMatch(/bg-gradient|shadow-/);
    expect(markup).not.toContain("slate-");
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
