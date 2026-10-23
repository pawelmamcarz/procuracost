import Link from "next/link";
import type { ReactNode } from "react";
import { NumberedPoint, NumberedProvenanceItem, NumberedProvenanceRule } from "@/components/NumberedProvenanceRule";
import Reveal from "@/components/motion/Reveal";
import ScenarioDrivers, { type DebateScenario, type DebateScenarioId } from "@/components/debate/ScenarioDrivers";
import TunnelFieldToggle from "@/components/debate/TunnelFieldToggle";
import { debateT, type Lang } from "@/lib/i18n";
import { buildDecisionRecordV2, createScenarioDraft } from "@/lib/model-v2";

const SCENARIOS: DebateScenarioId[] = [
  "fleet_tco_reframing",
  "erp_transformation_discovery",
  "logistics_service_redesign",
];
const CONTROLS = ["catalog_calloff_control", "mrp_release_control"] as const;
const linkClass = "inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export default function DebateBento({ lang, variant = "home" }: { lang: Lang; variant?: "home" | "article" }) {
  const tx = debateT[lang];
  const title = variant === "article" ? tx.articleTitle : tx.title;
  const intro = variant === "article" ? tx.articleIntro : tx.intro;
  const prefix = lang === "en" ? "/en" : "";
  const scenarios: DebateScenario[] = SCENARIOS.map((id) => {
    const record = buildDecisionRecordV2(createScenarioDraft(id));
    const drivers: DebateScenario["drivers"] = [
      { id: "role", value: record.alternatives.formalSequential.result.roleCost.central - record.alternatives.adaptiveCompliant.result.roleCost.central },
      { id: "nonLabour", value: record.alternatives.formalSequential.result.nonLabourCost.central - record.alternatives.adaptiveCompliant.result.nonLabourCost.central },
      { id: "delay", value: record.alternatives.formalSequential.result.delayCost.central - record.alternatives.adaptiveCompliant.result.delayCost.central },
      { id: "contract", value: record.drivers.filter(({ id }) => id !== "role_cost" && id !== "non_labour_cost" && id !== "delay_cost").reduce((sum, driver) => sum + driver.contribution.central, 0) },
    ];
    return { id, drivers, total: record.comparison.deltaCost };
  });
  const currency = new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    style: "currency", currency: "PLN", maximumFractionDigits: 0,
  });

  function tile(index: number, span: string, children: ReactNode, question?: number, surface = "bg-white") {
    return (
      <Reveal className={`min-w-0 p-5 sm:p-8 ${surface} ${span}`} index={index}>
        <article data-debate-tile={index + 1} id={question ? `question-${question}` : undefined} className="min-w-0 scroll-mt-8">
          <p className="mb-4 flex items-center gap-3 font-mono text-sm uppercase tracking-wide text-blue-700">
            {question && <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-700">{question}</span>}
            {tx.threads[index]}
          </p>
          <h3 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">{tx.titles[index]}</h3>
          {children}
        </article>
      </Reveal>
    );
  }

  return (
    <section aria-label={title} className="py-12" data-debate-hub={lang}>
      <header className="mb-8 max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{title}</h2>
        <p className="mt-4 text-base leading-7 text-gray-700 sm:text-lg">{intro}</p>
      </header>
      <div className="grid grid-cols-1 gap-px border border-gray-200 bg-gray-200 md:grid-cols-6">
        {tile(0, "md:col-span-6", <>
          <TunnelFieldToggle lang={lang} />
          <Link className={linkClass} href={`${prefix}/model`}>{tx.links.model}</Link>
        </>, 3)}
        {tile(1, "md:col-span-3", <>
          <dl className="mt-6 grid gap-6 text-base leading-6 text-gray-700 sm:grid-cols-2">
            {[
              { title: tx.automation, items: tx.automationItems },
              { title: tx.human, items: tx.humanItems },
            ].map(({ title, items }) => (
              <div key={title}>
                <dt className="border-b-2 border-blue-700 pb-3 font-mono text-sm font-semibold text-blue-700">{title}</dt>
                <dd><ul className="mt-2 space-y-3">{items.map((item) => <li key={item}>{item}</li>)}</ul></dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex flex-wrap gap-x-4">
            <Link className={linkClass} href={`${prefix}/readiness`}>{tx.links.readiness}</Link>
            <Link className={linkClass} href="/kupiec-po-automatyzacji">{tx.links.article}</Link>
          </div>
        </>, 1)}
        {tile(4, "md:col-span-3", <>
          <NumberedProvenanceRule className="mt-6">
            {tx.rules.map((rule, index) => (
              <NumberedProvenanceItem key={rule}>
                <NumberedPoint index={index} className="mr-3" />
                <span className="text-base font-semibold text-gray-900">{rule}</span>
              </NumberedProvenanceItem>
            ))}
          </NumberedProvenanceRule>
          <p className="mt-8 border-t border-blue-200 pt-6 text-xl font-medium leading-8 text-gray-900">{tx.rulePrinciple}</p>
          <Link className={linkClass} href={`${prefix}/methodology`}>{tx.links.methodology}</Link>
        </>, 2, "bg-blue-50")}
        {tile(3, "md:col-span-4", <>
          <ScenarioDrivers lang={lang} scenarios={scenarios} />
          <Link className={linkClass} href={`${prefix}/calculator`}>{tx.links.calculator}</Link>
        </>)}
        {tile(2, "md:col-span-2", <>
          <ul className="mt-6 divide-y divide-gray-200 text-base leading-7 text-gray-700">
            {tx.measures.map((measure) => <li className="py-5" key={measure}>{measure}</li>)}
          </ul>
          <Link className={linkClass} href="/kupiec-po-automatyzacji">{tx.links.measures}</Link>
        </>, 4, "bg-gray-50")}
        {tile(5, "md:col-span-2", <>
          <dl className="mt-6 divide-y divide-gray-200">
            {CONTROLS.map((id) => (
              <div className="space-y-3 py-5" key={id}>
                <dt className="text-base text-gray-700">{tx.controls[id]}</dt>
                <dd className="font-mono text-4xl tabular-nums text-gray-900">
                  {currency.format(buildDecisionRecordV2(createScenarioDraft(id)).comparison.deltaCost)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-base leading-7 text-gray-600">{tx.controlNote}</p>
          <Link className={linkClass} href={`${prefix}/case-studies`}>{tx.links.cases}</Link>
        </>, undefined, "bg-gray-50")}
        {tile(6, "md:col-span-4", <>
          <ol className="mt-6 list-decimal space-y-5 pl-6 text-base leading-7 text-gray-700 marker:font-mono marker:text-blue-700">
            {tx.questions.map((question) => <li className="pl-2" key={question}>{question}</li>)}
          </ol>
          {variant === "home" && <Link className={`${linkClass} mt-4`} href="/kupiec-po-automatyzacji">{tx.links.article}</Link>}
        </>)}
      </div>
    </section>
  );
}
