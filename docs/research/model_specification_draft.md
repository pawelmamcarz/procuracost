# ProcuraCost model 2.3 specification draft

**Version:** 2.3.0
**Schema:** 2
**Calibration:** `source-scenario-2026-08-28`
**Legal ruleset:** `pl-pzp-2026-2027`
**Status:** deterministic comparison specification, not an empirical estimator

## 1. Estimand

For one purchase, one legal and governance boundary and two declared
procurement workflow designs:

`deltaCost = total(formalSequential) - total(adaptiveCompliant)`

The sign is not constrained. Swapping the alternatives must exchange their
totals, negate the central difference and reverse the outer envelope.

## 2. Context

The record keeps separate:

- legal and governance boundary;
- procedure family;
- purchase archetype;
- purchase execution channel;
- system support;
- initiation date;
- workflow design for each alternative;
- contract design for each alternative.

System support is not a proxy for organisational implementation readiness.
Procedure suitability is a separate non-scored comparison.

## 3. Workflow representation

Each alternative is a directed acyclic graph of steps. A step contains
predecessors, active days, queue days, role hours, non-labour cost, kind and
optional locked legal provenance.

For range case `r`:

`finish_r(s) = max(finish_r(p)) + activeDays_r(s) + queueDays_r(s)`

`elapsedDays_r = max(finish_r(s))`

The engine rejects cycles, missing predecessors and changes to legal locks.
Mandatory PZP waits are resolved from the dated legal context and remain fixed
and identical in both alternatives.

## 4. Cost functions

For alternative `j` and range case `r`:

`roleCost_j,r = sum(roleHours_j,r x hourlyRate_r)`

`nonLabourCost_j,r = sum(stepNonLabourCost_j,r)`

`delayCost_j,r = elapsedDays_j,r x dailyCostOfInaction_r`

`contractCost_j,r = sum(monetised contract dimensions_j,r)`

`total_j,r = roleCost_j,r + nonLabourCost_j,r + delayCost_j,r + contractCost_j,r`

The central difference uses the two central totals. The reported outer
envelope is:

`[formal.low - adaptive.high, formal.high - adaptive.low]`

Low, central and high values are declared scenario cases, not confidence
intervals.

## 5. Contract dimensions in native 2.3

- Competition transfer uses a 2, 6 and 9 per cent stress only when the declared
  comparison states that competitive access differs.
- Contract-amendment and TCO differentials start at zero.
- Informal process bypass is disclosed as non-monetised.

The Szucs study anchors only the bounded competition-transfer stress and does
not estimate the effect of workflow design in Poland. The other dimensions
require observed or user-supplied evidence before monetisation.

## 6. Reference scenarios

The registry contains ten scenarios:

1. `fleet_tco_reframing`;
2. `erp_transformation_discovery`;
3. `logistics_service_redesign`;
4. `critical_material_continuity`;
5. `public_it_open_with_market_consultation`;
6. `stable_private_standard_service`;
7. `stable_capex_replacement`;
8. `discovery_solution_codesign`;
9. `catalog_calloff_control`;
10. `mrp_release_control`.

ERP discovery, logistics redesign and public IT with preliminary market
consultation provide conditions in which iterative problem definition or
market engagement can have a mechanism. Discovery and co-design can add time
and role effort because learning is modelled as work. Stable standard service
provides a condition with no distinct workflow mechanism. Its starting
scenario separately declares a competition difference. Catalogue call-off and
MRP release use identical maps and no competition difference as neutral
controls.

These are illustrative starting points. Economic values, aggregate base-day
totals and support profiles retained from 2.2.2 are labelled
`retained_legacy_assumption`. The first five scenarios use new illustrative 2.3
step order, day allocation and role-hour allocation. Neither class represents
observed organisational effects.

## 7. Evidence and practitioner boundary

Provenance records distinguish internal illustrative allocations, empirical
anchors, official cases, practitioner observations and research hypotheses. An official case
can support the existence of a mechanism without setting its cost or duration.

[Procurement&Beyond episode
8](https://www.youtube.com/watch?v=5KYUdTLlvvg) may inform interview questions
and research hypotheses only. It cannot calibrate model values or readiness.
Bielik may structure market data for review; the deterministic model performs
the calculation.

## 8. Outputs and diagnostics

The decision record includes metadata, axes, both maps, totals, drivers,
monetisation coverage, non-monetised dimensions, assumptions, evidence, legal
provenance and migration status.

Canonical verification covers all ten scenarios, ordered ranges, the delta
identity, neutral controls, shared legal waits and alternative-swap symmetry.
The replication package renders deterministic JSON, CSV and Markdown from the
same registry and engine.

The complete parameter register and legal boundary are in
[`docs/MODEL_PARAMETERS.md`](../MODEL_PARAMETERS.md).
