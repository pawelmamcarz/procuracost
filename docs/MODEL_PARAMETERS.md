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
| Base renegotiation probability | `BASE_RENEGOTIATION_PROBABILITY` | 0.22 (22%) | Empirical | Beuve, Moszoro & Spiller (2021). "Contractual Rigidity and Political Contestability". NBER Working Paper 28491 (published *JLEO* 2023). | Baseline (unconditional) renegotiation rate in their public-procurement sample. Observational. | Medium-High |
| Renegotiation premium associated with contractual rigidity | `RIGIDITY_RENEGOTIATION_PREMIUM` | +0.077 | Empirical | Beuve, Moszoro & Spiller (2021/2023) | **Observational** (associated with, not caused by). The paper reports a range of **+7.7 to +10.5 pp** per SD of rigidity; the model uses the lower bound and **scales it by the process's actual rigidity index**. | High |
| Annual TCO foregone-savings rate | `TCO_SAVINGS_RATE_PER_YEAR` | 0.10 (10%) | Calibrated | ISM / CAPS Research, consulting benchmarks 2015–2024 (practitioner, not peer-reviewed) | Annual rate of the foregone-savings stream. Applied as a **discounted** annual flow (see `DISCOUNT_RATE`) and **capped** (see `TCO_CUMULATIVE_CAP`) so the cumulative figure never exceeds the cited multi-year ceiling. | High |
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

Type: Modeling Assumption (literature-informed). High public-procurement contexts carry the highest stakes; automated operational orders carry the least.

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

These three multipliers are the most explicit "modeling judgment" parameters in the current version and are priority candidates for future empirical calibration.

---

## 5. Process Step Data

Detailed step-level data (duration in rigid vs flexible mode, mandatory waits, participation by role) are defined per process type in `lib/process-templates.ts`.

These values combine:
- Legal minimum durations (PZP, EU Directive 2014/24)
- OECD Public Procurement Performance data (2023)
- Practitioner benchmarks collected 2018–2025

They are treated as **Calibrated** with a significant modeling component.

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

## Next Steps (as per PHD_ROADMAP)

- Full sensitivity analysis module in the application
- Public replication package
- Empirical validation plan with specific identification strategies

---

**Maintained by**: Paweł Mamcarz  
**Last major update**: June 2026 (audit-driven revision)

This document is version-controlled and intended to become the canonical reference for all quantitative assumptions in ProcuraCost.