import { notFound } from "next/navigation";
import Link from "next/link";
import { EPISODES, getEpisode } from "@/lib/shortcasty";

export function generateStaticParams() {
  return EPISODES.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const ep = getEpisode(params.slug);
  if (!ep) return {};
  return {
    title: `Odc. ${ep.number}: ${ep.title} — Pole Rozmowy`,
    description: ep.thesis,
  };
}

export default function EpisodePage({ params }: { params: { slug: string } }) {
  const ep = getEpisode(params.slug);
  if (!ep) notFound();

  const prev = EPISODES.find((e) => e.number === ep.number - 1);
  const next = EPISODES.find((e) => e.number === ep.number + 1);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/shortcasty"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600"
      >
        ← Pole Rozmowy
      </Link>

      {/* Header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          Odcinek {ep.number} · {ep.dimension}
        </p>
        <h1 className="text-2xl font-bold leading-tight">{ep.title}</h1>
        <p className="mt-3 text-sm text-blue-100">Gość: {ep.guest}</p>
      </div>

      {ep.youtubeId ? (
        /* Published — player */
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
                  Spotify ↗
                </a>
              )}
              {ep.appleUrl && (
                <a
                  href={ep.appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 hover:opacity-80"
                >
                  Apple Podcasts ↗
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Upcoming */
        <div className="mb-8 rounded-xl border border-amber-100 bg-amber-50 p-6 text-center">
          <p className="text-sm font-semibold text-amber-800">Ten odcinek jeszcze nie jest dostępny</p>
          <p className="mt-1 text-xs text-amber-600">
            Zapisz się na powiadomienia, żeby nie przegapić premiery.
          </p>
          <Link
            href="/shortcasty"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Zapisz się
          </Link>
        </div>
      )}

      {/* Episode details */}
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Teza odcinka</p>
          <p className="text-sm text-gray-700 leading-relaxed">{ep.thesis}</p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">
            Rekomendacja
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{ep.recommendation}</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Sprawdź swój wynik
          </p>
          <p className="text-sm text-gray-700 mb-3">
            Policz koszty procedur w swoim projekcie zakupowym.
          </p>
          <Link
            href="/calculator"
            className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Otwórz kalkulator ProcuraCost
          </Link>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="mt-10 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/shortcasty/${prev.slug}`}
            className="flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <p className="text-xs text-gray-400">← Poprzedni</p>
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
            <p className="text-xs text-gray-400">Następny →</p>
            <p className="mt-1 text-sm font-medium text-gray-700 leading-snug">{next.title}</p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
