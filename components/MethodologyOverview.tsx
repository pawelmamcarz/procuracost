import Link from "next/link";

import { methodologyOverviewT, type Lang } from "@/lib/i18n";

const exampleGroupKeys = ["adaptiveUse", "stableUse"] as const;

function routesFor(lang: Lang) {
  const prefix = lang === "en" ? "/en" : "";
  return [
    { href: `${prefix}/model`, key: "model" },
    { href: `${prefix}/calculator`, key: "calculator" },
    { href: `${prefix}/readiness`, key: "readiness" },
    {
      href: `${prefix}/practice/procurement-beyond-8`,
      key: "practice",
    },
    { href: "/research", key: "research" },
  ] as const;
}

export default function MethodologyOverview({ lang }: { lang: Lang }) {
  const tx = methodologyOverviewT[lang];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-gray-200 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          {tx.eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {tx.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">
          {tx.intro}
        </p>
      </header>

      <ol className="border-b border-gray-200 py-10">
        {tx.steps.map((step, index) => (
          <li
            key={step.title}
            className="grid gap-3 border-t border-gray-200 py-6 md:grid-cols-[4rem_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-7"
          >
            <span className="font-mono text-sm text-blue-700">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="text-lg font-semibold text-gray-900">{step.title}</h2>
            <p className="text-sm leading-6 text-gray-600">{step.body}</p>
          </li>
        ))}
      </ol>

      <section className="border-b border-gray-200 py-10">
        <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {tx.examplesTitle}
          </h2>
          <p className="text-sm leading-6 text-gray-600">{tx.examplesIntro}</p>
        </div>
        <div className="mt-8 grid border-b border-gray-200 lg:grid-cols-2">
          {exampleGroupKeys.map((groupKey, groupIndex) => {
            const group = tx.exampleGroups[groupKey];
            return (
              <section
                key={groupKey}
                className={
                  groupIndex === 0
                    ? "border-t border-gray-200 py-6 lg:pr-8"
                    : "border-t border-gray-200 py-6 lg:border-l lg:pl-8"
                }
              >
                <h3 className="text-base font-semibold text-gray-900">
                  {group.title}
                </h3>
                <div className="mt-4">
                  {group.items.map((example) => (
                    <article
                      key={example.scenarioId}
                      className="border-t border-gray-100 py-5"
                    >
                      <p className="font-mono text-[0.68rem] leading-5 text-blue-700">
                        {example.scenarioId}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold text-gray-900">
                        {example.title}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {example.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 border-b border-gray-200 py-10 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8">
        <h2 className="text-lg font-semibold text-gray-900">{tx.deltaTitle}</h2>
        <div>
          <p className="border-l-2 border-blue-700 pl-5 font-mono text-sm leading-7 text-gray-900">
            {tx.deltaIdentity}
          </p>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            {tx.deltaExplanation}
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {tx.rangeBoundary}
          </p>
        </div>
      </section>

      <section className="grid border-b border-gray-200 md:grid-cols-2">
        <article className="py-8 md:pr-8">
          <h2 className="text-lg font-semibold text-gray-900">{tx.legalTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {tx.legalBoundary}
          </p>
        </article>
        <article className="border-t border-gray-200 py-8 md:border-l md:border-t-0 md:pl-8">
          <h2 className="text-lg font-semibold text-gray-900">
            {tx.practitionerTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {tx.practitionerBoundary}
          </p>
        </article>
      </section>

      <nav aria-label={tx.title} className="flex flex-wrap gap-x-7 gap-y-3 py-10">
        {routesFor(lang).map(({ href, key }) => (
          <Link
            key={key}
            href={href}
            className="min-h-11 border-b border-blue-300 py-3 text-sm font-semibold text-blue-700 hover:border-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {tx.actions[key]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
