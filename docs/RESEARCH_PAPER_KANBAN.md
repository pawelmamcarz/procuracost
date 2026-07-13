# Research Paper – 8–10 Week Kanban Plan (June – Mid-August 2026)

**How to use this file:**
- Copy this into Notion, Obsidian, or a task manager.
- Check off items as you complete them.
- Each week has a clear "Definition of Done".

---

## Week 1 (June 2026) – Model Freeze + Math Appendix Start

- [ ] Tag reviewed model as `model-v1.2` in GitHub
- [ ] Export and clean full parameter table (Excel + Markdown)
- [ ] Document all 2×2 dimension effects in code
- [ ] Create `docs/research/model_specification_draft.md`
- [ ] Write first 40% of mathematical appendix (cost components + 2×2 adjustments)
- [ ] Create literature gap list (8–10 priority papers)

**Definition of Done**: Model v1.2 reviewed and frozen + appendix updated + literature gaps identified.

---

## Week 2 – Hypotheses + Survey v0.1

- [ ] Write `docs/research/testable_propositions_v1.md` (6–8 propositions)
- [ ] For each proposition: justification + operationalization + data source
- [ ] Create `docs/research/survey_v0.1.md`
- [ ] Draft Modules A–E of the survey
- [ ] Create crosswalk table: Survey question → Model parameter

**Definition of Done**: Propositions document + survey draft v0.1 + crosswalk table.

---

## Week 3 – Interview Protocol + Outreach Preparation

- [ ] Create `docs/research/interview_protocol_v1.md`
- [ ] Prepare 8–10 core questions + follow-ups
- [ ] Create pilot case study protocol + consent form
- [ ] Prepare outreach email template (1 page)
- [ ] Build list of 5–7 target pilot organizations

**Definition of Done**: Interview protocol + pilot protocol + outreach list ready.

---

## Week 4 – Replication Package Foundation

- [ ] Create folder structure `replication/`
- [ ] Write `docs/research/replication_package_spec.md` (detailed)
- [ ] Start populating `parameters/` folder
- [ ] Write specification for "Researcher Export" feature (`docs/research/researcher_export_spec.md`)
- [ ] Complete `docs/MODEL_PARAMETERS.md` for all paper parameters

**Definition of Done**: Replication skeleton + 30–40% populated + export spec written.

---

## Week 5 – Survey Pilot + Measurement Section Draft

- [ ] Distribute survey v0.1 to 15–25 respondents
- [ ] Collect and analyze feedback
- [ ] Produce survey v0.9
- [ ] Draft `sections/measurement.md` (1500–2000 words)
- [ ] Advance replication package to ~60%

**Definition of Done**: Survey v0.9 + first draft of Measurement section + replication at 60%.

---

## Week 6 – Interview Pilots + Hypotheses v2

- [ ] Conduct 3–5 pilot interviews
- [ ] Summarize insights (anonymized)
- [ ] Revise propositions → `testable_propositions_v2.md`
- [ ] Expand literature review with 6–8 new references

**Definition of Done**: Pilot interview summary + hypotheses v2 + updated lit review.

---

## Week 7 – Full Replication Package + App Feature

- [ ] Complete replication package v1.0
- [ ] Tag release `replication-v1.0`
- [ ] Implement (or high-fidelity prototype) "Researcher Export" in ProcuraCost
- [ ] First draft of Supervisor Pitch document

**Definition of Done**: Replication v1.0 live + export feature working + pitch draft.

---

## Week 8 – First Full Paper Draft

- [x] Rework the full paper as a conceptual-methodological article after the June 2026 evidence audit
- [x] Approve publication architecture: Paper 1 = conceptual-methodological simulation framework; Paper 2 = empirical validation (20 June 2026)
- [x] Approve contribution hierarchy: measurement instrument first; Tunnel vs. Field as secondary framing (20 June 2026)
- [x] Approve unit of analysis: procurement event/contract nested within organization (20 June 2026)
- [x] Approve primary comparison: within-organization matched pairs of real events; modeled counterfactuals diagnostic only (20 June 2026)
- [x] Approve primary exposure: continuous observed event-level rigidity index, independent of ProcuraCost constants (20 June 2026)
- [x] Approve index weighting: preregistered equal weights; alternative weights sensitivity-only (20 June 2026)
- [x] Approve outcome hierarchy: observed cycle time primary; component outcomes secondary; aggregate modeled PLN exploratory (20 June 2026)
- [x] Approve primary clock: need + budget authorization to first binding supplier commitment (21 June 2026)
- [x] Approve pause treatment: raw elapsed calendar time primary; adjusted net time secondary (21 June 2026)
- [x] Approve timestamp-quality tiers: exact auditable endpoints primary; interval/recollection secondary; no point imputation (21 June 2026)
- [x] Approve primary estimand: relative cycle-time difference per 0.10 rigidity within matched pairs (21 June 2026)
- [x] Approve pilot role: instrument development and feasibility only; no effect estimation (21 June 2026)
- [x] Approve sample separation: pilot events excluded from confirmatory analysis; freeze gate required (21 June 2026)
- [x] Approve organization holdout: confirmatory sample uses new organizations, not pilot participants (21 June 2026)
- [x] Approve confirmatory scope: one country and one procurement/legal regime; no pooled public/private/international estimate (21 June 2026)
- [x] Select first confirmatory population: Polish private-sector strategic procurement outside PZP (21 June 2026)
- [x] Approve event sampling: complete frozen-window archival universe; no expert-nominated primary cases (21 June 2026)
- [x] Approve archival window: common 24 months, membership by binding-commitment date, no organization-specific extension (21 June 2026)
- [x] Approve matching method: deterministic outcome-blind exact/coarsened + nearest neighbor; no expert substitution (21 June 2026)
- [x] Approve minimum exposure contrast: provisional ORI difference 0.20, final threshold outcome-blind after pilot (21 June 2026)
- [x] Approve matching without replacement: each event appears in at most one primary pair (21 June 2026)
- [x] Approve global pair assignment: balance-constrained maximum cardinality, then minimum total distance, deterministic tie-break (21 June 2026)
- [x] Approve mandatory provisional calipers: log value, ordinal covariates, technology, and commitment-date distance; final values outcome-blind after pilot (21 June 2026)
- [x] Approve organization pair minimum: one eligible pair; prioritize independent organizations and retain additional clustered pairs (21 June 2026)
- [x] Approve global balance gate: every frozen matching covariate `|SMD| <= 0.10`; no selective organization removal (21 June 2026)
- [x] Approve failed-balance rule: enforce balance in the solver; no primary effect if no powered feasible solution exists (21 June 2026)
- [x] Approve sample-size method: prospective simulation of the clustered primary estimator; pilot supplies nuisance inputs, not the effect (21 June 2026)
- [x] Approve minimum important effect: 10% cycle-time difference per `+0.10 ORI`; 21% across a `0.20` contrast (21 June 2026)
- [x] Approve power target: 90% under conservative assumptions, two-sided `alpha = 0.05` (21 June 2026)
- [x] Approve primary inference: pair-fixed-effects OLS, organization-clustered `CR2`, Satterthwaite degrees of freedom (21 June 2026)
- [x] Approve primary covariate rule: no matching covariates beyond pair fixed effects; adjusted model sensitivity-only (21 June 2026)
- [x] Approve primary weighting: unit event weights; equal-organization and leave-one-organization-out sensitivity analyses (21 June 2026)
- [x] Approve spend-type pooling: one primary ORI coefficient; exact within-pair spend type and secondary heterogeneity analysis (21 June 2026)
- [x] Approve primary functional form: linear ORI effect; prespecified three-knot spline sensitivity (21 June 2026)
- [x] Approve post-freeze invalidation: exclude the whole pair; no rematching or primary-outcome imputation (21 June 2026)
- [x] Approve ORI missingness rule: all six components required; no imputation, prorating, or weight renormalization (21 June 2026)
- [x] Approve ORI double coding: two independent blinded coders for 100% of confirmatory events (21 June 2026)
- [x] Approve ORI adjudication: third blinded independent score for every disputed component; no averaging (21 June 2026)
- [x] Approve ORI reliability gate: aggregate `ICC(A,1) >= 0.80`, every component reliability `>= 0.70` (21 June 2026)
- [x] Approve reliability-failure rule: one full blinded recoding; second fail ends primary analysis; rubric change restarts holdout (21 June 2026)
- [x] Approve ORI evidence minimum: contemporaneous artifact/system trace for every component; no interview-only primary score (21 June 2026)
- [x] Approve ORI reference time: constraints effective at Tier A need-and-budget authorization; later changes separate (21 June 2026)
- [x] Approve exception-use separation: baseline route restrictions in ORI; actual use/bypass is post-start only (21 June 2026)
- [x] Approve mechanism status: descriptive/associational only; no causal mediation claims (21 June 2026)
- [x] Approve secondary multiplicity rule: one confirmatory test; all secondary results exploratory without significance labels (22 June 2026)
- [x] Approve confidential-data reproducibility: public synthetic package plus independent restricted-environment audit (22 June 2026)
- [x] Approve preregistration timing: public immutable record before confirmatory recruitment/extraction; additive amendments only (22 June 2026)
- [x] Approve recruitment stopping: outcome-blind complete batches, dual powered floors, and frozen maximum cap (22 June 2026)
- [x] Approve organization invitation order: sector/size-stratified randomized frozen list with logged nonresponse (22 June 2026)
- [x] Approve organization nonresponse audit: frame-variable comparisons and participation-weight sensitivity (22 June 2026)
- [x] Approve net-cycle hold rule: only exact unrelated suspension, force majeure, or external infrastructure intervals are subtractable (22 June 2026)
- [x] Approve sub-day handling: full-precision positive fractional days; zero/negative invalid; no one-day floor (22 June 2026)
- [x] Integrate 2×2 framework and Measurement into flow from the beginning
- [x] Add tests, calculation trace, and generated JSON/CSV/Markdown scenario outputs (`npm test`, `npm run replicate`)
- [x] Updated supervisor pitch to highlight reproducibility; replication/README has dedicated "Reproducing the numbers in this paper" subsection
- [x] Internal polish pass; reproducibility artifacts listed
- [x] Feedback package prepared (`docs/research/v1.0_feedback_request.md`) and ready to send to 1–2 reviewers
- [x] Internal self-review + verification + feedback summary + incorporation + post-feedback checklist prepared (per A)
- [x] Supervisor pitch updated to mention the full structured feedback process
- [ ] Confirm whether the review package was actually sent; record date and recipient separately from file creation
- [x] Private feedback log created and pre-populated with exact reviewer questions (per A)
- [x] Red lines note created with initial counter-argument seeds (per A)
- [x] Anticipated reviewer concerns document created with sketched responses (per A)
- [x] Response protocol created (per A)
- [x] Changelog template created (per A)
- [x] Submission package checklist created (per A)
- [x] Nudge / follow-up template prepared (per A)
- [ ] Obtain and incorporate external feedback after the evidence-audited draft is ready

**Definition of Done**: Evidence-audited methodological draft, generated tables matching the model, and confirmed external review request. In progress — June 2026.

---

## Week 9–10 – Polish & Submission Preparation

- [ ] Incorporate internal feedback → Paper v1.5
- [ ] Prepare submission package for first target journal
- [ ] Submit at least one conference abstract (draft exists; creating or publishing it on the site is not a submission)
- [ ] Finalize Supervisor Pitch v1.0
- [ ] (Optional) Record 10–12 min model walkthrough video

**Definition of Done**: Submission-ready paper + conference abstract submitted + all supporting materials polished.

---

## Quick Reference – Priority Order

**Must do in order:**
1. Model freeze (Week 1)
2. Hypotheses + Survey core (Week 2)
3. Replication package foundation (Week 4)
4. First full paper draft (Week 8)

**High leverage / parallelizable:**
- Interview protocol (Week 3)
- Outreach to pilots (Week 3–4)
- Literature review expansion (ongoing)

---

**Status legend** (copy into your task manager):
- [ ] To do
- [x] Done
- [/] In progress
- [?] Blocked (add note)
