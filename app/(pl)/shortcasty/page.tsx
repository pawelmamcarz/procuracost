import Link from "next/link";
import type { Metadata } from "next";
import { shortcastsT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { localizedPageMetadata } from "@/lib/page-metadata";
import { EPISODES } from "@/lib/shortcasty";

const modelVersion = MODEL_V2_METADATA.modelVersion;

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "shortcasts",
  title: shortcastsT.pl.metadataTitle(modelVersion),
  description: shortcastsT.pl.metadataDescription(modelVersion),
});

export default function ShortcastyPage() {
  const tx = shortcastsT.pl;
  const published = EPISODES.filter((episode) => episode.publishedAt);
  const planned = EPISODES.filter((episode) => !episode.publishedAt);

  return (
    <div
      className="mx-auto max-w-5xl px-6 py-12"
      data-editorial-index="shortcasts"
    >
      <header className="grid gap-5 border-y border-gray-300 py-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          {tx.badge(modelVersion)}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-950">
            {tx.title}
          </h1>
        </div>
        <p className="max-w-2xl self-end text-sm leading-6 text-gray-600">
          {tx.intro}
        </p>
      </header>

      {published.length > 0 && (
        <section className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {tx.publishedMaterials}
          </p>
          <ol className="divide-y divide-gray-200 border-y border-gray-300">
            {published.map((episode) => (
              <li key={episode.slug} className="py-5">
                <Link
                  href={`/shortcasty/${episode.slug}`}
                  className="group grid gap-4 sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
                >
                  <span className="font-mono text-sm font-semibold text-blue-700">
                    {String(episode.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-700">
                      {episode.title}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {episode.dimension} · {episode.focus}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-gray-600">
                      {tx.practiceNoteLabel}: {episode.practiceNote}
                    </span>
                  </span>
                  <span aria-hidden="true" className="self-start text-lg text-blue-700">
                    →
                  </span>
                </Link>
                {episode.source ? (
                  <a
                    href={episode.source.href}
                    className="ml-0 mt-3 inline-flex text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 sm:ml-16"
                  >
                    {episode.source.label} ↗
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tx.plannedTopics}
        </p>
        <ol className="divide-y divide-gray-200 border-y border-gray-300">
          {planned.map((episode) => (
            <li
              key={episode.slug}
              className="grid gap-4 py-5 sm:grid-cols-[3rem_minmax(0,1fr)]"
            >
              <span className="font-mono text-sm text-gray-400">
                {String(episode.number).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold leading-snug text-gray-800">
                  {episode.title}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {episode.dimension} · {episode.focus}
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-600">{episode.thesis}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {tx.practiceNoteLabel}: {episode.practiceNote}
                </p>
                {episode.source ? (
                  <a
                    href={episode.source.href}
                    className="mt-3 inline-flex text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
                  >
                    {episode.source.label} ↗
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
