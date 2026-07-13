import PrintButton from "./PrintButton";
import Link from "next/link";

export const metadata = {
  title: "Research Paper — The Hidden Cost of Procedural Compliance | ProcuraCost",
  description:
    "Methodological working draft: a transparent simulation model of rigid procurement rules vs. policy-based procurement, with explicit assumptions and a reproducible calculation trace.",
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
            <strong>Working Paper — v1.0</strong> — June 2026 · Pawel Mamcarz ({AUTHOR_EMAIL} ·{" "}
            <a href={AUTHOR_ORCID_URL} className="text-green-700 hover:underline" target="_blank" rel="noopener noreferrer">
              ORCID {AUTHOR_ORCID}
            </a>
            )
          </p>
          <p className="mt-1 text-xs text-gray-400">
            <strong>Keywords:</strong> procurement policy, procurement procedure, opportunity cost,
            procedural compliance, bypass cost, tunnel vs. field model, agile procurement, total cost
            of ownership, renegotiation risk, street-level bureaucracy, normalization of deviance
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">Abstract</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Organizations may conflate procurement <em>policy</em>—a high-level framework of
            principles, authorization thresholds, and ethical standards—with procurement{" "}
            <em>procedure</em>, a specific operational workflow for executing a purchase. This
            conflation imposes a structural incentive: procurement officers adopt procedural
            compliance as a risk shield (&ldquo;I followed the procedure, therefore I am
            safe&rdquo;), potentially displacing value-seeking judgment. We call this proposed
            mechanism <strong>procedural compliance theater</strong>; its prevalence and effect size
            remain to be tested.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We construct a transparent deterministic simulation model with explicit 2×2 contextual
            differentiation. Beuve, Moszoro &amp; Saussier (2021) provide an empirical anchor for
            rigidity and renegotiation. Szucs (2024) provides a countervailing boundary condition:
            high discretion can increase prices and select less productive suppliers. TCO, bypass,
            technology, process-step, and 2×2 effects remain assumptions requiring calibration.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            ProcuraCost demonstrates the model across illustrative archetypes. Its outputs are
            model-implied scenario results, not causal estimates or organization-level savings.
            The wide result dispersion is evidence of sensitivity and the need for empirical
            validation, not confirmation of the thesis.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We introduce the <strong>Tunnel vs. Field</strong> model as the organizing metaphor: a
            procedure is a tunnel (single path, binary compliance, human as step-executor); a
            procurement policy supported by modern information systems is a field (multiple paths,
            continuous compliance, human as value navigator). Lipsky (1980), Vaughan (1996),
            Holmström &amp; Milgrom (1991), Scott (1998), and Norman (1988) motivate testable
            hypotheses about the unintended effects of enforcement-only responses. They do not
            establish that procedural enforcement generally fails.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">1. Introduction</h2>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            1.1 The Compliance Theater Problem
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Consider a hypothetical acquisition of 50 company vehicles worth €1.2 million. In one
            modeled path, an officer follows a rigid eight-step
            formal tender procedure: market analysis, RFI publication, RFQ issuance, bid evaluation
            committee, price negotiation, legal review, board approval, contract signature. The
            illustrative input assigns the process 180 days.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            In a second modeled path, an officer operates under the same assumed policy—requiring competitive price
            validation, documented supplier selection rationale, and board approval above
            €500,000—but chooses the method dynamically: a 30-day accelerated competitive dialogue
            with pre-qualified suppliers, a structured should-cost analysis, and direct negotiation
            with the top-ranked supplier. The illustrative input assigns this path 45 days.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The example does not establish that either path is lawful, compliant, or superior in a
            real procurement. It isolates the model&apos;s question: how should time, effort,
            opportunity, renegotiation, and governance risks be compared when more than one route is
            available?
          </p>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">1.2 Research Questions</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            This paper addresses four questions:
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700">
            <li>
              <strong>What is the conceptual distinction</strong> between procurement policy and
              procurement procedure, and why does it matter organizationally?
            </li>
            <li>
              <strong>How do the 2×2 contextual dimensions</strong> (Direct/Indirect ×
              Upstream/Downstream) alter modeled cost composition?
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
            We make four contributions. First, we provide a clear operational definition
            distinguishing procurement policy from procurement procedure and extending it with an
            incentive-theoretic analysis. Second,
            we construct a transparent deterministic simulation whose empirical anchors and
            modeling assumptions are reported separately. Third, we introduce ProcuraCost—an
            open-source candidate measurement instrument with auditable calculations and a
            replication workflow. Fourth, we publish propositions, instruments, tests, and generated
            outputs that make the assumptions auditable and falsifiable. The contribution at this
            stage is conceptual, computational, and methodological; empirical validation remains
            future work.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">2. Conceptual Framework</h2>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            2.1 Procurement Policy vs. Procurement Procedure: A Working Definition
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The definitions below are analytical choices proposed by this paper. They are intended to
            be evaluated for clarity and usefulness, not treated as a universal professional or legal
            taxonomy.
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
                  <th className="pb-2 pr-4 text-left font-semibold text-red-500">Procedure = Tunnel</th>
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
            <strong>Accountability asymmetry.</strong> Procedural non-compliance is often easier to
            observe than counterfactual value lost within a compliant process. We hypothesize that
            this measurement asymmetry can favor documented step completion over harder-to-observe
            value creation.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            <strong>Rigidity as political protection.</strong> Beuve et al. (2021) demonstrate that
            public-to-private contracts incorporate more rigidity clauses than private-to-private
            contracts and connect rigidity to political contestability. Political protection is one
            plausible motive; the net effect of a specific procedural safeguard remains empirical.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            <strong>Institutional isomorphism.</strong> Organizations in the same industry adopt
            similar procurement procedures not because these procedures are optimal but because doing
            otherwise invites legitimacy challenges (DiMaggio &amp; Powell 1983).
          </p>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">2.3 The Tunnel vs. Field Model</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The policy/procedure distinction can be captured in a spatial metaphor:{" "}
            <strong>the tunnel versus the field</strong>.
          </p>
          <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                Procedure = Tunnel
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
                Multiple authorized paths within boundary Φ. Human as navigator. Bypass remains
                possible and must be observed and controlled.
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
          <h2 className="text-base font-bold text-gray-900">3. Cost Model Components</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            We model the cost differential between a rigid-procedure approach (R) and a
            policy-compliant flexible approach (F) across explicit cost components:
          </p>

          {[
            {
              n: "3.1",
              title: "Dimension 1: Time Cost (C_time)",
              formula: "C_time(R) = days_R × n_buyers × rate_daily\nC_time(F) = days_F × n_buyers × rate_daily\nΔC_time = (days_R – days_F) × n_buyers × rate_daily",
              anchor:
                "External reports motivate duration as a construct, but the step durations and role hours used by ProcuraCost are modeling assumptions awaiting calibration from organizational timestamps and time-use data.",
            },
            {
              n: "3.2",
              title: "Dimension 2: Administrative Overhead (C_admin)",
              formula: "ΔC_admin = admin_R – admin_F",
              anchor:
                "Administrative burden is a literature-grounded concern, but ProcuraCost technology-level coordination costs are modeling assumptions rather than World Bank estimates.",
            },
            {
              n: "3.3",
              title: "Dimension 3: Opportunity Cost (C_opp)",
              formula:
                "C_opp(R) = max(0, days_R – days_F) × rev_daily × delayMultiplier\nC_opp(F) = 0\nNo exogenous price premium is assigned in model v1.2",
              anchor:
                "Szucs (2024) finds adverse price and supplier-productivity effects from high discretion. Earlier ProcuraCost versions reversed this direction. The price/productivity adjustment is disabled until a governance-risk model can distinguish bounded policy flexibility from uncontrolled discretion.",
            },
            {
              n: "3.4",
              title: "Dimension 4: Renegotiation Risk (C_reneg)",
              formula:
                "C_reneg(R) = P_R × cost_reneg\nP_R = 0.22 + 0.077 × renegotiationMultiplier\nP_F = 0.22 × 0.70 = 0.154",
              anchor:
                "Beuve, Moszoro & Saussier (2021): one standard deviation increase in contractual rigidity is associated with a +7.7–10.5 percentage point increase in renegotiation probability vs. a 22% unconditional baseline. Mapping this estimate to procurement procedures is a modeling choice.",
            },
            {
              n: "3.5",
              title: "Dimension 5: Foregone TCO Savings (C_TCO)",
              formula:
                "rate = min(0.30, 0.10 × years × rigidity × tcoMultiplier)\nC_TCO = contractValue × rate",
              anchor:
                "The 10% annual rate, 30% cap, rigidity scaling, and 2×2 multiplier are explicit assumptions. A sufficiently specific primary source for the former ISM 30% claim was not identified in the evidence audit.",
            },
            {
              n: "3.6",
              title: "Dimension 6: Bypass Exposure (C_bypass)",
              formula:
                "C_bypass(R) = P_R × auditExposure\nC_bypass(F) = P_F × auditExposure\nP_F = 0.10 × P_R in model v1.2",
              anchor:
                "Vaughan (1996) and Lipsky (1980) motivate the bypass construct but do not estimate this procurement function. Sigmoid shape, threshold, flexible-path scale, and audit exposure are explicit assumptions requiring observed off-system transaction and audit data.",
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
                <strong>Evidence status:</strong> {d.anchor}
              </p>
            </div>
          ))}

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-semibold text-blue-700">Total Cost Differential</p>
            <pre className="mt-1 font-mono text-xs text-blue-600">
              ΔC_total = ΔC_time + ΔC_admin + ΔC_opp + ΔC_reneg + ΔC_TCO + ΔC_bypass
            </pre>
            <p className="mt-1 text-xs text-blue-500">
              Illustrative parameterization. Real-world differentials may be smaller, larger, or
              directionally different.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">4. Illustrative Archetypes</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            These synthetic scenarios exercise different process and 2×2 settings. Inputs are stored
            in <code>lib/scenarios.ts</code> and outputs are regenerated with{" "}
            <code>npm run replicate</code>. They are not organizational observations, benchmarks, or
            savings estimates.
          </p>

          {[
            {
              title: "4.1 Fleet Acquisition: Direct × Upstream",
              body: "A synthetic high-value, long-horizon acquisition with strategic timing and senior involvement. Model v1.2 produces rigid and flexible totals of PLN 1.51m and PLN 0.33m, a 363.5% differential. The result traces TCO, delay, and governance assumptions; it is not an estimate for an airline or fleet buyer.",
              source: "Generated from lib/scenarios.ts; model 1.2.0.",
            },
            {
              title: "4.2 ERP Acquisition: Indirect × Upstream",
              body: "A synthetic strategic indirect purchase with high implementation-delay inputs. The generated differential is 557.2%. Its purpose is to show how daily inaction cost, TCO horizon, and Upstream effort assumptions compound.",
              source: "Generated from lib/scenarios.ts; model 1.2.0.",
            },
            {
              title: "4.3 Logistics Service: Indirect × Upstream",
              body: "A synthetic strategic service contract with an assumed operational window. The generated differential is 446.1%; delay and bypass assumptions drive much of the gap.",
              source: "Generated from lib/scenarios.ts; model 1.2.0.",
            },
            {
              title: "4.4 Production Materials: Direct × Upstream",
              body: "A synthetic scenario combining Direct+Upstream multipliers with high value and delay inputs. Its 1074.7% differential is a warning about assumption leverage, not evidence of a typical effect.",
              source: "Generated from lib/scenarios.ts; model 1.2.0.",
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
            ProcuraCost operationalizes the model as a web-based calculator. Design priorities:{" "}
            <strong>transparency</strong> (every output traceable to a source or explicit assumption),{" "}
            <strong>sensitivity</strong> (selected assumptions can be explored without silently
            changing the production engine), <strong>practical utility</strong> (pre-configured
            scenarios for common procurement archetypes), and{" "}
            <strong>dual audience</strong> (Polish-language interface for practitioners; English
            methodology for academic citation).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Built on Next.js 16 (App Router), Tailwind CSS, and Recharts. Scenarios: fleet
            acquisition, IT/ERP, logistics, production materials, custom. Automated tests establish
            deterministic and internally consistent calculations. Generated scenario outputs vary
            from 18.1% to 1074.7% in model v1.2, which demonstrates high assumption sensitivity and
            cannot be interpreted as empirical validation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900">6. Discussion</h2>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            6.1 The Renegotiation Tension
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Beuve et al. (2021) identify an association between contractual rigidity and
            renegotiation. This creates a candidate tension: controls adopted partly for political or
            accountability protection may be associated with later contract adaptation. The paper
            does not identify the effects of every procurement procedure, and ProcuraCost&apos;s
            additional opportunity-cost components remain assumptions.
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
            6.3 Enforcement-Only Responses: Theoretical Risks
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            A common response to procedural failure is to strengthen enforcement: make procedures
            harder to bypass, increase audit frequency, or implement technical lockouts. These
            responses may be appropriate for misconduct or weak control, but the literatures below
            motivate hypotheses about unintended effects when a prescribed path does not fit
            operational conditions:
          </p>
          {[
            {
              author: "Street-Level Bureaucracy (Lipsky 1980)",
              text: "Frontline adaptation under task and resource constraints motivates a procurement hypothesis; it does not show that every workaround is justified.",
            },
            {
              author: "Normalization of Deviance (Vaughan 1996)",
              text: "Normalized deviations can create hidden organizational risk, although Vaughan's setting is not procurement.",
            },
            {
              author: "Multitask Principal-Agent Theory (Holmström & Milgrom 1991)",
              text: "Strong incentives on measurable tasks can draw effort away from less measurable tasks, conditional on the model's assumptions.",
            },
            {
              author: "Goodhart's Law (1975)",
              text: "Targeted metrics may lose informational value. Szucs (2024) adds the countervailing warning that discretion without effective scrutiny can raise prices and favor less productive suppliers.",
            },
            {
              author: "High-Modernist Planning Failure (Scott 1998)",
              text: "Centralized schemes can fail to represent local, practical knowledge. Whether this mechanism applies to a procurement path must be tested.",
            },
          ].map((item) => (
            <div key={item.author} className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700">{item.author}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.text}</p>
            </div>
          ))}
          <p className="mt-3 text-sm font-medium text-gray-700">
            These traditions generate competing hypotheses; they do not prove that stricter
            enforcement generally fails.
          </p>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            6.4 Technology as Potential Control Infrastructure
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Digital systems can change how controls are implemented, but capability depends on
            configuration, data quality, coverage, security, and actual organizational use:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>
              <strong>ERP systems</strong> (SAP Ariba, Coupa, Oracle Procurement Cloud) enforce
              authorization thresholds at the transaction level when workflows are configured and
              used as intended.
            </li>
            <li>
              <strong>AI-powered spend analytics</strong> detect policy violations and anomalous
              supplier selection in continuous monitoring mode.
            </li>
            <li>
              <strong>Automated audit trails</strong> can improve traceability, subject to access,
              retention, and integrity controls.
            </li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Technology is therefore a candidate control infrastructure, not proof that sequential
            procedures, competition requirements, or human review are obsolete.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            In the context of Polish public procurement law (<em>Prawo Zamówień Publicznych</em>,
            PZP), multiple statutory procedures are available subject to thresholds and specific
            legal conditions. ProcuraCost does not determine which route is lawful in a given case;
            legal eligibility requires separate review.
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
            The model translates the proposed mechanism into explicit, testable cost components. Its
            built-in archetypes produce widely dispersed differentials under illustrative inputs;
            they do not show that real rigid-procedure costs exceed policy-based costs. Foregone TCO
            opportunity and deployment delay are candidate constructs for empirical measurement.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The practical implication is a research and management agenda: distinguish policy, law,
            control, and local procedure; measure outcomes across available routes; and test whether
            contextual route selection improves performance without weakening accountability.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            For public procurement, Szucs (2024) supplies a central warning: greater discretion can
            increase prices and favor less productive, politically connected suppliers. The current
            model therefore cannot justify replacing rigid auctions with discretion. Any field-like
            design requires auditable competition, conflict-of-interest controls, and legal review.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            Digital systems may automate selected controls and improve traceability, but they do not
            automatically replace statutory procedures, competition requirements, human review, or
            professional judgment. Polish PZP provides multiple statutory procedures subject to
            thresholds and legal conditions. ProcuraCost does not determine whether a route is lawful
            in a specific case; legal eligibility requires separate review.
          </p>
        </section>

        <section className="mb-8 border-t border-gray-200 pt-6">
          <h2 className="text-base font-bold text-gray-900">Reproducibility &amp; Research Infrastructure</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The quantitative claims in this paper are generated by a deterministic, open implementation.
            The live model (including the 2026 Direct/Indirect × Upstream/Downstream differentiation)
            is available at <Link href="/calculator" className="text-blue-600 underline">/calculator</Link> and
            the dedicated <Link href="/model/assumptions" className="text-blue-600 underline">Assumptions Explorer</Link>.
            A 2-page conference-ready extended abstract is available at <code className="text-xs">docs/research/extended_abstract_v1.md</code>.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>
              <strong>Formal specification (closed forms + exact 2×2 adjustment rules)</strong>:
              <code className="text-xs">docs/research/model_specification_draft.md</code> (step-level day boosts,
              role multipliers 1.85× executive upstream etc., full <code>getDimensionMultipliers</code> logic,
              bypass sigmoid, and call graph).
            </li>
            <li>
              <strong>Parameter transparency</strong>:
              <code className="text-xs">docs/MODEL_PARAMETERS.md</code> — current provenance, assumptions, and evidence gaps.
            </li>
            <li>
              <strong>Testable propositions (v1.0)</strong>:
              <code className="text-xs">docs/research/testable_propositions_v1.md</code> — 6–8 propositions (P1–P7) with justification, operationalization in the model/survey, data sources, and expected magnitudes. Directly derived from the live 2×2 implementation.
            </li>
            <li>
              <strong>Survey ↔ Model crosswalk</strong>:
              <code className="text-xs">docs/research/survey_crosswalk.md</code> — Complete mapping of every survey question to `ProcurementInputs`, `getDimensionMultipliers`, `derive*` functions, and the propositions it supports. Essential for empirical work and replication.
            </li>
            <li>
              <strong>Interview & Pilot Protocols</strong>:
              <code className="text-xs">docs/research/interview_protocol_v1.md</code> + <code className="text-xs">docs/research/pilot_case_study_protocol.md</code> — Ready-to-use templates for the first wave of organizational pilots (45–60 min interviews + standardized case reconstruction that feeds straight into the researcher export JSON).
            </li>
            <li>
              <strong>Researcher export</strong>: In the calculator results and in the Assumptions Explorer,
              use “Export for Research (JSON)” (or “Copy Markdown table”) to capture the exact input vector, effective multipliers,
              derived days, and all cost components with metadata. See section 3.8 of the paper for the exact 3-step reproduction recipe.
              This is the primary artifact for the replication package. Sample data: <code>replication/synthetic_data/case_fleet/</code>
            </li>
            <li>
              <strong>Supervisor / Co-author Pitch</strong>:
              <code className="text-xs">docs/research/supervisor_pitch.md</code> — Ready-to-send 1–2 page filled pitch (based on the template) summarizing current state (June 2026), 2×2 model, live artifacts, and what collaboration is sought. Use with the 1-page summary for outreach.
            </li>
            <li>
              <strong>Extended Abstract (v1.0, conference-ready)</strong>:
              <code className="text-xs">docs/research/extended_abstract_v1.md</code> — 2-page distillation of the paper (problem, 2×2 model, ProcuraCost as measurement instrument, key propositions, reproducibility, implications). Ready for IPSERA/EGPA submissions.
            </li>
            <li>
              <strong>Potential Pilots Template</strong>:
              <code className="text-xs">docs/research/potential_pilots_template.md</code> — Generic structure + selection criteria + tracking table for building 6–8 target list (public + large private + mid-size). Populate with your network only.
            </li>
            <li>
              <strong>1-page project summary</strong>:
              <code className="text-xs">docs/project_summary_one_pager.md</code> — Updated with full current status and list of all artifacts (for attaching to outreach emails).
            </li>
            <li>
              Supporting instruments (survey structure, replication package spec, empirical validation plan,
              supervisor pitch template + filled pitch, pilots template, 1-page summary) live in <code>docs/research/</code> and <code>docs/</code>.
            </li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            All exports and the live explorer use the identical functions that produce the numbers in the paper
            (no separate “demo” model).
          </p>
        </section>

        <section className="mb-8 border-t border-gray-200 pt-6">
          <h2 className="text-base font-bold text-gray-900">References</h2>
          <ul className="mt-3 space-y-2 text-xs text-gray-600">
            {[
              "Beuve, J., Moszoro, M., & Saussier, S. (2021). Contractual Rigidity and Political Contestability: Revisiting Public Contract Renegotiations. NBER Working Paper 28491.",
              "DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited. American Sociological Review, 48(2), 147–160.",
              "Goodhart, C. A. E. (1975). Problems of monetary management: The UK experience. Papers in Monetary Economics, 1. [Popularized as \"Goodhart's Law\" by Strathern 1997.]",
              "Holmström, B., & Milgrom, P. (1991). Multitask principal-agent analyses. Journal of Law, Economics, & Organization, 7, 24–52.",
              "Kelman, S. (1990). Procurement and Public Management: The Fear of Discretion. AEI Press.",
              "Lipsky, M. (1980). Street-Level Bureaucracy. Russell Sage Foundation.",
              "Norman, D. A. (1988). The Design of Everyday Things. Basic Books.",
              "OECD. (2023). Public Procurement Performance. OECD Publishing, Paris. https://doi.org/10.1787/0dde73f4-en",
              "Scott, J. C. (1998). Seeing Like a State. Yale University Press.",
              "Strathern, M. (1997). 'Improving ratings': Audit in the British University system. European Review, 5(3), 305–321.",
              "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. Journal of the European Economic Association, 22(1), 117–160. https://doi.org/10.1093/jeea/jvad017",
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
            The June 2026 evidence audit identified a reversal in the earlier interpretation of
            Szucs (2024) and led to removal of the rigidity price/productivity penalties in model
            v1.2. Public practice materials motivate the illustrative archetypes in Section 4, but
            no organization-level financial data are attributed to the named organizations.
          </p>
        </section>

        {/* Draft notice */}
        <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-4 print:hidden">
          <p className="text-xs font-medium text-amber-700">
            Draft status: methodological working draft under evidence audit (June 2026). Model v1.2 corrects source interpretation, adds tests and full calculation traces, and separates illustrative archetypes from empirical evidence. External review and primary-data validation remain pending.



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
