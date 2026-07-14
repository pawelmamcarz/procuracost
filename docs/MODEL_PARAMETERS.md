# ProcuraCost Model Parameters

**Model version:** 2.1.0
**Status:** transparent decision model; not an empirical estimator

## Comparison object

The model compares two lawful designs for the same purchase:

- **Formal/sequential path:** more prescribed gates and less ability to parallelize work.
- **Adaptive/compliant path:** the same authorization, ethics, documentation, and competition obligations, with more freedom to sequence work and adapt the contract.

For public procurement, the adaptive path is never an exemption from PZP. It means flexibility available inside the applicable lawful procedure. The former label `policy-only` is retained only in internal compatibility identifiers.

## Constructs kept separate

Version 2.1 keeps the single latent rigidity index out of economic formulas. `PROCESS_RIGIDITY` remains only as legacy descriptive metadata. The calculation distinguishes:

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
| Discretion price premium | 9% | 6% | 2% | Empirical anchor with transfer uncertainty |
| Rigidity-slope anchor | 0 | 0.077 | 0.105 | Amendments per contract-year per full normalized profile unit; transferred from the external 2SLS/IV estimate and then multiplied by the declared contract-rigidity profile |
| Cumulative TCO savings pool | 0% | 0% | 15% | Scenario assumption; no transferable central estimate |
| Formal-path base bypass rate | 2% | 5% | 30% | Scenario assumption before technology-control scaling |
| Adaptive-path base bypass rate | 15% | 5% | 1% | Scenario assumption before technology-control scaling |

The low-delta case deliberately maximizes the governance value of formality; the high-delta case maximizes the value of adaptability. A range crossing zero means that the preferred path depends on assumptions.

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

## Dimension formulas

- **Staff time:** step participation hours × broad context factors × headcount × daily rate / 8. Adaptive effort for a retained non-mandatory step is scaled by its adaptive/formal template-duration ratio. Mandatory legal waits and their role effort remain unchanged.
- **Administrative overhead:** illustrative non-labor overhead per elapsed day plus the same selected tool cost for both paths. It excludes stakeholder hours already counted above.
- **Delay:** path days × user-supplied daily cost of inaction.
- **Selection/favoritism:** contract value × price-premium scenario × (1 − competition effectiveness) × context weight. Contractor productivity is not separately monetized.
- **Formal amendments:** user-supplied cost per amendment × contract duration × incremental annual frequency from the path's **contract-rigidity** profile. The French sample mean is not treated as a universal baseline.
- **TCO:** contract value × cumulative savings-pool scenario × `min(horizon years / 3, 1)` × (1 − capture rate). The pool is a declared three-year cumulative stress test, not an annual law; it is zero centrally and capped at 15% in the high scenario.
- **Bypass:** user-supplied audit exposure × bypass-rate scenario × technology-control multiplier. The former invented sigmoid and 86% prediction are removed.

The shared baseline purchase price is excluded from both totals. The reported break-even daily inaction cost solves the central equation after separating the delay and non-delay deltas.

## Empirical anchors and limits

- **Szucs (2024):** Hungarian public procurement; discretion increased normalized prices by about 6 percentage points and selected contractors with about 28% lower measured productivity in the corrected main specification. The price effect is monetized; productivity is disclosed, not added again.
- **Beuve, Moszoro, and Spiller (2023):** French car-park contracts; contractual rigidity is instrumented with political contestability in a 2SLS design. The 0.077–0.105 result is an annual formal-amendment frequency, not an event probability. Transfer to general procurement is a scenario, not a measurement.
- **European Commission (2011):** total authority-and-supplier procedure cost is a sanity-check, not an estimate of the incremental cost of formality.
- **Lipsky, Vaughan, and Holmström–Milgrom:** mechanism-level theory only. None supplies a bypass probability.

## Legal thresholds used by the optimizer

Effective from 1 January 2026:

- PZP application threshold: **170,000 PLN net**;
- central supplies/services EU threshold: **603,400 PLN**;
- sub-central supplies/services EU threshold: **930,960 PLN**;
- works EU threshold: **23,291,240 PLN**.

The optimizer asks for procurement object and authority level before selecting the applicable threshold. Under Arts. 266 and 275, the 170,000 PLN–EU-threshold band is restricted to the national basic mode; EU-threshold procedures are not offered there. At or above the EU threshold, the default filter offers only open and restricted tender, which Art. 129(2) permits without additional grounds. Competitive dialogue and negotiated or single-source procedures require a separate legal-grounds assessment and are not recommended by this input form. The scorer evaluates every feasible path on the same criteria and denominator. Its 30 runs vary all criterion weights by ±25%; agreement is sensitivity stability, not statistical confidence.

## Validation requirements

Calibration must use event-level data: timestamps, effort hours, competition indicators, contract clauses, amendments, bypass evidence, audit outcomes, and lifecycle performance. Report component outcomes before monetizing them. Do not fit parameters to reproduce the Tunnel–Field thesis; retain sign reversals where the data support them.
