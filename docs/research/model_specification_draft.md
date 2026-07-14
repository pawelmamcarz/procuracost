# Model Specification 2.1

The canonical specification is [`docs/MODEL_PARAMETERS.md`](../MODEL_PARAMETERS.md),
and the research argument is in [`RESEARCH.md`](../../RESEARCH.md). This file no
longer duplicates equations.

The model compares two lawful designs for the same purchase:

- **F — formal/sequential:** stronger ex-ante standardisation and competition;
- **A — adaptive/compliant:** iterative execution within the same policy boundary.

For each path `p`:

`C_p = C_staff + C_admin + days × daily_inaction_cost + selection_loss + duration × annual_amendment_frequency × amendment_cost + TCO_loss + bypass_exposure`.

The reported difference is `ΔC = C_F − C_A`. Positive favours the adaptive path;
negative favours the formal path. No sign is imposed. Selection competition,
contract rigidity, workflow timing, technology and TCO capture are separate
inputs. The legacy `PROCESS_RIGIDITY` scalar remains only for compatibility and
is not a causal coefficient.

Every result includes a broad low/central/high scenario range. It is a
deterministic sensitivity envelope, not a confidence interval. TCO (0% centrally,
stress-tested to 15%) and
bypass (1–30%) are assumptions. Szucs and Beuve estimates are transferred only
to their matching mechanisms with their original population and identification
caveats.

Mandatory PZP waiting periods are identical in both paths. The result also reports
the central daily-cost-of-inaction threshold at which the time advantage changes
the preferred path.
