import { describe, expect, it } from "vitest";
import { languageSwitchHref } from "@/components/AppShell";
import { SITE_ROUTES, localizedCounterpart, navigationFor, sitemapPaths } from "@/lib/site-routes";

describe("public route contract", () => {
  it("keeps language switches on the equivalent route", () => {
    expect(localizedCounterpart("/calculator", "en")).toBe("/en/calculator");
    expect(localizedCounterpart("/en/model/assumptions", "pl")).toBe("/model/assumptions");
  });

  it("passes query strings and fragments through the chrome language switch", () => {
    expect(languageSwitchHref("/calculator", "x=1", "#result", "en")).toBe("/en/calculator?x=1#result");
  });

  it("models the canonical working paper as an English-only route", () => {
    const research = SITE_ROUTES.find((route) => route.key === "research");

    expect(research).toMatchObject({
      en: "/research",
      aliases: ["/en/research"],
      canonical: true,
      sitemap: true,
    });
    expect(research).not.toHaveProperty("pl");
    expect(localizedCounterpart("/research", "en")).toBe("/research");
    expect(localizedCounterpart("/research", "pl")).toBe("/");
    expect(localizedCounterpart("/en/research", "pl")).toBe("/");
  });

  it("exposes the exact manager-first primary navigation", () => {
    expect(navigationFor("pl")).toEqual([
      { href: "/calculator", label: "Kalkulator", highlight: true },
      { href: "/optimizer", label: "Optymalizator", highlight: undefined },
      { href: "/assessment", label: "Ocena dojrzałości", highlight: undefined },
      { href: "/model", label: "Model", highlight: undefined },
    ]);
    expect(navigationFor("en")).toEqual([
      { href: "/en/calculator", label: "Calculator", highlight: true },
      { href: "/en/optimizer", label: "Optimizer", highlight: undefined },
      { href: "/en/assessment", label: "Maturity Assessment", highlight: undefined },
      { href: "/en/model", label: "Model", highlight: undefined },
    ]);
  });

  it("owns the exact indexable route set and excludes aliases and Shortcasts", () => {
    expect(sitemapPaths()).toEqual([
      "/", "/en",
      "/calculator", "/en/calculator",
      "/optimizer", "/en/optimizer",
      "/case-studies", "/en/case-studies",
      "/assessment", "/en/assessment",
      "/team", "/en/team",
      "/methodology", "/en/methodology",
      "/model", "/en/model",
      "/model/assumptions", "/en/model/assumptions",
      "/research",
      "/research-agenda",
    ]);
    expect(sitemapPaths()).not.toContain("/en/research");
    expect(sitemapPaths()).not.toContain("/shortcasty");
    expect(sitemapPaths()).not.toContain("/en/shortcasty");
  });
});
