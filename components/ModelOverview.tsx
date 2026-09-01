import Link from "next/link";

import { modelOverviewT, type Lang } from "@/lib/i18n";

const sectionKeys = [
  "legalBoundary",
  "workflowDesign",
  "costRecord",
  "evidenceBoundary",
] as const;

export default function ModelOverview({ lang }: { lang: Lang }) {
  const tx = modelOverviewT[lang];
  const prefix = lang === "en" ? "/en" : "";
  const researchGroups = [
    {
      id: "contract",
      copy: tx.groups.contract,
      links: [
        {
          href: `${prefix}/model/assumptions`,
          copy: tx.groups.contract.items.assumptions,
        },
        {
          href: `${prefix}/methodology`,
          copy: tx.groups.contract.items.methodology,
        },
        {
          href: `${prefix}/case-studies`,
          copy: tx.groups.contract.items.evidence,
        },
      ],
    },
    {
      id: "reproducibility",
      copy: tx.groups.reproducibility,
      links: [
        {
          href: lang === "en" ? "/research" : "/research-agenda",
          copy: tx.groups.reproducibility.items.paper,
        },
        {
          href: "https://github.com/pawelmamcarz/procuracost",
          copy: tx.groups.reproducibility.items.repository,
          external: true,
        },
      ],
    },
    {
      id: "context",
      copy: tx.groups.context,
      links: [
        {
          href: `${prefix}/practice/procurement-beyond-8`,
          copy: tx.groups.context.items.practice,
        },
        {
          href: `${prefix}/team`,
          copy: tx.groups.context.items.team,
        },
      ],
    },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="border-b border-gray-200 pb-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          {tx.eyebrow}
        </p>
        <div className="mt-4 border-l-4 border-blue-700 pl-5 sm:pl-7">
          <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.035em] text-gray-900 sm:text-5xl">
            {tx.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">
            {tx.intro}
          </p>
        </div>
      </header>

      <section aria-label={tx.actionsTitle} className="border-b border-gray-200 py-12">
        {researchGroups.map(({ id, copy, links }, groupIndex) => (
          <article
            className="grid gap-5 border-t border-gray-200 py-8 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10"
            data-research-group={id}
            key={id}
          >
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                {String(groupIndex + 1).padStart(2, "0")} / {copy.eyebrow}
              </p>
              <h2 className="mt-3 text-xl font-bold text-gray-900">{copy.title}</h2>
            </div>
            <div className="border-b border-gray-200">
              {links.map((item) => {
                const row = (
                  <>
                    <span>
                      <span className="block text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                        {item.copy.title}
                      </span>
                      <span className="mt-1 block max-w-2xl text-xs leading-5 text-gray-600">
                        {item.copy.body}
                      </span>
                    </span>
                    <span aria-hidden="true" className="font-mono text-blue-700">↗</span>
                  </>
                );
                const className =
                  "group flex min-h-16 items-center justify-between gap-6 border-t border-gray-200 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";
                return "external" in item ? (
                  <a className={className} href={item.href} key={item.href} rel="noreferrer" target="_blank">
                    {row}
                  </a>
                ) : (
                  <Link className={className} href={item.href} key={item.href}>
                    {row}
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      <section aria-label={tx.eyebrow} className="border-b border-gray-200 py-12">
        {sectionKeys.map((key) => {
          const section = tx.sections[key];
          return (
            <article
              key={key}
              className="grid gap-3 border-t border-gray-200 py-6 first:border-t-0 md:grid-cols-[11rem_minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-7"
            >
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-blue-700">
                {section.label}
              </p>
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              <p className="text-sm leading-6 text-gray-600">{section.body}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 py-12 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8">
        <h2 className="text-lg font-semibold text-gray-900">{tx.rangeTitle}</h2>
        <p className="border-l-2 border-blue-700 pl-5 text-sm leading-7 text-gray-700">
          {tx.rangeDisclosure}
        </p>
      </section>
    </div>
  );
}
