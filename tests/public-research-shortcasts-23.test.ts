import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ResearchPage, {
  metadata as researchMetadata,
} from "@/app/(en)/research/page";
import ResearchAgendaPage, {
  metadata as researchAgendaMetadata,
} from "@/app/(pl)/research-agenda/page";
import ShortcastEpisodePage from "@/app/(pl)/shortcasty/[slug]/page";
import ShortcastyEnPage from "@/app/(en)/en/shortcasty/page";
import ShortcastyPage from "@/app/(pl)/shortcasty/page";
import * as i18n from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { EPISODES } from "@/lib/shortcasty";

describe("model 2.3 research and editorial routes", () => {
  it("publishes the working paper from one model 2.3 English copy contract", () => {
    const copy = (
      i18n as typeof i18n & {
        researchPaperT?: {
          en: {
            title: string;
            abstract: readonly string[];
            modelContract: {
              title: string;
              items: readonly string[];
            };
            resultBoundary: {
              title: string;
              formula: string;
              body: string;
            };
            evidenceBoundary: {
              title: string;
              body: string;
            };
            practitionerBoundary: string;
            printAction: string;
          };
        };
      }
    ).researchPaperT?.en;

    expect(copy).toBeDefined();

    const markup = renderToStaticMarkup(createElement(ResearchPage));
    expect(researchMetadata.title).toContain(MODEL_V2_METADATA.modelVersion);
    expect(researchMetadata.description).toContain(
      "formal sequential and adaptive compliant",
    );
    expect(markup).toContain(copy!.title);
    expect(markup).toContain(copy!.resultBoundary.formula);
    expect(markup).toContain(copy!.practitionerBoundary.replace("&", "&amp;"));
    expect(markup).toContain(copy!.printAction);
    expect(markup).toContain("role effort");
    expect(markup).toContain("non-labour cost");
    expect(markup).toContain("non-monetised");
    expect(markup).not.toContain("Seven-dimension model");
    expect(markup).not.toContain("The optimizer uses");
    expect(markup).not.toMatch(/favo(?:u)?rs the (?:adaptive|formal) path/i);
  });

  it("keeps the Polish research agenda on the native model version and neutral scope", () => {
    const markup = renderToStaticMarkup(createElement(ResearchAgendaPage));

    expect(researchAgendaMetadata.title).toContain(
      MODEL_V2_METADATA.modelVersion,
    );
    expect(markup).toContain(`Model ${MODEL_V2_METADATA.modelVersion}`);
    expect(markup).toContain("wspólnych ramach prawnych i ładu zakupowego");
    expect(markup).toContain("możliwość odwrócenia znaku");
    expect(markup).not.toContain("modelu 2.2.2");
  });

  it("uses version-stable Shortcast identifiers and non-prescriptive editorial notes", () => {
    expect(EPISODES.length).toBeGreaterThan(0);

    for (const episode of EPISODES) {
      expect(episode.slug).not.toMatch(/model-\d+-\d+-\d+/);
      expect(episode).not.toHaveProperty("recommendation");
      expect(episode.practiceNote).toEqual(expect.any(String));
      expect(episode.practiceNoteEn).toEqual(expect.any(String));
      expect(episode.thesis).not.toMatch(/odporn(?:a|ej) rekomendacj/i);
      expect(episode.thesisEn).not.toMatch(/robust cost recommendation/i);
    }

    expect(EPISODES[0].title).toContain(MODEL_V2_METADATA.modelVersion);
    expect(EPISODES[0].titleEn).toContain(MODEL_V2_METADATA.modelVersion);
  });

  it("renders paired planned-topic copy without exposing unpublished detail links", () => {
    const polishMarkup = renderToStaticMarkup(createElement(ShortcastyPage));
    const englishMarkup = renderToStaticMarkup(createElement(ShortcastyEnPage));

    for (const episode of EPISODES.filter(({ publishedAt }) => !publishedAt)) {
      expect(polishMarkup).toContain(episode.practiceNote);
      expect(englishMarkup).toContain(episode.practiceNoteEn);
      expect(polishMarkup).not.toContain(
        `href="/shortcasty/${episode.slug}"`,
      );
      expect(englishMarkup).not.toContain(
        `href="/shortcasty/${episode.slug}"`,
      );
    }
  });

  it("renders published detail chrome from the shared Polish dictionary", async () => {
    const episode = EPISODES[0];
    const previousPublishedAt = episode.publishedAt;
    episode.publishedAt = "2026-08-29";

    try {
      const page = await ShortcastEpisodePage({
        params: Promise.resolve({ slug: episode.slug }),
      });
      const markup = renderToStaticMarkup(page);
      const detail = i18n.shortcastsT.pl.detail;

      expect(markup).toContain(detail.thesisLabel);
      expect(markup).toContain(detail.practiceNoteLabel);
      expect(markup).toContain(detail.calculatorTitle);
      expect(markup).toContain(episode.practiceNote);
      expect(markup).not.toContain("Rekomendacja");
    } finally {
      if (previousPublishedAt) episode.publishedAt = previousPublishedAt;
      else delete episode.publishedAt;
    }
  });
});
