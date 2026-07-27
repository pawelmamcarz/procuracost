# Tunnel or Field: Separating Governance Boundaries from Procurement Workflow

**Doctoral-cycle article 1 · conceptual paper · ProcuraCost 2.2.2 · draft**

## Abstract

Procurement rules perform at least three different functions: they constrain
authority and discretion, organize work, and shape contractual adaptation. A
single label such as “rigidity” cannot identify these mechanisms. This paper
recasts the Tunnel–Field metaphor as a limited proposition about workflow
topology. A tunnel is a prescribed sequence; a field permits alternative paths
inside the same legal and governance boundary. The comparison is neutral:
formal competition may protect value by limiting favoritism, while adaptive
workflow may protect value by reducing avoidable effort, delay, and adaptation
cost. The net sign is an empirical question. The paper defines an admissible
counterfactual, derives testable propositions, and states what the framework
does not establish.

## 1. The problem of conflation

A procurement regime contains policy constraints, workflow, market design,
contract terms, and technical controls. These elements interact, but they are
not interchangeable. An open auction can use a well-designed parallel workflow.
A private purchase can be sequential and heavily gated. A detailed contract can
follow a short sourcing cycle, while an adaptive contract may emerge from a
formal public procedure.

Earlier versions of the Tunnel–Field thesis treated these properties as one
latent continuum. That move made the story simple and the inference invalid.
Evidence about discretion was presented as evidence about workflow; evidence
about contractual clauses was mapped onto process gates; theory about informal
workarounds was converted into a numerical bypass probability. ProcuraCost has
kept these constructs separate since version 2.1; version 2.2.2 additionally
widens uncertainty around the user-supplied cost of delay and the model's own
step-duration assumptions.

The relevant question is narrower:

> For the same purchase and the same compliance boundary, when does a prescribed
> sequence cost more than an adaptive sequence, and when is that difference
> outweighed by the governance value of formal control?

## 2. Two geometries under one boundary

Let policy be the set of binding constraints concerning authority, equal
treatment, competition, ethics, documentation, and auditability. Let procedure
be an ordered set of activities intended to satisfy those constraints.

The **tunnel** is a workflow in which activities and approvals are substantially
pre-ordered. Its benefits may include predictability, repeatability, and a clear
audit trail. Its costs may include waiting at gates, repeated hand-offs, and
difficulty responding to new information.

The **field** is a workflow in which teams may parallelize, revisit, or choose
activities while controls continue to apply. Its benefits may include learning
and shorter elapsed time. Its risks include inconsistent execution and greater
room for discretion if boundaries are weak.

This is not a contrast between compliance and non-compliance. In Polish public
procurement, both counterfactuals must remain within PZP. A comparison between a
lawful tender and an unlawful direct award estimates nothing useful about
workflow design.

## 3. Why formality can create value

Szucs (2024) studies a Hungarian reform that made an invitational,
high-discretion procedure available below a value threshold. Buyers manipulated
anticipated values around that threshold, so a naive regression discontinuity
would not identify the causal effect. The paper combines timing variation with a
structural selection model. It concludes that discretion increased prices and
selected less productive contractors. This is evidence about supplier-selection
discretion in that institutional setting, not about every form of process
adaptation.

The implication for Tunnel–Field is disciplined: an adaptive workflow must not
silently weaken effective competition. If it does, its time advantage can be
offset by price or selection loss. The framework therefore treats competition
effectiveness separately from workflow duration.

Publicity itself should not be assigned a universal delay penalty. Coviello and
Mariniello (2014), using Italian public-works thresholds, find that greater
publicity increased participation without worsening delivery delay. Delay must
be measured from the actual activity sequence, not inferred from the existence
of competition.

## 4. Why adaptation can create value

Incomplete contracts create adaptation costs when relevant contingencies cannot
be specified ex ante (Bajari, Houghton, and Tadelis 2014). Beuve, Moszoro, and
Spiller (2023) distinguish contractual flexibility from tolerance for deviation.
Their 2SLS/IV estimates associate a simultaneous one-standard-deviation increase
in **each of seven z-scored rigidity categories** with 0.077–0.105 additional
formal amendments per contract-year in French car-park contracts. Their
empirical object is contractual rigidity and an annual amendment frequency—not
an event probability or the number of sourcing approvals. ProcuraCost's 0–1
contract-rigidity profile has no empirical conversion to that seven-category
z-score shift, so the coefficient is only an order-of-magnitude anchor for a
calibration assumption, not a transferred estimate.

This distinction matters. Workflow can be redesigned without changing the
contract, and contractual adaptation can be improved without eliminating formal
competition. The framework predicts a benefit only where an adaptive design
changes observable effort, elapsed time, or lifecycle performance.

## 5. Bypass is a hypothesis, not a probability

Street-level discretion (Lipsky 1980), normalization of deviance (Vaughan 1996),
and multitask incentives (Holmström and Milgrom 1991) provide plausible
mechanisms for informal workarounds. None estimates how often procurement users
bypass a process. A numerical bypass rate must therefore come from local event
data or be labelled as a scenario assumption.

The same caution applies to technology. A system can enforce approval limits,
retain evidence, and prevent unauthorized commitments, but ownership of a tool
does not prove that controls are configured or used. Technology is a moderator
to be observed, not an automatic benefit assigned to the field. The shipped
calculator has no utilization or control-enforcement input, so it cannot test
this proposition; organizational logs are required.

## 6. Propositions

- **P1:** Greater *ex ante* workflow prescriptiveness increases elapsed time and
  coordination effort, conditional on purchase complexity.
- **P2:** Effective competition reduces discretion-related selection loss,
  independently of workflow topology.
- **P3:** Contractual rigidity raises formal adaptation and renegotiation
  exposure; workflow formality alone need not do so.
- **P4:** Adaptive execution can shorten or lengthen the calendar; it creates net
  value only when its time and lifecycle effects outweigh selection and control
  losses.
- **P5:** Technology-enabled controls reduce execution error or bypass only
  through observed configuration, use, and enforcement; ownership alone is not
  operational exposure.

These propositions permit either path to dominate. They also permit a null
result: many routine purchases may show no material workflow difference.

P1–P5 are operationalisations of the canonical H1–H5 in
`00-shared-foundation.md`, which governs where the two diverge.

### 6.1 Contribution of this article

The cycle combines a governance argument, a cost model and an empirical design, and each
article must carry its own contribution rather than borrowing the cycle's. This one
contributes **a decomposition of "procedural rigidity" into five separately measurable
constructs, and a demonstration that the two empirical anchors used by earlier versions
of this project do not license claims about workflow formality.**

Earlier ProcuraCost versions read evidence about *bidder-selection discretion* (Szucs) and
about *contractual clause rigidity* (Beuve et al.) as evidence about *workflow formality*.
It is not. Neither study observes workflow topology; neither varies it; neither reports it.
This article states the
non-equivalence, shows what each construct would require to be measured, and derives
propositions that are falsifiable separately — which is the precondition for the cost model
of article 2 and the protocol of article 3 to mean anything.

The contribution is therefore conceptual and negative-clearing: it removes an invalid
inference from this project. The present draft does not establish that the wider procurement
literature routinely makes the same error; that broader novelty claim would require a
systematic review. It does not claim an effect, and it is not validated.

For managers, the framework recommends component diagnosis rather than wholesale
process ideology. Remove a gate only after identifying the risk it controls.
Preserve or strengthen competition when shortening workflow. Design contractual
change mechanisms where uncertainty is genuine. Measure timestamps, effort,
bids, amendments, and audit outcomes before monetizing them.

The framework has not been causally validated as an integrated model. Its TCO
stress test (zero centrally), bypass ranges, path profiles, step durations and
structural uncertainty multipliers are assumptions. Mandatory PZP publication
and standstill periods cannot be compressed by an adaptive workflow. Estimates
from Hungary, France, and Italy do not automatically transport to Poland or to
private procurement. Under the audited 2.2.2 calibration, every fixed reference
scenario crosses zero once both evidence and structural uncertainty are varied;
the model therefore identifies no robust winner in those scenarios. The
Tunnel–Field thesis survives only in conditional form: prescribed sequence can
destroy value, but formality can also protect value.

## References

Bajari, P., Houghton, S., & Tadelis, S. (2014). Bidding for Incomplete
Contracts: An Empirical Analysis of Adaptation Costs. *American Economic Review,
104*(4), 1288–1319. https://doi.org/10.1257/aer.104.4.1288

Beuve, J., Moszoro, M. W., & Spiller, P. T. (2023). Doing It by the Book:
Political Contestability and Public Contract Renegotiations. *Journal of Law,
Economics, and Organization, 39*(1), 281–308.
https://doi.org/10.1093/jleo/ewab039

Coviello, D., & Mariniello, M. (2014). Publicity Requirements in Public
Procurement: Evidence from a Regression Discontinuity Design. *Journal of Public
Economics, 109*, 76–100. https://doi.org/10.1016/j.jpubeco.2013.10.008

Holmström, B., & Milgrom, P. (1991). Multitask Principal–Agent Analyses.
*Journal of Law, Economics, & Organization, 7*(Special Issue), 24–52.
https://doi.org/10.1093/jleo/7.special_issue.24

Lipsky, M. (1980). *Street-Level Bureaucracy*. Russell Sage Foundation.

Szucs, F. (2024). Discretion and Favoritism in Public Procurement. *Journal of
the European Economic Association, 22*(1), 117–160.
https://doi.org/10.1093/jeea/jvad017

Vaughan, D. (1996). *The Challenger Launch Decision*. University of Chicago
Press.
