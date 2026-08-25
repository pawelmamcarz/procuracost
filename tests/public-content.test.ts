import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import * as i18n from "@/lib/i18n";
import ShortcastyEnPage from "@/app/en/shortcasty/page";
import { EPISODES } from "@/lib/shortcasty";
import { MODEL_VERSION } from "@/lib/version";

const root = fileURLToPath(new URL("..", import.meta.url));

const currentPublicFiles = [
  "app/layout.tsx",
  "app/en/layout.tsx",
  "app/model/page.tsx",
  "app/en/model/page.tsx",
  "app/model/assumptions/layout.tsx",
  "app/en/model/assumptions/layout.tsx",
  "app/model/assumptions/page.tsx",
  "app/en/model/assumptions/page.tsx",
  "app/assessment/page.tsx",
  "app/en/assessment/page.tsx",
  "app/research-agenda/page.tsx",
  "app/shortcasty/page.tsx",
  "app/en/shortcasty/page.tsx",
  "app/shortcasty/[slug]/page.tsx",
  "lib/i18n.ts",
  "lib/shortcasty.ts",
  "lib/scenarios.ts",
] as const;

const historicalI18nAllowList = [
  "Wpisanie 0 odtwarza niedyskontowany model 2.1.",
  "Model 2.1 stosuje szerokie mnożniki kontekstu wyłącznie do nakładu pracy i niepracowniczego narzutu koordynacyjnego. Pozostałe mechanizmy mają odrębne profile; 1,00 oznacza brak korekty.",
  "Entering 0 reproduces the undiscounted 2.1 model.",
  "Model 2.1 applies broad context multipliers only to staff effort and non-labor coordination overhead. Other mechanisms use separate profiles; 1.00 means no adjustment.",
] as const;

const staleCurrentVersion = /\b(?:model 2\.1|modelu 2\.1|ProcuraCost 2\.1)\b/i;
const activeTeamPageFiles = ["app/team/page.tsx", "app/en/team/page.tsx"] as const;
const forbiddenTeamPhrases = [
  "pełne e2e kompletnego",
  "procurement ecosystem",
  "deep tech wizard",
] as const;

async function readPublicFile(path: string) {
  return readFile(new URL(path, `file://${root}/`), "utf8");
}

describe("public editorial integrity", () => {
  it("keeps current public surfaces on the active model version", async () => {
    for (const path of currentPublicFiles) {
      let content = await readPublicFile(path);
      if (path === "lib/i18n.ts") {
        for (const historicalSentence of historicalI18nAllowList) {
          content = content.replace(historicalSentence, "");
        }
      }

      expect(content, path).not.toMatch(staleCurrentVersion);
    }
  });

  it("does not advertise placeholder collection or distribution actions", async () => {
    for (const path of currentPublicFiles) {
      const content = await readPublicFile(path);
      expect(content, path).not.toContain("formspree.io/f/placeholder");
      expect(content, path).not.toMatch(/href:\s*["']#["']/);
    }
  });

  it("keeps current public prose free of em dashes", async () => {
    for (const path of currentPublicFiles) {
      expect(await readPublicFile(path), path).not.toContain("—");
    }
  });

  it("keeps active team pages free of inflated role claims", async () => {
    for (const path of activeTeamPageFiles) {
      const content = await readPublicFile(path);
      for (const phrase of forbiddenTeamPhrases) {
        expect(content, path).not.toContain(phrase);
      }
    }
  });

  it("keeps shared team copy structurally aligned in Polish and English", () => {
    expect(i18n).toHaveProperty("teamT");

    const teamT = i18n.teamT;
    expect(Object.keys(teamT.pl)).toEqual(Object.keys(teamT.en));
    expect(Object.keys(teamT.pl.roles)).toEqual(Object.keys(teamT.en.roles));
    expect(Object.keys(teamT.pl.competencies)).toEqual(Object.keys(teamT.en.competencies));
  });

  it("provides English content for every planned Shortcast", () => {
    expect(EPISODES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        titleEn: `ProcuraCost ${MODEL_VERSION}: what do we actually compare?`,
        dimensionEn: "Methodology",
        focusEn: "Methodological clarification",
      }),
      expect.objectContaining({
        titleEn: "Szucs: what does discretion cost in contractor selection?",
        dimensionEn: "Competition · Selection",
        focusEn: "Source review",
      }),
    ]));

    for (const episode of EPISODES) {
      expect(episode.titleEn).toEqual(expect.any(String));
      expect(episode.thesisEn).toEqual(expect.any(String));
      expect(episode.focusEn).toEqual(expect.any(String));
      expect(episode.titleEn).not.toBe(episode.title);
      expect(episode.thesisEn).not.toBe(episode.thesis);
    }
  });

  it("keeps Shortcast framing in the shared English dictionary", () => {
    expect(i18n).toHaveProperty("shortcastsT.en.plannedTopics", "Planned topics");
    expect(i18n).toHaveProperty("shortcastsT.en.focusLabel", "Focus");
  });

  it("renders planned Shortcasts in English", () => {
    const markup = renderToStaticMarkup(createElement(ShortcastyEnPage));
    const firstEpisode = EPISODES[0];

    expect(markup).toContain(firstEpisode.titleEn);
    expect(markup).toContain(firstEpisode.dimensionEn);
    expect(markup).toContain(firstEpisode.focusEn);
    expect(markup).toContain(firstEpisode.thesisEn);
    expect(markup).not.toContain(firstEpisode.title);
    expect(markup).not.toContain(firstEpisode.thesis);
  });
});
