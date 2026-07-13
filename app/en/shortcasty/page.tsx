import Link from "next/link";
import { EPISODES } from "@/lib/shortcasty";

export const metadata = {
  title: "Field Conversations — ProcuraCost Shortcasty",
  description:
    "A shortcast series about hypotheses and measurement of procurement-procedure costs: one topic, source or assumption, and a decision to investigate.",
};

const PLATFORMS = [
  { label: "YouTube", href: "#", color: "bg-red-50 text-red-700 border-red-200" },
  { label: "Spotify", href: "#", color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Apple Podcasts", href: "#", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

export default function ShortcastyEnPage() {
  const published = EPISODES.filter((e) => e.publishedAt);
  const upcoming = EPISODES.filter((e) => !e.publishedAt);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          Season 1 · 20 episodes
        </p>
        <h1 className="text-3xl font-bold leading-tight">Field Conversations</h1>
        <p className="mt-1 text-base text-blue-100 font-medium">
          Short talks about how much you lose in the tunnel — and how to get out into the field.
        </p>
        <p className="mt-4 text-sm text-blue-100 max-w-2xl leading-relaxed">
          10 minutes. One cost dimension. One piece of evidence from the ProcuraCost model.
          Conversations with buyers, CPOs, CFOs, lawyers and implementers about the real cost of
          “just following the procedure”.
        </p>

        {/* Platform links */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-xs text-blue-200">Listen on:</span>
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

      {/* Subscribe */}
      <div className="mb-10 rounded-xl border border-blue-100 bg-blue-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-900 mb-0.5">
            Get notified
          </p>
          <p className="text-xs text-blue-700">
            New episode every two weeks, Tuesday at 7:00.
          </p>
        </div>
        <a
          href="mailto:pawel@mamcarz.com?subject=Field%20Conversations%20%E2%80%94%20subscribe%20to%20notifications&body=Hi%2C%20please%20add%20me%20to%20notifications%20for%20new%20Field%20Conversations%20episodes."
          className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 text-center"
        >
          Subscribe →
        </a>
      </div>

      {/* Published episodes */}
      {published.length > 0 && (
        <div className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Published episodes
          </p>
          <div className="space-y-3">
            {published.map((ep) => (
              <Link
                key={ep.slug}
                href={`/shortcasty/${ep.slug}`}
                className="block rounded-xl border border-gray-100 bg-white p-5 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-blue-600">#{ep.number} · {ep.dimension}</div>
                    <h3 className="mt-1 font-semibold text-gray-900">{ep.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{ep.thesis}</p>
                    <p className="mt-2 text-xs text-gray-500">Guest: {ep.guest}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Upcoming episodes
          </p>
          <div className="space-y-3">
            {upcoming.map((ep) => (
              <div key={ep.slug} className="rounded-xl border border-gray-100 bg-gray-50 p-5 opacity-75">
                <div className="text-xs font-medium text-gray-500">#{ep.number} · {ep.dimension}</div>
                <h3 className="mt-1 font-semibold text-gray-700">{ep.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{ep.thesis}</p>
                <p className="mt-2 text-xs text-gray-500">Guest: {ep.guest} (coming soon)</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
