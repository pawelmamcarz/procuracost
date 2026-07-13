# ProcuraCost Replication Package

**Model version**: 1.2.0  
**Evidence status**: deterministic simulation with illustrative inputs; external calibration pending

This package supports computational reproduction of ProcuraCost outputs. It does not establish that the
parameters are empirically valid or that modeled differentials were realized by any named organization.

## Reproduce

From the repository root:

```bash
npm test
npm run replicate
```

`npm test` verifies multiplier composition, additive totals, input sanitization, scenario finiteness,
bypass-probability consistency, and deterministic optimizer behavior.

`npm run replicate` regenerates:

- `outputs/built-in-scenarios.json` — complete inputs, outputs, source/assumption annotations, and calculation traces.
- `outputs/built-in-scenarios.csv` — compact scenario summary.
- `outputs/built-in-scenarios.md` — paper-readable summary table.

## Export Schema

Calculator JSON exports include:

- `modelVersion` and separate `appVersion`
- Full `ProcurementInputs`, including `spendType` and `processPhase`
- Full active multiplier vector
- Rigid and flexible days
- Rigid and flexible bypass probabilities
- Rigid and flexible cost breakdowns
- Calculation trace with role-level staff costs, rates, probabilities, and intermediate costs
- Source or assumption annotations

The Assumptions Explorer also exports manually overridden multiplier values, but its representative
`calculateCosts` result continues to use the production model baseline. Overrides are sensitivity inputs,
not hidden changes to the main engine.

## Evidence Boundary

- Built-in scenarios are illustrative.
- Company examples motivate archetypes only.
- Financial inputs are not organization data.
- Reproducing a number proves code-path consistency, not empirical validity.
- Model v1.2 removes the former rigidity price/productivity penalties because they reversed Szucs (2024).
- TCO uses an unvalidated 10% annual assumption with a 30% contract-value cap.

## Files

- `docs/MODEL_PARAMETERS.md` — parameter status and validation gaps.
- `docs/research/model_specification_draft.md` — formulas and implementation rules.
- `tests/` — regression tests.
- `scripts/generate-replication.ts` — generated-output workflow.
- `synthetic_data/case_fleet/example_research_export.json` — legacy illustrative export; use generated v1.2 outputs as the current reference.

## Freeze Checklist

Before tagging a replication release:

1. `npm run lint`, `npm test`, and `npm run build` pass.
2. `npm run replicate` has been rerun after the last model change.
3. Paper tables match `outputs/built-in-scenarios.md`.
4. Parameter provenance has page/table references where an empirical anchor is claimed.
5. Model outputs are labeled as simulations unless backed by collected data.
