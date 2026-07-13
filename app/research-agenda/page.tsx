export const metadata = {
  title: "Research Agenda — ProcuraCost",
  description:
    "The ProcuraCost research program: a two-paper agenda for measuring the opportunity costs of rigid procurement procedures, with an open validation program and collaboration invitation.",
};

const CONTACT_EMAIL = "pawel@mamcarz.com";

export default function ResearchAgendaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-600">
        Research Agenda · July 2026
      </span>
      <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-900">
        Measuring the Opportunity Cost of Procedural Rigidity in Procurement
      </h1>
      <p className="mt-3 text-sm text-gray-700 leading-relaxed">
        ProcuraCost is an open research program built around one question: what does it cost an
        organization when procurement <em>policy</em> (binding constraints) is operationalized as a
        single rigid <em>procedure</em> (one locked path), rather than as a bounded space of
        compliant paths? The program treats this as a measurement problem first — the primary
        contribution is an auditable candidate measurement instrument, not a settled empirical
        claim.
      </p>

      <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Core thesis (to be tested, not assumed)
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          In high-value, high-corruption-risk, strategic contexts, rigid procurement procedures may
          impose materially higher opportunity costs than policy-bounded flexible approaches
          operating under the same formal constraints. The model is symmetric: flexibility carries
          its own favoritism and selection-quality costs, so the sign and size of the gap are
          empirical questions with explicit boundary conditions — not foregone conclusions.
        </p>
        <p className="font-mono text-xs text-gray-400">
          ∂Φ = {"{auth, competition, ethics, docs}"}
        </p>
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-gray-500">
        The two-paper program
      </h2>

      <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
            Paper 1 — Conceptual &amp; methodological
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Formalizes the policy/procedure distinction as a transparent cost model (seven
            dimensions, Direct/Indirect × Upstream/Downstream differentiation) and presents it as a
            candidate measurement instrument. Simulations demonstrate model mechanics and
            sensitivity only — outputs are model estimates under documented assumptions, never
            presented as estimated real-world effects.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Status: working draft under evidence audit; working-paper posting planned for
            August 2026. Full text at{" "}
            <a href="/research" className="text-blue-700 hover:underline">
              /research
            </a>
            .
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
            Paper 2 — Confirmatory empirical study
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            A preregistration-grade design specified before any data collection:
            within-organization matched pairs of real procurement events, a continuous observed
            rigidity index coded from contemporaneous artifacts by outcome-blind coders, observed
            procurement cycle time as the sole confirmatory outcome, and a frozen statistical
            analysis plan.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Status: design complete (codebooks, matching protocol, analysis plan, preregistration
            manifest); execution requires an academic home and funding — see the invitation below.
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Validation program
      </h2>
      <div className="mt-3 space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong>Pilot phase (2026):</strong> 2–4 organizations, instrument development and
          feasibility only. Pilots test whether the constructs can be coded reliably from real
          archival records — above all, whether an exact auditable timestamp exists for the start
          of the procurement cycle. Pilot organizations are permanently excluded from the
          confirmatory sample, and no effect estimates are reported from pilot data.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong>Confirmatory phase (funded study):</strong> new organizations, complete archival
          event universes from frozen windows, outcome-blind double coding with adjudication,
          balance-constrained matching, and a single preregistered primary test. Everything else is
          explicitly exploratory.
        </p>
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Open research infrastructure
      </h2>
      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        <li>
          <a href="/model/assumptions" className="text-blue-700 hover:underline">
            Assumptions Explorer
          </a>{" "}
          — every parameter visible and modifiable, with sources and evidence status.
        </li>
        <li>
          Researcher exports (JSON / CSV / Markdown) — full inputs, effective multipliers, and
          per-dimension results for any scenario, versioned against the model.
        </li>
        <li>
          Open replication package — code, parameter register, and regenerable scenario tables
          (GitHub: <span className="font-mono text-xs">pawelmamcarz/procuracost</span>).
        </li>
        <li>
          Pilot instruments — case-study protocol, interview protocol, rigidity codebook, and
          statistical analysis plan, all public in the repository.
        </li>
      </ul>

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">
        <p className="text-lg font-semibold">Collaboration invitation</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-blue-100 leading-relaxed">
          The program is looking for academic partners (supervision or co-authorship on the
          empirical program) and for organizations willing to host a confidential pilot (2–4 hours
          of effort, anonymized, instrument-development only).
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=ProcuraCost%20research%20collaboration`}
          className="mt-5 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}
