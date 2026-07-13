# Survey → Model Crosswalk (ProcuraCost v1.2)

**Unit-of-analysis rule (approved 20 June 2026)**: event-level modules refer to one recent focal procurement event or contract. Organization-level questions provide context only. Store `procurement_event_id` and `organization_id` separately so events remain nested rather than aggregated prematurely. For the primary matched design, administer the event module once per event and connect two real events with `matched_pair_id`.

**Exposure rule (approved 20 June 2026)**: collect raw event-level rigidity components and construct `observed_rigidity_index` independently of ProcuraCost. Keep respondent-perceived rigidity, binary path label, and model `PROCESS_RIGIDITY` as distinct fields.

**Weighting rule**: the primary index is the equal-weight mean of normalized preregistered components. See `docs/research/observed_rigidity_codebook.md`; data-driven weights are secondary, outcome-blind sensitivity analyses only.

**Outcome rule (approved 20 June 2026)**: `observed_procurement_cycle_days` is primary and should come from timestamps where possible. Effort, renegotiation, commercial/TCO, bypass, compliance/audit, and supplier performance are secondary. Aggregate ProcuraCost PLN is exploratory and cannot replace an observed outcome.

**Clock rule (approved 21 June 2026)**: primary start = formal authorization of both need and budget; primary end = first binding supplier commitment. Collect pre-authorization and post-commitment-to-first-use timestamps separately. See `docs/research/procurement_cycle_outcome_codebook.md`.

**Pause rule (approved 21 June 2026)**: primary elapsed calendar time subtracts no holds. Collect every pause interval and cause; adjusted net time is a preregistered secondary outcome only.

**Timestamp-quality rule (approved 21 June 2026)**: collect evidence tier per endpoint. Tier A exact auditable timestamps support the primary analysis; Tier B intervals require interval-censored secondary methods; Tier C recall is secondary; Tier D model-filled values are prohibited.

**Estimand rule (approved 21 June 2026)**: preserve continuous rigidity and exact elapsed time. The primary effect is reported per 0.10 rigidity increase within matched pairs on log cycle time; do not collapse the fields to a binary comparison.

**Phase rule (approved 21 June 2026)**: every event stores `study_phase`. Records used for instrument development are permanently excluded from confirmatory primary estimates, even after recoding.

**Population rule (approved 21 June 2026)**: store `country` and `legal_regime` at event level. The first confirmatory primary estimate uses one frozen country/regime; other populations are separate replication or transportability analyses.

**Selected target**: `country = PL`, private-sector Upstream sourcing/contracting, internal corporate procurement regime, focal event not subject to PZP or another mandatory public/donor regime. Direct and Indirect spend remain eligible.

**Sampling rule (approved 21 June 2026)**: primary confirmatory events come from a complete fixed-window archival frame, not expert nomination. Store `sampling_frame_id`, eligibility/exclusion code, and matching status for every source event.

**Window rule (approved 21 June 2026)**: one study-level extraction cutoff and the preceding 24 calendar months, with membership based on `binding_commitment_at`. Store cutoff, window start, completion status, and open-at-cutoff flag.

**Matching rule (approved 21 June 2026)**: exact/coarsened matching within organization, spend type, and category family, followed by outcome-blind nearest neighbor on frozen pre-outcome covariates. Store algorithm version, distance, balance fields, and expert-rejection code.

**Replacement rule (approved 21 June 2026)**: each event can belong to at most one primary pair. Store unmatched status rather than duplicating an event.

**Purpose**: Maps every survey item to the exact parameters, functions, and outputs in the ProcuraCost model. This is required for:
- Operationalizing the testable propositions (P1–P7 in `testable_propositions_v1.md`)
- Building the replication package synthetic data
- Designing the empirical analysis (difference-in-differences, multilevel models, etc.)
- Turning survey responses into `ProcurementInputs` objects for `calculateCosts()`

**Core model inputs** (from `lib/calculations.ts`):
- `contractValue`
- `tcoHorizonYears`
- `processType` (pzp_eu, pzp_krajowy, private_formal, policy_only, catalog_order, mrp_order, capex, custom)
- `techLevel` (manual, sourcing_tool, partial_erp, end_to_end)
- `stakeholders`: Record of 6 roles with `{count, dailyRate}`
- `dailyCostOfInaction`
- `renegotiationCost`
- `bypassAuditExposure`
- `spendType` ("direct" | "indirect")
- `processPhase` ("upstream" | "downstream")

Key functions that use the 2×2 context: `getDimensionMultipliers`, `deriveRigidDays`, `deriveFlexibleDays`, `deriveStaffCost`.

---

## Module A: Profile → Model Parameters

| Survey item | Model mapping | Notes / Transformation |
|-------------|---------------|------------------------|
| 1. Role (Buyer, Category Manager, CPO, Finance/Controlling, Other) | Used for weighting in stakeholder composition + validation of Module B responses | Helps calibrate average `stakeholders` profiles per organization type |
| 2. Organization type (Public, SOE, Large private, Mid-size, Other) | Influences expected `processType` distribution and baseline rigidity | Public/SOE → higher weight on pzp_eu / pzp_krajowy |
| 3. Annual procurement spend (bands) | Proxy for scale when respondent does not provide specific scenario value | Can be used as prior for `contractValue` in aggregate analyses |
| 4. % Direct vs Indirect (slider or two fields summing to 100%) | Direct input to `spendType`. Threshold e.g. >60% Direct → treat as "direct" for that category | Core 2×2 dimension. Enables P1, P2, P3, P4, P5, P6 |
| 5. Digital maturity (1–5 scale mapped to tech levels) | Maps almost 1:1 to `techLevel`:<br>• 1 = manual<br>• 2 = sourcing_tool<br>• 3 = partial_erp<br>• 4–5 = end_to_end | Strong moderator in P7. Also affects `bypassProbMultiplier` and `coordCostPerDay` via `TECH_LEVELS` |

---

## Module B: Time Allocation by Role and Step (Core) → Staff Cost Model

This module is the **primary source** for calibrating and validating the staff cost side of the model (`deriveStaffCost` + participation matrices in `lib/process-templates.ts`).

**Mapping strategy**:
- Survey steps are grouped to match the 7–8 canonical steps per process type.
- Hours by role → `stakeholders[role].count` (average people) and effective hours fed into `deriveStaffCost`.
- Two separate blocks (Direct/strategic vs Indirect/operational) directly support the 2×2.

| Survey concept | Model equivalent | How to use for propositions |
|----------------|------------------|-----------------------------|
| Hours on "Needs definition & budget approval" (by role) | `needs_analysis` or `business_case` step participation | Feeds P2 (senior effort concentration in upstream) |
| Hours on "Specification / tender documentation preparation" | `siwz_prep` / `spec_prep` / `technical_spec` | Strong Direct+Upstream loadings (lawyer ×1.4, manager ×1.25 in code) |
| Hours on "Bid evaluation / negotiation / competitive dialogue" | `bid_evaluation`, `clarifications` | Key for P1 gap and P5 time compression |
| Hours on "Legal & compliance review", "Internal approvals & contract signing" | `legal_review`, `award_committee`, `contract_signing` | Highest senior multipliers (executive 1.85× upstream + 1.45× per-step) |
| Hours on "Supplier onboarding & contract implementation" | Downstream-heavy steps | More buyer/requestor in Indirect+Downstream |

**Usage for replication**:
Respondent provides two matrices (Direct-strategic and Indirect-operational). These can be averaged or used per-quadrant to generate realistic `stakeholders` + step participation for synthetic cases.

---

## Module C: Delay Costs → Opportunity Cost Model

| Survey item | Model mapping | Notes |
|-------------|---------------|-------|
| Daily cost of 1-month delay for ~2M PLN purchase (numeric or bands) | `dailyCostOfInaction` (PLN/day) | Direct scalar. Central to opportunity cost term and P4 (TCO vs delay dominance by quadrant) |
| Frequency of measurable negative business impact from delays | Validation / weighting of `dailyCostOfInaction` | Can be used to filter or weight scenarios |
| Categories with highest cost of delay (multi-select with Direct/Indirect + Upstream/Downstream framing) | Direct support for testing P1 and P4 | Allows construction of quadrant-specific `dailyCostOfInaction` priors |

---

## Module D: Renegotiation → Renegotiation Component

| Survey item | Model mapping | Notes |
|-------------|---------------|-------|
| % of contracts >500k PLN that required significant renegotiation/amendment in last 3 years | Can be used to calibrate `renegotiationCost` or to validate the base 22% + 7.7pp premium | Complements Beuve et al. (2021) |
| Common drivers of renegotiation (ranked) | Qualitative support for "rigidity increases renegotiation risk" mechanism | Not numeric input but strengthens interpretation of P6 |
| Observed difference in renegotiation rates between rigid vs flexible/policy-driven approaches | Direct qualitative test of the proposed renegotiation tension and P6 | Can be turned into a multiplier adjustment for sensitivity |

**Model side**: `renegotiationCost` (absolute cost if renegotiated) × `rigidRenegotiationProb` (or flexible version). The probability boost comes from `RIGIDITY_RENEGOTIATION_PREMIUM * renegotiationMultiplier` (context-dependent).

---

## Module E: Bypass Behavior → Bypass Cost + 2×2 Moderation

This module is critical for P3 (bypass moderation) and the "Normalization of Deviance" dimension.

| Survey item | Model mapping | Notes |
|-------------|---------------|-------|
| Frequency of informal / accelerated paths that significantly bypass standard procedures | Maps to `bypassAuditExposure` (the expected cost if bypass is discovered) + probability model | Core input for C_bypass |
| In which 2×2 contexts does bypass happen most often (Direct+Upstream etc.) | Direct test of the context `bypassMultiplier` in `getDimensionMultipliers` (highest in Direct+Upstream) | Primary evidence for P3 |
| Top reasons for bypass (time pressure, better commercial outcome, relationships, market opportunity, bureaucracy) | Supports theoretical mechanisms (Lipsky, Vaughan, Goodhart) | Qualitative triangulation |
| Visibility of bypasses to audit/compliance (Fully / Partially / Mostly invisible / Completely hidden) | Validates the "driven underground" prediction of the enforcement fallacy | Important for policy implications |

**Model side**:
- `effectiveRigidity = baseRigidity * tech.bypassProbMultiplier * dims.bypassMultiplier`
- `pBypass = 1 / (1 + exp(-10 * (effectiveRigidity - 0.5)))`
- `bypassCost = pBypass * bypassAuditExposure`

---

## Cross-Quadrant and Technology Moderation (P7)

- Survey digital maturity (Module A) + bypass frequency by 2×2 (Module E) → test whether high techLevel attenuates the Direct+Upstream penalty (especially on bypass and admin costs).
- % Direct/Indirect (Module A) crossed with everything else enables splitting all analyses by the 2×2.

---

## How to Use This Crosswalk

1. **For Paper 1 (current working paper)**: Cite the mappings when describing "Measurement and Operationalization" (already partially expanded in RESEARCH.md).
2. **For empirical work / Paper 2**:
   - Convert survey responses → `ProcurementInputs` objects.
   - Run through `calculateCosts` to get predicted costs per reported scenario.
   - Compare predicted vs self-reported outcomes (lead time, renegotiation rate, perceived bypass frequency).
3. **Replication package**: Store averaged or example matrices from pilot responses as JSON alongside the researcher exports.

**Related files**:
- `docs/research/testable_propositions_v1.md` (which propositions each module supports)
- `docs/research/model_specification_draft.md` (exact formulas)
- `docs/MODEL_PARAMETERS.md`
- `docs/EMPIRICAL_VALIDATION_PLAN.md`

**Version**: Reviewed against model v1.2. Any change to multipliers or step templates requires crosswalk review.

---

*This crosswalk turns the survey from a generic opinion instrument into a direct data collection tool for the ProcuraCost measurement model.*
