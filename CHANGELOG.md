# Changelog

All notable changes to ProcuraCost are documented here.

## [Unreleased] - 2026-06-24

### Academic-integrity audit: model "honest reframe" + documentation reconciliation

This release corrects a set of citation and framing defects surfaced by an academic-integrity audit, and reconciles the documentation with the rewritten model in `lib/calculations.ts` and `lib/optimizer.ts`.

**Citations corrected (everywhere they appear):**

- **Szucs (2024) — inverted reading fixed.** Correct cite is *JEEA* 22(1):117–160, DOI 10.1093/jeea/jvad017 (was the wrong DOI jvad036 and page ranges 117–145/117–151). The paper shows **discretion** raises prices (~6pp, structural) and selects **less-productive** contractors. Removed the inverted "+2% price premium under rigid procedures" and "−1.6% productivity loss" claims; competitive (rigid) tendering now correctly *averts* a favoritism premium (the governance value of formal procedures). Added the selection/endogeneity caveat (≈two-thirds of the discontinuity is firm sorting).
- **Renegotiation author fixed to Spiller.** Authors are **Beuve, Moszoro & Spiller** (not Saussier); NBER WP 28491, published in *JLEO* (2023). Effect presented as the **observational +7.7–10.5 pp** range, associated-with rather than caused-by.
- **World Bank "42% longer duration" removed.** Unsupported by PRWP 9690 (Fazekas & Blum 2021), which concerns price/value-for-money, not duration. Year corrected to 2021.
- **ISM TCO relabeled** as a practitioner **ceiling** (up to ~30% over multiple years), not a flat 10%/yr empirical rate; the model now discounts the annual stream at 5% and caps cumulative foregone TCO at 30% of contract value.

**Model reconciliation (docs ↔ code):**

- **Five → seven dimensions.** RESEARCH.md corrected from "five-dimensional" to the actual seven dimensions (time, admin, opportunity, favoritism/selection-quality, renegotiation, TCO, bypass) with the full closed form.
- **New governance/selection-quality term + discounting + cap.** `MODEL_PARAMETERS.md` rewritten: added `DISCRETION_FAVORITISM_PREMIUM` (0.06, scales with discretion × `CORRUPTION_RISK_CONTEXT`), documented `TCO_CUMULATIVE_CAP` (0.30) and `DISCOUNT_RATE` (0.05), and documented the `CORRUPTION_RISK_CONTEXT` map (pzp_eu 1.0 … mrp_order 0.15). **Removed** the inverted constants `RIGIDITY_PRICE_PREMIUM` and `RIGIDITY_PRODUCTIVITY_LOSS`.
- **Bypass recalibrated.** `BYPASS_SIGMOID_STEEPNESS` 10→6, `BYPASS_THRESHOLD` 0.5→0.9, new `BYPASS_PROBABILITY_CEILING` 0.95 — realized bypass for a very rigid manual process ≈86% (was ~99% in code / falsely "45–55%" in docs), falling toward ~6% under end-to-end digital.
- **Opportunity cost symmetric.** Now charged to both paths over their own duration (no zero-friction baseline); headline savings labeled a model estimate/range, and the model is symmetric (rigid can be net-cheaper in low-corruption operational contexts).
- **Optimizer honestly relabeled.** It is **not** a Random Forest / trained ML — it is a weighted rule-based scoring function; the "30 trees" are a sensitivity sweep, feature importance is genuine ablation, and it is illustrative (not validated on real data). Removed the Breiman (2001) Random Forest attribution.

**Legal corrections (PZP, 2026 UZP):**

- Articles: open tender Art. 132, restricted Art. 140, competitive dialogue Art. 169, negocjacje z ogłoszeniem Art. 153 (przesłanki), wolna ręka Art. 214 ust. 1. Use "ust."/"pkt", never "§".
- Removed the abolished tryb "zapytanie o cenę"; below-threshold regime is "tryb podstawowy" (Art. 275, three variants).
- Thresholds: exemption 130,000 PLN; supplies/services EU threshold ≈ 600k–930k PLN; works ≈ 23.3M PLN (the old 5,382,000 / 139,117,000 PLN figures were wrong).
- Articles (PL/EN): clarified that free method choice is lawful only for private buyers, public spend < 130k PLN, or public spend with a documented statutory przesłanka — a public buyer may not freely bypass mandatory PZP procedures.

**Transparency claim softened.** Dropped "every output is traceable to an academic source" / "complete transparency on every input" in favor of the accurate statement that principal parameters are documented and only ~35–40% are peer-reviewed.

**Files changed (docs only):** `RESEARCH.md`, `README.md`, `docs/MODEL_PARAMETERS.md`, `docs/EMPIRICAL_VALIDATION_PLAN.md`, `docs/articles/pl/2026-06-tunel-pole-lepszy-biznes.md`, `docs/articles/en/2026-06-tunnel-field-lepszy-biznes.md`, `CHANGELOG.md`.

## [2026.19.3.0] - 2026-05

### Deep Model Differentiation (Direct/Indirect × Upstream/Downstream)

This release significantly deepens the two contextual dimensions introduced after academic feedback (Prof. Krzysztof Piech review). The model no longer treats all procurement uniformly.

**Key technical changes:**

- **Step-level calendar time differentiation** (`deriveRigidDays`, `deriveFlexibleDays` in `lib/process-templates.ts`)
  - Strategic steps (specification prep, clarifications, award committee, contract signing, needs analysis) now receive +22% extra calendar days in rigid path under Direct+Upstream.
  - Flexible path receives correspondingly stronger compression on the same high-overhead steps.

- **Per-step senior effort granularity** (`deriveStaffCost`)
  - Executive and legal hours now receive additional targeted multipliers on the most governance-heavy individual steps (award_committee, contract_signing, siwz_prep, needs_analysis) when context = Direct+Upstream. This is the strongest academic differentiation yet.

- **Live numeric multipliers everywhere**
  - New exported `getDimensionMultiplierDetails()` + improved `getDimensionMultipliers()`.
  - Cost Comparison view now shows a prominent "Zastosowane mnożniki kontekstu" block with exact live values (e.g. TCO leverage 1.62x, Coordination 1.30x).
  - PDF reports contain a clean, paginated numeric table of all applied multipliers with bilingual labels and methodology link.

- **Optimizer scoring strengthened**
  - `scorePath` now applies even sharper conditional weights (up to 1.8× on negotiations, 1.6× on competitive dialogue for Direct+Upstream; strong down-weighting of direct award in the same context).
  - PathOptimizer UI shows quantified impact statements.

- **Interactive Assumptions Explorer (production model)**
  - `/model/assumptions` (and English `/en/model/assumptions`) completely rebuilt.
  - Sliders/selector now drive the *real* `getDimensionMultipliers()` function — you see exactly what the calculator and optimizer will use.
  - Full bilingual support.

### Production visibility & versioning

- All dimension effects are now immediately visible in the main calculator flow (no need to open PDF).
- Version bumped to **2026.19.3.0** (Tesla-style) to clearly mark this model-deepening release and avoid collision with 19.2 deployments.
- English assumptions explorer page added for full production coverage.

### Files changed (core model/UI)

- `lib/process-templates.ts` (days + per-step staff)
- `lib/calculations.ts` (exported helpers)
- `components/CostComparison.tsx` (live multiplier strip + rich context header)
- `components/PDFExport.tsx` (proper numeric table)
- `components/PathOptimizer.tsx` (quantified explanations)
- `app/model/assumptions/page.tsx` + new `app/en/model/assumptions/page.tsx`

This release was built under the explicit mandate "automatycznie rozbudowuj i zmieniaj model" — no heavy documentation, maximum visible model depth.

## Previous versions

See git history for earlier changes.
