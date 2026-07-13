# ProcuraCost Model Parameters

**Model version:** 2.0.0
**Status:** transparent decision model; not an empirical estimator

## Comparison object

The model compares two lawful designs for the same purchase:

- **Formal/sequential path:** more prescribed gates and less ability to parallelize work.
- **Adaptive/compliant path:** the same authorization, ethics, documentation, and competition obligations, with more freedom to sequence work and adapt the contract.

For public procurement, the adaptive path is never an exemption from PZP. It means flexibility available inside the applicable lawful procedure. The former label `policy-only` is retained only in internal compatibility identifiers.

## Constructs kept separate

Version 2.0 removes the single latent rigidity index from economic formulas. `PROCESS_RIGIDITY` remains only as legacy descriptive metadata. The calculation now distinguishes:

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
| Incremental renegotiation slope | 0 pp | 7.7 pp | 10.5 pp | External 2SLS/IV estimate; contractual rigidity only |
| Cumulative TCO savings pool | 0% | 3% | 15% | Scenario assumption |
| Formal-path bypass rate | 2% | 5% | 30% | Scenario assumption |
| Adaptive-path bypass rate | 15% | 5% | 1% | Scenario assumption |

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

## Dimension formulas

- **Staff time:** step participation hours × headcount × daily rate / 8. Adaptive effort for a retained step is scaled by its adaptive/formal duration ratio.
- **Administrative overhead:** coordination cost per elapsed day plus the same selected tool cost for both paths. Technology is not assumed cheaper merely because the workflow is adaptive.
- **Delay:** path days × user-supplied daily cost of inaction.
- **Selection/favoritism:** contract value × price-premium scenario × (1 − competition effectiveness) × context weight. Contractor productivity is not separately monetized.
- **Renegotiation:** user-supplied event cost × incremental probability from the path's **contract-rigidity** profile. The 22% French sample mean is not treated as a universal baseline.
- **TCO:** contract value × cumulative savings-pool scenario × horizon factor × (1 − capture rate). The former unsupported 10%-per-year/30%-cap law is removed.
- **Bypass:** user-supplied audit exposure × bypass-rate scenario × technology-control multiplier. The former invented sigmoid and 86% prediction are removed.

## Empirical anchors and limits

- **Szucs (2024):** Hungarian public procurement; discretion increased normalized prices by about 6 percentage points and selected contractors with about 28% lower measured productivity in the corrected main specification. The price effect is monetized; productivity is disclosed, not added again.
- **Beuve, Moszoro, and Spiller (2023):** French car-park contracts; contractual rigidity is instrumented with political contestability in a 2SLS design. Transfer to general procurement is a scenario, not a measurement.
- **European Commission (2011):** total authority-and-supplier procedure cost is a sanity-check, not an estimate of the incremental cost of formality.
- **Lipsky, Vaughan, and Holmström–Milgrom:** mechanism-level theory only. None supplies a bypass probability.

## Legal thresholds used by the optimizer

Effective from 1 January 2026:

- PZP application threshold: **170,000 PLN net**;
- central supplies/services EU threshold: **603,400 PLN**;
- sub-central supplies/services EU threshold: **930,960 PLN**;
- works EU threshold: **23,291,240 PLN**.

The optimizer asks for procurement object and authority level before selecting the applicable threshold. It remains an illustrative rule-based scorer, not legal advice or trained machine learning.

## Validation requirements

Calibration must use event-level data: timestamps, effort hours, competition indicators, contract clauses, amendments, bypass evidence, audit outcomes, and lifecycle performance. Report component outcomes before monetizing them. Do not fit parameters to reproduce the Tunnel–Field thesis; retain sign reversals where the data support them.
