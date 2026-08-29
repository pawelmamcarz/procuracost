import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BoundaryField from "@/components/BoundaryField";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import { homeT } from "@/lib/i18n";

function renderedText(markup: string): string {
  return markup
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replace(/\s+/g, " ")
    .trim();
}

describe("homepage topology graphic", () => {
  it("renders one dedicated shared-boundary figure instead of the editor rail", () => {
    for (const lang of ["pl", "en"] as const) {
      const html = renderToStaticMarkup(
        createElement(EvidenceFieldHome, { lang })
      );
      const text = renderedText(html);

      expect(html).toContain(`data-home-topology="${lang}"`);
      expect(html.match(/data-boundary="shared"/g)).toHaveLength(1);
      expect(html.match(/data-converges-at="navigator"/g)).toHaveLength(2);
      expect(html.match(/data-endpoint="navigator"/g)).toHaveLength(1);
      expect(html).toContain('data-path="formal"');
      expect(html).toContain('data-path="adaptive"');
      expect(html).not.toContain("data-home-process-rail");
      expect(html).not.toContain("data-mobile-sequence");
      expect(html).not.toContain("data-node-geometry");
      expect(html).not.toContain('role="region"');
      expect(text).toContain(homeT[lang].boundary.title);
      expect(text).toContain(homeT[lang].boundary.caption);
    }
  });

  it("keeps the diagram proportional, localised and free of embedded prose", () => {
    for (const lang of ["pl", "en"] as const) {
      const html = renderToStaticMarkup(createElement(BoundaryField, { lang }));
      const svg = html.match(/<svg[\s\S]*?<\/svg>/)?.[0];
      const titleId = `home-topology-title-${lang}`;
      const descriptionId = `home-topology-description-${lang}`;

      expect(svg).toBeDefined();
      expect(svg).toContain('role="img"');
      expect(svg).toContain('viewBox="0 0 760 360"');
      expect(svg).toContain("h-auto w-full max-w-full");
      expect(svg).toContain("pointer-events-none");
      expect(svg).toContain(`aria-labelledby="${titleId} ${descriptionId}"`);
      expect(svg?.match(new RegExp(`id="${titleId}"`, "g"))).toHaveLength(1);
      expect(svg?.match(new RegExp(`id="${descriptionId}"`, "g"))).toHaveLength(1);
      expect(svg).not.toContain('preserveAspectRatio="none"');
      expect(svg).not.toContain("absolute inset-0 h-full w-full");
      expect(svg).not.toContain("<text");
      expect(svg).not.toContain("min-w-");
    }
  });

  it("rejoins adaptive branches before one shared run to the navigator", () => {
    const html = renderToStaticMarkup(createElement(BoundaryField, { lang: "pl" }));
    const svg = html.match(/<svg[\s\S]*?<\/svg>/)?.[0];

    expect(svg?.match(/data-rejoins-at="adaptive-junction"/g)).toHaveLength(2);
    expect(svg?.match(/data-junction="adaptive-rejoin"/g)).toHaveLength(1);
    expect(svg?.match(/data-segment="adaptive-to-navigator"/g)).toHaveLength(1);
  });

  it("uses decision-facing copy for the rebuilt figure", () => {
    expect(homeT.pl.boundary.title).toBe(
      "Jedna granica. Dwa projekty przebiegu."
    );
    expect(homeT.en.boundary.title).toBe(
      "One boundary. Two workflow designs."
    );
  });
});
