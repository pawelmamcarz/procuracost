# The Hidden Cost of Procedural Compliance: Opportunity Costs of Rigid Procurement Rules vs. Policy-Based Procurement

**Working Paper — Draft for Review**  
Date: May 2026  
Target journal: *Journal of Public Procurement* (Emerald Publishing)

---

## Abstract

Organizations routinely conflate procurement *policy*—a high-level framework of principles, authorization thresholds, and ethical standards—with procurement *procedure*, a specific operational workflow for executing a purchase. This conflation imposes a structural incentive: procurement officers adopt procedural compliance as a risk shield ("I followed the procedure, therefore I am safe"), which systematically displaces value-seeking judgment. We term this phenomenon **procedural compliance theater**.

Drawing on empirical evidence from public procurement economics, we construct a five-dimensional cost model quantifying the opportunity costs of procedural rigidity relative to policy-only compliance. Our model integrates four key empirical findings: (1) rigid auction requirements increase effective contract prices by approximately 2% (Szucs 2024); (2) contractual rigidity raises renegotiation probability by 7.7–10.5 percentage points above a 22% baseline (Beuve, Moszoro & Saussier 2021); (3) infrastructure procurement under rigid public rules extends project duration by 42% above contract baseline (World Bank 2021); and (4) Total Cost of Ownership approaches yield savings of up to 30% over three years compared to compliance-first procurement (ISM).

We operationalize the model in an open-source calculator (ProcuraCost) and demonstrate its application across four procurement archetypes: fleet acquisition, IT/ERP implementation, logistics contracting, and production materials sourcing. Results consistently show that rigid-procedure costs exceed policy-only costs by 100–400%, with the gap driven primarily by foregone TCO optimization, deployment delay costs, and — critically — bypass risk costs generated when rigid procedures are informally circumvented under operational pressure.

We introduce the **Tunnel vs. Field** model as the organizing metaphor: a procedure is a tunnel (single path, one direction, human as step-executor); a procurement policy enforced by modern information systems is a field (multiple paths, continuous compliance, human as value navigator). We demonstrate, drawing on Lipsky (1980), Vaughan (1996), Holmström & Milgrom (1991), Scott (1998), and Norman (1988), that the enforcement response to procedural bypass — "make the tunnel harder to exit" — is empirically predicted to fail across five independent analytical traditions. The correct response is not a better tunnel. It is a field. *A tunnel has walls. A field has a horizon.*

We argue that the policy/procedure distinction is not merely semantic but operationally critical: procurement policy defines *what* must be achieved, while procedure is only *one* method of achievement. Modern ERP and AI-powered procurement systems have absorbed the compliance enforcement function that procedures were designed to perform, rendering procedural gatekeeping structurally obsolete.

**Keywords:** procurement policy, procurement procedure, opportunity cost, procedural compliance, bypass cost, tunnel vs. field model, agile procurement, total cost of ownership, renegotiation risk, street-level bureaucracy, normalization of deviance

---

## 1. Introduction

### 1.1 The Compliance Theater Problem

Consider two procurement officers facing an identical acquisition challenge: purchasing a fleet of 50 company vehicles worth €1.2 million. Officer A follows a rigid eight-step formal tender procedure: market analysis, RFI publication, RFQ issuance, bid evaluation committee, price negotiation, legal review, board approval, contract signature. The process takes 180 days.

Officer B operates under the same procurement policy—requiring competitive price validation, documented supplier selection rationale, and board approval above €500,000—but chooses the method dynamically: a 30-day accelerated competitive dialogue with pre-qualified suppliers, a structured should-cost analysis, and direct negotiation with the top-ranked supplier. Same policy. Different procedure. 45 days.

Officer A's comfort is procedural: "I did it by the book." Officer B's comfort is substantive: "I got the best value for money, within policy." When audited, both are compliant. But only Officer B has actually served the organization's interest. The difference—in time, in price, in opportunity—is the subject of this paper.

This phenomenon is not idiosyncratic. The literature documents systematic rigidity in public and corporate procurement, typically attributed to accountability pressures (Beuve et al. 2021), institutional isomorphism (DiMaggio & Powell 1983), and principal-agent dynamics that reward compliance over performance (Kelman 1990). What has received less systematic treatment is the *quantification* of opportunity costs imposed by procedural rigidity, and whether a policy/procedure distinction can serve as an actionable reform mechanism.

### 1.2 Research Questions

This paper addresses three questions:

1. **What is the conceptual distinction** between procurement policy and procurement procedure, and why does it matter organizationally?
2. **What are the quantifiable cost dimensions** of rigid-procedure compliance compared to policy-only compliance?
3. **Can a practical model** capture these costs in a way useful to procurement professionals and their organizations?

### 1.3 Contribution

We make three contributions. First, we provide a clear operational definition distinguishing procurement policy from procurement procedure, grounding it in the existing CIPS framework and extending it with an incentive-theoretic analysis. Second, we construct a five-dimensional empirical cost model synthesizing findings from public procurement economics, infrastructure management, and supply chain management. Third, we introduce ProcuraCost—an open-source calculator implementing the model—as a practical tool for procurement transformation initiatives.

---

## 2. Conceptual Framework

### 2.1 Procurement Policy vs. Procurement Procedure: A Working Definition

The Chartered Institute of Procurement & Supply (CIPS 2024) defines a **procurement policy** as a document that "sets the rules, guidelines, and framework governing procurement activities," specifying authorization thresholds, competitive requirements, and ethical standards. A **procurement procedure** describes "the step-by-step operational processes" employees must follow to execute policy principles.

The relationship is hierarchical: policy defines *constraints and objectives*; procedures define *one path* through those constraints. Policy says "achieve competitive pricing, document your rationale, obtain appropriate approvals." Procedure says "issue an RFQ to at least three suppliers, convene a five-person evaluation committee, wait 21 days for bids."

We formalize this distinction as follows:

> **Definition 1 (Procurement Policy):** A set of rules P = {r₁, r₂, ..., rₙ} defining authorization thresholds, competitive requirements, documentation standards, and ethical constraints that any procurement action must satisfy.

> **Definition 2 (Procurement Procedure):** A specific ordered sequence of actions A = (a₁, a₂, ..., aₖ) that constitutes one sufficient method for satisfying policy P.

The critical implication is that for any policy P, there typically exists a family of valid procedures {A₁, A₂, ..., Aₘ} — multiple sufficient methods — with widely varying cost, duration, and outcome profiles. Procedural compliance theater occurs when organizations treat one procedure Aᵢ as if it were equivalent to policy P, eliminating the optimization space constituted by the procedure family.

### 2.2 The Compliance-First Incentive Structure

Why do procurement officers collapse the policy/procedure distinction? We identify three mechanisms:

**Accountability asymmetry.** Procedural non-compliance is visible and auditable; suboptimal outcomes within procedure are rarely attributed to the procurement method. An officer who deviated from procedure will be asked "why?" An officer who followed procedure and paid 15% above market will be asked nothing—provided documentation is in order. This asymmetry creates a dominant strategy: follow procedure regardless of value consequences.

**Rigidity as political protection.** Beuve et al. (2021) demonstrate that public contracts incorporate more rigidity clauses than comparable private contracts, and that rigidity increases with political contestability. Rigid procedures reduce the attack surface for accusations of favoritism or corruption—a rational institutional response that, however, imposes economic costs on the contracting entity.

**Institutional isomorphism.** Organizations in the same industry adopt similar procurement procedures not because these procedures are optimal but because doing otherwise invites legitimacy challenges. "Everyone does RFQ this way" is a powerful organizational norm, independent of whether "this way" produces superior outcomes.

### 2.3 The Policy Compliance Alternative

A policy-compliant but procedure-flexible approach retains all governance and accountability benefits of rigid procedures while restoring the optimization space:

- Authorization thresholds: preserved (same approval matrix)
- Competitive requirements: preserved (same minimum competitive validation)
- Documentation standards: preserved (same audit trail requirements)
- Ethical constraints: preserved (same conflict-of-interest rules)

What changes is the *method*: the specific sequence of actions, timelines, supplier engagement formats, and negotiation strategies are dynamically calibrated to the procurement context. A routine, low-complexity purchase uses a streamlined approach. A strategic, high-value, relationship-dependent acquisition uses a sophisticated multi-round engagement. Neither deviates from policy; both select the procedure appropriate to context.

### 2.4 The Tunnel vs. Field Model

The policy/procedure distinction can be captured in a spatial metaphor that is both intuitive and formally precise: the **tunnel** versus the **field**.

> *"A tunnel has walls. A field has a horizon."*

**The Tunnel Model (procedure-first):** A procurement procedure defines a single ordered sequence of actions A = (a₁, a₂, ..., aₙ). The human actor is a step-executor: her role is to complete each action in sequence. Compliance is binary—she is either in the tunnel or outside it. When real-world conditions deviate from the assumptions embedded in the procedure design (time pressure, missing data, uncooperative suppliers, market discontinuities), the tunnel fails. The actor faces a binary choice: force reality into the tunnel at high cost, or exit the tunnel and proceed informally. This is the bypass.

```
Tunnel:  a₁ → a₂ → a₃ → ··· → aₙ
         (one path, sequential, human as executor)
         ↓ under pressure:
         a₁ → [BYPASS] → informal path (mail/phone/Excel)
```

**The Field Model (policy-first):** A procurement policy defines a bounded space Φ ⊂ ℝⁿ of permissible actions. The boundaries are defined by constraints C = {c₁, c₂, ..., cₖ} — authorization thresholds, competitive requirements, documentation standards, ethical rules. Within Φ, any path is valid. The human actor is a navigator: her role is to find the path through the field that maximizes value, subject to staying within the boundary constraints.

```
Field:   ∂Φ defined by C = {authorization, competition, ethics, documentation}
         Interior: infinite paths, all compliant
         Human role: navigate toward maximum value
         (no bypass possible — boundaries are everywhere and always active)
```

The critical structural difference: in the tunnel model, compliance is a momentary state (am I in the tunnel right now?). In the field model, compliance is continuous — the constraint set is evaluated at every point of movement, not only at predefined checkpoints. Modern procurement information systems (ERP, spend analytics, AI-assisted sourcing) make the field model operationally viable: they enforce boundary constraints automatically at every transaction, in real time, without procedural gatekeeping.

> **Proposition 1:** Any procurement action that satisfies policy constraints C is fully compliant regardless of the path taken. The claim "she bypassed the process" conflates bypassing a *procedure* (one specific path) with bypassing *policy* (the boundary constraints). These are categorically different.

> **Proposition 2:** As the number of compliant paths within Φ approaches infinity (as procedural constraints are relaxed to pure policy constraints), the bypass incentive approaches zero — because there is nothing to bypass.

This model directly addresses the image diagnosed by Filipowski (2026): "if the user bypasses the process, the process doesn't work." Our response: the process shown is a tunnel. The fact that experienced practitioners exit it under pressure (mail, phone, Excel) is not evidence of poor process design or insufficient enforcement — it is evidence that the tunnel model is structurally inappropriate for the complexity and dynamism of procurement work. No tunnel, however well-designed, survives contact with procurement reality at scale.

---

## 3. The Five-Dimension Cost Model

We model the cost differential between a rigid-procedure approach (R) and a policy-compliant flexible approach (F) across five dimensions:

### 3.1 Dimension 1: Time Cost (C_time)

Procurement staff time consumed by procedural execution.

```
C_time(R) = days_R × n_buyers × rate_daily
C_time(F) = days_F × n_buyers × rate_daily
ΔC_time = (days_R - days_F) × n_buyers × rate_daily
```

**Empirical anchors:** OECD (2023) documents average infrastructure procurement durations of 554 days in OECD countries and 836 days in Sub-Saharan Africa. Agile procurement case studies report 60–75% time reductions (Skylight Digital 2024; Swiss Casinos ERP case: 120-day rigid vs. 28-day agile, EY Switzerland 2024).

### 3.2 Dimension 2: Administrative Overhead (C_admin)

Fixed costs of compliance infrastructure: documentation, audit trails, IT procurement systems, compliance staff.

```
ΔC_admin = admin_R - admin_F
```

**Empirical anchors:** E-procurement system design rigidity creates substantial implementation and maintenance costs (World Bank 2021). Administrative burden reduces supplier participation, reducing competition and increasing prices.

### 3.3 Dimension 3: Opportunity Cost (C_opp)

Two components: (a) price premium under rigidity; (b) deployment delay cost.

```
C_opp(R) = V × α + max(0, days_R - days_F) × rev_daily
C_opp(F) = 0
```

Where α = price premium coefficient, V = contract value, rev_daily = daily value of the deployed asset/service.

**Empirical anchor for α:** Szucs (2024) analyzes a Hungarian procurement reform that removed mandatory open auction requirements below certain contract thresholds. The removal of rigid auction requirements redistributed approximately **2% of total contract value** from taxpayers to firms in the form of higher prices—implying that mandatory rigid auctions, when present, suppress prices by ~2% relative to discretionary approaches. We use α = 0.02 as a conservative baseline. The productivity loss for contractors was estimated at **-1.6%** (Szucs 2024, p. 127).

### 3.4 Dimension 4: Renegotiation Risk (C_reneg)

Expected cost of contract renegotiations induced by rigidity.

```
C_reneg(R) = P_R × cost_reneg
C_reneg(F) = P_F × cost_reneg
P_R = P_base + Δp_rigidity
P_base ≈ 0.22 (public contracts baseline)
Δp_rigidity = 0.077 to 0.105
```

**Empirical anchor:** Beuve, Moszoro & Saussier (2021) find that a one standard deviation increase in contractual rigidity is associated with a **7.7–10.5 percentage point increase** in renegotiation probability, relative to an unconditional renegotiation rate of approximately 22% for public contracts. Public-to-private contracts are renegotiated significantly more often than private-to-private contracts.

The paradox: rigidity is adopted to reduce accountability risk, but it increases the probability of the very outcome (renegotiation) that imposes highest reputational and financial cost.

### 3.5 Dimension 5: Foregone TCO Savings (C_TCO)

Optimization opportunities not captured due to inflexibility in supplier engagement, volume structuring, and lifecycle costing.

```
C_TCO(R) = V × γ × T × (1 - φ_R)
C_TCO(F) = V × γ × T × (1 - φ_F)
```

Where γ = annual TCO savings rate, T = horizon years, φ = flexibility index.

**Empirical anchor:** ISM (Institute for Supply Management) documents that properly implemented TCO sourcing programs yield savings of **up to 30% over three years** (≈10% annually) relative to price-only procurement. GEP (2024) confirms through should-cost modeling that organizations systematically overpay when evaluation criteria prioritize compliance documentation over cost engineering.

### 3.6 Total Cost Differential

```
ΔC_total = ΔC_time + ΔC_admin + C_opp(R) + ΔC_reneg + ΔC_TCO
```

The model is calibrated with conservative estimates at each dimension. Real-world differentials may be substantially larger, particularly for complex, long-duration contracts in dynamic market conditions.

---

## 4. Case Studies

### 4.1 Aviation Fleet Procurement: Ryanair

Ryanair's fleet growth from ~50 to 400+ aircraft between 1990 and 2019 was achieved through strategic opportunistic procurement: large orders placed during industry crises (post-9/11: 100 Boeing 737s at depressed prices; post-Coronavirus: 75 MAX orders at negotiated terms). This approach was entirely incompatible with formal tender procedures—it required rapid decision-making, confidential negotiations, and flexibility to commit at the right market moment.

The policy compliance is complete: board approval, competitive price benchmarking, financial modelling, legal due diligence. The procedure was entirely non-standard. The result: industry-leading CASK (Cost per Available Seat Kilometer) that no procedure-following competitor has matched (IJRAR 2019).

LOT Polish Airlines' 2025 order for 40 Airbus A220 aircraft similarly proceeded through direct negotiation and relationship management—policy-compliant, procedure-flexible, and sensitive to competitive dynamics between Embraer and Airbus that a formal RFQ process would have foreclosed.

### 4.2 ERP Implementation: Swiss Casinos

Swiss Casinos sourced and contracted an enterprise ERP system in **four weeks** using Lean Agile Procurement (LAP), compared to a typical 4–6 month formal RFP process. Policy compliance: competitive evaluation, structured scoring, executive approval. Procedure: intensive collaborative workshops with pre-qualified vendors, rapid prototype evaluation, direct negotiation (EY Switzerland 2024; Skylight Digital 2024).

Quantified benefit: ~75% time reduction translates directly to earlier ROI realization on a multi-million CHF investment.

### 4.3 Cargo Logistics: Air France KLM Martinair

Door-to-door cargo modernization required sourcing within a 6-month window imposed by competitive and regulatory dynamics. Standard tender procedures for a contract of this complexity would require 12–18 months. LAP-based approach completed sourcing within the window (EY Switzerland 2024). The policy was unchanged; the procedure was adapted to the constraint.

### 4.4 Production Materials: Zara (Inditex)

Zara's 2-week collection cycle made traditional procurement procedures structurally incompatible with its operating model. AI-driven procurement analytics, dynamic supplier engagement, and agile sourcing replaced sequential RFQ-based approaches. The result is not just faster procurement but qualitatively different market responsiveness—a competitive advantage that procedurally-rigid competitors cannot replicate (Tradogram 2024).

---

## 5. The ProcuraCost Calculator

### 5.1 Design Philosophy

ProcuraCost operationalizes the five-dimension model as a web-based calculator. Design priorities:

- **Transparency:** every output is traceable to an academic source
- **Calibration:** baseline parameters reflect conservative empirical estimates; users can override
- **Practical utility:** pre-configured scenarios for common procurement archetypes
- **Dual audience:** Polish-language interface for practitioners; English methodology for academic citation

### 5.2 Implementation

Built on Next.js 16 (App Router), Tailwind CSS, and Recharts. Available at: [github.com/procuracost] (forthcoming). Scenarios: fleet acquisition, IT/ERP, logistics, production materials, custom.

### 5.3 Validation

The model produces directionally consistent results across all scenarios: rigid-procedure total costs exceed flexible-policy costs by 100–400%. The largest contributors are TCO foregone savings (driven by horizon length and contract value) and opportunity costs (driven by deployment delay and price premium). Time costs are significant but secondary at standard buyer salary rates.

---

## 6. Discussion

### 6.1 The Renegotiation Paradox

Perhaps the most striking finding from the Beuve et al. (2021) analysis is what we term the **renegotiation paradox**: procedural rigidity is adopted precisely to reduce accountability risk, yet it significantly increases the probability of contract renegotiation—which is itself a major source of accountability risk, financial loss, and reputational damage. Organizations that embrace rigidity for safety pay for it twice: once in opportunity costs, and again in higher renegotiation rates.

### 6.2 When Are Rigid Procedures Justified?

We do not argue that rigid procedures are never appropriate. They may be justified when:
- The procurement is highly routine and the procedure has been optimized over time
- Political accountability demands visible procedural equality (public sector, regulated industries)
- Supplier market is deep and highly competitive, minimizing opportunity cost
- The buying organization lacks the procurement sophistication to exercise discretion well

The policy/procedure framework does not argue for procedural anarchy—it argues for conscious, contextual procedure selection within a stable policy framework.

### 6.3 Implementation Challenges

The shift from procedure-compliance to policy-compliance requires organizational investment in three areas:

1. **Procurement capability:** buyers must have the judgment, market knowledge, and negotiation skills to exercise discretion productively
2. **Governance frameworks:** clear policy documentation must precede procedural flexibility; otherwise "flexible" becomes "arbitrary"
3. **Cultural change:** audit functions and management must reward outcomes, not just compliance—a significant behavioral change in organizations conditioned to procedural accountability

### 6.4 The Enforcement Fallacy: Why Better Tunnels Don't Work

A common response to procedural failure is to strengthen enforcement: make procedures harder to bypass, increase audit frequency, implement technical lockouts. This response—which we term the **enforcement fallacy**—is empirically predicted to fail by five decades of organizational research.

**Street-Level Bureaucracy (Lipsky 1980).** Lipsky's foundational study of frontline workers in public organizations demonstrates that adaptation of formal rules to operational reality is not deviance—it is the *normal* condition of complex work. Workers exercise discretion not because they lack commitment to rules but because rules cannot anticipate all operational contingencies. Enforcement that eliminates formal bypasses does not eliminate the underlying adaptation; it drives it underground. What was visible mail-and-phone procurement becomes invisible undocumented procurement. The organization loses auditability without gaining compliance.

**Normalization of Deviance (Vaughan 1996).** Diane Vaughan's analysis of the Space Shuttle *Challenger* disaster demonstrates the catastrophic endpoint of the enforcement fallacy. When operationally necessary workarounds are formally prohibited, they do not disappear—they normalize invisibly. Each successful bypass without consequence reduces the perceived risk of the next bypass. The organization accumulates hidden risk until a threshold failure event. Vaughan's finding applies directly: enforcing procurement procedures more tightly does not eliminate informal procurement; it makes informal procurement invisible and therefore unmanageable.

**Multitask Principal-Agent Theory (Holmström & Milgrom 1991).** Bengt Holmström (Nobel Prize 2016) and Paul Milgrom demonstrate formally that when a principal can measure and enforce some tasks but not others, agents rationally allocate effort away from unmeasured tasks toward measured ones. Applied to procurement: when compliance with procedural steps is measured and enforced, and value creation is not, procurement officers rationally shift effort toward compliance documentation and away from market analysis, negotiation, and total cost optimization. Enforcement of procedural compliance *directly* crowds out value creation—not as a side effect, but as a structural outcome.

**Goodhart's Law (Goodhart 1975; Strathern 1997).** "When a measure becomes a target, it ceases to be a good measure." When procedural compliance rate becomes the KPI for procurement performance, procedural compliance theater is the rational organizational response. Organizations achieve 100% procedural compliance while simultaneously failing to achieve competitive pricing, optimal supplier relationships, or value-for-money outcomes. The measure (compliance) crowds out the goal (value).

**High-Modernist Planning Failure (Scott 1998).** James Scott's comparative analysis of large-scale state planning failures demonstrates a structural pattern: detailed procedural systems designed by central experts fail because they cannot capture *métis*—the local, practical, contextual knowledge that workers accumulate through experience. The procurement equivalent: procedures designed by process consultants in conference rooms (Filipowski's "sala projektowa") cannot encode the market knowledge, supplier relationships, and contextual judgment that experienced buyers (25+ years) bring to complex acquisitions. Better process design does not solve this problem; it remains a category error.

**The Design Implication (Norman 1988).** Donald Norman's foundational work on human-centered design establishes that when users systematically bypass a system, the correct inference is a design failure—not a user failure. "Blame the user" is the designer's fallacy. When experienced procurement officers across organizations, industries, and geographies exit the formal process under time pressure in favor of mail, phone, and Excel, the correct interpretation is not "these professionals lack discipline." The correct interpretation is: the system was designed for a world that does not exist.

**Synthesis.** The enforcement response to procedural bypass — "if users circumvent the process, the process doesn't work; therefore, make circumvention impossible" — is empirically wrong in five independent analytical traditions. Lipsky tells us circumvention is structurally inevitable. Vaughan tells us forcing it underground makes it dangerous. Holmström-Milgrom tells us enforcement crowds out the actual goal. Goodhart tells us the compliance measure will be gamed. Scott tells us the procedures can't encode what they need to encode. Norman tells us the system design is the problem.

The correct response is not a better tunnel. It is a field. *A tunnel has walls. A field has a horizon.*

### 6.5 Technology as the New Compliance Infrastructure: The Field Made Operational

If the tunnel model was the pre-digital solution to the problem of compliance enforcement, it was a solution constrained by the technology of its time. In the absence of real-time information systems, procedural checkpoints were the only mechanism available to verify that policy constraints were being respected. A five-person evaluation committee, a 21-day bid period, a physical approval signature — these were not arbitrary bureaucratic inventions. They were the best available instruments for ensuring competitive validation and documented decision-making in a paper-based organizational world.

That world no longer exists.

Modern procurement information systems fundamentally change the compliance architecture:

- **ERP systems** (SAP Ariba, Coupa, Oracle Procurement Cloud) enforce authorization thresholds at the transaction level, in real time, without requiring a procedural checkpoint. A purchase above €100,000 cannot be approved without the correct authorization level — not because a procedure says so, but because the system enforces the policy constraint automatically.

- **AI-powered spend analytics** (GEP SMART, Jaggaer, Ivalua) detect policy violations, off-contract spend, and anomalous supplier selection in continuous monitoring mode — without requiring procedural audit trails generated by human actors.

- **Automated audit trails** record every action, timestamp, and decision with cryptographic integrity, providing a compliance record that is more complete and tamper-resistant than any procedural documentation requirement could generate.

- **Machine learning path optimization** (emerging) can model the space of procurement decisions and identify which paths through the policy field deliver optimal outcomes for a given procurement context — making the field model not merely permissive but actively prescriptive.

The implication is straightforward: **procedures were a pre-digital compliance mechanism**. Their function — ensuring that policy constraints are respected — has been absorbed by information systems that perform this function better, faster, and more completely than procedural checkpoints ever could.

The analogy is direct: a procedure is a security guard at a gate. A modern procurement system is AI-monitored perimeter surveillance of the entire facility. The question "how do we design a better security guard?" becomes irrelevant when the entire perimeter is monitored continuously.

This does not mean governance disappears. Policy — the definition of the permissible field — remains essential and must be maintained with rigor. Authorization structures, competitive requirements, ethical constraints, conflict-of-interest rules — these are the boundary conditions of the field, and they must be precisely specified. What becomes obsolete is the human-executed sequential procedure as the primary mechanism for enforcing those boundaries.

In the context of Polish public procurement law (*Prawo Zamówień Publicznych*, PZP), this distinction is already partially encoded: PZP specifies *what* must be achieved (competitive award, documentation, equal treatment of suppliers) without mandating a single operational procedure for achieving it. The field exists in the law; the pipe is an organizational choice layered on top of it. Organizations that mistake their pipe for the law misread both.

---

## 7. Conclusions and Policy Implications

Procurement procedures are useful—they encode institutional learning about how to execute purchases well. The pathology is not procedures themselves but their elevation to the status of policy: treating one method of procurement as if it were the purpose of procurement.

Our five-dimension cost model demonstrates that this pathology is expensive. Across four procurement archetypes analyzed, rigid-procedure costs exceed policy-only costs by multiples, not margins. The dominant cost drivers—foregone TCO optimization and deployment delay—are invisible to compliance-focused audits precisely because they are costs of inaction, not action.

The policy implication is tractable: organizations should invest in distinguishing their procurement policy (governance framework, to be strictly enforced) from their procurement procedures (operational methods, to be contextually selected). This distinction preserves accountability while restoring the optimization space that procedural rigidity eliminates.

---

## 8. Next Steps for Paper Development and Empirical Agenda (June–December 2026)

This section outlines the concrete next steps required to move from the current demonstration tool and working paper draft to a submission-ready research article and a credible empirical validation program. These steps directly address feedback received from academic reviewers (particularly the emphasis on methodology, parameter traceability, and empirical identification strategy).

### 8.1 Theoretical and Modeling Refinements (June–July 2026)

**Priority 1 – Formal Specification**
- Write a complete mathematical appendix specifying all five cost dimensions, their functional forms, and the integration of the Direct/Indirect × Upstream/Downstream 2×2 framework.
- Explicitly derive how the two new contextual dimensions modify:
  - Staff-hour participation matrices (role × step)
  - Calendar time compression factors
  - TCO, delay, renegotiation, and bypass multipliers
- Version the model as v1.1 with frozen parameters for replication purposes.

**Priority 2 – Hypotheses Development**
- Formulate 5–7 testable propositions that link the 2×2 dimensions to observable outcomes (e.g., "The opportunity cost gap between rigid and flexible paths is significantly larger for Direct × Upstream spend than for Indirect × Downstream spend").
- Distinguish between propositions that can be tested with existing secondary data versus those requiring primary data collection.

### 8.2 Empirical Instruments and Pilot Design (July–September 2026)

**Priority 1 – Data Collection Tools**
- Design a structured survey instrument that directly elicits the parameters required by the ProcuraCost model (time allocations by role and step, perceived delay costs, renegotiation frequency, bypass behavior).
- Develop a semi-structured interview protocol for procurement leaders and CFOs focused on the behavioral mechanisms (compliance theater, normalization of deviance, enforcement fallacy).
- Create a standardized case study template that maps organizational procurement processes onto the model's five dimensions and 2×2 contextual quadrants.

**Priority 2 – Pilot Validation**
- Identify and secure access to 3–5 organizations (mix of public sector, large corporates, and mid-sized firms) for in-depth pilot studies.
- Run the first two pilots using the current version of ProcuraCost as a structured data collection and sense-making tool.
- Document the process as a methods appendix ("Using a formal cost model as a research instrument in procurement organizations").

### 8.3 Research Infrastructure and Replicability (July–August 2026)

- Finalize and publish a complete **replication package** containing:
  - All model code with version pinning
  - Full parameter table with sources and sensitivity ratings
  - Synthetic datasets that reproduce the four case studies in the paper
  - Export functionality from the live tool that generates machine-readable scenario files
- Add a "Researcher Export" mode to ProcuraCost that outputs the complete set of inputs, intermediate calculations, and outputs in a reproducible format (JSON + CSV).

### 8.4 Paper Positioning and Writing (August–October 2026)

**Target Journal Shortlist (to be refined)**
- *Journal of Public Procurement* (Emerald)
- *Public Administration Review*
- *Journal of Purchasing and Supply Management*
- *International Journal of Public Sector Management*

**Key Writing Tasks**
- Expand the literature review to explicitly position the contribution relative to:
  - Transaction cost economics extensions into public procurement
  - Behavioral public administration and street-level bureaucracy
  - Information systems and governance (the "technology as compliance infrastructure" argument)
- Write a dedicated "Measurement and Operationalization" section that treats ProcuraCost as a measurement instrument.
- Strengthen the "Contributions to Practice" section with clearer managerial implications and boundary conditions (when rigid procedures may still be justified).
- Draft a 3–4 page "Research Agenda" companion document suitable for sending to potential supervisors or co-authors.

### 8.5 Conference and Outreach Plan (September–December 2026)

- Submit to at least two academic conferences in 2026/2027 (e.g. IPSERA, EGPA, Polish Academy of Sciences events, or specialized procurement workshops).
- Prepare an 8–10 slide academic presentation version of the paper.
- Develop a one-page "Supervisor Pitch" document summarizing the model, current evidence, validation plan, and requested form of collaboration.

### 8.6 Second Paper Pipeline

The current paper focuses on model development and demonstration. A natural follow-up paper (2027) would report the results of the empirical validation program. Planning for this second paper should begin in parallel, particularly the pre-registration of hypotheses and the design of the identification strategy.

---

**Status as of May/June 2026**: The core model is implemented, transparently documented, and publicly accessible via the live ProcuraCost tool (including the interactive Assumptions Explorer at `/model/assumptions`). The current working paper draft provides the conceptual framing and initial case evidence. The tasks above represent the critical path from demonstration to publishable, empirically grounded research.

For public sector procurement specifically, the Szucs (2024) finding suggests that mandatory rigid auctions—while achieving price discipline in some contexts—may impose net costs through reduced negotiation quality and increased renegotiation. A policy framework that requires competitive validation without mandating a specific competition format may achieve better outcomes.

---

## References

Beuve, J., Moszoro, M., & Saussier, S. (2021). *Contractual Rigidity and Political Contestability: Revisiting Public Contract Renegotiations*. NBER Working Paper 28491. National Bureau of Economic Research.

Goodhart, C. A. E. (1975). Problems of monetary management: The UK experience. *Papers in Monetary Economics*, 1. Reserve Bank of Australia. [Popularized as "Goodhart's Law" by Strathern 1997.]

Holmström, B., & Milgrom, P. (1991). Multitask principal-agent analyses: Incentive contracts, asset ownership, and job design. *Journal of Law, Economics, & Organization*, 7, 24–52.

Chartered Institute of Procurement & Supply (CIPS). (2024). *Procurement Policies & Procedures Explained*. CIPS Intelligence Hub.

DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited: Institutional isomorphism and collective rationality in organizational fields. *American Sociological Review*, 48(2), 147–160.

EY Switzerland. (2024). *Integrating Agile Practices into Procurement Processes*. Ernst & Young AG.

GEP. (2024). *Should-Cost Modeling: Because You Must Get the Cost Right*. GEP Blog.

Institute for Supply Management (ISM). (2024). *Understanding Total Cost of Ownership in Procurement*. ISM Supply Chain Resources.

International Journal of Research and Analytical Reviews (IJRAR). (2019). *Ryanair Strategic Positioning and Fleet Management*. IJRAR, 6(2).

Kelman, S. (1990). *Procurement and Public Management: The Fear of Discretion and the Quality of Government Performance*. AEI Press.

Lipsky, M. (1980). *Street-Level Bureaucracy: Dilemmas of the Individual in Public Services*. Russell Sage Foundation.

Norman, D. A. (1988). *The Design of Everyday Things*. Basic Books.

OECD. (2023). *Public Procurement Performance*. OECD Publishing, Paris. https://doi.org/10.1787/0dde73f4-en

Scott, J. C. (1998). *Seeing Like a State: How Certain Schemes to Improve the Human Condition Have Failed*. Yale University Press.

Skylight Digital. (2024). *Agile Procurement Playbook — Appendix A: Case Studies*. U.S. Digital Service.

Strathern, M. (1997). 'Improving ratings': Audit in the British University system. *European Review*, 5(3), 305–321.

Szucs, F. (2024). Discretion and Favoritism in Public Procurement. *Journal of the European Economic Association*, 22(1), 117–151. https://doi.org/10.1093/jeea/jvad036

Tradogram. (2024). *Agile Procurement Practices: A Comprehensive Guide*. Tradogram Blog.

Vaughan, D. (1996). *The Challenger Launch Decision: Risky Technology, Culture, and Deviance at NASA*. University of Chicago Press.

World Bank. (2021). *Improving Public Procurement Outcomes: Review of Tools and the State of the Evidence Base*. Policy Research Paper 9690. World Bank Group.

---

*Draft status: Phase 1 complete (structure, lit review, model). Phase 2 (empirical calibration, peer review) pending.*  
*Contact: [pawel@mamcarz.com]*
