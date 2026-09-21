# Procurement Workflow Design Under a Shared Governance Boundary

**Working paper, draft for review**

**Model:** ProcuraCost 2.3.0

**Updated:** 21 September 2026

## Abstract

ProcuraCost 2.3.0 compares the cost of two workflows for the same purchase under the same legal and governance boundary: formal/sequential and adaptive/compliant. Each alternative has its own process map and contract design. From declared inputs, the model calculates critical-path duration, staff costs by role, non-labour process costs, delay costs and specified contract costs. The decision record also identifies effects left outside the monetary calculation.

The calculation is deterministic. Inputs are classified as fixed, calibrated or stress values; the reported ranges are not statistical confidence intervals. Mandatory legal waits come from a dated ruleset and remain identical in both alternatives, regardless of system support. The cost difference is defined as formal/sequential total minus adaptive/compliant total. Swapping the alternatives must reverse its sign. These properties make the calculation reproducible, but do not establish whether either workflow causes a lower cost in practice.

Ten reference scenarios illustrate changes in sequencing, market consultation and discovery work, including the time and effort that learning may add. Two operational controls use identical maps and inputs. Official cases and practitioner observations inform the proposed mechanisms and research questions; any numerical use requires a separate evidence record.

## 1. Research question and scope

The research question is:

> Under a shared legal and governance boundary, when does the design of a procurement workflow change total modelled cost, and which inputs carry that difference?

ProcuraCost does not answer which procedure an organisation should select. It does not infer legal admissibility from a cost result, infer organisational readiness from system support, or convert a practitioner account into a calibration parameter. Public-procurement comparisons must remain within the applicable PZP context. A comparison between a lawful competitive procedure and an unavailable exemption is outside the model boundary.

The output allows the user to:

1. make the compared process maps and legal waits explicit;
2. identify the cost drivers and assumptions responsible for a difference;
3. disclose monetary coverage and dimensions left outside the calculation;
4. formulate questions that can be tested against event-level procurement data.

## 2. Conceptual framework

A procurement policy defines objectives and constraints. A legal and governance boundary specifies authority, competition, ethics, documentation and other applicable obligations. A procedure family identifies an admissible method. A procurement workflow design orders and connects the work performed within that method. A contract design allocates commercial and adaptation mechanisms. The purchase execution channel and system support describe how the work is carried out.

Model 2.3.0 records seven decision areas separately:

- **Legal and governance boundary:** private policy, public internal rules, PZP classic national or PZP classic EU.
- **Procedure family:** the declared procurement method, kept separate from workflow topology and subject to the model's supported legal scope.
- **Purchase archetype:** standardised recurring purchase, incomplete requirement, complex service, continuity-critical purchase or capital investment.
- **Procurement workflow design:** an independent directed process map for each alternative.
- **Purchase execution channel:** sourcing event, catalogue call-off, MRP release or a declared custom channel.
- **System support:** manual, sourcing platform, transactional ERP or integrated source-to-pay.
- **Contract design:** competition transfer, contract amendment, TCO and informal bypass dimensions, each with an explicit monetary status.

The Tunnel and Field metaphor is secondary. A tunnel represents a prescribed sequence. A field represents alternative sequencing inside the same enforced boundary. The metaphor does not imply that adaptive work lacks controls or that sequential work is intrinsically inefficient.

The analysis distinguishes five constructs:

1. workflow burden and critical-path duration;
2. competitive access and supplier selection;
3. contractual adaptability;
4. system-enabled execution and controls;
5. organisational implementation readiness.

## 3. Evidence audit

### 3.1 Competition transfer

Szucs (2024) studies a Hungarian reform that made a high-discretion invitational procedure available below a value threshold of 25 million HUF. The paper uses policy timing and a structural selection correction because contract values were manipulated around the threshold. Its structural estimates indicate approximately 6% higher prices and selection of contractors with 28% lower productivity under discretion. The probability that a right-connected firm wins rises by approximately 11 percentage points. The raw discontinuity is not a valid causal regression discontinuity design and reports different magnitudes.

ProcuraCost monetises the price channel only. Productivity remains a separate outcome because converting it into contract-value loss would require another unsupported mapping and could double count the price effect. The active 2%, 6% and 9% range is a declared transfer stress. It applies only where the compared alternatives genuinely differ in competitive access. It is not a Polish estimate and is not a general coefficient for adaptive procurement.

**Historical correction:** model 2.2 replaced the correctly reported productivity effect in model 2.1 with 10% and assigned 28 percentage points to the connected-winner outcome. Model 2.3 restores the two source outcomes reported above. The correction does not change its calculation, which monetises only the price channel.

### 3.2 Contract amendments

Beuve, Moszoro and Spiller (2023) examine French car-park contracts. Their 2SLS/IV analysis relates contractual rigidity to the annual frequency of formal amendments. The outcome is amendments per contract-year, not the probability of an amendment; the rigidity index sums seven category z-scores. It does not measure procurement workflow formality and cannot be applied directly to a hand-authored zero-to-one profile. No numerical effect is transferred here: the precise magnitude requires reconciliation between the prose and the printed coefficients in the accessible author version (section 6.2 and Table 4).

Earlier ProcuraCost versions used the study as an order-of-magnitude anchor. Native model 2.3.0 does not allocate a contract-amendment differential. The central, low and high values remain zero until a supported signed allocation convention is introduced. The study remains relevant to research design, not to the active scenario calculation.

### 3.3 Administrative effort and delay

The European Commission's 2011 study estimates authority and supplier effort for EU procurement procedures. The model 2.2.2 calibration audit compared the former `pzp_eu` template with the full report and found its authority-side person-days within the report's published distribution. That audit supports order of magnitude only. It does not validate the active 2.3 process maps, non-labour overheads or role rates.

Delay remains an accounting identity between critical-path elapsed days and a declared cost per day of inaction. It is not a measured effect of procedure type. Coviello and Mariniello (2014) found that publicity increased participation and detected no adverse effect on the probability of late delivery of the contracted works in their setting. That outcome is distinct from the duration of the procurement procedure; it does not establish whether publicity lengthens or shortens the procurement cycle.

**Historical calibration result:** under the model 2.2.2 combined stress envelope, all ten then-active scenarios crossed zero. Where workflow duration differed, the delay bucket carried most of the absolute central difference, while the process bucket alone favoured the formal path in seven scenarios. These figures describe the archived 2.2.2 templates and must not be presented as results of the native 2.3 scenario registry.

### 3.4 TCO and informal bypass

No verified peer-reviewed source supports a universal TCO saving rate for adaptive procurement. Native model 2.3.0 therefore allocates no TCO differential. The fleet scenario frames which lifecycle inputs should be assembled, but it does not assume that one workflow captures more value.

Lipsky (1980), Vaughan (1996), and Holmström and Milgrom (1991) can motivate hypotheses about workarounds and distorted incentives. They do not provide an informal-bypass probability. Native model 2.3.0 discloses informal bypass as a non-monetised dimension. Any future allocation would require observed or user-supplied evidence and a new signed allocation convention.

### 3.5 Official cases

The active evidence registry includes four official sources:

- California's account of modular technology procurement, used to frame modular contracting, supplier access and contract adaptability;
- the OECD account of problem definition in Lithuania's Republican Vilnius University Hospital pilot, used to frame problem definition, market consultation and role effort;
- the Polish Public Procurement Office material on preliminary market consultation, used to frame lawful market learning;
- European Commission guidance on innovation procurement, used to frame innovation procurement, market consultation and contract adaptability.

These sources support the existence of mechanisms and implementation questions. They do not establish the monetary values in a ProcuraCost scenario and do not prove a causal advantage for the adaptive/compliant alternative.

## 4. Native model 2.3.0

### 4.1 Process maps and critical path

For alternative \(j \in \{F,A\}\), the workflow is a directed acyclic graph. Each step contains calibrated active days, queue days, role hours and non-labour cost. Its predecessor identifiers define the graph.

For range case \(k \in \{low, central, high\}\), the finish time of step \(s\) is:

\[
t_{s,j}^{k}=a_{s,j}^{k}+q_{s,j}^{k}+\max_{p\in pred(s)}t_{p,j}^{k}.
\]

For a step without predecessors, the predecessor maximum is zero. The elapsed duration \(T_j^k\) is the maximum finish time across the map. Planned rounds of discovery or rework must be represented as separate finite steps; the acyclic map does not simulate open-ended loops. Role and non-labour costs include all steps, not only the critical path:

\[
C_{role,j}^{k}=\sum_s\sum_r h_{s,r,j}^{k}w_r^{k},
\qquad
C_{nonlab,j}^{k}=\sum_s n_{s,j}^{k}.
\]

Delay cost is:

\[
C_{delay,j}^{k}=T_j^k c_d^k.
\]

The engine rejects cycles, unknown predecessors, invalid calibrated ranges, missing role rates and modifications to locked legal waits.

The values in five reference maps have two sources within the model's history. Fleet, ERP,
logistics and critical-material maps retain the former `44/24` aggregate base-day
totals; public IT retains `42/26` non-legal days. Model 2.3 introduces the step
order, division of those totals across steps and role-hour allocations as
`illustrative_scenario` inputs. Retained support multipliers, coordination costs
and tool costs are then applied to those allocations. The internal provenance
record identifies which values were retained and which were introduced. Official cases support only the named
mechanisms; they provide none of these numerical inputs.

### 4.2 Contract cost and monetary coverage

Contract design contains four named dimensions: competition transfer, contract amendment, TCO and informal bypass. Every dimension must be either monetised with a traceable calibrated value or reported as not monetised with a reason.

The alternative total is:

\[
C_j^k=C_{role,j}^{k}+C_{nonlab,j}^{k}+C_{delay,j}^{k}+C_{contract,j}^{k}.
\]

In the native starting points, competition transfer is the only non-zero contract allocation. It appears only in the stable standard-service sensitivity, which explicitly compares open policy-qualified competition with a restricted shortlist or incumbent continuation and identifies the restricted alternative. The allocation can be reversed or removed; it is never inferred from a workflow label. Contract amendment and TCO are fixed at zero. Informal bypass is not monetised.
Bajari, Houghton and Tadelis (2014) estimate adaptation costs in incomplete
contracts; that evidence motivates the contract-design dimension, but the
native model monetises no amendment differential without a signed allocation
convention.

The decision record traces every monetary input to its source or declared
assumption. It lists internal workflow assumptions, external evidence and
non-monetised dimensions separately, so that a reproducible calculation can
be distinguished from an empirically estimated input.

### 4.3 Difference and range semantics

The comparison identity is:

\[
\Delta C=C_F-C_A.
\]

Positive and negative signs are both admissible. The outer envelope is calculated conservatively from the two alternative ranges:

\[
\Delta C_{low}=C_F^{low}-C_A^{high},
\qquad
\Delta C_{high}=C_F^{high}-C_A^{low}.
\]

This is a declared scenario envelope, not a confidence interval. Swapping the two alternatives must swap their results, negate the central difference and reverse the envelope. The test guards algebraic neutrality; it does not validate the calibration.

Opposite endpoints can combine different values of inputs shared by both alternatives. An envelope crossing zero therefore does not establish that the sign can reverse under a common feasible input setting. That requires a separate comparison with shared inputs varied together. Even identical alternatives can have a non-zero-width outer envelope while their matched-input difference remains zero.

### 4.4 Legal and governance boundary

Legal resolution uses the declared initiation date and the versioned `pl-pzp-2026-2027` ruleset. Mandatory waits include source provenance and fixed active and queue days. Where a wait applies, it appears with identical values in both alternatives and cannot be edited or removed. System support cannot shorten it.

The current legal resolver covers classic procurement contexts within its declared national and EU scope. Sectoral and defence/security regimes fail closed. Missing public-procurement declarations and incompatible combinations also block calculation. ProcuraCost does not replace legal analysis.

## 5. Reference scenarios and interpretation

The ten canonical scenarios are structured starting points:

1. `fleet_tco_reframing`
2. `erp_transformation_discovery`
3. `logistics_service_redesign`
4. `critical_material_continuity`
5. `public_it_open_with_market_consultation`
6. `stable_private_standard_service`
7. `stable_capex_replacement`
8. `discovery_solution_codesign`
9. `catalog_calloff_control`
10. `mrp_release_control`

Their economic values are labelled retained model 2.2.2 assumptions after
migration into the native schema. For the first five scenarios, aggregate
base-day totals are also retained, while step order, allocation of days and
role-hour allocations are illustrative model 2.3 inputs. Official evidence
attached to a scenario supports a mechanism, not the retained values or the new
numerical allocations. Users must assess whether each assumption is defensible
for the intended decision.

The ERP discovery, logistics redesign, public IT market-consultation and solution co-design scenarios examine work under incomplete requirements. Supplier input or consultation may help define the problem or change the proposed contract. The co-design scenario includes additional time and staff effort for that learning.

An adaptive workflow may add no distinct workflow value when the requirement is stable, the call-off is already governed by a framework or catalogue, or an MRP release simply executes an established commercial arrangement. The catalogue call-off and MRP release controls use identical maps and no supplier-access difference. They return equal alternative ranges, a zero central difference and a symmetric outer envelope. The stable standard-service starting scenario is a topology control only: its maps are identical, but it separately declares a restricted-access sensitivity and is therefore not a neutral total-cost control. The stable capital-replacement scenario also asks whether an adaptation mechanism is present rather than presuming one.

Legal availability must be assessed independently of cost. Organisational readiness is recorded separately through self-description.

## 6. Suitability and implementation readiness

The suitability comparison presents candidate procedure families associated with the declared boundary; it does not establish legal availability. Every candidate receives the same six qualitative criteria: legal boundary, requirement definition, competitive access, execution channel, workflow learning and system support. Candidate rows have equal visual and logical status. System support cannot change the candidate set or legal waits. Procedures whose statutory grounds are not evaluated are disclosed as withheld rather than scored.

Organisational implementation readiness is recorded through sixteen questions in eight domains: purpose, ownership, process, requirements, data and automation, governance, adoption, and value and rollout. Each response is `not_met`, `to_complete` or `confirmed`. Once all questions are answered, the module reports counts by response and domain. It does not validate the answers, aggregate them into an overall status or issue a go/no-go decision. The checklist has not been validated as a measurement instrument. Responses receive no points, percentages, weights or benchmarks and never enter the cost model.

## 7. Practitioner observation and hypothesis development

[Procurement&Beyond, episode 8](https://www.youtube.com/watch?v=5KYUdTLlvvg), published on 26 August 2026, is treated as a practitioner interview. The available Polish transcript was generated automatically by YouTube and has not been human-verified. No verbatim quotation from that transcript is used here.

The episode informs questions about:

- whether a named internal owner can sustain the implementation and translate the process for users;
- whether the organisation mapped process friction before selecting a system;
- whether requirements focus on material operational purchasing rather than marginal feature requests;
- whether obsolete approval chains are being reproduced in software instead of simplifying the policy and target process;
- whether the business case measures whole-life cost and adoption, not only licence or implementation cost;
- whether AI is confined to traceable support tasks, such as structuring market data, while a transparent deterministic model performs the TCO calculation.

These observations support question design and hypothesis generation only. They do not set ProcuraCost thresholds, weights, workflow durations, role rates or calibration ranges. In particular, Bielik may help structure source data for review, but the language model does not calculate the ProcuraCost result.

Testable hypotheses arising from this material include whether sustained internal ownership predicts adoption, whether pre-implementation friction mapping reduces unnecessary configuration, and whether policy simplification reduces approval burden without weakening boundary controls. These propositions require independent data.

## 8. Empirical agenda

Validation requires event-level observations within organisations. The primary outcome should be procurement-cycle duration from auditable timestamps. Secondary outcomes should include active effort hours by role, queue time, bidder participation, price benchmarks, contract amendments, renegotiation cost, lifecycle performance, process bypass evidence, audit findings and supplier performance.

The empirical design should estimate components before monetisation. It should preserve the distinction between active work and waiting, record system support without treating it as readiness, and compare lawful alternatives within the same governance boundary. Within-organisation and category controls are preferable where available. ProcuraCost outputs must not be used as calibration targets for the same model.
The evidence review by Fazekas and Blum (2021) informs the choice to study
individual components using event-level data rather than rely on comparisons
of aggregate organisational results.

## 9. Reproducibility

The model 2.3 replication generator produces three deterministic files: JSON, CSV and Markdown. JSON contains the full decision records, including assumptions, evidence, role rates, calculation anchors and legal provenance. CSV provides a stable row structure for analysis, including context, both alternatives, costs, coverage and migration status. Markdown presents those results for review. Generation timestamps are omitted so that repeated runs can be compared directly.

`npm run recompute` audits canonical metadata, ordered ranges, the delta identity, neutral controls and locked legal waits. `npm run sweep` performs an alternative-swap symmetry audit. `npm run replicate` regenerates the three active artefacts from the native scenario registry and engine. These checks establish code-path consistency, not empirical validity.

## References

Bajari, P., Houghton, S., & Tadelis, S. (2014). Bidding for incomplete contracts: An empirical analysis of adaptation costs. *American Economic Review, 104*(4), 1288–1319. https://doi.org/10.1257/aer.104.4.1288

Beuve, J., Moszoro, M. W., & Spiller, P. T. (2023). Doing it by the book: Political contestability and public contract renegotiations. *Journal of Law, Economics, and Organization, 39*(1), 281–308. https://doi.org/10.1093/jleo/ewab039

California Department of Technology. (2022). *California redefines state technology procurement*. https://www.cdt.ca.gov/newsroom/2022/08/california-redefines-state-technology-procurement/

Coviello, D., & Mariniello, M. (2014). Publicity requirements in public procurement: Evidence from a regression discontinuity design. *Journal of Public Economics, 109*, 76–100. https://doi.org/10.1016/j.jpubeco.2013.10.008

European Commission. (2011). *Public procurement in Europe: Cost and effectiveness* (PwC, London Economics, & Ecorys).

European Commission. (2021). *Guidance on innovation procurement*. https://public-buyers-community.ec.europa.eu/resources/guidance-innovation-procurement

Fazekas, M., & Blum, J. R. (2021). *Improving public procurement outcomes: Review of tools and the state of the evidence base* (Policy Research Working Paper No. 9690). World Bank.

Holmström, B., & Milgrom, P. (1991). Multitask principal-agent analyses: Incentive contracts, asset ownership, and job design. *Journal of Law, Economics, & Organization, 7*(Special Issue), 24–52. https://doi.org/10.1093/jleo/7.special_issue.24

Lipsky, M. (1980). *Street-level bureaucracy*. Russell Sage Foundation.

OECD. (2024). *Public procurement in Lithuania: Increasing efficiency through centralisation and professionalisation* (OECD Public Governance Reviews). https://www.oecd.org/en/publications/public-procurement-in-lithuania_aa1b196c-en/full-report/component-8.html

Procurement&Beyond. (2026, August 26). *Odcinek 8. Nawet najlepsze narzędzie nie uratuje złego wdrożenia* [Practitioner interview]. https://www.youtube.com/watch?v=5KYUdTLlvvg

Szucs, F. (2024). Discretion and favoritism in public procurement. *Journal of the European Economic Association, 22*(1), 117–160. https://doi.org/10.1093/jeea/jvad017

Urząd Zamówień Publicznych. (n.d.). *Wstępne konsultacje rynkowe*. https://www.gov.pl/web/uzp/wstepne-konsultacje-rynkowe

Vaughan, D. (1996). *The Challenger launch decision*. University of Chicago Press.

### Legal sources

Ustawa z dnia 11 września 2019 r. Prawo zamówień publicznych. The application threshold for classic contracts awarded by public contracting authorities is 170,000 PLN net from 1 January 2026 under [Dz.U. 2025 poz. 1173](https://eli.gov.pl/eli/DU/2025/1173/ogl). This is not a universal threshold for every procurement regime.

Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r., M.P. 2025 poz. 1247 (EU thresholds for 2026–2027).
