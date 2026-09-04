import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import ModelOverview from "@/components/ModelOverview";
import SiteFooter from "@/components/SiteFooter";
import { navigationFor } from "@/lib/site-routes";

describe("decision-led service architecture", () => {
  it("keeps only comparison and research in the primary navigation", () => {
    expect(navigationFor("pl")).toEqual([
      { href: "/calculator", label: "Porównanie", highlight: true },
      { href: "/model", label: "Badania", highlight: undefined },
    ]);
    expect(navigationFor("en")).toEqual([
      { href: "/en/calculator", label: "Comparison", highlight: true },
      { href: "/en/model", label: "Research", highlight: undefined },
    ]);
  });

  it("aligns the global chrome with the working-paper width and rule system", () => {
    const source = readFileSync("components/NavBar.tsx", "utf8");

    expect(source).toContain("max-w-5xl");
    expect(source).toContain("border-t-4");
    expect(source).toContain("border-t-blue-700");
    expect(source).not.toContain("max-w-7xl");
    expect(source).not.toContain("rounded-full");
  });

  it.each([
    ["pl", "Porównaj dwa sposoby zakupu zgodne z obowiązującymi regulacjami."],
    ["en", "Compare two procurement approaches that comply with the applicable rules."],
  ] as const)("gives %s visitors two explicit entry paths", (lang, promise) => {
    const html = renderToStaticMarkup(
      createElement(EvidenceFieldHome, { lang })
    );

    expect(html).toContain(promise);
    expect(html.match(/data-home-path=/g)).toHaveLength(2);
    expect(html).toContain('data-home-path="practical"');
    expect(html).toContain('data-home-path="research"');
    expect(html).toContain('data-record-preview="structure"');
    expect(html).toContain('data-guided-step="4"');
    expect(html).not.toContain("data-evidence-id");
    expect(html).not.toMatch(/44 dni|24 dni|44 days|24 days/);
  });

  it("turns the model page into a grouped research centre", () => {
    for (const lang of ["pl", "en"] as const) {
      const html = renderToStaticMarkup(createElement(ModelOverview, { lang }));

      expect(html.match(/data-research-group=/g)).toHaveLength(3);
      expect(html).toContain(
        `href="${lang === "en" ? "/en/model/assumptions" : "/model/assumptions"}"`
      );
      expect(html).toContain(
        `href="${lang === "en" ? "/research" : "/research-agenda"}"`
      );
      expect(html).toContain('href="https://github.com/pawelmamcarz/procuracost"');
    }
  });

  it("keeps the global footer quiet and product-specific", () => {
    for (const lang of ["pl", "en"] as const) {
      const html = renderToStaticMarkup(createElement(SiteFooter, { lang }));

      expect(html).toContain(
        lang === "pl"
          ? "Szkic może zostać zapisany wyłącznie w tej przeglądarce."
          : "A draft can be saved only in this browser."
      );
      expect(html).not.toContain("<img");
      expect(html).not.toContain("silence-tax.com");
      expect(html).not.toContain("czympojade.pl");
      expect(html).not.toContain("przypominamy.com");
    }
  });
});
