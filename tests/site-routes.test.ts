import { describe, expect, it } from "vitest";
import { languageSwitchHref } from "@/components/AppShell";
import { SITE_ROUTES, localizedCounterpart, navigationFor, sitemapPaths } from "@/lib/site-routes";

describe("public route contract", () => {
  it("keeps language switches on the equivalent route", () => {
    expect(localizedCounterpart("/calculator", "en")).toBe("/en/calculator");
    expect(localizedCounterpart("/en/model/assumptions", "pl")).toBe("/model/assumptions");
    expect(localizedCounterpart("/readiness", "en")).toBe("/en/readiness");
    expect(localizedCounterpart("/en/practice/procurement-beyond-8", "pl")).toBe(
      "/practice/procurement-beyond-8",
    );
  });

  it("registers readiness and practitioner material outside primary navigation but in discovery", () => {
    expect(SITE_ROUTES.find(({ key }) => key === "readiness")).toEqual({
      key: "readiness",
      pl: "/readiness",
      en: "/en/readiness",
      sitemap: true,
    });
    expect(SITE_ROUTES.find(({ key }) => key === "procurementBeyond8")).toEqual({
      key: "procurementBeyond8",
      pl: "/practice/procurement-beyond-8",
      en: "/en/practice/procurement-beyond-8",
      sitemap: true,
    });
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
      { href: "/optimizer", label: "Warunki zastosowania", highlight: undefined },
      { href: "/assessment", label: "Profil procesu", highlight: undefined },
      { href: "/model", label: "Model", highlight: undefined },
    ]);
    expect(navigationFor("en")).toEqual([
      { href: "/en/calculator", label: "Calculator", highlight: true },
      { href: "/en/optimizer", label: "Suitability comparison", highlight: undefined },
      { href: "/en/assessment", label: "Process profile", highlight: undefined },
      { href: "/en/model", label: "Model", highlight: undefined },
    ]);
  });

  it("owns the exact indexable route set and excludes aliases", () => {
    expect(sitemapPaths()).toEqual([
      "/", "/en",
      "/calculator", "/en/calculator",
      "/optimizer", "/en/optimizer",
      "/case-studies", "/en/case-studies",
      "/assessment", "/en/assessment",
      "/readiness", "/en/readiness",
      "/practice/procurement-beyond-8", "/en/practice/procurement-beyond-8",
      "/team", "/en/team",
      "/methodology", "/en/methodology",
      "/model", "/en/model",
      "/model/assumptions", "/en/model/assumptions",
      "/research",
      "/research-agenda",
      "/shortcasty", "/en/shortcasty",
    ]);
    expect(sitemapPaths()).not.toContain("/en/research");
  });
});
