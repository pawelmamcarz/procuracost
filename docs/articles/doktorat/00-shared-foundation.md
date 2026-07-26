# Shared Foundation — Model 2.2

**Status:** binding quantitative contract for future revisions of the doctoral
cycle. Drafts carrying a “superseded” banner are historical and must not be
submitted or cited without revision.

## Central claim

Policy is the binding set of legal and governance constraints; a procedure is
one admissible path through that set. The Tunnel–Field thesis is conditional:
collapsing all admissible paths into one sequential workflow can destroy value,
but formal competition can prevent discretion, favouritism and poor selection.
Which effect dominates is an empirical question, not a premise.

## Model contract

Compare a **formal/sequential** path `F` with an **adaptive/compliant** path `A`
for the same purchase and compliance boundary:

`ΔC = Σ C_F,i − Σ C_A,i`, for time, administration, delay, selection,
formal amendments, TCO and bypass.

`ΔC > 0` favours `A`; `ΔC < 0` favours `F`. Report a low/central/high scenario
range with every estimate. The range is not a confidence interval.

- Szucs (2024): in the structural estimates, discretion raises price by about 6%
  and selects contractors about 10% less productive. Use only for
  competition/selection. Identified on Hungarian contracts below the ~25m HUF
  invitational threshold, so the transfer to EU-threshold procurement is a
  scenario. (Model 2.1 stated 28%; that is the connected-firm win-probability
  figure from the same paper and was corrected in 2.2.)
- Beuve, Moszoro and Spiller (2023): a simultaneous one-SD increase in **each** of
  the seven z-scored rigidity categories raises formal-amendment frequency by
  0.077–0.105 per contract-year in French car-park contracts, estimated with
  2SLS/IV. This is not an event probability, and it is not the effect of a one-SD
  move on the summed index.
- TCO (0% centrally, stress-tested to 15%) and bypass (1–30%) are broad scenario assumptions. Theory supports
  mechanisms, not these probabilities.

The scalar `PROCESS_RIGIDITY` is not an empirical treatment variable. Workflow,
competition, contract design and technology remain separate.

## Hypotheses — canonical set

**H1–H5 below are canonical for the whole cycle.** Article 1's P1–P5 and article 3's H1–H5
are operationalisations of these five and must map onto them one-to-one; where they diverge,
this file governs. Model 2.1 carried three parallel sets with no stated precedence.

- **H1:** Sequential workflow increases time and coordination cost, conditional on complexity.
- **H2:** Effective competition reduces discretion-related price and selection loss.
- **H3:** Contractual rigidity raises renegotiation exposure; workflow formality alone need not do so.
- **H4:** Adaptive execution can reduce delay/TCO loss, but weak competition or control can reverse the net result.
- **H5:** Technology changes execution costs only when used; ownership alone is not an effect.

### Crosswalk

| Canonical | Article 1 | Article 3 | Measure | Estimator | Decision rule |
|---|---|---|---|---|---|
| H1 | P1 | H1 | `log(cycle days)`, effort hours | FE regression on *ex ante* prescriptiveness | `|β| ≥ 0.10` with CI excluding the MSI |
| H2 | P2 | H2 | valid bids, price vs benchmark | separate model, bids as **dependent** variable | sign and CI |
| H3 | P3 | H3 | amendment count and type | separate model on clause rigidity, not on gate count | rigidity significant while gate count is not |
| H4 | P4 | H4 | net ΔC sign vs observed | heterogeneity by delay cost and competition | sign accuracy vs category median |
| H5 | P5 | H5 | bypass incidence | moderation by *observed* control use | interaction significant only where use is logged |

### Which hypotheses the shipped calculator cannot test

Stated because it would otherwise read as an oversight:

- **H3** is not testable in the calculator. `formalContractRigidity > adaptiveContractRigidity`
  in all eight profile rows and there is no input to vary it, so no configuration exists in
  which choosing the formal workflow does not raise amendment exposure. The separation the
  hypothesis asserts is real in the *code paths* but not exercisable in the *instrument*.
- **H5** is not testable either. There is no utilisation, configuration or enforcement
  variable; selecting an end-to-end suite from a dropdown buys the full control benefit
  unconditionally. "Only when used" has no representation.

Both require model changes before article 3 can test them, and both are listed in the
empirical plan rather than presented as already operational.

## Canonical references

Beuve, J., Moszoro, M., & Spiller, P. T. (2023). Doing It by the Book: Political
Contestability and Public Contract Renegotiations. *Journal of
Law, Economics, and Organization, 39*(1), 281–308.

Szucs, F. (2024). Discretion and favoritism in public procurement. *Journal of
the European Economic Association, 22*(1), 117–160.

Fazekas, M., & Blum, J. R. (2021). *Improving Public Procurement Outcomes:
Review of Tools and the State of the Evidence Base*. World Bank Policy Research
Working Paper. Use for mechanism and context, not as a ProcuraCost effect-size estimate.

Current equations and thresholds: [`docs/MODEL_PARAMETERS.md`](../../MODEL_PARAMETERS.md).
Current narrative: [`RESEARCH.md`](../../../RESEARCH.md).
