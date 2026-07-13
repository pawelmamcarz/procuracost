# Pilot Case Study Protocol v0.9

**Purpose**: Standardized template for event-level records from the first 3–4 pilot organizations. The goal is to produce comparable inputs for model calibration and the empirical Paper 2. Paper 1 uses the protocol as research infrastructure, not as completed empirical evidence.

**Unit of analysis**: one procurement event or contract. Each event receives a unique anonymized `procurement_event_id`; multiple events share an anonymized `organization_id`.

**Pilot purpose — approved 21 June 2026**: instrument development and feasibility only. Do not report p-values, significance, or a substantive rigidity effect from these organizations.

**Sample separation — approved 21 June 2026**: mark every event `study_phase = pilot_development`. Pilot events are permanently excluded from the confirmatory primary analysis, including after recoding under final rules.

**Organization holdout — approved 21 June 2026**: participating pilot organizations and, by default, controlled entities in the same corporate group are ineligible for confirmatory primary recruitment. Store a stable restricted identifier in the phase registry so anonymization does not cause accidental reuse.

The pilot may include different sectors or regimes to test coding feasibility. This does not authorize pooled confirmatory inference. Store `country` and `legal_regime` for every event.

The future confirmatory target is strategic private-sector procurement in Poland outside PZP. Pilot records from other populations test instrument coverage only.

Pilot organizations may nominate cases to test the instrument. Confirmatory organizations may not: they must provide the complete qualifying event universe from a frozen archival window under a versioned extraction query.

Use pilot frames to test the feasibility and balance of `docs/research/matching_protocol.md`. Do not select a preferred algorithm by comparing outcome effects.

Estimate index reliability and candidate-pair yield around the provisional `min_exposure_contrast = 0.20`. Freeze the final threshold without consulting cycle time or another outcome.

Test mandatory provisional calipers before pair assignment: absolute natural-log value difference `<= 0.50`; complexity, supply risk, and strategic importance differences `<= 1` point; same or adjacent technology environment; and binding-commitment dates within 12 calendar months. Report edge yield and balance under outcome-blind alternatives, then freeze final values without consulting outcomes.

Estimate how often a complete organizational frame yields at least one eligible pair and the full distribution of pairs per organization. The confirmatory inclusion minimum is one final pair; do not use pilot outcomes to create a higher organization-level pair threshold.

Calculate study-level pre-match and post-match SMDs without outcome access. The confirmatory solver maximizes pair cardinality subject to `|SMD| <= 0.10` for every frozen matching covariate, including each preregistered indicator level of categorical variables, using denominators frozen from the complete eligible pre-match pool. Use the pilot to test computational and sample feasibility, not to optimize balance against outcomes.

Collect nuisance and feasibility inputs for the prospective power simulation: log-cycle-time dispersion, within-organization dependence, distribution of pairs per organization, ORI contrast, Tier A timestamp yield, matching yield, missingness, and recruitment attrition. Report uncertainty ranges because 3–4 organizations cannot estimate these inputs precisely. Do not use the pilot effect estimate as the simulated confirmatory effect.

The confirmatory power effect is fixed independently at a 10% cycle-time difference per `+0.10` ORI (`beta_MSI = ln(1.10) / 0.10`). Pilot results cannot revise this threshold.

The confirmatory design targets 90% power with a two-sided `alpha = 0.05`. Use conservative pilot-informed nuisance ranges; do not choose only the parameter combination that produces the smallest recruitment target.

Implement the prospective simulation with the planned primary estimator: OLS on log cycle time with pair fixed effects, organization-clustered `CR2`, and Satterthwaite degrees of freedom. Use bootstrap and multilevel estimators only to test sensitivity-code feasibility.

Do not add matching covariates to the simulated primary outcome model. Separately test that the fully prespecified covariate-adjusted sensitivity model can be fitted without data-dependent term selection.

Use unit event weights in the simulated primary estimator. Also implement equal-total-organization weighting and leave-one-organization-out diagnostics as sensitivity code, recording how unequal pair counts affect precision and influence.

Simulate one common primary ORI coefficient across Direct and Indirect events while retaining exact within-pair `spend_type` matching. Record support for the secondary `ORI × spend_type` interaction; pilot effects cannot determine whether to pool.

Keep the simulated primary ORI effect linear on the log-time scale. Test code for a three-knot restricted cubic spline sensitivity, but do not use pilot outcome fit to choose knots or replace the linear primary form.

Estimate the rate at which endpoint audit would invalidate either event in an otherwise frozen pair. Model this as whole-pair attrition in the prospective power simulation. Do not test post-freeze rematching or primary-outcome imputation as rescue procedures.

Measure missingness separately for every ORI component and estimate whole-pair loss under the complete-six-component rule. Do not pilot prorated indices or outcome-driven imputation. Test every proposed `not_applicable` category for a clear rubric trigger and prespecified score.

Independently double-code every pilot event to test the confirmatory workflow. Coders remain blinded to outcomes, pair membership, and each other's values until lock. Preserve both raw records and calculate agreement before any reconciliation or adjudication.

Route every pilot component disagreement to a third blinded adjudicator who independently applies the rubric without seeing prior values. Measure adjudication burden and preserve all raw and final records; do not average coder scores.

Estimate aggregate raw-score `ICC(A,1)` and component reliability with 95% confidence intervals. Confirmatory readiness requires aggregate `ICC(A,1) >= 0.80` and every ordinal weighted-kappa or continuous `ICC(A,1) >= 0.70`; do not let aggregate reliability mask a failed component.

If the pilot misses a threshold, revise training or the versioned rubric and test again on a fresh outcome-blind pilot coding set. Confirmatory recruitment cannot start until the instrument passes. The later confirmatory phase permits only one full recoding under an unchanged codebook before a second failure terminates primary analysis.

For every component, capture a contemporaneous artifact or system trace, its source ID, effective dates, retrieval date, and exact source location. Interviews may locate and interpret these records but cannot stand alone. Estimate whole-pair loss under this evidence rule for power and recruitment planning.

Anchor primary ORI coding at the exact Tier A need-and-budget authorization timestamp. Separately record later policy changes, exceptions, system failures, escalations, and adaptations with their timestamps and sources. Test coder ability to keep these post-start events out of baseline scores.

For `ORI_EXCEPTION`, code only the ex ante route available at baseline. In a separate post-start table, capture actual exception use, bypass, noncompliance, escalation, and work-arounds. Test that coders do not leak these realized behaviors into ORI.

Use post-start variables to test mechanism timelines and descriptive tables only. Do not fit or present pilot causal-mediation models, and do not treat adjustment for realized exceptions or bypass as identifying a direct rigidity effect.

Treat every pilot and future secondary outcome as exploratory. Test complete-table generation with estimates and 95% intervals, but do not produce significance labels, select results by p-value, or rehearse post hoc promotion of a secondary endpoint.

Each pilot should deliver:
1. At least one matched pair of fully documented real purchases: one more procedurally rigid and one more bounded-flexible.
2. A structured narrative of the actual decision process vs. the formal procedure.
3. Rough but credible numbers for the model parameters.
4. Identification of data gaps for the full study.
5. Signed consent / anonymization agreement.
6. Feasibility metrics: eligible-pair yield, Tier A timestamp yield, missingness, coding time, inter-rater agreement, and respondent burden.

---

## Pilot Case Selection Criteria

- Mix: at least one public-sector / regulated, one large multinational, one Polish mid-sized company.
- Recent (last 18–24 months) so people still remember details.
- Both events in a pair come from the same organization and have observed outcomes.
- Match as closely as possible on category, value band, complexity, urgency, supply risk, legal regime, technology environment, and period.
- One event largely followed a rigid formal procedure; the paired event used a more bounded-flexible path.
- Bonus: at least one case with visible post-award renegotiation or measurable bypass.

Assign both records the same anonymized `matched_pair_id`. If no credible real match exists, retain the event for construct calibration but exclude it from matched effect comparisons.

---

## Data Collection Package (per case)

### A. Basic Descriptors (to be turned into ProcurementInputs)

- Contract / purchase name or internal reference (anonymized)
- Approximate contract value (PLN)
- TCO horizon they actually used or would have used (years)
- Process type category (PZP EU, national, private formal, policy-only, CAPEX, catalog/MRP, etc.)
- Tech level at the time (manual / sourcing tool / partial ERP / end-to-end)
- Chosen or reconstructed `spendType` (direct/indirect) and `processPhase` (upstream/downstream)
- Stakeholder profile: number of people and approximate daily rates (or total internal cost) by role (buyer, lawyer, finance, manager, executive, requestor/business owner)

### A2. Observed Rigidity Exposure (coded independently of ProcuraCost)

- Prescribed sequential gates and which were non-waivable.
- Required approval count and highest approval level.
- Prescribed minimum waiting periods, kept separate from realized lead time.
- Whether steps could be resequenced, parallelized, negotiated, or handled by an exception route.
- Required documentation, committee, and review burden.
- Source of every constraint: law/regulation, organization policy, local procedure, system configuration, or ad hoc decision.
- Contemporaneous evidence used for coding (policy version, workflow export, approval matrix, tender file, system log).

Store raw component values and the eventual `observed_rigidity_index` separately. Do not populate the empirical index from `PROCESS_RIGIDITY`, process labels, modeled duration, or the outcome variables.

Code against `docs/research/observed_rigidity_codebook.md`. Pilot coding may refine rubrics, but weights cannot be optimized against outcomes; freeze the codebook before confirmatory analysis.

### B. Timeline & Step-Level Reality (core for derive* functions)

For the actual path taken:

- List the main steps that actually happened.
- Calendar days per step (or total lead time from need identification to contract signature / first delivery).
- Mandatory waiting periods that were observed or waived.
- Rough hours spent by each role on each major step.
- Note which formal steps were eliminated, compressed, or run in parallel.

Use the step templates from `lib/process-templates.ts` as a starting checklist and mark deviations.

The team may separately reconstruct what another path would have required. Label every such value `counterfactual_model_input`; do not merge it with observed event fields or treat it as an empirical outcome.

### C. Cost & Outcome Data (for model calibration)

**Outcome hierarchy**:
- Primary: `observed_procurement_cycle_days` from retained timestamps. Keep raw timestamps and their source.
- Secondary: the event-level measures listed below.
- Exploratory only: aggregate ProcuraCost PLN total; never substitute it for an observed outcome.

- Best estimate of daily cost of inaction / delay for this purchase (what the business actually felt or calculated).
- Renegotiation cost (if any): direct extra cost + internal effort + time.
- Any known TCO-related savings or losses that were realized or foregone (price, quality, service levels, volume, relationship).
- Evidence or credible estimate of bypass / shadow process cost (audit exposure, extra coordination, lost opportunities, risk events).
- Final "was this a success?" judgment from the people involved (commercial outcome + compliance outcome).

Keep subjective judgments distinct from archival or system-derived measures. Record missing outcomes as missing rather than replacing them with ProcuraCost assumptions.

For the primary clock, collect `need_approved_at`, `budget_authorized_at`, and the first `binding_commitment_at`. Also collect first documented need and first usable delivery/go-live for secondary durations. Follow `docs/research/procurement_cycle_outcome_codebook.md` and retain document type, timestamp source, timezone, and precision.

Assign evidence tier A–D separately to each endpoint. A matched pair enters the primary analysis only when both endpoints for both events are Tier A. Preserve bounded intervals for Tier B and never replace them with midpoint estimates. Do not backfill timestamps from ProcuraCost or process templates.

Do not subtract pauses from primary cycle time. For each hold, collect start, end, initiator, reason code, evidence, and note. Any external-hold-adjusted duration is secondary and must follow the frozen codebook.

### D. Narrative – Actual Process vs. Formal Procedure

Write 1–2 pages covering:

- What the written policy said.
- What the formal procedure on paper required.
- What the team actually did and why (time pressure, market opportunity, existing relationship, belief that the formal path would destroy value, etc.).
- How the 2×2 context (Direct/Indirect + Upstream/Downstream) influenced the decision.
- What the compliance / audit function knew or didn't know at the time.
- Any post-award consequences (renegotiation, performance issues, internal reviews).

### E. 2×2 Reflection (explicit for the propositions)

- How did the Direct vs Indirect nature change the real cost drivers?
- How did the Upstream (strategic) vs Downstream (execution) nature change the amount of senior/legal effort and the bypass incentive?
- Would a different procedural choice within the same policy have produced a materially better or worse outcome on the dimensions the model tracks?

### F. Data Gaps & Lessons for Full Study

- What numbers were hardest to get or least reliable?
- Which assumptions in the current ProcuraCost model felt most questionable for this case?
- What additional data sources (internal reports, ERP extracts, TCO studies) would have made the reconstruction much stronger?

---

## Output Deliverables from Each Pilot

1. One structured case file per purchase (use the sections above + any supporting tables).
2. At least one full researcher export JSON captured live in the ProcuraCost tool using the reconstructed inputs (this becomes the synthetic_data seed).
3. Short organization-level memo (1 page): overall maturity of policy/procedure distinction, digital systems, and appetite for more flexibility.
4. Signed consent form (or recorded consent) covering anonymized academic use.
5. Cross-organization feasibility table with no effect estimate or significance test.

Consent and organizational agreements must separately state public-package contents, restricted-environment retention, independent-auditor access, disclosure review, and the prohibition on publishing raw artifacts or pseudonym keys unless explicitly authorized.

Complete the pilot, freeze all pilot-derived instrument and feasibility decisions, and populate `docs/research/confirmatory_preregistration_manifest.md` before any confirmatory recruitment contact or data extraction. Pilot organizations cannot be pre-enrolled as future confirmatory participants.

Use pilot recruitment rates, frame-processing burden, evidence yield, and pair yield to choose a confirmatory batch definition and maximum cap. Do not use pilot effect estimates. Test that the stopping script reads only eligibility, exposure, and pre-outcome fields and returns no primary test when either powered floor is unmet at the cap.

Before confirmatory registration, test whether an external organization frame can support objective eligibility, sector/size stratification, and randomized invitation order. Pilot relationship-based recruitment does not authorize convenience recruitment for confirmatory work. Estimate refusal and nonresponse by proposed stratum for recruitment planning only.

Verify that sector, size, region, invitation history, and final recruitment status can be retained lawfully for every framed organization. Test nonresponse tables and participation-weight code on synthetic recruitment data; pilot relationship-based response patterns cannot estimate the confirmatory effect.

Test pause coding against the frozen `net_cycle_days` rule. Only exact, auditable unrelated binding suspensions, force majeure, and external shared critical-infrastructure outages are subtractable. Measure disagreement and evidence yield; do not broaden categories using pilot outcome differences.

Test endpoint extraction at full timestamp precision. Preserve positive sub-day durations as fractions of 86,400 seconds and flag zero/negative orderings as invalid; never clamp them to one day. Verify that analysis and displayed rounding use separate fields.

The pilot's formal deliverable is an instrument-development report plus revised codebooks and schema. It is not a pilot efficacy paper.

Archive the pilot dataset separately from the future confirmatory dataset. Any exploratory reuse must retain the phase flag and be reported outside confirmatory estimates.

---

## Anonymization Rules

- Never store real contract numbers, supplier names, or individual names in the shared research package.
- Round monetary values and headcount appropriately.
- Use internal codes (e.g. "OrgA-Case1-Direct-Upstream") that the organization can still recognize internally.
- Any commercially sensitive TCO or renegotiation numbers can be provided as ranges or multipliers only.

---

## Timeline for Pilots (suggested)

- Week 1–2 of pilot phase: Identify and approach 4–6 candidate organizations (use outreach_email_pilots.md).
- Conduct interviews using the interview_protocol_v1.md.
- Within 2 weeks of interview: return the structured case file + researcher export JSON for their review and correction.
- After sign-off: add cleaned version to the replication package under `synthetic_data/`.

---

**Related documents**
- `docs/research/interview_protocol_v1.md`
- `docs/research/testable_propositions_v1.md`
- `docs/research/survey_crosswalk.md`
- `docs/research/replication_package_spec.md`
- Live tools: Calculator + Assumptions Explorer (for capturing the JSON during reconstruction workshops)

This protocol is intentionally lightweight for the pilot phase so we can learn what data is realistically obtainable before designing the full multi-case or survey+archival study.
