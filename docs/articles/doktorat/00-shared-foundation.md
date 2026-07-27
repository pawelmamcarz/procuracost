# Shared Foundation — Model 2.2.2

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

`ΔC = Σ C_F,i − Σ C_A,i`, for staff effort, administration, delay, selection,
formal amendments, TCO and bypass.

`ΔC > 0` favours `A`; `ΔC < 0` favours `F`. Report a central estimate and the
combined low/high envelope over both the evidence and structural axes. The
envelope is a stress test, not a confidence interval. Under the audited 2.2.2
calibration, all ten fixed reference scenarios cross zero; none identifies a robust
winner.

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
  move on the summed index. The model's 0–1 profile has no empirical conversion
  to that seven-category shift, so the coefficient is an order-of-magnitude
  anchor for a calibration assumption, not a transferred estimate.
- TCO (0% centrally, stress-tested to 15%) and bypass (1–30%) are broad
  scenario assumptions. Theory supports mechanisms, not these probabilities.

The scalar `PROCESS_RIGIDITY` is not an empirical treatment variable. Workflow,
competition, contract design and technology remain separate.

## Hypotheses — canonical set

**H1–H5 below are canonical for the whole cycle.** Article 1's P1–P5 and article 3's H1–H5
are operationalisations of these five and must map onto them one-to-one; where they diverge,
this file governs. Model 2.1 carried three parallel sets with no stated precedence.

- **H1:** Greater *ex ante* workflow prescriptiveness increases cycle time and
  coordination effort, conditional on complexity.
- **H2:** Effective competition reduces discretion-related price and selection loss.
- **H3:** Contractual rigidity raises renegotiation exposure; workflow formality alone need not do so.
- **H4:** Adaptive execution can shorten or lengthen the calendar; its net result
  depends on time and lifecycle effects as well as competition and control.
- **H5:** Technology-enabled controls reduce execution error or bypass only when
  configured and used; ownership alone is not operational exposure.

### Crosswalk

| Canonical | Article 1 | Article 3 | Measure | Estimator | Decision rule |
|---|---|---|---|---|---|
| H1 | P1 | H1 | `log(cycle days)`, effort hours | FE regression on *ex ante* prescriptiveness | assess each outcome against its own preregistered MSI (`ln(1.10)` for time; a separate bound for effort); lower CI at or above MSI supports materiality, upper CI below MSI weighs against it, otherwise inconclusive |
| H2 | P2 | H2 | *ex ante* market-access design; valid bids and price vs benchmark as outcomes | separate model, bids as **dependent** variable | sign and CI; never use realized bids as both exposure and outcome |
| H3 | P3 | H3 | amendment count and type | separate model on clause rigidity, not on gate count | rigidity CI excludes zero in the predicted direction; the gate-count CI lies inside preregistered equivalence bounds rather than merely being non-significant |
| H4 | P4 | H4 | component outcomes; net ΔC only where delay and lifecycle inputs are independently defensible | separate component models, then held-out net-cost comparison with heterogeneity by time direction, delay cost and competition | sign and calibration against a category-median baseline; report interval width, not coverage alone |
| H5 | P5 | H5 | bypass incidence | moderation by *observed* control use | report the use interaction and test ownership alone against a preregistered equivalence bound |

### Which hypotheses the shipped calculator cannot test

Stated because it would otherwise read as an oversight:

- **H3** is not testable in the calculator. `formalContractRigidity > adaptiveContractRigidity`
  in all eight profile rows and there is no input to vary it, so no configuration exists in
  which choosing the formal workflow does not raise amendment exposure. The separation the
  hypothesis asserts is real in the *code paths* but not exercisable in the *instrument*.
- **H5** is not testable either. There is no utilisation, configuration or enforcement
  variable; selecting an end-to-end suite from a dropdown buys the full control benefit
  unconditionally. "Only when used" has no representation.

Both require additional organizational variables before article 3 can test them.
The calculator would need separate inputs only if it were also expected to
represent those tests; they are not presented as already operational.

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
