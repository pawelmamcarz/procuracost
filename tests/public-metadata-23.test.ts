import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { metadata as enAssessmentMetadata } from "@/app/(en)/en/assessment/page";
import { metadata as enCalculatorMetadata } from "@/app/(en)/en/calculator/layout";
import { metadata as enEvidenceMetadata } from "@/app/(en)/en/case-studies/page";
import { metadata as enHomeMetadata } from "@/app/(en)/en/page";
import { metadata as plAssessmentMetadata } from "@/app/(pl)/assessment/page";
import { metadata as plCalculatorMetadata } from "@/app/(pl)/calculator/layout";
import { metadata as plEvidenceMetadata } from "@/app/(pl)/case-studies/page";
import { metadata as plHomeMetadata } from "@/app/(pl)/page";
import { siteMetadataT } from "@/lib/i18n";

describe("professional model 2.3 metadata", () => {
  it("uses the shared bilingual metadata dictionary on every primary surface", () => {
    expect(plHomeMetadata).toEqual(siteMetadataT.pl.home);
    expect(enHomeMetadata).toEqual(siteMetadataT.en.home);
    expect(plCalculatorMetadata).toEqual(siteMetadataT.pl.calculator);
    expect(enCalculatorMetadata).toEqual(siteMetadataT.en.calculator);
    expect(plEvidenceMetadata).toEqual(siteMetadataT.pl.mechanismsEvidence);
    expect(enEvidenceMetadata).toEqual(siteMetadataT.en.mechanismsEvidence);
    expect(plAssessmentMetadata).toEqual(siteMetadataT.pl.processDesignProfile);
    expect(enAssessmentMetadata).toEqual(siteMetadataT.en.processDesignProfile);
  });

  it("removes legacy and inflated framing from titles and descriptions", () => {
    const copy = JSON.stringify(siteMetadataT);
    expect(copy).not.toMatch(
      /7 (?:wymiar|cost dimension)|Case Studies|full uncertainty|pełny zakres niepewności|maturity|dojrzałoś/i
    );
    expect(siteMetadataT.pl.mechanismsEvidence.title).toContain(
      "Mechanizmy i źródła"
    );
    expect(siteMetadataT.en.mechanismsEvidence.title).toContain(
      "Mechanisms and evidence"
    );
    expect(siteMetadataT.pl.processDesignProfile.title).toContain(
      "Profil projektu procesu zakupowego"
    );
    expect(siteMetadataT.en.processDesignProfile.title).toContain(
      "Procurement process design profile"
    );
  });

  it("uses root metadata copy from i18n and British English Open Graph locale", () => {
    const plLayout = readFileSync("app/(pl)/layout.tsx", "utf8");
    const enLayout = readFileSync("app/(en)/layout.tsx", "utf8");

    for (const source of [plLayout, enLayout]) {
      expect(source).toContain("siteMetadataT");
      expect(source).not.toMatch(/const title|const description/);
    }
    expect(enLayout).toContain('locale: "en_GB"');
    expect(enLayout).not.toContain('locale: "en_US"');
  });
});
