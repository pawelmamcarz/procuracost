# ProcuraCost Model — Full Parameter Documentation

**Version**: 1.1 (audit-revised + math correction)  
**Date**: July 2026  
**Status**: Work in progress — intended for academic review and replication

> **Audit-driven revision (2026-06-24).** This document was rewritten to match the "honest reframe" of the model in `lib/calculations.ts`. The previously documented `RIGIDITY_PRICE_PREMIUM` (0.02) and `RIGIDITY_PRODUCTIVITY_LOSS` (0.016) were based on an **inverted** reading of Szucs (2024) and have been **removed from the model**; they are replaced by a single `DISCRETION_FAVORITISM_PREMIUM` that runs in the correct direction (discretion is the cost, not rigidity). Citation, author, TCO, and bypass parameters were corrected — see notes per row.
>
> **Mathematical-correction changeset (2026-07-02).** A full model-math audit corrected: (A) staff-intensity double counting (the outer `staffIntensityMultiplier` scalar was removed; role-level multipliers in `deriveStaffCost` are the sole staff channel, and a duplicated buyer/requestor boost inside `deriveStaffCost` was removed); (B) a unit mismatch in the renegotiation premium (the per-SD effect is now explicitly mapped: full 0→1 rigidity swing ≈ 1 SD, anchored at 7.7pp, hard-capped at 10.5pp via new `RENEGOTIATION_PREMIUM_MAX`); (C) asymmetric flexible-path formulas (removed `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR` and `FLEXIBLE_BYPASS_PROBABILITY_SCALE`; both paths now share one renegotiation formula and one bypass sigmoid at their own rigidity); (D) inconsistent bypass-multiplier placement (both multipliers now scale the sigmoid output); (E) the TCO context multiplier being silently absorbed by the 30% cap (it now scales the whole dimension, effective ceiling = 0.30 × multiplier ≤ 0.345); (F) upstream context compounding (recalibrated §4 multipliers; audited invariant: no dimension's total context uplift exceeds ~×1.5, enforced by `scripts/recompute.ts` / `npm run recompute`); (G) optimizer corrections (7 weights, per-path score normalization to a true 0–100 scale, vote-based ranking so confidence describes the displayed winner). Empirical anchors (0.06, 0.22, 0.077, 0.30, 0.10/yr, 0.05) are unchanged — only their application changed. A parallel online source-verification pass corrected: Szucs "~6 percent" (not "6pp"; reduced-form ~9%), the apocryphal "ISM 30% TCO" attribution (relabelled: unattributed practitioner heuristic), Bajari et al. "of the winning bid", EC 2011 ~1.4% (not <1.3%), and the Swiss Casinos attribution (LAP Alliance / World Procurement Awards 2020; ~6 weeks vs ~6 months).

---

## Purpose of This Document

This document documents the principal quantitative inputs of the ProcuraCost model. It does **not** claim complete transparency on every input: roughly **35–40%** of parameters are peer-reviewed, the remainder are calibrated from multiple credible sources or are explicit modeling assumptions (see Classification Summary). For each parameter we specify:

- Exact value used in the code
- Type of parameter (Empirical / Empirical-informed / Calibrated / Modeling Assumption)
- Primary literature or data source
- Justification and limitations
- Sensitivity (how much the overall results depend on this parameter)

A note on interpretation: the model outputs are **estimates** under these assumptions, not measured facts, and the model is **symmetric** — the favoritism/selection-quality and bypass dimensions can run against the flexible path, so in low-corruption-risk operational contexts the rigid path can be net-cheaper.

---

## 1. Global Behavioral & Economic Parameters

| Parameter | Code Constant | Value | Type | Source | Justification & Limitations | Sensitivity |
|---------|---------------|-------|------|--------|-----------------------------|-------------|
| Favoritism / selection-quality premium from **discretion** | `DISCRETION_FAVORITISM_PREMIUM` | 0.06 (≈6%) | Empirical-informed | Szucs, F. (2024). "Discretion and Favoritism in Public Procurement". *Journal of the European Economic Association*, 22(1), 117–160. DOI 10.1093/jeea/jvad017. | **Direction matters:** Szucs finds that *discretion* raises prices (~6 **percent**, structural; plain fuzzy-RD reduced form ~9%, selection-corrected ~8%) and selects contractors of ~10% lower productivity (structural); competitive (rigid) tendering averts this premium. Charged mainly to the flexible/discretionary path. Scales with DISCRETION (1 − rigidity) × `CORRUPTION_RISK_CONTEXT`. **Identification caveat:** the structural estimates correct for selection into tenders (the uncorrected reduced-form productivity gap is far larger); Hungarian institutional context — transfers are benchmarks, not measurements. *(Replaces the removed, inverted `RIGIDITY_PRICE_PREMIUM` and `RIGIDITY_PRODUCTIVITY_LOSS`.)* | High |
| Base renegotiation probability | `BASE_RENEGOTIATION_PROBABILITY` | 0.22 (22%) | Empirical | Beuve, Moszoro & Spiller (2021/2023), NBER WP 28491 / *JLEO*. Corroborated by Guasch (2004, World Bank, Tbl 1.7): **~30%** of >1,000 Latin-American infrastructure concessions (1985–2000) were renegotiated (≈41.5% **EXCLUDING** telecom; the ~30% headline figure **includes** telecom). | Baseline (unconditional) renegotiation rate. Observational. Guasch shows it is highly **design-dependent** (≈60% under lowest-tariff award vs ≈11% under highest-transfer-fee), so 0.22 is a conservative central value for general procurement. | Medium-High |
| Renegotiation premium associated with contractual rigidity | `RIGIDITY_RENEGOTIATION_PREMIUM` | +0.077 | Empirical-informed | Beuve, Moszoro & Spiller (2021/2023). Mechanism: Bajari & Tadelis (2001); magnitude co-anchor: Bajari, Houghton & Tadelis (AER 2014). | **Observational** (associated with, not caused by). Range **+7.7 to +10.5 pp** per SD of rigidity. **Mapping assumption (explicit since 2026-07-02):** the full 0→1 swing of the model's rigidity index is treated as ≈1 SD of contractual rigidity, anchored conservatively at the **7.7pp lower bound**; the same formula `P(ρ) = 0.22 + min(0.077 × ρ × m_ctx, 0.105)` applies to **both** paths at their own rigidity (flexible at ρ_F = min(ρ, 0.15)), so the rigidity difference alone drives the delta. **Endogeneity caveat:** Bajari & Tadelis show renegotiation/transaction cost is *endogenous to the contract form, chosen jointly with project complexity* — so this is not a clean causal treatment effect. A better-identified co-anchor is the **adaptation-cost share ≈ 7.5–14% of the winning bid** (Bajari, Houghton & Tadelis 2014; the AER **version-of-record abstract renders 7.5–14%**, the author PDF 8–14%, WP versions ~10%), from a **US-Caltrans California highway-paving** structural model — a **transfer caveat** applies (highway works → general/EU/PL procurement). The model could adopt it as an alternative renegotiation-cost basis, but it must **not** be reused as the **TCO-dimension** basis: doing so would **double-count with the renegotiation dimension**. | High |
| Renegotiation premium hard cap | `RENEGOTIATION_PREMIUM_MAX` | 0.105 | Empirical-informed (band bound) | Beuve, Moszoro & Spiller (2021/2023) — upper bound of the cited +7.7–10.5pp band. | Added 2026-07-02. Guarantees that context multipliers (`renegotiationMultiplier`, up to ≈1.587 in Direct+Upstream) can move the premium **within** the cited band but never above it; previously the multiplied premium could reach ≈11.6pp, exceeding the source. | Medium |
| Annual TCO foregone-savings rate | `TCO_SAVINGS_RATE_PER_YEAR` | 0.10 (10%) | **Modeling Assumption — Grade C (flat practitioner ceiling, not peer-reviewed)** | **Unattributed practitioner heuristic (grey literature).** The circulating "ISM 30%/3yr" attribution is apocryphal — the verbatim quote traces to a content farm squatting ISM's former domain (ism.ws), and no official ISM or CAPS source exists (verified online 2026-07-02). Do **not** attribute to ISM or CAPS Research. | **Weakest-grounded parameter in the model.** No peer-reviewed study supports a flat 10%/yr: the academic TCO literature (Ellram 1993; Wouters et al. 2005) is **conceptual only** (cost-classification frameworks and adoption studies), with no savings magnitude; and even practitioner figures are "soft" (CAPS's own reported savings are definitionally inconsistent). The credible consulting pattern is **5–15% in year one on *sourced* categories, decaying to 2–5%/yr** — so a flat 10%/yr on full contract value across the whole horizon is **optimistic** (the 30% cap mitigates). The *premise* is sound: lowest-price selection leaves recoverable value — Decarolis (2014) finds ≥50% of low-price auction savings are erased by ex-post renegotiation, and operating cost dominates lifecycle cost (~70:30 O&S:acquisition in defense). **Priority candidate for recalibration to a decaying rate.** **Pending recalibration (doc-flagged here; code unchanged):** move from the flat 10%/yr to a **decaying schedule (5–15% yr1 → 2–5%/yr)** while **keeping the 30% cap**, and anchor the *premise* to **Decarolis (2014, peer-reviewed)** rather than the ISM "up to 30%" vendor figure. **High-sensitivity** — single most influential weak parameter (see §9 residual-risk register). Applied as a **discounted** flow (see `DISCOUNT_RATE`) and **capped** (see `TCO_CUMULATIVE_CAP`). | High |
| Cumulative TCO cap (share of contract value) | `TCO_CUMULATIVE_CAP` | 0.30 (30%) | Calibrated (Grade C) | Unattributed practitioner heuristic (grey literature) — see the row above; no verifiable ISM/peer-reviewed source. | The "up to 30%" figure is a multi-year **ceiling**, not a flat per-year rate. The model caps cumulative foregone TCO at 30% of contract value. **Since 2026-07-02** the context multiplier scales the whole dimension *including* the cap — `C_TCO = V × m_ctx × min(0.10 × A(T,5%) × ρ, 0.30)` — so the effective ceiling is 0.30 × `tcoMultiplier` (max 0.345 for Direct spend); previously the multiplier was silently absorbed whenever the cap bound. | High |
| Discount rate for multi-year flows | `DISCOUNT_RATE` | 0.05 (5%) | Modeling Assumption | Internal (standard PV convention) | Discounts the annual foregone-TCO stream to present value via a Σ 1/(1+d)^y annuity factor. | Medium |
| Sigmoid steepness for bypass probability | `BYPASS_SIGMOID_STEEPNESS` | 6 | Modeling Assumption | Internal | Controls how sharply realized bypass probability rises with effective rigidity. Recalibrated (was 10). | Medium |
| Rigidity threshold for bypass acceleration | `BYPASS_THRESHOLD` | 0.9 | Modeling Assumption | Internal | Sigmoid midpoint on the rigidity scale (0–1). Recalibrated upward (was 0.5) to remove the prior ~0.99 saturation. | Medium |
| Bypass probability ceiling | `BYPASS_PROBABILITY_CEILING` | 0.95 | Modeling Assumption | Internal | Hard cap on realized bypass probability. With the sweep above, a very rigid **manual** process lands at ≈**86%** (not ~99%), falling toward ≈**6%** under end-to-end digital tooling. The earlier doc's "~45–55% bypass" was inaccurate; this is the true calibration. | Medium |

**Removed constants (no longer in the model):**
- `RIGIDITY_PRICE_PREMIUM` (0.02) and `RIGIDITY_PRODUCTIVITY_LOSS` (0.016) — removed 2026-06-24. Both encoded an inverted reading of Szucs (treating rigidity, rather than discretion, as the price/quality cost) and are superseded by `DISCRETION_FAVORITISM_PREMIUM`.
- `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR` (0.70) and `FLEXIBLE_BYPASS_PROBABILITY_SCALE` (0.10) — removed 2026-07-02. Both were flexible-only ad-hoc discounts that double-encoded the rigidity→risk mechanism and violated the symmetric-model invariant; superseded by shared per-path formulas (renegotiation: `P(ρ)` at each path's own rigidity; bypass: one sigmoid, flexible path evaluated at the tech level's `policyRigidityIndex`).
- `staffIntensityMultiplier` (context scalar 1.25 upstream / ×1.15 direct+upstream) — removed 2026-07-02. It re-applied at aggregate level what the role-level multipliers inside `deriveStaffCost` already encode (double counting).

### 1a. Favoritism-risk context by process type (`CORRUPTION_RISK_CONTEXT`)

Defined in `lib/process-templates.ts`. The weight κ scales the favoritism/selection-quality premium by how much a discretionary award would risk price dispersion and value loss in that context (0 = none, 1 = highest public-money scrutiny). This is what competitive tendering averts.

| Process type | κ | Process type | κ |
|---|---|---|---|
| `pzp_eu` | 1.00 | `private_formal` | 0.40 |
| `pzp_krajowy` | 0.90 | `custom` | 0.40 |
| `capex` | 0.60 | `catalog_order` | 0.20 |
| `policy_only` | 0.45 | `mrp_order` | 0.15 |

Type: **Modeling Assumption — Grade C (calibrated governance-risk index).** The high anchor `pzp_eu = 1.00` is grounded in **Szucs (2024)**; the **ordinal ranking** (public > private > operational) is defensible from **OECD** integrity work, but the **intermediate/lower gradient** (0.90 / 0.60 / 0.45 / 0.40 / 0.20 / 0.15) is a **modeling assumption** that falls in no published source range. **High-sensitivity:** this gradient directly scales the favoritism/selection-quality dimension and can move (and in principle flip) the rigid-vs-flexible gap — it **underpins the symmetry claim** and must be sensitivity-tested before any headline magnitude is quoted. High public-procurement contexts carry the highest stakes; automated operational orders carry the least.

### 1a-bis. Process rigidity index by process type (`PROCESS_RIGIDITY`)

Defined in `lib/process-templates.ts`. The load-bearing 0–1 rigidity index ρ per process type — it drives the discretion term (1 − ρ), the TCO scaling, the renegotiation premium, and the bypass sigmoid. Previously undocumented here (audit gap closed 2026-07-02).

| Process type | ρ | Process type | ρ |
|---|---|---|---|
| `pzp_eu` | 0.95 | `custom` | 0.50 |
| `pzp_krajowy` | 0.80 | `catalog_order` | 0.20 |
| `capex` | 0.72 | `policy_only` | 0.15 |
| `private_formal` | 0.60 | `mrp_order` | 0.12 |

Type: **Modeling Assumption — Grade C.** The **ordinal ranking** is defensible (EU-threshold public procedure > national > CAPEX governance > private formal > operational/automated), but there is no external 0–1 anchor for the **cardinal** values — they are internal calibration. The flexible path always runs at ρ_F = min(ρ, 0.15) (the `policy_only` level, never more rigid than the underlying process).

### 1b. Opportunity cost (deployment delay) — methodology change

Opportunity cost is now charged to **both** paths over **their own** duration: `C_opp = days × dailyCostOfInaction × delayMultiplier` for each path. There is **no zero-friction baseline** for the flexible path (the previous `C_opp(F) = 0` assumption is removed). The headline saving is reported honestly as a delta of two non-zero quantities, and is a model **estimate/range**, not an empirical fact.

---

## 2. Technology Level Parameters

These are relative multipliers and cost estimates derived from industry benchmarks and consulting data.

| Tech Level | Time Multiplier | Coordination Cost per Day | Tool Cost per Process | Bypass Probability Multiplier | Policy Rigidity Index | Type | Basis |
|------------|-----------------|---------------------------|-----------------------|-------------------------------|-----------------------|------|-------|
| Manual | 1.40 | 500 PLN | 0 PLN | 1.50 | 0.35 | Calibrated | timeMultiplier anchored to APQC / Hackett benchmarks; coordination/tool costs are modeling assumptions (Polish consulting practice) |
| Sourcing Tool | 1.15 | 200 PLN | 800 PLN | 0.80 | 0.22 | Calibrated | Industry benchmarks (Ariba, Jaggaer, Ivalua implementations) |
| Partial ERP | 1.00 | 100 PLN | 1,200 PLN | 0.55 | 0.15 | Calibrated | Common configuration in mid-sized Polish and CEE companies |
| End-to-End (Ariba/Coupa) | 0.70 | 20 PLN | 2,000 PLN | 0.10 | 0.05 | Calibrated | Best-in-class implementations observed in large multinationals |

**Important note**: These values represent relative differences and typical costs in the Polish/Central European context as of 2023–2025. They are not taken from a single peer-reviewed study.

### 2a. Administrative / transaction cost — empirical anchor (EC 2011)

The administrative/coordination cost dimension (`coordCostPerDay × days + toolCostPerProcess`, scaled by `coordinationIntensityMultiplier`) is anchored to the European Commission's canonical study **"Public Procurement in Europe: Cost and Effectiveness" (PwC, London Economics & Ecorys, 2011)**:

- Average total cost of running **one** EU-regulated procedure ≈ **€28,000**, split ~**25% contracting authority / ~75% suppliers** (bid preparation across an average of 5.4 bidders).
- Aggregate (value-weighted) societal cost ≈ €5.26 bn/yr (EEA-30, 2009) = **~1.4% of tendered value** *(the study's own figure is "about 1,4 percent of purchasing volume"; an earlier "<1.3%" rendering here was slightly off — corrected 2026-07-02)*.
- As a **share of contract value the cost is strongly regressive**: ≈ **6–9% at the €390k median contract, 18–29% at a €125k contract** — small contracts are hit proportionally far harder. This reconciles with the figures above: €28k is ≈7% of a €390k median contract but well under ~1.5% of a large one, so the value-weighted aggregate lands near ~1.4%.
- Average ≈ 38 person-days (authority + winning firm); restricted procedures are the most expensive for authorities.

Type: **Empirical** (official EC study). The model's coordination + tool costs should sanity-check near ~6–9% of value at a median contract; the regressivity (small contracts cost proportionally more) is a candidate refinement.

---

## 3. Flexible Path Adjustments

| Parameter | Code Constant | Value | Type | Justification |
|---------|---------------|-------|------|---------------|
| Additional time compression in flexible path | `FLEXIBLE_PATH_TIME_COMPRESSION` | 0.85 (context-aware: 0.78 upstream / 0.90 downstream via `getFlexibleTimeCompression`) | Modeling Assumption | Reflects the assumption that even at the same technology level, a policy-based approach allows ~15% faster execution due to elimination of mandatory formal steps and reduced coordination overhead. Upstream strategic work is assumed to benefit more (0.78), standardized downstream execution less (0.90). |
| Flexible tool utilization rate | `FLEXIBLE_TOOL_UTILIZATION_RATE` | 0.30 | Modeling Assumption | Flexible (policy-only) processes typically use only a fraction of full platform capabilities. |

The former `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR` (0.70) and `FLEXIBLE_BYPASS_PROBABILITY_SCALE` (0.10) rows were **removed 2026-07-02** (see "Removed constants" in §1): the flexible path now uses the same renegotiation and bypass formulas as the rigid path, evaluated at its own (lower) rigidity — the honest, symmetric treatment.

---

## 4. Direct / Indirect + Upstream / Downstream Adjustments (Added 2026; recalibrated 2026-07-02)

Introduced following academic feedback. Recalibrated in the 2026-07-02 math correction under the principle **one economic channel per mechanism**: calendar time is lengthened only by the step-level day boosts in `deriveRigidDays`/`deriveFlexibleDays`, staff seniority only by the role-level multipliers in `deriveStaffCost` — so the former `delayMultiplier` upstream uplift (1.4) and the `staffIntensityMultiplier` scalar were removed as double counting.

The complete multiplier set in `getDimensionMultipliers()` (this table is exhaustive):

| Multiplier | direct | upstream | downstream | direct+upstream extra | Placement |
|---|--:|--:|--:|--:|---|
| `tcoMultiplier` | ×1.15 | — | — | — | Scales the whole TCO dimension **including** the 0.30 cap (effective ceiling 0.30 × m ≤ 0.345) |
| `delayMultiplier` | — | — (1.0; was 1.4) | ×0.90 | — | Scales per-day opportunity cost; upstream calendar lengthening lives solely in the day boosts |
| `productivityMultiplier` | — | — | ×0.85 | — | Scales the favoritism/selection-quality dimension |
| `bypassMultiplier` | ×1.15 | ×1.25 | — | — | Applied to the sigmoid **output** (realized probability), alongside the tech multiplier; cap 0.95 |
| `renegotiationMultiplier` | ×1.15 | ×1.20 | — | ×1.15 | Applied inside `renegotiationPremium()`, hard-capped at `RENEGOTIATION_PREMIUM_MAX` = 0.105 |
| `coordinationIntensityMultiplier` | — | ×1.15 (was 1.3) | ×0.85 | — | Scales per-day coordination cost |

All multipliers apply to **both paths' formulas identically** (they scale the rigid and flexible figures through the same shared formulas), so they cannot by themselves flip the net sign; they are also **dormant in the shipped reference scenarios**, which leave `spendType` / `processPhase` unset (= 1.0).

These multipliers are **Grade-C modeling assumptions** — the most explicit "modeling judgment" parameters in the current version — and are priority candidates for future empirical calibration.

**Caveat on the Direct-TCO direction.** Savings-potential benchmarks (**Sievo, Inverto**) report **indirect-spend** savings (~10–40%) running *higher* than **direct-spend** savings (~6–12%), which **contradicts** the assumption that direct spend carries the larger TCO-optimization potential. Pending expert elicitation the multiplier was reduced from 1.35 to the conservative **1.15** (2026-07-02), and the extra direct+upstream ×1.2 TCO compounding was removed.

### 4a. Aggregate context-uplift audit (invariant: ≤ ~×1.5 per dimension)

Because one context dimension can push several cost channels in the same direction, the deterministic recompute (`npm run recompute`) audits the **total** per-dimension uplift factor of each (spendType × processPhase) combo vs the unset baseline, across all shipped scenarios (rigid path, max over scenarios):

| combo | time | admin | opp | favor. | reneg | tco | bypass |
|--|--:|--:|--:|--:|--:|--:|--:|
| direct+upstream | ×1.48 | ×1.27 | ×1.14 | ×1.00 | ×1.12 | ×1.15 | ×1.44 |
| direct+downstream | ×1.43 | ×1.00 | ×0.90 | ×0.85 | ×1.04 | ×1.15 | ×1.15 |
| indirect+upstream | ×1.21 | ×1.15 | ×1.00 | ×1.00 | ×1.05 | ×1.00 | ×1.25 |
| indirect+downstream | ×1.43 | ×1.00 | ×0.90 | ×0.85 | ×1.00 | ×1.00 | ×1.00 |

Max observed uplift: **×1.483** (staff cost, direct+upstream) — the ≤ ~×1.5 invariant **holds**. Before the correction the worst case was ×2.15 (staff, indirect+downstream, from a duplicated buyer/requestor boost inside `deriveStaffCost` — removed).

---

## 5. Process Step Data

Detailed step-level data (duration in rigid vs flexible mode, mandatory waits, participation by role) are defined per process type in `lib/process-templates.ts`.

These values combine:
- Legal minimum durations (PZP, EU Directive 2014/24)
- OECD Public Procurement Performance data (2023)
- Practitioner benchmarks collected 2018–2025

They are treated as **Calibrated** with a significant modeling component.

**Step-level role-hour multipliers (`process-templates.ts`, ≈0.5×–1.85×) are Grade C.** Their *direction* is triangulated against Kraljic (1983), CIPS, and APQC role-allocation guidance, but the *cardinal magnitudes* are internal modeling judgments with no published role-hour source (the "practitioner interviews" provenance is unsubstantiated — no sample size or instrument). A structured time-allocation survey is the planned primary-stage validation. **Since 2026-07-02 these role-level multipliers are the SOLE staff-intensity channel** (the outer `staffIntensityMultiplier` scalar was removed as double counting, along with a duplicated buyer/requestor boost in the indirect+downstream block; the blended staff uplift is bounded ≤ ~×1.5 — see §4a).

### 5a. Stakeholder fully-loaded daily rates (Grade B)

The six `StakeholderRole` daily rates (`DEFAULT_STAKEHOLDERS` in `lib/scenarios.ts`, consumed by the staff-cost derivation in `lib/process-templates.ts`) are **Grade B** — triangulated to Polish 2024/25 market data and **user-overridable** in the calculator:

| Role | Rate (PLN/day) | Role | Rate (PLN/day) |
|---|---|---|---|
| `requestor` | 900 | `finance` | 900 |
| `buyer` | 800 | `manager` | 1,500 |
| `lawyer` | 1,200 | `executive` | 2,500 |

- **Anchors:** Sedlak & Sedlak / wynagrodzenia.pl 2024 (specjalista ds. zakupów, kierownik, dyrektor, radca prawny, analityk finansowy); GUS *Struktura wynagrodzeń wg zawodów* X.2024; Hays Salary Guide 2024/25.
- **Gross → fully-loaded conversion:** monthly gross × **1.205** (employer ZUS) ÷ **21** working days × **1.3–1.6** overhead (workspace, tooling, non-billable time) → fully-loaded daily rate.
- **Caveat:** the manager/executive rates sit at the upper end of their bands; the `executive` **2,500 PLN/day** fits a **board / C-level** reading, not a line manager. Because all rates remain user-overridable, they bound a default scenario rather than assert a measured value.

---

## Classification Summary (Current State)

| Category | Approximate Share | Status |
|----------|-------------------|--------|
| Directly from peer-reviewed empirical studies | ~35–40% | Good |
| Calibrated from multiple credible sources | ~35–40% | Acceptable |
| Explicit modeling assumptions (literature-informed) | ~20–25% | Needs improvement / validation |

The three adjustment multipliers introduced in 2026 currently belong to the last category and are the highest priority for future empirical work.

---

## 6. Path Optimizer (`lib/optimizer.ts`)

The path optimizer is **not** a Random Forest and **not** a trained machine-learning model. It is a **weighted, rule-based scoring function** — one declarative term list per procurement path. The 30 "trees" are a **30-run sensitivity sweep** (the same formula re-evaluated with reweighted coefficients) used to report how stable the recommendation is, not independent learners; "confidence" is the share of sweep runs in which a path wins. Feature importance is computed by **genuine ablation** (neutralize a feature, measure |Δ| of the top path's score); paths whose formulas contain no spendType/processPhase term (the three competitive tender modes) correctly report 0 importance for those features by construction. The scoring weights are modeling assumptions, not parameters fitted to real procurement outcomes; the tool is **illustrative and not validated on real procurement data**. There is **no Breiman (2001) Random Forest** in the implementation, and that citation should not be presented as the implemented method.

**2026-07-02 corrections:** (i) the weight vector was trimmed from 11 to 7 — the former w5–w8 were dead weights read by no path, diluting the sensitivity signal; (ii) per-run path scores are now **normalized to a true 0–100 scale** (achieved ÷ achievable maximum under the run's weights), removing a structural bias where dimension-bonus paths had raw ceilings up to ~164 vs 100 for the tender paths and were systematically favored in vote-based winner selection; (iii) ranking is now by **sweep votes** (mean normalized score as tiebreak), so the displayed `confidence = votes/30` genuinely describes the displayed winner; (iv) `NEUTRAL_FEATURES` carries explicit "unset" neutrals for spendType/processPhase. Recommendations changed deterministically as a result.

Public-sector recommendations are **hard-filtered** to the lawful set of PZP trybów: above the EU threshold without documented statutory grounds, only competitive procedures (open tender Art. 132, restricted Art. 140, competitive dialogue Art. 169) are offered, so the tool can never recommend a legally impossible path.

## 7. Empirical re-grounding — deep-research pass (2026-06-24)

A multi-source deep-research pass (five search angles + adversarial 3-vote verification) was run per cost dimension to test whether each parameter can be re-grounded in citable evidence. Status by dimension:

| Dim | Parameter(s) | Status |
|---|---|---|
| 1 — Price / discretion | `DISCRETION_FAVORITISM_PREMIUM` 0.06 | **Grounded** — Szucs (2024), Coviello & Mariniello (2014), Czech reform (2025) converge on ~6–8% |
| 2 — Renegotiation | `0.22` + `0.077` | **Mechanism + base grounded** (Guasch 2004; Bajari-Houghton-Tadelis 2014); the premium is observational/endogenous; better-identified co-anchor is the **7.5–14% adaptation-cost share** |
| 3 — TCO | `0.10` / cap `0.30` | **Weak** — practitioner ceiling only; premise sound (Decarolis 2014), magnitude optimistic; recalibration candidate |
| 4 — Delay | `days × dailyCostOfInaction` | **Day-gap grounded** (mandatory waits + EC 120-day "Decision Speed" benchmark); the per-day cost is a user input; competition does **not** increase delay (Coviello & Mariniello 2014) |
| 5 — Admin | `coordCost + toolCost` | **Grounded** — EC PwC/London Economics (2011): ~6–9% of a median contract, regressive (see §2a) |

**Cross-cutting finding:** the dominant procurement friction across dimensions is **ex-post adaptation/renegotiation of incomplete contracts, endogenous to contract design** (Bajari-Houghton-Tadelis) — larger than the bidding markups the auction literature emphasises. This reinforces the model's framing that the lever is **competition and contract completeness, not procedural formality per se**.

### Added references

- Guasch, J. L. (2004). *Granting and Renegotiating Infrastructure Concessions: Doing It Right.* World Bank.
- Bajari, P., Houghton, S., & Tadelis, S. (2014). Bidding for Incomplete Contracts. *American Economic Review*, 104(4), 1288–1319.
- Bajari, P., & Tadelis, S. (2001). Incentives versus Transaction Costs: A Theory of Procurement Contracts. *RAND Journal of Economics*, 32(3), 387–407.
- Decarolis, F. (2014). Awarding Price, Contract Performance, and Bids Screening: Evidence from Procurement Auctions. *American Economic Journal: Applied Economics*, 6(1), 108–132. *(Scope: Italian public-works auctions with non-binding bids — transfer to general/PL procurement is order-of-magnitude, not exact.)*
- Coviello, D., & Mariniello, M. (2014). Publicity Requirements in Public Procurement. *Journal of Public Economics*, 109, 76–100.
- PwC, London Economics & Ecorys (2011). *Public Procurement in Europe: Cost and Effectiveness.* European Commission.
- European Commission, *Single Market Scoreboard — Public Procurement* (Decision Speed indicator).

> **Verification status (re-run 2026-06-24).** A controlled adversarial re-verification (3 skeptic votes per claim) **confirmed** the Guasch renegotiation rates, the **7.5–14% adaptation-cost share** (Bajari-Houghton-Tadelis), Decarolis's "≥50% of low-price savings erased," the **5–15%/2–5% TCO pattern** ("up to 30% over 3 years" being an unsourced vendor claim), the ~70:30 lifecycle ratio, the EC **120-day "Decision Speed"** benchmark, the Coviello & Mariniello delay findings, and the EC **aggregate cost (~1.4% of tendered value per the study's own wording)** — 11 of 14 magnitudes confirmed (mostly 3/3). **One figure failed verification and was removed:** a ~0.4% cost increment attributed *specifically* to the EU Directives (the gross ~€28k / ~1.0–1.4% figure stands; the Directive-specific increment could not be substantiated). The per-procedure €28k and the 6–9%/18–29% regressive shares were not independently re-checked in this pass (API errors) but are corroborated by the confirmed aggregate figure and the same EC study.

## Next Steps (as per PHD_ROADMAP)

- Full sensitivity analysis module in the application
- Public replication package
- Empirical validation plan with specific identification strategies

---

**Maintained by**: Paweł Mamcarz  
**Last major update**: June 2026 (audit-driven revision)

This document is version-controlled and intended to become the canonical reference for all quantitative assumptions in ProcuraCost.