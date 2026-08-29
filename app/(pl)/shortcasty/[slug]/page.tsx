import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { shortcastsT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { localizedPathMetadata } from "@/lib/page-metadata";
import { EPISODES, getEpisode } from "@/lib/shortcasty";

const tx = shortcastsT.pl.detail;
const modelVersion = MODEL_V2_METADATA.modelVersion;

export function generateStaticParams() {
  return EPISODES.filter((episode) => episode.publishedAt).map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep?.publishedAt) return {};
  return localizedPathMetadata({
    lang: "pl",
    paths: { pl: `/shortcasty/${slug}` },
    title: tx.metadataTitle(ep.number, ep.title, modelVersion),
    description: ep.thesis,
  });
}

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep?.publishedAt) notFound();

  const published = EPISODES.filter((episode) => episode.publishedAt);
  const currentIndex = published.findIndex((episode) => episode.slug === ep.slug);
  const prev = published[currentIndex - 1];
  const next = published[currentIndex + 1];

  return (
    <div
      className="mx-auto max-w-4xl px-6 py-12"
      data-editorial-detail="shortcast"
    >
      <Link
        href="/shortcasty"
        className="mb-7 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-blue-700"
      >
        ← {tx.back(modelVersion)}
      </Link>

      <header className="grid gap-5 border-y border-gray-300 py-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            {tx.episodeLabel(ep.number, ep.dimension)}
          </p>
          <p className="mt-3 text-xs leading-5 text-gray-500">
            {tx.focusLabel}: {ep.focus}
          </p>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-950">
          {ep.title}
        </h1>
      </header>

      {ep.youtubeId ? (
        <section className="border-b border-gray-200 py-8">
          <div className="aspect-video overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${ep.youtubeId}`}
              title={ep.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>

          {(ep.spotifyUrl || ep.appleUrl) && (
            <nav className="mt-5 flex flex-wrap gap-x-6 gap-y-3" aria-label={ep.title}>
              {ep.spotifyUrl && (
                <a
                  href={ep.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
                >
                  {tx.spotify} ↗
                </a>
              )}
              {ep.appleUrl && (
                <a
                  href={ep.appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
                >
                  {tx.applePodcasts} ↗
                </a>
              )}
            </nav>
          )}
        </section>
      ) : null}

      <article className="mt-10 divide-y divide-gray-200 border-y border-gray-300">
        <section className="grid gap-3 py-7 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
            {tx.thesisLabel}
          </h2>
          <p className="text-sm leading-7 text-gray-700">{ep.thesis}</p>
        </section>

        <section className="grid gap-3 py-7 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            {tx.practiceNoteLabel}
          </h2>
          <div>
            <p className="text-sm leading-7 text-gray-700">{ep.practiceNote}</p>
            {ep.source ? (
              <a
                href={ep.source.href}
                className="mt-3 inline-flex text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
              >
                {ep.source.label} ↗
              </a>
            ) : null}
          </div>
        </section>

        <section className="grid gap-3 py-7 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            {tx.calculatorTitle}
          </h2>
          <div>
            <p className="text-sm leading-7 text-gray-700">{tx.calculatorBody}</p>
            <Link
              href="/calculator"
              className="mt-3 inline-flex text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
            >
              {tx.calculatorCta} →
            </Link>
          </div>
        </section>
      </article>

      <nav
        aria-label={tx.back(modelVersion)}
        className="mt-10 grid border-y border-gray-300 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/shortcasty/${prev.slug}`}
            className="py-5 pr-5 text-left sm:border-r sm:border-gray-200"
          >
            <p className="text-xs text-gray-400">← {tx.previous}</p>
            <p className="mt-2 text-sm font-semibold leading-snug text-gray-700 hover:text-blue-700">{prev.title}</p>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next ? (
          <Link
            href={`/shortcasty/${next.slug}`}
            className="py-5 pl-5 text-right"
          >
            <p className="text-xs text-gray-400">{tx.next} →</p>
            <p className="mt-2 text-sm font-semibold leading-snug text-gray-700 hover:text-blue-700">{next.title}</p>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>
    </div>
  );
}
