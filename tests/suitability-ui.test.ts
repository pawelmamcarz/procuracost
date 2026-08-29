import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EnPage from "@/app/(en)/en/optimizer/page";
import PlPage from "@/app/(pl)/optimizer/page";
import SuitabilityComparison from "@/components/SuitabilityComparison";
import { suitabilityT } from "@/lib/i18n";
import {
  MODEL_V2_METADATA,
  compareProcedureSuitability,
  type SuitabilityProfileV2,
} from "@/lib/model-v2";
import { metadata as enMetadata } from "@/app/(en)/en/optimizer/layout";
import { metadata as plMetadata } from "@/app/(pl)/optimizer/layout";

function profile(
  overrides: Partial<SuitabilityProfileV2> = {}
): SuitabilityProfileV2 {
  return {
    ...MODEL_V2_METADATA,
    boundaryId: "pzp_classic_eu",
    initiatedOn: "2026-08-28",
    buyerRegime: "classic",
    procurementObject: "supplies_services",
    communicationMethod: "electronic",
    purchaseArchetypeId: "incomplete_requirement",
    executionChannelId: "sourcing_event",
    systemSupportId: "manual",
    ...overrides,
  };
}

describe("suitability comparison presentation", () => {
  it("renders a semantic keyboard-ready form from the shared PL/EN component", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(SuitabilityComparison, { lang })
      );
      expect(markup.match(/<fieldset\b/g)).toHaveLength(1);
      expect(markup).toContain('type="date"');
      expect(markup).toContain('min="2026-01-01"');
      expect(markup).toContain('max="2027-12-31"');
      expect(markup).toContain('type="submit"');
      expect(markup).toContain("focus-visible:outline-2");
      expect(markup).toContain(suitabilityT[lang].fields.boundary);
      expect(markup).toContain(suitabilityT[lang].fields.archetype);
      expect(markup).toContain(suitabilityT[lang].fields.channel);
      expect(markup).toContain(suitabilityT[lang].fields.support);
    }
  });

  it("renders equal, unnumbered candidate rows with text and icon status", () => {
    const result = compareProcedureSuitability(profile());
    expect(result.status).toBe("ready");
    const markup = renderToStaticMarkup(
      createElement(SuitabilityComparison, { lang: "en", initialResult: result })
    );

    expect(markup.match(/<article\b/g)).toHaveLength(3);
    expect(markup.match(/Equal-status candidate/g)).toHaveLength(3);
    expect(markup).toContain("Open procedure");
    expect(markup).toContain("Restricted procedure");
    expect(markup).toContain("Framework call-off");
    expect(markup).toContain("Condition to verify");
    expect(markup).toContain("Condition declared");
    const privateMarkup = renderToStaticMarkup(
      createElement(SuitabilityComparison, {
        lang: "en",
        initialResult: compareProcedureSuitability({
          ...profile(),
          boundaryId: "private_policy",
          buyerRegime: undefined,
          procurementObject: undefined,
          communicationMethod: undefined,
        }),
      })
    );
    expect(privateMarkup).toContain("Not assessed");
    expect(markup).not.toContain("<ol");
    expect(markup).not.toContain("<table");
    expect(markup).not.toMatch(/suitability\.(?:criteria|conditions|procedures|limitations|withheld)/);
    expect(markup).not.toMatch(/\b(?:score|ranking|winner|optimal|recommended|confidence|votes)\b/i);
  });

  it("announces only a concise status and keeps the focused ledger non-live", () => {
    const result = compareProcedureSuitability(profile());
    const markup = renderToStaticMarkup(
      createElement(SuitabilityComparison, { lang: "en", initialResult: result })
    );
    expect(markup).toContain('role="status" aria-live="polite"');
    expect(markup).toContain("Comparison ready. Procedure families: 3.");
    expect(markup).toMatch(
      /<div tabindex="-1" role="region" aria-labelledby="suitability-result-title"/
    );
    expect(markup).not.toMatch(/role="region"[^>]*aria-live/);
  });

  it("renders a concrete fail-closed reason without leaking a machine key", () => {
    const result = compareProcedureSuitability({
      ...profile(),
      buyerRegime: "sectoral",
    });
    const markup = renderToStaticMarkup(
      createElement(SuitabilityComparison, { lang: "en", initialResult: result })
    );
    expect(markup).toContain(suitabilityT.en.outOfScopeTitle);
    expect(markup).toContain(
      "Utilities, defence and security procurement remain outside this version&#x27;s scope."
    );
    expect(markup).not.toContain("suitability.reasons.");
  });

  it("keeps the signature surface free of card, table, shadow and gradient treatments", () => {
    const source = readFileSync(
      new URL("../components/SuitabilityComparison.tsx", import.meta.url),
      "utf8"
    );
    expect(source).not.toMatch(/rounded-|shadow|gradient|<table|style=|recharts/i);
    expect(source).not.toMatch(/bottom-0.*top-16.*w-px/);
  });

  it("keeps both route wrappers thin and paired metadata localised", () => {
    const plMarkup = renderToStaticMarkup(createElement(PlPage));
    const enMarkup = renderToStaticMarkup(createElement(EnPage));
    expect(plMarkup).toContain(suitabilityT.pl.title);
    expect(enMarkup).toContain(suitabilityT.en.title);
    expect(plMetadata).toMatchObject({
      title: suitabilityT.pl.metadataTitle,
      description: suitabilityT.pl.metadataDescription,
    });
    expect(enMetadata).toMatchObject({
      title: suitabilityT.en.metadataTitle,
      description: suitabilityT.en.metadataDescription,
    });
  });

  it("uses the frozen language-contract labels for boundaries and procedure families", () => {
    expect(suitabilityT.pl.options.boundary).toEqual({
      private_policy: "Polityka zakupowa sektora prywatnego",
      public_internal_rules: "Wewnętrzne zasady zakupowe sektora publicznego",
      pzp_classic_national: "PZP: zamówienia klasyczne poniżej progów unijnych",
      pzp_classic_eu: "PZP: zamówienia klasyczne od progów unijnych",
    });
    expect(suitabilityT.en.options.boundary).toEqual({
      private_policy: "Private-sector procurement policy",
      public_internal_rules: "Public-sector internal procurement rules",
      pzp_classic_national: "PZP: classic procurement below EU thresholds",
      pzp_classic_eu: "PZP: classic procurement at or above EU thresholds",
    });
    expect(suitabilityT.pl.procedures.public_internal_competitive).toBe(
      "Wewnętrzna procedura konkurencyjna sektora publicznego"
    );
    expect(suitabilityT.en.procedures.public_internal_competitive).toBe(
      "Public-sector internal competitive procedure"
    );
    expect(suitabilityT.pl.procedures.custom_lawful).toBe(
      "Inna dopuszczalna procedura"
    );
    expect(suitabilityT.en.procedures.custom_lawful).toBe(
      "Other lawful procedure"
    );
  });
});
