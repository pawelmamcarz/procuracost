# Changelog

All notable changes to ProcuraCost are documented here.

## [Unreleased] - 2026-07-05

### Flexible-path bypass rigidity fix + invariant test suite + CI

**Model fix (`lib/calculations.ts`).** The flexible-path bypass sigmoid was evaluated at the tech level's `policyRigidityIndex` (0.05–0.35) **uncapped**, while every other flexible dimension uses `flexibleRigidity = min(ρ, ρ_policy_only)`. For a low-rigidity operational process (`catalog_order` ρ = 0.20, `mrp_order` ρ = 0.12) on **manual** (0.35) or **sourcing_tool** (0.22) tooling, this scored the flexible "field" path as MORE bypass-prone than its own rigid "tunnel" path — inverting the Tunnel/Field thesis and contradicting the in-code comment. Fix: evaluate the flexible-path bypass at `min(policyRigidityIndex, flexibleRigidity)`; the two comments describing the design were rewritten to document the two-rigidity design honestly. **Recompute impact:** the shipped operational scenarios (catalog/mrp) use `end_to_end` tooling and are unaffected; the two `private_formal` scenarios on non-`end_to_end` tooling shift — **erp** (sourcing_tool) deltaC +802k → **+803k** (+26.73% → +26.77% CV), **production** (manual) deltaC +2.26M → **+2.30M** (+18.83% → +19.20% CV). **Symmetry test unchanged: still 0/9 scenarios with deltaC < 0** — the model remains one where the rigid path never wins across the shipped reference set (a documentation follow-up; no new scenario invented).

**Tests (`vitest`).** Added a `test` script and a first invariant suite asserting: renegotiation premium capped at `RENEGOTIATION_PREMIUM_MAX`; no dimension's total context uplift exceeds ~×1.5 across all spendType × processPhase combos (mirrors `scripts/recompute.ts`); the bypass-fix regression (catalog_order/mrp_order under manual & sourcing_tool: flexible bypass ≤ rigid bypass); `calculateCosts` returns finite numbers with a zero-total deltaPercent guard; `optimize()` never recommends a legally filtered-out path across the PZP threshold bands; `getISOWeek` at year boundaries; and `formatPLN`/`formatCompact` sanity.

**CI (`.github/workflows/ci.yml`).** On `pull_request` and push to `main`: `npm ci`, lint (temporarily `continue-on-error` while parallel branches fix pre-existing app/component lint), test, build, recompute.

**Package hygiene.** `name` `procedura` → `procuracost`; removed the unused `html2canvas` dependency (zero source imports); dropped the dead `getScenarioById` export; named the remaining inline model multiplier literals and reused `PZP_EXEMPTION_PLN` for the optimizer's 130k threshold term (pure refactor, recompute byte-identical).

## [Unreleased] - 2026-07-02

### Full mathematical correction of the cost model + online citation verification

A model-math audit (triggered by a hallucination-verification pass over all documents and the whole `lib/` layer) found and fixed seven classes of defects. Empirical anchors (0.06, 0.22, 0.077, 0.30, 0.10/yr, 0.05) are unchanged — only how they are applied changed. Deterministic recompute now lives in-repo: `scripts/recompute.ts` (`npm run recompute`), printing the §5.1 table, the symmetry test, and a new context-uplift audit.

**Model corrections (`lib/calculations.ts`, `lib/process-templates.ts`):**
- **(A) Staff double counting removed.** The outer `staffIntensityMultiplier` (×1.25 upstream, ×1.15 direct+upstream) re-applied what the role-level multipliers inside `deriveStaffCost` already encode; removed. A duplicated buyer/requestor boost in the indirect+downstream block of `deriveStaffCost` (stacking to ×2.4 on buyer hours) was also removed.
- **(B) Renegotiation unit mismatch fixed.** The Beuve +7.7pp-per-SD effect was applied to a 0–1 index as if it were SD units and context multipliers could push it to ~11.6pp, past the cited 10.5pp. Now: explicit mapping (full 0→1 swing ≈ 1 SD, anchored at 7.7pp) + new `RENEGOTIATION_PREMIUM_MAX = 0.105` hard cap.
- **(C) Symmetry made real.** Removed the flexible-only discounts `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR` (0.70) and `FLEXIBLE_BYPASS_PROBABILITY_SCALE` (0.10). Both paths now share one renegotiation formula `P(ρ) = 0.22 + min(0.077·ρ·m, 0.105)` and one bypass sigmoid, each evaluated at its own rigidity (flexible: ρ_F = min(ρ, 0.15); bypass at the tech level's `policyRigidityIndex`). The rigidity difference alone drives the delta.
- **(D) Consistent bypass-multiplier placement.** Context and tech multipliers both scale the sigmoid **output** (previously one was inside, one outside — dimensionally inconsistent and saturating).
- **(E) TCO multiplier no longer absorbed by the cap.** `C_TCO = V × m_ctx × min(0.10·A(T,5%)·ρ, 0.30)`; effective ceiling 0.30 × m ≤ 0.345. Previously the Direct-spend leverage silently vanished exactly where the cap bound.
- **(F) Upstream compounding bounded.** One economic channel per mechanism: `delayMultiplier` upstream 1.4 → 1.0 (day boosts are the sole calendar channel), coordination 1.3 → 1.15, Direct TCO 1.35 → 1.15 (direction contested by Sievo/Inverto benchmarks), direct+upstream extra ×1.2 TCO removed. New audited invariant: no dimension's total context uplift exceeds ~×1.5 (max observed ×1.483; was ×2.15).
- **(G) Optimizer (`lib/optimizer.ts`).** Weights 11 → 7 (w5–w8 were dead — read by no path, diluting the sensitivity sweep); per-run scores normalized to a true 0–100 scale (dimension-bonus paths previously had raw ceilings up to ~164 vs 100, structurally biasing vote-based winner selection); ranking now by sweep votes with mean-score tiebreak so `confidence = votes/30` describes the displayed winner; explicit unset neutrals for spendType/processPhase in ablation. Deterministic; recommendations changed accordingly.

**Recompute impact (baseline scenarios, spend/phase unset):** ΔC still strictly positive 9/9; favoritism still favors the rigid path 8/9. Renegotiation deltas shrank sharply under the symmetric formula (e.g. pipe_vs_field 28k → 12k); `mrp`'s dominant dimension changed reneg → admin; pipe_vs_field headline +36.19% → **+35.78% of CV**. Tables regenerated in `00-shared-foundation.md` §5, `article-2`, and superseding `VERIFICATION_REPORT.md` §7.

**Citation corrections from a live online verification pass (12 sources checked at the primary source):**
- **Szucs (2024):** effect is "~6 **percent**" (not "6 percentage points"); plain fuzzy-RD reduced form ~9% (8% is the selection-corrected estimate); productivity −10% is the structural estimate. The "≈two-thirds of the effect from firm selection" decomposition could not be verified in any Szucs version and was removed everywhere.
- **"ISM 30% TCO over 3 years" is apocryphal.** The verbatim quote traces to a content farm squatting ISM's former domain (ism.ws, self-declared unaffiliated); no official ISM/CAPS source exists. Relabelled everywhere as an unattributed practitioner heuristic (grey literature), kept only as the Grade-C cap.
- **Fabricated "OECD 554/836 days" removed from the live app** (`app/research`, `app/methodology`) — the project's earlier audit had refuted it but two app pages still published it; four independent web searches confirm no source anywhere contains these figures.
- **Swiss Casinos ERP:** correct attribution is **LAP Alliance / World Procurement Awards 2020** (lean-agile-procurement.com); correct figure **~6 weeks vs ~6 months** (business case → PoC + signed contract). The "4 weeks", "120-day vs 28-day", EY Switzerland and Skylight attributions were wrong (the EY article does not mention Swiss Casinos) and were fixed in both magazine articles, RESEARCH.md, and the app.
- **Bajari, Houghton & Tadelis (2014):** adaptation costs are 7.5–14% *of the winning bid* (not "of contract value"). **EC (2011) PwC study:** aggregate cost is ~1.4% of purchasing volume (was rendered "<1.3%"). **Beuve et al.:** n≈279 unconfirmed (2016 WP reports 396 contracts). **Verified clean:** Beuve authorship (Spiller), Fazekas & Blum 9690 (retraction of "42%" was correct), Decarolis 2014, Coviello & Mariniello 2014, Guasch 2004, UZP 2023 (all five spot-checked figures match the official report).

**Hallucination fixes in documents:** the EN magazine article's body still carried the retracted claims (2% rigidity premium, 42% overruns) while its footer was corrected — body rewritten to the corrected framing (mirror of the PL article). The untracked pre-audit `.docx`/`.rtf` exports of the PL article (which reverted every audit correction, including the Saussier misattribution) were regenerated from the corrected `.md`. `PHD_ROADMAP.md` "five dimensions" → seven. Unverifiable "EY/Deloitte sourcing transformation studies" attribution replaced with an honest Grade-C label.

## [Unreleased] - 2026-06-28

### Comprehensive substantive verification (weryfikacja merytoryczna) + corrections

Full independent verification of the model underpinning the doctoral cycle (deliverable: `docs/VERIFICATION_REPORT.md`). Method: primary-source retrieval for every empirical anchor, adversarial 3-vote refutation on the two anchor studies, parameter triangulation against Polish/EU market data, real-code recompute of all reference scenarios + a symmetry test. 39 corrections logged; the 20 P1 items applied.

**Verified (held up):**
- **Anchor studies survive adversarial review.** Szucs (2024, `DISCRETION_FAVORITISM_PREMIUM=0.06`) and Beuve-Moszoro-Spiller (`0.077`/base `0.22`) passed the 3-vote refutation with 0 refutations; coded numbers match the primary sources, and the model honestly applies Szucs *against* its own thesis (favoritism scales with `1−ρ`, so the discretionary path bears it).

**Corrected:**
- **Stale public page brought into line (highest-priority finding).** `app/methodology/page.tsx` still published the retracted, sign-inverted Szucs "~2%" claim, a "five-dimension" label, the removed opportunity `× 0.02` term, Szucs "117–151", a flat `0.297` renegotiation probability, and an undiscounted/uncapped TCO formula. Rewritten to the corrected seven-dimension model (added Favoritism dim 4 + Bypass dim 7; discretion raises prices ~6pp; `P_R = 0.22 + 0.077 × ρ`; discounted/capped TCO; 117–160). The other UI/docs pages were already corrected in the working tree.
- **Refuted citation removed.** The "OECD (2023) — 554/836 days" infrastructure-duration figures are absent from that paper (grep-verified); softened to an illustrative range with an honest "source to be confirmed" caveat (`RESEARCH.md`).
- **PZP legal fixes.** National publication minimum corrected to **7/14 days (art. 283)** (the "21 dni" was the abolished 2004-PZP value, kept only as a *typical* duration); standstill corrected to **10/15 days (art. 264 ust. 1)** (was "11 dni"); EU supplies/services threshold `900_000 → 930_960` PLN (M.P. 2025 poz. 1247, 1 EUR = 4.31 PLN, valid 2026–2027); added a **`tryb_podstawowy` (art. 275)** path and branched the legality filter on the EU threshold so the 130k–EU band recommends the correct legal basis.
- **Identification labels upgraded.** Beuve relabeled from "observational" to **2SLS/IV** (rigidity instrumented by political contestability); Szucs noted as structural-causal (~6% structural / ~8% reduced-form, Hungarian-public RDD); Guasch "41.5% incl. telecom" corrected to **excluding** telecom; "CAPS Research" dropped from the TCO cite; enforcement-fallacy "empirically" → "analytically predicted".
- **Grade-C relabels.** `TCO_SAVINGS_RATE_PER_YEAR`, `CORRUPTION_RISK_CONTEXT` gradient, `PROCESS_RIGIDITY` cardinals, bypass sigmoid, `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR`, dimension/role multipliers, tech costs all explicitly marked modeling assumptions (Grade C) needing sensitivity tests; stakeholder daily rates documented as Grade B with anchors + gross→loaded conversion.

**Disclosed (not changed):**
- **The symmetry claim is numerically inert.** Real-code recompute: ΔC is strictly positive in 0/9 scenarios — "the rigid path can be net-cheaper" holds only per-dimension (favoritism subsidizes the rigid path) but never at net, because the rigid-favoring term is structurally bounded an order of magnitude below the TCO/opportunity penalties. To be disclosed honestly in all articles, not tuned away. The flat-vs-decaying TCO recalibration (C32) is **deferred** pending a framing decision.

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
