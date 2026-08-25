import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import { decisionMapT, homeT, PHI_SET } from "@/lib/i18n";
import { SCENARIOS } from "@/lib/scenarios";
import { SITE_ROUTES } from "@/lib/site-routes";
import { MODEL_VERSION } from "@/lib/version";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];

  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function visibleStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value !== "object" || value === null) return [];

  return Object.values(value).flatMap(visibleStrings);
}

function renderedText(markup: string): string {
  return markup
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

describe("homepage content contract", () => {
  it("keeps Polish and English homepage dictionaries structurally aligned", () => {
    expect(leafPaths(homeT.en).sort()).toEqual(leafPaths(homeT.pl).sort());
  });

  it("uses the canonical tagline and bounded decision notation", () => {
    expect(homeT.pl.hero.tagline).toBe("Tunel ma ściany. Pole ma horyzont.");
    expect(homeT.en.hero.tagline).toBe("A tunnel has walls. A field has a horizon.");
    expect(homeT.pl.boundary.notation).toBe(PHI_SET.pl);
    expect(homeT.en.boundary.notation).toBe(PHI_SET.en);
    expect(homeT.pl.boundary.notation).toBe(
      "∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}",
    );
    expect(homeT.en.boundary.notation).toBe(
      "∂Φ = {auth, competition, ethics, docs}",
    );
    expect(visibleStrings(homeT).join(" ")).not.toContain("∞");
  });

  it("keeps the primary action neutral and the model version current", () => {
    expect(homeT.pl.hero.primaryAction).toBe("Policz własny scenariusz");
    expect(homeT.en.hero.primaryAction).toBe("Calculate your scenario");
    expect(homeT.pl.modelContract.modelVersion).toBe(MODEL_VERSION);
    expect(homeT.en.modelContract.modelVersion).toBe(MODEL_VERSION);
    expect(homeT.pl.hero.primaryAction).not.toMatch(/oszczęd|strat|wygr|przegr/i);
    expect(homeT.en.hero.primaryAction).not.toMatch(/sav|los|win/i);
  });

  it("does not promise to reveal organizational losses", () => {
    const copy = visibleStrings(homeT).join(" ");

    expect(copy).not.toMatch(/zobacz,? ile (?:twoja )?organizacja traci/i);
    expect(copy).not.toMatch(
      /see how much (?:your )?organi[sz]ation (?:is )?los(?:ing|es)/i,
    );
  });

  it("states the optimizer and delay-cost evidence limits", () => {
    expect(homeT.pl.jobs.choose.body).toMatch(/regułow/i);
    expect(homeT.pl.jobs.choose.body).toMatch(/nie był walidowany na danych wynikowych/i);
    expect(homeT.en.jobs.choose.body).toMatch(/rule-based/i);
    expect(homeT.en.jobs.choose.body).toMatch(/not been validated on outcome data/i);
    expect(homeT.pl.modelContract.note).toMatch(/tożsamością rachunkową/i);
    expect(homeT.pl.modelContract.note).toMatch(/nie efektem empirycznym/i);
    expect(homeT.en.modelContract.note).toMatch(/accounting identity/i);
    expect(homeT.en.modelContract.note).toMatch(/not an empirical effect/i);
  });

  it("provides English presentation fields for every case-study record", () => {
    const caseStudies = SCENARIOS.flatMap((scenario) =>
      scenario.caseStudy ? [scenario.caseStudy] : [],
    );

    expect(caseStudies.length).toBeGreaterThan(0);
    for (const caseStudy of caseStudies) {
      expect(caseStudy.titleEn).toEqual(expect.any(String));
      expect(caseStudy.titleEn.length).toBeGreaterThan(0);
      expect(caseStudy.sourceEn).toEqual(expect.any(String));
      expect(caseStudy.sourceEn.length).toBeGreaterThan(0);
    }
  });

  it("renders Polish scenario titles and English scenario titles and sources", () => {
    const polishMarkup = renderToStaticMarkup(createElement(EvidenceFieldHome, { lang: "pl" }));
    const englishMarkup = renderToStaticMarkup(createElement(EvidenceFieldHome, { lang: "en" }));
    const polishText = renderedText(polishMarkup);
    const englishText = renderedText(englishMarkup);
    const caseStudies = SCENARIOS.flatMap((scenario) =>
      scenario.caseStudy ? [scenario.caseStudy] : [],
    );

    for (const caseStudy of caseStudies) {
      expect(caseStudy.title).not.toBe(caseStudy.titleEn);
      expect(polishText).toContain(caseStudy.title);
      expect(polishText).toContain(caseStudy.source);
      expect(polishText).not.toContain(caseStudy.titleEn);
      expect(englishText).toContain(caseStudy.titleEn);
      expect(englishText).toContain(caseStudy.sourceEn);
      expect(englishText).not.toContain(caseStudy.title);
      if (caseStudy.source !== caseStudy.sourceEn) {
        expect(englishText).not.toContain(caseStudy.source);
      }
    }
  });

  it("owns and localizes the compact PLN presentation through homeT", () => {
    const polishMarkup = renderToStaticMarkup(createElement(EvidenceFieldHome, { lang: "pl" }));
    const englishMarkup = renderToStaticMarkup(createElement(EvidenceFieldHome, { lang: "en" }));

    expect(homeT.pl.scenarios.money).toEqual({
      locale: "pl-PL",
      currencyCode: "PLN",
      thousandSuffix: " tys.",
      millionSuffix: " mln",
    });
    expect(homeT.en.scenarios.money).toEqual({
      locale: "en-GB",
      currencyCode: "PLN",
      thousandSuffix: "k",
      millionSuffix: "M",
    });
    expect(polishMarkup).toContain("5,0 mln PLN");
    expect(polishMarkup).toContain("-39 tys.–662 tys. PLN");
    expect(polishMarkup).not.toContain("5.0M PLN");
    expect(englishMarkup).toContain("5.0M PLN");
    expect(englishMarkup).toContain("-39k–662k PLN");
  });

  it("renders the approved manager-first section order in both languages", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(createElement(EvidenceFieldHome, { lang }));
      const tx = homeT[lang];
      const orderedMarkers = [
        tx.hero.title,
        tx.boundary.title,
        tx.modelContract.title,
        tx.jobs.title,
        decisionMapT[lang].eyebrow,
        tx.scenarios.title,
        tx.evidence.title,
        tx.finalAction.title,
      ];

      let previousIndex = -1;
      for (const marker of orderedMarkers) {
        const currentIndex = markup.indexOf(marker);
        expect(currentIndex, marker).toBeGreaterThan(previousIndex);
        previousIndex = currentIndex;
      }
      expect(markup).toContain(tx.boundary.notation);
      expect(markup).toContain(`Model ${MODEL_VERSION}`);
      expect(markup).not.toContain("∞");
    }
  });

  it("renders localized scenario presentation and route-manifest links", () => {
    const markup = renderToStaticMarkup(createElement(EvidenceFieldHome, { lang: "en" }));
    const localizedScenario = SCENARIOS.find(({ id }) => id === "pipe_vs_field")!;
    const routeKeys = [
      "calculator",
      "optimizer",
      "assessment",
      "caseStudies",
      "model",
      "modelAssumptions",
      "methodology",
      "research",
    ];

    expect(markup).toContain(localizedScenario.caseStudy!.titleEn);
    expect(markup).toContain(localizedScenario.caseStudy!.sourceEn);
    expect(markup).not.toContain(localizedScenario.caseStudy!.title);
    expect(markup).not.toContain(localizedScenario.caseStudy!.source);

    for (const key of routeKeys) {
      const route = SITE_ROUTES.find((candidate) => candidate.key === key)!;
      const href = route.en ?? route.pl;
      expect(markup).toContain(`href="${href}"`);
    }
  });

  it("formats fractional scenario days without floating-point artifacts", () => {
    const polishMarkup = renderToStaticMarkup(createElement(EvidenceFieldHome, { lang: "pl" }));
    const englishMarkup = renderToStaticMarkup(createElement(EvidenceFieldHome, { lang: "en" }));

    expect(polishMarkup).toContain(">61,6<");
    expect(englishMarkup).toContain(">61.6<");
    expect(polishMarkup).not.toContain("61.599999999999994");
    expect(englishMarkup).not.toContain("61.599999999999994");
  });
});
