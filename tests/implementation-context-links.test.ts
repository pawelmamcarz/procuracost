import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import SiteFooter from "@/components/SiteFooter";
import TeamPage from "@/components/TeamPage";
import { footerT, homeT, teamT } from "@/lib/i18n";
import { navigationFor } from "@/lib/site-routes";

describe("implementation guidance discovery", () => {
  it("links readiness and practitioner material contextually from home and team", () => {
    for (const lang of ["pl", "en"] as const) {
      const readinessHref = lang === "en" ? "/en/readiness" : "/readiness";
      const practiceHref =
        lang === "en"
          ? "/en/practice/procurement-beyond-8"
          : "/practice/procurement-beyond-8";
      const home = renderToStaticMarkup(
        createElement(EvidenceFieldHome, { lang })
      );
      const team = renderToStaticMarkup(createElement(TeamPage, { lang }));

      for (const [markup, copy] of [
        [home, homeT[lang].implementation],
        [team, teamT[lang].implementation],
      ] as const) {
        expect(markup).toContain(copy.title);
        expect(markup).toContain(`href="${readinessHref}"`);
        expect(markup).toContain(`href="${practiceHref}"`);
        expect(markup).not.toMatch(/<table|bg-gradient|shadow-/);
      }
    }
  });

  it("keeps both resources outside primary navigation but visible in the footer", () => {
    for (const lang of ["pl", "en"] as const) {
      const navigationHrefs = navigationFor(lang).map(({ href }) => href);
      const readinessHref = lang === "en" ? "/en/readiness" : "/readiness";
      const practiceHref =
        lang === "en"
          ? "/en/practice/procurement-beyond-8"
          : "/practice/procurement-beyond-8";
      const footer = renderToStaticMarkup(createElement(SiteFooter, { lang }));

      expect(navigationHrefs).not.toContain(readinessHref);
      expect(navigationHrefs).not.toContain(practiceHref);
      expect(footer).toContain(`href="${readinessHref}"`);
      expect(footer).toContain(`href="${practiceHref}"`);
      expect(footer).toContain(footerT[lang].modelNote);
    }
  });

  it("keeps all footer copy in i18n", () => {
    const source = readFileSync("components/SiteFooter.tsx", "utf8");
    expect(source).not.toMatch(
      /Other projects:|Inne projekty:|Model informed by|Model oparty na|Sources & methodology|Źródła i metodologia/
    );
  });
});
