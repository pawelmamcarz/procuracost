import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import ContextualToolNotice from "@/components/ContextualToolNotice";
import SiteFooter from "@/components/SiteFooter";
import { contextualToolT, footerT } from "@/lib/i18n";
import { navigationFor } from "@/lib/site-routes";

describe("contextual supporting tools", () => {
  it("returns case and workflow tools to their exact comparison stage", () => {
    const cases = [
      { stage: "case", hash: "case" },
      { stage: "workflows", hash: "workflows" },
    ] as const;

    for (const lang of ["pl", "en"] as const) {
      for (const { stage, hash } of cases) {
        const markup = renderToStaticMarkup(
          createElement(ContextualToolNotice, { lang, stage }),
        );
        const href = `${lang === "en" ? "/en" : ""}/calculator#${hash}`;

        expect(markup).toContain(`data-contextual-tool-stage="${stage}"`);
        expect(markup).toContain(contextualToolT[lang][stage].label);
        expect(markup).toContain(contextualToolT[lang][stage].body);
        expect(markup).toContain(`href="${href}"`);
      }
    }
  });

  it("keeps a calculator record in the previous tab while readiness stays standalone", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(ContextualToolNotice, {
          lang,
          returnMode: "previous-tab",
          stage: "record",
        }),
      );

      expect(markup).toContain('data-contextual-tool-stage="record"');
      expect(markup).toContain('data-contextual-tool-return="previous-tab"');
      expect(markup).not.toContain('/calculator#record');
    }
  });

  it("integrates the case, workflow and record notices with the relevant surfaces", () => {
    const suitability = readFileSync("components/SuitabilityComparison.tsx", "utf8");
    const assessment = readFileSync("components/AssessmentQuiz.tsx", "utf8");
    const readinessPl = readFileSync("app/(pl)/readiness/page.tsx", "utf8");
    const readinessEn = readFileSync("app/(en)/en/readiness/page.tsx", "utf8");

    expect(suitability).toContain('stage="case"');
    expect(assessment).toContain('stage="workflows"');
    expect(readinessPl).toContain('stage="record"');
    expect(readinessEn).toContain('stage="record"');
    expect(readinessPl).toContain('returnMode="previous-tab"');
    expect(readinessEn).toContain('returnMode="previous-tab"');
  });

  it("offers readiness only from a completed comparison record", () => {
    const unconditionalSources = [
      "components/AssessmentQuiz.tsx",
      "components/MethodologyOverview.tsx",
      "components/ModelOverview.tsx",
      "components/ProcurementBeyond8.tsx",
      "components/TeamPage.tsx",
    ];

    for (const sourcePath of unconditionalSources) {
      const source = readFileSync(sourcePath, "utf8");
      expect(source, sourcePath).not.toMatch(
        /href=\{(?:lang === "en" \? )?"?\/en\/readiness|\/readiness`|path: "readiness"|key: "readiness"/,
      );
    }
  });

  it("keeps supporting tools outside primary navigation and the quiet footer", () => {
    for (const lang of ["pl", "en"] as const) {
      const navigationHrefs = navigationFor(lang).map(({ href }) => href);
      const footer = renderToStaticMarkup(createElement(SiteFooter, { lang }));

      expect(navigationHrefs).toEqual([
        lang === "en" ? "/en/calculator" : "/calculator",
        lang === "en" ? "/en/model" : "/model",
      ]);
      expect(footer).not.toMatch(/href="(?:\/en)?\/(?:optimizer|assessment|readiness|practice)/);
      expect(footer).toContain(footerT[lang].modelNote);
      expect(footer).toContain(footerT[lang].localDraftNote);
    }
  });

  it("keeps all footer copy in i18n", () => {
    const source = readFileSync("components/SiteFooter.tsx", "utf8");
    expect(source).not.toMatch(
      /Other projects:|Inne projekty:|Model informed by|Model oparty na|Sources & methodology|Źródła i metodologia/,
    );
  });
});
