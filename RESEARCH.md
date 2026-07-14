# Procedural Rigidity and Adaptive Procurement: A Transparent Decision Model

**Working paper — draft for review**
**Model:** ProcuraCost 2.1.0
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

Szucs (2024) studies a Hungarian reform that made a high-discretion procedure available below a value threshold. Because contract values were manipulated around the threshold, the raw discontinuity is not a valid causal RDD. The paper uses policy timing and a structural selection correction. Its main corrected estimates indicate that discretion increased normalized prices by about **6 percentage points** and selected contractors with about **28% lower measured productivity**. Earlier ProcuraCost text incorrectly stated approximately 10% productivity and inconsistently described the price estimate.

The revised model monetizes the price channel only. Productivity remains a separate observed outcome because converting it into contract-value loss would double count and require another unsupported mapping. Transfer from Hungarian public procurement to Polish or private procurement is represented by a 2–9% scenario range.

### 3.2 Contractual rigidity and renegotiation

Beuve, Moszoro, and Spiller (2023) examine French car-park contracts. Their 2SLS/IV result is an increase of **0.077–0.105 formal amendments per contract-year** for a one-standard-deviation increase in the reported rigidity categories, with rigidity instrumented by political contestability. It is a frequency, not a percentage-point event probability, and it does not measure procurement workflow formality. ProcuraCost therefore applies it only to a separate contract-rigidity profile, multiplies the frequency by contract duration, and excludes the sample mean as a universal cross-sector baseline.

### 3.3 Administrative cost, delay, TCO, and bypass

The European Commission's 2011 study estimates the total authority-and-supplier cost of EU procedures. It is useful as an external sanity-check, not as the incremental cost of rigidity.

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

- **Staff:** activity hours by role, headcount, loaded rate, and three declared broad context factors. Mandatory legal waits do not disappear and are not compressed by technology.
- **Admin:** non-labor administrative overhead plus equal tool cost when both paths use the same technology; it excludes role hours already counted under staff.
- **Delay:** elapsed days times a user-supplied daily cost of inaction.
- **Selection:** contract value times the discretion price scenario and residual competition risk.
- **Amendments:** annual formal-amendment frequency \(\lambda_j\) times contract duration \(H\) and a user-supplied cost per amendment.
- **TCO:** a declared three-year cumulative savings-pool scenario, scaled by `min(horizon years / 3, 1)`, times the share each path fails to capture; the central scenario is zero because no transferable estimate was identified.
- **Bypass:** user-supplied exposure times a scenario rate, scaled by system controls.

The shared baseline acquisition price is not added to either side: only modeled incremental selection loss enters the comparison. The central break-even daily inaction cost is \(-\Delta C_{non-delay}/(d_F-d_A)\) when the adaptive path is faster. Above that threshold, the central modeled total favors the adaptive path.

The low-delta scenario strengthens the governance case for formality: high discretion premium, no imported renegotiation effect, no TCO benefit, and a higher adaptive bypass rate. The high-delta scenario strengthens the adaptability case. These bounds are stress scenarios, not statistical intervals.

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
