import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseArticle } from "@/lib/article";
import { debateT } from "@/lib/i18n";
import { SITE_ROUTES, localizedCounterpart, navigationFor, sitemapPaths } from "@/lib/site-routes";
import { metadata } from "@/app/(pl)/kupiec-po-automatyzacji/page";

const markdown = readFileSync(new URL("../docs/articles/pl/2026-12-kupiec-po-automatyzacji.md", import.meta.url), "utf8");

describe("Polish debate article", () => {
  it("parses real frontmatter and all four threads without panel participants' names", () => {
    const { frontmatter, html } = parseArticle(markdown);
    expect(frontmatter).toMatchObject({
      tytuł: "Kupiec po automatyzacji",
      podtytuł: "Rola zakupów, gdy rutynę przejmują agenci AI",
      data: "2026-12",
      autor: "Paweł Mamcarz",
    });
    for (const heading of [
      "1. Na co pójdzie odzyskany czas",
      "2. Czas na strategię: kto pisze reguły i kto je zmienia",
      "3. Procedura czy polityka zakupowa",
      "4. Kontrola i miary",
      "Pytania do panelu",
    ]) expect(html).toContain(`<h2>${heading}</h2>`);
    expect(html).not.toMatch(/Agnieszka|Żabka|Zabka|tytuł:/);
    for (const question of debateT.pl.questions) {
      expect(html.replace(/\s+/g, " ")).toContain(question);
    }
  });

  it("rewrites sibling Markdown links but not remote links or code", () => {
    const { html } = parseArticle(markdown);
    expect(html).toContain('href="https://github.com/pawelmamcarz/procuracost/blob/main/docs/articles/pl/2026-07-tunel-pole-lepszy-biznes.md"');
    expect(html).not.toMatch(/href="(?:\.\/)?[^"/:]+\.md"/);
    const custom = parseArticle('---\ntytuł: "Title"\npodtytuł: "Subtitle"\ndata: 2026-12\nautor: "Author"\n---\n[Sibling](./other.md#section) [Remote](https://example.com/other.md) `[Code](other.md)`');
    expect(custom.html).toContain("https://github.com/pawelmamcarz/procuracost/blob/main/docs/articles/pl/other.md#section");
    expect(custom.html).toContain('href="https://example.com/other.md"');
    expect(custom.html).toContain("<code>[Code](other.md)</code>");
  });

  it("supports CRLF and fails explicitly for missing frontmatter or required fields", () => {
    expect(parseArticle(markdown.replace(/\n/g, "\r\n")).frontmatter.tytuł).toBe("Kupiec po automatyzacji");
    expect(() => parseArticle("# No frontmatter")).toThrow(/frontmatter/);
    expect(() => parseArticle("---\ntytuł: Title\n---\nBody")).toThrow(/podtytuł/);
  });

  it("publishes a Polish-only discoverable route with frontmatter metadata and no navigation entry", () => {
    expect(SITE_ROUTES.find(({ key }) => key === "debateArticle")).toEqual({
      key: "debateArticle", pl: "/kupiec-po-automatyzacji", sitemap: true,
    });
    expect(sitemapPaths()).toContain("/kupiec-po-automatyzacji");
    expect(localizedCounterpart("/kupiec-po-automatyzacji", "en")).toBe("/en");
    expect(navigationFor("pl").map(({ href }) => href)).not.toContain("/kupiec-po-automatyzacji");
    expect(metadata.title).toBe("Kupiec po automatyzacji");
    expect(metadata.description).toBe("Rola zakupów, gdy rutynę przejmują agenci AI");
    expect(metadata.other?.date).toBe("2026-12");
    expect(metadata.alternates?.languages).toEqual({
      "pl-PL": "/kupiec-po-automatyzacji", "x-default": "/kupiec-po-automatyzacji",
    });
  });
});
