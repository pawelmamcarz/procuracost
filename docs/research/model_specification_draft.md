# Model Specification 2.0

The canonical specification is [`docs/MODEL_PARAMETERS.md`](../MODEL_PARAMETERS.md),
and the research argument is in [`RESEARCH.md`](../../RESEARCH.md). This file no
longer duplicates equations.

The model compares two lawful designs for the same purchase:

- **F — formal/sequential:** stronger ex-ante standardisation and competition;
- **A — adaptive/compliant:** iterative execution within the same policy boundary.

For each path `p`:

`C_p = C_time + C_admin + C_delay + C_selection + C_reneg + C_TCO + C_bypass`.

The reported difference is `ΔC = C_F − C_A`. Positive favours the adaptive path;
negative favours the formal path. No sign is imposed. Selection competition,
contract rigidity, workflow timing, technology and TCO capture are separate
inputs. The legacy `PROCESS_RIGIDITY` scalar remains only for compatibility and
is not a causal coefficient.

Every result includes a broad low/central/high scenario range. It is a
deterministic sensitivity envelope, not a confidence interval. TCO (0–15%) and
bypass (1–30%) are assumptions. Szucs and Beuve estimates are transferred only
to their matching mechanisms with their original population and identification
caveats.
