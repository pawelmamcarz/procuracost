import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EvidenceDocket from "@/components/evidence/EvidenceDocket";
import { modelV2T } from "@/lib/i18n";
import { EVIDENCE_REGISTRY } from "@/lib/model-v2";

function text(markup: string) {
  return markup
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
}

function resolveModelCopy(lang: "pl" | "en", key: string): string {
  let current: unknown = modelV2T[lang];
  for (const segment of key.split(".")) {
    current = (current as Record<string, unknown>)[segment];
  }
  return current as string;
}

describe("evidence docket", () => {
  it("renders only supplied records and preserves their supplied registry order", () => {
    const supplied = [EVIDENCE_REGISTRY[2], EVIDENCE_REGISTRY[4]];
    const markup = renderToStaticMarkup(
      createElement(EvidenceDocket, {
        lang: "en",
        records: supplied,
        variant: "full",
      })
    );

    expect(markup.indexOf(supplied[0].id)).toBeLessThan(
      markup.indexOf(supplied[1].id)
    );
    expect(markup).not.toContain(EVIDENCE_REGISTRY[0].id);
    expect(markup).not.toContain(EVIDENCE_REGISTRY[1].id);
    expect(markup).not.toContain(EVIDENCE_REGISTRY[3].id);
  });

  it.each(["compact", "full", "decision-record"] as const)(
    "keeps supported and unsupported claims adjacent with source, population and constructs in the %s variant",
    (variant) => {
      const record = EVIDENCE_REGISTRY[1];
      for (const lang of ["pl", "en"] as const) {
        const markup = renderToStaticMarkup(
          createElement(EvidenceDocket, {
            lang,
            records: [record],
            variant,
          })
        );
        const rendered = text(markup);
        const supported = resolveModelCopy(lang, record.supportedClaimKey);
        const unsupported = resolveModelCopy(lang, record.unsupportedClaimKey);

        expect(markup).toContain(`data-evidence-variant="${variant}"`);
        expect(rendered).toContain(record.id);
        expect(rendered.indexOf(supported)).toBeLessThan(
          rendered.indexOf(unsupported)
        );
        expect(rendered).toContain(
          resolveModelCopy(lang, record.jurisdictionOrPopulationKey)
        );
        expect(rendered).toContain(
          resolveModelCopy(lang, record.source.titleKey)
        );
        expect(markup).toContain(`href="${record.sourceUrl}"`);
        for (const construct of record.constructs) {
          expect(markup).toContain(`data-evidence-construct="${construct}"`);
        }
      }
    }
  );

  it.each([
    { lang: "pl", visibleDate: "3 sierpnia 2022" },
    { lang: "en", visibleDate: "3 August 2022" },
  ] as const)(
    "formats a visible publication date for $lang while retaining ISO machine data",
    ({ lang, visibleDate }) => {
      const record = EVIDENCE_REGISTRY.find(
        ({ source }) => source.publishedOn === "2022-08-03"
      );
      if (!record) throw new Error("Expected dated evidence fixture");

      const markup = renderToStaticMarkup(
        createElement(EvidenceDocket, {
          lang,
          records: [record],
          variant: "decision-record",
        })
      );

      expect(markup).toContain('dateTime="2022-08-03"');
      expect(text(markup)).toContain(visibleDate);
      expect(text(markup)).not.toContain("2022-08-03");
    }
  );

  it("does not import or filter the global evidence registry", () => {
    const source = readFileSync(
      "components/evidence/EvidenceDocket.tsx",
      "utf8"
    );

    expect(source).not.toContain("EVIDENCE_REGISTRY");
    expect(source).not.toContain("evidenceRecordById");
  });
});
