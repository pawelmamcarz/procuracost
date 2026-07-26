# Changelog

## 2026-07-26 — model 2.2.0

Model 2.2 is a correction release following an adversarial audit of the model
mathematics, the citation base and the legal layer. Headline numbers change.

### Corrections to errors introduced or missed in 2.1

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
