# ProcuraCost Model Parameter Register

**Model version**: 1.2.0
**Date**: June 2026
**Status**: Evidence-audit baseline; external calibration pending

---

## Purpose

This register separates three categories that must not be conflated:

- **Empirical anchor**: an external estimate that directly supports the stated relationship.
- **Modeling assumption**: an author-chosen value used to generate a scenario output.
- **User input**: a value supplied for a specific scenario and not claimed to be generalizable.

Computational reproducibility does not validate an assumption. The executable source of truth is
`lib/calculations.ts` and `lib/process-templates.ts`; this document records provenance and gaps.

---

## 1. Economic and Behavioral Parameters

| Parameter | Code | Value | Status | Evidence and limitation | Sensitivity |
|---|---|---:|---|---|---|
| Base renegotiation probability | `BASE_RENEGOTIATION_PROBABILITY` | 0.22 | Empirical anchor | Unconditional average reported by Beuve, Moszoro & Saussier (2021) for their sample; transportability is untested. | High |
| Rigidity renegotiation increment | `RIGIDITY_RENEGOTIATION_PREMIUM` | 0.077 | Empirical anchor + model mapping | Paper reports 7.7–10.5 percentage points for higher rigidity. ProcuraCost uses the lower bound and multiplies it by contextual factors, which is a modeling choice. | High |
| Annual TCO opportunity | `TCO_SAVINGS_RATE_PER_YEAR` | 0.10 | Modeling assumption | No sufficiently specific primary source was identified for the former ISM attribution. | Very high |
| Maximum TCO opportunity | `MAX_TCO_SAVINGS_RATE` | 0.30 of contract value | Modeling guardrail | Prevents long horizons and multipliers from implying unbounded savings; requires empirical calibration. | Very high |
| Bypass sigmoid steepness | `BYPASS_SIGMOID_STEEPNESS` | 10 | Modeling assumption | Controls the shape of an unvalidated behavioral function. | High |
| Bypass sigmoid threshold | `BYPASS_THRESHOLD` | 0.5 | Modeling assumption | Sets the inflection point of the bypass function. | High |
| Flexible tool utilization | `FLEXIBLE_TOOL_UTILIZATION_RATE` | 0.30 | Modeling assumption | Share of tool cost allocated to the flexible path. | Low-Medium |
| Flexible renegotiation factor | `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR` | 0.70 | Modeling assumption | Not directly estimated by Beuve et al. | High |
| Flexible bypass scale | `FLEXIBLE_BYPASS_PROBABILITY_SCALE` | 0.10 | Modeling assumption | Residual bypass probability under the flexible path. | Medium |
| Rigid price premium | removed in v1.2 | 0 | Disabled | Earlier versions reversed Szucs (2024). That paper finds adverse effects from high discretion, not a rigidity premium. | High |
| Productivity adjustment | `productivityCost` | 0 | Disabled | Retained in the output schema only. A future governance-risk model must distinguish bounded flexibility from uncontrolled discretion. | High |

### Boundary evidence: Szucs (2024)

Szucs finds that high discretion increased prices and selected less productive, more politically connected
suppliers in the studied Hungarian system. ProcuraCost therefore treats this paper as a boundary condition
for field-like governance, not as a cost assigned to rigid procedures.

---

## 2. Technology-Level Parameters

Every value in this table is currently a **modeling assumption**. Vendor examples describe product classes;
they do not validate the multipliers.

| Technology level | Time multiplier | Coordination PLN/day | Tool PLN/process | Bypass multiplier | Policy rigidity index |
|---|---:|---:|---:|---:|---:|
| Manual | 1.40 | 500 | 0 | 1.50 | 0.35 |
| Sourcing tool | 1.15 | 200 | 800 | 0.80 | 0.22 |
| Partial ERP | 1.00 | 100 | 1,200 | 0.55 | 0.15 |
| End-to-end | 0.70 | 20 | 2,000 | 0.10 | 0.05 |

**Validation target**: system timestamps, license allocation data, coordination time, and observed off-system
transactions before and after technology adoption.

---

## 3. Process Rigidity Indices

All indices are modeling assumptions used in TCO and bypass calculations.

| Process type | Rigidity index |
|---|---:|
| PZP EU | 0.95 |
| PZP national | 0.80 |
| Private formal | 0.60 |
| Policy only | 0.15 |
| Catalog order | 0.20 |
| MRP order | 0.12 |
| CAPEX | 0.72 |
| Custom default | 0.50 |

The labels do not establish legal compliance or actual rigidity in a specific organization.

---

## 4. Direct/Indirect x Upstream/Downstream Multipliers

All values below are modeling assumptions and the highest-priority calibration targets.

| Context rule | Parameter | Factor |
|---|---|---:|
| Direct | TCO | 1.35 |
| Direct | Bypass | 1.15 |
| Direct | Renegotiation | 1.15 |
| Upstream | Delay | 1.40 |
| Upstream | Bypass | 1.25 |
| Upstream | Renegotiation | 1.20 |
| Upstream | Staff intensity | 1.25 |
| Upstream | Coordination | 1.30 |
| Downstream | Delay | 0.90 |
| Downstream | Coordination | 0.85 |
| Direct x Upstream interaction | TCO | 1.20 additional; combined 1.62 |
| Direct x Upstream interaction | Renegotiation | 1.15 additional; combined 1.587 |
| Direct x Upstream interaction | Staff intensity | 1.15 additional; combined 1.4375 |

The implementation also applies role-level and step-level assumptions, including upstream executive effort
of 1.85x, selected Direct x Upstream rigid-step boosts of 1.22, and flexible-step compression factors of
0.82 or 0.90. Exact rules are in `lib/process-templates.ts`.

---

## 5. Process Templates and Role Hours

Rigid/flexible durations, mandatory-wait flags, and role participation hours are defined per step in
`lib/process-templates.ts`. They are currently modeling assumptions. Legal waiting periods have not been
audited as a complete current PZP compliance table and must not be used as legal advice.

**Validation target**:

1. Extract requisition, sourcing, award, signature, PO, and receipt timestamps.
2. Collect role-level time-use data for matched processes.
3. Estimate distributions by process type and 2x2 quadrant.
4. Replace point assumptions with estimates and uncertainty intervals.

---

## 6. User Inputs

The following values are scenario-specific and must not be presented as literature estimates:

- Contract value and TCO horizon
- Daily cost of inaction
- Renegotiation event cost
- Bypass/audit exposure
- Stakeholder counts and rates
- Custom process steps
- Spend type and process phase classification

Built-in scenario inputs are illustrative. Named organizations motivate archetypes only; the inputs are not
their financial or process data.

---

## 7. Current Evidence Summary

| Area | Current status |
|---|---|
| Rigidity and renegotiation | One external empirical anchor; contextual mapping unvalidated |
| Discretion and supplier outcomes | Countervailing external evidence; not encoded as a path penalty |
| TCO | Modeling assumption with a 30% guardrail |
| Bypass | Conceptually motivated, quantitatively unvalidated |
| Technology effects | Modeling assumptions |
| Process durations and role hours | Modeling assumptions |
| 2x2 interactions | Modeling assumptions |
| Primary organizational data | None collected as of June 2026 |

No percentage split between "empirical", "calibrated", and "assumed" parameters is reported because such a
split would be arbitrary and would obscure the leverage of a small number of high-sensitivity assumptions.

---

## 8. Required Before Empirical Submission

- Complete source-to-parameter audit with page/table references.
- Global sensitivity analysis and uncertainty intervals.
- Pilot survey and interview evidence.
- Organizational timestamp and outcome data for at least one calibration sample.
- Pre-registered primary propositions and identification strategy.
- Regenerated paper tables via `npm run replicate`.

**Maintained by**: Paweł Mamcarz
