import Link from "next/link";

import { modelOverviewT, type Lang } from "@/lib/i18n";

const sectionKeys = [
  "legalBoundary",
  "workflowDesign",
  "costRecord",
  "evidenceBoundary",
] as const;

function routesFor(lang: Lang) {
  const prefix = lang === "en" ? "/en" : "";
  return [
    { href: `${prefix}/model/assumptions`, key: "assumptions" },
    { href: `${prefix}/methodology`, key: "methodology" },
    { href: `${prefix}/case-studies`, key: "evidence" },
    { href: `${prefix}/readiness`, key: "readiness" },
    {
      href: `${prefix}/practice/procurement-beyond-8`,
      key: "practice",
    },
  ] as const;
}

export default function ModelOverview({ lang }: { lang: Lang }) {
  const tx = modelOverviewT[lang];

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-gray-200 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          {tx.eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {tx.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">
          {tx.intro}
        </p>
      </header>

      <section aria-label={tx.title} className="border-b border-gray-200 py-10">
        {sectionKeys.map((key) => {
          const section = tx.sections[key];
          return (
            <article
              key={key}
              className="grid gap-3 border-t border-gray-200 py-6 md:grid-cols-[11rem_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-7"
            >
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-blue-700">
                {section.label}
              </p>
              <h2 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="text-sm leading-6 text-gray-600">{section.body}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 border-b border-gray-200 py-10 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8">
        <h2 className="text-lg font-semibold text-gray-900">{tx.rangeTitle}</h2>
        <p className="border-l-2 border-blue-700 pl-5 text-sm leading-7 text-gray-700">
          {tx.rangeDisclosure}
        </p>
      </section>

      <nav aria-label={tx.actionsTitle} className="py-10">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          {tx.actionsTitle}
        </h2>
        <div className="mt-4 border-b border-gray-200">
          {routesFor(lang).map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className="flex min-h-12 items-center justify-between border-t border-gray-200 py-3 text-sm font-semibold text-gray-800 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span>{tx.actions[key]}</span>
              <span aria-hidden="true" className="font-mono text-blue-700">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
