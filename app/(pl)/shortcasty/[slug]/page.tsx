import { notFound } from "next/navigation";
import Link from "next/link";
import { shortcastsT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { EPISODES, getEpisode } from "@/lib/shortcasty";

const tx = shortcastsT.pl.detail;
const modelVersion = MODEL_V2_METADATA.modelVersion;

export function generateStaticParams() {
  return EPISODES.filter((episode) => episode.publishedAt).map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep?.publishedAt) return {};
  return {
    title: tx.metadataTitle(ep.number, ep.title, modelVersion),
    description: ep.thesis,
  };
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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/shortcasty"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600"
      >
        ← {tx.back(modelVersion)}
      </Link>

      <div className="mb-8 rounded-2xl bg-blue-600 p-8 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          {tx.episodeLabel(ep.number, ep.dimension)}
        </p>
        <h1 className="text-2xl font-bold leading-tight">{ep.title}</h1>
        <p className="mt-3 text-sm text-blue-100">{tx.focusLabel}: {ep.focus}</p>
      </div>

      {ep.youtubeId ? (
        <div className="mb-8 space-y-6">
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${ep.youtubeId}`}
              title={ep.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>

          {(ep.spotifyUrl || ep.appleUrl) && (
            <div className="flex flex-wrap gap-2">
              {ep.spotifyUrl && (
                <a
                  href={ep.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700 hover:opacity-80"
                >
                  {tx.spotify} ↗
                </a>
              )}
              {ep.appleUrl && (
                <a
                  href={ep.appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 hover:opacity-80"
                >
                  {tx.applePodcasts} ↗
                </a>
              )}
            </div>
          )}
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{tx.thesisLabel}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{ep.thesis}</p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">
            {tx.practiceNoteLabel}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{ep.practiceNote}</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            {tx.calculatorTitle}
          </p>
          <p className="text-sm text-gray-700 mb-3">
            {tx.calculatorBody}
          </p>
          <Link
            href="/calculator"
            className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {tx.calculatorCta}
          </Link>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/shortcasty/${prev.slug}`}
            className="flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-gray-400">← {tx.previous}</p>
            <p className="mt-1 text-sm font-medium text-gray-700 leading-snug">{prev.title}</p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/shortcasty/${next.slug}`}
            className="flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4 text-right hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-gray-400">{tx.next} →</p>
            <p className="mt-1 text-sm font-medium text-gray-700 leading-snug">{next.title}</p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
