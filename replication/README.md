# ProcuraCost Replication Package

**Model version**: 2.1.0
**Evidence status**: deterministic simulation with illustrative inputs; external calibration pending

This package supports computational reproduction of ProcuraCost outputs. It does not establish that the
parameters are empirically valid or that modeled differentials were realized by any named organization.

## Reproduce

From the repository root:

```bash
npm test
npm run replicate
```

`npm test` verifies mandatory legal waits, annual amendment-frequency units, the
break-even identity, multiplier bounds, input sanitization, and deterministic optimizer behavior.

`npm run replicate` regenerates:

- `outputs/built-in-scenarios.json` — complete inputs, outputs, source/assumption annotations, and calculation traces.
- `outputs/built-in-scenarios.csv` — compact scenario summary.
- `outputs/built-in-scenarios.md` — paper-readable summary table.

## Export Schema

Calculator JSON exports include:

- `modelVersion` and separate `appVersion`
- Full `ProcurementInputs`, including contract duration, `spendType`, and `processPhase`
- Full active multiplier vector
- Rigid and flexible days
- Rigid and flexible bypass probabilities
- Rigid and flexible cost breakdowns
- Calculation trace with sanitized inputs, annual formal-amendment frequencies and expected counts, scenario rates, and component costs
- Central break-even daily cost of inaction
- Source or assumption annotations

## Evidence Boundary

- Built-in scenarios are illustrative.
- Company examples motivate archetypes only.
- Financial inputs are not organization data.
- Reproducing a number proves code-path consistency, not empirical validity.
- Model v2.1 separates workflow, competition, contract rigidity, TCO capture, and bypass controls.
- TCO and bypass are broad scenario ranges; exports include low/central/high delta and whether the range crosses zero.

## Files

- `docs/MODEL_PARAMETERS.md` — parameter status and validation gaps.
- `docs/research/model_specification_draft.md` — formulas and implementation rules.
- `tests/` — regression tests.
- `scripts/generate-replication.ts` — generated-output workflow.

## Freeze Checklist

Before tagging a replication release:

1. `npm run lint`, `npm test`, and `npm run build` pass.
2. `npm run replicate` has been rerun after the last model change.
3. Paper tables match `outputs/built-in-scenarios.md`.
4. Parameter provenance has page/table references where an empirical anchor is claimed.
5. Model outputs are labeled as simulations unless backed by collected data.
