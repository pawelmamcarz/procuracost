import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppShell from "@/components/AppShell";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import MechanismsEvidencePage from "@/components/MechanismsEvidencePage";
import MethodologyOverview from "@/components/MethodologyOverview";
import ModelAssumptionsPage from "@/components/ModelAssumptionsPage";
import ModelOverview from "@/components/ModelOverview";
import SuitabilityComparison from "@/components/SuitabilityComparison";
import TeamPage from "@/components/TeamPage";
import {
  assessmentT,
  homeExperienceT,
  mechanismsEvidenceT,
  teamT,
} from "@/lib/i18n";

let pathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useSearchParams: () => new URLSearchParams(),
}));

const LanguageShell = AppShell as unknown as ComponentType<{
  children?: React.ReactNode;
  lang: "pl" | "en";
}>;

function renderPageInShell(page: React.ReactNode, lang: "pl" | "en") {
  return renderToStaticMarkup(createElement(LanguageShell, { lang }, page));
}

describe("AppShell landmark contract", () => {
  beforeEach(() => {
    pathname = "/";
  });

  it("owns the only main landmark around the shared homepage", () => {
    const markup = renderPageInShell(createElement(EvidenceFieldHome, { lang: "pl" }), "pl");

    expect(markup).toContain(homeExperienceT.pl.hero.title);
    expect(markup.match(/<main\b/g)).toHaveLength(1);
  });

  it.each([
    {
      path: "/model",
      page: createElement(ModelOverview, { lang: "pl" }),
    },
    {
      path: "/methodology",
      page: createElement(MethodologyOverview, { lang: "pl" }),
    },
    {
      path: "/optimizer",
      page: createElement(SuitabilityComparison, { lang: "pl" }),
    },
    {
      path: "/model/assumptions",
      page: createElement(ModelAssumptionsPage, { lang: "pl" }),
    },
  ])("owns the only main landmark around $path", ({ path, page }) => {
    pathname = path;
    const markup = renderPageInShell(page, "pl");

    expect(markup.match(/<main\b/g)).toHaveLength(1);
  });

  it.each([
    {
      path: "/assessment",
      page: createElement(AssessmentQuiz, { lang: "pl" }),
      title: assessmentT.pl.title,
    },
    {
      path: "/case-studies",
      page: createElement(MechanismsEvidencePage, { lang: "pl" }),
      title: mechanismsEvidenceT.pl.title,
    },
  ])("owns the only main landmark around $path", ({ path, page, title }) => {
    pathname = path;
    const markup = renderPageInShell(page, "pl");

    expect(markup).toContain(title);
    expect(markup.match(/<main\b/g)).toHaveLength(1);
  });

  it("owns the only main landmark around the English team page", () => {
    pathname = "/en/team";
    const markup = renderPageInShell(createElement(TeamPage, { lang: "en" }), "en");

    expect(markup).toContain(teamT.en.title);
    expect(markup.match(/<main\b/g)).toHaveLength(1);
  });
});
