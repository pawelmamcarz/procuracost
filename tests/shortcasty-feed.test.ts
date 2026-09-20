import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { GET as feedGET } from "@/app/(pl)/shortcasty/feed/route";
import { metadata as shortcastyEnMetadata } from "@/app/(en)/en/shortcasty/page";
import { metadata as shortcastyMetadata } from "@/app/(pl)/shortcasty/page";
import { generateMetadata as generateEpisodeMetadata } from "@/app/(pl)/shortcasty/[slug]/page";
import ShortcastEpisodePage from "@/app/(pl)/shortcasty/[slug]/page";
import ShortcastyPage from "@/app/(pl)/shortcasty/page";
import { SITE_URL } from "@/app/seo-config";
import { EPISODES } from "@/lib/shortcasty";

const publishedEpisodes = EPISODES.filter((episode) => episode.publishedAt);
const unpublishedEpisodes = EPISODES.filter((episode) => !episode.publishedAt);

describe("shortcasty RSS feed", () => {
  it("serves RSS 2.0 XML with the feed content type", async () => {
    const response = feedGET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/rss+xml; charset=utf-8",
    );

    const body = await response.text();
    expect(body.startsWith(`<?xml version="1.0" encoding="UTF-8"?>`)).toBe(true);
    expect(body).toContain(`<rss version="2.0">`);
    expect(body).toContain(`<channel>`);
    expect(body).toContain(`</channel>`);
    expect(body).toContain(`</rss>`);
  });

  it("describes the channel and lists exactly the published episodes", async () => {
    const body = await feedGET().text();

    expect(body).toContain(`<title>Noty metodologiczne ProcuraCost</title>`);
    expect(body).toContain(`<link>${SITE_URL}/shortcasty</link>`);
    expect(body).toContain(`<language>pl-PL</language>`);
    expect(publishedEpisodes.length).toBeGreaterThan(0);

    const itemCount = (body.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(publishedEpisodes.length);

    for (const episode of publishedEpisodes) {
      expect(body).toContain(`<link>${SITE_URL}/shortcasty/${episode.slug}</link>`);
      expect(body).toContain(`<guid>${SITE_URL}/shortcasty/${episode.slug}</guid>`);
      expect(body).toContain(`<title>${episode.title}</title>`);
    }
  });

  it("keeps unpublished episodes out of the feed", async () => {
    const episode = publishedEpisodes[0];
    const previousPublishedAt = episode.publishedAt;
    delete episode.publishedAt;

    try {
      const body = await feedGET().text();
      expect(body).not.toContain(`/shortcasty/${episode.slug}`);
      expect((body.match(/<item>/g) ?? []).length).toBe(publishedEpisodes.length - 1);
    } finally {
      if (previousPublishedAt) episode.publishedAt = previousPublishedAt;
    }

    const body = await feedGET().text();
    for (const episode of unpublishedEpisodes) {
      expect(body).not.toContain(episode.slug);
    }
  });

  it("derives RFC 822 pubDate values from publishedAt", async () => {
    const body = await feedGET().text();
    const pubDates = body.match(/<pubDate>[^<]+<\/pubDate>/g) ?? [];

    expect(pubDates.length).toBe(publishedEpisodes.length);
    for (const pubDate of pubDates) {
      expect(pubDate).toMatch(
        /<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/,
      );
    }

    const dated = publishedEpisodes.filter((episode) => episode.publishedAt === "2026-09-19");
    if (dated.length > 0) {
      expect(body).toContain("<pubDate>Sat, 19 Sep 2026 00:00:00 GMT</pubDate>");
    }
  });
});

describe("shortcasty pages expose feed and breadcrumb wiring", () => {
  it("advertises the RSS feed through alternates.types on both indexes", () => {
    expect(shortcastyMetadata.alternates?.types).toEqual({
      "application/rss+xml": "/shortcasty/feed",
    });
    expect(shortcastyEnMetadata.alternates?.types).toEqual({
      "application/rss+xml": "/shortcasty/feed",
    });
  });

  it("renders BreadcrumbList JSON-LD on the Polish index", () => {
    const markup = renderToStaticMarkup(createElement(ShortcastyPage));

    expect(markup).toContain(`type="application/ld+json"`);
    expect(markup).toContain(`"@type":"BreadcrumbList"`);
    expect(markup).toContain(`"name":"Noty metodologiczne ProcuraCost"`);
  });

  it("renders BreadcrumbList JSON-LD on a published episode page", async () => {
    const episode = publishedEpisodes[0];
    const page = await ShortcastEpisodePage({
      params: Promise.resolve({ slug: episode.slug }),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain(`type="application/ld+json"`);
    expect(markup).toContain(`"@type":"BreadcrumbList"`);
    expect(markup).toContain(`"name":${JSON.stringify(episode.title)}`);
    expect(markup).toContain(`${SITE_URL}/shortcasty/${episode.slug}`);
  });

  it("marks episode metadata as ogType article", async () => {
    const episode = publishedEpisodes[0];
    const metadata = await generateEpisodeMetadata({
      params: Promise.resolve({ slug: episode.slug }),
    });
    const openGraph = metadata.openGraph as { type?: string } | undefined;

    expect(openGraph?.type).toBe("article");
  });

  it("keeps the source-level wiring explicit", () => {
    const plIndex = readFileSync("app/(pl)/shortcasty/page.tsx", "utf8");
    const enIndex = readFileSync("app/(en)/en/shortcasty/page.tsx", "utf8");
    const episodePage = readFileSync("app/(pl)/shortcasty/[slug]/page.tsx", "utf8");
    const feedRoute = readFileSync("app/(pl)/shortcasty/feed/route.ts", "utf8");
    const indexOg = readFileSync("app/(pl)/shortcasty/opengraph-image.tsx", "utf8");
    const episodeOg = readFileSync(
      "app/(pl)/shortcasty/[slug]/opengraph-image.tsx",
      "utf8",
    );

    for (const source of [plIndex, enIndex, episodePage]) {
      expect(source).toContain("breadcrumbJsonLd");
      expect(source).toContain("jsonLdScriptContent");
    }
    expect(episodePage).toContain(`ogType: "article"`);

    for (const source of [plIndex, enIndex]) {
      expect(source).toContain(`"application/rss+xml": "/shortcasty/feed"`);
    }

    expect(feedRoute).toContain(`export const dynamic = "force-static"`);
    expect(feedRoute).toContain("application/rss+xml; charset=utf-8");

    for (const source of [indexOg, episodeOg]) {
      expect(source).toContain('from "next/og"');
      expect(source).toContain("ImageResponse");
      expect(source).toContain("width: 1200");
      expect(source).toContain("height: 630");
      expect(source).toContain('contentType = "image/png"');
      expect(source).toContain("OpenGraphBoundaryMark");
    }
    expect(indexOg).toContain("shortcastsT.pl.title");
    expect(episodeOg).toContain("episode.title");
    expect(episodeOg).toContain("params: Promise<{ slug: string }>");
  });
});
