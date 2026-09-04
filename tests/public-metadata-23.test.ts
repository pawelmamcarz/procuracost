import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

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
  it("combines shared bilingual copy with exact canonical and Open Graph paths", () => {
    const cases = [
      [plHomeMetadata, siteMetadataT.pl.home, "/"],
      [enHomeMetadata, siteMetadataT.en.home, "/en"],
      [plCalculatorMetadata, siteMetadataT.pl.calculator, "/calculator"],
      [enCalculatorMetadata, siteMetadataT.en.calculator, "/en/calculator"],
      [plEvidenceMetadata, siteMetadataT.pl.mechanismsEvidence, "/case-studies"],
      [enEvidenceMetadata, siteMetadataT.en.mechanismsEvidence, "/en/case-studies"],
      [plAssessmentMetadata, siteMetadataT.pl.processDesignProfile, "/assessment"],
      [enAssessmentMetadata, siteMetadataT.en.processDesignProfile, "/en/assessment"],
    ] as const;

    for (const [metadata, copy, path] of cases) {
      expect(metadata).toMatchObject(copy);
      expect(metadata.alternates).toMatchObject({ canonical: path });
      expect(metadata.openGraph).toMatchObject({
        title: copy.title,
        description: copy.description,
        url: path,
      });
      expect(metadata.twitter).toMatchObject({
        title: copy.title,
        description: copy.description,
      });
    }
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
    expect(siteMetadataT.pl.home.description).toContain("wynik z założeniami");
    expect(siteMetadataT.en.home.description).toContain("result with its assumptions");
    expect(JSON.stringify(siteMetadataT)).not.toMatch(
      /wymiary niewycenione|unpriced dimensions/i,
    );
  });

  it("keeps social metadata route-local and the English locale British", () => {
    const plLayout = readFileSync("app/(pl)/layout.tsx", "utf8");
    const enLayout = readFileSync("app/(en)/layout.tsx", "utf8");

    for (const source of [plLayout, enLayout]) {
      expect(source).toContain("siteMetadataT");
      expect(source).not.toMatch(/const title|const description/);
      expect(source).not.toContain("openGraph:");
      expect(source).not.toContain("twitter:");
    }
    expect(enHomeMetadata.openGraph).toMatchObject({ locale: "en_GB" });
    expect(JSON.stringify(enHomeMetadata)).not.toContain("en_US");
  });

  it("builds every static public-page metadata export from the route manifest", () => {
    function sourceFiles(directory: string): string[] {
      return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? sourceFiles(path) : path.endsWith(".tsx") ? [path] : [];
      });
    }

    const rootLayouts = new Set(["app/(pl)/layout.tsx", "app/(en)/layout.tsx", "app/global-not-found.tsx"]);
    const metadataOwners = sourceFiles("app").filter((path) => {
      const source = readFileSync(path, "utf8");
      return source.includes("export const metadata") && !rootLayouts.has(path);
    });

    expect(metadataOwners.length).toBeGreaterThan(20);
    for (const path of metadataOwners) {
      expect(readFileSync(path, "utf8"), path).toContain("localizedPageMetadata");
    }
  });
});
