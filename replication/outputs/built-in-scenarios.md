# Built-in Scenario Outputs (Model 2.2.0)

> Deterministic model outputs under illustrative inputs. These are not empirical estimates of realized organizational effects.

ΔC is reported decomposed, because the three buckets have different time bases and very
different evidential standing:

- **Δ process** — staff, administration, selection and bypass, per procurement event.
- **Δ delay** — (formal days − adaptive days) × the daily cost of inaction the *user* supplies.
  This is an accounting identity between a template and an input, not a modeled effect.
- **Δ lifecycle** — expected formal amendments and foregone lifecycle value, over the contract life.

In the 6 of 9 scenarios where the paths differ in duration, Δ delay carries 77.7–99.5% of |ΔC|.
Excluding that identity, the formal path is cheaper on process cost in 6 of 9 scenarios (fleet, logistics, production, pipe_vs_field, capex_investment, governance_control).

| Scenario | Context | Formal days | Adaptive days | Δ process (PLN) | Δ delay (PLN) | Δ lifecycle (PLN) | Δ total (PLN) | Delay share | Scenario range (PLN) | Crosses zero | Break-even status |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|:---:|---|
| fleet | neutral × neutral | 44 | 24 | -2454 | 100000 | 6930 | 104476 | 95.7% | 55796 – 219746 | false | formal_costlier_at_zero_delay |
| erp | neutral × neutral | 51 | 28 | 8735 | 345000 | 3465 | 357200 | 96.6% | 318935 – 455360 | false | formal_costlier_at_zero_delay |
| logistics | neutral × neutral | 44 | 24 | -8913 | 400000 | 27720 | 418807 | 95.5% | 324287 – 629287 | false | formal_costlier_at_zero_delay |
| production | neutral × neutral | 62 | 34 | -4961 | 1400000 | 11550 | 1406589 | 99.5% | 1146639 – 1981989 | false | formal_costlier_at_zero_delay |
| pipe_vs_field | neutral × neutral | 87 | 71 | -3338 | 160000 | 13860 | 170522 | 93.8% | 106262 – 318762 | false | formal_costlier_at_zero_delay |
| catalog | neutral × neutral | 2 | 2 | 0 | 0 | 0 | 0 | 0% | -130 – 340 | true | no_day_difference |
| mrp | neutral × neutral | 1 | 1 | 0 | 0 | 31 | 31 | 0% | -650 – 1742 | true | no_day_difference |
| capex_investment | neutral × neutral | 60 | 42 | -30224 | 540000 | 184800 | 694576 | 77.7% | 345176 – 1222076 | false | formal_costlier_at_zero_delay |
| governance_control | indirect × downstream | 14 | 14 | -6750 | 0 | 193 | -6558 | 0% | -16625 – 12513 | true | no_day_difference |
