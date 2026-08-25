import Link from "next/link";
import { EPISODES } from "@/lib/shortcasty";
import { MODEL_VERSION } from "@/lib/version";

export const metadata = {
  title: `ProcuraCost ${MODEL_VERSION}: methodology shorts`,
  description:
    `A planned, source-bounded editorial series about assumptions and uncertainty in the ProcuraCost ${MODEL_VERSION} model.`,
};

export default function ShortcastyEnPage() {
  const published = EPISODES.filter((episode) => episode.publishedAt);
  const planned = EPISODES.filter((episode) => !episode.publishedAt);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          Model {MODEL_VERSION} · editorial plan
        </p>
        <h1 className="text-3xl font-bold leading-tight">ProcuraCost: evidence and assumptions</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100">
          This planned editorial series separates source evidence from model
          calibration. It does not present ProcuraCost outputs as measured
          organizational effects.
        </p>
      </div>

      {published.length > 0 && (
        <section className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Published materials
          </p>
          <div className="space-y-3">
            {published.map((episode) => (
              <Link
                key={episode.slug}
                href={`/shortcasty/${episode.slug}`}
                className="block rounded-xl border border-gray-100 bg-white p-5 transition-colors hover:border-blue-200"
              >
                <div className="text-xs font-medium text-blue-600">
                  #{episode.number} · {episode.dimension}
                </div>
                <h2 className="mt-1 font-semibold text-gray-900">{episode.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{episode.thesis}</p>
                <p className="mt-2 text-xs text-gray-500">Focus: {episode.focus}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Planned topics
        </p>
        <div className="space-y-3">
          {planned.map((episode) => (
            <div key={episode.slug} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="text-xs font-medium text-gray-500">
                #{episode.number} · {episode.dimension}
              </div>
              <h2 className="mt-1 font-semibold text-gray-700">{episode.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{episode.thesis}</p>
              <p className="mt-2 text-xs text-gray-500">Focus: {episode.focus}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
