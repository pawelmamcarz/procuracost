# ProcuraCost — Substantive Verification Report (Weryfikacja merytoryczna)

**Deliverable:** comprehensive substantive verification of the ProcuraCost procurement-economics model underpinning a doctoral dissertation (Uczelnia Łazarskiego / Lazarski University).
**Frozen commit:** `a1063f9` (HEAD at planning time) — *docs: re-ground cost-model parameters with verified empirical evidence*.
**Verification window:** June 2026. **Legal validity date:** **2026-06-28**.
**Method:** primary-source retrieval (full-text PDFs / DOIs), adversarial 3-vote protocol on the two anchor studies (Szucs, Beuve-Moszoro-Spiller), single-voter adversarial review on remaining citations, parameter triangulation against Polish/EU market data, real-code recompute of all 9 reference scenarios + symmetry test.

---

## 0. Executive Summary

### 0.1 Per-area RAG status

| Area | Status | One-line reason |
|---|:--:|---|
| **Citations** | 🟡 AMBER | 6/10 confirmed, 3 partial (re-citation/caveats), **1 refuted** (OECD 554/836 misattribution). Anchor studies (Szucs, Beuve) survive 3-vote adversarial review with 0 refutations; coded numbers match primary sources. |
| **Parameters** | 🟡 AMBER | 2 well-grounded (DISCOUNT_RATE = B, BASE_RENEGOTIATION_PROBABILITY = A); 7 Grade-C modeling assumptions. Two High-sensitivity Grade-C params (TCO flat 10%/yr; CORRUPTION_RISK_CONTEXT gradient) can move/flip the headline gap and must be relabeled + sensitivity-tested. |
| **Legal-PZP** | 🟡 AMBER | Article mapping (132/140/169/153/214/275) and the 130k exemption are **all correct**; above-EU-threshold legality filter is **safe**. But two statutory minimums are **wrong** (21-day national; 11-day standstill) and the 130k–EU band recommends the wrong legal basis (no Art. 275 path). |
| **Consistency** | 🔴 RED | The stale public pages (`app/methodology`, `app/research`, `app/model`, `app/model/assumptions`) still publish the **retracted, sign-inverted Szucs ~2% claim**, the **"five-dimension"** label, the removed **0.016 productivity-loss** coefficient, `117–151`, and undiscounted/uncapped formulas — directly contradicting the corrected model/`lib` layer. **This is the single most serious finding.** |
| **Recompute** | 🟡 AMBER | Model is reproducible from real `lib/` code; all 9 scenarios computed. But the **symmetry claim is numerically inert**: `deltaC` is strictly positive in 0/9 scenarios — "flexible wins" everywhere, including the maximal-rigidity pzp_eu case. Symmetry holds only per-dimension, never at net. |

### 0.2 MUST-FIX BEFORE WRITING ARTICLES (priority order)

1. **[MOST SERIOUS] Stale public pages publish the retracted, inverted Szucs claim and the wrong dimension count.**
   `app/methodology/page.tsx` and `app/research/page.tsx` (and `app/model/*`) still state that rigid auctions *reduce* prices by **~2%** (the retracted, sign-inverted reading), label the model **"five-dimension"** (it is seven), cite **Szucs 22(1):117–151** (correct is 117–160), show a flat `0.297` renegotiation probability and an undiscounted/uncapped TCO formula, and the `/model` + `/model/assumptions` explorers hardcode the **removed `0.016` productivity-loss** coefficient. These pages are the public face of the dissertation and currently contradict the corrected `lib/` model. **Fix first.** (Corrections C1–C14.)
2. **Refuted citation — OECD 554/836 misattribution.** `RESEARCH.md:136` attributes "554 days (OECD) / 836 days (Sub-Saharan Africa)" infrastructure-procurement durations to OECD (2023), which **contains neither figure, no SSA comparison, and no infrastructure breakout** (grep-verified: 0 hits for "554","836","Africa"). `process-templates.ts:5` similarly mis-sources role-hours to that paper. Re-cite to the true (likely World Bank) source or remove. (C16, C17.)
3. **Two wrong statutory minimums in PZP law.** `process-templates.ts` calls a non-existent **21-day** national minimum (correct: 7/14 days, **art. 283 PZP**) and an **11-day** standstill (correct: 10/15 days, **art. 264 ust. 1 PZP**). (C18, C19.)
4. **130k–EU-threshold legality gap.** `optimizer.ts:437-443` gates only on the 130k exemption; in the 130k–EU band it recommends Art. 132/140/169 (≥EU-threshold trybs) instead of **tryb podstawowy (art. 275)**, contradicting its own policyNote. Add an Art. 275 path + branch the filter on the EU threshold. (C21.)
5. **Methodological honesty — optimizer is NOT ML.** `CLAUDE.md` still calls the optimizer a "Random Forest … ensemble of 30 synthetic decision trees"; every other doc and the UI correctly disclaim this (it is a weighted rule-based scoring function + 30-run sensitivity sweep). Do not let "Random Forest" enter any article. (C22.)
6. **Relabel + sensitivity-test the High-sensitivity Grade-C parameters** before quoting any headline magnitude: `TCO_SAVINGS_RATE_PER_YEAR` (flat 10%/yr) and `CORRUPTION_RISK_CONTEXT` gradient both materially move (and can flip) the rigid-vs-flexible gap. (C32, C33.)

**Count of P1 corrections: 20** (see §8).

---

## 1. Scope & Method

- **Object of verification:** the self-contained cost model in `lib/` (`calculations.ts`, `process-templates.ts`, `optimizer.ts`, `scenarios.ts`), its supporting research docs (`RESEARCH.md`, `docs/MODEL_PARAMETERS.md`), and the public UI pages that present the model.
- **Frozen state:** commit `a1063f9` (HEAD at planning time). All file:line references are against this commit.
- **Citation protocol:** each empirical claim was checked on five axes — **Direction** (sign), **Magnitude** (coded value vs source value, cherry-pick check), **Population** (external-validity / transfer), **Identification** (causal vs observational + endogeneity caveat), and **Verbatim fidelity** (exact quote + page). The two anchor studies (Szucs 2024; Beuve-Moszoro-Spiller 2021) were run through an **adversarial 3-vote protocol** (3 independent reviewers each attempting refutation); remaining citations had 1 adversarial reviewer. A claim "survives" only if `refutedCount = 0`.
- **Tools:** full-text PDF retrieval + `pdftotext` extraction (NBER, World Bank, eScholarship, EC docsroom, OECD), DOI/landing-page cross-checks (Oxford Academic, AEAweb, RePEc, ScienceDirect), Polish salary data (Sedlak & Sedlak / wynagrodzenia.pl, GUS, Hays), Polish statute (ISAP, UZP ekomentarz, M.P. 2025 poz. 1247), and a **real-code recompute harness** (Node v26 native TS type-stripping over verbatim copies of `lib/`).
- **Independence note:** the recompute imports the *actual* `calculateCosts` + `SCENARIOS`; no re-implementation. Reference scenarios do not set `spendType`/`processPhase`, so the Direct/Indirect × Upstream/Downstream multipliers are dormant (= 1.0) for all shipped cases.

---

## 2. Citation Verification Table

Legend — Direction/Magnitude/Population/Identification: M = match, ≈ = approx, ✗ = mismatch/absent. Adversarial: voters / refuted.

| # | Claim (file:line) | Source + DOI | Verbatim quote + page | Dir. | Magn. | Popn. | Ident. | Adv. (v/ref) | Verdict | Action |
|--|--|--|--|:--:|:--:|:--:|:--:|:--:|:--:|--|
| 1 | `DISCRETION_FAVORITISM_PREMIUM=0.06` — `calculations.ts:97-99,384` | **Szucs (2024)**, JEEA 22(1):117–160, DOI 10.1093/jeea/jvad017 (struct. figures from 2018 Berkeley diss.) | "discretion increases normalized price by **6 percent** … decreases average productivity of contractors by 10 percent" (Intro/Structural, ~p.5) | M | M (struct. 6%; RF 8%; raw ~9%) | ✗ Hungarian public (25M HUF reform) → generic/PL/private | Causal (RDD + reform timing + structural selection-correction; value-manipulation/bunching caveat) | **3 / 0** | **Confirmed** | Keep 0.06. Edit comment "~6pp"→"~6% (structural causal; RF 8%)"; add Hungarian-public + identification caveat; cite JEEA DOI. (C24) |
| 2 | `RIGIDITY_RENEGOTIATION_PREMIUM=0.077`, `BASE…=0.22` — `calculations.ts:100-101,385` | **Beuve, Moszoro & Spiller**, NBER WP28491 (2021); JLEO 39(1):281–308 (2023), DOI 10.1093/jleo/ewab022 | "one SD increase in each category of contractual rigidity increases contract renegotiation by **7.7–10.5 percent**, … from an unconditional average of **22 percent**" (§6, ~p.18) | M | M (0.077 = 7.7 low end; 0.22 = base) | ✗ French car-park sector, single firm, n=279 est. sample → PL/general | **Mislabeled.** Source string says "observational" but it is **2SLS/IV** (rigidity instrumented by political contestability; exclusion-restriction load-bearing) | **3 / 0** | **Partial** | Keep numbers. Change "observational"→"2SLS/IV (instrumented)"; add French car-park + per-SD-dose caveat. (C25) |
| 3 | `BASE_RENEGOTIATION_PROBABILITY=0.22` corroboration — `MODEL_PARAMETERS.md:30,158` | **Guasch (2004)**, *Granting and Renegotiating Infrastructure Concessions*, World Bank, ISBN 0-8213-5792-1 | "occurring in **30 percent** … Not including telecommunications … raises the incidence … to **41.5 percent**" (Overview pp.12–13, Tbl 1.7); "60 [%] … lowest tariff … (11 percent) … highest transfer fee" (Tbl 1.16) | M | **≈ / inverted label**: 30/60/11/>1,000 match, but model writes "≈41.5% **incl.** telecoms" — source: 41.5% is **EXCLUDING** telecom | ✗ LAC infrastructure concessions → general procurement | Observational (incidence + cross-tabs + non-experimental probit; design jointly chosen) | 1 / 0 | **Partial** | Fix inversion: "≈41.5% EXCLUDING telecom (30% incl.)". Keep as corroborating cite. (C26) |
| 4 | "competition does not increase delay" — `MODEL_PARAMETERS.md:151,162` | **Coviello & Mariniello (2014)**, J. Public Econ. 109:76–100, DOI 10.1016/j.jpubeco.2013.10.008 | "publicity … reduces the likelihood that the project is delivered with delay by **41.4% (7.8%)** … does not increase subcontracting" (§6.4, Tbl 7; Conclusion §8) | M (model conservative; source finds delay *falls*) | M (no number imported) | ✗ low-value (€200k–800k) Italian public works, avg-bid → PL/private/CAPEX | Causal (sharp/fuzzy RDD at €500k; McCrary; placebo). Delay result on reduced subsample | 1 / 0 | **Confirmed** | Keep. Optional: reframe to "publicity/competition does not increase (and reduces ~−7.8pp) delay"; add external-validity note. (mechanism = *selection*, not competition per se) |
| 5 | "≥50% of low-price savings erased ex-post" (TCO premise) — `MODEL_PARAMETERS.md:32,150,161,166` | **Decarolis (2014)**, AEJ:Applied 6(1):108–132, DOI 10.1257/app.6.1.108 | "**at least half** of the cost savings from lower winning prices are lost because of ex post renegotiation … screening … reduces the initial cost savings by a third" (Abstract, p.108) | M | M (= "at least half"; premise only, not coded magnitude) | ≈ Italian public-works, non-binding bids → cross-sector/PL | Causal (quasi-exp.; staggered first-price adoption; adoption-timing caveat) | 1 / 0 | **Confirmed** | Keep. Complete title subtitle "…: Evidence from Procurement Auctions"; add scope caveat. (C29) |
| 6 | "adaptation cost ≈8–14% of contract value" co-anchor — `MODEL_PARAMETERS.md:31,149-160` | **Bajari, Houghton & Tadelis (2014)**, AER 104(4):1288–1319, DOI 10.1257/aer.104.4.1288; mech. Bajari & Tadelis (2001) RAND 32(3):387–407 | "adaptation costs account for **8–14 percent** of the winning bid" (Abstract). WP versions: "about ten percent" | M | M (vers.-of-record abstract renders **7.5–14%**; author PDF 8–14%; WP ~10%) | ≈ Caltrans CA highway-paving → general/EU/PL | Observational + structural; engineer-identity IV + firm FE; contract-form endogeneity (Bajari-Tadelis 2001) correctly invoked | 1 / 0 | **Confirmed** | Keep. Note version-of-record "7.5–14%"; add US-Caltrans transfer caveat; do **not** reuse as TCO basis (double-count risk with reneg dim). (C27) |
| 7 | `TCO_SAVINGS_RATE=0.10`, `CAP=0.30` — `calculations.ts:104-105,386` | **ISM**, "Understanding Total Cost of Ownership in Procurement," ism.ws (no DOI; trade/FAQ) | "TCO-based strategies can deliver **up to 30%** sourcing cost savings over three years" (FAQ; attributed by ISM to *Supply Chain Management Review*) | M | ≈ (10%/yr, 30% cap mirror "30% over 3 yrs") | ✗ undefined cross-industry US private → PL public | Observational/anecdotal "up to" ceiling; no control/counterfactual | 1 / 0 | **Partial** | **Mis-attribution:** drop "/ CAPS Research" (unsupported; CAPS metrics ≈2% of spend / $7.23 ROI, not 30%). Re-cite to ISM page; flag SCMR best-case provenance; keep as conservative cap only. (C28) |
| 8 | €28k/procedure, 75/25, 5.4 bidders, 38 p-days, €5.26bn, 6–9%/18–29% regressivity — `MODEL_PARAMETERS.md:73-82` | **PwC/London Economics/Ecorys (2011)** for EC; figures in EC June-2011 evaluation summary, §7 | "average cost … approximately **€28 000** … 75% … incurred by suppliers … 5.4 bids … 38 days … **€5.26 billion** … less than 1.3% … 18 and 29% … 6 and 9%" (pp.18–19) | M | **M (exact on every figure)** | ✗ EU above-threshold public, EEA-30 2009 → broader incl. private/PL | Observational cost-accounting; **attribution caveat**: only ~0.4% of value (~€1.68bn) is Directive-incremental, not full €28k | 1 / 0 | **Confirmed** | Keep (verbatim-accurate). Add caveat: €28k is *total* procedure cost (75% supplier-side), not the rigidity premium; name primary study + EU-scope. |
| 9 | "OECD (2023) documents 554 days (OECD) / 836 days (SSA)"; role-hours "benchmarked from OECD (2023)" — `RESEARCH.md:136`; `process-templates.ts:5` | **OECD (2023)**, *Public Procurement Performance*, DOI 10.1787/0dde73f4-en | Paper lists "duration of procurement processes" only as a **KPI to be measured**. Full-text grep: **0** hits for "554","836","Africa","Sub-Saharan"; not infrastructure-specific; no role-hour survey | ✗ (no value of any sign in source) | **✗ (figures absent)** | ✗ (no SSA, no infra, no role-hours) | Normative KPI framework — neither causal nor observational measurement | 1 / 0 | **Refuted** | **Re-cite or remove.** Locate true source of 554/836 (likely World Bank infra-delay benchmarking) + verify magnitudes/population; soften `process-templates.ts:5` to "calibrated/illustrative." (C16, C17) |
| 10 | Enforcement-fallacy / optimizer theory bundle — `RESEARCH.md` §6.4, L17/35/205/300-312; `optimizer.ts:12` | **Holmström & Milgrom (1991)** JLEO 7:24–52 (JSTOR 764957); +Lipsky 1980, Vaughan 1996, Goodhart 1975, Scott 1998, Norman 1988, DiMaggio-Powell 1983, Kraljic 1983 (HBR) | "an increase in an agent's compensation in any one task will cause some reallocation of attention away from other tasks … desirability of providing incentives for any one activity decreases with the difficulty of measuring performance in any other" (pp.25–26) | M (enforcement crowds out value) | N/A (qualitative; no number coded; optimizer weights = stated assumptions) | Divergent by design (teachers/NASA/UK monetary/etc.) → procurement by analogy | Theoretical/deductive + qualitative case studies; not causal-empirical | 1 / 0 | **Confirmed** | Keep; bibliographic details exact. Soften "**empirically** predicted to fail" → "theoretically/analytically predicted" (RESEARCH.md:17,312). (C30) |

**Adversarial highlights (anchor studies):** the famous "Szucs inversion" risk (using Szucs to argue *rigidity* is costly) is **NOT present** in `lib/` — the favoritism premium scales with `(1 − rigidity)`, so the flexible/discretionary path correctly bears more of it and competitive tendering averts it (model honestly imports a finding that cuts *against* its own thesis). The model further attenuates the Hungarian-public transfer via `CORRUPTION_RISK_CONTEXT`, so the "applied generically" critique slightly overstates the transfer. Both anchors survived all three votes.

---

## 3. Parameter-by-Parameter Table

| # | Parameter (file:line) | Value | Grade | Source(s) | In-range? | Sens. | Verdict | Action |
|--|--|--|:--:|--|--|:--:|:--:|--|
| P1 | Stakeholder fully-loaded daily rates (`scenarios.ts:18-25` + per-scenario; consumed `process-templates.ts:827`) | 900/800/1200/900/1500/2500 PLN/day | **B** | Sedlak&Sedlak/wynagrodzenia.pl 2024, GUS X.2024, Hays 24/25 | Yes — triangulate to fully-loaded range (×1.205 ZUS ÷21d ×1.3–1.6 OH); manager/exec sit at upper end (exec only fits board/C-level) | Low | Partially-grounded | Keep; **document in MODEL_PARAMETERS.md as B** with anchors+conversion; optionally trim manager ~1,100–1,300; label exec "board/C-level." Keep user-overridable. (C39) |
| P2 | `DISCOUNT_RATE=0.05` (`calculations.ts:107`, used :338, cited :386) | 0.05 | **B** | EU CBA 2014-2020 social discount rate (5% real, Cohesion incl. PL); NBP 3.75% < 5% ≈ PL 10Y 5.30% < KPMG WACC avg 8.5% | Yes — central/triangulated | Low | **Grounded** | Keep. Name EU CBA 5% real anchor in comment; treat 2021-27 3% / WACC as sensitivity toggles only. |
| P3 | `TECH_LEVELS` timeMultiplier / coordCostPerDay / toolCostPerProcess (`process-templates.ts:50-103`, comment :6) | tM 1.40/1.15/1.00/0.70; coord 500/200/100/20; tool 0/800/1200/2000 | **C** | APQC, Hackett (timeMultiplier); vendor pricing non-public (Coupa/Ariba/Jaggaer/Ivalua) | Mixed — timeMultiplier in APQC/Hackett band (→ could reach B); coord/tool cardinal values have **no source range** | Low | Partially-grounded | Relabel C; re-source timeMultiplier to APQC+Hackett; **fix `:6` comment** (drop unsubstantiated "EY/Deloitte"); mark coord/tool as modeling assumption. (C31) |
| P4 | TCO foregone-savings: `TCO_SAVINGS_RATE_PER_YEAR=0.10` cap `0.30` (`calculations.ts:104-105`, applied 337-346; `MODEL_PARAMETERS.md:32-34,150`) | 0.10/yr, cap 0.30 | **C** | Premise: Decarolis 2014, BHT 2014 (peer-reviewed). Magnitude: ISM/CAPS (unsourced "up to 30%") | Mixed — 10% in yr-1 band (8-15%), but applied **flat** > decaying central path (5-15%→2-5%/yr) | **High** | Partially-grounded | **Recalibrate to decaying schedule** (5-15% yr1 → 2-5%/yr); keep 30% cap; anchor premise to Decarolis, not ISM; **sensitivity-sweep** (6/8/12% yr1). Single most influential weak param — cap binds at large absolute value on high-value/long-horizon cases. Do NOT borrow BHT 7.5-14% (double-count). (C32) |
| P5 | `PROCESS_RIGIDITY` cardinal ρ (`process-templates.ts:108-117`) | 0.95→0.12 (pzp_eu…mrp_order) | **C** | Fazekas-Kocsis CRI, Beuve et al., EU restrictiveness spectrum | Ordinal ranking triangulated; **cardinal values have no 0–1 anchor** (Beuve = clause-level, not procedure-type) | Medium | Partially-grounded | Relabel C; keep ordinal ranking; **sensitivity-test pzp_eu=0.95** on sign of public-procurement gap. Minor: capex 0.72 > private_formal 0.60 flippable. (C34) |
| P6 | `CORRUPTION_RISK_CONTEXT` (`process-templates.ts:125-134`; multiplies 0.06 at `calculations.ts:99`) | pzp_eu 1.0 → mrp_order 0.15 | **C** | Szucs 2024 (anchors pzp_eu=1.0); OECD (ordinal only) | Partial — high anchor 1.0 grounded + ordinal defensible; **lower/intermediate gradient (0.9/0.6/0.45/0.4/0.2/0.15) in no source range** | **High** | Partially-grounded | Relabel C (not implied-empirical). Cite Szucs for 1.0; OECD for ordinal only; **sensitivity-test the gradient** (flips rigid-vs-flexible sign; underpins symmetry claim at `app/research:436`); optionally expert-elicit. (C33) |
| P7 | Direct/Indirect × Up/Downstream dimension multipliers (`calculations.ts:113-161`, comment :44) | 0.85×–1.4× (compounds ~1.62× tco) | **C** | Kraljic 1983 (direction only); Sievo/Inverto (indirect savings 10-40% > direct 6-12%) | No source range; round-number judgments. **Direct-TCO ×1.35 direction contradicted** by savings-potential benchmarks | Low (sign/symmetry); High (magnitude, ~+27% Direct+Upstream) | Partially-grounded | Keep values (sign-neutral; shared multipliers scale both paths → cannot flip sign). Replace ":44 academic-review-feedback" comment with modeling-assumption marker; **expert-elicit Direct-TCO ×1.35**. Dormant in shipped scenarios. (C35) |
| P8 | Step-level role-hour multipliers (`process-templates.ts:745-833`, comment 762-767) | 0.5×–1.85× | **C** | Kraljic, CIPS, APQC (direction); no role-hour source | Directional signs consistent; **magnitudes in no published range**; "practitioner interviews" provenance unsubstantiated (no N/instrument) | Low | Partially-grounded | Relabel C; replace ":762-767 practitioner-interviews" comment with honest marker; document in MODEL_PARAMETERS.md; commission structured time-allocation survey for primary stage. (C36) |
| P9 | Renegotiation-prob family: `BASE=0.22` + `FLEXIBLE_…FACTOR=0.7` (`calculations.ts:101,200`; reneg premium 0.077 :100) | 0.22 base; flex = 0.154; rigid = 0.22+0.077·ρ | **A** (0.22) / **C** (0.7 factor) | Beuve-Moszoro-Spiller (unconditional avg 22%); Guasch/Laffont/Straub (conservative vs ~30%) | 0.22 = **exact source central value**; 0.077 = low-bound of 7.7-10.5; **0.7 factor (→15.4%) unsourced** | Medium | Partially-grounded | Keep 0.22 + add inline Beuve cite at L101; **relabel 0.7 factor as C** + sensitivity-test (0.6–0.85). (C37) |
| P10 | Bypass sigmoid: `STEEPNESS=6`, `THRESHOLD=0.9`, `CEILING=0.95`, `FLEXIBLE_…SCALE=0.1` (`calculations.ts:187-189,205`) | k=6, x0=0.9, ceil=0.95, scale=0.1 | **C** | Holmström-Milgrom, Lipsky, Vaughan (direction only); maverick-spend benchmarks | **No source range** for form params. Realised rigid ~86% bypass **exceeds** empirical off-contract band (APQC ~1.8%, Hackett ~29%, Bartolini ~25-50%) by 2-3× | Medium | Partially-grounded | Relabel C; note constants are modeling assumptions (sign only); add note in code; commission primary bypass/maverick audit to lower ceiling toward ~30%; expert-elicit k/x0 interim. (C38) |

---

## 4. Internal-Consistency Findings (diff list)

**Canonical / corrected layer (mutually consistent):** `lib/calculations.ts` (7 dims; `DISCRETION_FAVORITISM_PREMIUM=0.06`; no `RIGIDITY_PRICE_PREMIUM`/`RIGIDITY_PRODUCTIVITY_LOSS`; Szucs 117–160), `docs/MODEL_PARAMETERS.md`, `RESEARCH.md`, `README.md`, `app/page.tsx`, `app/en/page.tsx`, `lib/i18n.ts`.
**Scope note:** there are **no** `app/en/methodology` or `app/en/research` files — `app/methodology/page.tsx` and `app/research/page.tsx` ARE the English pages. The `/model` and `/model/assumptions` pages **do** have `/en` duplicates, and both are stale. `RESEARCH.md ↔ MODEL_PARAMETERS.md ↔ calculations.ts` reconcile value-by-value with **no mismatches**.

### A. Stale public pages — the retracted/inverted reading still live

| file:line | current (wrong) | should-be | evidence |
|--|--|--|--|
| `app/methodology/page.tsx:24,71` | "a five-dimensional cost model" / "Five-Dimension" | seven-dimensional | `calculations.ts:49-63`; `RESEARCH.md:122-124` |
| `app/methodology/page.tsx:27-28,111-113` | "redistributes roughly **2%** of contract value to firms" | discretion **raises** prices ~6pp (structural); competitive tendering averts favoritism | `calculations.ts:97-99`; `RESEARCH.md:171` |
| `app/methodology/page.tsx:105` | `= contract_value × 0.02 + delay_days × …` | opportunity = `days × dailyCostOfInaction`; favoritism separate `V × 0.06 × (1−ρ) × κ` | `0.02` = removed `RIGIDITY_PRICE_PREMIUM`; `calculations.ts:314-323` |
| `app/methodology/page.tsx:110,162` | "22(1):**117–151**" | 117–160 | `calculations.ts:384`; `CHANGELOG.md:13` |
| `app/methodology/page.tsx:125` | `P_rigid = 0.22 + 0.077 = 0.297` | `0.22 + 0.077 × ρ` (flat only at ρ=1) | `calculations.ts:326-328` |
| `app/methodology/page.tsx:143` | `= V × 0.10/yr × horizon × (1−flexibility)` | discounted (5%) annuity, rigidity-scaled, capped 30% | `calculations.ts:337-346` |
| `app/methodology/page.tsx:75-152` (§2) | lists only 5 dims | 7 dims — **missing favoritism (dim 4) and bypass (dim 7)**; numbering off | `RESEARCH.md:160` |
| `app/research/page.tsx:7,63,149,302,305,420,557` | "five-dimension(al)" | seven-dimension | as above |
| `app/research/page.tsx:66-67,329,494` | "rigid auction requirements can reduce purchase prices by ~**2%**" | discretion raises prices ~6pp | `calculations.ts:7-9,97-99` — page contradicts its **own** correct ref list at L612 (117–160) |
| `app/research/page.tsx:327` | `α = 0.02 … ΔC_opp = … − V × α` | 0.02 removed; favoritism separate 0.06 | `MODEL_PARAMETERS.md:39` |
| `app/research/page.tsx:335` | `P_R = 0.22 + 0.077 = 0.297` | scaled by ρ (`P_F = 0.154` correct) | `calculations.ts:326-328` |
| `app/research/page.tsx:343` | `C_TCO = V × γ × T × (1−φ)` undiscounted/uncapped | discounted + capped at 30% | `calculations.ts:337-346` |

### B. Retracted-coefficient leaks (productivity-loss 0.016)

| file:line | current (wrong) | should-be | evidence |
|--|--|--|--|
| `app/model/page.tsx:42` & `app/en/model/page.tsx:42` | "Productivity loss … ~**1.6%**" | remove → favoritism/selection-quality (~6pp) | `RIGIDITY_PRODUCTIVITY_LOSS (0.016)` removed (`MODEL_PARAMETERS.md:7,39`; `CHANGELOG.md:13`) |
| `app/model/assumptions/page.tsx:49,58` & `app/en/model/assumptions/page.tsx:41,48` | `… * 0.016 * (productivityMultiplier − 1)` | `0.06` (`DISCRETION_FAVORITISM_PREMIUM`) | `calculations.ts:99,321` — these pages claim to show "the exact multipliers the production model applies" |
| `app/model/assumptions/page.tsx:48` PL / `:40` EN | renegotiation `* 0.03 *` | no 0.03 constant exists; model uses `renegotiationCost × probability` | `calculations.ts:326-335` |

### C. Dimension-4 naming drift ("productivity" vs "favoritism/selection-quality")

The code **field** is `productivityCost` (kept for chart compatibility, `calculations.ts:57-59`), but the canonical *dimension name* is favoritism/selection-quality (`i18n.ts:132,194`; `RESEARCH.md:160`). Stale "productivity" labels: `README.md:20,79`; `CLAUDE.md:32`.

### D. Optimizer "Random Forest" mislabel — `CLAUDE.md` vs everything else

`MODEL_PARAMETERS.md:138`, `README.md:21`, `i18n.ts:287,328`, `CHANGELOG.md:24` all state it is **not** a Random Forest (weighted rule-based scoring + 30-run sensitivity sweep; "no Breiman (2001) Random Forest"). `CLAUDE.md:10` ("Random Forest path optimizer") and `:33-34` ("deterministic ensemble of 30 synthetic decision trees") still claim otherwise. (Minor residual "trees"/"ensemble" vocab in `optimizer.ts:362,498,504,578` and `i18n.ts:310` is acceptable because surrounding copy explicitly disclaims "NOT a real random forest.")

### Five numbers that appear with two values across files
1. Favoritism magnitude: `0.06`/"~6pp" (canonical) vs `0.02`/"~2%" (methodology, research pages).
2. "Productivity loss": absent (model) vs `~1.6%`/`0.016` (model + assumptions pages).
3. Szucs page range: `117–160` vs `117–151` (methodology:110,162).
4. Rigid renegotiation prob: `0.22 + 0.077 × ρ` vs flat `0.297` (methodology:125; research:335).
5. Dimension count: `7` vs `5` (methodology, research pages).

---

## 5. PZP Legal Findings

**Valid as of 2026-06-28.** Verified against consolidated Prawo zamówień publicznych (ustawa 11.09.2019, t.j. **Dz.U. 2026 poz. 793**), Directive 2014/24/EU, and 2026 thresholds from **Obwieszczenie Prezesa UZP z 8.12.2025 (M.P. 2025 poz. 1247)**, EUR rate 4.31 PLN.

### 5.1 Article mapping — ALL CORRECT (no change)
| Path | Code | Statute | Verdict |
|--|--|--|--|
| przetarg nieograniczony | Art. 132 (`optimizer.ts:61`) | art. 132 (132–139) | correct |
| przetarg ograniczony | Art. 140 (`:95`) | art. 140 (140–151) | correct |
| dialog konkurencyjny | Art. 169 (`:125`) | art. 169 (169–188) | correct |
| negocjacje z ogłoszeniem | Art. 153 (`:159`) | art. 153 (przesłanki) | correct |
| wolna ręka | Art. 214 ust. 1 (`:159,225`) | art. 214 ust. 1 | correct |
| tryb podstawowy | Art. 275 (policyNote `:592,604`) | art. 275 | correct |

### 5.2 Thresholds
- **130,000 PLN exemption** — correct (`PZP_EXEMPTION_PLN`, `optimizer.ts:424`; art. 2 ust. 1 pkt 1).
- **Works EU threshold** "~23.3M PLN" — accurate (5,404,000 EUR = 23,291,240 PLN; `process-templates.ts:586-587`).
- **`EU_THRESHOLD_SUPPLIES_SERVICES_PLN = 900_000`** (`optimizer.ts:425`) — ~3% low vs real **sub-central 930,960 PLN** (216,000 EUR). Central-government threshold is only 603,400 PLN, so the "conservative default" comment is mildly misleading. **Minor fix:** set to `930_960`, refresh dated source comment.

### 5.3 Statutory minimum waiting periods
- **35 days publication (pzp_eu)** — **CORRECT** (`process-templates.ts:166-170`; art. 138 ust. 1).
- **21 days publication (pzp_krajowy)** — **INCORRECT** (`process-templates.ts:253-261`, note "min. 21 dni"). No 21-day national minimum exists; **art. 283** sets **7 days (dostawy/usługi) / 14 days (roboty budowlane)**. The "21 dni" echoes the old 2004 PZP. The 21-day `rigidDays` may remain as a *modeled typical*, but the note must not call it the legal minimum.
- **11 days standstill (pzp_eu)** — **INCORRECT** (`process-templates.ts:206-214`, `rigidDays: 11`). **Art. 264 ust. 1** sets **10 days (komunikacja elektroniczna) / 15 days (inny sposób)**. "11 days" is not statutory.

### 5.4 Hard legality filter (`optimizer.ts:437-443`)
- **Above EU threshold: SAFE.** Public ≥ threshold is hard-limited to `PUBLIC_COMPETITIVE_PATHS` = {przetarg_otwarty, przetarg_ograniczony, dialog_konkurencyjny}; negocjacje/agile/wolna ręka (requiring documented przesłanki not modeled) are correctly excluded. Cannot recommend a forbidden negotiated/single-source award.
- **GAP — 130k–EU band.** The gate uses only `PZP_EXEMPTION_PLN` (130k); the EU threshold appears **only in policyNote text, never in `feasiblePathIds`**. So a 130k–~900k public contract still gets {Art. 132/140/169}, but the lawful procedure below the EU threshold is **tryb podstawowy (art. 275)** — and there is **no Art. 275 path object** in `PATHS`. Result: a recommended path whose cited article is the **wrong legal basis** for a sub-EU-threshold buy, contradicting the tool's own policyNote. Not a forbidden-tryb leak (open competition is never prohibited), but a real correctness gap. **Fix:** add a `tryb_podstawowy` path (pzpArticle "PZP Art. 275") and branch `feasiblePathIds` on the EU threshold.

---

## 6. Methodological Soundness Notes

1. **The optimizer is NOT machine learning.** It is a deterministic weighted rule-based scoring function (one formula per path) with a 30-run sensitivity sweep; weights are explicitly declared "modeling assumptions, not parameters fitted to real procurement outcomes" (`optimizer.ts:6-11`). The "Random Forest / 30 synthetic decision trees" framing survives **only in `CLAUDE.md`** and must be corrected before any methods section is written (C22). Every user-facing surface already disclaims it.
2. **Endogeneity caveats preserved.** Every causal anchor carries the correct identification caveat: Szucs (value-manipulation/bunching → RDD + structural correction), Beuve (rigidity instrumented by political contestability; exclusion restriction load-bearing — the code's "observational" label *understates* this and must be upgraded, C25), Coviello-Mariniello (no-manipulation RDD + reduced subsample), Decarolis (non-random adoption timing), Guasch/BHT (contract form jointly chosen with complexity). These should be retained verbatim in the dissertation.
3. **Estimates ≠ measured facts.** The model's headline outputs are *estimates* built from transported parameters, several Grade-C (modeling assumptions rendered as cardinal numbers). The honest framing — already partly in `MODEL_PARAMETERS.md` — must be preserved: external-validity transfers (Hungarian public procurement, French car-parks, Italian public works, Caltrans highways, LAC concessions, US private-sector trade press) are order-of-magnitude benchmarks, not Polish measured values.
4. **The symmetry claim is directionally implemented but numerically inert** (see §7). The favoritism dimension genuinely subsidizes the rigid path, but it is structurally capped an order of magnitude below the rigid-penalizing terms, so the model always concludes "flexible wins." This must be disclosed, not presented as an emergent finding.

---

## 7. Reproducibility

Real-code recompute via Node v26 native TS type-stripping over verbatim `lib/` copies (imports actual `calculateCosts` + `SCENARIOS`). All 9 entries computed. Artifacts: `scratchpad/harness.ts`, `calculations.ts`, `process-templates.ts`, `scenarios.ts`, `harness-output.json`, `report.txt`. All scenarios leave `spendType`/`processPhase` unset → dimension multipliers = 1.0 (Direct/Indirect × Up/Downstream deepening is dormant for shipped cases).

### 7.1 Per-dimension Δ (rigid − flexible), PLN. Δ>0 = rigid costs more.

| scenario (type / tech) | CV | time | admin | opp | favor. | reneg | tco | bypass | TOT rigid | TOT flex | **deltaC** | **% CV** | dominant |
|--|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--|
| fleet (private_formal/partial_erp) | 5.0M | 0 | 3k | 120k | −54k | 17k | 418k | 32k | 940k | 404k | **+536k** | +10.72% | tco |
| erp (private_formal/sourcing_tool) | 3.0M | 0 | 6k | 420k | −32k | 34k | 368k | 27k | 1.44M | 621k | **+823k** | +27.42% | opp |
| logistics (private_formal/partial_erp) | 8.0M | 0 | 3k | 480k | −86k | 45k | 980k | 50k | 2.46M | 992k | **+1.47M** | +18.41% | tco |
| production (private_formal/manual) | 12.0M | 0 | 16k | 1.65M | −130k | 56k | 514k | 213k | 4.34M | 2.02M | **+2.32M** | +19.34% | opp |
| pipe_vs_field (pzp_eu/partial_erp) | 5.0M | 14k | 8k | 730k | −240k | 28k | 1.09M | 181k | 2.48M | 672k | **+1.81M** | +36.19% | tco |
| catalog (catalog_order/end_to_end) | 50k | 0 | 1k | 0 | −30 | 0 | 238 | −35 | 5k | 3k | **+1.6k** | +3.15% | admin |
| mrp (mrp_order/end_to_end) | 500k | 0 | 1k | 0 | 0 | 2k | 0 | −204 | 25k | 22k | **+2.7k** | +0.54% | reneg |
| capex_investment (capex/partial_erp) | 15.0M | 0 | 3k | 720k | −308k | 97k | 2.76M | 249k | 7.02M | 3.50M | **+3.52M** | +23.49% | tco |
| custom (private_formal/partial_erp) | 1.0M | 0 | 3k | 240k | −11k | 11k | 84k | 6k | 618k | 284k | **+334k** | +33.36% | opp |

### 7.2 Symmetry test — does `deltaC` ever flip sign?

**No. 0 of 9 scenarios.** `deltaC` is strictly positive everywhere — **flexible is net-cheaper in every shipped case**, including the maximal-stakes `pipe_vs_field` (pzp_eu, `CORRUPTION_RISK_CONTEXT = 1.0`, ρ = 0.95), which is in fact the **single widest gap** as a share of contract value (+36%). The favoritism dimension *does* favor the rigid path in 8/9 scenarios (Δ from −11k to −308k; mrp exactly 0 because ρ=0.12 ≤ the 0.15 policy floor), so governance value is credited per-dimension — but never wins the net. The gap is driven by `tcoCost` (4: fleet, logistics, pipe_vs_field, capex) or `opportunityCost` (3: erp, production, custom) in every value-significant case; `catalog` (admin) and `mrp` (reneg) are the two sub-threshold micro-cases.

**Verdict:** the model's central honesty claim — that it is symmetric so "the rigid path can be net-cheaper for high-value, high-corruption-risk, competitive contexts" — **holds only as a per-dimension gesture and is refuted at net `deltaC`.** The only rigid-favoring term is structurally bounded (`|ΔC_fav| = CV × 0.06 × κ × (ρ_R − ρ_F)` ≤ 0.048·CV even at pzp_eu/κ=1.0), while the rigid-penalizing TCO (up to 30% cap) and opportunity (long rigid day-counts) terms run 4–10× larger (20–36% of CV). No shipped scenario flips negative, and none realistically could without raising `DISCRETION_FAVORITISM_PREMIUM`, allowing `CORRUPTION_RISK_CONTEXT > 1.0`, or shrinking the TCO/opportunity penalties. **The symmetry framing is directionally implemented but numerically inert** — disclose accordingly.

---

## 8. Corrections Log

Priority: **P1** = must fix before writing articles (publishes a retracted/false/inverted claim, legal misstatement, or source-doesn't-contain-figure). **P2** = re-citation / caveat / Grade-C relabel + sensitivity-test / threshold precision. **P3** = wording nit / optional precision. All **Status: Open**.

| ID | file:line | Before → After | Evidence | Pri | Status |
|--|--|--|--|:--:|:--:|
| C1 | `app/methodology/page.tsx:24,71` | "five-dimensional/Five-Dimension" → "seven-dimensional" | `calculations.ts:49-63`; `RESEARCH.md:122-124` | **P1** | Open |
| C2 | `app/methodology/page.tsx:27-28,111-113` | "redistributes ~2% of contract value to firms" → "discretion raises prices ~6pp (structural); competitive tendering averts favoritism premium" | `calculations.ts:97-99`; `RESEARCH.md:171` | **P1** | Open |
| C3 | `app/methodology/page.tsx:105` | `V × 0.02 + …` → opportunity = `days × dailyCostOfInaction`; favoritism separate `V × 0.06 × (1−ρ) × κ` | `MODEL_PARAMETERS.md:39`; `calculations.ts:314-323` | **P1** | Open |
| C4 | `app/methodology/page.tsx:110,162` | "117–151" → "117–160" | `calculations.ts:384`; `CHANGELOG.md:13` | **P1** | Open |
| C5 | `app/methodology/page.tsx:125` | `0.22 + 0.077 = 0.297` → `0.22 + 0.077 × ρ` | `calculations.ts:326-328` | **P1** | Open |
| C6 | `app/methodology/page.tsx:143` | undiscounted/uncapped TCO → discounted (5%) annuity, rigidity-scaled, capped 30% | `calculations.ts:337-346` | **P1** | Open |
| C7 | `app/methodology/page.tsx:75-152` | §2 lists 5 dims → add favoritism (dim 4) + bypass (dim 7); fix numbering | `RESEARCH.md:160` | **P1** | Open |
| C8 | `app/research/page.tsx:7,63,149,302,305,420,557` | "five-dimension(al)" → "seven-dimension" | as C1 | **P1** | Open |
| C9 | `app/research/page.tsx:66-67,329,494` | "rigid auctions reduce prices ~2%" → "discretion raises prices ~6pp; competitive tendering averts it" | `calculations.ts:7-9,97-99` | **P1** | Open |
| C10 | `app/research/page.tsx:327` | `α=0.02 … − V×α` → 0.02 removed; favoritism separate 0.06 | `MODEL_PARAMETERS.md:39` | **P1** | Open |
| C11 | `app/research/page.tsx:335` | `0.22 + 0.077 = 0.297` → scaled by ρ | `calculations.ts:326-328` | **P1** | Open |
| C12 | `app/research/page.tsx:343` | `C_TCO = V×γ×T×(1−φ)` → discounted + capped 30% | `calculations.ts:337-346` | **P1** | Open |
| C13 | `app/model/page.tsx:42` & `app/en/model/page.tsx:42` | "Productivity loss ~1.6%" → remove / replace with favoritism (~6pp) | `MODEL_PARAMETERS.md:7,39`; `CHANGELOG.md:13` | **P1** | Open |
| C14 | `app/model/assumptions/page.tsx:49,58` & `app/en/model/assumptions/page.tsx:41,48` | hardcoded `0.016` → `0.06` | `calculations.ts:99,321` | **P1** | Open |
| C15 | `app/model/assumptions/page.tsx:48` PL / `:40` EN | renegotiation `* 0.03 *` → `renegotiationCost × probability` (no 0.03 constant exists) | `calculations.ts:326-335` | P2 | Open |
| C16 | `RESEARCH.md:136` | "OECD (2023) documents 554/836 days" → re-cite true (likely World Bank infra) source w/ verified figures+population, or remove | OECD PDF grep: 0 hits for 554/836/Africa | **P1** | Open |
| C17 | `process-templates.ts:5` | "benchmarked from OECD (2023) procurement function surveys" → "calibrated/illustrative" or real role-hour source | OECD (2023) has no role-hour survey | **P1** | Open |
| C18 | `process-templates.ts:260` (note); `rigidDays` :253 may stay as typical | "min. 21 dni (tryby krajowe PZP)" → "min. 7 dni (dostawy/usługi) / 14 dni (roboty budowlane) — art. 283 PZP" | art. 283 PZP; 21d echoes old 2004 PZP | **P1** | Open |
| C19 | `process-templates.ts:211,213` | `rigidDays: 11` / "min. 11 dni (przepisy EU)" → 10 days, "min. 10 dni (komunikacja elektroniczna) / 15 dni (inny sposób) — art. 264 ust. 1 PZP" | art. 264 ust. 1 PZP | **P1** | Open |
| C20 | `optimizer.ts:425` (+ comment 420-423) | `EU_THRESHOLD_SUPPLIES_SERVICES_PLN = 900_000` → `930_960`; refresh dated comment (M.P. 2025 poz. 1247; 1 EUR=4.31 PLN) | UZP progi 2026-2027 | P2 | Open |
| C21 | `optimizer.ts:437-443` (+ `PATHS`) | filter gates on 130k only; 130k–EU band recommends Art.132/140/169 → add `tryb_podstawowy` (PZP Art. 275) path + branch `feasiblePathIds` on EU threshold | art. 275 PZP; policyNote :591-592/603-604 | **P1** | Open |
| C22 | `CLAUDE.md:10,33-34` | "Random Forest path optimizer … ensemble of 30 synthetic decision trees" → "weighted rule-based path optimizer + 30-run sensitivity sweep" | `MODEL_PARAMETERS.md:138`; `README.md:21`; `i18n.ts:287,328` | **P1** | Open |
| C23 | `README.md:20,79`; `CLAUDE.md:32` | dimension name "productivity" → "favoritism / selection-quality" | `i18n.ts:132,194`; `RESEARCH.md:124,160` | P2 | Open |
| C24 | `calculations.ts:97-99` (comment) | "~6pp" → "~6% (structural causal estimate; reduced-form 8%)"; add Hungarian-public + RDD/structural-correction caveat; cite JEEA DOI alongside diss. | Szucs 2024 §Structural | P2 | Open |
| C25 | `calculations.ts:385` (source string) | "observational, +7.7–10.5pp" → "2SLS/IV (rigidity instrumented by political contestability)"; add French car-park + per-SD-dose caveat | Beuve et al. Tbl 4 | P2 | Open |
| C26 | `MODEL_PARAMETERS.md:30` | "≈41.5% incl. telecoms" → "≈41.5% EXCLUDING telecom (30% including telecom)" | Guasch 2004 Tbl 1.7 | P2 | Open |
| C27 | `MODEL_PARAMETERS.md:31` | BHT "8-14%" → note version-of-record "7.5–14%"; add US-Caltrans transfer caveat; do not reuse as TCO basis | AER 2014 abstract | P3 | Open |
| C28 | `calculations.ts:386` | "ISM / CAPS Research — up to ~30% TCO" → drop "CAPS Research" (unsupported); re-cite ISM page; note SCMR best-case provenance; keep as conservative cap | ISM/CAPS metrics ≠ 30% | P2 | Open |
| C29 | Decarolis cite (`MODEL_PARAMETERS.md:32/161`) | complete title subtitle "…: Evidence from Procurement Auctions"; add Italian-works scope caveat | AEJ:Applied 6(1) | P3 | Open |
| C30 | `RESEARCH.md:17,312` | "empirically predicted to fail" → "theoretically/analytically predicted to fail"; note analogical transfer | H-M formal model + qualitative cases | P3 | Open |
| C31 | `process-templates.ts:6` (comment) | "derived from EY/Deloitte sourcing transformation studies" → APQC+Hackett anchors (timeMultiplier) + "modeling assumption" (coord/tool); relabel C | APQC/Hackett benchmarks | P2 | Open |
| C32 | `calculations.ts:104` (+ `MODEL_PARAMETERS.md:32-34`) | flat `TCO_SAVINGS_RATE_PER_YEAR=0.10` → decaying schedule (5-15% yr1 → 2-5%/yr), keep 30% cap; relabel C; sensitivity-sweep (6/8/12% yr1); anchor premise to Decarolis | High-sensitivity; cap binds on high-value/long-horizon | P2 | Open |
| C33 | `process-templates.ts:125-134` (+ comment) | `CORRUPTION_RISK_CONTEXT` presented as implied-empirical → relabel C "calibrated governance-risk index"; cite Szucs for 1.0, OECD for ordinal only; sensitivity-test gradient | High-sensitivity; flips gap sign; underpins symmetry claim | P2 | Open |
| C34 | `process-templates.ts:108-117` | `PROCESS_RIGIDITY` → relabel C; keep ordinal ranking; sensitivity-test pzp_eu=0.95 on public-gap sign | no cardinal 0–1 anchor | P2 | Open |
| C35 | `calculations.ts:44` (comment), :113-161 | "academic review feedback" → modeling-assumption marker → MODEL_PARAMETERS.md §4; expert-elicit/re-source Direct-TCO ×1.35 (direction contradicted) | Sievo/Inverto indirect>direct savings | P2 | Open |
| C36 | `process-templates.ts:762-767` (comment) | "calibrated based on practitioner interviews" → "modeling assumption (direction triangulated Kraljic/APQC; magnitudes internal)"; document in MODEL_PARAMETERS.md | unsubstantiated provenance | P2 | Open |
| C37 | `calculations.ts:101,200` | add inline Beuve cite at L101; relabel `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR=0.7` as C; sensitivity-test 0.6–0.85 | 0.7 factor unsourced | P2 | Open |
| C38 | `calculations.ts:187-189,205` | add note that sigmoid constants are modeling assumptions (sign only); commission bypass/maverick audit to lower realised ceiling toward ~30%; expert-elicit k/x0 | realised ~86% > empirical 1.8-50% band | P2 | Open |
| C39 | `scenarios.ts:18-25` + per-scenario | document daily rates in MODEL_PARAMETERS.md as Grade B w/ anchors + gross→loaded conversion; optionally trim manager ~1,100–1,300; label exec "board/C-level" | Sedlak/GUS/Hays 2024 | P3 | Open |

**P1 count: 20** (C1–C14, C16, C17, C18, C19, C21, C22).

---

## 9. Residual-Risk / Assumptions Register (Grade-C parameters)

| Parameter | Grade | Sensitivity | Residual risk | Required action |
|--|:--:|:--:|--|--|
| `TCO_SAVINGS_RATE_PER_YEAR` (flat 10%/yr, cap 30%) | C | **High** | Single most influential weak parameter; flat rate > decaying central path; 30% cap binds at large absolute value on high-value/long-horizon → can dominate the gap and (in principle) flip sign/symmetry | One-way sensitivity sweep; recalibrate to decaying schedule; anchor premise to Decarolis (peer-reviewed), not ISM vendor figure |
| `CORRUPTION_RISK_CONTEXT` gradient (0.9/0.6/0.45/0.4/0.2/0.15) | C | **High** | Intermediate/lower values in no source range; directly scales the favoritism dim; flips rigid-vs-flexible sign; underpins the symmetry claim | Sensitivity-test gradient + report robustness band; optionally expert-elicit; cite OECD for ordinal direction only |
| `PROCESS_RIGIDITY` cardinal ρ | C | Medium | Cardinal magnitudes have no external 0–1 anchor; capex 0.72 > private_formal 0.60 flippable | Sensitivity-test pzp_eu=0.95; keep ordinal ranking |
| Bypass sigmoid (k=6, x0=0.9, ceiling=0.95, scale=0.1) | C | Medium | Realised rigid ~86% bypass exceeds empirical off-contract band (1.8–50%) by 2–3×; form params pure construction | Commission primary maverick/bypass audit; lower ceiling toward ~30%; expert-elicit k/x0 |
| `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR=0.7` | C | Medium | Implied 15.4% flexible rate unsourced (direction supported by Beuve, magnitude not) | Sensitivity-test 0.6–0.85 |
| Dimension multipliers (0.85×–1.4×) | C | Low (sign) / High (magnitude) | Direct-TCO ×1.35 direction contradicted by indirect>direct savings benchmarks; ~+27% magnitude move on Direct+Upstream; dormant in shipped scenarios | Expert-elicit Direct-TCO multiplier; record sensitivity result |
| Step-level role-hour multipliers (0.5×–1.85×) | C | Low | Magnitudes in no published range; "practitioner interviews" provenance unsubstantiated (no N/instrument) | Commission structured time-allocation survey for primary stage |
| `TECH_LEVELS` coordCostPerDay / toolCostPerProcess | C | Low | Cardinal values rest on non-public vendor pricing + unobtainable process-volume assumption | Sensitivity-test; mark as modeling assumption (timeMultiplier upgradable to B via APQC/Hackett) |
| Stakeholder daily rates | **B** | Low | Manager/exec at upper end; exec only fits board/C-level reading | Document anchors; optionally trim manager; relabel exec |

---

## 10. Appendix — Source Library (retrieved artifacts)

**Citation primary sources**
- Szucs, F. (2024), JEEA 22(1):117–160, DOI 10.1093/jeea/jvad017 — https://academic.oup.com/jeea/article/22/1/117/7071896 · diss. full text https://escholarship.org/content/qt0hg9234w/qt0hg9234w_noSplash_142692ed44ddf712cd0293b32ed14c54.pdf · https://ideas.repec.org/a/oup/jeurec/v22y2024i1p117-160..html
- Beuve, Moszoro & Spiller (2021), NBER WP28491 — https://www.nber.org/system/files/working_papers/w28491/w28491.pdf · JLEO 39(1):281–308 (2023), DOI 10.1093/jleo/ewab022 · SSRN 3790229
- Guasch, J. L. (2004), World Bank, ISBN 0-8213-5792-1 — https://documents1.worldbank.org/curated/en/678041468765605224/pdf/288160PAPER0Granting010renegotiating.pdf · mirror https://regulationbodyofknowledge.org/wp-content/uploads/2013/03/Guasch_Granting_and_Renegotiating.pdf
- Coviello & Mariniello (2014), J. Public Econ. 109:76–100, DOI 10.1016/j.jpubeco.2013.10.008 — https://ideas.repec.org/a/eee/pubeco/v109y2014icp76-100.html · WP https://www.siecon.org/sites/default/files/oldfiles/uploads/2012/08/Coviello-Mariniello.pdf
- Decarolis, F. (2014), AEJ:Applied 6(1):108–132, DOI 10.1257/app.6.1.108 — https://www.aeaweb.org/articles?id=10.1257/app.6.1.108 · https://ideas.repec.org/r/aea/aejapp/v6y2014i1p108-32.html
- Bajari, Houghton & Tadelis (2014), AER 104(4):1288–1319, DOI 10.1257/aer.104.4.1288 — http://faculty.haas.berkeley.edu/stadelis/incomplete.pdf · WP https://www.nber.org/system/files/working_papers/w12051/w12051.pdf · Bajari & Tadelis (2001) RAND 32(3):387–407, SSRN 193121
- ISM, "Understanding Total Cost of Ownership in Procurement" — https://www.ism.ws/supply-chain/ownership-in-procurement/
- PwC/London Economics/Ecorys (2011) for EC — https://ec.europa.eu/docsroom/documents/15552/attachments/1/translations/en/renditions/native · landing https://op.europa.eu/en/publication-detail/-/publication/0cfa3445-7724-4af5-8c2b-d657cd690c03
- OECD (2023), *Public Procurement Performance*, DOI 10.1787/0dde73f4-en — https://www.oecd.org/content/dam/oecd/en/publications/reports/2023/08/public-procurement-performance_0ebfe3e7/0dde73f4-en.pdf
- Holmström & Milgrom (1991), JLEO 7:24–52, JSTOR 764957 — https://people.duke.edu/~qc2/BA532/1991%20JLEO%20Holmstrom%20Milgrom.pdf · https://academic.oup.com/jleo/article-abstract/7/special_issue/24/2194011 · Kraljic (1983) HBR https://hbr.org/1983/09/purchasing-must-become-supply-management

**Parameter triangulation sources**
- Sedlak & Sedlak / wynagrodzenia.pl 2024 (specjalista ds. zakupów, kierownik, dyrektor, radca prawny, analityk finansowy); GUS Struktura wynagrodzeń wg zawodów X.2024 — https://stat.gov.pl/obszary-tematyczne/rynek-pracy/pracujacy-zatrudnieni-wynagrodzenia-koszty-pracy/struktura-wynagrodzen-wedlug-zawodow-za-pazdziernik-2024-r-,5,9.html ; Hays Salary Guide 2024/25 — https://www.hays.pl/raport-placowy
- EU Guide to CBA 2014-2020 (5% real SDR) — https://ec.europa.eu/regional_policy/sources/studies/cba_guide.pdf ; NBP reference rate https://nbp.pl/rpp-09-04-2026/ ; PL 10Y bond https://tradingeconomics.com/poland/government-bond-yield ; KPMG Cost of Capital Study 2025 https://kpmg.com/ch/en/insights/deals/cost-capital-study.html ; EUROCONTROL Standard Inputs (discount rate)
- APQC procurement benchmarking — https://www.apqc.org/blog/how-do-you-benchmark-procurement ; Hackett/Ivalua — https://www.ivalua.com/blog/procurement-benchmarking/ ; PairSoft Digital World Class — https://www.pairsoft.com/blog/three-benchmarks-of-a-world-class-procurement-process/ ; Sievo procurement savings — https://sievo.com/blog/procurement-savings ; Sievo Spend Analysis 101 — https://sievo.com/en/resources/spend-analysis-101 ; Inverto Indirect Spend ; Oliver Wyman (2025) indirect spend
- Fazekas & Kocsis CRI — https://research.ceu.edu/en/publications/an-objective-corruption-risk-index-using-public-procurement-data/ ; Government Transparency Institute — https://www.govtransparency.eu/tag/corruption-risk/ ; Moszoro et al. (2016) JELS 13 — https://onlinelibrary.wiley.com/doi/abs/10.1111/jels.12119
- OECD Integrity in Public Procurement — https://www.oecd.org/en/topics/sub-issues/integrity-in-public-procurement.html ; OECD Anti-Corruption & Integrity Outlook 2026
- Maverick-spend benchmarks: Hackett/Sievo — https://sievo.com/blog/maverick-spend ; Sheth & Harrison (Bartolini 2012 / APQC) — https://www.ijoqm.org/papers/25-4-1-p.pdf
- Lipsky 1980 (Russell Sage); Vaughan 1996 (Univ. Chicago Press); CIPS Kraljic Matrix — https://www.cips.org/intelligence-hub/supplier-relationship-management/kraljic-matrix

**Legal sources (valid 2026-06-28)**
- UZP — aktualne progi unijne 2026-2027 — https://www.gov.pl/web/uzp/aktualne-progi-unijne-oraz-ich-rownowartosci-w-zlotych-na-lata-2026-2027
- Obwieszczenie Prezesa UZP z 8.12.2025 (M.P. 2025 poz. 1247) — https://isap.sejm.gov.pl/isap.nsf/download.xsp/WMP20250001247/O/M20251247.pdf
- PZP tekst (ISAP) — https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20190002019/U/D20192019Lj.pdf
- ekomentarz UZP: art. 2 (130k) · art. 138 · art. 264 · art. 283 — https://ekomentarzpzp.uzp.gov.pl/prawo-zamowien-publicznych/

**Recompute artifacts (scratchpad)**
- `harness.ts`, `calculations.ts`, `process-templates.ts`, `scenarios.ts`, `harness-output.json`, `report.txt` under `/private/tmp/claude-501/-Users-pawelmamcarz-claude-procuracost/7f1460e8-e0f1-4661-9148-04612d8736a0/scratchpad/`

---

## 11. Resolution Status (2026-06-28)

All **20 P1 corrections applied and verified** (`npm run build` green — 45/45 pages; optimizer `tsc --noEmit` exit 0). Most items (C8–C15, C17–C19, C22–C39) were already fixed in the working tree ahead of the frozen commit; the residual work was `app/methodology/page.tsx` (C1–C7, full rewrite to the seven-dimension corrected model) and two `MODEL_PARAMETERS.md` consistency fixes (C27). See `CHANGELOG.md` 2026-06-28.

**Deferred (needs a framing decision):** **C32** — recalibrating `TCO_SAVINGS_RATE_PER_YEAR` from flat 10%/yr to a decaying schedule — is held because it changes every model output and is entangled with the §7 symmetry-inertness disclosure. Recommendation: **disclose** the per-dimension-only symmetry honestly in the articles rather than tune parameters to manufacture a net sign-flip.

**Open follow-ups (analyses, not edits):** the sensitivity sweeps flagged P2 (TCO yr1 6/8/12%; `CORRUPTION_RISK_CONTEXT` gradient; `PROCESS_RIGIDITY` pzp_eu=0.95; reneg factor 0.6–0.85) belong in Article 2's robustness section. Pre-existing repo-wide lint debt (`react/no-unescaped-entities`, `no-html-link-for-pages`, `no-explicit-any`) is unrelated to this pass and was not introduced by it.

---
*End of report. 20 P1 corrections applied (build green); C32 deferred pending the symmetry-framing decision; P2 sensitivity sweeps routed to Article 2.*
