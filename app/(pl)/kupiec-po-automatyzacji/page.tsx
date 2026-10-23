import { readFileSync } from "node:fs";
import path from "node:path";
import DebateBento from "@/components/debate/DebateBento";
import { parseArticle } from "@/lib/article";
import { debateT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

const { frontmatter, html } = parseArticle(
  readFileSync(path.join(process.cwd(), "docs/articles/pl/2026-12-kupiec-po-automatyzacji.md"), "utf8"),
);

export const metadata = {
  ...localizedPageMetadata({
    lang: "pl",
    routeKey: "debateArticle",
    title: frontmatter.tytuł,
    description: frontmatter.podtytuł,
    ogType: "article",
  }),
  authors: [{ name: frontmatter.autor }],
  other: { date: frontmatter.data },
};

export default function DebateArticlePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-3xl border-b border-gray-200 pb-8">
        <p className="text-xs font-medium text-blue-700">{debateT.pl.articleEyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">{frontmatter.tytuł}</h1>
        <p className="mt-4 text-lg leading-7 text-gray-700">{frontmatter.podtytuł}</p>
        <p className="mt-4 text-xs text-gray-600">
          <time dateTime={frontmatter.data}>{frontmatter.data}</time>
          {" / "}{frontmatter.autor}
        </p>
      </header>
      <DebateBento lang="pl" />
      <article className="article-prose max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
