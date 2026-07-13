# Observed Rigidity Index Codebook v0.1

**Status**: design baseline approved 20 June 2026; scoring thresholds must be frozen before confirmatory analysis.

## Purpose

`observed_rigidity_index` is the primary event-level exposure for Paper 2. It measures constraints that applied when a procurement event began. It is independent of ProcuraCost's `PROCESS_RIGIDITY`, model outputs, realized lead time, cost outcomes, and the analyst's rigid/flexible label.

## Anti-Leakage Rules

1. Code exposure from contemporaneous rules, workflow configuration, approval matrices, tender files, and system records where possible.
2. Code exposure without viewing event outcomes.
3. Preserve raw evidence and component values; never retain only the aggregate index.
4. Do not choose thresholds or weights to maximize an association with an outcome.
5. Record the source of every constraint: law/regulation, organization policy, local procedure, system configuration, or ad hoc decision.

## Primary Evidence Rule

Every component value requires at least one auditable artifact or system trace contemporaneous with and applicable to the event, such as the effective policy or procedure version, workflow configuration/export, approval matrix, tender or sourcing file, timestamped system log, signed record, or an equivalent controlled source. Link each component to its source ID, effective dates, retrieval date, and location in the source.

An interview may locate evidence, explain terminology, or support a qualitative mechanism narrative, but it cannot be the sole basis for a primary ORI component even when multiple respondents agree. If no qualifying artifact or trace supports a component, code it as missing and apply the complete-six-component exclusion rule.

## Exposure Reference Time

Set `exposure_reference_at` to the exact Tier A timestamp at which need and budget were formally authorized, matching the primary cycle-time start. Score every primary ORI component from the policy, procedure, workflow configuration, approval matrix, and other constraints effective at that timestamp.

Do not revise the baseline ORI using a rule change, exception, system failure, escalation, or local adaptation that occurs after `exposure_reference_at`. Record each later change separately with timestamp, source, type, and affected component as a time-varying process descriptor for mechanism or sensitivity analysis.

For `ORI_EXCEPTION`, score only the exception route formally available at `exposure_reference_at`: who could authorize it, required evidence and approvals, permitted scope, and ex ante procedural usability. Actual exception use, bypass, noncompliance, escalation, or work-around after start is never part of ORI. Record it as a post-start mechanism or secondary outcome.

## Primary Components

Each component will receive a frozen rubric and a normalized score from 0 (least constrained) to 1 (most constrained):

| Code | Component | What is coded |
|---|---|---|
| `ORI_GATES` | Sequential gate constraint | Required gates, share that is non-waivable, and enforced sequence |
| `ORI_APPROVAL` | Approval burden | Required approval count and highest hierarchical level |
| `ORI_WAIT` | Prescribed waiting burden | Minimum required waits, kept separate from realized lead time |
| `ORI_PATH` | Path adaptability, reverse-coded | Permission to resequence, parallelize, negotiate, or choose another authorized path |
| `ORI_DOCUMENT` | Documentation and committee burden | Required documents, reviews, committees, and signatures |
| `ORI_EXCEPTION` | Exception restriction | Ex ante availability, authority, documentation, and formal usability of exception routes at `exposure_reference_at` |

Constraint source is retained as a separate descriptor and potential moderator. It is not automatically scored as more or less rigid merely because it is statutory or internal.

## Primary Score

After directional coding and normalization:

```text
observed_rigidity_index = mean(
  ORI_GATES,
  ORI_APPROVAL,
  ORI_WAIT,
  ORI_PATH,
  ORI_DOCUMENT,
  ORI_EXCEPTION
)
```

All six components have equal weight. Component rubrics and normalization bounds must be preregistered after pilot coding and before confirmatory outcome analysis.

## Missing Component Rule

All six normalized components are mandatory for the confirmatory primary ORI. Do not impute a component, average only observed components, prorate the index, or renormalize weights. If any component is missing or cannot satisfy its frozen evidence rule, the event is ineligible for the primary analysis and its complete matched pair is excluded without rematching.

A component may use a substantively defined `not_applicable` category only when the frozen rubric specifies when it applies and maps it to a prespecified component score. `Not_applicable` is not a generic substitute for missing evidence. Report it separately from missingness.

## Independent Double Coding

Two trained coders independently score all six components for every confirmatory event. Each coder remains blinded to event outcomes, matched-pair membership, and the other coder's values until both coding records are locked. Store coder ID, codebook version, evidence references, component values, aggregate ORI, and lock timestamp for each independent record.

Compute all inter-rater reliability statistics on the two locked raw records before reconciliation or adjudication. Never overwrite either raw coding record with a final resolved value.

## Reliability Gate

Before final ORI values enter matching, the two locked raw coding records must achieve:

- Absolute-agreement, single-measure `ICC(A,1) >= 0.80` for the aggregate ORI.
- Reliability `>= 0.70` for every component, using weighted kappa for ordinal rubrics and absolute-agreement `ICC(A,1)` for continuous rubrics.

Calculate the metrics over all confirmatory events, not a selected subset, and report point estimates, 95% confidence intervals, coder-specific distributions, and disagreement rates. The pass/fail gate uses the prespecified point-estimate thresholds; confidence intervals remain mandatory uncertainty reporting. High aggregate reliability cannot compensate for a component below its threshold.

### Reliability Failure Procedure

If the first confirmatory coding round fails any reliability threshold, keep outcomes and pair membership blinded and archive the failed records. Permit one remediation cycle only: retrain, appoint a new coder pair with no access to prior scores, and independently recode 100% of events from source evidence under the unchanged frozen codebook. Recalculate the complete gate once.

If the second round fails, do not adjudicate into eligibility, run matching, or report a primary effect. A substantive rubric or scoring change creates a new codebook version; all current confirmatory organizations and events become instrument-development material, and a new organization-level confirmatory holdout must begin under the revised version.

## Disagreement Adjudication

After the reliability gate passes, when the two locked coders assign different values to a component, a third trained adjudicator independently codes that disputed component from the evidence and frozen rubric. The adjudicator cannot see outcomes, matched-pair membership, coder identities, or either prior value. The adjudicator's valid rubric value becomes the final component value. Components on which the two coders agree retain that common value.

Compute the final ORI only after raw-record reliability has been calculated and all component disagreements have an auditable adjudication record. Preserve adjudicator ID, codebook version, evidence references, reason, final value, and timestamp without modifying the two original records.

## Required Reporting

- Report the aggregate index and all six component distributions.
- Report inter-rater agreement from all independently double-coded confirmatory events before resolution.
- Report the aggregate and six component reliability-gate results with 95% confidence intervals.
- Report component disagreement and adjudication rates, including the adjudicator's agreement with coder 1, coder 2, or neither.
- Report leave-one-component-out sensitivity.
- Alternative expert, factor, PCA, or learned weights are secondary sensitivity analyses only. They must be estimated without outcome optimization and cannot replace the preregistered primary index.
- Report event count, organization count, matched-pair count, missingness, and coding disagreements.
- Report missingness and rubric-defined `not_applicable` counts separately for every component.
- Report qualifying evidence type and source coverage separately for every component.
- Report post-start procedural changes separately from the baseline ORI.

## Versioning

Any rubric change creates a new codebook version. Never silently recompute previously reported results under changed rules.
