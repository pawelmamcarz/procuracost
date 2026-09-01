import Link from "next/link";

import { homeExperienceT, type Lang } from "@/lib/i18n";
import { SITE_ROUTES } from "@/lib/site-routes";

interface EvidenceFieldHomeProps {
  lang: Lang;
}

const primaryLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

const textLinkClass =
  "inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-blue-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

function siteHref(key: string, lang: Lang) {
  const route = SITE_ROUTES.find((candidate) => candidate.key === key);
  if (!route) throw new Error("Missing route-manifest entry: " + key);
  const href = lang === "en" ? route.en ?? route.pl : route.pl ?? route.en;
  if (!href) throw new Error("Route has no public path: " + key);
  return href;
}

export default function EvidenceFieldHome({ lang }: EvidenceFieldHomeProps) {
  const tx = homeExperienceT[lang];
  const paths = [
    {
      id: "practical",
      copy: tx.paths.practical,
      href: siteHref("calculator", lang),
    },
    {
      id: "research",
      copy: tx.paths.research,
      href: siteHref("model", lang),
    },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="border-b border-gray-200 pb-12 sm:pb-16">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          {tx.hero.eyebrow}
        </p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] lg:items-end">
          <div className="border-l-4 border-blue-700 pl-5 sm:pl-7">
            <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.035em] text-gray-900 sm:text-5xl sm:leading-[1.08]">
              {tx.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              {tx.hero.description}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:pb-1">
            <Link href={siteHref("calculator", lang)} className={primaryLinkClass}>
              {tx.hero.primaryAction}
            </Link>
            <Link href={siteHref("model", lang)} className={textLinkClass}>
              {tx.hero.secondaryAction}
            </Link>
          </div>
        </div>
      </header>

      <section aria-labelledby="home-paths-title" className="border-b border-gray-200 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          01 / {tx.paths.eyebrow}
        </p>
        <h2 id="home-paths-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {tx.paths.title}
        </h2>
        <div className="mt-7 border-b border-gray-200">
          {paths.map(({ id, copy, href }) => (
            <article
              className="grid gap-4 border-t border-gray-200 py-7 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:items-center md:gap-8"
              data-home-path={id}
              key={id}
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                {copy.eyebrow}
              </p>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{copy.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{copy.body}</p>
              </div>
              <Link className={textLinkClass} href={href}>
                {copy.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="home-record-title"
        className="grid gap-9 border-b border-gray-200 py-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(18rem,1.15fr)] lg:gap-14"
        data-record-preview="structure"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            02 / {tx.record.eyebrow}
          </p>
          <h2 id="home-record-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {tx.record.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-gray-600">{tx.record.description}</p>
        </div>
        <ol className="relative border-l-2 border-blue-700 pl-6">
          {tx.record.fields.map((field, index) => (
            <li className="relative border-b border-gray-200 py-4 first:pt-0 last:border-b-0 last:pb-0" key={field}>
              <span
                aria-hidden="true"
                className="absolute -left-[1.82rem] top-[1.35rem] h-2.5 w-2.5 rounded-full border-2 border-blue-700 bg-white first:top-1"
              />
              <span className="mr-3 font-mono text-xs text-blue-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold text-gray-800">{field}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="home-journey-title" className="border-b border-gray-200 py-12">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(18rem,1.2fr)] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              03 / {tx.journey.eyebrow}
            </p>
            <h2 id="home-journey-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {tx.journey.title}
            </h2>
          </div>
          <p className="text-sm leading-6 text-gray-600 lg:pt-7">{tx.journey.intro}</p>
        </div>
        <ol className="mt-8 border-y border-gray-200">
          {tx.journey.steps.map((step, index) => (
            <li
              className="grid gap-3 border-t border-gray-100 py-5 first:border-t-0 sm:grid-cols-[4rem_11rem_minmax(0,1fr)] sm:items-baseline"
              data-guided-step={index + 1}
              key={step.title}
            >
              <span className="font-mono text-xs font-semibold text-blue-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm leading-6 text-gray-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label={tx.trust.eyebrow} className="border-b border-gray-200 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          04 / {tx.trust.eyebrow}
        </p>
        <div className="mt-6 grid border-y border-gray-200 md:grid-cols-3">
          {tx.trust.items.map((item, index) => (
            <article
              className="border-b border-gray-200 py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              key={item.title}
            >
              <p className="font-mono text-xs text-blue-700">0{index + 1}</p>
              <h2 className="mt-2 text-base font-bold text-gray-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 py-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{tx.finalAction.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">{tx.finalAction.body}</p>
        </div>
        <Link className={primaryLinkClass} href={siteHref("calculator", lang)}>
          {tx.finalAction.action}
        </Link>
      </section>
    </div>
  );
}
