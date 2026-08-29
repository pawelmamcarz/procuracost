# ProcuraCost model 2.3 parameter and evidence contract

**Model version:** 2.3.0

**Schema version:** 2

**Calibration identifier:** `source-scenario-2026-08-28`

**Legal ruleset:** `pl-pzp-2026-2027`
**Status:** transparent deterministic comparison model, not an empirical
estimator or legal opinion

This document is the active explanation of the parameters and evidence
boundary. The executable definitions are in `lib/model-v2/`. A release is not
internally consistent unless this document, the implementation, diagnostics and
replication artefacts agree.

## 1. Comparison object

The model compares two procurement workflow designs for the same purchase:

- `formalSequential`: a prescribed sequential design;
- `adaptiveCompliant`: a policy-bounded adaptive design.

Both alternatives use the same declared legal and governance boundary. An
adaptive/compliant design is not an exemption from applicable procurement law,
authorisation, competition, ethics or documentation requirements.

The comparison does not rank organisational maturity and does not recommend a
procedure. The Tunnel and Field metaphor is an explanatory device, not a model
input.

## 2. Decision context and alternatives

### 2.1 Recorded context axes

| Axis | Supported values |
|---|---|
| Legal and governance boundary | `private_policy`, `public_internal_rules`, `pzp_classic_national`, `pzp_classic_eu` |
| Procedure family | `private_competitive`, `private_negotiated`, `public_internal_competitive`, `pzp_basic`, `pzp_open`, `pzp_restricted`, `framework_calloff`, `custom_lawful` |
| Purchase archetype | `standardized_recurring`, `incomplete_requirement`, `complex_service`, `continuity_critical`, `capital_investment` |
| Purchase execution channel | `sourcing_event`, `catalog_calloff`, `mrp_release`, `custom` |
| System support | `manual`, `sourcing_platform`, `transactional_erp`, `integrated_source_to_pay` |
| Initiation date | ISO date within the active legal-ruleset coverage |

Each alternative then has an independent procurement workflow design and
contract design. System support describes the selected operating environment.
It is not evidence of organisational implementation readiness.

### 2.2 Procedure families admitted by each boundary

| Boundary | Procedure families admitted by the current comparison |
|---|---|
| Private policy | private competitive, private negotiated, framework call-off, custom lawful |
| Public internal rules | public internal competitive, framework call-off, custom lawful |
| PZP classic national | basic procedure, framework call-off |
| PZP classic EU | open procedure, restricted procedure, framework call-off |

The suitability surface shows these candidates with equal visual status. It
does not score, rank or recommend them. Procedures outside this deliberately
limited registry are withheld rather than approximated.

## 3. Legal ruleset and fail-closed boundary

The legal resolver accepts initiation dates from 1 January 2026 through
31 December 2027. Outside that coverage it blocks calculation. Sectoral and
defence/security procurement are outside the current scope and also fail
closed.

The following waits are fixed model inputs for the supported classic PZP
contexts:

| Procedure | Locked wait | Modelled days | Provision recorded in the decision record |
|---|---|---:|---|
| Basic procedure | tender submission, supplies/services | 7 | PZP art. 283 |
| Basic procedure | tender submission, works | 14 | PZP art. 283 |
| Basic procedure | standstill, electronic communication | 5 | PZP art. 308(2) |
| Basic procedure | standstill, other communication | 10 | PZP art. 308(2) |
| Open procedure | tender submission | 35 | PZP art. 138(1) |
| Open procedure | standstill, electronic communication | 10 | PZP art. 264(1) |
| Open procedure | standstill, other communication | 15 | PZP art. 264(1) |
| Restricted procedure | request to participate | 30 | PZP art. 144(1) |
| Restricted procedure | tender submission | 30 | PZP art. 151(1) |
| Restricted procedure | standstill, electronic communication | 10 | PZP art. 264(1) |
| Restricted procedure | standstill, other communication | 15 | PZP art. 264(1) |

The resolver models the stated baseline rules only. It does not decide whether
a reduction, exception or different regime applies to a real procurement.
That determination remains with the contracting authority and its advisers.

A legal-wait step has fixed low, central and high values, zero active days and
the same queue days in both alternatives. It cannot be edited, removed or
scaled by system support.

## 4. Range and evidence semantics

Every numerical input has:

- `low`, `central` and `high`;
- `rangeKind`: `fixed`, `calibrated` or `stress`;
- an evidence class;
- zero or more evidence identifiers.

The ordering invariant is `low <= central <= high`. A fixed range uses one
identical value in all three cases.

Evidence classes are:

1. `empirical_anchor`;
2. `official_case`;
3. `practitioner_observation`;
4. `illustrative_scenario`;
5. `research_hypothesis`;
6. `retained_legacy_assumption`;
7. `user_input`;
8. `legal_rule`.

The three cases are declared scenario values. They are not confidence
intervals, posterior intervals or estimates of sampling uncertainty. The engine
combines aligned low, central and high cases and then constructs an outer
difference envelope.

## 5. Procurement process maps

A workflow is a directed acyclic graph. Every step records:

- a stable identifier and label;
- predecessor identifiers;
- active days and queue days;
- role hours;
- non-labour process cost;
- step kind;
- locked legal provenance where applicable.

The engine rejects cycles, unknown predecessors, duplicate step identifiers and
changes to a legal lock.

For range case `r`, the finish time of step `s` is:

`finish_r(s) = max(finish_r(p) for p in predecessors(s)) + activeDays_r(s) + queueDays_r(s)`

A step without a predecessor starts at zero. The alternative's elapsed duration
is the maximum finish time across its steps. Staff effort and non-labour cost
are summed over all steps, not only the critical path.

The native graph supports sequential, parallel and converging work. Reference
templates, whether retained or illustrative, are declared starting maps rather
than observations of how organisations execute procurement.

## 6. Cost calculation

For alternative `j` and range case `r`:

`roleCost_j,r = sum(stepRoleHours_j,r x roleHourlyRate_r)`

`nonLabourCost_j,r = sum(stepNonLabourCost_j,r)`

`delayCost_j,r = elapsedDays_j,r x dailyCostOfInaction_r`

`contractCost_j,r = sum(monetisedContractDimension_j,r)`

`total_j,r = roleCost_j,r + nonLabourCost_j,r + delayCost_j,r + contractCost_j,r`

The central signed difference is:

`deltaCost = total_formalSequential,central - total_adaptiveCompliant,central`

The outer envelope is:

`low = total_formalSequential,low - total_adaptiveCompliant,high`

`high = total_formalSequential,high - total_adaptiveCompliant,low`

A positive difference means that the formal/sequential total is higher under
the declared inputs. A negative difference means that the
adaptive/compliant total is higher. Zero and sign reversal are valid outcomes.
Swapping the alternatives must exchange their totals, negate the central
difference and reverse the outer envelope.

All monetary values are in PLN. The engine does not apply an implicit discount
rate or hidden context multiplier.

## 7. Contract-cost dimensions

### 7.1 Competition transfer

The 2, 6 and 9 per cent stress is applied only where the comparison explicitly
declares different supplier access and identifies the alternative with the
restricted access. In the canonical registry this occurs only in the stable
standard-service sensitivity scenario:

`competitionTransfer_restricted = contractValue x {0.02, 0.06, 0.09}`

The other alternative receives zero. Where the comparison does not explicitly
declare a supplier-access difference, both alternatives receive zero. The user
may select either alternative as restricted or remove the difference entirely;
the workflow label never determines the allocation.

The stress is a declared transfer from the price channel examined by Szucs
(2024), which concerns Hungarian contracts below an invitational-procedure
threshold. It is not an estimate for Poland and does not identify the effect of
procurement workflow design. A real use therefore requires the user to verify
the market-access mechanism rather than infer it from the word adaptive.

### 7.2 Contract amendment and TCO

Contract-amendment and TCO differentials are zero in every native 2.3 starting
scenario. No coefficient from an amendment study and no general TCO percentage
is monetised without a signed allocation convention and evidence for the
specific comparison.

A TCO analysis may still be prepared outside this delta. A language model such
as Bielik may structure market data for review, while the transparent
deterministic calculation must remain separate and auditable.

### 7.3 Informal process bypass

Informal bypass is present in the decision record as `notMonetized`. The model
does not infer a bypass probability from workflow design, system ownership or
readiness. Monetisation requires observed or user-supplied rates and an explicit
method that is not part of native model 2.3.0.

## 8. Retained starting assumptions

Values migrated from model 2.2.2 remain labelled
`retained_legacy_assumption`. Their retention preserves a reproducible starting
point; it does not convert them into empirical estimates.

### 8.1 Support profiles

The profile multiplies active days and role hours for non-legal reference-map
steps. It adds coordination cost to active steps that consume role effort and
one tool-cost allocation per event or operational order.

| System support | Time and role-hour multiplier | Coordination cost per active day | Tool cost per sourcing event | Tool cost per operational order |
|---|---:|---:|---:|---:|
| Manual | 1.40 | 500 | 0 | 0 |
| Sourcing platform | 1.15 | 200 | 800 | 30 |
| Transactional ERP | 1.00 | 100 | 1,200 | 50 |
| Integrated source-to-pay | 0.70 | 20 | 2,000 | 60 |

These are retained calibration assumptions. They do not measure the effect of a
technology implementation and do not imply that the organisation is ready to
use the system.

### 8.2 Workflow-map provenance and active days before support scaling

For the fleet, ERP, logistics and critical-material scenarios, model 2.3 retains
the `44/24` aggregate base-day totals from the strategic-private template. The
public-IT scenario retains the `42/26` non-legal totals from the PZP-open
template. It does not retain the old step topology for these five scenarios.
Step order, allocation of aggregate days across steps and role-hour allocations
are new illustrative model 2.3 inputs. They expose the named mechanism and a
visible trade-off; they are not observations or effects inferred from the
official cases.

The retained support profile is then applied to those illustrative allocations.
Materialised active days and role hours therefore combine an illustrative 2.3
allocation with a retained support multiplier. Materialised non-labour costs
also use the retained coordination and tool-cost profile. The decision record
identifies both provenance classes.

| Template or scenario group | Formal/sequential | Adaptive/compliant | Interpretation |
|---|---:|---:|---|
| Fleet, ERP, logistics and critical-material mechanism maps | 44 | 24 | retained aggregate; illustrative step and role-hour allocation |
| Public-IT mechanism map, excluding locked legal waits | 42 | 26 | retained aggregate; illustrative step and role-hour allocation |
| Stable policy control | 20 | 20 | identical control work |
| CAPEX replacement | 120 | 84 | retained investment gates |
| Discovery and co-design | 34 | 47 | adaptive learning adds declared work |
| Catalogue call-off | 3 | 3 | identical control map |
| MRP release | 2 | 2 | identical control map |

Reference-map non-legal queue days are zero. User-edited maps may introduce
queues or parallel dependencies. The discovery difference is a falsifiable
scenario assumption, not an observed effect.

### 8.3 Default role-rate assumptions

The default daily rates are divided by eight to obtain hourly rates:

| Role | PLN per day |
|---|---:|
| Business requestor | 900 |
| Buyer | 800 |
| Lawyer | 1,200 |
| Finance | 900 |
| Manager | 1,500 |
| Executive | 2,500 |

Scenario-specific overrides are recorded in the decision record and replication
bundle. The rates remain retained assumptions and must be replaced with
organisation-specific fully loaded rates for an applied comparison.

Central daily rates in the canonical scenarios are:

| Scenario group | Requestor | Buyer | Lawyer | Finance | Manager | Executive |
|---|---:|---:|---:|---:|---:|---:|
| Fleet; stable standard service | 900 | 800 | 1,200 | 900 | 1,500 | 2,500 |
| ERP transformation | 1,200 | 1,200 | 1,500 | 1,000 | 1,800 | 3,000 |
| Logistics redesign | 900 | 900 | 1,300 | 1,000 | 1,600 | 2,800 |
| Critical-material continuity | 800 | 700 | 1,200 | 800 | 1,400 | 2,500 |
| Public IT open procedure | 900 | 900 | 1,300 | 900 | 1,500 | 2,500 |
| CAPEX replacement | 1,000 | 900 | 1,500 | 1,000 | 1,600 | 3,000 |
| Discovery and co-design | 900 | 900 | 1,300 | 1,000 | 1,600 | 2,800 |
| Catalogue call-off; MRP release | 800 | 800 | 1,200 | 900 | 1,500 | 2,500 |

The engine divides these retained daily rates by eight. Per-step role hours are
part of the scenario map and are reproduced in the decision record. Their
allocations in the five mechanism maps are illustrative model 2.3 inputs; the
remaining reference maps retain the earlier allocations. The table does not
imply a standard market rate for any role.

### 8.4 Daily cost of inaction

For a central daily input `d`, the retained stress range is:

`{0.25d, d, 4d}`

The value is supplied by the scenario or user. ProcuraCost cannot verify it.
A zero central value remains zero in all three cases. In Polish public copy the
preferred term is `dzienny koszt zwłoki`; the intended economic mechanism must
be stated clearly and must not be confused with a statutory penalty.

## 9. Ten canonical scenarios

| ID | Legacy alias | Boundary and procedure | Archetype and channel | System support | Contract value | Central daily cost | Restricted supplier access |
|---|---|---|---|---|---:|---:|---|
| `fleet_tco_reframing` | `fleet` | private policy, competitive | capital investment, sourcing event | transactional ERP | 5,000,000 | 5,000 | none declared |
| `erp_transformation_discovery` | `erp` | private policy, negotiated | incomplete requirement, sourcing event | sourcing platform | 3,000,000 | 8,200 | none declared |
| `logistics_service_redesign` | `logistics` | private policy, competitive | complex service, sourcing event | transactional ERP | 8,000,000 | 1,800 | none declared |
| `critical_material_continuity` | `production` | private policy, negotiated | continuity-critical, sourcing event | manual | 12,000,000 | 50,000 | none declared |
| `public_it_open_with_market_consultation` | `pipe_vs_field` | PZP classic EU, open | incomplete requirement, sourcing event | transactional ERP | 5,000,000 | 10,000 | none declared |
| `stable_private_standard_service` | `governance_control` | private policy, competitive | standard recurring, sourcing event | integrated source-to-pay | 5,000,000 | 0 | adaptive/compliant: restricted shortlist or incumbent continuation |
| `stable_capex_replacement` | `capex_investment` | private policy, competitive | capital investment, sourcing event | transactional ERP | 15,000,000 | 13,700 | none declared |
| `discovery_solution_codesign` | `discovery_rd` | private policy, negotiated | incomplete requirement, sourcing event | transactional ERP | 3,000,000 | 5,500 | none declared |
| `catalog_calloff_control` | `catalog` | private policy, framework call-off | standard recurring, catalogue call-off | integrated source-to-pay | 50,000 | 500 | none declared |
| `mrp_release_control` | `mrp` | private policy, framework call-off | continuity-critical, MRP release | integrated source-to-pay | 500,000 | 8,000 | none declared |

Contract value affects the canonical starting calculation only in the stable
standard-service sensitivity scenario, through its declared competition-transfer
cost. Contract values, daily costs and role rates are retained starting
assumptions. Workflow-map provenance follows section 8.2. The catalogue and MRP controls use identical
maps and no supplier-access difference, so the central comparison is zero. The
outer envelope is symmetric because the aligned path ranges are identical.
All canonical scenarios use the initiation date 28 August 2026.

## 10. When adaptive work has or lacks a mechanism

Official cases are attached only to constructs they can support.

- ERP discovery may use problem definition and modular contracting when the
  requirement is incomplete.
- Logistics service redesign may use market engagement to test service levels,
  operational interfaces and risk allocation.
- Public IT may use preliminary market consultation before the open procedure.
  The statutory tender and standstill waits remain identical in both
  alternatives.
- Discovery and co-design may add time and staff effort because learning and
  re-scoping are work, not automatic savings.

By contrast, a stable service may require the same relevant work in both
designs. Catalogue call-off and MRP release controls have identical maps, so
the model adds no value to either alternative merely because one is called
adaptive. The stable-service scenario is a topology control, not a total-cost
control. It separately compares open competition under the policy criteria with
a restricted shortlist or incumbent continuation after market discovery. The
adaptive/compliant alternative is explicitly selected as restricted in the
starting point, and the user may reverse or remove that allocation. This is a
declared transfer sensitivity, not a property of adaptive work.

These statements identify conditions and hypotheses. They are not procurement
recommendations and do not establish causal effects.

## 11. Evidence registry and source limits

Active external records include:

- [California Department of Technology, modular IT
  procurement](https://www.cdt.ca.gov/newsroom/2022/08/california-redefines-state-technology-procurement/);
- [OECD, RVUL problem-definition
  example](https://www.oecd.org/en/publications/public-procurement-in-lithuania_aa1b196c-en/full-report/component-8.html);
- [Urząd Zamówień Publicznych, wstępne konsultacje
  rynkowe](https://www.gov.pl/web/uzp/wstepne-konsultacje-rynkowe);
- [European Commission, Guidance on Innovation
  Procurement](https://public-buyers-community.ec.europa.eu/resources/guidance-innovation-procurement);
- [Szucs (2024), Discretion and favoritism in public
  procurement](https://doi.org/10.1093/jeea/jvad017).

The four official cases support qualitative mechanisms only. The internal record
`model_2_3_mechanism_workflow_allocations` documents the five illustrative step
maps and their mixed provenance with the retained support profiles. Szucs supports
the bounded competition-transfer stress under a stated transfer assumption.
None supplies aggregate workflow days, step allocations, role hours, role rates,
support costs or daily costs.

[Procurement&Beyond episode
8](https://www.youtube.com/watch?v=5KYUdTLlvvg) is a practitioner observation
based on automatically generated Polish captions. It may inform question design
and hypothesis generation about internal ownership, process friction,
requirements, operational purchasing, policy simplification, TCO and bounded AI
use. It cannot set model values, readiness states, weights, ranges or
thresholds.

## 12. Decision record, suitability and readiness

A model 2.3 decision record exposes:

1. the metadata tuple and migration status;
2. all six recorded context axes;
3. both independent workflow maps and contract designs;
4. totals, signed difference and outer envelope;
5. driver contributions;
6. monetisation coverage and exact calculation anchors;
7. non-monetised dimensions;
8. internal workflow provenance, retained assumptions, external evidence and
   legal provenance.

The suitability comparison is a separate non-scored comparison of procedure
families admitted by the declared boundary. Organisational implementation
readiness is self-described in another module using eight domains and sixteen
questions. It reports response counts and domain groupings only; it does not
validate readiness or issue a go/no-go decision. It has no points, percentage,
weight or import path into the cost engine.

## 13. Migration and historical material

Legacy links are decoded as `exact`, `partial` or `ambiguous`. Ambiguous
migrations block calculation until the user confirms the unresolved fields.
The decision record preserves the migration audit and subsequent edits.

Model 2.2.2 formulas, optimiser thresholds, aggregate path profiles, maturity
language and decision-threshold maps remain historical. The immutable
replication package is under `replication/archive/model-2.2.2/` and the
calibration audit is in
`docs/research/CALIBRATION_BENCHMARKS.md`. They must not be imported into a
native 2.3 result.

## 14. Change-control invariants

A proposed parameter or formula change is admissible only if it:

1. records evidence class and identifiers;
2. preserves ordered ranges;
3. leaves legal waits locked and shared;
4. preserves the signed-difference and swap-symmetry identities;
5. does not infer readiness from workflow or system support;
6. updates diagnostics, replication and this document together;
7. is justified before inspecting whether it helps either alternative.

The verification commands are:

```bash
npm test
npm run recompute
npm run sweep
npm run replicate
```

Reproduction verifies deterministic consistency. It does not validate the
assumptions, prove causality, select a lawful procedure for a real case or
replace procurement, legal or financial judgement.
