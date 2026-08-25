import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppShell from "@/components/AppShell";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import TeamPage from "@/components/TeamPage";
import { homeT } from "@/lib/i18n";

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

    expect(markup).toContain(homeT.pl.hero.title);
    expect(markup.match(/<main\b/g)).toHaveLength(1);
  });

  it("owns the only main landmark around the English team page", () => {
    pathname = "/en/team";
    const markup = renderPageInShell(createElement(TeamPage, { lang: "en" }), "en");

    expect(markup).toContain("ProcuraCost team");
    expect(markup.match(/<main\b/g)).toHaveLength(1);
  });
});
