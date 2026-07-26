# Procedural Rigidity and Adaptive Procurement: A Transparent Decision Model

**Working paper — draft for review**
**Model:** ProcuraCost 2.2.1
**Updated:** 14 July 2026

## Abstract

Procurement policy, procurement procedure, competition, and contract design are related but distinct. Earlier versions of ProcuraCost collapsed them into one rigidity index and therefore overstated what the cited literature could support. This paper presents a corrected seven-dimension decision model comparing a formal/sequential path with an adaptive/compliant path for the same purchase. Both paths must satisfy the same legal and governance boundary; in public procurement, flexibility means lawful design within PZP rather than a `policy-only` exemption.

The model monetizes staff effort, administrative overhead, delay, supplier-selection risk, incremental formal-amendment cost, foregone lifecycle value, and bypass exposure. Empirical estimates are used only for the construct and population they actually measure. Weakly identified quantities—especially TCO capture and bypass rates—enter as broad scenarios rather than precise predictions. Results are reported as a central estimate plus a scenario interval that may cross zero. The Tunnel–Field proposition therefore survives as a conditional hypothesis: adaptive procurement is advantageous when avoidable workflow delay and adaptation costs exceed the governance value of formal competition and control. It is not a universal result.

## 1. Research question and claim boundary

The research question is:

> Under comparable governance and market conditions, when does a more prescribed procurement workflow create greater total cost than a more adaptive but fully compliant workflow?

ProcuraCost is a transparent decision model, not an estimator trained or validated on procurement outcomes. Its outputs are conditional calculations under declared assumptions. It cannot establish that one path causes lower cost in Poland or elsewhere.

## 2. Conceptual framework

A **policy** defines constraints and objectives: authority, competition, ethics, documentation, and value for money. A **procedure** orders activities used to satisfy those constraints. Multiple procedures may be lawful under the same policy, but discretion is not automatically beneficial: it can improve adaptation while weakening competition or enabling favoritism.

The Tunnel–Field metaphor describes workflow topology only:

- a **tunnel** is sequential, gate-heavy, and difficult to resequence;
- a **field** allows alternative paths inside continuously enforced boundaries.

The metaphor does not imply that a field lacks controls or that a tunnel always performs worse. For public procurement, both alternatives must remain inside PZP. A counterfactual that compares an EU-threshold tender with an unlawful direct award is inadmissible.

Five constructs must not be conflated:

1. procedural workflow burden;
2. intensity and effectiveness of competition;
3. contractual rigidity and adaptability;
4. technology-enabled controls;
5. discretion and favoritism risk.

## 3. Evidence audit

### 3.1 Supplier selection and discretion

Szucs (2024) studies a Hungarian reform that made a high-discretion invitational procedure available below a value threshold of 25 million HUF (about 90,000 USD). Because contract values were manipulated around the threshold, the raw discontinuity is not a valid causal RDD. The paper uses policy timing and a structural selection correction. Its structural estimates indicate that discretion increases prices by about **6%** and lowers the average total factor productivity of selected contractors by about **10%**; the invalid raw discontinuity reports roughly 32%.

> **Correction (model 2.2).** Model 2.1 reported the productivity effect as 28% and asserted that the earlier figure of approximately 10% had been an error. That was backwards. 10% is the paper's structural estimate; 28 percentage points is a different quantity in the same paper — the increase in the probability that a politically connected firm wins under a high-discretion procedure. The erroneous figure propagated to the binding foundation document, the parameter table, three public pages and the README, and is corrected in all of them. See `CHANGELOG.md`.

The model monetizes the price channel only. Productivity remains a separate observed outcome because converting it into contract-value loss would double count and require another unsupported mapping. Transfer is a scenario, not a measurement, and it is a demanding one in two respects: the estimate is identified on Hungarian public contracts, and it is identified *below* a threshold that in Polish terms sits at or under the 170,000 PLN application threshold — far below every EU threshold to which the model's `pzp_eu` profile applies. The 2–9% range represents that transfer uncertainty.

### 3.2 Contractual rigidity and renegotiation

Beuve, Moszoro, and Spiller (2023) examine French car-park contracts. Their 2SLS/IV result is an increase of **0.077–0.105 formal amendments per contract-year** for a simultaneous one-standard-deviation increase in **each** of the seven z-scored categories that make up their rigidity index, with rigidity instrumented by political contestability. It is a frequency, not a percentage-point event probability; it is not the effect of a one-standard-deviation move on the summed index; and it does not measure procurement workflow formality.

ProcuraCost applies it only to a separate contract-rigidity profile and multiplies by contract duration and a user-supplied cost per amendment. **The transfer is weaker than model 2.1 presented it**, and the weakness is a unit mismatch rather than a population one. The model multiplies the slope by a hand-authored 0–1 calibration profile that is not a z-score, so it implicitly equates "profile = 1.0" with the seven-category shift the authors estimate. No conversion between those scales exists. The slope is therefore reclassified here as a **calibration assumption with an external order-of-magnitude anchor**, not as a transferred estimate — and only the *difference* between the two paths is interpretable, because the estimate is incremental and the model supplies no baseline level.

### 3.3 Administrative cost, delay, TCO, and bypass

The European Commission's 2011 study estimates the total authority-and-supplier cost of EU procedures. Model 2.1 described it as an "external sanity-check" although no comparison had been carried out; **the check was performed in the 2.2.2 calibration audit, against the full report, and the model passes it**: the pzp_eu template implies 23.8 authority-side person-days per EU-threshold procedure (16.8–33.0 across technology levels) against the study's median 22 / mean 36 person-days (pp. 84–85), and per-procedure process cost of 0.3–2.2% of contract value against the study's ~0.3% authority-side aggregate and APQC's 0.5–1.96%-of-spend band. The non-labour overheads (500 / 200 / 100 / 20 PLN per day) remain declared assumptions with no direct benchmark; the nearest anchor is the 25–30% Standard-Cost-Model uplift the study itself applies (fn. 40). Full reconciliation: `docs/research/CALIBRATION_BENCHMARKS.md`. The same study also reports that restrictions on the exercise of discretion are associated with higher average contract prices; that finding cuts against the discretion-premium channel this model imports from Szucs, and is recorded here rather than omitted.

Coviello and Mariniello (2014) show in Italian public works that publicity increased participation and did not worsen delivery delay; this contradicts any blanket claim that competition itself causes delay. ProcuraCost attributes delay to modeled workflow duration, not to competition.

No verified peer-reviewed source supports a universal 10% annual TCO saving or a 30% cumulative rule. Those values are removed from the baseline. The revised cumulative scenario range is 0–15% and is explicitly an assumption.

Lipsky (1980), Vaughan (1996), and Holmström and Milgrom (1991) motivate possible workarounds and distorted incentives, but none provides a bypass probability. The former sigmoid predicting about 86% bypass is removed; broad observable-rate scenarios are used instead.

## 4. Model

For path \(j \in \{F,A\}\), where F is formal/sequential and A is adaptive/compliant:

\[
C_j = C_{staff,j}+C_{admin,j}+d_jc_d+B\pi_j+H\lambda_jc_{amend}+B\tau_j+p_jE_j
\]

and

\[
\Delta C = C_F-C_A.
\]

A positive value favors the adaptive path; a negative value favors the formal path.

**ΔC is reported decomposed, not as a single number.** The seven terms have three different time bases and three very different standards of evidence, and summing them concealed which one was doing the work:

\[
\Delta C = \underbrace{\Delta C_{proces}}_{\text{staff, admin, selection, bypass}} + \underbrace{(d_F-d_A)\,c_d}_{\text{delay}} + \underbrace{\Delta C_{lifecycle}}_{\text{amendments, TCO}}
\]

The middle term is an **accounting identity** between a day count taken from the model's own step templates and a price per day supplied by the user. It is not a modeled or measured effect, and it must not be read as one. In the seven built-in scenarios where the two paths differ in duration it carries **68.3–99.6%** of |ΔC| after the 2.2.2 calibration audit (up to 96–99.6% in the stoppage-framed scenarios). Model 2.1 reported only the sum, so headline figures such as "Δ = 73.9% of the adaptive total" described the size of a user's assumption about delay, not the cost of a procedure.

Excluding that identity, the formal path is **cheaper on process cost in seven of the ten** built-in scenarios. That is the more informative and more falsifiable statement, and it reverses the direction a reader would infer from the 2.1 headline.

- **Staff:** activity hours by role at a loaded rate, times two declared broad context factors and the technology multiplier. Hours are a whole-role total; role headcount is descriptive and does not multiply the cost of a fixed workload. Mandatory legal waits do not disappear and are not compressed by technology.
- **Admin:** non-labor administrative overhead over *active* days, plus equal tool cost when both paths use the same technology; it excludes role hours already counted under staff. A statutory wait consumes calendar time without consuming coordination effort.
- **Delay:** elapsed days times a user-supplied daily cost of inaction.
- **Selection:** contract value times the discretion price scenario and residual competition risk.
- **Amendments:** annual formal-amendment frequency \(\lambda_j\) times contract duration \(H\) and a user-supplied cost per amendment.
- **TCO:** a declared three-year cumulative savings-pool scenario, scaled by `min(horizon years / 3, 1)`, times the share each path fails to capture; the central scenario is zero because no transferable estimate was identified.
- **Bypass:** user-supplied exposure times a scenario rate, scaled by system controls.

The shared baseline acquisition price is not added to either side: only modeled incremental selection loss enters the comparison. The central break-even daily inaction cost is \(-\Delta C_{non-delay}/(d_F-d_A)\) when the two paths differ in duration. It is reported **unclamped**, together with a status that says how to read it: a threshold above zero means the delay bucket decides, while a negative threshold means the formal path already costs more with the delay bucket removed entirely. Model 2.1 clamped the value at zero, which made those two cases indistinguishable and produced a figure that was 0 or undefined in every published scenario.

The low-delta scenario strengthens the governance case for formality: high discretion premium, no imported renegotiation effect, no TCO benefit, and a higher adaptive bypass rate. The high-delta scenario strengthens the adaptability case. These bounds are stress scenarios, not statistical intervals.

### 4.1 Structural asymmetry of the comparison

The model is designed to permit either path to win, and the parameters have not been tuned to protect the thesis. But **the architecture is not symmetric**, and a reader is entitled to know that before interpreting a sign:

- Six of the seven channels are weakly ordered toward the adaptive path by construction. The adaptive path has fewer or equal days in every step template, which mechanically reduces staff effort, coordination overhead and delay; and every entry in the path-profile table gives it lower contract rigidity and higher lifecycle capture.
- Exactly one channel can favour formality — selection — and it is bounded by contract value × the discretion premium × the residual competition gap. For `pzp_eu` that ceiling is about **0.3% of contract value**, while the delay channel is unbounded in the daily cost the user supplies.
- In the central case, two of the seven dimensions are identically zero: the TCO pool is zero and both bypass rates are 0.05, so the bypass difference vanishes. Five dimensions are active centrally, not seven.

The consequence is that a sign reversal in this model is driven almost entirely by the delay input and by the size of the selection channel. It is reachable — the control scenario `governance_control` returns a negative ΔC, four of ten scenarios cross zero, and the process bucket alone favours formality in seven of ten — but it is not reachable *symmetrically*.

**Through model 2.1 the published sensitivity sweep could not detect this, and that limitation was undocumented.** Across 11,340 configurations the central result favoured the formal path in 1,482 of them, but *no* configuration favoured it robustly — that is, the pro-adaptive extreme of the envelope never favoured formality. The cause was the templates rather than the evidence: every step of every template had `flexibleDays ≤ rigidDays`, so both the low and the high case were asked from a pro-adaptive process baseline. `EVIDENCE_CASES` perturbs five scalars — the discretion premium, the rigidity slope, the TCO pool and the two bypass rates — and leaves the step-day templates and the daily cost of inaction untouched. "Robustly favours adaptive" and "robustly favours formal" were therefore not equally hard questions, and reporting them side by side implied that they were.

Model 2.2 adds the `discovery` process type, in which the requirement emerges during the procurement and adaptive execution is genuinely **slower and more effortful** — co-design with suppliers, a re-scoping round, sometimes an abandoned negotiation — while the formal path freezes the requirement early and pays with a worse specification and weaker lifecycle capture. The sweep can now fail in both directions, which is the minimum a symmetry claim requires.

### 4.2 Two axes of uncertainty

Model 2.2.1 widens the reported envelope to cover a second axis, because the first one bracketed the wrong quantities:

- **Evidence axis** — the five literature-facing scalars: the discretion premium, the rigidity slope, the TCO pool and the two bypass rates.
- **Structural axis** — the daily cost of inaction (×0.25 to ×4) and non-mandatory step durations (×0.7 to ×1.3). Statutory PZP waits are invariant under both.

The structural axis is not a pessimism exercise. The cost of a day is the least reliable number a user supplies and the model has no way to check it, while the step-day tables are the model's own untested assumptions — and together they carry 80–99% of ΔC. Bracketing the small quantities while freezing the large ones understated uncertainty exactly where the model is least defensible.

The effect is large and it goes against the thesis:

| | evidence axis only | both axes (2.2.2 calibration) |
|---|---:|---:|
| built-in scenarios crossing zero | 5 of 10 | **10 of 10** |
| sweep: robustly favours formal | — | 1,042 of 12,960 |
| sweep: robustly favours adaptive | — | 5,374 of 12,960 |
| sweep: crosses zero | — | 6,544 of 12,960 |

Under the audited calibration, **no built-in scenario identifies a robust winner** once the two dominant inputs are allowed to move within defensible bounds. That is the honest headline, and it is a weaker claim than any previous version of this project made.

Two qualifications remain for the empirical agenda. Calibration should treat the day templates and the path profiles as the **primary objects of measurement**, because they — not the evidence anchors — carry the directional assumption; `discovery` is itself a modelling assumption, not an observation. And the ×0.25–×4 and ×0.7–×1.3 bounds are themselves declared judgements about how wrong an unmeasured input can be, not estimated intervals.

## 5. Interpretation

The central output is useful only together with the scenario interval and component breakdown. If the interval crosses zero, the model does not identify a robust winner. If it does not cross zero, the sign is stable only within the declared bounds.

The Tunnel–Field hypothesis is most plausible where:

- delay has a material and evidenced cost;
- the adaptive design preserves effective competition;
- requirements or contracts must change as information arrives;
- internal data show meaningful workflow effort or bypass exposure.

Formality may dominate where:

- the cost of delay is low;
- competition and auditability materially constrain favoritism;
- requirements and lifecycle costs are stable;
- adaptive governance capability is weak.

## 6. Case evidence

Ryanair's 2003 annual report documents a 100-aircraft Boeing order and price concessions. It does not identify a causal effect of procurement flexibility. Swiss Casinos and Air France KLM Martinair reports describe rapid Lean Agile Procurement cycles, but they are practitioner cases, not independent comparative studies. Ferdows, Lewis, and Machuca describe Zara's responsive supply network, not an AI-procurement replacement of tenders. These cases motivate mechanisms only and are not evidence about PZP.

## 7. Empirical agenda

Validation requires event-level observations within organizations. The primary outcome should be procurement-cycle days from auditable timestamps. Secondary outcomes should include effort hours by role, bidder participation, price benchmarks, amendments, renegotiation cost, bypass evidence, audit findings, and supplier performance. Estimate components separately before monetization. Use within-organization and category controls where possible; do not calibrate against ProcuraCost's own output.

## References

Agile Business Consortium. (n.d.). *Case study: Swiss Casinos* [Practitioner case]. Accessed 14 July 2026. https://www.agilebusiness.org/resource/case-study-swiss-casinos.html

Agile Business Consortium. (2021). *Air France uses Lean Agile Procurement to outsource a critical project* [Practitioner case]. https://www.agilebusiness.org/resource/air-france-uses-lean-agile-procurement-to-outsource-a-critical-project/

Bajari, P., Houghton, S., & Tadelis, S. (2014). Bidding for incomplete contracts: An empirical analysis of adaptation costs. *American Economic Review, 104*(4), 1288–1319. https://doi.org/10.1257/aer.104.4.1288

Beuve, J., Moszoro, M. W., & Spiller, P. T. (2023). Doing it by the book: Political contestability and public contract renegotiations. *Journal of Law, Economics, and Organization, 39*(1), 281–308. https://doi.org/10.1093/jleo/ewab039

Coviello, D., & Mariniello, M. (2014). Publicity requirements in public procurement: Evidence from a regression discontinuity design. *Journal of Public Economics, 109*, 76–100. https://doi.org/10.1016/j.jpubeco.2013.10.008

European Commission. (2011). *Public procurement in Europe: Cost and effectiveness* (PwC, London Economics, & Ecorys).

Ferdows, K., Lewis, M. A., & Machuca, J. A. D. (2004, November). Rapid-fire fulfillment. *Harvard Business Review* (Reprint R0411G). https://hbr.org/2004/11/rapid-fire-fulfillment

Fazekas, M., & Blum, J. R. (2021). *Improving public procurement outcomes: Review of tools and the state of the evidence base* (Policy Research Working Paper No. 9690). World Bank.

Holmström, B., & Milgrom, P. (1991). Multitask principal–agent analyses: Incentive contracts, asset ownership, and job design. *Journal of Law, Economics, & Organization, 7*(Special Issue), 24–52. https://doi.org/10.1093/jleo/7.special_issue.24

Lipsky, M. (1980). *Street-level bureaucracy*. Russell Sage Foundation.

Ryanair Holdings plc. (2003). *Annual report and financial statements 2003*. https://www.ryanair.com/doc/investor/2003/2003annualreport.pdf

Szucs, F. (2024). Discretion and favoritism in public procurement. *Journal of the European Economic Association, 22*(1), 117–160. https://doi.org/10.1093/jeea/jvad017

Vaughan, D. (1996). *The Challenger launch decision*. University of Chicago Press.

### Legal sources

Ustawa z dnia 11 września 2019 r. – Prawo zamówień publicznych, as amended through 2026. The application threshold is 170,000 PLN net from 1 January 2026.

Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r., M.P. 2025 poz. 1247 (EU thresholds for 2026–2027).
