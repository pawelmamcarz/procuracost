import DebateBento from "@/components/debate/DebateBento";
import { parseArticle } from "@/lib/article";
import { kupiecPoAutomatyzacjiMarkdown } from "@/lib/articles/kupiec-po-automatyzacji.generated";
import { debateT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

const { frontmatter, html } = parseArticle(kupiecPoAutomatyzacjiMarkdown);

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
      <header className="border-b-2 border-blue-700 pb-8">
        <p className="font-mono text-sm font-medium text-blue-700">{debateT.pl.articleEyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">{frontmatter.tytuł}</h1>
        <p className="mt-4 text-lg leading-7 text-gray-700">{frontmatter.podtytuł}</p>
        <p className="mt-5 font-mono text-sm text-gray-600">{frontmatter.autor}</p>
      </header>
      <DebateBento lang="pl" variant="article" />
      <article className="article-prose max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
