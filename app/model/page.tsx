import Link from "next/link";

export const metadata = {
  title: "Model & Assumptions — ProcuraCost",
  description: "Full transparency of the ProcuraCost cost model, parameters, and sources.",
};

export default function ModelPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-10">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          Research Transparency
        </span>
        <h1 className="mt-4 text-3xl font-bold">Model Assumptions &amp; Parameters</h1>
        <p className="mt-3 text-lg text-gray-600">
          This page documents every major quantitative assumption in ProcuraCost, 
          its source, and whether it comes from empirical research or modeling judgment.
        </p>
      </div>

      <div className="prose prose-gray max-w-none">
        <h2>Core Philosophy</h2>
        <p>
          We believe that a research-grade tool must be transparent about what is measured 
          versus what is assumed. Below you will find the current state of parameter documentation.
        </p>

        <div className="my-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <p className="font-medium text-green-900">High-Effort Documentation in Progress</p>
          <p className="mt-2 text-sm text-green-800">
            This is part of an ambitious academic strengthening effort (see <Link href="/PHD_ROADMAP" className="underline">PhD Research Roadmap – Version A</Link>).
            The current focus is on maximum transparency of every assumption in the model.
          </p>
        </div>

        <h2>Key Parameter Categories</h2>

        <h3>1. Rigidity and Behavioral Effects</h3>
        <ul>
          <li><strong>Favoritism premium</strong> under unchecked discretion (which competitive tendering averts): ~6pp (Szucs, JEEA 2024)</li>
          <li><strong>Productivity loss</strong> from lowest-price selection: ~1.6%</li>
          <li><strong>Renegotiation risk</strong> increase from contractual rigidity: 7.7–10.5 pp (Beuve et al., NBER 2021)</li>
          <li><strong>Bypass probability</strong> modeled via sigmoid function (calibrated)</li>
        </ul>

        <h3>2. Technology Level Impacts</h3>
        <p>
          Time multipliers, coordination costs, and tool amortization costs are derived from 
          a synthesis of OECD procurement performance data and consulting benchmarks
          (EY, Deloitte sourcing transformation studies).
        </p>

        <div className="my-6 p-4 border border-blue-200 bg-blue-50 rounded-xl">
          <p className="font-medium">Interaktywny eksplorator założeń</p>
          <p className="text-sm mt-1">
            Dostosuj Spend Type i Process Phase na żywo i zobacz dokładne mnożniki, których używa produkcyjny model:
            <Link href="/model/assumptions" className="ml-1 underline font-semibold">Otwórz Eksplorator założeń →</Link>
          </p>
        </div>

        <h3>3. Direct vs Indirect + Upstream vs Downstream Adjustments (2026)</h3>
        <p>
          In response to academic feedback, we introduced two new dimensions:
        </p>
        <ul>
          <li><strong>Spend Type</strong>: Direct (production inputs) vs Indirect (support spend)</li>
          <li><strong>Process Phase</strong>: Upstream (strategic sourcing &amp; contracting) vs Downstream (operational P2P)</li>
        </ul>
        <p>
          These currently affect TCO savings potential and bypass risk through explicit multipliers.
          Full empirical calibration of these effects is part of the ongoing validation agenda.
        </p>

        <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mt-0 text-blue-900">Full Parameter Documentation (High-Effort Version)</h3>
          <p className="text-sm text-blue-800">
            The canonical, reviewer-oriented documentation of every parameter in the model — including type (Empirical / Calibrated / Assumption), sources, and sensitivity — is available here:
          </p>
          <a 
            href="/docs/MODEL_PARAMETERS.md" 
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            target="_blank"
          >
            Open Full Parameter Documentation →
          </a>
          <p className="mt-3 text-xs text-blue-700">
            This document is being developed at Super High Effort level as part of the academic roadmap.
          </p>
        </div>

        <h2 className="mt-12">Validation Agenda</h2>
        <p>
          A major objective for 2026 is to move as many parameters as possible from 
          "modeling assumption" to "empirically grounded".
        </p>
        <p>
          See the <Link href="/PHD_ROADMAP" className="text-blue-600 underline">PhD Research Roadmap</Link> 
          for the detailed empirical validation strategy.
        </p>
      </div>

      <div className="mt-12 border-t pt-8 text-sm text-gray-500">
        Last major update: May 2026 • This page is part of the academic transparency initiative for ProcuraCost.
      </div>
    </div>
  );
}
