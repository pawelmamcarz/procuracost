import type { Metadata } from "next";
import Link from "next/link";
import PipeFieldDiagram from "@/components/PipeFieldDiagram";
import DecisionMap from "@/components/DecisionMap";
import { SCENARIOS } from "@/lib/scenarios";
import { calculateCosts } from "@/lib/calculations";

export const metadata: Metadata = {
  title: "ProcuraCost — Procurement Cost Calculator",
  description:
    "Neutral procurement cost model with scenario uncertainty, path optimizer, and maturity self-assessment.",
};

const stats = [
  { value: "~6%", label: "price increase under discretion; structural estimate, Hungarian-market transfer", source: "Szucs, JEEA 2024" },
  { value: "0.077–0.105/year", label: "added formal-amendment frequency for a 1 SD rise in each of 7 contract-rigidity categories", source: "Beuve et al., JLEO 2023, 2SLS/IV" },
  { value: "0–15%", label: "declared TCO stress test; central scenario is zero", source: "model 2.2 assumption" },
];

const howItWorks = [
  {
    step: "01",
    title: "Describe your purchase",
    body: "Choose a scenario (Ryanair, Swiss Casinos, Zara…) or enter your own data: contract value, process type, team and rates. No registration required.",
  },
  {
    step: "02",
    title: "Calculate hidden costs",
    body: "The model computes seven dimensions and reports a central result with a broad scenario range that may favor either path.",
  },
  {
    step: "03",
    title: "Compare and act",
    body: "Results include illustrative scenarios (model-generated), a procurement-path recommendation (rule-based model with sensitivity analysis) and a PDF report with academic citations.",
  },
];

const team = [
  {
    name: "Paweł Mamcarz",
    role: "Model architect / ProcureTech",
    initials: "PM",
    color: "bg-blue-600",
    url: "https://mamcarz.com",
  },
  {
    name: "Tomasz Ślusarczyk",
    role: "Procurement expert",
    initials: "TŚ",
    color: "bg-indigo-600",
    url: null,
  },
  {
    name: "Rafał Madejewski",
    role: "Analyst & researcher",
    initials: "RM",
    color: "bg-teal-600",
    url: null,
  },
];

const caseStudyPreviews = SCENARIOS.filter((s) => s.caseStudy)
  .slice(0, 3)
  .map((s) => {
    const result = calculateCosts(s.inputs);
    const insight = s.caseStudy!.insightEn;
    return {
      title: s.caseStudy!.title,
      // Full text. Truncating at 117 chars systematically severed the caveat, which is
      // always the second sentence — "This is a c…" instead of "…a claim reported by an
      // organisation promoting the method, not an independent study."
      insight,
      rigidDays: result.rigidDays,
      flexibleDays: result.flexibleDays,
      source: s.caseStudy!.source,
    };
  });

const principles = [
  {
    title: "Procedure ≠ Policy",
    body: "Policy defines boundaries and procedure orders activities. Separating them lets us compare lawful paths without assuming the result.",
  },
  {
    title: "Control and adaptation",
    body: "Formalisation can protect competition and auditability; adaptation can reduce delay. The model represents both mechanisms.",
  },
  {
    title: "Costs are measurable",
    body: "Each day of delay and each formal amendment can carry a cost. The calculator shows the components and the threshold at which the recommendation changes.",
  },
];

export default function EnHomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Research & Consulting Tool
        </span>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Tunnel or field?
          <br />
          It is an empirical question.
        </h1>
        <p className="mt-2 text-sm italic text-blue-600">
          A tunnel has walls. A field has a horizon.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          The model tests when sequential formality costs more than the control value it creates—
          <span className="font-semibold text-gray-700">without assuming the winner</span>.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/en/calculator"
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open calculator →
          </Link>
          <Link
            href="/en/assessment"
            className="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300"
          >
            Free self-assessment →
          </Link>
          <Link
            href="/en/optimizer"
            className="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300"
          >
            Path optimizer →
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm"
          >
            <p className="text-3xl font-bold text-blue-700">{s.value}</p>
            <p className="mt-1 text-xs text-gray-600">{s.label}</p>
            <p className="mt-2 text-xs text-gray-400">{s.source}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-6">
          How ProcuraCost works
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {howItWorks.map((h) => (
            <div key={h.step} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <span className="text-2xl font-bold text-blue-100">{h.step}</span>
              <h3 className="mt-2 font-bold text-gray-900">{h.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{h.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {principles.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-900">{p.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-5">
          Case studies — flexible procurement in practice
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {caseStudyPreviews.map((cs) => (
            <div key={cs.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <p className="text-xs font-bold text-gray-900">{cs.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{cs.insight}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="rounded-md bg-red-50 border border-red-200 px-2 py-1 text-xs text-red-700">
                  Tunnel: {cs.rigidDays} days
                </span>
                <span className="rounded-md bg-green-50 border border-green-200 px-2 py-1 text-xs text-green-700">
                  Field: {cs.flexibleDays} days
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Day figures are illustrative model output for a purchase of this size, not the figures from the cited case.
              </p>
              <p className="text-xs text-gray-400">{cs.source}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/en/case-studies" className="text-xs text-blue-600 hover:underline">
            View all case studies →
          </Link>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-900">The Tunnel vs. Field model</h2>
        <p className="mt-1 text-sm text-blue-700">
          The same purchase and compliance boundary, but two lawful paths. The model tests when formalisation protects value and when adaptation costs less.
        </p>
        <div className="mt-4">
          <PipeFieldDiagram lang="en" />
        </div>
        <p className="mt-3 text-xs text-blue-600">
          Theoretical basis: Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) Challenger;
          Holmström &amp; Milgrom (1991) Multitask Principal-Agent
        </p>
      </div>

      <div className="mt-12">
        <DecisionMap lang="en" />
      </div>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-5">Team</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm flex items-center gap-4"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${member.color}`}
              >
                {member.initials}
              </span>
              <div>
                {member.url ? (
                  <a
                    href={member.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {member.name}
                  </a>
                ) : (
                  <p className="font-semibold text-gray-900">{member.name}</p>
                )}
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">See what your organisation is losing</h2>
        <p className="mt-2 text-blue-100">
          Cost calculator, path optimizer and a free procurement maturity self-assessment —
          with empirical evidence separated from broad scenario assumptions.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/en/calculator"
            className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            Open calculator
          </Link>
          <Link
            href="/en/assessment"
            className="rounded-xl border border-white/40 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20"
          >
            Free self-assessment →
          </Link>
        </div>
      </div>
    </div>
  );
}
