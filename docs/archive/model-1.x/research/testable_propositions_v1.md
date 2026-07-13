# Testable Propositions – ProcuraCost 2×2 Framework (v1.0)

> **SUPERSEDED.** Retained for provenance only. Reformulate propositions using
> separate workflow, competition and contract-rigidity constructs from model 2.0.

**Unit of analysis (approved 20 June 2026)**: a procurement event or contract. Organizations are grouping units containing multiple events; propositions must be tested at event level unless explicitly labeled organizational.

**Primary exposure (approved 20 June 2026)**: a continuous `observed_rigidity_index` built from pre-outcome event records. Binary rigid/flexible labels are descriptive; ProcuraCost rigidity constants are not empirical measurements.

**Primary outcome (approved 20 June 2026)**: timestamp-derived `observed_procurement_cycle_days`. Other observed components are secondary; aggregate ProcuraCost PLN is exploratory and cannot be used to validate itself.

**Primary estimand (approved 21 June 2026)**: percentage cycle-time difference associated with a 0.10 increase in observed rigidity within matched pairs, estimated on log cycle time. Binary path contrasts are descriptive secondary analyses.

**First confirmatory population (approved 21 June 2026)**: strategic private-sector procurement events in Poland outside PZP. Direct and Indirect Upstream events are eligible. Propositions requiring a Downstream, public/PZP, or cross-country comparison are deferred to separate replication studies rather than forced into the first sample.

**Status**: Initial draft (June 2026)  
**Model baseline**: v1.2. These statements are candidate empirical propositions motivated by the conceptual framework and model mechanics; model-implied magnitudes are not evidence.  
**Source**: Derived from `lib/calculations.ts` and `lib/process-templates.ts`, then requiring external testing.  
**Cross-reference**: See `docs/research/model_specification_draft.md` for the exact closed forms and multipliers. See `docs/MODEL_PARAMETERS.md` for parameter classification. See `docs/EMPIRICAL_VALIDATION_PLAN.md`, `docs/research/survey_structure.md`, and the new `docs/research/survey_crosswalk.md` for how survey items map to model parameters and which modules support each proposition.

---

## Core Framing

The model distinguishes four quadrants created by the interaction of:

- **Spend Type**: Direct (goes into the final product/service, high TCO leverage) vs. Indirect (support spend).
- **Process Phase**: Upstream (strategic sourcing, specification, contracting, SRM – high governance) vs. Downstream (operational P2P execution – more transactional).

These are not post-hoc categories. They are live inputs (`spendType`, `processPhase`) that modify:
- Per-step calendar days (rigid path +22% boost on governance steps for Direct+Upstream; flexible path extra compression on eliminated formal steps).
- Role-specific staff-hour multipliers (executive up to 1.85× upstream + further per-step loadings; buyer/requestor amplified downstream).
- Dimension multipliers (tco, delay, bypass, renegotiation, staff intensity, coordination intensity) with a super-additive Direct×Upstream interaction.

All propositions below are **testable** with the current ProcuraCost measurement model + the planned survey + archival data.

---

## Propositions

### P1: Opportunity Cost Gap Amplification (Direct × Upstream)

**Statement**: The total opportunity cost gap (rigid-procedure path vs. bounded policy-flexible path) is larger for Direct×Upstream spend than for Indirect×Downstream spend, ceteris paribus.

**Theoretical justification**:
- Direct spend receives base tcoMultiplier = 1.35 + additional 1.2 interaction in Direct+Upstream.
- Upstream receives delayMultiplier = 1.4, bypassMultiplier boost (×1.25), renegotiation boost, staffIntensity = 1.25, coordinationIntensity = 1.3.
- Combined with per-step calendar +22% on key governance steps (`siwz_prep`, `award_committee`, `contract_signing`, `needs_analysis` etc.) and senior effort loadings (executive 1.85× + 1.45× extra on award/contract steps).
- Indirect+Downstream receives the opposite: lower delay (0.9), productivity dampening (0.85), reduced senior involvement, and no governance-step boosts.

**Operationalization (ProcuraCost)**:
- Run matched scenarios (same contractValue, tcoHorizon, dailyInaction, renegotiationCost, bypassAuditExposure, techLevel) differing only in spendType + processPhase.
- Compare `deltaPercent` (or absolute `delta`) across the four quadrants using the live calculator or researcher export JSON.

**Data sources**:
- Primary: Survey Module A (spend classification) + Module B (role hours by step) + Module E (bypass frequency by 2×2 quadrant).
- Secondary/archival: Matched procurement system logs or contract databases that allow tagging Direct/Indirect and upstream (sourcing) vs. downstream (PO/GR) transactions + outcome data (actual lead times, renegotiations, TCO analyses).

**Expected direction & magnitude**:
- Expected positive direction. Effect size must be estimated from pilot variance and organizational data rather than copied from the model.

---

### P2: Senior Management & Legal Effort Concentration (Upstream)

**Statement**: The share of total staff cost attributable to executive + manager + lawyer roles is significantly higher (≥ 15–25 percentage points) in Upstream phases than in Downstream phases, with the effect further amplified for Direct spend.

**Theoretical justification**:
- `deriveStaffCost` applies explicit upstream multipliers: executive ×1.85, manager ×1.65, lawyer ×1.55, finance ×1.4, buyer ×0.75.
- Downstream applies the reverse (buyer ×1.5, requestor ×1.35, manager/executive heavily discounted).
- Additional per-step loadings only for Direct+Upstream on `award_committee`, `contract_signing`, `siwz_prep`, `needs_analysis`, `clarifications`.
- This is a direct prediction of multitask principal-agent logic (Holmström & Milgrom 1991) + street-level bureaucracy adaptation (Lipsky 1980) under high-stakes strategic work.

**Operationalization**:
- For any scenario, compute (or export) the staffCost breakdown by role for rigid vs. flexible paths.
- Calculate % of total staffCost coming from {executive, manager, lawyer} in Upstream vs. Downstream runs.
- Use the Assumptions Explorer overrides or full researcher JSON to vary assumptions.

**Data sources**:
- Primary: Survey Module B (detailed hours by role and step for strategic Direct vs. operational Indirect categories).
- Archival: Time-tracking or ERP audit logs from organizations that tag categories and record approver levels.

**Expected direction & magnitude**:
- Strongly positive for Upstream (especially Direct+Upstream). In rigid PZP-EU or CAPEX templates, senior roles can easily account for 35–50%+ of staff cost upstream vs. <15% downstream in catalog/MRP flows.

---

### P3: Bypass Probability Moderation (Rigidity × Strategic Importance)

**Statement**: The probability of informal bypass (and therefore expected bypassCost) is positively and significantly moderated by the combination of high base procedural rigidity and Direct+Upstream context.

**Theoretical justification**:
- `effectiveRigidity = baseRigidity * tech.bypassProbMultiplier * contextBypassMultiplier`
- ContextBypassMultiplier reaches its maximum precisely in Direct+Upstream (1.15 × 1.25 base, plus further interaction effects).
- Bypass is then passed through the logistic: `1 / (1 + exp(-10 * (effectiveRigidity - 0.5)))`.
- High-rigidity process types (pzp_eu = 0.95) + Direct+Upstream therefore push effectiveRigidity into the steep part of the sigmoid.
- Grounded in Lipsky (adaptation is normal) + Vaughan (normalization of deviance when workarounds are driven underground) + Goodhart (when the measurable compliance metric is gamed).

**Operationalization**:
- Vary processType (pzp_eu vs. policy_only or catalog_order) and the two context dimensions.
- Export `bypassProbability` (rigid) and `rigidBypassCost`.
- Survey: direct self-report of bypass frequency + reasons, crossed with 2×2 classification (Module E).

**Data sources**:
- Primary: Survey + confidential interviews (bypass is hard to observe in standard logs).
- Secondary: Forensic analysis of PO vs. actual communication trails, "shadow" purchase records, or post-audit findings (where organizations are willing to share anonymized cases).

**Expected direction & magnitude**:
- Strong positive interaction. In the model, Direct+Upstream + pzp_eu under partial/manual tech routinely yields 45–55%+ bypass probability, vs. low single digits for Indirect+Downstream + end-to-end ERP.

---

### P4: Shift in Dominant Cost Driver (TCO vs. Delay by Quadrant)

**Statement**: In Direct+Upstream contexts the marginal cost of rigidity is dominated by foregone TCO savings; in certain Downstream or Indirect contexts deployment delay costs become relatively more prominent.

**Theoretical justification**:
- tcoMultiplier receives the strongest combined uplift in Direct+Upstream (1.35 × 1.2).
- delayMultiplier = 1.4 upstream but 0.9 downstream.
- TCO term = V × 0.10 × years × baseRigidity × tcoMultiplier (long horizon amplifies).
- Delay term = (rigidDays – flexibleDays) × dailyInaction × delayMultiplier (more sensitive to absolute day gaps created by formal steps).

**Operationalization**:
- Use the Assumptions Explorer impact simulator or full exports.
- Decompose `delta` into its components (especially `tcoCost` vs. `opportunityCost` which includes delay) across quadrants while holding V and horizon fixed.
- Sensitivity: vary tcoHorizonYears and dailyInaction.

**Data sources**:
- Primary: Survey Module C (perceived daily cost of delay by category) + Module A (spend mix).
- Archival: Actual TCO analyses and project delay cost estimates from finance/controlling in participating organizations.

**Expected direction & magnitude**:
- Direct+Upstream: TCO component often 1.5–2×+ the delay component for multi-year horizons.
- Downstream/Indirect: Delay can become comparable or larger when dailyInaction is high relative to contract value (e.g. production stoppage risk).

---

### P5: Time Compression Benefit of Flexibility is Largest in Direct+Upstream

**Statement**: The reduction in calendar days achieved by moving from rigid procedure to policy-only flexible path (rigidDays – flexibleDays) is largest (both absolutely and proportionally) for Direct+Upstream spend.

**Theoretical justification**:
- Rigid path in Direct+Upstream receives the +22% step boosts on the longest formal steps.
- Flexible path eliminates or heavily compresses exactly those steps (`siwz_prep`, `publication`, `standstill`, `award_committee`) and receives extra 0.82 compression bonus on them in Direct+Upstream.
- Net: the formal overhead that is removed is biggest where it was artificially inflated.

**Operationalization**:
- Compare `rigidDays` and `flexibleDays` (exported) across the four quadrants for otherwise identical inputs.
- Use the step-level detail available in researcher exports or by inspecting `getSteps()` + adjustments.

**Data sources**:
- Primary: Survey Module A + B (self-reported typical lead times for strategic Direct vs. operational Indirect purchases, split by formal vs. accelerated paths).
- Archival: Procurement system timestamp data (requisition to PO to GR) tagged by category and phase.

**Expected direction & magnitude**:
- Direct+Upstream rigid paths (PZP-EU, CAPEX) show the biggest absolute day savings (often 40–70+ days in realistic templates) and highest % compression when switching to flexible.

---

### P6: Renegotiation Exposure Interaction

**Statement**: The increase in expected renegotiation cost due to rigidity is amplified in Direct+Upstream contexts (via both higher base renegotiation probability and higher per-renegotiation cost exposure in strategic deals).

**Theoretical justification**:
- `rigidRenegotiationProb = clamp(0.22 + 0.077 * renegotiationMultiplier, ...)`
- renegotiationMultiplier boosted in Direct (1.15) + Upstream (1.2) + further interaction (1.15).
- Additionally, strategic Direct+Upstream deals have higher `renegotiationCost` inputs in practice (larger, more complex contracts).

**Operationalization**:
- Hold renegotiationCost fixed and vary context → observe change in `renegotiationExpected`.
- Or let organizations provide realistic renegotiationCost per quadrant.

**Data sources**:
- Primary: Survey Module D (renegotiation experience + drivers, crossed with 2×2).
- Archival: Contract amendment/renegotiation logs from ERP or legal systems.

**Expected direction & magnitude**:
- Positive interaction in the current implementation. The lower-bound Beuve et al. (2021) estimate is multiplied by an assumed contextual factor; both the transport and interaction require validation.

---

### P7: Technology Moderation of the 2×2 Effect (Exploratory)

**Statement**: The amplification of opportunity costs in the Direct+Upstream quadrant is attenuated (but not eliminated) under high-maturity end-to-end digital procurement platforms (Ariba/Coupa class) relative to manual or partial-ERP environments.

**Theoretical justification**:
- `tech.bypassProbMultiplier` drops to 0.10 and `policyRigidityIndex` to 0.05 in end_to_end.
- This lowers `effectiveRigidity` fed to the bypass sigmoid and reduces coordination overhead multipliers.
- However, the context multipliers on tco, delay, senior effort, and per-step calendar adjustments are still applied on top of the (now smaller) base.

**Operationalization**:
- Full 4×4 matrix (processType rigidity × techLevel) crossed with the two context dimensions.
- Already implemented in `calculateMatrix` and visible in CostComparison radar/bar views.

**Data sources**:
- Survey Module A (digital maturity 1–5 scale) + Module E (bypass).
- Matched before/after analyses in organizations that implemented full platforms.

**Expected direction & magnitude**:
- Attenuation present (especially on bypassCost and adminCoord), but TCO and senior-effort gaps remain material because they are less fully solved by current technology.

---

## Usage Notes for Empirical Work

- **Crosswalk**: Every proposition maps to specific variables in the survey structure (Modules A–E) and to fields in the researcher export JSON.
- **Identification**: Within-organization, within-category, or matched-pair designs are preferred to reduce endogeneity (see EMPIRICAL_VALIDATION_PLAN.md).
- **Power**: The model can be used for ex-ante simulations to set minimum detectable effects once pilot data on variances and correlations are available.
- **Versioning**: This draft was reviewed against model v1.2. Any change to multipliers or step adjustments requires a proposition and instrument review.

---

**Next**: After pilot data (survey + 3–4 case studies), produce `testable_propositions_v2.md` with refined wording, dropped/added items, and preliminary effect size estimates from real data.

See also:
- `docs/RESEARCH_PAPER_ACTION_PLAN.md` (Week 2 and Week 6 tasks)
- `docs/research/survey_structure.md`
- `docs/research/replication_package_spec.md` (for using the JSON exports to populate synthetic data)
