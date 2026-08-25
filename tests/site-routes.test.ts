import { describe, expect, it } from "vitest";
import { languageSwitchHref } from "@/components/AppShell";
import { localizedCounterpart, navigationFor, sitemapPaths } from "@/lib/site-routes";

describe("public route contract", () => {
  it("keeps language switches on the equivalent route", () => {
    expect(localizedCounterpart("/calculator", "en")).toBe("/en/calculator");
    expect(localizedCounterpart("/en/model/assumptions", "pl")).toBe("/model/assumptions");
  });

  it("passes query strings and fragments through the chrome language switch", () => {
    expect(languageSwitchHref("/calculator", "x=1", "#result", "en")).toBe("/en/calculator?x=1#result");
  });

  it("keeps the working paper canonical at /research", () => {
    expect(localizedCounterpart("/research", "en")).toBe("/research");
    expect(localizedCounterpart("/en/research", "pl")).toBe("/research");
  });

  it("exposes no placeholder shortcast navigation", () => {
    expect(navigationFor("pl").some((item) => item.href.includes("shortcasty"))).toBe(false);
    expect(navigationFor("en").some((item) => item.href.includes("shortcasty"))).toBe(false);
  });

  it("includes every indexable bilingual route in the sitemap", () => {
    expect(sitemapPaths()).toEqual(expect.arrayContaining([
      "/methodology", "/en/methodology", "/team", "/en/team",
    ]));
  });
});
