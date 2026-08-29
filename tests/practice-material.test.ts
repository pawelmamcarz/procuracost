import { createElement } from "react";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EnPracticePage, { metadata as enPracticeMetadata } from "@/app/(en)/en/practice/procurement-beyond-8/page";
import EnReadinessPage, { metadata as enReadinessMetadata } from "@/app/(en)/en/readiness/page";
import PlPracticePage, { metadata as plPracticeMetadata } from "@/app/(pl)/practice/procurement-beyond-8/page";
import PlReadinessPage, { metadata as plReadinessMetadata } from "@/app/(pl)/readiness/page";
import ProcurementBeyond8 from "@/components/ProcurementBeyond8";
import { practiceT, readinessT } from "@/lib/i18n";
import {
  EVIDENCE_REGISTRY,
  PRACTITIONER_SOURCES,
  PROCUREMENT_BEYOND_8,
} from "@/lib/model-v2/evidence";
import { READINESS_DOMAINS } from "@/lib/readiness";
import { EPISODES } from "@/lib/shortcasty";

const EXPECTED_REFS = [
  ["professionalisation", 271, 408],
  ["friction_mapping", 592, 656],
  ["marginal_requirements", 946, 1017],
  ["operational_purchasing", 1023, 1068],
  ["requirements_blind_spots", 1074, 1103],
  ["internal_challenger", 1639, 1689],
  ["internal_ambassador", 1707, 1746],
  ["champion_continuity", 1781, 1789],
  ["legacy_procedure", 2385, 2495],
  ["policy_boundary", 2614, 2659],
  ["tco", 2863, 2954],
  ["bielik", 3539, 3649],
  ["category_transfer", 3678, 3807],
  ["data_math_separation", 3810, 3954],
] as const;

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function html(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function stringLeaves(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value !== "object" || value === null) return [];
  return Object.values(value).flatMap(stringLeaves);
}

describe("Procurement&Beyond episode 8 source boundary", () => {
  it("registers the exact non-calibrating practitioner source and timestamp ranges", () => {
    expect(PROCUREMENT_BEYOND_8).toMatchObject({
      id: "procurement-beyond-8",
      kind: "practitioner_interview",
      title: "Procurement&Beyond, odcinek 8. Nawet najlepsze narzędzie nie uratuje złego wdrożenia.",
      author: "Procurement&Beyond",
      url: "https://www.youtube.com/watch?v=5KYUdTLlvvg",
      publishedAt: "2026-08-26",
      durationSeconds: 4026,
      transcriptKind: "youtube_auto_captions_pl",
      transcriptHumanVerified: false,
      calibrationEligible: false,
      permittedUse: "question_design_and_hypothesis_generation_only",
    });
    expect(PROCUREMENT_BEYOND_8.refs.map(({ id, startSeconds, endSeconds, url }) => [
      id,
      startSeconds,
      endSeconds,
      url,
    ])).toEqual(
      EXPECTED_REFS.map(([id, startSeconds, endSeconds]) => [
        id,
        startSeconds,
        endSeconds,
        `https://youtu.be/5KYUdTLlvvg?t=${startSeconds}`,
      ]),
    );
    expect(PRACTITIONER_SOURCES).toEqual([PROCUREMENT_BEYOND_8]);
  });

  it("resolves every readiness source reference without entering calibration or Shortcasty", () => {
    const sourceRefIds = new Set(PROCUREMENT_BEYOND_8.refs.map(({ id }) => id));

    for (const question of READINESS_DOMAINS.flatMap(({ questions }) => questions)) {
      expect(question.sourceRefIds.length, question.id).toBeGreaterThan(0);
      expect(question.sourceRefIds.every((id) => sourceRefIds.has(id)), question.id).toBe(true);
    }

    expect(EVIDENCE_REGISTRY.some(({ id }) => id === "procurement-beyond-8")).toBe(false);
    expect(EPISODES.some(({ slug }) => slug === "procurement-beyond-8")).toBe(false);
  });
});

describe("bilingual practitioner material", () => {
  it("keeps Polish and English practice copy structurally aligned", () => {
    expect(leafPaths(practiceT.en).sort()).toEqual(leafPaths(practiceT.pl).sort());
  });

  it("presents a practitioner interview in professional bilingual procurement language", () => {
    const polishCopy = stringLeaves(practiceT.pl).join("\n");
    const englishCopy = stringLeaves(practiceT.en).join("\n");

    expect(polishCopy).not.toMatch(
      /discovery|end-to-end|go-live|business case|rollout|big bang|source-to-pay|as-is\/to-be|fallback/i,
    );
    expect(englishCopy).not.toMatch(
      /discovery|end-to-end|go-live|business case|rollout|big bang|source-to-pay|as-is\/to-be|fallback/i,
    );
    expect(practiceT.pl.sourceNote).toContain("rozmowa branżowa");
    expect(practiceT.en.sourceNote).toContain("practitioner interview");
    expect(practiceT.pl.sourceNote).not.toContain("wywiad ekspercki");
    expect(practiceT.en.sourceNote).not.toContain("expert interview");
    expect(practiceT.pl.bielikTcoBoundary).toMatch(/model językowy nie oblicza wyniku/i);
    expect(practiceT.en.bielikTcoBoundary).toMatch(
      /language model does not calculate the result/i,
    );
  });

  it.each(["pl", "en"] as const)(
    "renders the %s material with a private lazy embed, source limits, and plain CTAs",
    (lang) => {
      const markup = renderToStaticMarkup(createElement(ProcurementBeyond8, { lang }));
      const tx = practiceT[lang];

      expect(markup).toContain("<iframe");
      expect(markup).toContain(`title="${html(tx.embedTitle)}"`);
      expect(markup).toContain('loading="lazy"');
      expect(markup).toContain("aspect-video");
      expect(markup).toMatch(/allowfullscreen=""/i);
      expect(markup).toContain('src="https://www.youtube-nocookie.com/embed/5KYUdTLlvvg"');
      expect(markup).not.toMatch(/embed\/5KYUdTLlvvg[^"']*autoplay=1/);
      expect(markup).toContain(tx.boundary.supportsTitle);
      expect(markup).toContain(tx.boundary.doesNotSupportTitle);
      expect(markup).toContain(tx.bielikTcoBoundary);
      expect(markup).toContain(html(tx.sourceNote));
      expect(markup).toContain(`href="${lang === "en" ? "/en/readiness" : "/readiness"}"`);
      expect(markup).toContain(`href="${lang === "en" ? "/en/calculator" : "/calculator"}"`);

      for (const ref of PROCUREMENT_BEYOND_8.refs) {
        expect(markup).toContain(`href="${ref.url}"`);
        expect(markup).toContain(practiceT[lang].sections[ref.id].title);
      }
    },
  );

  it("states on the English page that the recording is in Polish", () => {
    const markup = renderToStaticMarkup(createElement(ProcurementBeyond8, { lang: "en" }));
    expect(markup).toContain(practiceT.en.recordingLanguageNotice);
    expect(practiceT.en.recordingLanguageNotice).toMatch(/recording is in Polish/i);
  });
});

describe("readiness and practice routes", () => {
  it("creates all four App Router pages with localised static metadata", () => {
    for (const path of [
      "app/(pl)/readiness/page.tsx",
      "app/(en)/en/readiness/page.tsx",
      "app/(pl)/practice/procurement-beyond-8/page.tsx",
      "app/(en)/en/practice/procurement-beyond-8/page.tsx",
    ]) {
      expect(existsSync(path), path).toBe(true);
    }

    expect(plReadinessMetadata).toMatchObject(readinessT.pl.metadata);
    expect(enReadinessMetadata).toMatchObject(readinessT.en.metadata);
    expect(plPracticeMetadata).toMatchObject(practiceT.pl.metadata);
    expect(enPracticeMetadata).toMatchObject(practiceT.en.metadata);
  });

  it("renders the correct language variant on every route", () => {
    const plReadiness = renderToStaticMarkup(createElement(PlReadinessPage));
    const enReadiness = renderToStaticMarkup(createElement(EnReadinessPage));
    const plPractice = renderToStaticMarkup(createElement(PlPracticePage));
    const enPractice = renderToStaticMarkup(createElement(EnPracticePage));

    expect(plReadiness).toContain(readinessT.pl.title);
    expect(plReadiness).not.toContain(readinessT.en.title);
    expect(enReadiness).toContain(readinessT.en.title);
    expect(enReadiness).not.toContain(readinessT.pl.title);
    expect(plPractice).toContain(practiceT.pl.title);
    expect(enPractice).toContain(practiceT.en.title);
  });
});
