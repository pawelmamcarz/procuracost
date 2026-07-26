# Built-in Scenario Outputs (Model 2.2.2)

> Deterministic model outputs under illustrative inputs. These are not empirical estimates of realized organizational effects.

ΔC is reported decomposed, because the three buckets have different time bases and very
different evidential standing:

- **Δ process** — staff, administration, selection and bypass, per procurement event.
- **Δ delay** — (formal days − adaptive days) × the daily cost of inaction the *user* supplies.
  This is an accounting identity between a template and an input, not a modeled effect.
- **Δ lifecycle** — expected formal amendments and foregone lifecycle value, over the contract life.

In the 7 of 10 scenarios where the paths differ in duration, Δ delay carries 68.3–99.6% of |ΔC|.
Excluding that identity, the formal path is cheaper on process cost in 7 of 10 scenarios (fleet, logistics, production, pipe_vs_field, capex_investment, governance_control, discovery_rd).

The scenario range covers **two axes**:

- **Evidence** — the five literature-facing scalars (discretion premium, rigidity slope,
  TCO pool, two bypass rates).
- **Structural** — the daily cost of inaction (×0.25 … ×4) and non-mandatory step
  durations (×0.7 … ×1.3). Statutory PZP waits are invariant under both.

Through model 2.2.0 only the evidence axis was published. On that axis alone, 5 of 10 scenarios cross zero; with the structural axis included, 10 of 10 do. The narrow envelope was an artefact of bracketing the small quantities and holding fixed the two that carry the result.

| Scenario | Context | Formal days | Adaptive days | Δ process (PLN) | Δ delay (PLN) | Δ lifecycle (PLN) | Δ total (PLN) | Delay share | Evidence axis (PLN) | Structural axis (PLN) | Combined range (PLN) | Crosses zero | Width driven by | Break-even status |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|:---:|---|---|
| fleet | neutral × neutral | 44 | 24 | -2454 | 100000 | 6535 | 104081 | 96.1% | 46046 – 239534 | 18718 – 526945 | -39318 – 662398 | true | structural | formal_costlier_at_zero_delay |
| erp | neutral × neutral | 51 | 28 | 8735 | 188600 | 3364 | 200699 | 94% | 158635 – 305836 | 40324 – 997600 | -1741 – 1102736 | true | structural | formal_costlier_at_zero_delay |
| logistics | neutral × neutral | 44 | 24 | -8913 | 36000 | 25642 | 52729 | 68.3% | -55313 – 292755 | 19943 – 207015 | -88099 – 447041 | true | evidence | formal_costlier_at_zero_delay |
| production | neutral × neutral | 62 | 34 | -4961 | 1400000 | 11106 | 1406145 | 99.6% | 1146639 – 1980229 | 243993 – 7293296 | -15513 – 7867381 | true | structural | formal_costlier_at_zero_delay |
| pipe_vs_field | neutral × neutral | 87 | 71 | -3338 | 160000 | 12821 | 169483 | 94.4% | 94562 – 340634 | 33985 – 844982 | -40936 – 1016133 | true | structural | formal_costlier_at_zero_delay |
| catalog | neutral × neutral | 2 | 2 | 0 | 0 | 0 | 0 | 0% | -650 – 1498 | 0 – 0 | -650 – 1498 | true | evidence | no_day_difference |
| mrp | neutral × neutral | 1 | 1 | 0 | 0 | 30 | 30 | 0% | -3250 – 7531 | 30 – 30 | -3250 – 7531 | true | evidence | no_day_difference |
| capex_investment | neutral × neutral | 120 | 84 | -28424 | 493200 | 149889 | 614665 | 80.2% | 261176 – 1208036 | 203342 – 2690538 | -150147 – 3283909 | true | structural | formal_costlier_at_zero_delay |
| governance_control | indirect × downstream | 14 | 14 | -6750 | 0 | 185 | -6565 | 0% | -42625 – 70502 | -6565 – -6565 | -42625 – 70502 | true | evidence | no_day_difference |
| discovery_rd | neutral × neutral | 34 | 47 | -35844 | -71500 | 10684 | -96660 | 74% | -142204 – 53133 | -403177 – -31455 | -448721 – 118337 | true | structural | adaptive_costlier_at_zero_delay |
