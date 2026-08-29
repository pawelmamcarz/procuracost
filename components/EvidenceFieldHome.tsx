import Link from "next/link";

import EvidenceDocket from "@/components/evidence/EvidenceDocket";
import {
  buildCompactHomeRail,
  homeEvidenceRecords,
} from "@/components/home/home-surface-data";
import { ProcessRail } from "@/components/process-map/ProcessRail";
import { homeT, type Lang } from "@/lib/i18n";
import { SITE_ROUTES } from "@/lib/site-routes";

interface EvidenceFieldHomeProps {
  lang: Lang;
}

const primaryLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

const textLinkClass =
  "inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:decoration-blue-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

const JOB_ROUTE_KEYS = ["calculator", "optimizer", "assessment"] as const;

function siteHref(key: string, lang: Lang) {
  const route = SITE_ROUTES.find((candidate) => candidate.key === key);
  if (!route) throw new Error("Missing route-manifest entry: " + key);
  const href = lang === "en" ? route.en ?? route.pl : route.pl ?? route.en;
  if (!href) {
    throw new Error("Route-manifest entry " + key + " has no public path.");
  }
  return href;
}

export default function EvidenceFieldHome({ lang }: EvidenceFieldHomeProps) {
  const tx = homeT[lang];
  const rail = buildCompactHomeRail(lang);
  const evidenceRecords = homeEvidenceRecords();
  const jobs = tx.jobs.items.map((copy, index) => ({
    copy,
    href: siteHref(JOB_ROUTE_KEYS[index], lang),
  }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-gray-200 pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          {tx.hero.eyebrow}
        </p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,0.75fr)] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {tx.hero.title}
            </h1>
            <p className="mt-4 text-sm font-semibold text-blue-700 sm:text-base">
              {tx.hero.tagline}
            </p>
          </div>
          <div>
            <p className="text-base leading-7 text-gray-600">
              {tx.hero.description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={siteHref("calculator", lang)}
                className={primaryLinkClass}
              >
                {tx.hero.primaryAction}
              </Link>
              <Link
                href={siteHref("caseStudies", lang)}
                className={textLinkClass}
              >
                {tx.hero.secondaryAction}
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-8 max-w-3xl border-l-2 border-blue-700 pl-4 text-sm font-medium leading-6 text-gray-700">
          {tx.neutrality}
        </p>
      </header>

      <section
        aria-labelledby="home-process-rail-title"
        className="border-b border-gray-200 py-10"
        data-home-process-rail
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          {tx.rail.eyebrow}
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.75fr)] md:items-end">
          <h2
            id="home-process-rail-title"
            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            {tx.rail.title}
          </h2>
          <p className="text-sm leading-6 text-gray-600">{tx.rail.note}</p>
        </div>
        <div className="mt-7">
          <ProcessRail
            viewModel={rail}
            mode="read-only"
            idPrefix="home-illustration"
          />
        </div>
        <Link
          href={siteHref("calculator", lang)}
          className={"mt-4 " + textLinkClass}
          data-home-rail-action
        >
          {tx.rail.action}
        </Link>
      </section>

      <section
        aria-labelledby="home-model-contract-title"
        className="border-b border-gray-200 py-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          {tx.modelContract.eyebrow}
        </p>
        <h2
          id="home-model-contract-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900"
        >
          {tx.modelContract.title}
        </h2>
        <dl className="mt-6 border-y border-gray-200">
          <div className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:items-baseline">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
              {tx.modelContract.modelVersionLabel}
            </dt>
            <dd className="font-mono text-sm font-semibold text-gray-900">
              {tx.modelContract.modelVersionDisplay}
            </dd>
          </div>
          <div className="grid gap-1 border-t border-gray-100 py-4 sm:grid-cols-[13rem_1fr] sm:items-baseline">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
              {tx.modelContract.uncertaintyLabel}
            </dt>
            <dd className="font-mono text-sm text-gray-700">
              {tx.modelContract.uncertaintyValue}
            </dd>
          </div>
          <div className="grid gap-1 border-t border-gray-100 py-4 sm:grid-cols-[13rem_1fr] sm:items-baseline">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
              {tx.modelContract.winnerLabel}
            </dt>
            <dd className="font-mono text-sm text-gray-700">
              {tx.modelContract.winnerValue}
            </dd>
          </div>
        </dl>
        <p className="mt-5 max-w-3xl text-sm leading-6 text-gray-600">
          {tx.modelContract.note}
        </p>
      </section>

      <section
        aria-labelledby="home-jobs-title"
        className="border-b border-gray-200 py-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          {tx.jobs.eyebrow}
        </p>
        <h2
          id="home-jobs-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900"
        >
          {tx.jobs.title}
        </h2>
        <div className="mt-6 border-b border-gray-200">
          {jobs.map(({ copy, href }) => (
            <article
              key={copy.label}
              className="grid gap-3 border-t border-gray-200 py-6 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
              data-home-job
            >
              <h3 className="font-semibold text-gray-900">{copy.label}</h3>
              <p className="text-sm leading-6 text-gray-600">{copy.body}</p>
              <Link href={href} className={textLinkClass}>
                {copy.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-evidence-title" className="py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          {tx.evidenceRegister.eyebrow}
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.75fr)] md:items-end">
          <h2
            id="home-evidence-title"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            {tx.evidenceRegister.title}
          </h2>
          <p className="text-sm leading-6 text-gray-600">
            {tx.evidenceRegister.description}
          </p>
        </div>
        <div className="mt-7">
          <EvidenceDocket
            lang={lang}
            records={evidenceRecords}
            variant="compact"
          />
        </div>
        <Link
          href={siteHref("caseStudies", lang)}
          className={"mt-5 " + textLinkClass}
        >
          {tx.evidenceRegister.allAction}
        </Link>
      </section>
    </div>
  );
}
