# ProcuraCost Model — Full Parameter Documentation

**Version**: 0.9 (Super High Effort)  
**Date**: May 2026  
**Status**: Work in progress — intended for academic review and replication

---

## Purpose of This Document

This document provides complete transparency on every quantitative input in the ProcuraCost model. For each parameter we specify:

- Exact value used in the code
- Type of parameter (Empirical / Calibrated / Modeling Assumption)
- Primary literature or data source
- Justification and limitations
- Sensitivity (how much the overall results depend on this parameter)

---

## 1. Global Behavioral & Economic Parameters

| Parameter | Code Constant | Value | Type | Source | Justification & Limitations | Sensitivity |
|---------|---------------|-------|------|--------|-----------------------------|-------------|
| Price premium from rigid lowest-price selection | `RIGIDITY_PRICE_PREMIUM` | 0.02 (2%) | Empirical | Szucs, F. (2024). "Discretion and Favoritism in Public Procurement". *Journal of the European Economic Association*, 22(1), 117–145. | Based on regression discontinuity around scoring rules in Hungarian public procurement. One of the cleanest causal estimates available. | High |
| Supplier productivity loss from rigid selection | `RIGIDITY_PRODUCTIVITY_LOSS` | 0.016 (1.6%) | Empirical | Szucs (2024), p. 127 | Same paper as above. Effect of awarding to lowest price instead of best value on subsequent supplier performance. | High |
| Base annual renegotiation probability | `BASE_RENEGOTIATION_PROBABILITY` | 0.22 (22%) | Empirical | Beuve, Moszoro & Saussier (2021). "Contractual Rigidity and Political Contestability". NBER Working Paper 28491. | Baseline renegotiation rate in their French public procurement sample. | Medium-High |
| Renegotiation premium from contractual rigidity | `RIGIDITY_RENEGOTIATION_PREMIUM` | +0.077 | Empirical | Beuve et al. (2021) | 7.7 percentage points increase in renegotiation probability per standard deviation increase in rigidity. | High |
| Annual TCO savings potential from flexible sourcing | `TCO_SAVINGS_RATE_PER_YEAR` | 0.10 (10%) | Calibrated | Multiple sources (ISM, CAPS Research, consulting benchmarks 2015–2024) | Conservative estimate of achievable TCO reduction through better supplier selection, specification, and relationship management. Widely cited range is 8–15%. | High |
| Sigmoid steepness for bypass probability | `BYPASS_SIGMOID_STEEPNESS` | 10 | Modeling Assumption | Internal | Controls how sharply bypass probability rises with rigidity. Calibrated so that very rigid processes (PZP EU) produce ~45–55% bypass probability under manual conditions. | Medium |
| Rigidity threshold for bypass acceleration | `BYPASS_THRESHOLD` | 0.5 | Modeling Assumption | Internal | Point on the rigidity scale (0–1) at which bypass risk begins to accelerate significantly. | Medium |

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
| Downstream productivity multiplier | 0.85 | `processPhase === "downstream"` | Modeling Assumption | Rigidity in operational P2P processes has a somewhat lower negative effect on supplier productivity/innovation than rigidity in upstream decisions. |

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

## Next Steps (as per PHD_ROADMAP)

- Full sensitivity analysis module in the application
- Public replication package
- Empirical validation plan with specific identification strategies

---

**Maintained by**: Paweł Mamcarz  
**Last major update**: May 2026

This document is version-controlled and intended to become the canonical reference for all quantitative assumptions in ProcuraCost.