import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { practiceT, type Lang } from "@/lib/i18n";
import { PROCUREMENT_BEYOND_8 } from "@/lib/model-v2/evidence";

function timestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function ProcurementBeyond8({ lang }: { lang: Lang }) {
  const tx = practiceT[lang];

  return (
    <article className="mx-auto max-w-5xl space-y-12 px-6 py-12">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {tx.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {tx.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600">{tx.subtitle}</p>
        <p className="mt-3 border-l-2 border-amber-400 pl-4 text-sm leading-relaxed text-gray-600">
          {tx.recordingLanguageNotice}
        </p>
      </header>

      <section aria-labelledby="practice-recording">
        <h2 id="practice-recording" className="sr-only">
          {tx.embedTitle}
        </h2>
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <iframe
            className="h-full w-full"
            src="https://www.youtube-nocookie.com/embed/5KYUdTLlvvg"
            title={tx.embedTitle}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-3 text-xs text-gray-500 sm:grid-cols-3">
          <div>
            <dt className="font-semibold text-gray-700">{tx.publishedLabel}</dt>
            <dd className="mt-1 font-mono">{PROCUREMENT_BEYOND_8.publishedAt}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">{tx.durationLabel}</dt>
            <dd className="mt-1 font-mono">{timestamp(PROCUREMENT_BEYOND_8.durationSeconds)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700">{tx.transcriptLabel}</dt>
            <dd className="mt-1 leading-relaxed">{tx.transcriptValue}</dd>
          </div>
        </dl>
        <a
          href={PROCUREMENT_BEYOND_8.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {tx.originalVideo}
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
      </section>

      <section aria-labelledby="practice-sections">
        <h2 id="practice-sections" className="text-2xl font-bold text-gray-900">
          {tx.sectionsTitle}
        </h2>
        <ol className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
          {PROCUREMENT_BEYOND_8.refs.map((ref, index) => {
            const copy = tx.sections[ref.id];
            return (
              <li
                key={ref.id}
                className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-[7rem_1fr]"
              >
                <div>
                  <p className="font-mono text-xs text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${tx.timestampLabel}: ${timestamp(ref.startSeconds)}–${timestamp(ref.endSeconds ?? ref.startSeconds)}`}
                    className="mt-1 inline-flex items-center gap-1 font-mono text-xs font-semibold text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {timestamp(ref.startSeconds)}–{timestamp(ref.endSeconds ?? ref.startSeconds)}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{copy.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{copy.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="practice-boundary" className="space-y-6">
        <h2 id="practice-boundary" className="text-2xl font-bold text-gray-900">
          {tx.boundary.title}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="border-t-2 border-blue-500 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-blue-700">
              {tx.boundary.supportsTitle}
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700">
              {tx.boundary.supports.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-blue-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t-2 border-gray-600 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700">
              {tx.boundary.doesNotSupportTitle}
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700">
              {tx.boundary.doesNotSupport.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-gray-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium leading-relaxed text-blue-900">
          {tx.bielikTcoBoundary}
        </p>
        <p className="border-l-2 border-amber-400 pl-4 text-xs leading-relaxed text-gray-500">
          {tx.sourceNote}
        </p>
      </section>

      <nav className="flex flex-col gap-3 border-t border-gray-200 pt-8 sm:flex-row" aria-label={tx.eyebrow}>
        <Link
          href={lang === "en" ? "/en/readiness" : "/readiness"}
          className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {tx.readinessCta}
        </Link>
        <Link
          href={lang === "en" ? "/en/calculator" : "/calculator"}
          className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {tx.calculatorCta}
        </Link>
      </nav>
    </article>
  );
}
