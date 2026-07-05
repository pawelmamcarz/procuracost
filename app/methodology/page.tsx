import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Methodology — ProcuraCost",
  description:
    "The seven-dimension cost model's academic methodology: formulas, empirical sources, and target journals.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <span className="inline-block rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-500">
          Academic Methodology — English
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          The Hidden Cost of Procedural Compliance
        </h1>
        <p className="mt-1 text-sm text-gray-500 italic">
          Opportunity Costs of Rigid Procurement Rules vs. Policy-Based Procurement
        </p>
      </div>

      <div className="prose prose-sm max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-base font-bold text-gray-900">Abstract</h2>
          <p>
            This paper argues that the conflation of procurement <em>policy</em> and procurement{" "}
            <em>procedure</em> imposes measurable opportunity costs on organizations. Strict procedural
            compliance—often adopted as a risk shield by procurement officers—limits negotiation
            discretion, extends timelines, and forecloses value-creating options. Drawing on empirical
            studies from public procurement economics, we construct a seven-dimensional cost model
            comparing rigid-procedure and policy-only approaches. Szucs (2024) shows that{" "}
            <em>discretion</em> — not rigidity — raises prices: granting buyers unchecked discretion
            raises prices by roughly 6 percent, so competitive tendering averts a
            favoritism premium under unchecked discretion. We further note that contractual rigidity
            is observationally associated with renegotiation risk 7.7–10.5 percentage points higher
            (Beuve et al. 2021), and that Total Cost of Ownership programs can save up to 30% over
            multiple years (an unattributed practitioner heuristic, used only as a cap). The ProcuraCost calculator operationalizes
            this model for consulting and educational use.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">
            1. Procurement Policy vs. Procurement Procedure
          </h2>
          <p>
            A <strong>procurement policy</strong> establishes the high-level principles, authorization
            thresholds, competitive requirements, and ethical standards that govern all purchasing
            activity. It answers <em>what</em> must be achieved and <em>why</em>.
          </p>
          <p className="mt-2">
            A <strong>procurement procedure</strong> specifies the step-by-step operational workflow:
            RFI, RFQ, bid evaluation matrix, award committee, contract signing. It answers{" "}
            <em>how</em>—but only one possible how.
          </p>
          <p className="mt-2">
            The pathology we identify is the elevation of procedure to the status of policy: when
            &ldquo;following the procedure&rdquo; becomes the primary success criterion rather than achieving
            value, procurement officers are effectively absolved of strategic judgment. This produces
            what we term <strong>procedural compliance theater</strong>—full documentation, zero
            optimization.
          </p>
          <blockquote className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3">
            <p className="text-sm italic text-blue-800">
              &ldquo;A tunnel has walls. A field has a horizon.&rdquo;
            </p>
            <p className="mt-1 text-xs text-blue-600">
              The <strong>Tunnel vs. Field</strong> model: a procedure locks one path (tunnel);
              a policy sets boundaries and grants freedom to navigate (field).
            </p>
          </blockquote>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">2. Seven-Dimension Cost Model</h2>

          <div className="mt-3 space-y-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">Dimension 1: Time Cost</h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>= days_rigid × buyer_count × daily_rate</code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Step durations derive from legal minima (PZP 2019 + Directive 2014/24/EU) and
                practitioner benchmarks. Rigid procedures add significant administrative time
                versus policy-guided flexible approaches.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Dimension 2: Administrative Overhead
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>= documentation_cost + audit_cost + IT_system_cost</code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Fixed administrative costs of maintaining rigid e-procurement systems,
                compliance documentation, and audit trails.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Dimension 3: Opportunity Cost
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>
                  = delay_days × daily_cost_of_inaction
                </code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Each path ties up deployment value over its own duration; the saving is the
                difference between the rigid and flexible durations multiplied by the daily cost of
                inaction. Reported honestly as a delta of two non-zero quantities — no
                zero-friction baseline.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Dimension 4: Favoritism / Selection Quality
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>
                  = contract_value × 0.06 × (1 − rigidity) × corruption_risk
                </code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <strong>Source:</strong> Szucs, F. (2024). Discretion and Favoritism in Public
                Procurement. <em>Journal of the European Economic Association</em> 22(1):117–160.
                Discretion raises prices by ~6 percent and selects less-productive
                contractors. This favoritism premium scales with discretion (1 − rigidity) and the
                contextual corruption risk, so it is borne mainly by the flexible (discretionary)
                path — competitive tendering averts it.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Dimension 5: Renegotiation Risk
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>= P(renegotiation) × renegotiation_cost</code>
                <br />
                <code>P(ρ) = 0.22 + min(0.077 × ρ × m_ctx, 0.105)  — one formula, both paths</code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <strong>Source:</strong> Beuve, J., Moszoro, M., & Spiller, P. T. (2021). Contractual
                Rigidity and Political Contestability: Revisiting Public Contract Renegotiations.{" "}
                <em>NBER Working Paper 28491</em>. One standard deviation increase in contractual
                rigidity increases renegotiation frequency by 7.7–10.5 percentage points (vs. 22%
                unconditional average; observational). The full 0→1 swing of the rigidity index is
                mapped to ~1 SD, anchored at the 7.7pp lower bound and hard-capped at 10.5pp; both
                paths use the same formula at their own rigidity, so the rigidity difference alone
                drives the delta. Public contracts are renegotiated significantly more than private
                ones.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Dimension 6: Foregone TCO Savings
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>
                  = contract_value × m_ctx × min(0.10 × Σ_y(1 / 1.05^y) × rigidity, 0.30)
                </code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <strong>Source:</strong> the &ldquo;up to ~30% over multiple years&rdquo; TCO
                savings ceiling is an unattributed practitioner heuristic from grey literature —
                no verifiable ISM or peer-reviewed source exists. It is used only as a conservative
                Grade-C cap. The annual stream is discounted to present value at 5% and
                scaled by the process rigidity; the cumulative figure is capped at the 30%
                ceiling so it can never exceed the assumed bound. Rigid procedures limit the
                flexibility required to capture TCO savings through supplier development, volume
                optimization, and lifecycle costing.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Dimension 7: Informal Bypass Risk
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>= P(bypass) × audit_exposure</code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <strong>Source:</strong> Lipsky (1980), <em>Street-Level Bureaucracy</em>; Vaughan
                (1996), <em>The Challenger Launch Decision</em>; Holmström & Milgrom (1991),
                Multitask Principal-Agent. Bypass probability rises with rigidity along a bounded
                sigmoid (capped below certainty): the more rigid the tunnel, the stronger the
                behavioural incentive to exit it informally, carrying audit and penalty exposure.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">3. Key References</h2>
          <ul className="mt-2 space-y-2 text-xs text-gray-600">
            <li>
              Szucs, F. (2024). Discretion and Favoritism in Public Procurement.{" "}
              <em>Journal of the European Economic Association</em>, 22(1), 117–160.
            </li>
            <li>
              Beuve, J., Moszoro, M., & Spiller, P. T. (2021). Contractual Rigidity and Political
              Contestability. <em>NBER Working Paper 28491</em>.
            </li>
            <li>
              World Bank (2021). Improving Public Procurement Outcomes. Policy Research Paper 9690.
            </li>
            <li>
              Chartered Institute of Procurement & Supply (CIPS). Procurement Policies & Procedures
              Explained.
            </li>
            <li>
              TCO savings ceiling (~30% over multiple years): unattributed practitioner heuristic
              (grey literature); no verifiable ISM or peer-reviewed source — used only as a model cap.
            </li>
            <li>
              Skylight Digital (2024). Agile Procurement Playbook — Case Studies. U.S. federal
              procurement transformation.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">4. Target Journals</h2>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            <li>
              <strong>Journal of Public Procurement</strong> (Emerald) — primary target
            </li>
            <li>
              <strong>International Journal of Procurement Management</strong>
            </li>
            <li>
              <strong>Management Science</strong> (INFORMS) — for the cost model formalization
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
