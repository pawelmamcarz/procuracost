import Link from "next/link";
import BoundaryField from "@/components/BoundaryField";
import DecisionMap from "@/components/DecisionMap";
import { calculateCosts } from "@/lib/calculations";
import { homeT, type Lang } from "@/lib/i18n";
import { SCENARIOS } from "@/lib/scenarios";
import { SITE_ROUTES } from "@/lib/site-routes";

interface EvidenceFieldHomeProps {
  lang: Lang;
}

const REPLICATION_URL = "https://github.com/pawelmamcarz/procuracost/tree/main/replication";

const primaryLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

const textLinkClass =
  "inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-600 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

const scenarioRecords = SCENARIOS.flatMap((scenario) => {
  if (!scenario.caseStudy) return [];

  const result = calculateCosts(scenario.inputs);
  return [{ scenario, caseStudy: scenario.caseStudy, result }];
});

function siteHref(key: string, lang: Lang) {
  const route = SITE_ROUTES.find((candidate) => candidate.key === key);
  if (!route) throw new Error(`Missing route-manifest entry: ${key}`);
  const href = lang === "en" ? route.en ?? route.pl : route.pl ?? route.en;
  if (!href) throw new Error(`Route-manifest entry ${key} has no public path.`);
  return href;
}

function formatDays(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCompactMoney(
  value: number,
  presentation: (typeof homeT)[Lang]["scenarios"]["money"],
) {
  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);
  const isMillions = absoluteValue >= 1_000_000;
  const isThousands = !isMillions && absoluteValue >= 1_000;
  const divisor = isMillions ? 1_000_000 : isThousands ? 1_000 : 1;
  const suffix = isMillions
    ? presentation.millionSuffix
    : isThousands
      ? presentation.thousandSuffix
      : "";
  const fractionDigits = isMillions ? 1 : 0;
  const formattedValue = new Intl.NumberFormat(presentation.locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(absoluteValue / divisor);

  return `${sign}${formattedValue}${suffix}`;
}

export default function EvidenceFieldHome({ lang }: EvidenceFieldHomeProps) {
  const tx = homeT[lang];
  const jobs = [
    { copy: tx.jobs.compare, href: siteHref("calculator", lang) },
    { copy: tx.jobs.choose, href: siteHref("optimizer", lang) },
    { copy: tx.jobs.assess, href: siteHref("assessment", lang) },
  ];
  const evidence = [
    { copy: tx.evidence.assumptions, href: siteHref("modelAssumptions", lang) },
    { copy: tx.evidence.methodology, href: siteHref("methodology", lang) },
    { copy: tx.evidence.paper, href: siteHref("research", lang) },
    { copy: tx.evidence.replication, href: REPLICATION_URL, external: true },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
      <section aria-labelledby="evidence-field-hero" className="border-b border-gray-200 pb-12 sm:pb-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {tx.hero.eyebrow}
        </p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-end">
          <div>
            <h1 id="evidence-field-hero" className="max-w-3xl text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
              {tx.hero.title}
            </h1>
            <p className="mt-4 text-sm font-semibold text-blue-700 sm:text-base">
              {tx.hero.tagline}
            </p>
          </div>
          <div>
            <p className="text-base leading-relaxed text-gray-600">
              {tx.hero.description}
            </p>
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link href={siteHref("calculator", lang)} className={`${primaryLinkClass} w-full sm:w-auto`}>
                {tx.hero.primaryAction}
              </Link>
              <Link href={siteHref("model", lang)} className={`${textLinkClass} justify-center sm:justify-start`}>
                {tx.hero.secondaryAction}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BoundaryField lang={lang} />

      <section aria-labelledby="model-contract-title" className="border-b border-gray-200 py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tx.modelContract.eyebrow}
        </p>
        <h2 id="model-contract-title" className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {tx.modelContract.title}
        </h2>
        <dl className="mt-8 border-y border-gray-200">
          <div className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:items-baseline">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {tx.modelContract.modelVersionLabel}
            </dt>
            <dd className="font-mono text-sm font-semibold text-gray-900">
              {tx.modelContract.modelVersionDisplay}
            </dd>
          </div>
          <div className="grid gap-1 border-t border-gray-200 py-4 sm:grid-cols-[13rem_1fr] sm:items-baseline">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {tx.modelContract.uncertaintyLabel}
            </dt>
            <dd className="font-mono text-sm text-gray-900">
              {tx.modelContract.uncertaintyValue}
            </dd>
          </div>
          <div className="grid gap-1 border-t border-gray-200 py-4 sm:grid-cols-[13rem_1fr] sm:items-baseline">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {tx.modelContract.winnerLabel}
            </dt>
            <dd className="font-mono text-sm text-gray-900">
              {tx.modelContract.winnerValue}
            </dd>
          </div>
        </dl>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-600">
          {tx.modelContract.note}
        </p>
      </section>

      <section aria-labelledby="homepage-jobs-title" className="border-b border-gray-200 py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tx.jobs.eyebrow}
        </p>
        <h2 id="homepage-jobs-title" className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {tx.jobs.title}
        </h2>
        <div className="mt-8 border-b border-gray-200">
          {jobs.map(({ copy, href }) => (
            <div key={copy.label} className="grid gap-3 border-t border-gray-200 py-6 sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-6">
              <h3 className="font-semibold text-gray-900">{copy.label}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{copy.body}</p>
              <Link href={href} className={textLinkClass}>
                {copy.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-gray-200 py-12 sm:py-16">
        <DecisionMap lang={lang} />
      </section>

      <section aria-labelledby="scenario-records-title" className="border-b border-gray-200 py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tx.scenarios.eyebrow}
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 id="scenario-records-title" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {tx.scenarios.title}
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            {tx.scenarios.description}
          </p>
        </div>

        <div
          className="mt-8 overflow-x-auto border-y border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          tabIndex={0}
          role="region"
          aria-label={tx.scenarios.title}
        >
          <table className="min-w-[980px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th scope="col" className="w-44 px-3 py-3">{tx.scenarios.columns.scenario}</th>
                <th scope="col" className="w-28 px-3 py-3 text-right">{tx.scenarios.columns.contractValue}</th>
                <th scope="col" className="w-24 px-3 py-3 text-right text-red-700">{tx.scenarios.columns.formalDays}</th>
                <th scope="col" className="w-24 px-3 py-3 text-right text-green-700">{tx.scenarios.columns.adaptiveDays}</th>
                <th scope="col" className="w-36 px-3 py-3 text-right">{tx.scenarios.columns.uncertainty}</th>
                <th scope="col" className="px-3 py-3">{tx.scenarios.columns.source}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scenarioRecords.map(({ scenario, caseStudy, result }) => {
                const title = lang === "en" ? caseStudy.titleEn : caseStudy.title;
                const insight = lang === "en" ? caseStudy.insightEn : caseStudy.insight;
                const source = lang === "en" ? caseStudy.sourceEn : caseStudy.source;

                return (
                  <tr key={scenario.id} className="align-top">
                    <th scope="row" className="px-3 py-4 text-xs font-semibold leading-relaxed text-gray-900">
                      {title}
                    </th>
                    <td className="whitespace-nowrap px-3 py-4 text-right font-mono text-xs text-gray-700">
                      {formatCompactMoney(scenario.inputs.contractValue, tx.scenarios.money)} {tx.scenarios.money.currencyCode}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right font-mono text-xs font-semibold text-red-700">
                      {formatDays(result.rigidDays, lang)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right font-mono text-xs font-semibold text-green-700">
                      {formatDays(result.flexibleDays, lang)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-right font-mono text-xs text-gray-900">
                      {formatCompactMoney(result.uncertainty.lowDelta, tx.scenarios.money)}–{formatCompactMoney(result.uncertainty.highDelta, tx.scenarios.money)} {tx.scenarios.money.currencyCode}
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-xs leading-relaxed text-gray-600">{insight}</p>
                      <p className="mt-2 text-[11px] leading-relaxed text-gray-400">{source}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex justify-end">
          <Link href={siteHref("caseStudies", lang)} className={textLinkClass}>
            {tx.scenarios.allAction}
          </Link>
        </div>
      </section>

      <section aria-labelledby="evidence-chain-title" className="border-b border-gray-200 py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {tx.evidence.eyebrow}
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 id="evidence-chain-title" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {tx.evidence.title}
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            {tx.evidence.description}
          </p>
        </div>

        <ol className="mt-8 border-b border-gray-200">
          {evidence.map(({ copy, href, external }, index) => (
            <li key={copy.title} className="grid gap-3 border-t border-gray-200 py-5 sm:grid-cols-[3rem_10rem_1fr_auto] sm:items-center sm:gap-5">
              <span className="font-mono text-xs text-gray-400">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-semibold text-gray-900">{copy.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{copy.body}</p>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                  {copy.action}
                </a>
              ) : (
                <Link href={href} className={textLinkClass}>
                  {copy.action}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="final-home-action" className="py-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {tx.finalAction.eyebrow}
        </p>
        <div className="mt-3 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h2 id="final-home-action" className="max-w-2xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {tx.finalAction.title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600">
              {tx.finalAction.body}
            </p>
          </div>
          <Link href={siteHref("calculator", lang)} className={`${primaryLinkClass} w-full sm:w-auto`}>
            {tx.finalAction.action}
          </Link>
        </div>
      </section>
    </div>
  );
}
