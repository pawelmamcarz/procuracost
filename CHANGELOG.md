# Changelog

## 2026-08-29: model 2.3.0

Model 2.3 replaces the active 2.2.2 optimiser and aggregate path profiles with
a native, evidence-aware comparison of two independently declared procurement
workflow designs. Historical 2.2.2 entries below remain as release history;
current errata are labelled explicitly.

### Native domain and legal boundary

- Added the fixed metadata tuple: schema 2, model 2.3.0, calibration
  `source-scenario-2026-08-28` and legal ruleset `pl-pzp-2026-2027`.
- Separated legal and governance boundary, procedure family, purchase
  archetype, execution channel, system support, workflow design and contract
  design.
- Replaced path templates as the public comparison object with independent
  `formalSequential` and `adaptiveCompliant` directed acyclic process maps.
- Added cycle, predecessor and legal-lock validation plus critical-path elapsed
  time.
- Made supported PZP waits dated, sourced, non-editable and identical in both
  alternatives. Sectoral and defence/security contexts fail closed.

### Cost and evidence contract

- Defined the signed identity as
  `deltaCost = formalSequential.total - adaptiveCompliant.total` and added an
  alternative-swap symmetry audit. No sign is preferred or required.
- Added low, central and high values with explicit range kind, evidence class
  and evidence identifiers. Declared ranges are not statistical confidence
  intervals.
- Limited the Szucs transfer to the 2, 6 and 9 per cent competition stress where
  the declared alternatives differ in market access.
- Restored the Szucs source interpretation after a model 2.2 documentation
  error: selected contractors were 28 per cent less productive and the
  probability that a right-connected firm won rose by approximately 11
  percentage points. This correction does not alter model 2.3 calculations,
  which monetise only the declared price-channel transfer stress.
- Set native starting differentials for contract amendments and TCO to zero.
  Informal bypass is disclosed but not monetised.
- Labelled retained aggregate base-day totals, remaining migrated workflow
  maps, role rates, support costs and scenario values as
  `retained_legacy_assumption` rather than empirical estimates.

### Scenarios, records and replication

- Added ten canonical scenarios covering fleet TCO reframing, ERP discovery,
  logistics redesign, critical-material continuity, public IT with preliminary
  market consultation, stable service, CAPEX replacement, discovery and
  co-design, catalogue call-off and MRP release.
- Replaced the generic workflow used by the first five scenarios with
  mechanism-specific maps. Aggregate base-day totals remain retained from
  model 2.2.2; step order, day allocation and role-hour allocation are
  illustrative model 2.3 inputs with separate internal provenance.
- Added catalogue and MRP neutral controls with identical maps. Discovery and
  co-design explicitly permits the adaptive alternative to require more time
  and role effort.
- Added an auditable decision record with drivers, monetisation coverage,
  non-monetised dimensions, evidence, legal provenance and migration status.
- Added deterministic JSON, CSV and Markdown replication output plus canonical
  diagnostics for metadata, ordered ranges, delta identity, legal locks,
  neutral controls and swap symmetry.
- Preserved the immutable 2.2.2 package as historical provenance. Its decision
  thresholds are not native 2.3 outputs.

### Public method and implementation context

- Replaced the public optimiser result with a non-scored suitability comparison
  that gives lawful candidate families equal status and withholds unsupported
  procedures.
- Reframed the former maturity assessment as a descriptive procurement process
  design profile.
- Added an independent implementation-readiness self-description with eight domains,
  sixteen questions and no points, percentages, weights or import into the cost
  model.
- Added bilingual practice material for
  [Procurement&Beyond episode 8](https://www.youtube.com/watch?v=5KYUdTLlvvg).
  The practitioner interview may inform question design and hypothesis
  generation only. It is not calibration evidence.
- Stated the data and calculation boundary for Bielik: a language model may
  structure market data for review; the transparent deterministic model
  performs the calculation.
- Updated active PL/EN copy, research documentation and article drafts to use
  professional procurement terminology and to distinguish cases where adaptive
  work has a mechanism from stable service, catalogue and MRP cases where it
  adds no separate modelled value.

## 2026-07-26 — model 2.2.2

Calibration audit: every assumption in the model checked against an external benchmark,
with adversarial verification of every challenge (a "nonsensical" verdict required the
benchmark confirmed at source and a ≥3× contradiction). Full reconciliation with sources:
`docs/research/CALIBRATION_BENCHMARKS.md`. Headline numbers change again — against the
thesis, again.

### What the audit confirmed (no change needed)

- **The EC 2011 sanity check the corpus promised was performed — and the model passes.**
  pzp_eu implies 23.8 authority-side person-days per EU procedure vs the study's median
  22 / mean 36; process cost 0.3–2.2% of contract value vs ~0.3% authority-side + APQC's
  0.5–1.96%-of-spend band. The effort layer is the best-calibrated part of the model.
- Step-day templates vs UZP 2023: pzp_eu 70 post-publication days vs 90 observed,
  pzp_krajowy 27 vs 40 — the formal path is UNDERSTATED, a conservative bias against
  the model's own adaptive-friendly tendency, now documented rather than implicit.
- All six daily rates sit inside the Hays Poland 2026 salary bands.
- Technology time multipliers (2× span) sit inside the 30–50% cycle-reduction literature.
- Competition-direction profiles supported by Coviello–Guglielmo–Spagnolo (2018) and
  EU single-bid statistics; corruption-context ORDERING now carries citable directional
  support (OECD 2016; Bandiera–Prat–Valletti 2009) while its values stay Grade C.

### What was nonsensical and changed

- **Five dailyCostOfInaction values had no defensible derivation** — the input carrying
  most of ΔC. Recalibrated with explicit formulas in lib/scenarios.ts:
  erp 15,000 → 8,200 (12-month ex-ante payback; realized benchmark 18–36 months),
  logistics 20,000 → 1,800 (25% spot premium × daily spend; was an uncitable ~270%),
  capex 30,000 → 13,700 (3-year payback cash flow; annuity at 15–25% IRR),
  discovery 8,000 → 5,500 (18-month payback), custom default 10,000 → 500 (placeholder,
  0.05% CV/day — the old seed put a 200k delay bucket, 95% of the delta, in front of
  every user by default). fleet, production, pipe_vs_field, mrp, catalog kept with the
  economic framing now written down (production's 50k/day is a single-source stoppage
  mechanism, stated as plant economics, not a spot premium).
- **capex template 60/42 → 120/84 days.** 60 days for sourcing a 15M PLN production
  line sat below the softest citable floor (3–4 months; practitioner range to 18
  months). Also fixed vendor_selection (14d) being shorter than private_formal's
  sourcing block for a purchase 3× the value.
- **Tool cost split by process category.** Charging the strategic-event amortisation
  (2,000 PLN) per individual catalog/MRP purchase order was 30–100× the citable per-PO
  cost (APQC $14–54 total). New toolCostPerOperationalOrder: 0/30/50/60 PLN. ΔC-neutral.
- **Bypass-control ladder narrowed from 15× to 3×** (1.50→0.50 instead of 1.50→0.10).
  Citable maverick-spend evidence supports ~1.6–2.9× (Hackett; Bartolini 2012); a 15×
  effect attributed to technology alone had none. Envelope-only materiality.
- **Discount-rate label corrected**: 4% is the MFiPR real FINANCIAL rate; the social
  rate is 3%. Model 2.2.1 called 4% "the social discount rate" — value kept, label fixed
  in code, tooltips and docs.

### Effect on results

Delay share of |ΔC| drops from 80.5–99.6% to **68.3–99.6%**; logistics Δ falls 417k →
53k, custom default Δ 212k → 22k. Under the audited calibration **all 10 built-in
scenarios cross zero** (evidence axis alone: 5) and the sweep reads 1,042 robustly
formal / 5,374 robustly adaptive / 6,544 crossing of 12,960. The model now identifies
a robust winner in no built-in scenario — the honest consequence of feeding it honest
inputs.

## 2026-07-26 — model 2.2.1

Closes the last open item from the 2.2 audit, and it changes the headline conclusion.

### The uncertainty envelope now covers both axes

Through 2.2.0 the reported range varied only the five evidence scalars — the discretion
premium, the rigidity slope, the TCO pool and the two bypass rates — and held fixed the
**daily cost of inaction** and the **non-mandatory step durations**, which together carry
80–99% of ΔC. The model therefore reported its narrowest uncertainty exactly where it is
least defensible.

Added a structural axis: daily cost of inaction ×0.25 … ×4, non-mandatory step durations
×0.7 … ×1.3. Statutory PZP waits remain invariant under both axes. `lowDelta` / `highDelta`
is now the envelope over the full cross product, with each single-axis envelope reported
alongside it and a `widthDrivenBy` flag.

The result works against the project's own thesis, which is why it belongs here:

| | evidence axis only | both axes |
|---|---:|---:|
| built-in scenarios crossing zero | 4 of 10 | **9 of 10** |
| sweep: robustly favours formal | 1,221 / 12,960 | 1,045 |
| sweep: robustly favours adaptive | 5,834 / 12,960 | 5,357 |
| sweep: crosses zero | 5,905 | **6,558** |

In nine of ten built-in scenarios the model no longer identifies a robust winner. That is
the honest reading: the earlier narrow envelope was an artefact of choosing to vary the
small quantities and freeze the large ones. The multipliers are declared judgements about
how wrong an unmeasured input can be, not estimated intervals.

Reported in `RESEARCH.md` §4.2, `docs/MODEL_PARAMETERS.md`, article 2 §3.3, the calculator
hero panel, `npm run recompute`, `npm run sweep` and the replication package.

## 2026-07-26 — model 2.2.0

Model 2.2 is a correction release following an adversarial audit of the model
mathematics, the citation base and the legal layer. Headline numbers change.

### Corrections to errors introduced or missed in 2.1

> **Model 2.3 erratum, 29 August 2026:** the first historical bullet below is
> itself incorrect. Szucs reports selected contractors as 28 per cent less
> productive and an approximately 11-percentage-point increase in the
> probability that a right-connected firm wins. The original 2.2 wording is
> retained here as release history and must not be used as the current source
> interpretation.

- **Szucs (2024) productivity effect restated as ~10%, not 28%.** The structural
  estimates report about a 6% price effect and about a 10% reduction in average
  contractor total factor productivity. The figure 28 is a different quantity in
  the same paper — the increase in a politically connected firm's probability of
  winning under a high-discretion procedure. Model 2.1 substituted it *and*
  asserted that the correct figure had been the earlier error. The mistake had
  propagated to `00-shared-foundation.md`, `MODEL_PARAMETERS.md`, `RESEARCH.md`,
  the README, three public pages, the podcast metadata and the live export
  strings. This release corrects all of them and records that 2.1 introduced it.
- **Removed the unsourced "OECD" warrant** from `CORRUPTION_RISK_CONTEXT`. No
  OECD publication was ever named. Also removed the claim that its `pzp_eu = 1.0`
  anchor came from Szucs: he identifies his effect *below* a ~25m HUF threshold,
  the opposite end of the value distribution from EU-threshold tenders. The
  vector is now labelled a Grade-C ordinal assumption with no external warrant.
- **Beuve slope reclassified and its unit stated.** The estimate is per one
  standard deviation in *each* of seven z-scored categories; several documents
  dropped "each". The model multiplies it by a 0–1 profile that is not a z-score,
  so it is a calibration assumption with an external order-of-magnitude anchor,
  not a transferred estimate. Only the between-path difference is interpretable.
- **EC (2011) downgraded from "external sanity-check" to context only** — the
  comparison it was said to provide was never performed. Its own finding that
  restrictions on discretion associate with higher prices is now reported.
- Removed `Źródło: Lipsky/Vaughan` from the bypass-exposure input tooltip; those
  works motivate the mechanism and supply neither a cost nor a rate. Removed
  Williamson and Holmström–Milgrom from the optimizer's claimed grounding.
  Relabelled the illustrative `pipe_vs_field` scenario, which cited three
  journal articles as the "source" of a constructed example.

### Neutrality: from a claim to a demonstration

- **Added the `discovery` process type**, in which the requirement emerges during the
  procurement and adaptive execution is genuinely slower and more effortful (supplier
  co-design, a re-scoping round, sometimes an abandoned negotiation), while the formal
  path freezes the requirement early and pays with a worse specification.

  Through 2.1 every step of every template had `flexibleDays ≤ rigidDays`, so "the
  adaptive path is faster" was an identity and the sweep returned **0 robustly-formal
  results out of 11,340**. With `discovery` the sweep returns **1,221 out of 12,960**,
  alongside 5,834 robustly adaptive. The symmetry claim is now demonstrated, not asserted.
- The adaptive effort ratio is no longer capped at 1, so a step where adaptive execution
  takes longer now costs more staff hours and not only more calendar days.
- Added the `discovery_rd` scenario, whose central ΔC is negative. Two of the ten exported
  scenarios now favour the formal path centrally, and four cross zero.

### Time base and discounting

- **Every reported figure is now a present value at award** — the model's single time base.
  2.1 multiplied the annual amendment frequency by contract duration without discounting
  while capping TCO at three years, so one purchase was driven by two incompatible
  horizons and `total` had no time base at all.
- Both lifecycle channels use the same annuity factor. A zero rate reproduces the 2.1
  arithmetic exactly, which is how the change is tested.
- Added `discountRatePct` as an optional input, default 4% real, exposed in the calculator,
  carried in shared links and recorded in the replication trace. At 4% over ten years the
  CAPEX amendment stream falls by roughly 19%.

### Model mathematics

- **ΔC is now reported decomposed** into process / delay / lifecycle buckets.
  The delay bucket is an accounting identity — (template day difference) × (a
  daily cost the user supplies) — and it carried 80.5–99.6% of |ΔC| in the
  built-in scenarios. Excluding it, the formal path is cheaper on process cost
  in 7 of 10 scenarios.
- **Break-even daily cost of inaction is no longer clamped at zero.** It returned
  0 or `null` in every 2.1 scenario while being described to reviewers as a live
  feature. It now reports the raw solution plus a status distinguishing "the
  delay bucket decides" from "the formal path already costs more without it".
- Participation hours are a whole-role total; role headcount no longer multiplies
  them. Declaring three buyers previously tripled the cost of the same workflow.
- Non-labour coordination overhead accrues over active days only, not across
  statutory publication and standstill periods.
- The technology multiplier now scales non-mandatory effort as well as duration.
- Day counts are no longer rounded before monetisation.
- Removed five context multipliers that were hardcoded to 1, so four of seven
  dimensions had no context sensitivity while the API implied otherwise.
- Removed two unreachable clamps and replaced them with structural bounds.
- Added `RESEARCH.md` §4.1 stating the model's structural asymmetry explicitly.

### Legal layer

- **Added the art. 359 social-services EU threshold (3,232,500 PLN).** Its
  absence pushed sub-threshold social-services contracts above the EU threshold
  and foreclosed `tryb podstawowy` — over-restrictive advice on a large share of
  local-government spend.
- **The tool now declines to advise sectoral and defence/security buyers**
  instead of running them through the classic threshold ladder, which produced a
  confidently wrong band.
- PZP article citations are suppressed where the Act does not apply.
- Lawful procedures withheld by the filter are now named in the UI.
- Corrected the duration ordering of restricted vs open tender (70 vs 45 statutory
  days); 2.1 showed the restricted procedure as the faster of the two.
- The EU-threshold publication step is labelled TED (OJ EU), not "BZP/TED".
- `confidence` renamed `weightStability`; it is suppressed entirely where the
  legal filter leaves a single candidate and the figure is 1.0 by construction.

### PDF export

- **Embedded a Unicode font.** jsPDF's built-in Helvetica is WinAnsi, which has no Polish
  diacritics, so every ą ć ę ł ń ó ś ź ż and every "zł" in the exported report rendered as
  mojibake — "1 234 567 zB", "Zcielka formalna" — in the one artifact that leaves the site.
  Noto Sans is subsetted to Latin + Latin Extended-A (~23 KB per weight) and fetched only
  when an export runs, so it never enters the page bundle.
- The TOTAL row no longer hardcodes a leading `+`, which printed `+-6 558 zł` on the one
  scenario built to show that the formal path can win.

### Tests

- Added value-pinning tests for the decomposition, the break-even statuses, the
  optimizer suitability bands, the discounting (including the zero-rate identity with 2.1)
  and both legal corrections. Model 2.1 had no test that pinned any dimension to a
  numeric value. 47 tests pass.

## 2026-07-14 — Site 2026.29.1.2 / model 2.1.0

- Preserved mandatory PZP publication and standstill periods in both paths.
- Corrected Beuve et al. from an event probability to annual formal-amendment
  frequency and added contract duration to inputs and exports.
- Set the unsupported central TCO pool to zero and added a central break-even
  daily cost of inaction.
- Rebuilt the optimizer on common criteria, validated inputs, and restricted the
  national PZP band to the basic mode under Arts. 266 and 275. Above the EU
  threshold, the default filter now offers only procedures available without
  extra statutory grounds under Art. 129(2).
- Updated the website, long-form articles, working paper, supervisor package,
  shortcasts, and replication contract to model 2.1.

## 2026-07-13 — Site 2026.29.1.1 / model 2.0.0

- Replaced the single-rigidity logic with separate workflow, competition,
  contract-rigidity, TCO-capture and bypass constructs.
- Added low/central/high scenario envelopes with explicit sign robustness.
- Corrected the evidence mapping, bibliography and 2026–2027 PZP thresholds.
- Rewrote the public methodology, research pages, shortcasts and four long-form
  articles for model 2.0.
- Added a model-2.0 supervisor package and generated replication outputs.
- Adopted `ISO-week-year.ISO-week.release.patch` site versioning.
- Isolated superseded research, publication and planning files under
  `docs/archive/model-1.x/`; none is linked or served by the public application.

Historical change detail remains available in Git history and the archive's
verification reports. It is not current documentation.
