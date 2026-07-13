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
        {/* Abstract */}
        <section>
          <h2 className="text-base font-bold text-gray-900">Abstract</h2>
          <p>
            This paper argues that the conflation of procurement <em>policy</em> and procurement{" "}
            <em>procedure</em> imposes measurable opportunity costs on organizations. Strict procedural
            compliance—often adopted as a risk shield by procurement officers—limits negotiation
            discretion, extends timelines, and can foreclose value-creating options. We construct a
            transparent simulation model comparing rigid-procedure and policy-only approaches. Beuve et
            al. (2021) anchor the renegotiation relationship; the remaining TCO, bypass, technology,
            process, and 2×2 parameters are explicit assumptions. Szucs (2024) is a boundary condition:
            high discretion can increase prices and select less productive suppliers.
          </p>
        </section>

        {/* Policy vs Procedure */}
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
            &quot;following the procedure&quot; becomes the primary success criterion rather than achieving
            value, procurement officers are effectively absolved of strategic judgment. This produces
            what we term <strong>procedural compliance theater</strong>—full documentation, zero
            optimization.
          </p>
          <blockquote className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3">
            <p className="text-sm italic text-blue-800">
              &quot;A tunnel has walls. A field has a horizon.&quot;
            </p>
            <p className="mt-1 text-xs text-blue-600">
              The <strong>Tunnel vs. Field</strong> model: a procedure locks one path (tunnel);
              a policy sets boundaries and grants freedom to navigate (field).
            </p>
          </blockquote>
        </section>

        {/* Cost Model */}
        <section>
          <h2 className="text-base font-bold text-gray-900">2. Cost Model Components</h2>

          <div className="mt-3 space-y-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">Dimension 1: Time Cost</h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>= days_rigid × buyer_count × daily_rate</code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                ProcuraCost step durations and role hours are modeling assumptions awaiting calibration
                from organizational timestamps and time-use data.
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
                  = delay_days × daily_project_value × delay_multiplier
                </code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <strong>Evidence status:</strong> The delay value is supplied by the user. Model v1.2
                removes the former 2% rigidity premium because Szucs (2024) finds adverse effects from
                high discretion, not from rigid auctions.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Dimension 4: Renegotiation Risk
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>= P(renegotiation) × renegotiation_cost</code>
                <br />
                <code>P_rigid = 0.22 + 0.077 = 0.297</code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <strong>Source:</strong> Beuve, J., Moszoro, M., & Saussier, S. (2021). Contractual
                Rigidity and Political Contestability: Revisiting Public Contract Renegotiations.{" "}
                <em>NBER Working Paper 28491</em>. One standard deviation increase in contractual
                rigidity is associated with 7.7–10.5 percentage points higher renegotiation
                probability (vs. a 22% unconditional average). ProcuraCost uses the lower bound;
                contextual and flexible-path factors are modeling assumptions.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Dimension 5: Foregone TCO Savings
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                <code>
                  = contract_value × min(0.30, 0.10 × years × rigidity × tco_multiplier)
                </code>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <strong>Evidence status:</strong> The 10% annual rate, 30% cap, rigidity scaling, and
                contextual multiplier are modeling assumptions exposed for sensitivity analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Key Sources */}
        <section>
          <h2 className="text-base font-bold text-gray-900">3. Key References</h2>
          <ul className="mt-2 space-y-2 text-xs text-gray-600">
            <li>
              Szucs, F. (2024). Discretion and Favoritism in Public Procurement.{" "}
              <em>Journal of the European Economic Association</em>, 22(1), 117–160.
            </li>
            <li>
              Beuve, J., Moszoro, M., & Saussier, S. (2021). Contractual Rigidity and Political
              Contestability. <em>NBER Working Paper 28491</em>.
            </li>
            <li>
              World Bank (2021). Improving Public Procurement Outcomes. Policy Research Paper 9690.
            </li>
            <li>
              OECD (2023). Public Procurement Performance. OECD Publishing, Paris.
            </li>
            <li>
              Chartered Institute of Procurement & Supply (CIPS). Procurement Policies & Procedures
              Explained.
            </li>
            <li>
              Institute for Supply Management (ISM). Understanding Total Cost of Ownership in
              Procurement.
            </li>
            <li>
              Skylight Digital (2024). Agile Procurement Playbook — Case Studies. U.S. federal
              procurement transformation.
            </li>
          </ul>
        </section>

        {/* Target journals */}
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
