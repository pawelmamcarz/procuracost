import Link from "next/link";
import { shortcastsT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { EPISODES } from "@/lib/shortcasty";

const modelVersion = MODEL_V2_METADATA.modelVersion;

export const metadata = {
  title: shortcastsT.pl.metadataTitle(modelVersion),
  description: shortcastsT.pl.metadataDescription(modelVersion),
};

export default function ShortcastyPage() {
  const tx = shortcastsT.pl;
  const published = EPISODES.filter((episode) => episode.publishedAt);
  const planned = EPISODES.filter((episode) => !episode.publishedAt);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-2xl bg-blue-600 p-8 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          {tx.badge(modelVersion)}
        </p>
        <h1 className="text-3xl font-bold leading-tight">{tx.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100">
          {tx.intro}
        </p>
      </div>

      {published.length > 0 && (
        <section className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {tx.publishedMaterials}
          </p>
          <div className="space-y-3">
            {published.map((episode) => (
              <Link
                key={episode.slug}
                href={`/shortcasty/${episode.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  {episode.number}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-700">
                    {episode.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {episode.dimension} · {episode.focus}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                    {tx.practiceNoteLabel}: {episode.practiceNote}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tx.plannedTopics}
        </p>
        <div className="space-y-2">
          {planned.map((episode) => (
            <div
              key={episode.slug}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-400">
                {episode.number}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-gray-700">{episode.title}</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {episode.dimension} · {episode.focus}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{episode.thesis}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  {tx.practiceNoteLabel}: {episode.practiceNote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
