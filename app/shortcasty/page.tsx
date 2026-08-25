import Link from "next/link";
import { EPISODES } from "@/lib/shortcasty";
import { MODEL_VERSION } from "@/lib/version";

export const metadata = {
  title: `ProcuraCost ${MODEL_VERSION}: krótkie materiały metodologiczne`,
  description:
    `Planowana, ograniczona źródłowo seria o założeniach i niepewności modelu ProcuraCost ${MODEL_VERSION}.`,
};

export default function ShortcastyPage() {
  const published = EPISODES.filter((episode) => episode.publishedAt);
  const planned = EPISODES.filter((episode) => !episode.publishedAt);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          Model {MODEL_VERSION} · plan redakcyjny
        </p>
        <h1 className="text-3xl font-bold leading-tight">ProcuraCost: źródła i założenia</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100">
          Planowana seria redakcyjna oddziela ustalenia źródłowe od kalibracji
          modelowej. Nie przedstawia wyników ProcuraCost jako zmierzonych efektów
          organizacyjnych.
        </p>
      </div>

      {published.length > 0 && (
        <section className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Opublikowane materiały
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
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Planowane tematy
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
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
