import Link from "next/link";
import { EPISODES } from "@/lib/shortcasty";

export const metadata = {
  title: "ProcuraCost 2.1 — krótkie materiały metodologiczne",
  description:
    "Krótka seria o źródłach, założeniach i niepewności neutralnego modelu ProcuraCost 2.1.",
};

const PLATFORMS = [
  { label: "YouTube", href: "#", color: "bg-red-50 text-red-700 border-red-200" },
  { label: "Spotify", href: "#", color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Apple Podcasts", href: "#", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

export default function ShortcastyPage() {
  const published = EPISODES.filter((e) => e.publishedAt);
  const upcoming = EPISODES.filter((e) => !e.publishedAt);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          Model 2.1 · {EPISODES.length} odcinki
        </p>
        <h1 className="text-3xl font-bold leading-tight">ProcuraCost: źródła i założenia</h1>
        <p className="mt-1 text-base text-blue-100 font-medium">
          Krótko o tym, co model wie, czego nie wie i kiedy zmienia znak.
        </p>
        <p className="mt-4 text-sm text-blue-100 max-w-2xl leading-relaxed">
          Każdy odcinek oddziela ustalenie źródłowe od kalibracji modelowej.
          Materiały nie przedstawiają wyników ProcuraCost jako zmierzonych efektów organizacyjnych.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-xs text-blue-200">Słuchaj na:</span>
          {PLATFORMS.map((p) => (
            <a
              key={p.label}
              href={p.href}
              className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              {p.label} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="mb-10 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-semibold text-blue-900 mb-1">
          Zapisz się na powiadomienia
        </p>
        <p className="text-xs text-blue-700 mb-3">
          Nowy odcinek co 2 tygodnie, we wtorek o 7:00.
        </p>
        <form
          action="https://formspree.io/f/placeholder"
          method="POST"
          className="flex gap-2 flex-col sm:flex-row"
        >
          <input
            type="email"
            name="email"
            placeholder="twoj@email.com"
            required
            className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
          >
            Zapisz się
          </button>
        </form>
      </div>

      {published.length > 0 && (
        <div className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Opublikowane odcinki
          </p>
          <div className="space-y-3">
            {published.map((ep) => (
              <Link
                key={ep.slug}
                href={`/shortcasty/${ep.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  {ep.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 leading-snug">
                    {ep.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{ep.dimension} · {ep.guest}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                  Dostępny
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {published.length > 0 ? "Nadchodzące odcinki" : `Plan serii — ${EPISODES.length} odcinki`}
        </p>
        <div className="space-y-2">
          {upcoming.map((ep) => (
            <div
              key={ep.slug}
              className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-400">
                {ep.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 leading-snug">{ep.title}</p>
                <p className="mt-0.5 text-xs text-gray-400">{ep.dimension} · {ep.guest}</p>
                <p className="mt-1.5 text-xs text-gray-500 leading-relaxed italic">
                  „{ep.recommendation}&rdquo;
                </p>
              </div>
              <span className="shrink-0 text-xs text-gray-400 bg-gray-100 border border-gray-200 rounded-full px-2.5 py-0.5">
                Wkrótce
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Format odcinka
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { time: "0:30–1:30", label: "Problem", desc: "Konkretna historia z życia, która boli." },
            { time: "1:30–2:30", label: "Dowód", desc: "Jeden parametr z kalkulatora ProcuraCost i liczby." },
            { time: "2:30–10:00", label: "Rozmowa", desc: `3–4 pytania do gościa. Żadnych „opowiedz o karierze". Konkret.` },
          ].map((f) => (
            <div key={f.label} className="rounded-lg border border-gray-100 bg-white p-3">
              <p className="font-mono text-xs text-gray-400">{f.time}</p>
              <p className="mt-0.5 text-xs font-semibold text-gray-700">{f.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
