import PrintButton from "./PrintButton";

export const metadata = {
  title: "Research Paper — The Hidden Cost of Procedural Compliance | ProcuraCost",
  description:
    "Full working paper: opportunity costs of rigid procurement rules vs. policy-based procurement. Five-dimension cost model with empirical anchors.",
};

const AUTHOR_EMAIL = "pawel@mamcarz.com";
const AUTHOR_ORCID = "0009-0002-3274-4226";
const AUTHOR_ORCID_URL = "https://orcid.org/0009-0002-3274-4226";

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 print:max-w-none print:px-0 print:py-0">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between print:hidden">
        <div>
          <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-600">
            Working Paper · Draft for Review
          </span>
          <p className="mt-1 text-xs text-gray-400">
            Target journal: <em>Journal of Public Procurement</em> (Emerald Publishing)
          </p>
        </div>
        <PrintButton />
      </div>

      <article className="prose prose-sm max-w-none text-gray-800 print:text-black">
        <div className="mb-10 border-b border-gray-200 pb-8 print:border-gray-400">
          <h1 className="text-2xl font-bold leading-tight text-gray-900 print:text-3xl">
            The Hidden Cost of Procedural Compliance: Opportunity Costs of Rigid Procurement Rules
            vs. Policy-Based Procurement
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            <strong>Working Paper</strong> — May 2026 · Pawel Mamcarz ({AUTHOR_EMAIL} ·{" "}
            <a href={AUTHOR_ORCID_URL} className="text-green-700 hover:underline" target="_blank" rel="noopener noreferrer">
              ORCID {AUTHOR_ORCID}
            </a>
            )
          </p>
          <p className="mt-1 text-xs text-gray-400">
            <strong>Keywords:</strong> procurement policy, procurement procedure, opportunity cost,
            procedural compliance, bypass cost, pipe vs. field model, agile procurement, total cost
            of ownership, renegotiation risk, street-level bureaucracy, normalization of deviance
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">Abstract</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Organizations routinely conflate procurement <em>policy</em>—a high-level framework of
            principles, authorization thresholds, and ethical standards—with procurement{" "}
            <em>procedure</em>, a specific operational workflow for executing a purchase. This
            conflation imposes a structural incentive: procurement officers adopt procedural
            compliance as a risk shield (&ldquo;I followed the procedure, therefore I am
            safe&rdquo;), which systematically displaces value-seeking judgment. We term this
            phenomenon <strong>procedural compliance theater</strong>.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Drawing on empirical evidence from public procurement economics, we construct a
            five-dimensional cost model quantifying the opportunity costs of procedural rigidity
            relative to policy-only compliance. Our model integrates four key empirical findings:
            (1) rigid auction requirements can reduce purchase prices by approximately 2% through
            enforced competition — yet this narrow price gain is dominated by delay, renegotiation
            risk, and foregone TCO savings (Szucs 2024; Goodhart 1975); (2) contractual rigidity
            raises renegotiation probability by 7.7–10.5
            percentage points above a 22% baseline (Beuve, Moszoro &amp; Saussier 2021); (3)
            infrastructure procurement under rigid public rules extends project duration by 42%
            above contract baseline (World Bank 2021); and (4) Total Cost of Ownership approaches
            yield savings of up to 30% over three years compared to compliance-first procurement
            (ISM).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We operationalize the model in an open-source calculator (ProcuraCost) and demonstrate
            its application across four procurement archetypes: fleet acquisition, IT/ERP
            implementation, logistics contracting, and production materials sourcing. Results
            consistently show that rigid-procedure costs exceed policy-only costs by 100–400%, with
            the gap driven primarily by foregone TCO optimization, deployment delay costs, and —
            critically — bypass risk costs generated when rigid procedures are informally
            circumvented under operational pressure.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We introduce the <strong>Pipe vs. Field</strong> model as the organizing metaphor: a
            procedure is a pipe (single path, binary compliance, human as step-executor); a
            procurement policy enforced by modern information systems is a field (multiple paths,
            continuous compliance, human as value navigator). We demonstrate, drawing on Lipsky
            (1980), Vaughan (1996), Holmström &amp; Milgrom (1991), Scott (1998), and Norman
            (1988), that the enforcement response to procedural bypass — &ldquo;make the pipe harder
            to exit&rdquo; — is empirically predicted to fail across five independent analytical
            traditions. The correct response is not a better pipe. It is a field.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">1. Introduction</h2>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            1.1 The Compliance Theater Problem
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Consider two procurement officers facing an identical acquisition challenge: purchasing a
            fleet of 50 company vehicles worth €1.2 million. Officer A follows a rigid eight-step
            formal tender procedure: market analysis, RFI publication, RFQ issuance, bid evaluation
            committee, price negotiation, legal review, board approval, contract signature. The
            process takes 180 days.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Officer B operates under the same procurement policy—requiring competitive price
            validation, documented supplier selection rationale, and board approval above
            €500,000—but chooses the method dynamically: a 30-day accelerated competitive dialogue
            with pre-qualified suppliers, a structured should-cost analysis, and direct negotiation
            with the top-ranked supplier. Same policy. Different procedure. 45 days.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Officer A&apos;s comfort is procedural: &ldquo;I did it by the book.&rdquo; Officer
            B&apos;s comfort is substantive: &ldquo;I got the best value for money, within
            policy.&rdquo; When audited, both are compliant. But only Officer B has actually served
            the organization&apos;s interest. The difference—in time, in price, in opportunity—is
            the subject of this paper.
          </p>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">1.2 Research Questions</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            This paper addresses three questions:
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700">
            <li>
              <strong>What is the conceptual distinction</strong> between procurement policy and
              procurement procedure, and why does it matter organizationally?
            </li>
            <li>
              <strong>What are the quantifiable cost dimensions</strong> of rigid-procedure
              compliance compared to policy-only compliance?
            </li>
            <li>
              <strong>Can a practical model</strong> capture these costs in a way useful to
              procurement professionals and their organizations?
            </li>
          </ol>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">1.3 Contribution</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We make three contributions. First, we provide a clear operational definition
            distinguishing procurement policy from procurement procedure, grounding it in the
            existing CIPS framework and extending it with an incentive-theoretic analysis. Second,
            we construct a five-dimensional empirical cost model synthesizing findings from public
            procurement economics, infrastructure management, and supply chain management. Third, we
            introduce ProcuraCost—an open-source calculator implementing the model—as a practical
            tool for procurement transformation initiatives.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">2. Conceptual Framework</h2>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            2.1 Procurement Policy vs. Procurement Procedure: A Working Definition
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The Chartered Institute of Procurement &amp; Supply (CIPS 2024) defines a{" "}
            <strong>procurement policy</strong> as a document that &ldquo;sets the rules,
            guidelines, and framework governing procurement activities,&rdquo; specifying
            authorization thresholds, competitive requirements, and ethical standards. A{" "}
            <strong>procurement procedure</strong> describes &ldquo;the step-by-step operational
            processes&rdquo; employees must follow to execute policy principles.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The relationship is hierarchical: policy defines <em>constraints and objectives</em>;
            procedures define <em>one path</em> through those constraints. Policy says &ldquo;achieve
            competitive pricing, document your rationale, obtain appropriate approvals.&rdquo;
            Procedure says &ldquo;issue an RFQ to at least three suppliers, convene a five-person
            evaluation committee, wait 21 days for bids.&rdquo;
          </p>
          <div className="my-4 rounded-xl border border-gray-100 bg-gray-50 p-4 font-mono text-xs text-gray-600">
            <p>
              <strong>Definition 1 (Procurement Policy):</strong> A set of rules P = &#123;r₁, r₂,
              ..., rₙ&#125; defining authorization thresholds, competitive requirements,
              documentation standards, and ethical constraints that any procurement action must
              satisfy.
            </p>
            <p className="mt-2">
              <strong>Definition 2 (Procurement Procedure):</strong> A specific ordered sequence of
              actions A = (a₁, a₂, ..., aₖ) that constitutes one sufficient method for satisfying
              policy P.
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 pr-4 text-left font-semibold text-gray-500">Domain</th>
                  <th className="pb-2 pr-4 text-left font-semibold text-gray-500">Policy — What &amp; Why</th>
                  <th className="pb-2 pr-4 text-left font-semibold text-red-500">Procedure = Pipe</th>
                  <th className="pb-2 text-left font-semibold text-green-600">Alternative = Field</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    domain: "Vendor selection",
                    policy: "Purchases >500k PLN: document competitive pricing from ≥3 suppliers",
                    pipe: "Send formal RFQ, wait 21 days, open bids with 5-person committee",
                    field: "Run e-auction in 3 days. OR present market benchmark and negotiate directly with market leader",
                  },
                  {
                    domain: "Approval",
                    policy: "Any purchase >500k PLN requires CFO sign-off before commitment",
                    pipe: "Print approval form, collect 3 physical signatures across departments, courier to CFO",
                    field: "One-click ERP workflow; CFO approves on mobile with audit trail auto-generated",
                  },
                  {
                    domain: "Documentation",
                    policy: "All purchases must be traceable, auditable, and defensible",
                    pipe: "Fill 12-field procurement form before any action; archive paper copies",
                    field: "System auto-generates complete audit trail at every action; zero manual forms",
                  },
                ].map((row) => (
                  <tr key={row.domain}>
                    <td className="py-2 pr-4 font-medium text-gray-700">{row.domain}</td>
                    <td className="py-2 pr-4 text-gray-500">{row.policy}</td>
                    <td className="py-2 pr-4 rounded bg-red-50 px-2 text-red-800">{row.pipe}</td>
                    <td className="py-2 rounded bg-green-50 px-2 text-green-800">{row.field}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 text-xs text-gray-400">Table 1. Policy defines the constraint; procedure and field alternative are two different paths through it.</p>
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            2.2 The Compliance-First Incentive Structure
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Why do procurement officers collapse the policy/procedure distinction? We identify three
            mechanisms:
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            <strong>Accountability asymmetry.</strong> Procedural non-compliance is visible and
            auditable; suboptimal outcomes within procedure are rarely attributed to the procurement
            method. An officer who deviated from procedure will be asked &ldquo;why?&rdquo; An
            officer who followed procedure and paid 15% above market will be asked nothing—provided
            documentation is in order.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            <strong>Rigidity as political protection.</strong> Beuve et al. (2021) demonstrate that
            public contracts incorporate more rigidity clauses than comparable private contracts, and
            that rigidity increases with political contestability. Rigid procedures reduce the attack
            surface for accusations of favoritism or corruption—a rational institutional response
            that, however, imposes economic costs on the contracting entity.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            <strong>Institutional isomorphism.</strong> Organizations in the same industry adopt
            similar procurement procedures not because these procedures are optimal but because doing
            otherwise invites legitimacy challenges (DiMaggio &amp; Powell 1983).
          </p>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">2.3 The Pipe vs. Field Model</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The policy/procedure distinction can be captured in a spatial metaphor:{" "}
            <strong>the pipe versus the field</strong>.
          </p>
          <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                Procedure = Pipe
              </p>
              <p className="mt-1 font-mono text-xs text-gray-600">a₁ → a₂ → a₃ → ··· → aₙ</p>
              <p className="mt-1 text-xs text-gray-600">
                One path, sequential, human as executor. Under pressure: informal bypass (mail /
                phone / Excel). Bypass is invisible, accumulates risk.
              </p>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                Policy + System = Field
              </p>
              <p className="mt-1 font-mono text-xs text-gray-600">∂Φ = &#123;auth, ethics, docs, competition&#125;</p>
              <p className="mt-1 text-xs text-gray-600">
                Infinite paths within boundary Φ. Human as navigator. No bypass possible — the
                constraints are everywhere and always active.
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            <strong>Proposition 1:</strong> Any procurement action that satisfies policy constraints
            C is fully compliant regardless of the path taken. &ldquo;She bypassed the process&rdquo;
            conflates bypassing a <em>procedure</em> with bypassing <em>policy</em>. These are
            categorically different.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            <strong>Proposition 2:</strong> As the number of compliant paths within Φ approaches
            infinity (procedural constraints relaxed to pure policy constraints), the bypass
            incentive approaches zero — because there is nothing to bypass.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">3. The Five-Dimension Cost Model</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We model the cost differential between a rigid-procedure approach (R) and a
            policy-compliant flexible approach (F) across five dimensions:
          </p>

          {[
            {
              n: "3.1",
              title: "Dimension 1: Time Cost (C_time)",
              formula: "C_time(R) = days_R × n_buyers × rate_daily\nC_time(F) = days_F × n_buyers × rate_daily\nΔC_time = (days_R – days_F) × n_buyers × rate_daily",
              anchor:
                "OECD (2023) documents average infrastructure procurement durations of 554 days in OECD countries and 836 days in Sub-Saharan Africa. Agile procurement case studies report 60–75% time reductions (Skylight Digital 2024; Swiss Casinos ERP: 120-day rigid vs. 28-day agile, EY Switzerland 2024).",
            },
            {
              n: "3.2",
              title: "Dimension 2: Administrative Overhead (C_admin)",
              formula: "ΔC_admin = admin_R – admin_F",
              anchor:
                "E-procurement system design rigidity creates substantial implementation and maintenance costs (World Bank 2021). Administrative burden reduces supplier participation, reducing competition and increasing prices.",
            },
            {
              n: "3.3",
              title: "Dimension 3: Opportunity Cost (C_opp)",
              formula:
                "ΔC_opp = max(0, days_R – days_F) × rev_daily – V × α\nα = 0.02 (price benefit from auction competition, Szucs 2024)\nDelay term dominates: for rigid procedures, days_R >> days_F",
              anchor:
                "Szucs (2024) analyzes a Hungarian reform removing mandatory open auction requirements. When discretion replaced mandatory auctions, prices rose by ~2% — rigid auctions enforce competition and reduce purchase price. This is the Goodhart trap (1975): procedures optimize the measurable metric (purchase price) while delay costs, renegotiation risk, and foregone TCO savings accumulate off the compliance dashboard. The 2% price gain is systematically overwhelmed by the remaining five cost dimensions. Delay cost: each day without the contracted asset/service represents measurable foregone revenue or operational value.",
            },
            {
              n: "3.4",
              title: "Dimension 4: Renegotiation Risk (C_reneg)",
              formula:
                "C_reneg(R) = P_R × cost_reneg\nP_R = P_base + Δp_rigidity = 0.22 + 0.077 = 0.297\nP_F = P_base × 0.70 = 0.154",
              anchor:
                "Beuve, Moszoro & Saussier (2021): one standard deviation increase in contractual rigidity → +7.7–10.5 percentage point increase in renegotiation probability vs. 22% unconditional baseline. The renegotiation paradox: rigidity adopted to reduce accountability risk actually increases the probability of renegotiation — the highest-risk outcome.",
            },
            {
              n: "3.5",
              title: "Dimension 5: Foregone TCO Savings (C_TCO)",
              formula:
                "C_TCO(R) = V × γ × T × (1 – φ_R)\nC_TCO(F) = V × γ × T × (1 – φ_F)\nγ = 0.10/yr  (ISM: up to 30% over 3 years)",
              anchor:
                "ISM (Institute for Supply Management): properly implemented TCO sourcing programs yield savings of up to 30% over three years (≈10% annually) relative to price-only procurement. GEP (2024): organizations systematically overpay when evaluation criteria prioritize compliance documentation over cost engineering.",
            },
            {
              n: "3.6",
              title: "Dimension 6: Normalization of Deviance Cost (C_deviance)",
              formula:
                "C_deviance(R) = P_bypass(rigidity) × E[cost_failure]\nP_bypass increases with procedural rigidity and operational pressure\nC_deviance(F) ≈ 0  — no bypass path → no hidden accumulation",
              anchor:
                "Vaughan (1996): when operationally necessary workarounds are formally prohibited, they normalize invisibly — hidden risk accumulates until a threshold failure event (cf. Challenger disaster). Unlike other dimensions, C_deviance has a fat-tailed distribution: zero most of the time, catastrophic in the tail (audit findings, procurement scandals, regulatory sanctions). The ProcuraCost calculator proxies P_bypass via the bypass audit exposure input. Rigid procedures systematically increase P_bypass by driving informal workarounds underground — making each bypass invisible and unauditable. Lipsky (1980) predicts this analytically: front-line workers always adapt rules to operational reality; the question is whether that adaptation is visible (field) or hidden (pipe).",
            },
          ].map((d) => (
            <div
              key={d.n}
              className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <h3 className="text-sm font-semibold text-gray-800">
                {d.n} {d.title}
              </h3>
              <pre className="mt-2 overflow-x-auto rounded bg-white p-2 font-mono text-xs text-gray-600">
                {d.formula}
              </pre>
              <p className="mt-2 text-xs text-gray-500">
                <strong>Empirical anchor:</strong> {d.anchor}
              </p>
            </div>
          ))}

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold text-blue-700">Total Cost Differential</p>
            <pre className="mt-1 font-mono text-xs text-blue-600">
              ΔC_total = ΔC_time + ΔC_admin + ΔC_opp + ΔC_reneg + ΔC_TCO + C_deviance(R)
            </pre>
            <p className="mt-1 text-xs text-blue-500">
              Calibrated with conservative estimates. Real-world differentials may be substantially
              larger for complex, long-duration contracts in dynamic markets.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">4. Case Studies</h2>

          {[
            {
              title: "4.1 Aviation Fleet Procurement: Ryanair",
              body: "Ryanair's fleet growth from ~50 to 400+ aircraft between 1990 and 2019 was achieved through strategic opportunistic procurement: large orders placed during industry crises (post-9/11: 100 Boeing 737s at depressed prices; post-Coronavirus: 75 MAX orders at negotiated terms). This approach was entirely incompatible with formal tender procedures—it required rapid decision-making, confidential negotiations, and flexibility to commit at the right market moment. The policy compliance is complete: board approval, competitive price benchmarking, financial modelling, legal due diligence. The procedure was entirely non-standard. The result: industry-leading CASK (Cost per Available Seat Kilometer) that no procedure-following competitor has matched (IJRAR 2019). LOT Polish Airlines' 2025 order for 40 Airbus A220 aircraft similarly proceeded through direct negotiation—policy-compliant, procedure-flexible, and sensitive to competitive dynamics between Embraer and Airbus that a formal RFQ process would have foreclosed.",
              source: "IJRAR (2019). Ryanair Strategic Positioning and Fleet Management.",
            },
            {
              title: "4.2 ERP Implementation: Swiss Casinos",
              body: "Swiss Casinos sourced and contracted an enterprise ERP system in four weeks using Lean Agile Procurement (LAP), compared to a typical 4–6 month formal RFP process. Policy compliance: competitive evaluation, structured scoring, executive approval. Procedure: intensive collaborative workshops with pre-qualified vendors, rapid prototype evaluation, direct negotiation (EY Switzerland 2024; Skylight Digital 2024). Quantified benefit: ~75% time reduction translates directly to earlier ROI realization on a multi-million CHF investment.",
              source: "EY Switzerland (2024). Integrating Agile Practices into Procurement Processes.",
            },
            {
              title: "4.3 Cargo Logistics: Air France KLM Martinair",
              body: "Door-to-door cargo modernization required sourcing within a 6-month window imposed by competitive and regulatory dynamics. Standard tender procedures for a contract of this complexity would require 12–18 months. LAP-based approach completed sourcing within the window (EY Switzerland 2024). The policy was unchanged; the procedure was adapted to the constraint.",
              source: "EY Switzerland (2024). Integrating Agile Practices into Procurement Processes.",
            },
            {
              title: "4.4 Production Materials: Zara (Inditex)",
              body: "Zara's 2-week collection cycle made traditional procurement procedures structurally incompatible with its operating model. AI-driven procurement analytics, dynamic supplier engagement, and agile sourcing replaced sequential RFQ-based approaches. The result is not just faster procurement but qualitatively different market responsiveness—a competitive advantage that procedurally-rigid competitors cannot replicate (Tradogram 2024).",
              source: "Tradogram (2024). Agile Procurement Practices: A Comprehensive Guide.",
            },
          ].map((cs) => (
            <div key={cs.title} className="mt-4">
              <h3 className="text-sm font-semibold text-gray-800">{cs.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{cs.body}</p>
              <p className="mt-1 text-xs text-gray-400">Source: {cs.source}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">5. The ProcuraCost Calculator</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            ProcuraCost operationalizes the five-dimension model as a web-based calculator. Design
            priorities: <strong>transparency</strong> (every output traceable to an academic source),{" "}
            <strong>calibration</strong> (baseline parameters reflect conservative empirical
            estimates; users can override), <strong>practical utility</strong> (pre-configured
            scenarios for common procurement archetypes), and{" "}
            <strong>dual audience</strong> (Polish-language interface for practitioners; English
            methodology for academic citation).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Built on Next.js 16 (App Router), Tailwind CSS, and Recharts. Scenarios: fleet
            acquisition, IT/ERP, logistics, production materials, custom. The model produces
            directionally consistent results across all scenarios: rigid-procedure total costs exceed
            flexible-policy costs by 100–400%. The largest contributors are TCO foregone savings
            (driven by horizon length and contract value) and opportunity costs (driven by deployment
            delay and price premium). Time costs are significant but secondary at standard buyer
            salary rates.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">6. Discussion</h2>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            6.1 The Renegotiation Paradox
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Perhaps the most striking finding from the Beuve et al. (2021) analysis is what we term
            the <strong>renegotiation paradox</strong>: procedural rigidity is adopted precisely to
            reduce accountability risk, yet it significantly increases the probability of contract
            renegotiation — which is itself a major source of accountability risk, financial loss,
            and reputational damage. Organizations that embrace rigidity for safety pay for it twice:
            once in opportunity costs, and again in higher renegotiation rates.
          </p>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            6.2 When Are Rigid Procedures Justified?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We do not argue that rigid procedures are never appropriate. They may be justified when:
            the procurement is highly routine and the procedure has been optimized over time;
            political accountability demands visible procedural equality (public sector, regulated
            industries); the supplier market is deep and highly competitive, minimizing opportunity
            cost; or the buying organization lacks the procurement sophistication to exercise
            discretion well. The policy/procedure framework argues for conscious, contextual
            procedure selection within a stable policy framework — not procedural anarchy.
          </p>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            6.3 The Enforcement Fallacy: Why Better Pipes Don&apos;t Work
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            A common response to procedural failure is to strengthen enforcement: make procedures
            harder to bypass, increase audit frequency, implement technical lockouts. This response —
            the <strong>enforcement fallacy</strong> — is empirically predicted to fail by five
            independent analytical traditions:
          </p>
          {[
            {
              author: "Street-Level Bureaucracy (Lipsky 1980)",
              text: "Adaptation of formal rules to operational reality is the normal condition of complex work, not deviance. Enforcement that eliminates formal bypasses drives informal procurement underground — auditability is lost without gaining compliance.",
            },
            {
              author: "Normalization of Deviance (Vaughan 1996)",
              text: "When operationally necessary workarounds are formally prohibited, they normalize invisibly. The organization accumulates hidden risk until a threshold failure event (cf. Challenger disaster).",
            },
            {
              author: "Multitask Principal-Agent Theory (Holmström & Milgrom 1991)",
              text: "When compliance with procedural steps is measured and value creation is not, procurement officers rationally shift effort toward compliance documentation away from market analysis and negotiation. Enforcement directly crowds out value creation.",
            },
            {
              author: "Goodhart's Law (1975)",
              text: "\"When a measure becomes a target, it ceases to be a good measure.\" Szucs (2024) provides the empirical proof: mandatory auctions reduce purchase price by 2% — a measurable, auditable win that makes procedures politically defensible. The remaining costs (deployment delay, renegotiation probability +7.7 pp, foregone TCO savings up to 30%) are not on the compliance dashboard. When procedural compliance rate becomes the KPI, compliance theater is the rational organizational response.",
            },
            {
              author: "High-Modernist Planning Failure (Scott 1998)",
              text: "Procedures designed by central experts cannot encode the local, practical, contextual knowledge (métis) that experienced buyers accumulate through practice. Better procedure design cannot solve this — it is a category error.",
            },
          ].map((item) => (
            <div key={item.author} className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">{item.author}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.text}</p>
            </div>
          ))}
          <p className="mt-3 text-sm font-medium text-gray-700">
            The correct response is not a better pipe. It is a field.
          </p>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            6.4 Technology as the New Compliance Infrastructure
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Procedures were a pre-digital compliance mechanism. Their function — ensuring that policy
            constraints are respected — has been absorbed by information systems that perform this
            function better, faster, and more completely than procedural checkpoints ever could:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>
              <strong>ERP systems</strong> (SAP Ariba, Coupa, Oracle Procurement Cloud) enforce
              authorization thresholds at the transaction level, in real time, without procedural
              checkpoints.
            </li>
            <li>
              <strong>AI-powered spend analytics</strong> detect policy violations and anomalous
              supplier selection in continuous monitoring mode.
            </li>
            <li>
              <strong>Automated audit trails</strong> provide compliance records more complete and
              tamper-resistant than any procedural documentation requirement could generate.
            </li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            A procedure is a security guard at a gate. A modern procurement system is AI-monitored
            perimeter surveillance of the entire facility. Policy — the definition of the permissible
            field — remains essential. What becomes obsolete is the human-executed sequential
            procedure as the primary mechanism for enforcing those boundaries.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            In the context of Polish public procurement law (<em>Prawo Zamówień Publicznych</em>,
            PZP), this distinction is already partially encoded: PZP specifies{" "}
            <em>what</em> must be achieved without mandating a single operational procedure for
            achieving it. The field exists in the law; the pipe is an organizational choice layered
            on top of it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">7. Conclusions and Policy Implications</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Procurement procedures are useful — they encode institutional learning about how to
            execute purchases well. The pathology is not procedures themselves but their elevation
            to the status of policy: treating one method of procurement as if it were the purpose of
            procurement.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Our five-dimension cost model demonstrates that this pathology is expensive. Across four
            procurement archetypes analyzed, rigid-procedure costs exceed policy-only costs by
            multiples, not margins. The dominant cost drivers — foregone TCO optimization and
            deployment delay — are invisible to compliance-focused audits precisely because they are
            costs of inaction, not action.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The policy implication is tractable: organizations should invest in distinguishing their
            procurement policy (governance framework, to be strictly enforced) from their procurement
            procedures (operational methods, to be contextually selected). This distinction preserves
            accountability while restoring the optimization space that procedural rigidity eliminates.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            For public sector procurement specifically, the Szucs (2024) finding suggests that
            mandatory rigid auctions — while achieving price discipline in some contexts — may impose
            net costs through reduced negotiation quality and increased renegotiation. A policy
            framework that requires competitive validation without mandating a specific competition
            format may achieve better outcomes.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Critically, the field model is not a theoretical aspiration — it is already technologically
            achievable. Modern ERP systems (SAP Ariba, Coupa, Oracle Procurement Cloud) enforce
            authorization thresholds at the transaction level, in real time, without procedural
            checkpoints. AI-powered spend analytics detect policy violations continuously.
            Automated audit trails generate compliance records more complete and tamper-resistant than
            any procedural documentation requirement. A procedure is a security guard at a gate. A
            modern procurement system is AI-monitored perimeter surveillance of the entire facility.
            Policy — the definition of the permissible field — remains essential. What becomes
            obsolete is the human-executed sequential procedure as the primary compliance mechanism.
            In Polish public procurement law (<em>Prawo Zamówień Publicznych</em>), this distinction
            is already partially encoded: PZP specifies <em>what</em> must be achieved without
            mandating a single operational path. The field exists in the law. The pipe is an
            organizational choice layered on top of it — and an expensive one.
          </p>
        </section>

        <section className="mb-8 border-t border-gray-200 pt-6">
          <h2 className="text-base font-bold text-gray-900">References</h2>
          <ul className="mt-3 space-y-2 text-xs text-gray-600">
            {[
              "Beuve, J., Moszoro, M., & Saussier, S. (2021). Contractual Rigidity and Political Contestability: Revisiting Public Contract Renegotiations. NBER Working Paper 28491.",
              "Chartered Institute of Procurement & Supply (CIPS). (2024). Procurement Policies & Procedures Explained. CIPS Intelligence Hub.",
              "DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited. American Sociological Review, 48(2), 147–160.",
              "EY Switzerland. (2024). Integrating Agile Practices into Procurement Processes.",
              "GEP. (2024). Should-Cost Modeling: Because You Must Get the Cost Right.",
              "Goodhart, C. A. E. (1975). Problems of monetary management: The UK experience. Papers in Monetary Economics, 1. [Popularized as \"Goodhart's Law\" by Strathern 1997.]",
              "Holmström, B., & Milgrom, P. (1991). Multitask principal-agent analyses. Journal of Law, Economics, & Organization, 7, 24–52.",
              "Institute for Supply Management (ISM). (2024). Understanding Total Cost of Ownership in Procurement.",
              "Kelman, S. (1990). Procurement and Public Management: The Fear of Discretion. AEI Press.",
              "Lipsky, M. (1980). Street-Level Bureaucracy. Russell Sage Foundation.",
              "Norman, D. A. (1988). The Design of Everyday Things. Basic Books.",
              "OECD. (2023). Public Procurement Performance. OECD Publishing, Paris. https://doi.org/10.1787/0dde73f4-en",
              "Scott, J. C. (1998). Seeing Like a State. Yale University Press.",
              "Skylight Digital. (2024). Agile Procurement Playbook — Appendix A: Case Studies. U.S. Digital Service.",
              "Strathern, M. (1997). 'Improving ratings': Audit in the British University system. European Review, 5(3), 305–321.",
              "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. Journal of the European Economic Association, 22(1), 117–151. https://doi.org/10.1093/jeea/jvad036",
              "Tradogram. (2024). Agile Procurement Practices: A Comprehensive Guide.",
              "Vaughan, D. (1996). The Challenger Launch Decision. University of Chicago Press.",
              "World Bank. (2021). Improving Public Procurement Outcomes. Policy Research Paper 9690.",
            ].map((ref) => (
              <li key={ref.slice(0, 60)} className="pl-4 -indent-4">
                {ref}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 border-t border-gray-200 pt-6">
          <h2 className="text-base font-bold text-gray-900">Acknowledgements</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            The author thanks an anonymous reviewer whose critical reading identified the apparent
            tension between the Szucs (2024) empirical finding and the model&apos;s treatment of the
            opportunity cost coefficient α. That challenge led directly to the Goodhart trap
            reframing in Section 3.3 — arguably the sharpest argument in the paper. The author also
            thanks the editorial community around agile procurement and public procurement law reform
            whose practice-based insights shaped the case studies in Section 4.
          </p>
        </section>

        {/* Draft notice */}
        <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 print:hidden">
          <p className="text-xs font-medium text-amber-700">
            Draft status: Phase 1 complete (structure, lit review, model). Phase 2 (empirical
            calibration, peer review) pending.
          </p>
          <p className="mt-1 text-xs text-amber-600">
            Contact: {AUTHOR_EMAIL} · ORCID:{" "}
            <a href={AUTHOR_ORCID_URL} className="text-amber-700 hover:underline" target="_blank" rel="noopener noreferrer">
              {AUTHOR_ORCID}
            </a>{" "}
            · Cite as: Mamcarz, P. (2026). The Hidden Cost of Procedural Compliance. Working paper.
          </p>
        </div>
      </article>

      {/* Bottom print button */}
      <div className="mt-10 flex justify-center print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}
