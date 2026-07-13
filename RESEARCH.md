# The Hidden Cost of Procedural Compliance: Opportunity Costs of Rigid Procurement Rules vs. Policy-Based Procurement

**Working Paper — Draft for Review (v1.0)**
Date: June 2026
Target journal: *Journal of Public Procurement* (Emerald Publishing)

---

## Abstract

Organizations may conflate procurement *policy*—a high-level framework of principles, authorization thresholds, and ethical standards—with procurement *procedure*, a specific operational workflow for executing a purchase. We theorize that this conflation can make procedural compliance a risk shield ("I followed the procedure, therefore I am safe") and may displace value-seeking judgment. We call the proposed mechanism **procedural compliance theater**; its prevalence and effect size remain to be tested.

Drawing on public procurement economics, we construct a transparent deterministic simulation model with explicit 2×2 contextual differentiation. The evidence base is deliberately separated from the assumptions. Beuve, Moszoro, and Saussier (2021) provide an empirical anchor for the relationship between contractual rigidity and renegotiation. Szucs (2024) provides a countervailing boundary condition: high discretion can increase prices and select less productive suppliers, so policy flexibility cannot be equated with unconstrained discretion. TCO opportunity, bypass behavior, technology effects, process-step durations, and the 2×2 interaction multipliers remain modeling assumptions requiring external calibration.

The primary contribution is methodological: a candidate measurement instrument that makes constructs, assumptions, transformations, and outputs auditable and empirically testable. The **Tunnel vs. Field** metaphor is secondary framing used to organize the policy/procedure distinction; it is not presented as a validated theory.

We operationalize the model in an open-source calculator (ProcuraCost) and demonstrate its mechanics across illustrative procurement archetypes located in the 2×2. The resulting differentials are model-implied scenario outputs, not causal estimates or evidence of realized organizational savings. Their wide dispersion across the built-in scenarios demonstrates sensitivity to TCO, delay, bypass, horizon, and context assumptions and motivates the proposed empirical validation program.

We introduce the **Tunnel vs. Field** model as the organizing metaphor: a procedure is a tunnel (single path, one direction, human as step-executor); a procurement policy supported by modern information systems is a field (multiple paths, continuous controls, human as value navigator). The model is extended with a 2×2 contextual framework (Direct/Indirect spend × Upstream/Downstream process phase). Lipsky (1980), Vaughan (1996), Holmström and Milgrom (1991), Scott (1998), and Norman (1988) offer complementary mechanisms explaining why enforcement-only responses to procedural bypass may fail. *A tunnel has walls. A field has a horizon.*

We argue that the policy/procedure distinction is not merely semantic but operationally relevant: procurement policy defines *what* must be achieved, while a procedure specifies one method of achievement. Modern procurement systems may support continuous policy controls, but whether they can safely replace particular procedural gates is an empirical and legal question rather than an assumption of the model.

**Keywords:** procurement policy, procurement procedure, opportunity cost, procedural compliance, bypass cost, tunnel vs. field model, agile procurement, total cost of ownership, renegotiation risk, street-level bureaucracy, normalization of deviance

---

## 1. Introduction

### 1.1 The Compliance Theater Problem

Consider a hypothetical acquisition of 50 company vehicles worth €1.2 million. In the first modeled path, an officer follows an eight-step formal tender procedure: market analysis, RFI publication, RFQ issuance, bid evaluation committee, price negotiation, legal review, board approval, and contract signature. The illustrative input assigns this path 180 days.

In the second modeled path, an officer works under the same assumed policy constraints—competitive price validation, documented supplier-selection rationale, and board approval above €500,000—but uses an accelerated dialogue with pre-qualified suppliers, should-cost analysis, and negotiation. The illustrative input assigns this path 45 days.

The example does not establish that either path is lawful, compliant, or superior in a real procurement. It isolates the question examined by the model: how should time, effort, opportunity, renegotiation, and governance risks be compared when more than one route is legally and organizationally available?

Prior research provides reasons to examine rigidity, discretion, accountability pressure, institutional isomorphism, and multitask incentives (Beuve et al. 2021; DiMaggio & Powell 1983; Kelman 1990). This paper hypothesizes that any opportunity-cost effect may differ along two contextual dimensions: Direct versus Indirect spend and Upstream versus Downstream process phase. We call this the 2×2 framework. The current multipliers encode that hypothesis; they are not empirical estimates. The framework changes model outputs mechanically and defines a calibration agenda for subsequent field research.

### 1.2 Research Questions

This paper addresses four questions:

1. **What is the conceptual distinction** between procurement policy and procurement procedure, and why does it matter organizationally?
2. **How do the 2×2 contextual dimensions** (Direct/Indirect × Upstream/Downstream) alter the magnitude and composition of opportunity costs under procedural rigidity?
3. **What are the quantifiable cost dimensions** of rigid-procedure compliance compared to policy-only compliance, and how are they operationalized as a formal measurement model?
4. **Can a practical, reproducible model** capture these costs in a way useful to procurement professionals and their organizations, with full traceability to source code and parameters?

### 1.3 Contribution

We make four contributions, ordered by importance. First, we provide ProcuraCost as a candidate measurement instrument whose deterministic logic, parameters, calculation trace, and role-level staff costs are exportable for audit and calibration. Second, we construct a literature-informed simulation framework with explicit 2×2 contextual differentiation (Direct/Indirect spend × Upstream/Downstream process phase); all contextual effects are documented assumptions. Third, we provide working definitions of procurement policy and procedure and use Tunnel vs. Field as a secondary organizing metaphor connected to testable mechanisms. Fourth, we release propositions, survey and interview mappings, tests, generated scenario outputs, and a replication workflow that make the implementation falsifiable. The contribution at this stage is methodological, computational, and conceptual; empirical validation remains future work.

---

## 2. Conceptual Framework

### 2.1 Procurement Policy vs. Procurement Procedure: A Working Definition

For this paper, we use the following working definitions. They are analytical choices to be evaluated for clarity and usefulness, not a universal professional or legal taxonomy.

The relationship is hierarchical: policy defines *constraints and objectives*; procedures define *one path* through those constraints. Policy says "achieve competitive pricing, document your rationale, obtain appropriate approvals." Procedure says "issue an RFQ to at least three suppliers, convene a five-person evaluation committee, wait 21 days for bids."

We formalize this distinction as follows:

> **Definition 1 (Procurement Policy):** A set of rules P = {r₁, r₂, ..., rₙ} defining authorization thresholds, competitive requirements, documentation standards, and ethical constraints that any procurement action must satisfy.

> **Definition 2 (Procurement Procedure):** A specific ordered sequence of actions A = (a₁, a₂, ..., aₖ) that constitutes one sufficient method for satisfying policy P.

The critical implication is that for any policy P, there typically exists a family of valid procedures {A₁, A₂, ..., Aₘ} — multiple sufficient methods — with widely varying cost, duration, and outcome profiles. Procedural compliance theater occurs when organizations treat one procedure Aᵢ as if it were equivalent to policy P, eliminating the optimization space constituted by the procedure family.

### 2.2 The Compliance-First Incentive Structure

Why do procurement officers collapse the policy/procedure distinction? We identify three mechanisms:

**Accountability asymmetry.** Procedural non-compliance is often easier to observe than the counterfactual value lost within a compliant process. We hypothesize that this measurement asymmetry can favor documented step completion over harder-to-observe value creation. Interviews and archival outcome data are required to establish whether that mechanism operates in procurement practice.

**Rigidity as political protection.** Beuve et al. (2021) report greater contractual rigidity in public-to-private than private-to-private contracts and connect rigidity to political contestability. We interpret political protection as one plausible motive for rigidity. Whether a given procedural safeguard creates net economic costs remains an empirical question.

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
         Interior: multiple authorized paths
         Human role: navigate toward value within constraints
         Bypass remains possible and must be observed and controlled
```

The proposed structural difference is that a tunnel prescribes one sequence, whereas a field permits multiple authorized paths within a complete constraint set. Modern procurement systems may evaluate selected controls at transaction or decision points, but their actual coverage and effectiveness require validation.

> **Conceptual proposition 1:** Within the model abstraction, an action is compliant when it satisfies the complete constraint set C. In practice, C must include every statutory and organizational requirement, including a mandated procedure where one applies.

> **Conceptual proposition 2:** Expanding the set of authorized paths may reduce incentives for informal workarounds, conditional on effective controls and capability. It cannot eliminate misconduct or prove that fewer procedural constraints improve outcomes.

Recurring workarounds such as email, phone, or spreadsheets may indicate a mismatch between a prescribed path and operational conditions. They may also reflect weak capability, poor incentives, or misconduct. The tunnel metaphor organizes these competing explanations but does not adjudicate among them; the empirical program must do so.

In the current parameterization, Direct+Upstream receives the strongest amplification: `tcoMultiplier = 1.62`, `delayMultiplier = 1.4`, elevated assumed bypass risk, and heavier senior-governance loading. Indirect+Downstream receives the smallest multipliers. These are transparent hypotheses encoded for sensitivity analysis, not measured quadrant effects.

---

## 3. The Cost Model with 2×2 Contextual Differentiation

ProcuraCost is a candidate measurement model before it is a decision tool. It simulates an opportunity-cost differential between a rigid-procedure path (R) and a policy-based flexible path (F) while explicitly differentiating across four quadrants defined by spend type (Direct vs. Indirect) and process phase (Upstream vs. Downstream). The 2×2 dimensions are structural implementation choices: they alter aggregate multipliers and trigger per-step adjustments. Their empirical validity remains to be tested.

The 2×2 effects are first-order. For Direct × Upstream the model applies tcoMultiplier up to 1.62, delayMultiplier of 1.4, elevated bypass and renegotiation factors, +22% calendar boosts on governance-heavy steps in the rigid path, and senior-role multipliers reaching 1.85× (executive, upstream) plus further per-step loadings. For Indirect × Downstream the same rigid steps produce materially smaller gaps. The measurement approach therefore requires the user (or analyst) to locate the procurement action in the 2×2 before interpreting any number.

We model the cost differential between a rigid-procedure approach (R) and a policy-based flexible approach (F) across six active components. A seventh, productivity-adjustment field remains inactive for schema compatibility. Multipliers and step-level adjustments are driven by the 2×2 framework (spend type × process phase). All functions are deterministic and versioned; researcher exports contain the exact inputs, multipliers, derived days and staff costs, and component breakdown.

### 3.1 Dimension 1: Time Cost (C_time)

Procurement staff time consumed by procedural execution.

```
C_time(R) = days_R × n_buyers × rate_daily
C_time(F) = days_F × n_buyers × rate_daily
ΔC_time = (days_R - days_F) × n_buyers × rate_daily
```

**Evidence status:** External reports document large variation in procurement duration and faster processing after fit-for-purpose reforms, but they do not identify the step durations used here. Template days and role hours are therefore modeling assumptions to be calibrated from organizational timestamps and time-use data.

### 3.2 Dimension 2: Administrative Overhead (C_admin)

Fixed costs of compliance infrastructure: documentation, audit trails, IT procurement systems, compliance staff.

```
ΔC_admin = admin_R - admin_F
```

**Evidence status:** Administrative burden and supplier participation are established concerns in the procurement literature, but the technology-level coordination costs in ProcuraCost are modeling assumptions rather than estimates taken from World Bank (2021).

### 3.3 Dimension 3: Opportunity Cost (C_opp)

In model v1.2 this component contains deployment-delay cost only.

```
C_opp(R) = max(0, days_R - days_F) × rev_daily × delayMultiplier
C_opp(F) = 0
```

Where rev_daily is the user-supplied daily value of the delayed asset or service.

**Boundary condition:** Szucs (2024) finds that high discretion increased prices and selected less productive contractors in the studied Hungarian system. Earlier ProcuraCost versions incorrectly reversed this effect. Model v1.2 assigns no exogenous price or productivity penalty to the rigid path; a future governance-risk module must distinguish bounded policy flexibility from poorly controlled discretion.

### 3.4 Dimension 4: Renegotiation Risk (C_reneg)

Expected cost of contract renegotiations induced by rigidity.

```
C_reneg(R) = P_R × cost_reneg
C_reneg(F) = P_F × cost_reneg
P_R = P_base + Δp_rigidity
P_base ≈ 0.22 (public contracts baseline)
Δp_model = 0.077 × renegotiationMultiplier
P_F = 0.22 × 0.70
```

**Empirical anchor and mapping:** Beuve, Moszoro & Saussier (2021) find that a one standard deviation increase in contractual rigidity is associated with a **7.7–10.5 percentage point increase** in renegotiation probability, relative to an unconditional renegotiation rate of approximately 22% for public contracts. ProcuraCost encodes the lower bound, multiplies it by an assumed contextual factor, and assumes a 0.70 flexible-path factor. Those mappings are not estimates from the paper.

The candidate tension is that contractual rigidity may be adopted partly for accountability protection while being associated with later renegotiation. Causal interpretation and transfer from contract clauses to procurement procedures require further evidence.

### 3.5 Dimension 5: Foregone TCO Savings (C_TCO)

Optimization opportunities not captured due to inflexibility in supplier engagement, volume structuring, and lifecycle costing.

```
rate_R = min(0.30, 0.10 × T × rigidity_R × tcoMultiplier)
rate_F = min(0.30, 0.10 × T × rigidity_F × tcoMultiplier)
C_TCO(R) = V × rate_R
C_TCO(F) = V × rate_F
```

The 10% annual rate, 30% cap, rigidity scaling, and contextual multiplier are explicit modeling assumptions.

**Evidence status:** A sufficiently specific primary source for the former ISM 30% claim was not identified during the evidence audit. The component is retained as a sensitivity-testable hypothesis and capped to prevent long horizons from implying foregone savings above 30% of contract value.

### 3.6 Total Cost Differential

```
ΔC_total = ΔC_time + ΔC_admin + ΔC_opp + ΔC_reneg + ΔC_TCO + ΔC_bypass
```

Applicable components are scaled by the 2×2 multipliers returned by `getDimensionMultipliers` and adjusted at the step level inside the derive functions. The cost breakdown retains a productivity-adjustment field for schema compatibility, but it is zero in model v1.2 because the prior implementation inverted the direction of the Szucs (2024) evidence.

The current parameterization is illustrative rather than externally calibrated. Real-world differentials may be smaller, larger, or directionally different; the sensitivity surface and validation plan are therefore part of the contribution.

### 3.7 Measurement and Operationalization

The model is fully specified in executable form. The 2×2 context is not a narrative overlay; it is an input that flows through every calculation path.

- `getDimensionMultipliers(spendType, processPhase)` returns six active multipliers (tco, delay, bypass, renegotiation, staffIntensity, coordinationIntensity). For Direct+Upstream the product logic yields tcoMultiplier = 1.35 × 1.2 = 1.62; for other quadrants the values are lower or inverted (e.g., downstream delayMultiplier = 0.9).
- `deriveRigidDays` and `deriveFlexibleDays` apply step templates, technology time multiplier, plus per-step 2×2 adjustments: +22% (1.22) on governance steps (`siwz_prep`, `spec_prep`, `clarifications`, `bid_evaluation`, `award_committee`, `contract_signing`, `needs_analysis`) only when phase=upstream and spendType=direct; corresponding extra compression (0.82) in the flexible path for the same quadrant.
- `deriveStaffCost` layers role multipliers (executive 1.85× upstream, additional per-step 1.45× on award/contract steps for Direct+Upstream) on top of the participation matrix, then scales the total by the staffIntensity multiplier.
- Bypass uses a logistic sigmoid (steepness 10, threshold 0.5) on effective rigidity = base × tech.bypassProbMultiplier × contextBypassMultiplier, where the largest context factor occurs in Direct+Upstream.

The full closed-form reference, including the call graph through `calculateCosts` and `buildBreakdown`, is in `docs/research/model_specification_draft.md`. Calculator and PDF outputs are generated by these functions using the user-chosen quadrant. The separate path optimizer is an explicit heuristic scoring ensemble and is not part of the quantitative cost model. Researcher exports contain inputs, context, the full multiplier vector, calculation trace, role-level staff costs, results, and source or assumption annotations.

Parameter provenance is documented in `docs/MODEL_PARAMETERS.md` (empirical anchors, calibrated values, modeling assumptions, sensitivity flags). The 2×2 multipliers are the primary targets for future empirical calibration; they are the mechanism by which the model claims to be context-sensitive rather than universal.

### 3.8 Core Testable Propositions

Because the 2×2 dimensions are structural inputs to the deterministic functions, the model yields specific, testable predictions about where and how the opportunity-cost gap will be largest. These are mechanical consequences of the multipliers and per-step adjustments rather than separate hypotheses. Full statements, operationalization, and mapping to survey/archival data are in `docs/research/testable_propositions_v1.md`.

Key predictions:

- **P1 (Gap amplification)**: The total opportunity cost gap (rigid vs. flexible) is materially larger for Direct×Upstream than for Indirect×Downstream, driven by the combined uplift in tcoMultiplier (to 1.62), delayMultiplier (1.4), bypass and renegotiation factors, +22% calendar boosts on governance steps, and senior-effort loadings (executive up to 1.85× upstream plus per-step extras).
- **P2 (Senior effort concentration)**: The share of staff cost from executive + manager + lawyer roles is substantially higher in Upstream phases (especially Direct+Upstream).
- **P3 (Bypass moderation)**: The probability of informal bypass is positively moderated by the Direct×Upstream combination under high base rigidity.
- **P4 (Cost composition shift)**: In Direct+Upstream the marginal cost of rigidity shifts from pure deployment delay toward foregone TCO leverage.

These propositions turn the measurement model into a generator of falsifiable claims for the next stage of empirical work.

**Reproduce any model output.** Every multiplier, day count, role-level staff-cost figure, and cost component generated by the live tool is produced by deterministic functions in `lib/calculations.ts` and `lib/process-templates.ts`. To reproduce exactly:

- Open the ProcuraCost calculator or the Assumptions Explorer at `/model/assumptions`.
- Choose the matching `spendType` ("direct" | "indirect") and `processPhase` ("upstream" | "downstream").
- Click "Export for Research" to download the JSON (also available as Markdown table or CSV). The payload includes the full input vector, the exact multiplier object from `getDimensionMultipliers`, derived `rigidDays` / `flexibleDays` / staff costs, the complete cost breakdown, bypass probability, and source annotations.

The same cost functions drive the PDF reports. The optimizer is separate and explicitly heuristic. Full closed forms are in `docs/research/model_specification_draft.md`.

---

## 4. Illustrative Archetypes

The built-in scenarios are synthetic examples designed to exercise different process and 2×2 settings. Their inputs are stored in `lib/scenarios.ts`, and `npm run replicate` regenerates their outputs. They are not observations from named organizations, benchmarks, or savings estimates.

### 4.1 Fleet Acquisition (Direct × Upstream)

This synthetic scenario represents a high-value, long-horizon acquisition with strategic timing and senior involvement. Under model v1.2 assumptions, the rigid and flexible totals are PLN 1.51m and PLN 0.33m, a 363.5% differential. The number is useful for tracing the mechanics of TCO, delay, and governance load; it is not an estimate for an airline or fleet buyer.

### 4.2 ERP Acquisition (Indirect × Upstream)

This scenario represents a strategic indirect purchase with high implementation-delay inputs. The generated differential is 557.2%. Its purpose is to expose how daily inaction cost, TCO horizon, and Upstream effort assumptions compound; those inputs require organizational data before substantive interpretation.

### 4.3 Logistics Service (Indirect × Upstream)

This scenario uses a strategic service contract with an assumed operational window. The generated differential is 446.1%. Delay and bypass assumptions drive much of the gap, making this scenario a priority candidate for timestamp and off-system-transaction validation.

### 4.4 Production Materials (Direct × Upstream)

This synthetic scenario combines Direct+Upstream multipliers with high contract value and delay inputs. It produces the largest built-in differential, 1074.7%. That extreme output is a warning about assumption leverage, not evidence of a typical effect. Across all eight built-in scenarios, generated differentials range from 18.1% to 1074.7%; external calibration must determine whether the direction and magnitude survive contact with real data.

---

## 5. The ProcuraCost Calculator

### 5.1 Design Philosophy

ProcuraCost operationalizes the full model—including the 2×2 contextual framework—as a transparent, exportable measurement instrument. Design priorities:

- **Event-level record:** one calculation represents one procurement event or contract; organizational attributes are contextual metadata, enabling multiple events to be nested within an organization
- **Context first:** the user explicitly selects spendType (direct/indirect) and processPhase (upstream/downstream); these drive every multiplier and step adjustment via `getDimensionMultipliers` and the derive* functions
- **Transparency:** every output is traceable to an empirical source or an explicit modeling assumption and to the exact code path
- **Sensitivity:** the Assumptions Explorer can vary selected 2×2 multipliers in a simplified simulator; overrides do not silently alter the production calculation engine
- **Reproducibility:** one-click Researcher Export produces a JSON payload (inputs + context + effective multipliers + intermediates + results + sources), a human-readable Markdown table, and CSV—sufficient to recreate or audit any reported number
- **Dual audience:** Polish-language interface for practitioners; English methodology for academic citation

### 5.2 Implementation

Built on Next.js 16 (App Router), Tailwind CSS, and Recharts. The 2×2 selector, multiplier detail panel, and Researcher Export buttons (JSON / MD / CSV) are present in both the main calculator and the Assumptions Explorer (`/model/assumptions`). The live implementation at the time of writing is the reference for all numerical claims in this paper. Scenarios: fleet acquisition, IT/ERP, logistics, production materials, custom. Full source of the calculation engine: `lib/calculations.ts` and `lib/process-templates.ts`.

### 5.3 Internal Verification and Evidence Status

Automated tests verify deterministic behavior, multiplier composition, additive totals, non-negative sanitized inputs, scenario finiteness, bypass-probability consistency, and optimizer determinism. `npm run replicate` regenerates the built-in scenario table and full JSON traces. These checks establish computational consistency, not empirical validity. In model v1.2 the built-in scenario differentials range from 18.1% to 1074.7%, demonstrating that relative outputs are highly sensitive to scenario inputs and assumptions. No primary organizational data have been used to validate the magnitude or direction of the total cost differential.

---

## 6. Discussion

### 6.1 The Renegotiation Paradox

Beuve et al. (2021) identify an association between contractual rigidity and renegotiation. This creates a candidate **renegotiation tension**: controls adopted partly for political or accountability protection may be associated with later adaptation of the contract. The paper does not identify the effects of every procurement procedure, and ProcuraCost's additional opportunity-cost components remain assumptions.

### 6.2 When Are Rigid Procedures Justified?

We do not argue that rigid procedures are never appropriate. The 2×2 itself helps bound the claim: in Indirect+Downstream (transactional, low-leverage) cells the gap is smallest; rigid steps may be close to costless or even net positive for auditability. Rigid procedures may be justified when:
- The procurement sits in a low-leverage 2×2 quadrant (Indirect+Downstream) and the procedure has been optimized over time
- Political accountability demands visible procedural equality (public sector, regulated industries)
- Supplier market is deep and highly competitive, minimizing opportunity cost
- The buying organization lacks the procurement sophistication to exercise discretion well

The policy/procedure framework does not argue for procedural anarchy—it argues for conscious, contextual procedure selection within a stable policy framework, informed by where the action sits in the 2×2.

### 6.3 Implementation Challenges

The shift from procedure-compliance to policy-compliance requires organizational investment in three areas:

1. **Procurement capability:** buyers must have the judgment, market knowledge, and negotiation skills to exercise discretion productively
2. **Governance frameworks:** clear policy documentation must precede procedural flexibility; otherwise "flexible" becomes "arbitrary"
3. **Cultural change:** audit functions and management must reward outcomes, not just compliance—a significant behavioral change in organizations conditioned to procedural accountability

### 6.4 Enforcement-Only Responses: Theoretical Risks

Strengthening enforcement may be appropriate when bypass reflects fraud, conflicts of interest, or weak control. The concern examined here is narrower: enforcement-only responses can have unintended effects when the prescribed path does not fit operational conditions.

Lipsky (1980) motivates the possibility that frontline workers adapt formal rules under resource and task constraints. Vaughan (1996) shows how normalized deviations can become hidden organizational risk, although her setting is not procurement. Holmström and Milgrom (1991) provide a formal mechanism through which strong incentives on measurable tasks can draw effort away from less measurable tasks. Goodhart (1975) and Strathern (1997) motivate caution when a performance measure becomes an organizational target. Scott (1998) highlights the limits of centralized schemes in representing local knowledge, while Norman (1988) motivates treating recurring workarounds as a diagnostic signal rather than automatically assigning user blame.

Together, these literatures generate testable procurement hypotheses; they do not establish that stricter enforcement generally fails. The relevant empirical questions are when workarounds reflect path mismatch, when they reflect misconduct or capability gaps, and which combination of controls, discretion, and process redesign improves outcomes.

### 6.5 Technology as Potential Control Infrastructure

Digital systems can change how procurement controls are implemented. Configured ERP workflows can enforce authorization thresholds; analytics can flag selected anomalies; and audit logs can improve traceability. Their coverage, data quality, configurability, security, and actual organizational use vary, so these capabilities do not automatically replace statutory procedures, competition requirements, human review, or professional judgment.

The field model therefore treats technology as a potential control infrastructure, not as proof that sequential procedures are obsolete. A central validation question is which controls can be automated reliably, which procedural gates remain necessary, and whether technology reduces total effort or merely adds another layer of work.

Polish public procurement law (*Prawo Zamówień Publicznych*, PZP) provides multiple statutory procedures subject to thresholds and specific legal conditions. This plurality is compatible with the policy/procedure distinction, but the model does not determine which procedure is lawful in a given case. Legal eligibility must be assessed separately.

---

## 7. Conclusions and Policy Implications

Procurement procedures are useful—they encode institutional learning about how to execute purchases well. The pathology is not procedures themselves but their elevation to the status of policy: treating one method of procurement as if it were the purpose of procurement.

Our model demonstrates how this proposed pathology can be translated into explicit, testable cost components and how assumed effects vary across the 2×2. It does not yet establish the realized magnitude of those costs. The dominant modeled drivers—foregone TCO opportunity and deployment delay—are candidate constructs for empirical measurement, not validated findings.

The practical implication is an agenda rather than a demonstrated prescription: organizations can inventory which requirements are policy, law, control, or local procedure; measure the outcomes of available paths; and test whether contextual route selection improves performance without weakening accountability. ProcuraCost is intended to structure that measurement, not to establish the answer in advance.

### 7.2 Limitations and Scope

The quantitative model has one direct empirical anchor for the rigidity-to-renegotiation relationship (Beuve et al. 2021). Szucs (2024) is countervailing evidence on the risks of high discretion and is not encoded as a rigidity penalty in model v1.2. TCO opportunity, bypass behavior, technology effects, process templates, daily cost of inaction, and all 2×2 multipliers are assumptions or user inputs. The TCO component is capped at 30% of contract value to prevent mechanically implausible long-horizon outputs, but the cap itself requires calibration. No primary organizational data have been collected; all reported gaps are model outputs. Reproducibility of a simulation is not validation of its assumptions.

---

## 8. Reproducibility, Propositions, and Open Artifacts

All model-output claims in this paper are produced by deterministic, versioned functions in the public implementation. This statement concerns computational reproducibility, not empirical validity.

### 8.1 Core Model Implementation (v1.2)
- `lib/calculations.ts` and `lib/process-templates.ts` contain the executable model.
- `getDimensionMultipliers(spendType, processPhase)` produces the exact multiplier vector applied to every cost component.
- `deriveRigidDays`, `deriveFlexibleDays`, and `deriveStaffCost` implement the per-step 2×2 calendar and effort adjustments (1.22 boosts, 0.82 compression, executive 1.85× upstream, etc.).
- Full closed-form specification, call graph, and per-step rules: `docs/research/model_specification_draft.md`.
- Parameter provenance and evidence gaps: `docs/MODEL_PARAMETERS.md`.

### 8.2 Researcher Exports and Traceability
From any result screen the user can export:
- JSON payload containing the full input vector (incl. chosen quadrant), effective multipliers, derived days, role-level staff costs, active and inactive cost components, both bypass probabilities, intermediate probabilities/rates, and source or assumption annotations.
- Human-readable Markdown table.
- CSV of multipliers and breakdown.

`npm run replicate` regenerates full JSON traces and Markdown/CSV summaries in `replication/outputs/`. Reported model outputs should be taken from these generated artifacts rather than transcribed manually.

### 8.3 Testable Propositions (Grounded in the 2×2 Implementation)
The four core propositions (P1–P4) that follow directly from the 2×2 measurement model are introduced in section 3.8 above, immediately after the operationalization of the cost functions. The full set of seven propositions, with detailed justification, operationalization steps, expected magnitudes, and data-source mapping (survey modules vs. archival), is maintained in `docs/research/testable_propositions_v1.md`. This separation keeps the main narrative focused while making the theoretical yield of the model explicit and citable.

### 8.4 Supporting Instruments
- Survey crosswalk: `docs/research/survey_crosswalk.md`
- Interview protocol (45–60 min) and pilot case study template: `docs/research/interview_protocol_v1.md`, `docs/research/pilot_case_study_protocol.md`
- Supervisor / co-author pitch: `docs/research/supervisor_pitch.md`
- Potential pilots template: `docs/research/potential_pilots_template.md`

Detailed execution plan and Kanban (model freeze, instruments, replication, pilots, Paper 2) live in `docs/RESEARCH_PAPER_ACTION_PLAN.md` and `docs/RESEARCH_PAPER_KANBAN.md`. The infrastructure is designed to support both this paper and the follow-on empirical validation.

The approved Paper 2 design uses within-organization matched pairs of real procurement events. Model-generated counterfactuals remain diagnostic sensitivity scenarios and are not treated as observed outcomes or effect estimates.

The primary exposure for Paper 2 is a continuous event-level index coded from prescribed gates, approvals, minimum waits, path flexibility, documentation burden, and constraint sources. It is measured independently of ProcuraCost's assumed rigidity constants; a binary rigid/flexible label is descriptive only.

The primary index uses equal weights across preregistered normalized components and reports every component separately. Alternative learned or expert weights are sensitivity analyses only and cannot be optimized against outcomes. The versioned codebook is `docs/research/observed_rigidity_codebook.md`.

The primary Paper 2 outcome is timestamp-derived procurement cycle time. Internal effort, renegotiation, commercial/TCO, bypass, compliance/audit, and supplier performance are secondary outcomes. Aggregate ProcuraCost PLN remains exploratory because a model-derived composite cannot serve as independent validation of the same model.

The primary clock starts when the procurement need and required budget are formally authorized and stops at the first binding external commitment to the supplier. Pre-authorization and commitment-to-first-use durations are secondary. Raw timestamp and provenance requirements are defined in `docs/research/procurement_cycle_outcome_codebook.md`.

Primary cycle time includes all elapsed calendar time and subtracts no pauses. Pause intervals and causes are retained for decomposition; external-hold-adjusted net time is a preregistered secondary analysis only.

Confirmatory cycle-time analysis requires exact auditable start and end timestamps for both events in a pair. Auditable date intervals are retained for interval-censored secondary analysis, respondent recall is secondary only, and model-based point imputation is prohibited.

The primary estimand is the percentage difference in elapsed cycle time associated with a 0.10 increase in the observed rigidity index within matched pairs, estimated on log cycle time. The pilot reports pair-level differences and ratios descriptively; inferential claims require a separately powered confirmatory sample and frozen analysis plan.

The first pilot is limited to instrument development and feasibility: evidence yield, match eligibility, coding reliability, missingness, burden, and variance for power planning. It cannot supply a substantive effect estimate or empirical validation claim for either paper.

Pilot-development events are permanently excluded from the confirmatory primary analysis. Confirmatory collection begins only after codebooks, matching rules, schema, statistical analysis plan, and sample-size rationale are frozen and preregistered.

Confirmatory recruitment also excludes organizations used for pilot instrument development, providing an organization-level holdout. Any later analysis involving pilot organizations is labeled exploratory or transportability analysis and cannot contribute to the confirmatory primary estimate.

The first confirmatory study targets strategic private-sector procurement events in Poland governed by internal corporate rules and outside PZP for the focal event. Direct and Indirect Upstream events are eligible. Public/PZP, Downstream, concession, and cross-country observations are reserved for separate replication or transportability studies.

Within each confirmatory organization, the sampling frame contains all qualifying events from a frozen archival window extracted by a versioned query. Expert-nominated success or failure cases are excluded from primary selection; eligibility, matching, and every exclusion are outcome-blind and reported in a selection-flow table.

The archival frame uses one study-level cutoff and the preceding 24 calendar months, with membership determined by binding-commitment date. Windows cannot be extended for organizations with too few cases; events still open at cutoff are counted and reported as a completed-event selection diagnostic.

Pairs are created by a versioned, outcome-blind algorithm: exact or coarsened-exact restrictions within organization, spend type, and category family, followed by nearest-neighbor matching on frozen pre-outcome covariates. Experts may reject an impossible pair with a coded reason but cannot manually substitute another event.

Pairs must also exceed a preregistered minimum difference in the observed rigidity index. The provisional threshold is 0.20; its final value is frozen from outcome-blind pilot reliability and overlap diagnostics and cannot be tuned against cycle time.

Primary matching is without replacement: each event may appear in at most one pair. Unmatched events remain visible in the selection flow; with-replacement matching is sensitivity-only.

Candidate edges remain confined to their exact/coarsened strata, but the assignment is solved once across all disjoint edge sets. The algorithm orients candidate edges from higher to lower ORI and freezes balance denominators from the complete eligible pre-match pool. It then maximizes the number of no-replacement pairs subject to all global balance constraints and minimizes total covariate distance among maximum-cardinality feasible solutions. Exact ties use a deterministic hashed-ID rule; greedy record-order matching is not used.

Candidate pairs must first pass mandatory calipers. Provisional limits are an absolute natural-log value difference no greater than 0.50; no more than one scale point for complexity, supply risk, or strategic importance; the same or adjacent technology environment; and binding-commitment dates no more than 12 calendar months apart. Final values are frozen from outcome-blind pilot overlap, edge-yield, and balance diagnostics before confirmatory recruitment.

One final eligible pair is sufficient for an organization to enter the primary analysis. Every additional pair produced by the frozen no-replacement algorithm is retained, with uncertainty accounting for dependence within organizations. Power planning prioritizes the number of independent organizations; requiring three pairs per organization would shift the sample toward unusually large or mature procurement functions.

Before outcome unblinding, the complete matched sample must achieve an absolute standardized mean difference no greater than 0.10 for every frozen pre-outcome matching covariate, with categorical levels evaluated as preregistered indicators. The solver enforces this global design constraint; it is not permission to remove individual organizations selectively. If no feasible solution reaches the preregistered powered sample-size floor, the study does not report a primary effect.

The confirmatory organization-count and pair-count floors are derived through prospective simulation of the frozen primary estimator, including unequal pairs per organization, ORI contrast, log-cycle-time variance, within-organization dependence, Tier A evidence loss, matching yield, missingness, and attrition. Pilot data inform nuisance-parameter ranges and feasibility only; the simulated effect is a separately justified minimum substantively important effect, not a pilot estimate. Simulation code and assumptions are frozen before confirmatory recruitment.

The minimum substantively important effect for power planning is a 10% cycle-time difference per 0.10 higher ORI, represented by `beta = ln(1.10) / 0.10` in the log-time model. This corresponds to a 21% difference across the provisional minimum pair contrast of 0.20 ORI. It is a prospective design threshold, not an empirical estimate or a ProcuraCost model output.

The confirmatory design requires 90% prospective power for that effect under the preregistered conservative nuisance-parameter scenario. The primary test is two-sided with `alpha = 0.05`; the theoretical expectation of a positive association does not suppress evidence in the opposite direction.

The primary estimator is ordinary least squares on log cycle time with matched-pair fixed effects and continuous ORI. Its variance uses organization-clustered bias-reduced `CR2` with Satterthwaite degrees of freedom. Organization-level wild cluster bootstrap and multilevel models are preregistered sensitivity analyses and cannot replace the primary result based on significance or direction.

The primary outcome regression adds no matching covariates beyond pair fixed effects and continuous ORI; the frozen design and global balance gate provide the primary confounding control. A fully prespecified model adding all non-collinear matching covariates that vary within pairs is sensitivity-only, with no stepwise or outcome-driven term selection.

Every matched event receives unit weight in the primary OLS estimate, preserving the event-level estimand. Organizations with more eligible no-replacement pairs contribute more point-estimate information, while organization-clustered `CR2` accounts for dependence in uncertainty. Equal-total-organization weighting and leave-one-organization-out estimates are prespecified influence sensitivities and cannot replace the primary result.

Direct and Indirect Upstream events contribute to one common primary ORI coefficient, but every pair must match exactly on spend type. The `ORI × spend_type` interaction and stratum-specific estimates are prespecified heterogeneity analyses. They support separate confirmatory claims only if the relevant stratum independently meets a preregistered power requirement.

The primary model represents ORI linearly on the log-cycle-time scale, preserving the interpretation per 0.10 higher ORI. A prespecified restricted cubic spline with three exposure-based knots tests nonlinearity only within observed support. Knot locations are frozen before outcome unblinding and cannot be changed using model fit or significance.

If either event in a frozen pair later fails a preregistered Tier A endpoint or outcome-validity check, the entire pair is excluded without imputation, rematching, or a reserve partner. The study reports this attrition and reruns the balance and powered-sample checks on surviving frozen pairs. Failure of either gate prevents a primary effect report.

Every primary-analysis ORI requires all six frozen components. Missing components cannot be imputed, prorated, averaged away, or compensated by renormalizing weights; the event and complete pair are excluded. A codebook-defined `not_applicable` category counts as observed only when it has a prespecified trigger and score, and it is reported separately from missingness.

Two trained coders independently score every confirmatory event while blinded to outcomes, matched-pair membership, and each other's values. Both raw component vectors and evidence references are locked and retained. Inter-rater reliability is calculated before any resolution, rather than from a subset or adjudicated scores.

A third trained adjudicator independently applies the frozen rubric to every disputed component without seeing outcomes, pair membership, coder identities, or their scores. The adjudicated rubric value becomes final, while agreed components keep the common value. Matching uses the completed final ORI; the two original records and every adjudication remain auditable and are never averaged or overwritten.

Before matching, the two raw coding records must achieve absolute-agreement single-measure `ICC(A,1) >= 0.80` for aggregate ORI and reliability `>= 0.70` for each component, using weighted kappa for ordinal rubrics and `ICC(A,1)` for continuous rubrics. Metrics use all confirmatory events and include 95% confidence intervals. A reliable aggregate cannot conceal a component that fails its threshold.

A first confirmatory reliability failure permits one outcome-blind full recoding by a new coder pair under the unchanged frozen codebook. A second failure ends primary matching and effect analysis. Revising the rubric creates a new instrument version, converts the current organizations to development use, and requires a new organization-level confirmatory holdout.

Every ORI component must link to an auditable artifact or system trace that was contemporaneous with and applicable to the event, with source provenance and effective dates retained. Interviews may identify or explain records but cannot alone determine a primary score. Interview-only support is missing evidence and excludes the event and complete pair.

Baseline ORI is fixed at the exact formal authorization of need and budget, the same Tier A timestamp that starts primary cycle time. It uses constraints effective at that moment. Later rule changes, exceptions, failures, escalations, or adaptations are separately timestamped process descriptors and never rewrite the primary exposure.

`ORI_EXCEPTION` measures only the exception route available ex ante, including authority, evidence, approvals, scope, and formal usability. Actual exception use, bypass, noncompliance, escalation, or work-around is a post-start mechanism or secondary outcome. It cannot enter ORI, matching, or primary adjustment.

The first confirmatory study treats these post-start variables as descriptive or associational mechanisms. It reports timing, frequencies, pair contrasts, and associations but does not claim causal mediation or estimate natural direct and indirect effects, which would require unsupported assumptions about post-treatment confounding.

Observed cycle time supplies the study's only confirmatory test at two-sided `alpha = 0.05`. Every secondary outcome, subgroup estimate, mechanism analysis, and sensitivity model remains exploratory. The paper reports the complete prespecified set with estimates and 95% intervals, but does not assign significance labels or promote favorable secondary findings to the primary conclusion.

For confidential Paper 2 data, the public package contains frozen code and methods, solver configuration, a schema-identical synthetic dataset, disclosure-controlled aggregate outputs, and keyed source-manifest digests. Raw artifacts, pseudonym keys, and restricted event-level data remain in a logged controlled environment. An independent auditor reruns the full pipeline there and publishes a signed report tied to code, configuration, manifest, and output hashes; this verifies computation and provenance, not causal validity.

The complete confirmatory protocol is deposited in a public immutable timestamped registry before the first confirmatory organization is recruited and before any confirmatory data extraction. The registration identifies immutable hashes for the SAP, codebooks, solver, power analysis, schema, and code. The original is never overwritten; every change is an additive amendment documenting rationale, data availability, blinding, and analytical impact.

Confirmatory organizations are recruited in preregistered complete batches until both the powered minimum number of independent organizations and the powered minimum number of balance-feasible pairs are met. The terminal batch is completed in full, all eligible organizations remain, and only exposure and pre-outcome fields inform the stopping check. If either floor is unmet at the frozen maximum organization/time/resource cap, the study reports feasibility but no primary test.

The organization sampling frame is preregistered and hashed, stratified at minimum by sector and organization size, and randomized within strata using a registered seed. Every invitation, refusal, nonresponse, and exclusion is logged. Replacement follows the next frozen entry in the same stratum; researcher access, known rigidity, or expected outcomes cannot alter invitation order.

Participants, refusals, and nonrespondents are compared on frame variables available for every invitee, at minimum sector, organization size, and region, using full recruitment counts and standardized differences. A preregistered participation model supports an inverse-probability-weighted sensitivity analysis. The primary event-level estimate remains unweighted and cannot be replaced by the nonresponse sensitivity after results are known.

The secondary `net_cycle_days` measure subtracts only the union of exact auditable intervals for an unrelated binding legal/regulatory suspension, documented force majeure, or independently verified shared critical-infrastructure outage outside organization and supplier control. Internal, supplier, negotiation, information, market, logistics, mandatory-wait, own-system, disputed, and unknown delays remain included. Primary elapsed time always includes every pause.

Cycle duration is calculated from full timestamps as elapsed seconds divided by 86,400. Every strictly positive same-day duration remains a fractional day in analysis and log transformation; rounding is display-only. Zero or negative durations are invalid and remove the complete pair rather than being clamped to one day.

For public procurement, Szucs (2024) shows that discretion can increase prices and favor less productive, politically connected suppliers. This is a central boundary condition: any field-like design requires auditable competition, conflict-of-interest controls, and scrutiny. Flexibility without enforceable policy boundaries is not the model proposed here.

**Reproducibility Statement**

Model-output claims are produced by deterministic functions in the open implementation (model v1.2). The calculation engine resides in `lib/calculations.ts` and `lib/process-templates.ts`; tests are in `tests/`. Researcher exports include inputs, context, multipliers, role-level staff costs, intermediate rates/probabilities, both bypass probabilities, and the complete cost breakdown. `npm run replicate` regenerates the checked-in scenario artifacts. These materials permit computational reproduction of model outputs; they do not establish that the assumptions are empirically correct.

---

## References

Beuve, J., Moszoro, M., & Saussier, S. (2021). *Contractual Rigidity and Political Contestability: Revisiting Public Contract Renegotiations*. NBER Working Paper 28491. National Bureau of Economic Research.

Goodhart, C. A. E. (1975). Problems of monetary management: The UK experience. *Papers in Monetary Economics*, 1. Reserve Bank of Australia. [Popularized as "Goodhart's Law" by Strathern 1997.]

Holmström, B., & Milgrom, P. (1991). Multitask principal-agent analyses: Incentive contracts, asset ownership, and job design. *Journal of Law, Economics, & Organization*, 7, 24–52.

DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited: Institutional isomorphism and collective rationality in organizational fields. *American Sociological Review*, 48(2), 147–160.

Kelman, S. (1990). *Procurement and Public Management: The Fear of Discretion and the Quality of Government Performance*. AEI Press.

Lipsky, M. (1980). *Street-Level Bureaucracy: Dilemmas of the Individual in Public Services*. Russell Sage Foundation.

Norman, D. A. (1988). *The Design of Everyday Things*. Basic Books.

OECD. (2023). *Public Procurement Performance*. OECD Publishing, Paris. https://doi.org/10.1787/0dde73f4-en

Scott, J. C. (1998). *Seeing Like a State: How Certain Schemes to Improve the Human Condition Have Failed*. Yale University Press.

Strathern, M. (1997). 'Improving ratings': Audit in the British University system. *European Review*, 5(3), 305–321.

Szucs, F. (2024). Discretion and Favoritism in Public Procurement. *Journal of the European Economic Association*, 22(1), 117–160. https://doi.org/10.1093/jeea/jvad017

Vaughan, D. (1996). *The Challenger Launch Decision: Risky Technology, Culture, and Deviance at NASA*. University of Chicago Press.

World Bank. (2021). *Improving Public Procurement Outcomes: Review of Tools and the State of the Evidence Base*. Policy Research Paper 9690. World Bank Group.

---

*Draft status: methodological working draft under evidence audit (June 2026). Model v1.2 corrects the direction of the Szucs (2024) evidence, removes the unsupported rigidity price/productivity penalties, caps TCO opportunity, adds tests and calculation traces, and distinguishes illustrative archetypes from empirical cases. External review, primary-data collection, and empirical validation remain pending.*
*Contact: [pawel@mamcarz.com]*
