import type { Metadata } from "next";

import { shortcastsT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { localizedPageMetadata } from "@/lib/page-metadata";
import { EPISODES } from "@/lib/shortcasty";

const modelVersion = MODEL_V2_METADATA.modelVersion;

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "shortcasts",
  title: shortcastsT.en.metadataTitle(modelVersion),
  description: shortcastsT.en.metadataDescription(modelVersion),
});

export default function ShortcastyEnPage() {
  const tx = shortcastsT.en;
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
              <li
                key={episode.slug}
                className="grid gap-4 py-5 sm:grid-cols-[3rem_minmax(0,1fr)]"
              >
                <span className="font-mono text-sm font-semibold text-blue-700">
                  {String(episode.number).padStart(2, "0")}
                </span>
                <article>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                    {episode.dimensionEn}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-gray-900">
                    {episode.titleEn}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{episode.thesisEn}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {tx.focusLabel}: {episode.focusEn}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {tx.practiceNoteLabel}: {episode.practiceNoteEn}
                  </p>
                  {episode.source ? (
                    <a
                      href={episode.source.href}
                      className="mt-3 inline-flex text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
                    >
                      {episode.source.labelEn} ↗
                    </a>
                  ) : null}
                </article>
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
              <article>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                  {episode.dimensionEn}
                </p>
                <h2 className="mt-1 text-base font-semibold text-gray-800">
                  {episode.titleEn}
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{episode.thesisEn}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {tx.focusLabel}: {episode.focusEn}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {tx.practiceNoteLabel}: {episode.practiceNoteEn}
                </p>
                {episode.source ? (
                  <a
                    href={episode.source.href}
                    className="mt-3 inline-flex text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
                  >
                    {episode.source.labelEn} ↗
                  </a>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
