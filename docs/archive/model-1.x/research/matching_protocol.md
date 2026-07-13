# ProcuraCost Matching Protocol v0.1

**Status**: algorithmic, outcome-blind matching with balance-constrained global assignment, minimum exposure contrast, matching without replacement, mandatory provisional calipers, and a one-pair organization minimum approved 21 June 2026. Final caliper values and the powered sample-size floor remain to be frozen.

## Purpose

Create comparable within-organization pairs of real procurement events without using procurement cycle time or another outcome to choose matches.

## Eligible Input Population

Only events passing the frozen population, archival-window, evidence, and phase rules enter matching. Every ORI component must link to a qualifying artifact or system trace effective at the Tier A need-and-budget authorization timestamp; interview-only values, post-start exposure revisions, and actual exception or bypass behavior are ineligible. Every event must have two locked independent coding records for all six ORI components under the same frozen codebook, the raw-record reliability gate must pass, and every disagreement must have a complete outcome-blind adjudication record. Matching uses the final adjudicated baseline ORI; no imputed or prorated ORI enters the candidate graph. Preserve all eligible but unmatched events in the selection-flow dataset.

If the first reliability round fails, matching remains disabled during the single permitted full recoding under the unchanged codebook. A second failure ends primary matching. A codebook change invalidates the current confirmatory phase and requires a new organization-level holdout.

During batched recruitment, solver outputs are provisional and may change as complete new organization frames enter the study-level balance problem. Outcomes remain inaccessible. Freeze final pairs only after the first complete batch meeting both preregistered organization and balance-feasible pair minima, or declare the design underpowered when the registered cap is reached.

## Stage 1: Exact or Coarsened-Exact Strata

Pairs must share:

- `organization_id`.
- `spend_type` (Direct or Indirect).
- Frozen category family or preregistered coarsened category group.
- `target_country = PL` and `target_legal_regime = private_internal_procurement`.
- Upstream sourcing/contracting scope.

Technology environment and calendar period are caliper-constrained under the provisional rules below. Final values must be frozen before confirmatory matching.

## Stage 2: Outcome-Blind Nearest Neighbor

Within each eligible stratum, compute distance using only pre-outcome variables:

- Log contract value.
- Complexity.
- Urgency known when the event began.
- Supply risk.
- Strategic importance.
- Technology maturity/environment.
- Calendar-period distance.

Continuous variables must use frozen scaling rules. Do not include realized cycle time, realized cost, renegotiation, supplier performance, bypass, audit result, or another post-start outcome.

## Mandatory Calipers

A candidate pair must pass every caliper before it can become an edge in the assignment graph. The provisional pilot rules are:

- Absolute difference in natural log contract value no greater than `0.50`.
- Complexity, supply risk, and strategic importance differ by no more than one point on their frozen ordinal scales.
- Technology environment is the same or adjacent under a preregistered ordered taxonomy.
- Binding-commitment dates are no more than 12 calendar months apart.

Urgency and the remaining frozen pre-outcome variables still contribute to covariate distance even when they do not have a mandatory provisional caliper. Pilot work may revise the numerical calipers only from outcome-blind overlap, candidate-edge yield, and covariate-balance diagnostics. Freeze the final values before confirmatory recruitment and do not relax them after outcome access.

## Expert Review

An expert may review algorithmic pairs using outcome-blind descriptors and flag a pair as substantively impossible. Every rejection requires a standardized reason and independent audit. The expert cannot manually substitute a preferred match. The algorithm is rerun under the frozen rules after an eligible rejection.

## Minimum Exposure Contrast

Define:

```text
exposure_contrast = abs(ORI_event_a - ORI_event_b)
```

A pair is eligible only when `exposure_contrast >= min_exposure_contrast`. The provisional threshold is `0.20` on the 0–1 index. The final threshold must be frozen after pilot assessment of outcome-blind inter-rater reliability, measurement error, index distribution, and feasible overlap. Cycle time and all other outcomes are unavailable when the threshold is selected.

Report the number of candidate pairs lost at each tested outcome-blind threshold. Do not lower the frozen threshold after outcome access to increase sample size.

## Replacement Rule

Primary matching is without replacement. Each `procurement_event_id` may appear in at most one primary `matched_pair_id`. Leave an event unmatched when no eligible unused counterpart remains; do not duplicate a strong reference event to increase pair count.

Matching with replacement may be explored only as a labeled sensitivity analysis with uncertainty that accounts for repeated events. It cannot replace the frozen primary pair set after outcomes are known.

## Global Assignment Rule

Across the disjoint candidate-edge sets created by all exact/coarsened strata, solve one study-level assignment problem:

1. Build a graph containing only within-stratum candidate edges that satisfy eligibility, exposure-contrast, and frozen caliper rules; cross-stratum edges remain prohibited.
2. Orient every candidate edge from its higher-ORI event to its lower-ORI event.
3. Freeze each balance denominator from the complete eligible pre-match pool under the preregistered scaling convention.
4. Find the maximum-cardinality matching without replacement subject to all global `|SMD| <= 0.10` constraints.
5. Among balance-feasible maximum-cardinality solutions, select the matching with minimum total covariate distance.
6. If multiple solutions remain exactly tied, resolve deterministically using the lexicographic order of cryptographic hashes of stable pseudonymous event IDs.

This is a balance-constrained minimum-weight maximum-cardinality matching problem, not a record-order-dependent greedy nearest-neighbor pass. Hashes may break exact ties only; they cannot alter edge eligibility, balance feasibility, or substantive distance.

## Organization Inclusion Rule

An organization enters the confirmatory primary analysis when its complete frozen sampling frame yields at least one final eligible pair with all primary-analysis evidence requirements met. There is no requirement for three or another fixed number of pairs per organization.

Retain every additional eligible no-replacement pair produced by the frozen algorithm. Report the distribution of pairs per organization and use organization-aware uncertainty. Organizations yielding no final pair remain in the recruitment and selection flow with a coded reason; do not extend their archival windows or relax matching rules to admit them.

## Global Balance Gate

Before outcome unblinding, the complete matched sample must achieve absolute standardized mean difference `|SMD| <= 0.10` for every frozen pre-outcome matching covariate. For categorical variables, assess each preregistered indicator level separately. The solver enforces these constraints using denominators frozen from the complete eligible pre-match pool. Archive pre-match and post-match values and the denominator/scaling convention used for every SMD.

Apply this gate to the study-level matched sample, not as a reason to remove individual organizations selectively. If no balance-feasible solution reaches the preregistered sample-size floor established by the power analysis, outcomes remain blinded and the matched design is declared inadequate for the primary effect. Do not tighten rules iteratively, search organization exclusions, or inspect outcomes to manufacture a feasible solution.

## Post-Freeze Outcome Invalidation

If either event in a frozen pair later fails a preregistered Tier A endpoint or outcome-validity rule, exclude the entire pair. Do not impute the primary outcome, rematch the surviving event, or activate a reserve partner after pair freeze. Record the failure reason and stage in the attrition flow.

Recalculate the balance gate and powered organization/pair floors on the surviving frozen pairs. If either requirement fails, do not report the primary effect. Prospective power simulation and recruitment must include a conservative allowance for this pair-level attrition.

## Audit Requirements

- Version and hash the matching code and configuration.
- Record solver name/version, graph size, objective values, and tie-break rule.
- Archive the balance constraints, frozen denominators, feasibility status, and maximum feasible cardinality.
- Preserve candidate distances, selected match, rejected match, and unmatched status.
- Enforce and audit one primary pair assignment per event.
- Record `matched_pair_id`, algorithm version, distance, stratum, and rejection reason.
- Record `exposure_contrast`, threshold version, and contrast-eligibility status.
- Verify two locked outcome-blind coding records per event and preserve both raw ORI vectors.
- Archive aggregate `ICC(A,1)`, component reliability statistics, confidence intervals, and the measurement-gate result before matching.
- Archive any failed first round, new-coder training and independence records, the one permitted recoding, and the final pass/fail decision.
- Verify that every component disagreement has a separate blinded adjudication record before calculating the final ORI used for matching.
- Verify a source ID, effective period, retrieval date, and source location for every ORI component.
- Verify that every source was effective at `exposure_reference_at` and that post-start changes did not alter baseline ORI.
- Record every caliper value, pair-level difference, and pass/fail result.
- Publish pre-match and post-match SMDs and the global balance-gate result without using outcome balance as a criterion.
- Publish post-freeze pair attrition, standardized invalidation reasons, and the surviving-sample balance and power checks.
- Keep analysts performing matching blinded to outcomes until pairs and exclusions are frozen.

## Open Decisions Before Freeze

- Conservative nuisance-parameter scenarios and the resulting organization-count and pair-count floors.
- Final pilot-derived caliper values.
