# ProcuraCost Model — Full Parameter Documentation

**Version**: 1.0 (audit-revised)  
**Date**: June 2026  
**Status**: Work in progress — intended for academic review and replication

> **Audit-driven revision (2026-06-24).** This document was rewritten to match the "honest reframe" of the model in `lib/calculations.ts`. The previously documented `RIGIDITY_PRICE_PREMIUM` (0.02) and `RIGIDITY_PRODUCTIVITY_LOSS` (0.016) were based on an **inverted** reading of Szucs (2024) and have been **removed from the model**; they are replaced by a single `DISCRETION_FAVORITISM_PREMIUM` that runs in the correct direction (discretion is the cost, not rigidity). Citation, author, TCO, and bypass parameters were corrected — see notes per row.

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
| Favoritism / selection-quality premium from **discretion** | `DISCRETION_FAVORITISM_PREMIUM` | 0.06 (≈6pp) | Empirical-informed | Szucs, F. (2024). "Discretion and Favoritism in Public Procurement". *Journal of the European Economic Association*, 22(1), 117–160. DOI 10.1093/jeea/jvad017. | **Direction matters:** Szucs finds that *discretion* raises prices (~6pp, structural) and selects *less-productive* contractors; competitive (rigid) tendering averts this premium. Charged mainly to the flexible/discretionary path. Scales with DISCRETION (1 − rigidity) × `CORRUPTION_RISK_CONTEXT`. **Endogeneity caveat:** Szucs attributes ≈two-thirds of the discontinuity to firm selection/sorting, so this is an upper-bound, not a clean causal coefficient. *(Replaces the removed, inverted `RIGIDITY_PRICE_PREMIUM` and `RIGIDITY_PRODUCTIVITY_LOSS`.)* | High |
| Base renegotiation probability | `BASE_RENEGOTIATION_PROBABILITY` | 0.22 (22%) | Empirical | Beuve, Moszoro & Spiller (2021/2023), NBER WP 28491 / *JLEO*. Corroborated by Guasch (2004, World Bank, Tbl 1.7): **~30%** of >1,000 Latin-American infrastructure concessions (1985–2000) were renegotiated (≈41.5% **EXCLUDING** telecom; the ~30% headline figure **includes** telecom). | Baseline (unconditional) renegotiation rate. Observational. Guasch shows it is highly **design-dependent** (≈60% under lowest-tariff award vs ≈11% under highest-transfer-fee), so 0.22 is a conservative central value for general procurement. | Medium-High |
| Renegotiation premium associated with contractual rigidity | `RIGIDITY_RENEGOTIATION_PREMIUM` | +0.077 | Empirical-informed | Beuve, Moszoro & Spiller (2021/2023). Mechanism: Bajari & Tadelis (2001); magnitude co-anchor: Bajari, Houghton & Tadelis (AER 2014). | **Observational** (associated with, not caused by). Range **+7.7 to +10.5 pp** per SD of rigidity; the model uses the lower bound, **scaled by the process's actual rigidity index**. **Endogeneity caveat:** Bajari & Tadelis show renegotiation/transaction cost is *endogenous to the contract form, chosen jointly with project complexity* — so this is not a clean causal treatment effect. A better-identified co-anchor is the **adaptation-cost share ≈ 7.5–14% of contract value** (Bajari, Houghton & Tadelis 2014; the AER **version-of-record abstract renders 7.5–14%**, the author PDF 8–14%, WP versions ~10%), from a **US-Caltrans California highway-paving** structural model — a **transfer caveat** applies (highway works → general/EU/PL procurement). The model could adopt it as an alternative renegotiation-cost basis, but it must **not** be reused as the **TCO-dimension** basis: doing so would **double-count with the renegotiation dimension**. | High |
| Annual TCO foregone-savings rate | `TCO_SAVINGS_RATE_PER_YEAR` | 0.10 (10%) | **Modeling Assumption — Grade C (flat practitioner ceiling, not peer-reviewed)** | ISM / CAPS Research, consulting benchmarks 2015–2024 | **Weakest-grounded parameter in the model.** No peer-reviewed study supports a flat 10%/yr: the academic TCO literature (Ellram 1993; Wouters et al. 2005) is **conceptual only** (cost-classification frameworks and adoption studies), with no savings magnitude; and even practitioner figures are "soft" (CAPS's own reported savings are definitionally inconsistent). The credible consulting pattern is **5–15% in year one on *sourced* categories, decaying to 2–5%/yr** — so a flat 10%/yr on full contract value across the whole horizon is **optimistic** (the 30% cap mitigates). The *premise* is sound: lowest-price selection leaves recoverable value — Decarolis (2014) finds ≥50% of low-price auction savings are erased by ex-post renegotiation, and operating cost dominates lifecycle cost (~70:30 O&S:acquisition in defense). **Priority candidate for recalibration to a decaying rate.** **Pending recalibration (doc-flagged here; code unchanged):** move from the flat 10%/yr to a **decaying schedule (5–15% yr1 → 2–5%/yr)** while **keeping the 30% cap**, and anchor the *premise* to **Decarolis (2014, peer-reviewed)** rather than the ISM "up to 30%" vendor figure. **High-sensitivity** — single most influential weak parameter (see §9 residual-risk register). Applied as a **discounted** flow (see `DISCOUNT_RATE`) and **capped** (see `TCO_CUMULATIVE_CAP`). | High |
| Cumulative TCO cap (share of contract value) | `TCO_CUMULATIVE_CAP` | 0.30 (30%) | Calibrated | ISM / CAPS Research (practitioner **ceiling** over multiple years) | The ISM "up to 30%" figure is a multi-year **ceiling**, not a flat per-year rate. The model caps cumulative foregone TCO at 30% of contract value so it can never exceed this bound. | High |
| Discount rate for multi-year flows | `DISCOUNT_RATE` | 0.05 (5%) | Modeling Assumption | Internal (standard PV convention) | Discounts the annual foregone-TCO stream to present value via a Σ 1/(1+d)^y annuity factor. | Medium |
| Sigmoid steepness for bypass probability | `BYPASS_SIGMOID_STEEPNESS` | 6 | Modeling Assumption | Internal | Controls how sharply realized bypass probability rises with effective rigidity. Recalibrated (was 10). | Medium |
| Rigidity threshold for bypass acceleration | `BYPASS_THRESHOLD` | 0.9 | Modeling Assumption | Internal | Sigmoid midpoint on the rigidity scale (0–1). Recalibrated upward (was 0.5) to remove the prior ~0.99 saturation. | Medium |
| Bypass probability ceiling | `BYPASS_PROBABILITY_CEILING` | 0.95 | Modeling Assumption | Internal | Hard cap on realized bypass probability. With the sweep above, a very rigid **manual** process lands at ≈**86%** (not ~99%), falling toward ≈**6%** under end-to-end digital tooling. The earlier doc's "~45–55% bypass" was inaccurate; this is the true calibration. | Medium |

**Removed constants (no longer in the model):** `RIGIDITY_PRICE_PREMIUM` (0.02) and `RIGIDITY_PRODUCTIVITY_LOSS` (0.016). Both encoded an inverted reading of Szucs (treating rigidity, rather than discretion, as the price/quality cost) and are superseded by `DISCRETION_FAVORITISM_PREMIUM`.

### 1a. Favoritism-risk context by process type (`CORRUPTION_RISK_CONTEXT`)

Defined in `lib/process-templates.ts`. The weight κ scales the favoritism/selection-quality premium by how much a discretionary award would risk price dispersion and value loss in that context (0 = none, 1 = highest public-money scrutiny). This is what competitive tendering averts.

| Process type | κ | Process type | κ |
|---|---|---|---|
| `pzp_eu` | 1.00 | `private_formal` | 0.40 |
| `pzp_krajowy` | 0.90 | `custom` | 0.40 |
| `capex` | 0.60 | `catalog_order` | 0.20 |
| `policy_only` | 0.45 | `mrp_order` | 0.15 |

Type: **Modeling Assumption — Grade C (calibrated governance-risk index).** The high anchor `pzp_eu = 1.00` is grounded in **Szucs (2024)**; the **ordinal ranking** (public > private > operational) is defensible from **OECD** integrity work, but the **intermediate/lower gradient** (0.90 / 0.60 / 0.45 / 0.40 / 0.20 / 0.15) is a **modeling assumption** that falls in no published source range. **High-sensitivity:** this gradient directly scales the favoritism/selection-quality dimension and can move (and in principle flip) the rigid-vs-flexible gap — it **underpins the symmetry claim** and must be sensitivity-tested before any headline magnitude is quoted. High public-procurement contexts carry the highest stakes; automated operational orders carry the least.

### 1b. Opportunity cost (deployment delay) — methodology change

Opportunity cost is now charged to **both** paths over **their own** duration: `C_opp = days × dailyCostOfInaction × delayMultiplier` for each path. There is **no zero-friction baseline** for the flexible path (the previous `C_opp(F) = 0` assumption is removed). The headline saving is reported honestly as a delta of two non-zero quantities, and is a model **estimate/range**, not an empirical fact.

---

## 2. Technology Level Parameters

These are relative multipliers and cost estimates derived from industry benchmarks and consulting data.

| Tech Level | Time Multiplier | Coordination Cost per Day | Tool Cost per Process | Bypass Probability Multiplier | Policy Rigidity Index | Type | Basis |
|------------|-----------------|---------------------------|-----------------------|-------------------------------|-----------------------|------|-------|
| Manual | 1.40 | 500 PLN | 0 PLN | 1.50 | 0.35 | Calibrated | OECD (2023), EY & Deloitte sourcing transformation studies, multiple Polish consulting projects |
| Sourcing Tool | 1.15 | 200 PLN | 800 PLN | 0.80 | 0.22 | Calibrated | Industry benchmarks (Ariba, Jaggaer, Ivalua implementations) |
| Partial ERP | 1.00 | 100 PLN | 1,200 PLN | 0.55 | 0.15 | Calibrated | Common configuration in mid-sized Polish and CEE companies |
| End-to-End (Ariba/Coupa) | 0.70 | 20 PLN | 2,000 PLN | 0.10 | 0.05 | Calibrated | Best-in-class implementations observed in large multinationals |

**Important note**: These values represent relative differences and typical costs in the Polish/Central European context as of 2023–2025. They are not taken from a single peer-reviewed study.

### 2a. Administrative / transaction cost — empirical anchor (EC 2011)

The administrative/coordination cost dimension (`coordCostPerDay × days + toolCostPerProcess`, scaled by `coordinationIntensityMultiplier`) is anchored to the European Commission's canonical study **"Public Procurement in Europe: Cost and Effectiveness" (PwC, London Economics & Ecorys, 2011)**:

- Average total cost of running **one** EU-regulated procedure ≈ **€28,000**, split ~**25% contracting authority / ~75% suppliers** (bid preparation across an average of 5.4 bidders).
- Aggregate (value-weighted) societal cost ≈ €5.26 bn/yr (EEA-30, 2009) = **< 1.3% of tendered value** *(verified 3/3)*.
- As a **share of contract value the cost is strongly regressive**: ≈ **6–9% at the €390k median contract, 18–29% at a €125k contract** — small contracts are hit proportionally far harder. This reconciles with the figures above: €28k is ≈7% of a €390k median contract but well under ~1.5% of a large one, so the value-weighted aggregate lands near ~1.3%.
- Average ≈ 38 person-days (authority + winning firm); restricted procedures are the most expensive for authorities.

Type: **Empirical** (official EC study). The model's coordination + tool costs should sanity-check near ~6–9% of value at a median contract; the regressivity (small contracts cost proportionally more) is a candidate refinement.

---

## 3. Flexible Path Adjustments

| Parameter | Code Constant | Value | Type | Justification |
|---------|---------------|-------|------|---------------|
| Additional time compression in flexible path | `FLEXIBLE_PATH_TIME_COMPRESSION` | 0.85 | Modeling Assumption | Reflects the assumption that even at the same technology level, a policy-based approach allows ~15% faster execution due to elimination of mandatory formal steps and reduced coordination overhead. |
| Flexible tool utilization rate | `FLEXIBLE_TOOL_UTILIZATION_RATE` | 0.30 | Modeling Assumption | Flexible (policy-only) processes typically use only a fraction of full platform capabilities. |
| Flexible renegotiation probability factor | `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR` | 0.70 | Modeling Assumption | Policy-based procurement materially reduces renegotiation risk. |
| Flexible bypass probability scale | `FLEXIBLE_BYPASS_PROBABILITY_SCALE` | 0.10 | Modeling Assumption | Even in a well-designed "field", some residual bypass risk remains due to ethical boundaries and documentation requirements. |

---

## 4. Direct / Indirect + Upstream / Downstream Adjustments (Added 2026)

Introduced following academic feedback.

| Parameter | Value | Applies to | Type | Rationale |
|---------|-------|------------|------|---------|
| Direct TCO multiplier | 1.35 | `spendType === "direct"` | Modeling Assumption (literature-informed) | Direct spend typically has significantly higher Total Cost of Ownership optimization potential than Indirect spend. |
| Upstream bypass risk multiplier | 1.25 | `processPhase === "upstream"` | Modeling Assumption | Strategic decisions made under high rigidity create stronger incentives for informal workarounds than operational execution. |
| Downstream selection-quality multiplier | 0.85 | `processPhase === "downstream"` | Modeling Assumption | Scales the favoritism/selection-quality dimension (`productivityMultiplier` in code). Downstream operational P2P spend is more standardized, so the favoritism/value-loss exposure of supplier discretion is somewhat lower than in strategic upstream decisions. |

These three multipliers are **Grade-C modeling assumptions** — the most explicit "modeling judgment" parameters in the current version — and are priority candidates for future empirical calibration.

**Caveat on the Direct-TCO ×1.35 direction.** Savings-potential benchmarks (**Sievo, Inverto**) report **indirect-spend** savings (~10–40%) running *higher* than **direct-spend** savings (~6–12%), which **contradicts** the assumption that direct spend carries the larger TCO-optimization potential. The direction of this multiplier therefore needs **expert elicitation** before it is relied upon. Note that all three multipliers are shared across both paths (they scale the rigid and flexible figures together), so they cannot by themselves flip the net sign; they are also **dormant in the shipped reference scenarios**, which leave `spendType` / `processPhase` unset (= 1.0).

---

## 5. Process Step Data

Detailed step-level data (duration in rigid vs flexible mode, mandatory waits, participation by role) are defined per process type in `lib/process-templates.ts`.

These values combine:
- Legal minimum durations (PZP, EU Directive 2014/24)
- OECD Public Procurement Performance data (2023)
- Practitioner benchmarks collected 2018–2025

They are treated as **Calibrated** with a significant modeling component.

**Step-level role-hour multipliers (`process-templates.ts`, ≈0.5×–1.85×) are Grade C.** Their *direction* is triangulated against Kraljic (1983), CIPS, and APQC role-allocation guidance, but the *cardinal magnitudes* are internal modeling judgments with no published role-hour source (the "practitioner interviews" provenance is unsubstantiated — no sample size or instrument). A structured time-allocation survey is the planned primary-stage validation.

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

The path optimizer is **not** a Random Forest and **not** a trained machine-learning model. It is a **weighted, rule-based scoring function** — one closed-form formula per procurement path. The 30 "trees" are a **30-run sensitivity sweep** (the same formula re-evaluated with reweighted coefficients) used to report how stable the recommendation is, not independent learners; "confidence" is the share of sweep runs in which a path wins. Feature importance is computed by **genuine ablation** (neutralize a feature, measure |Δ| of the top path's score). The scoring weights are modeling assumptions, not parameters fitted to real procurement outcomes; the tool is **illustrative and not validated on real procurement data**. There is **no Breiman (2001) Random Forest** in the implementation, and that citation should not be presented as the implemented method.

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

> **Verification status (re-run 2026-06-24).** A controlled adversarial re-verification (3 skeptic votes per claim) **confirmed** the Guasch renegotiation rates, the **7.5–14% adaptation-cost share** (Bajari-Houghton-Tadelis), Decarolis's "≥50% of low-price savings erased," the **5–15%/2–5% TCO pattern** ("up to 30% over 3 years" being an unsourced vendor claim), the ~70:30 lifecycle ratio, the EC **120-day "Decision Speed"** benchmark, the Coviello & Mariniello delay findings, and the EC **aggregate cost (<1.3% of tendered value)** — 11 of 14 magnitudes confirmed (mostly 3/3). **One figure failed verification and was removed:** a ~0.4% cost increment attributed *specifically* to the EU Directives (the gross ~€28k / ~1.0–1.4% figure stands; the Directive-specific increment could not be substantiated). The per-procedure €28k and the 6–9%/18–29% regressive shares were not independently re-checked in this pass (API errors) but are corroborated by the confirmed aggregate figure and the same EC study.

## Next Steps (as per PHD_ROADMAP)

- Full sensitivity analysis module in the application
- Public replication package
- Empirical validation plan with specific identification strategies

---

**Maintained by**: Paweł Mamcarz  
**Last major update**: June 2026 (audit-driven revision)

This document is version-controlled and intended to become the canonical reference for all quantitative assumptions in ProcuraCost.