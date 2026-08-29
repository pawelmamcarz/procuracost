import { shortcastsT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { EPISODES } from "@/lib/shortcasty";

const modelVersion = MODEL_V2_METADATA.modelVersion;

export const metadata = {
  title: shortcastsT.en.metadataTitle(modelVersion),
  description: shortcastsT.en.metadataDescription(modelVersion),
};

export default function ShortcastyEnPage() {
  const tx = shortcastsT.en;
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
              <article
                key={episode.slug}
                className="rounded-xl border border-gray-100 bg-white p-5"
              >
                <div className="text-xs font-medium text-blue-600">
                  #{episode.number} · {episode.dimensionEn}
                </div>
                <h2 className="mt-1 font-semibold text-gray-900">{episode.titleEn}</h2>
                <p className="mt-1 text-sm text-gray-600">{episode.thesisEn}</p>
                <p className="mt-2 text-xs text-gray-500">{tx.focusLabel}: {episode.focusEn}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {tx.practiceNoteLabel}: {episode.practiceNoteEn}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tx.plannedTopics}
        </p>
        <div className="space-y-3">
          {planned.map((episode) => (
            <div key={episode.slug} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="text-xs font-medium text-gray-500">
                #{episode.number} · {episode.dimensionEn}
              </div>
              <h2 className="mt-1 font-semibold text-gray-700">{episode.titleEn}</h2>
              <p className="mt-1 text-sm text-gray-600">{episode.thesisEn}</p>
              <p className="mt-2 text-xs text-gray-500">{tx.focusLabel}: {episode.focusEn}</p>
              <p className="mt-2 text-xs text-gray-500">
                {tx.practiceNoteLabel}: {episode.practiceNoteEn}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
