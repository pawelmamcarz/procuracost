# Research Paper – 8–10 Week Action Plan (June – Mid-August 2026)

**Goal**: By mid-August 2026 have an evidence-audited conceptual-methodological draft, a reproducible model package, and pilot-ready empirical instruments. Journal submission readiness requires external review and primary-data progress.

**Positioning decision — approved 20 June 2026**: Paper 1 is conceptual-methodological and uses simulations only to demonstrate model mechanics and sensitivity. Paper 2 performs empirical validation with organizational data. Paper 1 must not present model outputs as estimated effects.

**Contribution hierarchy — approved 20 June 2026**: the auditable candidate measurement instrument is the primary contribution. Tunnel vs. Field is secondary framing, not the main theoretical claim.

**Unit of analysis — approved 20 June 2026**: one procurement event or contract. Organizations are grouping units with multiple nested events.

**Primary comparison — approved 20 June 2026**: within-organization matched pairs of two real procurement events. Model-generated counterfactuals are diagnostic only and cannot serve as empirical outcomes.

**Primary exposure — approved 20 June 2026**: continuous event-level `observed_rigidity_index`. Binary path labels are descriptive, and ProcuraCost rigidity constants cannot be reused as empirical measurements.

**Index weighting — approved 20 June 2026**: equal weights across preregistered normalized components, with component reporting and outcome-blind sensitivity analyses. Codebook: `docs/research/observed_rigidity_codebook.md`.

**Outcome hierarchy — approved 20 June 2026**: observed procurement cycle days is primary. Role effort, renegotiation, commercial/TCO, bypass, compliance/audit, and supplier performance are secondary. Aggregate ProcuraCost PLN is exploratory only.

**Primary outcome clock — approved 21 June 2026**: formal authorization of need and budget to first binding supplier commitment. Pre-authorization and post-commitment implementation durations are secondary.

**Pause treatment — approved 21 June 2026**: subtract no holds from primary elapsed calendar time. Code pauses separately; external-hold-adjusted net time is secondary and preregistered.

**Timestamp quality — approved 21 June 2026**: primary analysis requires exact auditable endpoints for both events. Interval-censored dates and respondent recall are secondary; point/model imputation is prohibited.

**Primary estimand — approved 21 June 2026**: percentage cycle-time difference per 0.10 higher observed rigidity, estimated within matched pairs on log cycle time. Pilot analysis is descriptive and makes no significance claims.

**Pilot role — approved 21 June 2026**: instrument development and feasibility only. Outputs are frozen codebooks, data schema, reliability/missingness metrics, and power-planning inputs; no substantive effect estimate.

**Sample separation — approved 21 June 2026**: pilot events are permanently excluded from confirmatory primary analysis. Confirmatory collection starts only after codebooks, schema, eligibility, SAP, and sample-size rationale are frozen.

**Organization holdout — approved 21 June 2026**: confirmatory primary analysis recruits new organizations with no pilot instrument-development involvement. Pilot organizations and their controlled group entities are excluded by default.

**Confirmatory population — approved 21 June 2026**: one country and one procurement/legal regime. Public/private/PZP and international observations are not pooled in the primary estimate.

**Selected first population — approved 21 June 2026**: strategic private-sector procurement in Poland, governed by internal corporate rules and outside PZP for the focal event. Direct and Indirect Upstream events are eligible; Downstream and public procurement are later replications.

**Event sampling — approved 21 June 2026**: complete universe of qualifying events from a frozen archival window in each organization. No CPO/researcher nomination for primary analysis; eligibility, exclusions, and matching are outcome-blind and auditable.

**Archival window — approved 21 June 2026**: common 24-month window before one frozen extraction cutoff, membership by binding-commitment date. No organization-specific extension; open events are counted as a selection diagnostic.

**Matching — approved 21 June 2026**: versioned outcome-blind exact/coarsened plus nearest-neighbor algorithm. Expert review may reject with a coded reason but cannot manually replace a pair. Protocol: `docs/research/matching_protocol.md`.

**Exposure contrast — approved 21 June 2026**: matched pairs require a frozen minimum ORI difference. Provisional threshold 0.20; final value comes from outcome-blind pilot reliability and overlap diagnostics.

**Matching replacement — approved 21 June 2026**: primary pairs are formed without replacement; one event may appear in at most one pair. With-replacement matching is sensitivity-only.

**Pair assignment — approved 21 June 2026**: balance-constrained maximum-cardinality matching followed by minimum total covariate distance; deterministic hashed-ID tie-break. Greedy record-order matching is prohibited.

**Mandatory calipers — approved 21 June 2026**: candidate pairs must pass provisional limits for log value (`<= 0.50`), complexity/supply risk/strategic importance (`<= 1` scale point), technology (same or adjacent), and commitment date (`<= 12` months). Final values are frozen from outcome-blind pilot overlap and balance diagnostics only.

**Organization pair minimum — approved 21 June 2026**: one final eligible pair is sufficient for primary-analysis inclusion. Retain additional pairs with organization-aware uncertainty; prioritize the number of independent organizations in power planning rather than requiring three pairs per organization.

**Global balance gate — approved 21 June 2026**: freeze SMD denominators from the eligible pre-match pool and enforce every `|SMD| <= 0.10` constraint inside the matching optimization. Do not remove individual organizations to chase balance. If no feasible solution reaches the preregistered powered sample-size floor, do not report a primary effect.

**Sample-size method — approved 21 June 2026**: use prospective simulation of the frozen clustered estimator, including unequal pairs per organization, ORI contrast, variance, dependence, evidence/matching yield, missingness, and attrition. Pilot data inform nuisance ranges only; the simulated effect is justified independently. Freeze organization and pair floors before confirmatory recruitment.

**Minimum important effect — approved 21 June 2026**: power the confirmatory study for a 10% cycle-time difference per `+0.10 ORI` (`beta_MSI = ln(1.10) / 0.10`), equivalent to 21% across a `0.20` ORI contrast. Pilot estimates cannot revise this threshold.

**Power target — approved 21 June 2026**: require 90% power for the minimum important effect under the conservative simulation scenario, using a two-sided primary test with `alpha = 0.05`.

**Primary inference — approved 21 June 2026**: OLS on log cycle time with pair fixed effects, organization-clustered bias-reduced `CR2`, and Satterthwaite degrees of freedom. Wild cluster bootstrap and multilevel models are sensitivity analyses only.

**Primary covariate adjustment — approved 21 June 2026**: the primary regression contains only continuous ORI and pair fixed effects. A frozen model adding non-collinear within-pair matching covariates is sensitivity-only; stepwise or outcome-driven term selection is prohibited.

**Primary weighting — approved 21 June 2026**: assign unit weight to each matched event. Use organization-clustered uncertainty; equal-total-organization weighting and leave-one-organization-out estimates are prespecified influence sensitivities only.

**Spend-type pooling — approved 21 June 2026**: estimate one common primary ORI coefficient across Direct and Indirect Upstream events, with exact `spend_type` matching inside pairs. The interaction and stratum-specific estimates are heterogeneity analyses, not co-primary claims.

**Primary functional form — approved 21 June 2026**: use a linear ORI term in the primary log-time model. A three-knot restricted cubic spline, frozen before outcome unblinding and restricted to observed support, is sensitivity-only.

**Post-freeze outcome invalidation — approved 21 June 2026**: a failed Tier A endpoint removes the full pair, with no imputation, rematching, or reserve partner. Recheck balance and powered sample floors; failure means no primary effect report.

**ORI missingness — approved 21 June 2026**: all six components are required. No imputation, prorating, available-component averaging, or weight renormalization; one missing component excludes the event and complete pair. Prescored rubric-defined `not_applicable` is reported separately.

**ORI double coding — approved 21 June 2026**: independently code 100% of confirmatory events by two trained, outcome-blind coders who cannot see pair membership or each other's scores. Preserve raw records and measure reliability before resolution.

**ORI adjudication — approved 21 June 2026**: a third blinded adjudicator independently resolves every component disagreement using the rubric and evidence, without seeing prior values. Preserve all raw records; use the completed final ORI for matching and never average disagreements.

**ORI reliability gate — approved 21 June 2026**: require aggregate raw-score `ICC(A,1) >= 0.80` and each component reliability `>= 0.70`, using weighted kappa or `ICC(A,1)` as appropriate. Report 95% confidence intervals; every component must pass before matching.

**ORI reliability failure — approved 21 June 2026**: permit one full blinded recoding by a new coder pair under the unchanged codebook. A second fail means no matching or primary effect; a rubric change requires a new confirmatory organization holdout.

**ORI evidence minimum — approved 21 June 2026**: every component requires a contemporaneous artifact or system trace with auditable provenance. Interviews may clarify but cannot solely determine a primary score; interview-only support is missing and excludes the pair.

**ORI reference time — approved 21 June 2026**: score constraints effective at formal need-and-budget authorization, the primary cycle start. Later changes are timestamped process descriptors and cannot rewrite baseline exposure.

**Exception-use separation — approved 21 June 2026**: `ORI_EXCEPTION` covers only baseline route availability and restrictions. Actual exception use, bypass, escalation, or work-around is a post-start mechanism/secondary outcome and cannot enter ORI or matching.

**Mechanism-analysis status — approved 21 June 2026**: analyze post-start exceptions, bypass, escalation, and work-arounds descriptively/as associational mechanisms only. No causal mediation or natural direct/indirect effect claims in the first confirmatory study.

**Secondary-outcome multiplicity — approved 22 June 2026**: cycle time is the sole confirmatory test. All secondary, subgroup, mechanism, and sensitivity results remain exploratory, with complete estimates and 95% intervals but no significance labels or post hoc promotion.

**Confidential-data reproducibility — approved 22 June 2026**: release code, frozen methods, schema-identical synthetic data, aggregate outputs, and keyed source-manifest digests. Keep sensitive records in a controlled environment and require an independent signed reproduction audit tied to code/data/output hashes.

**Preregistration timing — approved 22 June 2026**: public immutable registration precedes the first confirmatory recruitment and extraction. Register every frozen artifact and hash; preserve the original and publish additive amendments with rationale, data state, and blinding state. Manifest: `docs/research/confirmatory_preregistration_manifest.md`.

**Recruitment stopping — approved 22 June 2026**: recruit complete preregistered batches until both powered organization and balance-feasible pair floors are met, subject to a frozen maximum cap. Use no outcomes, finish the terminal batch, and run no primary test if either floor remains unmet at the cap.

**Organization invitation order — approved 22 June 2026**: hash an eligible frame, stratify by sector and size, and randomize invitations within strata using a registered seed. Refusals/nonresponses advance only to the next frozen entry; log the full recruitment flow.

**Organization nonresponse audit — approved 22 June 2026**: compare participation by sector, size, region, and other universally available frame fields; publish standardized differences and a preregistered response model. Participation weighting is sensitivity-only.

**Net-cycle external holds — approved 22 June 2026**: subtract only exact auditable unrelated legal/regulatory suspensions, force majeure, or shared external critical-infrastructure outages. Merge overlaps; all ordinary internal, supplier, market, logistics, waiting, and disputed delays remain included.

**Sub-day cycle durations — approved 22 June 2026**: retain every strictly positive elapsed duration as fractional days (`seconds / 86400`) with full precision. Zero/negative values invalidate the pair; no one-day floor or analytical rounding.

This plan assumes you can dedicate **15–25 hours per week** to the paper track.

---

## Week-by-Week Plan

### Week 1 (June 2026) – Foundations & Model Freeze

**Primary Objectives**
- Freeze model v1.2 after the evidence audit
- Start formal mathematical appendix
- Begin literature review expansion

**Tasks**
1. **Model Freeze**
   - Tag the reviewed model as `model-v1.2`
   - Export full parameter table from the app (use existing MODEL_PARAMETERS.md as base)
   - Document all changes introduced by the Direct/Indirect + Upstream/Downstream dimensions

2. **Mathematical Appendix (start)**
   - Create `docs/research/model_specification_draft.md`
   - Write sections for:
     - Cost components (time, coordination, opportunity, productivity, renegotiation, bypass, TCO)
     - How the 2×2 dimensions modify each component
   - Focus first on staff-hour and calendar-time adjustments (these are the most novel)

3. **Literature Review Gaps**
   - Identify 8–10 key papers that must be added (focus on TCE in procurement, behavioral public administration, digital governance)
   - Create a shared Zotero/Mendeley group or Notion database

**Deliverables by end of Week 1**
- Model v1.2 reviewed and tagged
- First 40% of mathematical appendix draft
- Literature gap list (with priorities)

---

### Week 2 – Hypotheses + Survey Instrument v0.1

**Primary Objectives**
- Finalize 6–8 testable propositions
- Draft first version of the survey

**Tasks**
1. **Hypotheses**
   - Write the document `docs/research/testable_propositions_v1.md`
   - For each proposition: 
     - Theoretical justification
     - Operationalization (how it will be measured)
     - Data source (secondary vs primary)
     - Expected direction and effect size

2. **Survey Design (v0.1)**
   - Create `docs/research/survey_v0.1.md`
   - Core modules:
     - Procurement category classification (Direct/Indirect + Upstream/Downstream)
     - Time allocation by role and step (the most important module)
     - Delay cost perception
     - Renegotiation experience
     - Bypass behavior (frequency + reasons)
   - Aim for max 12–15 minutes completion time

3. **Begin mapping to ProcuraCost parameters**
   - Create a crosswalk table: Survey question → Model parameter(s)

**Deliverables**
- 6–8 propositions with justification
- Survey v0.1 (full draft)
- Crosswalk table

---

### Week 3 – Interview Protocol + Pilot Protocol

**Primary Objectives**
- Complete interview guide
- Design pilot case study protocol
- Start outreach to pilot organizations

**Tasks**
1. **Interview Protocol**
   - Create `docs/research/interview_protocol_v1.md`
   - Sections:
     - Opening (procurement philosophy)
     - Specific high-stakes decisions (use the 2×2 framework)
     - Behavioral mechanisms (compliance theater, enforcement fallacy, etc.)
     - Technology as compliance infrastructure
   - Prepare 8–10 core questions + follow-ups

2. **Pilot Case Study Protocol**
   - Create `docs/research/pilot_case_study_protocol.md`
   - Standard template that forces the organization to provide data in ProcuraCost format
   - Include consent language and data anonymization rules

3. **Outreach**
   - Prepare a short outreach email (1 page) for potential pilot organizations
   - Identify first 5–7 target organizations (mix of sectors)

**Deliverables**
- Interview protocol v1
- Pilot case study protocol + consent form
- Outreach list + email template

---

### Week 4 – Replication Package v0.8 + Researcher Export Spec

**Primary Objectives**
- Build the foundation of the replication package
- Design the "Researcher Export" feature in the app

**Tasks**
1. **Replication Package Structure**
   - Create folder `replication/` in the repo
   - Define exact structure (see `docs/research/replication_package_spec.md`)
   - Start populating:
     - `parameters/` (full table with sources)
     - `synthetic_data/` (start with 1–2 case studies)
     - `code/` (frozen versions of key functions)

2. **Researcher Export Feature**
   - Write detailed specification: `docs/research/researcher_export_spec.md`
   - Decide on output format (JSON schema + CSV)
   - Define which variables must be included (all inputs + all intermediate calculations + effective multipliers)
   - Plan UI (button in calculator + in Assumptions Explorer)

3. **Parameter Documentation**
   - Complete the full `docs/MODEL_PARAMETERS.md` with every parameter used in the paper

**Deliverables**
- Replication package skeleton + 30–40% populated
- Detailed spec for Researcher Export feature
- Updated MODEL_PARAMETERS.md

---

### Week 5 – Survey Pilot + First Draft of Measurement Section

**Primary Objectives**
- Pilot the survey with 15–25 people
- Write the first draft of the "Measurement and Operationalization" section for the paper

**Tasks**
1. **Survey Pilot**
   - Distribute survey v0.1 to 15–25 procurement professionals (use LinkedIn + personal network)
   - Collect feedback on clarity, length, and missing constructs
   - Produce survey v0.9

2. **Paper Writing – Measurement Section**
   - Draft `sections/measurement.md` (target 1500–2000 words)
   - Describe ProcuraCost as a formal measurement model
   - Explain how the 2×2 dimensions are operationalized
   - Discuss limitations of the current parameterization

3. **Continue replication package**
   - Regenerate and review data for every built-in illustrative archetype

**Deliverables**
- Survey v0.9 (with pilot feedback summary)
- First draft of "Measurement and Operationalization" section
- Replication package at ~60% completeness

---

### Week 6 – Interview Pilot + Hypotheses Refinement

**Primary Objectives**
- Conduct 3–5 pilot interviews
- Refine hypotheses based on early qualitative insights
- Advance replication package

**Tasks**
1. **Pilot Interviews**
   - Conduct 3–5 interviews using the protocol
   - Transcribe key passages
   - Update interview protocol based on what worked/didn't

2. **Hypotheses Iteration**
   - Revise propositions based on pilot insights
   - Add or drop 1–2 propositions if needed
   - Produce `testable_propositions_v2.md`

3. **Paper Writing**
   - Expand the literature review with at least 6–8 new high-quality references

**Deliverables**
- Pilot interview summary (anonymized)
- Hypotheses v2
- Updated literature review draft

---

### Week 7 – Full Replication Package + App Feature Development

**Primary Objectives**
- Complete replication package v1.0
- Implement first version of "Researcher Export" in the app (if development capacity allows)

**Tasks**
1. **Replication Package v1.0**
   - Finalize all synthetic data
   - Add README with exact instructions to reproduce every number in the paper
   - Tag release `replication-v1.0`

2. **App Development (Researcher Export)**
   - Implement the export functionality (or at minimum a high-fidelity prototype)
   - Test with real scenarios

3. **Supervisor Pitch Document**
   - Create first draft of the 1–2 page "Supervisor Pitch"

**Deliverables**
- Replication package v1.0 (public)
- Researcher Export feature live (or advanced prototype)
- Supervisor Pitch v0.8

---

### Week 8 – Full Paper Draft (First Complete Version)

**Primary Objectives**
- Produce a complete first draft of the paper (including new sections)

**Tasks**
1. **Paper Assembly**
   - Integrate all new sections:
     - Measurement and Operationalization
     - Expanded literature review
     - Updated Discussion with boundary conditions
   - Ensure all numbers are traceable to the replication package

2. **Internal Review**
   - Do a full self-review + ask 1–2 trusted people for feedback (even if informal)

3. **Finalize Supporting Documents**
   - Supervisor Pitch v1.0
   - Research Agenda companion document (4–5 pages)

**Deliverables**
- Complete paper draft v1.0 (target 15–20 pages + appendices)
- All supporting documents in good shape

---

### Week 9–10 – Refinement + Submission Preparation

**Tasks**
- Incorporate feedback from internal review
- Polish language and flow
- Prepare submission package for first target journal
- Finalize conference submissions (at least one abstract)
- Record a 10–12 minute video walkthrough of the model (optional but high signal)

**Deliverables**
- Paper draft v1.5 (ready for external review or submission)
- Conference abstract(s) submitted
- Full set of supporting materials

---

## Summary Timeline

| Week | Focus Area                          | Main Deliverable                     | Status |
|------|-------------------------------------|--------------------------------------|--------|
| 1    | Model freeze + Math appendix start  | Model v1.2 + Appendix draft 40%      |        |
| 2    | Hypotheses + Survey v0.1            | Propositions + Survey draft          |        |
| 3    | Interview protocol + Pilots outreach| Interview guide + Outreach list      |        |
| 4    | Replication package foundation      | Package skeleton + Parameter table   |        |
| 5    | Survey pilot + Measurement section  | Survey v0.9 + Measurement draft      |        |
| 6    | Interview pilots + Hypotheses v2    | Pilot insights + Propositions v2     |        |
| 7    | Full replication package            | Replication v1.0 + Export feature    |        |
| 8    | First full paper draft              | Paper v1.0                           |        |
| 9–10 | Refinement + Submission prep        | Paper v1.5 + Conference submissions  |        |

---

## Critical Dependencies & Risks

- Access to pilot organizations (biggest risk)
- Your available time (this plan assumes 15–25h/week)
- Development capacity for the "Researcher Export" feature

Would you like me to now create the actual template files (survey structure, replication package specification, Supervisor Pitch template) as separate documents? Or adjust the timeline / priorities?
