# ProcuraCost Model Parameters

**Model version:** 2.2.0
**Status:** transparent decision model; not an empirical estimator

## Comparison object

The model compares two lawful designs for the same purchase:

- **Formal/sequential path:** more prescribed gates and less ability to parallelize work.
- **Adaptive/compliant path:** the same authorization, ethics, documentation, and competition obligations, with more freedom to sequence work and adapt the contract.

For public procurement, the adaptive path is never an exemption from PZP. It means flexibility available inside the applicable lawful procedure. The former label `policy-only` is retained only in internal compatibility identifiers.

## Constructs kept separate

Version 2.1 removed the single latent rigidity index out of economic formulas. `PROCESS_RIGIDITY` remains only as legacy descriptive metadata. The calculation distinguishes:

1. workflow duration and labor effort;
2. competition effectiveness;
3. contractual rigidity;
4. ability to capture lifecycle/TCO value;
5. observed bypass rate and system controls.

This prevents evidence about one construct from being silently reused for another.

## Evidence ranges

The calculator reports a central estimate and a wide scenario interval. These are **not confidence intervals**.

| Parameter | Low-delta case | Central | High-delta case | Status |
|---|---:|---:|---:|---|
| Discretion price premium | 9% | 6% | 2% | Empirical anchor with substantial transfer uncertainty (Hungarian, sub-25m HUF band) |
| Rigidity-slope anchor | 0 | 0.077 | 0.105 | **Calibration assumption with an external order-of-magnitude anchor** — see the unit warning below. Not a transferred estimate |
| Cumulative TCO savings pool | 0% | 0% | 15% | Scenario assumption; no transferable central estimate |
| Formal-path base bypass rate | 2% | 5% | 30% | Scenario assumption before technology-control scaling |
| Adaptive-path base bypass rate | 15% | 5% | 1% | Scenario assumption before technology-control scaling |

The low-delta case deliberately maximizes the governance value of formality; the high-delta case maximizes the value of adaptability. A range crossing zero means that the preferred path depends on assumptions.

### Unit warning on the rigidity slope (corrected in 2.2)

Beuve, Moszoro and Spiller report 0.077–0.105 additional formal amendments per contract-year
for a simultaneous one-standard-deviation increase in **each** of seven z-scored rigidity
categories — a move of about +7 units on a summed index that itself ranges well beyond that.
It is not the effect of a one-SD move on the index, and several 2.1 documents dropped the word
"each".

ProcuraCost multiplies that slope by `contractRigidity`, a hand-authored **0–1 calibration
score** from the path profiles below. That score is not a z-score, and no conversion between
the two scales is available. The product therefore implicitly declares "profile = 1.0" to mean
"+1 SD in each of seven clause categories", which the source does not support.

Consequences, stated rather than buried:

- The slope is reclassified from **class 2 (external anchor)** to **class 3 (calibration
  assumption with an external order-of-magnitude anchor)** in the taxonomy of article 2.
- Only the **difference** between the two paths' renegotiation cost is interpretable. The
  reported level for either path is not, because the estimate is incremental and the model
  supplies no baseline.
- Model 2.1 also displayed the range as "0–0.105/year" sourced to Beuve. The 0 is the model's
  own low-delta floor, not part of the published estimate; the homepage tiles now say
  0.077–0.105 and attribute the floor to the model.

## Path-profile defaults

These values are transparent calibration assumptions, not estimates. Columns show
formal/adaptive values for competition effectiveness, contract rigidity and TCO
capture respectively.

| Process type | Competition F/A | Contract rigidity F/A | TCO capture F/A |
|---|---:|---:|---:|
| PZP EU | .95 / .90 | .75 / .45 | .65 / .70 |
| PZP national | .90 / .85 | .65 / .40 | .67 / .72 |
| Private formal | .85 / .75 | .60 / .30 | .70 / .75 |
| Policy-compatible private | .75 / .70 | .35 / .25 | .73 / .78 |
| Catalog | .90 / .90 | .25 / .20 | .80 / .82 |
| MRP | .90 / .90 | .20 / .18 | .85 / .86 |
| CAPEX | .88 / .80 | .70 / .40 | .70 / .75 |

They should be replaced by observed bidder, clause and lifecycle data during
calibration. They must not be interpreted as scores measured for an organization.

## Workflow, technology, and context assumptions

The formal/adaptive day counts are the sums of the step-template durations. The
selected technology multiplier applies to non-mandatory steps in both paths;
mandatory PZP waits are unchanged. No additional hidden context compression is
applied.

| Technology | Time multiplier | Non-labor overhead/day | Tool cost/process | Bypass-rate multiplier |
|---|---:|---:|---:|---:|
| Manual | 1.40 | 500 PLN | 0 PLN | 1.50 |
| Sourcing tool | 1.15 | 200 PLN | 800 PLN | 0.80 |
| Partial ERP | 1.00 | 100 PLN | 1,200 PLN | 0.55 |
| End-to-end | 0.70 | 20 PLN | 2,000 PLN | 0.10 |

These are calibration assumptions. Both compared paths use the same selected
technology and therefore the same per-process tool cost.

The broad context factors are deliberately simple: upstream multiplies role
hours and non-labor coordination by 1.15; downstream multiplies them by 0.90
and 0.85 respectively; direct spend multiplies role hours by 1.10. Indirect
spend adds no further factor. At most two factors combine, and none changes a
statutory wait or the user-supplied daily inaction cost.

**Context reaches exactly two channels: role hours and non-labour coordination.** It does
*not* touch delay, selection, amendments, TCO or bypass. Model 2.1 declared multipliers for
those five as well, but every one of them was hardcoded to 1, so four of the seven dimensions
had no context sensitivity while the API and this table implied otherwise. They are removed in
2.2 rather than left inert. Reviving any of them requires an argument for the specific
mechanism, not a constant. The maximum combined uplift is ×1.265 (direct × upstream) against an
audited invariant of ×1.5; `direct + downstream` nets to ×0.99, i.e. no effect.

## ΔC decomposition (new in 2.2)

ΔC is reported in three buckets rather than one number, because they have different time bases
and very different evidential standing:

| Bucket | Contents | Time base | Standing |
|---|---|---|---|
| **Process** | staff, administration, selection, bypass | per procurement event | modeled |
| **Delay** | (formal days − adaptive days) × daily cost of inaction | per procurement event | **accounting identity** between a template and a user input |
| **Lifecycle** | expected formal amendments, foregone lifecycle value | over the contract life | modeled, weakly anchored |

This matters because in the built-in scenarios the delay bucket carries **77.7–99.5%** of |ΔC|
wherever the two paths differ in duration. Reporting only the sum let an identity between the
model's own step templates and a number the user supplies read as a modeled finding.

Excluding that identity, the formal path is **cheaper on process cost in 6 of 9** built-in
scenarios. The Tunnel–Field advantage in this parameterisation is a delay story, not a
process-cost story — and saying so is a stronger and more checkable claim than the headline
percentages model 2.1 reported.

## Break-even daily cost of inaction (corrected in 2.2)

Solves ΔC(c_d) = 0 for the daily cost of inaction. Model 2.1 clamped the result at zero, so it
returned 0 in seven built-in scenarios and `null` in three and never once produced an
informative positive number — while the supervisor pack and article 2 described it as a live
feature. The clamp is removed; the raw solution is reported with a status that says how to read
it:

- `threshold_above_zero` — the delay bucket decides; adaptive wins above the reported threshold.
- `formal_costlier_at_zero_delay` — the formal path already costs more with the delay bucket
  removed entirely. The threshold is negative and not actionable.
- `adaptive_costlier_at_zero_delay` — mirror case.
- `no_day_difference` — both paths take the same time, so no threshold exists.

## Dimension formulas

- **Staff time:** step participation hours × broad context factors × technology multiplier × daily rate / 8. Participation hours are a **whole-role total, not per person**: model 2.1 multiplied them by role headcount, so declaring three buyers made the identical workflow cost three times as much in buyer time. Headcount is now descriptive input only. Adaptive effort for a retained non-mandatory step is scaled by its adaptive/formal template-duration ratio, and the technology multiplier scales non-mandatory effort the same way it scales non-mandatory duration — 2.1 applied it to elapsed days only, which was inconsistent with both the adaptive-duration scaling and H5. Statutory waits are exempt from both.
- **Administrative overhead:** illustrative non-labor overhead per **active** day plus the same selected tool cost for both paths. It excludes stakeholder hours already counted above. Model 2.1 charged it over every elapsed day, so a `pzp_eu` process accrued per-day "meeting and alignment effort" across all 45 days of statutory publication and standstill — periods in which no role has any participation hours by construction.
- **Delay:** path days × user-supplied daily cost of inaction.
- **Selection/favoritism:** contract value × price-premium scenario × (1 − competition effectiveness) × context weight. Contractor productivity is not separately monetized.
- **Formal amendments:** user-supplied cost per amendment × contract duration × incremental annual frequency from the path's **contract-rigidity** profile. The French sample mean is not treated as a universal baseline.
- **TCO:** contract value × cumulative savings-pool scenario × `min(horizon years / 3, 1)` × (1 − capture rate). The pool is a declared three-year cumulative stress test, not an annual law; it is zero centrally and capped at 15% in the high scenario.
- **Bypass:** user-supplied audit exposure × bypass-rate scenario × technology-control multiplier. The former invented sigmoid and 86% prediction are removed.

The shared baseline purchase price is excluded from both totals. The reported break-even daily inaction cost solves the central equation after separating the delay and non-delay deltas.

## Empirical anchors and limits

- **Szucs (2024):** Hungarian public procurement, structural estimates: discretion increases prices by about 6% and lowers average contractor total factor productivity by about 10%. (The invalid raw discontinuity reports roughly 32%. Model 2.1 stated 28% — that is a different quantity in the same paper, the increase in a politically connected firm's win probability — and it was corrected in 2.2.) The price effect is monetized; productivity is disclosed, not added again. Identified on contracts below the ~25m HUF invitational threshold, i.e. at the small end of the value distribution.
- **Beuve, Moszoro, and Spiller (2023):** French car-park contracts; contractual rigidity is instrumented with political contestability in a 2SLS design. The 0.077–0.105 result is an annual formal-amendment frequency, not an event probability. Transfer to general procurement is a scenario, not a measurement.
- **European Commission (2011):** context only. No parameter is derived from or validated against it, and the comparison model 2.1 called a "sanity-check" was never performed. The per-day administrative overheads are calibration assumptions.
- **Lipsky, Vaughan, and Holmström–Milgrom:** mechanism-level theory only. None supplies a bypass probability.

## Legal thresholds used by the optimizer

**Scope: zamówienia klasyczne only.** Sectoral (art. 2 ust. 1 pkt 2) and defence/security
(pkt 3) procurement applies from far higher thresholds and draws on a different procedure
catalogue (art. 376). Model 2.1 ran those buyers through the classic ladder and returned a
confidently wrong band — a sectoral utility buying supplies for 500,000 PLN was told art. 275
applied when PZP did not apply at all. Model 2.2 declines to advise them instead.

For proceedings **initiated on or after 1 January 2026** (Dz.U. 2025 poz. 1173; a proceeding
opened earlier stays under the previous 130,000 PLN threshold). EU thresholds per Obwieszczenie
Prezesa UZP z 8.12.2025, M.P. 2025 poz. 1247, at 1 EUR = 4.31 PLN:

- PZP application threshold: **170,000 PLN net**;
- central supplies/services EU threshold: **603,400 PLN** (140,000 EUR);
- sub-central supplies/services EU threshold: **930,960 PLN** (216,000 EUR);
- works EU threshold: **23,291,240 PLN** (5,404,000 EUR), independent of authority level;
- social and other special services EU threshold (art. 359 / Annex XIV): **3,232,500 PLN**
  (750,000 EUR), independent of authority level.

The social-services threshold was **missing in model 2.1**, so a 1.5M PLN social-services
contract was classified above the EU threshold and `tryb podstawowy` — the correct, cheaper
and faster national procedure — was foreclosed. That affects a large share of local-government
spend and was over-restrictive advice stated with legal authority.

The optimizer asks for procurement object and authority level before selecting the applicable
threshold. Under Arts. 266 and 275, the 170,000 PLN–EU-threshold band is restricted to the
national basic mode. At or above the EU threshold, the default filter offers only open and
restricted tender, which Art. 129(2) permits without additional grounds.

**The filter is sound within its scope but deliberately incomplete.** Partnerstwo innowacyjne
(art. 297), negocjacje bez ogłoszenia (art. 300) and zamówienie z wolnej ręki (art. 304–306,
art. 214 ust. 1) are lawful on their own statutory grounds and are withheld because the input
form does not collect or verify those grounds. Model 2.2 names the withheld procedures in the
UI rather than dropping them silently: a user who accepts a truncated option set without being
told it was truncated can forgo a procedure the law allows.

Statutory duration floors, under one consistent assumption set (standard periods, electronic
communication, no urgency derogation): open tender 45 days (35 + 10 standstill), restricted
tender 70 days (30 + 30 + 10). The restricted procedure is therefore structurally **slower**;
model 2.1 displayed it as faster, inverting the ordering on the only genuine choice the tool
makes above the EU threshold.

The scorer evaluates every feasible path on the same criteria and denominator. Its 30 runs vary
all criterion weights by ±25%; agreement is **weight stability, not statistical confidence** —
renamed in 2.2 for that reason. Where the legal filter leaves one candidate, the stability
figure is 1.0 by construction and the UI suppresses it rather than displaying 100%.

## Validation requirements

Calibration must use event-level data: timestamps, effort hours, competition indicators, contract clauses, amendments, bypass evidence, audit outcomes, and lifecycle performance. Report component outcomes before monetizing them. Do not fit parameters to reproduce the Tunnel–Field thesis; retain sign reversals where the data support them.
