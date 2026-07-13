# Procurement Cycle Outcome Codebook v0.2

**Status**: primary clock, pause treatment, timestamp-quality rules, sub-day duration handling, and narrow external-hold adjustment approved through 22 June 2026.

## Primary Outcome

`observed_procurement_cycle_days` is the primary Paper 2 outcome.

```text
cycle_start_at = timestamp when both the procurement need and required budget are formally authorized
cycle_end_at   = timestamp of the first binding external commitment to the selected supplier

observed_procurement_cycle_days = elapsed_calendar_time(cycle_start_at, cycle_end_at)
```

Calculate elapsed duration at full timestamp precision:

```text
observed_procurement_cycle_days = (cycle_end_at - cycle_start_at in seconds) / 86400
```

Retain every strictly positive sub-day duration as a fractional day. Do not round, ceiling, floor, or replace it with 1 day before transformation or analysis. A zero or negative duration fails the primary outcome-validity rule and excludes the complete pair under the post-freeze rule. Round only displayed values while preserving full-precision analysis data.

Primary elapsed time includes weekends, holidays, internal holds, external holds, mandatory waits, supplier delays, and system downtime. No pause is subtracted from the primary outcome.

Examples of `cycle_end_at` include a signed contract or an authorized/released purchase order where that instrument creates the binding commitment. A non-binding recommendation, provisional ranking, or internal approval is not the endpoint. Legal meaning must be established from the event record and applicable regime rather than inferred from the label alone.

## Required Raw Fields

- `need_approved_at`
- `budget_authorized_at`
- `cycle_start_at` and the rule used to select it
- `binding_commitment_at`
- `cycle_end_at` and document type
- Timestamp source, system, timezone, precision, and extraction date
- Any correction, reconstruction, or respondent-supplied timestamp flag
- For every pause: `pause_start_at`, `pause_end_at`, initiator, reason code, evidence source, and free-text note

Retain raw timestamps. Never store only a rounded duration.

## Timestamp Evidence Tiers

| Tier | Evidence | Use |
|---|---|---|
| `A` | Exact timestamp from a system log, signed document, released PO, or equivalent auditable record | Confirmatory primary analysis |
| `B` | Auditable date or bounded interval without exact time | Secondary interval-censored analysis; never replace with a midpoint |
| `C` | Respondent recall or analyst reconstruction without auditable timestamp evidence | Descriptive and secondary analyses only |
| `D` | Value filled from ProcuraCost, a process template, or model-based point imputation | Prohibited as an observed outcome |

Both endpoints must be Tier A for an event to enter the confirmatory continuous-time analysis. Both events must qualify for a matched pair to enter the primary pair analysis. Retain excluded events for construct calibration and prespecified secondary analyses, and report exclusions by reason.

Do not use single-value imputation for a missing start or end. Preserve known lower and upper bounds for Tier B records and use methods that support interval censoring.

After pair freeze, later failure of either event's Tier A endpoint or another preregistered primary-outcome validity check removes the complete pair. Do not impute the primary outcome, rematch the surviving event, or activate a reserve partner. Report the reason and attrition stage, then recheck the surviving sample against the frozen balance and power gates.

## Secondary Durations

- `pre_authorization_days`: first documented need to `cycle_start_at`.
- `post_commitment_to_first_use_days`: `cycle_end_at` to first usable delivery or go-live.
- `end_to_end_days`: first documented need to first usable delivery or go-live.
- Business-day versions may be reported as sensitivity analyses; calendar elapsed time is primary.
- `net_cycle_days` subtracts only the narrowly eligible external-hold intervals defined below. It is always secondary.

## Pause Coding

Code every documented pause without deciding whether it is convenient to exclude:

- Organization procurement or approval hold.
- Business/requestor hold.
- Supplier-requested or supplier-caused hold.
- Statutory or regulatory waiting period.
- External authority, court, or protest suspension.
- Force majeure, market disruption, or documented system outage.
- Unknown or disputed cause.

Mandatory waits and organization-caused holds remain part of both primary elapsed time and any procurement-attributable decomposition. Never classify a hold based on whether removing it strengthens the result.

## Eligible External Holds for `net_cycle_days`

An interval may be subtracted only when exact auditable start and end timestamps establish one of these frozen categories and evidence shows that neither the focal organization nor the supplier caused it:

- `EXT_BINDING_SUSPENSION`: a binding court, regulator, or public-authority suspension unrelated to conduct or noncompliance by the organization or supplier.
- `EXT_FORCE_MAJEURE`: a documented force-majeure event that made procurement activity impossible during the coded interval.
- `EXT_CRITICAL_INFRASTRUCTURE`: an independently verified outage or blockade of shared external infrastructure outside both parties' control; an outage of either party's own systems is ineligible.

Do not subtract internal procurement/approval/requestor holds, supplier delay, negotiation, missing information, ordinary market or capacity constraints, shipping/logistics delay, priority changes, mandatory waiting periods, expected seasonal disruption, either party's system downtime, disputed causation, or unknown cause.

Clip eligible intervals to `[cycle_start_at, cycle_end_at]`, merge overlaps, and subtract the duration of their union once:

```text
net_cycle_days = observed_procurement_cycle_days
                 - duration(union(eligible_external_hold_intervals))
```

Require `0 <= net_cycle_days <= observed_procurement_cycle_days`. A hold with Tier B or C bounds remains in primary elapsed time and may be described separately, but it is not subtracted from the point-valued secondary outcome.

## Separation From Exposure

Prescribed minimum waits belong to the rigidity exposure codebook. Realized elapsed time belongs here as an outcome. Do not copy modeled process days or process-template durations into observed outcome fields.

## Open Rules Before Freeze

- Timezone normalization for cross-country records.

Any rule change creates a new codebook version and requires regeneration of derived outcomes.
