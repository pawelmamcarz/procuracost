import { SITE_URL } from "@/app/seo-config";
import { shortcastsT } from "@/lib/i18n";
import { EPISODES } from "@/lib/shortcasty";

export const dynamic = "force-static";

const CHANNEL_PATH = "/shortcasty";

type PublishedEpisode = (typeof EPISODES)[number] & { publishedAt: string };

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rssDate(publishedAt: string): string {
  return new Date(`${publishedAt}T00:00:00Z`).toUTCString();
}

export function GET(): Response {
  const published = EPISODES.filter(
    (episode): episode is PublishedEpisode => Boolean(episode.publishedAt),
  );
  const items = published
    .map((episode) => {
      const link = `${SITE_URL}${CHANNEL_PATH}/${episode.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(episode.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid>${link}</guid>`,
        `      <description>${escapeXml(episode.thesis)}</description>`,
        `      <pubDate>${rssDate(episode.publishedAt)}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0">`,
    `  <channel>`,
    `    <title>${escapeXml(shortcastsT.pl.title)}</title>`,
    `    <link>${SITE_URL}${CHANNEL_PATH}</link>`,
    `    <description>${escapeXml(shortcastsT.pl.metadataDescription())}</description>`,
    `    <language>pl-PL</language>`,
    items,
    `  </channel>`,
    `</rss>`,
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
