# Tunnel or Field: Policy versus Procedure as the Hidden Architecture of Procurement Governance

**Paweł Mamcarz**
Uczelnia Łazarskiego (Lazarski University), Warsaw

**Target journal:** *Journal of Public Procurement*
**Article type:** Conceptual and formal (theory-building)
**Cycle position:** Article 1 of a thematically-linked three-article doctoral cycle (Uczelnia Łazarskiego / Lazarski University, Warsaw; cross-disciplinary in *ekonomia i finanse* + *nauki o polityce i administracji*; art. 187 ust. 3 PSWiN). This article is the cycle's **conceptual and formal foundation**: it **locks the canonical notation** (the policy/procedure decomposition, the boundary set ∂Φ, the Tunnel-vs-Field vocabulary, and the seven-dimension cost differential ΔC_total) and develops the abstract enforcement-fallacy theory, both of which the two companion articles reuse without redefinition. It deliberately does **not** itself perform the economic *quantification* of ΔC_total: the closed-form specification of each dimension, the parameter-grade taxonomy, and the sensitivity/recompute analysis are the work of the cycle's economics anchor (Mamcarz, in preparation-b, which anchors *ekonomia i finanse*); nor does it perform the empirical *operationalization* of the governance pathology, which is the work of the cycle's public-administration anchor (Mamcarz, in preparation-c, which anchors *nauki o polityce i administracji*). The role division is stated this way throughout so that no two articles in the cycle do the same disciplinary work twice.

---

## Abstract

Public procurement governance is widely theorized as a contest between rules and discretion. This article argues that the more consequential distinction is prior and structural: the difference between *policy* (the binding boundary set that any award must satisfy) and *procedure* (one ordered workflow that happens to cross that boundary). Drawing on organization theory, public administration, and the economics of contracting, the article advances a formal decomposition in which policy is a constraint set P = {r₁, …, rₙ} bounding a region of admissible action, while a procedure A = (a₁, …, aₖ) is merely one member of a family {A₁, …, Aₘ} of policy-satisfying paths. The central claim is that contracting authorities, acutely so under Poland's *Prawo zamówień publicznych* (PZP), systematically *conflate* the two, treating a single admitted procedure as if it were the policy. We model this conflation through a Tunnel-vs-Field metaphor and derive two propositions: that the incentive to bypass controls vanishes as the recognized family of admissible procedures grows (P1), and that binary checkpoint compliance forces an actor under pressure into a destroy-value-or-exit dilemma with no compliant-adaptation option (P2). We then explain why the rigid "tunnel" is nonetheless selected (accountability asymmetry, institutional isomorphism, and a documented fear of discretion) and show, through a synthesis of five theoretical traditions, why "hardening the tunnel" is analytically self-defeating (the *enforcement fallacy*). Importing the finding that discretion, not formality, raises prices and degrades selection makes the framework symmetric and contingent rather than anti-procedure. The closed-form economic *quantification* of ΔC_total and the empirical *operationalization* of the governance pathology under PZP are the tasks of the cycle's two companion articles; the present article supplies their shared conceptual and formal foundation and the abstract theory they extend. We close with implications for PZP reform: require competitive validation without mandating a single rigid format. All quantitative figures referenced are model estimates under documented assumptions, not measured facts.

**Keywords:** public procurement; policy versus procedure; procurement governance; compliance theater; institutional isomorphism; street-level bureaucracy; discretion; PZP; opportunity cost; enforcement

---

## 1. Introduction

### 1.1 The conflation that hides in plain sight

A procurement officer who is asked "what is your procurement policy?" will, with striking regularity, answer by describing a procedure. They will name a tender type, recite a sequence of steps, point to a template, or cite the article of a statute under which a given workflow is run. The question asked about *constraints*; the answer described a *path*. This substitution is so routine that it passes unnoticed, yet it encodes a category error with measurable economic and governance consequences. It is the subject of this article.

The distinction the substitution erases is the distinction between **policy** and **procedure**. A procurement *policy* is a set of binding constraints: who is authorized to commit funds, whether and how competition must be sought, what ethical limits apply, and what must be documented. A procurement *procedure* is one ordered method for arriving at an award that satisfies those constraints. The constraints define a *space* of permissible action; the procedure traces *one route* through it. There are, for almost any non-trivial purchase, many routes that satisfy the same constraints. Treating one of them as if it *were* the constraint set collapses a space of options into a single locked path (Chartered Institute of Procurement & Supply [CIPS], 2024).

This article gives that collapse a name, the **policy/procedure conflation**, formalizes it, and traces its consequences across two registers that are usually studied apart. In the register of *economics*, the conflation manifests as a measurable opportunity-cost gap: the locked path foregoes value that a policy-satisfying alternative would have captured. In the register of *public administration*, it manifests as a governance pathology: *compliance theater*, in which conformance to the procedure becomes a personal risk shield that displaces the value-seeking judgment the procurement function exists to exercise. The argument of the doctoral cycle of which this is the first article is that these are not two problems but **two readings of one conflation**. This article supplies the conceptual and formal architecture; the companion articles supply, respectively, the computational stress-test and closed-form economic quantification of the cost gap (Mamcarz, in preparation-b) and the street-level operationalization of the pathology under PZP (Mamcarz, in preparation-c).

### 1.2 A motivating vignette (illustrative)

Consider two procurement officers in two otherwise identical contracting authorities, each tasked with acquiring a fleet of vehicles of comparable value and specification. (This vignette is *illustrative* and stylized; it is presented to fix intuition, not as evidence.)

Officer A understands her task as the execution of a procedure. The organization runs fleet acquisitions through an open tender with a fixed sequence of mandatory steps and waiting periods; for Officer A, *that sequence is the policy*. Her professional competence is measured by fidelity to the sequence. When, midway through, a superior technical option emerges that the locked specification cannot accommodate, Officer A has two moves available: force the new reality into the existing procedure (re-scoping awkwardly, or proceeding with the inferior locked specification), or abandon the procedure and improvise, an act her organization will read as non-compliance. She chooses fidelity. The fleet is acquired on time and "by the book," at a higher whole-life cost than necessary. No audit will ever record the loss, because the loss is counterfactual.

Officer B understands her task as navigation within a boundary. She reads the same statute and the same internal manual as a *constraint set*: the award must be authorized at the right level, must be exposed to genuine competition, must respect ethical limits, and must be documented. Within those constraints she treats the open tender as one admissible method among several. When the superior technical option emerges, she has a third move unavailable to Officer A: adapt the method while remaining inside the boundary, for instance by structuring the competition so that the better option can be evaluated on equal terms. The fleet is acquired at lower whole-life cost, with competition fully preserved, and with documentation that an auditor can follow.

The two officers did not differ in diligence, ethics, or knowledge of the rules. They differed in what they took the rules *to be*: a path, or a boundary. The private-sector literature offers analogous motivating illustrations: Ryanair's fleet-acquisition discipline, Swiss Casinos' adoption of lean-agile sourcing, Air France-KLM Martinair's cargo procurement, and Zara/Inditex's responsive sourcing model are routinely cited as cases where method flexibility within commercial discipline outperformed rigid sequential buying (EY Switzerland, 2024; Tradogram, 2024; *IJRAR*, 2019). These cases are **illustrative motivation only**; they are not evidence about public-procurement law, and nothing in this article's claims rests on them.

### 1.3 Why this matters under PZP

The conflation is universal, but it is acute in statutory public procurement, and most acute where the statute is dense, recent, and enforced through audit. Poland's *Prawo zamówień publicznych* (PZP), the consolidated Act of 11 September 2019 (t.j. Dz.U. 2026 poz. 793), transposing Directive 2014/24/EU, is a paradigmatic case. The Act defines a boundary: authorization thresholds (e.g., the 130 000 PLN exemption under art. 2 ust. 1 pkt 1; EU thresholds set by the President of the Public Procurement Office), competition requirements, ethical and conflict-of-interest constraints, and documentation duties. It also enumerates *procedures*: przetarg nieograniczony (art. 132), przetarg ograniczony (art. 140), dialog konkurencyjny (art. 169), tryb podstawowy (art. 275), and others. The crucial observation is that **the boundary lives in the statute, but the choice to treat one enumerated procedure as the only admissible path is an organizational layering on top of the statute**, not a requirement of it. PZP offers a family of methods; contracting authorities, fearing audit, frequently collapse that family to its most defensible single member.

This article proceeds as follows. Section 2 formalizes policy and procedure and defines the conflation precisely. Section 3 develops the Tunnel-vs-Field model and derives two propositions about bypass and the compliance dilemma. Section 4 explains why the rigid path is selected despite its costs. Section 5 synthesizes five theoretical traditions into a single prediction, the *enforcement fallacy*, that hardening the tunnel must fail. Section 6 imports the economics of discretion to make the framework symmetric and contingent rather than ideologically anti-procedure, and sketches when each model dominates. Section 7 draws implications for procurement governance and PZP reform. Section 8 states the article's limitations, and a Claims-and-Non-Claims box records the honest-framing invariants that bind the entire cycle.

---

## 2. Policy versus procedure: a formal decomposition

### 2.1 Two primitives

We begin by distinguishing the two objects the practitioner conflates.

> **Definition 1 (Policy as boundary).** A procurement *policy* is a finite set of binding rules
> **P = {r₁, …, rₙ}**
> specifying the authorization thresholds, competitive requirements, ethical constraints, and documentation standards that any procurement action must satisfy. Each rule rⱼ partitions the action space into permitted and impermissible regions. Let Φ ⊂ ℝⁿ denote the *policy-permissible region* (the intersection of all per-rule permitted regions) and let **∂Φ** denote its boundary, the locus at which one or more constraints become binding. The boundary set is, canonically,
> **∂Φ = {authorization, competition, ethics, documentation}.**

Φ is a *region*, not a point. Any action whose terminal state lies inside Φ satisfies the policy. The four elements of ∂Φ are the dimensions along which the region is bounded: an action may fail by exceeding an authorization limit, by foreclosing competition, by breaching an ethical limit, or by leaving an evidentiary gap. Compliance is here a property of *position relative to the boundary*, evaluable at every point of action: a continuous notion, to which we return in Section 3.

> **Definition 2 (Procedure as path; admissibility; the valid family).** A procurement *procedure* is a specific *ordered* sequence of actions
> **A = (a₁, …, aₖ)**
> constituting one sufficient method for reaching an award. A procedure is *admissible* (policy-satisfying) iff the trajectory it traces remains within Φ and its terminal state satisfies every rule in P. For a given policy P there generally exists a *family of admissible procedures*
> **{A₁, …, Aₘ}, m ≥ 1,**
> any member of which discharges the policy. The family is the procurement function's true option set.

The relationship between the two primitives is asymmetric and many-to-one: a single policy P admits many procedures, but a procedure does not, by itself, define a policy; it is silent about the *other* admissible routes and about the constraints that make it admissible. This asymmetry is the seed of the conflation.

### 2.2 The conflation, formally

> **Definition 3 (The policy/procedure conflation).** The *conflation* is the operator that, fixing on one admissible procedure Aᵢ ∈ {A₁, …, Aₘ}, treats Aᵢ as if it were the policy itself:
> **κ : P ↦ Aᵢ, inducing {A₁, …, Aₘ} ↦ {Aᵢ}.**
> Under the conflation, the recognized option set collapses from the full admissible family to its singleton {Aᵢ}; conformance to Aᵢ is taken to constitute compliance with P, and deviation from Aᵢ is taken to constitute violation of P, even when the deviating action remains inside Φ.

Two corollaries follow immediately and are worth stating because they structure the rest of the article.

**Corollary 2.1 (Lost optionality).** Because {Aᵢ} ⊆ {A₁, …, Aₘ}, the value attainable under the conflated regime is weakly dominated by the value attainable under the full family: for any objective V that the organization seeks to maximize over admissible procedures,
max_{A ∈ {Aᵢ}} V(A) ≤ max_{A ∈ {A₁,…,Aₘ}} V(A),
with strict inequality whenever the value-maximizing admissible procedure differs from Aᵢ. The gap is the *opportunity cost of the conflation*. It is, by construction, counterfactual and therefore invisible to any audit that examines only what was done.

**Corollary 2.2 (Misclassified compliance).** Under the conflation, the set of actions classified as compliant ({Aᵢ}) is strictly smaller than the set of policy-satisfying actions ({A₁, …, Aₘ}). Hence there exist actions that are *policy-satisfying but procedure-violating*: admissible moves the regime nonetheless treats as breaches. The existence of this misclassified region is what later generates the bypass phenomenon (Section 3) and the enforcement fallacy (Section 5).

### 2.3 The economic shadow of the conflation

Corollary 2.1 says the conflation has a cost; it does not say how large, or of what kind. The doctoral cycle decomposes that cost into **seven dimensions**, comparing a rigid path R (a conflated singleton procedure) with a policy-flexible path F (navigation within the full family). For each dimension i the differential is ΔCᵢ = cost(R) − cost(F), and the total is

> **ΔC_total = ΔC_time + ΔC_admin + ΔC_opp + ΔC_fav + ΔC_reneg + ΔC_TCO + ΔC_bypass = Σᵢ ΔCᵢ.**

The seven dimensions, with their canonical names and the empirical literatures that ground their *direction* (the closed-form magnitude of each is the task of the cycle's economics anchor, Mamcarz, in preparation-b, not of this conceptual paper), are:

1. **Time** (C_time): procurement-staff time consumed by executing the path. Procedure-cost benchmarks place the average above-threshold EU procedure at roughly €28 000 (about three-quarters of it borne supplier-side) and at some 38 calendar days, under 1.3% of contract value (European Commission, 2011), a *total* procedure cost, not a rigidity premium.
2. **Admin** (C_admin): fixed compliance-infrastructure overhead that the rigid path requires and the flexible path may avoid.
3. **Opportunity** (C_opp): the cost of delayed deployment, charged to *both* paths over their own durations (there is no zero-friction baseline).
4. **Favoritism / selection-quality** (C_fav): the expected value lost to *discretion* in selection. This is the dimension that runs *against* the flexible path and makes the framework symmetric; it is grounded in Szucs (2024) and developed in Section 6.
5. **Renegotiation** (C_reneg): expected renegotiation cost associated with contractual rigidity, with a base renegotiation incidence near 22% and a per-standard-deviation rigidity premium in the 7.7–10.5 percentage-point range (Beuve, Moszoro, & Spiller, 2021, 2023). That premium is a 2SLS/IV estimate (rigidity instrumented by political contestability) drawn from a single French car-park concession setting (n ≈ 279) and is a *per-standard-deviation dose*, not a transferable level effect; it grounds the *direction* of this dimension, not a Polish magnitude. The 22% base is independently corroborated by the ~30% all-in (≈41.5% *excluding* telecommunications) renegotiation incidence in Latin-American concessions (Guasch, 2004; observational).
6. **TCO** (C_TCO): foregone total-cost-of-ownership savings, discounted and capped, with the premise that at least half of the savings from lower winning prices can be eroded ex post (Decarolis, 2014). Bajari, Houghton, and Tadelis (2014) document that adaptation costs reach a non-trivial share of contract value (7.5–14%, US Caltrans highway paving), but this grounds only the *premise and direction* of the TCO dimension and **must not be reused as its numerical basis**: the adaptation channel it measures is already absorbed by the renegotiation dimension (dimension 5), so importing the BHT magnitude here would double-count. The cumulative ceiling is therefore anchored conservatively to a practitioner "up to 30% over three years" *best-case* figure (Institute for Supply Management [ISM], n.d.), not to a flat annual rate.
7. **Bypass** (C_bypass): the expected audit/penalty cost of informal circumvention of the locked path, the economic counterpart of the governance phenomenon developed next.

These seven are the cost vocabulary the cycle locks. For the conceptual purposes of this article the essential point is structural, not numerical: the conflation converts a multi-dimensional optimization over the admissible family {A₁, …, Aₘ} into the execution of a single member {Aᵢ}, and ΔC_total is the price of that conversion. We stress, here and throughout, that **every figure cited above is a benchmark imported under explicit external-validity caveats; none is a measured fact about Polish procurement** (see §8 and the Claims box).

---

## 3. The Tunnel-vs-Field model

### 3.1 Two geometries of compliance

The formal decomposition of Section 2 supports a metaphor that makes its consequences legible and that the cycle uses verbatim. The two ways of relating procedure to policy correspond to two geometries of compliance.

In the **tunnel**, the conflation has done its work: the recognized option set is the singleton {Aᵢ}, and the procedure is experienced as a corridor with walls. The human actor is a **step-executor**, advancing from a₁ to a₂ to … to aₖ. Compliance is **binary**: at each checkpoint one is either on the path or off it. There is no lateral movement, because lateral movement is, by Corollary 2.2, misclassified as violation. The defining experiential fact of the tunnel is that *value-seeking adaptation and compliance are in tension*: to adapt is to risk leaving the corridor.

In the **field**, the conflation has been resisted: the recognized option set is the full admissible family, bounded by ∂Φ. The human actor is a **navigator**, moving freely within Φ to maximize value, constrained only by the requirement to stay inside the boundary. Compliance is **continuous**: it is evaluated not at discrete checkpoints but at every point of movement, as the navigator's continuing position relative to ∂Φ. The defining experiential fact of the field is that *value-seeking adaptation and compliance are aligned*: one adapts precisely by finding the highest-value point that remains inside the boundary.

> **Tagline (canonical):** *A tunnel has walls. A field has a horizon.* / *Tunel ma ściany. Pole ma horyzont.*

The walls of the tunnel are the misclassification boundary of Corollary 2.2, internal constructs that forbid admissible moves. The horizon of the field is ∂Φ, the genuine policy boundary, which forbids only impermissible moves. The two are emphatically not the same boundary: the tunnel's walls sit *inside* ∂Φ, foreclosing a region of policy-satisfying action.

### 3.2 Bypass as exiting the tunnel

The misclassified region, actions that are policy-satisfying but procedure-violating, does not vanish because the regime refuses to recognize it. It is precisely where the work of complex, contingent procurement *wants* to go. When task demands push toward that region, the tunnel actor confronts a wall: a move that would discharge the policy is forbidden by the procedure. The actor's response to that wall is the **bypass**: the informal exit from the corridor, the "obejście / wyjście z tunelu."

Bypass is not a failure of individual virtue. It is the predictable behavior of a competent actor for whom the official path cannot accommodate a legitimate need (Lipsky, 1980). The bypass may be benign (an undocumented shortcut that gets the right outcome) or corrosive (an off-contract purchase, a split order to dodge a threshold, a sole-source award dressed in competitive clothing), but in either case it is *invisible to the formal record by design*: its whole purpose is to escape the record. This invisibility is what makes bypass simultaneously an economic cost (the seventh dimension, C_bypass) and a governance pathology (the subject of the cycle's third article).

The two propositions that follow capture the structural logic of the tunnel.

> **Proposition P1 (Bypass-vanishing).** Let m = |{A₁, …, Aₘ}| be the number of policy-admissible procedures the governance regime *recognizes as legitimate*, and let B(m) denote the expected incentive to bypass. Then B is non-increasing in m, and
> **limₘ→∞ B(m) = 0.**

*Argument.* Bypass is, by definition, the use of an unrecognized but policy-satisfying move, an action in the misclassified region of Corollary 2.2. The size of that region is the difference between the full admissible family and the recognized set. As the regime recognizes more admissible procedures (m grows), the misclassified region shrinks; in the limit where every policy-satisfying move is recognized as legitimate (the field), the misclassified region is empty and there is nothing to bypass: the incentive to exit a corridor is zero when there is no corridor, only a boundary one already respects. The contrapositive is the operative warning: *the bypass incentive is maximized exactly when the recognized option set is a tightly enforced singleton*: the conflated tunnel. ∎

> **Proposition P2 (Tunnel dilemma).** Under binary checkpoint compliance with a single admitted procedure Aᵢ, let an actor face a task demand τ that Aᵢ cannot accommodate within feasible time and resources. The actor's choice set contains exactly two elements:
> (i) **force reality into Aᵢ**: proceed on the path, producing procedural conformance and foregone value (*compliance theater*); or
> (ii) **exit Aᵢ**: leave the path to meet τ, producing value and formal non-compliance (*bypass*).
> The probability of (ii) is strictly increasing in the gap between τ and the accommodation capacity of Aᵢ. **No third option of *compliant adaptation* exists**, because under the conflation compliance is defined as identity with Aᵢ.

*Argument.* By Definition 3, under the conflation the compliant set is {Aᵢ}. Any adaptation to meet τ that departs from Aᵢ is, by construction, classified as non-compliant, even if it remains inside Φ. Hence the only compliant response to an Aᵢ-incompatible demand is to not adapt (option i), and the only adaptive response is non-compliant (option ii). The actor trades value against formal compliance along a single dimension; as the unmet demand grows, the value at stake in (i) grows, raising the relative payoff of (ii). ∎

**Corollary 3.1 (Dissolution under the field).** In the field, compliance is continuous and the compliant set is all of Φ. An actor facing τ can therefore choose *compliant adaptation*, the highest-value point in Φ that meets τ, which is simultaneously option (i)'s compliance and option (ii)'s value. The dilemma of P2 dissolves, and by P1 the residual bypass incentive tends to zero. The field does not eliminate the boundary; it eliminates the *false* boundary (the walls) while keeping the *real* one (the horizon).

Propositions P1 and P2 together yield the article's central diagnostic: **a regime that responds to bypass by tightening the tunnel is moving in the direction that P1 identifies as bypass-maximizing.** That counter-intuitive result is the enforcement fallacy, developed in Section 5. But first we must explain why organizations build tunnels at all.

---

## 4. Why the rigid path is selected

If the tunnel is dominated in value terms (Corollary 2.1) and breeds bypass (P1–P2), why is it so reliably chosen? The answer is that the tunnel is selected not because it is *efficient* but because it is *defensible*. Three mechanisms, one about incentives, one about institutions, one about ideology, converge on the same locked path.

### 4.1 Accountability asymmetry

The first mechanism is an asymmetry in how the two kinds of error are punished. A procurement officer can fail in two ways: by following an admissible procedure that produces a poor outcome (a *value* failure), or by deviating from the expected procedure even toward a better outcome (a *process* failure). In an audit-governed environment, these failures are not punished symmetrically. The value failure is diffuse, counterfactual, and rarely attributed to the officer: "we followed the rules and the market moved against us." The process failure is concrete, documentable, and personally attributable: "the officer departed from the prescribed procedure."

This asymmetry inverts the agent's optimization. Faced with the choice between maximizing *organizational value* and minimizing *personal exposure*, the rational officer minimizes exposure by hugging the most defensible procedure, even at known cost to value. The tunnel is the locus of minimum personal exposure: every step is a step someone signed off on. The result is that ΔC_total of Section 2 is, from the individual's standpoint, *someone else's problem*: the organization bears the opportunity cost, the officer bears the audit risk, and the officer optimizes the latter. This is a textbook misalignment of private and social objectives, and it is the micro-foundation of *compliance theater*: behavior optimized for the appearance of compliance because appearance is what is rewarded.

### 4.2 Institutional isomorphism

The second mechanism operates at the level of the organizational field rather than the individual. DiMaggio and Powell (1983) observe that organizations facing uncertainty come to resemble one another not because the shared form is optimal but because conformity confers *legitimacy*. Their three isomorphic pressures map cleanly onto procurement.

*Coercive* isomorphism arises from legal and audit pressure: contracting authorities adopt the procedures their overseers expect to see, and overseers expect to see the procedures other authorities use. *Mimetic* isomorphism arises from uncertainty: when the value-maximizing path is hard to identify, organizations copy the visible practice of peers and of perceived leaders, which is to say they copy a *procedure*, because procedures are what is observable from outside. *Normative* isomorphism arises from professionalization: procurement training, certification, and templates propagate a shared repertoire of "how it is done."

The combined effect is that the singleton {Aᵢ} of Definition 3 is not chosen afresh by each authority; it is *inherited* from the field as the legitimate form. The conflation is thereby reproduced and stabilized at the population level: the procedure becomes the policy not by anyone's decision but by everyone's imitation. This is why the conflation is so resistant to local correction: an individual authority that opened the field would deviate from the legitimated form and pay a legitimacy cost, regardless of the value it captured.

### 4.3 Kelman's fear of discretion

The third mechanism is ideological. Kelman (1990), examining U.S. federal procurement, diagnosed a pervasive *fear of discretion*: a conviction that the way to secure integrity and performance is to *remove* the official's judgment, replacing it with rule-bound process. The fear is not baseless (discretion can be abused, and Section 6 takes this seriously), but the response it motivates is to wall in the official as tightly as possible, which is to build the tunnel.

The fear of discretion supplies the *justification* that accountability asymmetry and isomorphism need. It reframes the tunnel not as a defensive crouch but as a virtue: rigidity *is* integrity; the absence of judgment *is* fairness. Under this framing, ΔC_total is not a cost to be minimized but a price worth paying for the elimination of discretion. The fear of discretion is thus the ideology that converts a defensive, imitative behavior into a normative commitment, and it is the precise belief that Section 6 will show to be, in its strong form, empirically mistaken: it is *discretion*, properly bounded, that competition disciplines, and it is the *un-validated* discretion the fear targets that the boundary ∂Φ already forbids.

Together, the three mechanisms explain the durability of a dominated form. The officer hugs the tunnel to limit exposure; the field reproduces the tunnel as the legitimate form; and the ideology of discretion-fear sanctifies the tunnel as integrity. None of the three requires anyone to believe the tunnel is *efficient*. That is why showing that it is inefficient (the cost computation of the cycle's economics anchor, Mamcarz, in preparation-b) is necessary but not sufficient for reform.

---

## 5. The enforcement fallacy

### 5.1 The intuitive response and why it fails

When bypass is discovered, when audits reveal that officers are exiting the tunnel, the intuitive governance response is to *strengthen enforcement*: add controls, narrow exceptions, increase penalties, multiply checkpoints. Call this strategy "hardening the tunnel." The thesis of this section, which we call the **enforcement fallacy**, is that hardening the tunnel is *analytically self-defeating*: five independent theoretical traditions, each developed for a different domain, each predict that it will *increase* the very pathology it targets. The convergence of five unrelated theories on one prediction is itself the strength of the argument; we do not claim empirical demonstration here (these are deductive and analogical transfers, per §8), but the unanimity is striking.

Proposition P1 already gives the structural reason: bypass incentive rises as the recognized admissible family shrinks, and hardening the tunnel shrinks it further. The five traditions explain *why* this structural fact obtains in human organizations.

### 5.2 Five traditions, one prediction

**Lipsky (1980): street-level bureaucracy.** Lipsky's foundational observation is that discretionary adaptation of rules is not a deviation from frontline work but its *normal condition*. Street-level bureaucrats face demands that no rulebook can fully anticipate, and they cope by adapting rules to cases. When enforcement strips away the sanctioned room for adaptation, the coping does not stop; it goes underground. Harder enforcement therefore does not reduce adaptation; it *drives it out of sight*, converting visible discretion into invisible bypass. In the model's terms, hardening the tunnel does not close the misclassified region; it pushes activity into it while removing the regime's ability to observe that activity.

**Vaughan (1996): normalization of deviance.** Vaughan's study of the *Challenger* disaster shows how prohibited-but-necessary workarounds, once they "work," become quietly normalized: each successful deviation lowers the perceived risk of the next, until the deviant practice is the de facto standard and its accumulated risk is invisible. Applied to procurement, a hardened tunnel that forces bypass for ordinary work *guarantees* that bypass becomes routine, and a routine bypass is a normalized deviance, accreting hidden risk precisely where the controls believe they have eliminated it. The more the tunnel is hardened around tasks that need adaptation, the more bypass is normalized.

**Holmström and Milgrom (1991): multitask agency.** The multitask principal-agent model establishes that when an agent allocates effort across several tasks and the principal strengthens the incentive on *one measurable* task, the agent reallocates effort *away* from the other, less-measurable tasks; and the desirability of incentivizing any one activity *decreases* with the difficulty of measuring the others. Procedural conformance is the measurable task; value creation is the hard-to-measure task. Hardening the tunnel raises the incentive on conformance, which, by the model, crowds out the unmeasured value-seeking the procurement function exists to perform. Enforcement thus does not merely fail to add value; it *subtracts* it, by reallocating attention from the unmeasured to the measured.

**Goodhart (1975) / Strathern (1997): the target-measure collapse.** Goodhart's Law, in Strathern's crisp generalization, holds that when a measure becomes a target it ceases to be a good measure. The compliance rate is the procurement regime's measure of integrity. Make it a target, enforce it hard, and actors optimize the *measure* rather than the *thing measured*: they produce conformance theatrically while the underlying integrity erodes. A hardened tunnel maximizes the compliance rate on paper exactly as it maximizes bypass in practice; the gap between the measured rate and the real integrity is the enforcement fallacy made quantitative.

**Scott (1998): high-modernist legibility.** Scott's account of why grand schemes to improve the human condition fail centers on *métis*, the local, contextual, practitioner knowledge that high-modernist systems cannot encode. A locked procedure is a high-modernist artifact: it imposes a legible, uniform scheme on a domain whose effective practice depends on métis. Hardening the tunnel is hardening the scheme against the very knowledge that makes procurement work, guaranteeing that the knowledge must be applied *outside* the scheme, as bypass. The failure is not incidental; it is structural to schemes that cannot represent local knowledge.

**Norman (1988): design failure, not user failure.** Norman's principle from the design of everyday things is that *systematic* user error indicates a design fault, not a user fault: when everyone bypasses, the lesson is about the system, not the people. This reframes the entire enforcement response. The discovery of widespread bypass is *diagnostic of tunnel design*, and the corrective is to redesign the system toward the field, to widen the recognized admissible family, not to punish the users for the system's misfit. Treating systematic bypass as a discipline problem is, in Norman's terms, a category error that guarantees recurrence.

### 5.3 The synthesis

The five traditions were developed for street-level public services, aerospace risk culture, incentive contracting, monetary and audit measurement, state planning, and product design. They share no common school. Yet on the question "what happens when you harden a procedure that competent actors must adapt to do their work?" they return one answer: enforcement drives adaptation underground (Lipsky), normalizes the resulting deviance (Vaughan), crowds out unmeasured value (Holmström-Milgrom), corrupts the compliance measure (Goodhart-Strathern), suppresses the métis the work needs (Scott), and misreads a design fault as a user fault (Norman). Each predicts that hardening the tunnel *increases* bypass, *decreases* value, or both, which is exactly Proposition P1 read at the level of human behavior.

The enforcement fallacy is therefore not a contingent empirical hypothesis that might or might not hold; it is the *convergent prediction* of every relevant theory, anchored to the structural result P1. The governance implication is sharp and counter-intuitive: the correct response to bypass is not a better tunnel but *a field*: widening the recognized family {A₁, …, Aₘ} so that adaptation can occur inside the boundary rather than outside it. This is the reform direction Section 7 develops. We flag, with care, that the prediction is *analytical and analogical*: it is transferred to procurement by structural analogy from its source domains, and the cycle's empirical program is what would, in principle, test it against data.

A note on ownership within the cycle, to keep the three articles cumulative rather than repetitive. The enforcement fallacy is stated *here* at the abstract, theory level: this article is its home, and the five-tradition synthesis above is not re-derived elsewhere in the cycle. Its empirical *operationalization* under PZP (the street-level mapping of compliance theater onto contracting-authority practice, the forensic measurement of bypass, and the registered-report design that would test it on Polish procurement data) is the explicit task of the cycle's public-administration anchor (Mamcarz, in preparation-c), which *cites* the present article for the abstract result rather than restating it. The cumulative logic is thus: this article supplies the theory; the companion governance article supplies the PZP operationalization.

---

## 6. The symmetric reframe: discretion is the cost

### 6.1 Importing the inconvenient finding

A reader of Sections 2–5 might conclude that the article is an indictment of procedure as such, that rigidity is the villain and freedom the remedy. That reading would be a mistake, and avoiding it is the discipline that separates this framework from advocacy. The corrective is to import a finding that cuts *against* the framework's own intuitive thrust.

Szucs (2024), studying Hungarian public procurement around a 25-million-HUF reform threshold with a regression-discontinuity design augmented by a structural selection-correction, finds that **discretion raises the normalized contract price by roughly 6% (a structural causal estimate; the reduced-form estimate is about 8%, and the raw discontinuity about 9%) and selects contractors who are about 10% less productive.** The structural decomposition attributes about two-thirds of the discontinuity to firm *sorting/selection* rather than to a pure discretion treatment effect, and the design carries a value-manipulation (bunching) caveat. The finding that matters most for our framework is the mechanism's flip side: **competitive tendering averts the favoritism premium.** External validity must be stated plainly: this is a Hungarian-public-procurement estimate; transferring it to a Polish, generic, or private context is a benchmark, not a measurement.

The implication for the Tunnel-vs-Field model is decisive. The cost of procurement pathology is *not* a monotone function of rigidity. Discretion, the very freedom the field grants the navigator, carries its own cost: where it is unbounded by competition, it raises prices and degrades selection. The field is not safe *because* it is free; it is safe only insofar as its boundary ∂Φ genuinely binds the competition constraint. Strip competition from the field and you do not get a navigator maximizing value within the law; you get the favoritism premium Szucs measures.

### 6.2 Why the framework is symmetric, not anti-procedure

This is why the boundary set is defined as **∂Φ = {authorization, competition, ethics, documentation}** and not merely {authorization, documentation}. **Competition is a *policy* constraint, an element of the boundary, not a *procedural* artifact of any particular tender format.** The conflation's deepest error is to bundle the policy requirement of competition with one rigid competitive *format*, so that defending the format feels like defending competition. The symmetric reframe disentangles them: a properly bounded field *requires* competition (because competition is in ∂Φ) while permitting method flexibility (because the format is not in ∂Φ). The reform is therefore *not* "abolish competitive tendering"; it is "require competitive validation without mandating a single rigid format."

Under this reframe the framework is **contingent**, not ideological. The seven-dimension differential ΔC_total can run in either direction depending on context, because two of its dimensions oppose the others. The TCO, opportunity, time, admin, renegotiation, and bypass dimensions tend to penalize the *rigid* path; the favoritism/selection-quality dimension (C_fav, grounded in Szucs) penalizes the *flexible* path wherever discretion is exposed to corruption risk. The net sign of ΔC_total is, in principle, an empirical question about which dimension dominates in a given context.

### 6.3 When each model dominates, and the honest disclosure

The contingency can be sketched qualitatively. The favoritism dimension is largest where corruption risk is high, contract value is high, and the purchase is strategic (in Kraljic's 1983 terms, high-value, high-supply-risk "strategic" items, the Direct × Upstream cell). There, the discipline of competition matters most, and a regime that grants discretion *without* binding competition would pay the favoritism premium. The rigid-penalizing dimensions are largest where deployment delay is costly, whole-life savings are large and time-sensitive, and corruption risk is low (routine, operational, downstream spend). There, the tunnel's delay and foregone-TCO costs dominate and the field is clearly cheaper. So the *direction* of the framework's recommendation should, in principle, flip with context, which is what makes it a theory of governance rather than a slogan.

Here the cycle's most important act of intellectual honesty is required, and this conceptual article states it, at the level of the mandated disclosure only, so that the companion economics article can demonstrate it in full. **The symmetry just described is, in the cycle's implemented cost model, directionally real but numerically inert at the net level.** A real-code recompute of all nine reference scenarios returns ΔC_total *strictly positive in every one* (9 of 9): the flexible path is net-cheaper everywhere, *including* the maximal-stakes public-procurement case (the pzp_eu scenario at maximal corruption-risk weighting and maximal rigidity), which is in fact the *widest* gap as a share of contract value. The favoritism dimension subsidizes the rigid path *per-dimension* in eight of the nine scenarios, so the symmetry is genuinely present dimension-by-dimension, but it never wins at net, because the single rigid-favoring term is structurally bounded: its magnitude is at most CV × 0.06 × κ × |ρ_R − ρ_F| ≲ 4.8% of contract value, whereas the rigid-penalizing TCO term is capped at 30% of value and the opportunity term scales with long rigid day-counts. The full analytic bound, the per-scenario table, and the sensitivity sweep that locate the (empirically implausible) parameter region in which the sign could flip are the work of the companion economics article (Mamcarz, in preparation-b); here it suffices to disclose the verdict. **Symmetry is therefore a *structural possibility* whose net realization is sensitivity-dependent; it must be disclosed as such, and must never be presented as an observed or emergent net finding.**

This disclosure is not a weakness to be hidden; it is the cycle's central methodological commitment. A framework that imported Szucs to *manufacture* a net pro-rigidity result by tuning would be dishonest; a framework that suppressed Szucs to keep a clean anti-rigidity story would be biased. The cycle does neither: it builds the symmetric term, reports that it is currently dominated, and routes the question of when it could dominate to an explicit sensitivity analysis in the companion economics article (Mamcarz, in preparation-b). The governance theory of Sections 3–5 stands on the *per-dimension* and *qualitative* symmetry; it does not depend on a net sign-flip that the model does not, at present, produce.

---

## 7. Discussion: implications for procurement governance and PZP reform

### 7.1 The general governance implication

The framework reframes the central question of procurement governance. The usual question, "how do we make officials follow the rules?", presupposes the conflation: it assumes the rules *are* the procedure and that compliance *is* fidelity to the path. The framework's question is prior: "what is the boundary, and does our procedure recognize the full family of admissible paths within it?" Once the question is reframed, three governance moves follow.

First, **separate the boundary from the path in the governing documents themselves.** A procurement policy should state P and ∂Φ (authorization, competition, ethics, documentation) as constraints, and should explicitly present procedures as an *open family* of admissible methods, not as a closed enumeration to be matched one-to-one. This is a documentation reform, and it is cheap; its effect is to make the conflation visible and therefore contestable.

Second, **govern to the boundary, not to the path.** Audit and oversight should ask whether an award satisfied ∂Φ (was it authorized, competitively validated, ethically clean, and documented?) rather than whether it traced a particular sequence. This realigns accountability (Section 4.1): an officer who adapts the method but stays inside ∂Φ should face *no* process-failure exposure, dissolving the asymmetry that builds tunnels. Governing to the boundary is exactly what Corollary 3.1 requires to dissolve the P2 dilemma.

Third, **treat systematic bypass as a design signal, not a discipline problem** (Norman, 1988). A pattern of bypass around a given category is evidence that the recognized family is too narrow for that category's real demands; the corrective is to widen the family (move toward the field), which by P1 reduces the bypass incentive at its root, rather than to harden enforcement, which by Section 5 increases it.

### 7.2 Application to PZP

PZP is unusually well-suited to this reframe, for a reason that is easy to miss: **the boundary ∂Φ is already in the statute.** The Act sets authorization thresholds (the 130 000 PLN exemption, art. 2 ust. 1 pkt 1; the EU thresholds in the President of the UZP's *obwieszczenie*), it mandates competition, it imposes ethical and conflict constraints, and it imposes documentation duties. The Act also offers a *family* of procedures: przetarg nieograniczony (art. 132), przetarg ograniczony (art. 140), dialog konkurencyjny (art. 169), negocjacje z ogłoszeniem (przesłanki, art. 153), tryb podstawowy (art. 275), and, under documented przesłanki, zamówienie z wolnej ręki (art. 214 ust. 1). The statute, in other words, supplies both the boundary and a non-trivial family {A₁, …, Aₘ}. The tunnel is *not* mandated by PZP; it is the organizational habit of collapsing that family to its single most audit-defensible member.

The reform that the framework recommends for PZP is therefore not a statutory loosening of the boundary: competition, in particular, must stay firmly in ∂Φ, precisely because Szucs (2024) shows that competitive validation is what averts the favoritism premium. The reform is at the level of *organizational practice and oversight*: **require competitive validation without mandating a single rigid format.** Concretely, this means (a) contracting authorities documenting their procurement *policy* as the statutory boundary rather than as a house tender template; (b) audit institutions evaluating awards against ∂Φ (was competition genuine, was authorization correct, was the file complete) rather than against conformance to one expected tryb where the law admits several; and (c) reserving the genuine rigidity of the most formal procedures for the contexts where the favoritism dimension dominates (high-value, high-corruption-risk, strategic purchases), while letting lower-risk operational spend use the lighter admissible methods the statute already provides.

Two cautions discipline this recommendation. First, the legality boundary is non-negotiable: above the EU thresholds, the competitive procedures are not optional, and "method flexibility" never means evading competition: it means choosing freely *among* lawful competitive methods and adapting their non-binding details. Second, the recommendation is *contingent on context* in exactly the sense of Section 6: where corruption risk is high, the value of the boundary's competition constraint is at its highest, and the appropriate field is a *tightly bounded* one. The framework does not counsel deregulation; it counsels distinguishing the boundary worth defending from the path not worth fetishizing.

### 7.3 Relation to the companion articles

This article is the cycle's conceptual and formal foundation: it locks the notation, formalizes the policy/procedure decomposition, and develops the abstract enforcement-fallacy theory. It deliberately stops short of two tasks it hands to its companions, so that each discipline's work is done once and only once.

The cycle's **economics anchor** (Mamcarz, in preparation-b, anchoring *ekonomia i finanse*) takes the seven-dimension differential ΔC_total defined here and quantifies it: it specifies each dimension in closed form, grades every parameter by provenance (peer-reviewed vs. calibrated vs. Grade-C modeling assumption), recomputes the reference scenarios, runs the sensitivity sweeps over the high-leverage parameters, and binds the cost object to the PZP path structure (mapping paths to arts. 132/140/169/153/214/275). It is there that the symmetry-inertness disclosure of Section 6.3 is demonstrated on the actual model code, and there that the path-selection tool is documented: a *weighted rule-based scoring function with a 30-run sensitivity sweep*, explicitly **not** a machine-learning model, **not** a Random Forest, and **not** validated against real procurement outcomes.

The cycle's **public-administration anchor** (Mamcarz, in preparation-c, anchoring *nauki o polityce i administracji*) takes the compliance-theater and enforcement-fallacy theory of Sections 4–5 to the street level and to Polish procurement data, developing the discretion-under-PZP account and a registered-report research design. The empirical operationalization of the enforcement fallacy is that article's job, not this one's; it *cites the present article* for the abstract theory rather than re-deriving it.

The three articles are three readings of one conflation; none may contradict another on any value, sign, or framing fixed in this article.

---

## 8. Limitations

This article is **analytical and deductive**; it presents no empirical data of its own. Its propositions (P1, P2, and their corollaries) are derived from definitions and structural assumptions, not estimated from observation. Several specific limitations follow and are stated plainly, because in this project identification and external-validity caveats are treated as assets rather than embarrassments.

**Transfer by analogy.** The five-tradition synthesis of Section 5 imports theories built for street-level public services (Lipsky), aerospace risk culture (Vaughan), incentive contracting (Holmström-Milgrom), monetary and audit measurement (Goodhart-Strathern), state high-modernism (Scott), and product design (Norman). Each is transferred to procurement by structural analogy. The convergence of their predictions is suggestive and, we argue, theoretically compelling, but analogical transfer is not empirical demonstration; the enforcement fallacy is an *analytical* prediction awaiting the cycle's empirical program.

**Estimates are not facts.** Every quantitative figure referenced in this article is an *imported benchmark under its own identification and external-validity caveat*, not a measured fact about Polish procurement: the ~6% discretion price effect and ~10% productivity-selection effect (Szucs, 2024); the 22% renegotiation base and 7.7–10.5 pp rigidity premium (Beuve et al., 2021, 2023); the ~30%/≈41.5% concession-renegotiation incidences (Guasch, 2004); the 7.5–14% adaptation cost (Bajari et al., 2014); the "at least half of savings eroded" result (Decarolis, 2014); the ~€28 000 procedure cost (European Commission, 2011); the "up to 30% over three years" TCO ceiling (ISM, n.d.). Szucs is Hungarian public procurement (RDD with ~2/3 of the discontinuity attributable to selection); Beuve et al. is the French car-park sector (2SLS/IV, n ≈ 279, per-SD dose); Guasch is Latin-American concessions (observational); Bajari et al. is U.S. Caltrans highway paving; Decarolis and Coviello-Mariniello (2014) are Italian public works. Transfers to a Polish or generic context are benchmarks, not measurements. The headline magnitude that the cycle's cost model can produce (e.g., a rigid path running on the order of 100–400% over a policy-only path) is an *estimate with sensitivity bands*, never a finding.

**Symmetry is currently inert at net.** As disclosed in Section 6.3, the symmetric construction does not, at present calibration, produce a single net case in which the rigid path is cheaper; the symmetry holds per-dimension and qualitatively, not at net. This is reported honestly here and demonstrated in full in the companion economics article (Mamcarz, in preparation-b); the governance theory does not depend on a net sign-flip.

**Parameter provenance.** Roughly 35–40% of the cost model's parameters are peer-reviewed; the remainder are calibrated or Grade-C modeling assumptions rendered as cardinal numbers. The conceptual claims of *this* article do not turn on the cardinal values, but the cost vocabulary it locks does inherit that mixed provenance, and any quantitative use downstream must carry the qualification.

**Scope of the formalism.** The decomposition treats the admissible family {A₁, …, Aₘ} as well-defined and the boundary ∂Φ as knowable; in practice both are partly contested and partly emergent. The model abstracts from legal ambiguity at the boundary, from genuine cases where the family is in fact a singleton (some purchases admit only one lawful method), and from the political economy that shapes which procedures become "legitimate." These are simplifications appropriate to a theory-building paper, to be relaxed in empirical follow-up.

---

> ## Claims and Non-Claims
>
> **What this article claims.** Procurement governance is structured by a routine conflation of *policy* (the boundary set ∂Φ, P = {r₁, …, rₙ}) with *procedure* (one admissible path A = (a₁, …, aₖ) drawn from a family {A₁, …, Aₘ}); this conflation builds a "tunnel" that is dominated in value (Corollary 2.1), forces a destroy-value-or-bypass dilemma (P2), and cannot be cured by harder enforcement (the enforcement fallacy). Importing the economics of discretion makes the framework symmetric and contingent, yielding the reform principle "require competitive validation without mandating a single rigid format." All quantitative outputs referenced are **model estimates** generated under the assumptions documented in `docs/MODEL_PARAMETERS.md`; they are *not* measured empirical facts about Polish (or any) procurement.
>
> **What this article does NOT claim.**
> 1. The headline magnitude (e.g., rigid path 100–400% over policy-only) is an **estimate with sensitivity bands**, never a finding.
> 2. **Symmetry is numerically inert at net.** Real-code recompute of all 9 reference scenarios yields ΔC_total > 0 in **9/9** (strictly positive everywhere); "the rigid path can be net-cheaper" holds **only per-dimension** (favoritism subsidizes the rigid path in 8/9 cases) and **never at net**, because the rigid-favoring term is structurally bounded an order of magnitude below the TCO and opportunity penalties. Symmetry is a *structural possibility*, not an observed net finding.
> 3. The path optimizer is a **weighted rule-based scoring function with a 30-run sensitivity sweep**: it is **NOT** machine learning, **NOT** a Random Forest, and **NOT** validated against real procurement outcomes.
> 4. The private-sector cases (Ryanair, Swiss Casinos, Air France, Zara) are **illustrative motivation only**; they are not evidence about public-procurement law.
> 5. Roughly **35–40% of model parameters are peer-reviewed**; the remainder are **calibrated or Grade-C modeling assumptions** rendered as cardinal numbers.
> 6. All imported effects carry their **identification and external-validity caveats** (Szucs: Hungarian-public RDD, ~2/3 selection; Beuve: French car-parks, 2SLS/IV; Guasch: LAC ex-telecom; Bajari-Houghton-Tadelis: US Caltrans; Decarolis/Coviello-Mariniello: Italian works). Transfers to the Polish context are benchmarks, not measurements.

---

## References

Bajari, P., Houghton, S., & Tadelis, S. (2014). Bidding for incomplete contracts: An empirical analysis of adaptation costs. *American Economic Review, 104*(4), 1288–1319. https://doi.org/10.1257/aer.104.4.1288

Bajari, P., & Tadelis, S. (2001). Incentives versus transaction costs: A theory of procurement contracts. *RAND Journal of Economics, 32*(3), 387–407. https://doi.org/10.2307/2696361

Beuve, J., Moszoro, M. W., & Spiller, P. T. (2021). *Contractual rigidity and political contestability: Revisiting public contract renegotiations* (NBER Working Paper No. 28491). National Bureau of Economic Research. https://doi.org/10.3386/w28491

Beuve, J., Moszoro, M. W., & Spiller, P. T. (2023). Contractual rigidity and political contestability: Revisiting public contract renegotiations. *Journal of Law, Economics, and Organization, 39*(1), 281–308. https://doi.org/10.1093/jleo/ewab022

Chartered Institute of Procurement & Supply. (2024). *Procurement policies & procedures explained*. CIPS Intelligence Hub.

Coviello, D., & Mariniello, M. (2014). Publicity requirements in public procurement: Evidence from a regression discontinuity design. *Journal of Public Economics, 109*, 76–100. https://doi.org/10.1016/j.jpubeco.2013.10.008

Decarolis, F. (2014). Awarding price, contract performance, and bids screening: Evidence from procurement auctions. *American Economic Journal: Applied Economics, 6*(1), 108–132. https://doi.org/10.1257/app.6.1.108

DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited: Institutional isomorphism and collective rationality in organizational fields. *American Sociological Review, 48*(2), 147–160. https://doi.org/10.2307/2095101

Dyrektywa Parlamentu Europejskiego i Rady 2014/24/UE z dnia 26 lutego 2014 r. w sprawie zamówień publicznych [Directive 2014/24/EU on public procurement]. (2014). *Dziennik Urzędowy Unii Europejskiej, L 94*.

European Commission. (2011). *Evaluation report: Impact and effectiveness of EU public procurement legislation* [Prepared by PwC, London Economics & Ecorys]. European Commission.

EY Switzerland. (2024). *Integrating agile practices into procurement processes* [Case discussion: Swiss Casinos ERP; Air France-KLM Martinair cargo].

Fazekas, M., & Blum, J. R. (2021). *Improving public procurement outcomes: Review of tools and the state of the evidence base* (Policy Research Working Paper No. 9690). World Bank Group.

Fazekas, M., & Kocsis, G. (2020). Uncovering high-level corruption: Cross-national objective corruption risk indicators using public procurement data. *British Journal of Political Science, 50*(1), 155–164. https://doi.org/10.1017/S0007123417000461

Goodhart, C. A. E. (1975). Problems of monetary management: The U.K. experience. *Papers in Monetary Economics, 1*. Reserve Bank of Australia.

Guasch, J. L. (2004). *Granting and renegotiating infrastructure concessions: Doing it right*. World Bank. https://doi.org/10.1596/0-8213-5792-1

Holmström, B., & Milgrom, P. (1991). Multitask principal–agent analyses: Incentive contracts, asset ownership, and job design. *Journal of Law, Economics, & Organization, 7*(Special Issue), 24–52. https://doi.org/10.1093/jleo/7.special_issue.24

*IJRAR*. (2019). Ryanair strategic positioning and fleet management. *International Journal of Research and Analytical Reviews, 6*(2).

Institute for Supply Management. (n.d.). *Understanding total cost of ownership in procurement*. https://www.ism.ws/supply-chain/ownership-in-procurement/

Kelman, S. (1990). *Procurement and public management: The fear of discretion and the quality of government performance*. AEI Press.

Kraljic, P. (1983). Purchasing must become supply management. *Harvard Business Review, 61*(5), 109–117.

Lipsky, M. (1980). *Street-level bureaucracy: Dilemmas of the individual in public services*. Russell Sage Foundation.

Mamcarz, P. (in preparation-b). *How much does rigidity cost? A symmetric, multidimensional model of procedural cost in procurement* [Ile kosztuje sztywność? Symetryczny, wielowymiarowy model kosztu proceduralnego w zamówieniach]. Article 2 of the doctoral cycle. Uczelnia Łazarskiego (Lazarski University), Warsaw.

Mamcarz, P. (in preparation-c). *Where does rigidity really cost? Applying the procedural-cost model to Polish public procurement (UZP/BZP/TED)* [Gdzie sztywność naprawdę kosztuje? Zastosowanie modelu kosztu proceduralnego do polskich zamówień publicznych]. Article 3 of the doctoral cycle. Uczelnia Łazarskiego (Lazarski University), Warsaw.

Norman, D. A. (1988). *The design of everyday things*. Basic Books.

Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r. w sprawie aktualnych progów unijnych [Announcement on current EU thresholds]. (2025). *Monitor Polski 2025 poz. 1247*.

Scott, J. C. (1998). *Seeing like a state: How certain schemes to improve the human condition have failed*. Yale University Press.

Strathern, M. (1997). 'Improving ratings': Audit in the British University system. *European Review, 5*(3), 305–321.

Szucs, F. (2024). Discretion and favoritism in public procurement. *Journal of the European Economic Association, 22*(1), 117–160. https://doi.org/10.1093/jeea/jvad017

Tradogram. (2024). *Agile procurement practices: A comprehensive guide* [Case discussion: Zara / Inditex].

Ustawa z dnia 11 września 2019 r., Prawo zamówień publicznych [Act of 11 September 2019, Public Procurement Law]. (2019). *Dziennik Ustaw* (t.j. Dz.U. 2026 poz. 793).

Vaughan, D. (1996). *The Challenger launch decision: Risky technology, culture, and deviance at NASA*. University of Chicago Press.
