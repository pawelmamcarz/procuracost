# Formal Specification of the ProcuraCost Cost Model (v1.2)

**Status**: Draft for replication and academic review (June 2026)  
**Corresponding paper**: "The Hidden Cost of Procedural Compliance" (working paper, Mamcarz 2026)  
**Implementation version**: Live in `lib/calculations.ts` + `lib/process-templates.ts` (see `getDimensionMultipliers`, `deriveRigidDays`, `deriveFlexibleDays`, `deriveStaffCost`, `calculateCosts`).  
**Model version**: `MODEL_VERSION` in `lib/version.ts`. The separate Tesla-style `VERSION` identifies the application build, not the quantitative model.

This document provides the closed-form and step-level logic sufficient for an independent researcher to re-implement the core engine or verify outputs against the reference TypeScript implementation.

---

## 1. Model Overview and Scope

The model computes the total opportunity cost differential (ΔC) between a **rigid-procedure path (R)** and a **policy-only flexible path (F)** for a given procurement scenario.

Core equation (implemented in `calculateCosts`):

```
ΔC = C_total(R) − C_total(F)
C_total = timeCost + adminCost + opportunityCost + productivityCost + renegotiationCost + tcoCost + bypassCost
```

Six active cost components are computed. `productivityCost` remains in `CostBreakdown` for schema compatibility but is zero in v1.2.

**Context dimensions (added 2026, following academic feedback)**:  
- `spendType`: "direct" | "indirect"  
- `processPhase`: "upstream" | "downstream"

These drive both calendar-time adjustments (per-step) and multiplier surfaces. They are **not** free parameters in the UI for the main calculator; they are chosen by the user and flow through every calculation and the PDF export.

All monetary values are in PLN unless otherwise noted. Time is in calendar days.

---

## 2. Core Parameters (see also docs/MODEL_PARAMETERS.md)

Global scalars (exact values from `lib/calculations.ts`):

- `BASE_RENEGOTIATION_PROBABILITY = 0.22`
- `RIGIDITY_RENEGOTIATION_PREMIUM = 0.077` (Beuve et al. 2021)
- `TCO_SAVINGS_RATE_PER_YEAR = 0.10` (modeling assumption)
- `MAX_TCO_SAVINGS_RATE = 0.30` (modeling guardrail)

The former rigidity price and productivity penalties were removed because they reversed the direction of Szucs (2024), which finds adverse effects from high discretion.

Bypass model (exact):
```ts
const BYPASS_SIGMOID_STEEPNESS = 10;
const BYPASS_THRESHOLD = 0.5;
function bypassProbability(rigidityIndex: number): number {
  return 1 / (1 + Math.exp(-BYPASS_SIGMOID_STEEPNESS * (rigidityIndex - BYPASS_THRESHOLD)));
}
```

Flexible-path scalars (exact):
- `FLEXIBLE_TOOL_UTILIZATION_RATE = 0.3`
- `FLEXIBLE_RENEGOTIATION_PROBABILITY_FACTOR = 0.7`
- `FLEXIBLE_BYPASS_PROBABILITY_SCALE = 0.1`

Technology levels and process rigidity indices are defined in `TECH_LEVELS` and `PROCESS_RIGIDITY` (process-templates.ts). See MODEL_PARAMETERS.md for full tables.

---

## 3. Calendar Time Model (deriveRigidDays / deriveFlexibleDays)

### 3.1 Rigid Path Days

Base:
```
base_rigid = Σ (step.rigidDays)   for all steps in the template
```

Context adjustment (Direct + Upstream only; otherwise factor = 1.0):
```ts
stepDayBoost(stepId) =
  if (phase !== "upstream" || spendType !== "direct") → 1.0
  if stepId in ["siwz_prep", "spec_prep", "clarifications", "bid_evaluation", "award_committee", "contract_signing", "needs_analysis"] → 1.22
  if stepId in ["publication", "standstill"] → 1.08
  else → 1.0
```

Then:
```
adjusted_rigid = Σ (step.rigidDays * stepDayBoost(step.id))
rigidDays = round(adjusted_rigid * tech.timeMultiplier)
```

Mandatory waits (publication, standstill, etc.) are never shortened in the rigid path.

### 3.2 Flexible Path Days

Base (policy-only template):
```
base_flex = Σ (step.flexibleDays)   for steps where flexibleDays !== null
```

Overall compression (from `getFlexibleTimeCompression`):
- If Direct + Upstream: 0.82 (strongest compression)
- If Upstream (any): 0.95
- If Downstream: 0.91
- Else: 0.85 (default `FLEXIBLE_PATH_TIME_COMPRESSION`)

Per-step compression bonus (Direct + Upstream only on the heaviest formal steps):
- `["siwz_prep","spec_prep","publication","standstill","award_committee"]` → 0.82
- `["clarifications","bid_evaluation","contract_signing"]` → 0.90
- Else → 1.0 (still subject to overall compression)

Final:
```
adjusted_flex = Σ (step.flexibleDays * stepCompressionBonus) * overall_compression
flexibleDays = round(adjusted_flex * tech.timeMultiplier)
```

---

## 4. Staff Cost Model (deriveStaffCost)

For each active step (all for rigid; only those with flexibleDays != null for flexible):

```
stepCost = Σ_roles (effectiveHours[role] * stakeholders[role].count * stakeholders[role].dailyRate / 8)
```

`effectiveHours` starts as the template `participation[role]` (hours per step).

Layered contextual multipliers (applied multiplicatively in the order coded; see exact source in deriveStaffCost):

**Phase effects (upstream):**
- executive: ×1.85
- manager: ×1.65
- lawyer: ×1.55
- finance: ×1.4
- buyer: ×0.75

**Phase effects (downstream):**
- buyer: ×1.5
- requestor: ×1.35
- manager: ×0.65
- executive: ×0.5

**SpendType effects (direct):**
- executive: ×1.3
- manager: ×1.25
- finance: ×1.35
- lawyer: ×1.2

**Cross terms (indirect + upstream):**
- executive: ×0.75 (relative)

**Strongest operational profile (indirect + downstream):**
- executive/manager: ×0.5
- buyer: ×1.6
- requestor: ×1.4

**Per-step granularity (Direct + Upstream only, on top of the above):**
- award_committee / contract_signing + executive: ×1.45 additional
- award_committee / contract_signing + lawyer: ×1.35
- siwz_prep / spec_prep + lawyer: ×1.4
- siwz_prep / spec_prep + manager: ×1.25
- clarifications + executive: ×1.3
- needs_analysis + executive: ×1.6

Total staff cost for the path is then further scaled by `dims.staffIntensityMultiplier` (from getDimensionMultipliers).

---

## 5. Dimension Multipliers (getDimensionMultipliers)

Exact implementation (no other hidden factors):

```ts
let tco=1, delay=1, productivity=1, bypass=1, renegotiation=1,
    staffIntensity=1, coordinationIntensity=1;

if (spendType === "direct") {
  tco *= 1.35; bypass *= 1.15; renegotiation *= 1.15;
}
if (processPhase === "upstream") {
  delay = 1.4; bypass *= 1.25; renegotiation *= 1.2;
  staffIntensity = 1.25; coordinationIntensity = 1.3;
} else if (processPhase === "downstream") {
  delay = 0.9; coordinationIntensity = 0.85;
}
if (spendType === "direct" && processPhase === "upstream") {
  tco *= 1.2; renegotiation *= 1.15; staffIntensity *= 1.15;
}
```

These are applied as follows in `calculateCosts`:
- `rigidStaffCost = deriveStaffCost(...) * staffIntensityMultiplier`
- `rigidCoordCost = tech.coordCostPerDay * rigidDays * coordinationIntensityMultiplier`
- `rigidDelayCost = delayDays * dailyCostOfInaction * delayMultiplier`
- `rigidProductivityCost = flexibleProductivityCost = 0`
- `rigidRenegotiationProb = clamp(0.22 + 0.077 * renegotiationMultiplier, 0, 1)`
- `rigidTCORate = min(0.30, 0.10 * tcoYears * baseRigidity * tcoMultiplier)`
- `rigidTCOForgone = contractValue * rigidTCORate`
- `effectiveRigidity = clamp(baseRigidity * tech.bypassProbMultiplier * bypassMultiplier, 0, 1)`
- `pBypassRigid = bypassProbability(effectiveRigidity)`

Flexible path receives the symmetric application (with its own base rigidity `policy_only = 0.15` and the flexible scalars).

`getDimensionMultiplierDetails` returns only the non-1.0 factors with bilingual labels for UI/PDF.

---

## 6. Cost Component Construction (buildBreakdown + calculateCosts)

See `buildBreakdown` and the exact assignments in `calculateCosts`. Opportunity cost for the rigid path is `(rigidDays − flexibleDays) × dailyInaction × delayMultiplier`; no exogenous price premium is assigned in v1.2.

The result includes both path breakdowns, `delta`, `deltaPercent`, rigid and flexible bypass probabilities, derived days, source/assumption annotations, and a calculation trace with multiplier values, role-level staff costs, rates, probabilities, and intermediate costs.

The matrix (`calculateMatrix`) simply calls the full model across all four tech levels for a fixed set of other inputs.

---

## 7. Reproducibility Notes

- Every number that appears in a ProcuraCost output for a given input vector is a deterministic function of:
  1. The input vector (including spendType + processPhase)
  2. The exact step templates + participation matrices in process-templates.ts
  3. The scalars and multiplier functions listed above
  4. The technology level record chosen

- To reproduce a table/figure: capture the full `ProcurementInputs`, run `calculateCosts`, or execute `npm run replicate` and compare against `replication/outputs/`.

- The three 2026 context multipliers (tco 1.35 base for direct, delay 1.4 / staff 1.25 for upstream, plus the Direct×Upstream super-adders) are explicitly flagged in `MODEL_PARAMETERS.md` as "Modeling Assumption (literature-informed)" and are the primary target of the empirical validation program (see EMPIRICAL_VALIDATION_PLAN.md and the survey structure).

---

## 8. Relationship to the Live Application

- The **Assumptions Explorer** calls the exact multiplier functions. Manual overrides affect its simplified sensitivity simulator only and do not alter `calculateCosts`.
- The main calculator, PDF export, and CostComparison consume the cost functions with the user-selected context. The optimizer is a separate heuristic scoring ensemble.
- Researcher Export emits the input vector, model/app versions, multipliers, calculation trace, results, and annotations in JSON plus summary formats.

**Freeze requirement**: create a model-v1.2 tag only after the parameter register, generated outputs, tests, and paper claims have been reviewed together.

---

**End of formal specification draft (v1.2).**  
Next: add empirical calibration data and uncertainty analysis; do not treat illustrative archetypes as observed cases.

See:
- `docs/MODEL_PARAMETERS.md` (full source/ type / sensitivity table)
- `docs/RESEARCH_PAPER_ACTION_PLAN.md` (Week 1 tasks)
- `docs/research/replication_package_spec.md`
- Source: `lib/calculations.ts:96` (multipliers), `lib/process-templates.ts:647` (derive* functions)
