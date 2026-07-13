# ProcuraCost Statistical Analysis Plan v0.1

**Status**: primary estimand, unadjusted OLS pair-fixed-effects specification with organization-clustered `CR2`, minimum substantively important effect, 90% target power with two-sided `alpha = 0.05`, and simulation-based sample-size method approved 21 June 2026; the final sample-size floor remains to be frozen before confirmatory analysis.

## Analysis Population

The confirmatory primary population contains within-organization matched pairs in which both events have:

- Membership in the organization's complete frozen-window sampling frame.
- `study_phase = confirmatory`; no pilot-development event is eligible.
- The organization is absent from the pilot-development organization registry.
- Event has `target_country = PL` and `target_legal_regime = private_internal_procurement`.
- Event is an Upstream supplier-selection or contracting decision, not routine Downstream execution.
- Focal event is not subject to PZP, concession law, or another mandatory public/donor procurement regime.
- A frozen `observed_rigidity_index` under the same codebook version.
- Complete valid values for all six frozen ORI components; no imputed or prorated index.
- A qualifying contemporaneous artifact or system trace linked to every ORI component; no interview-only primary values.
- Baseline ORI scored from rules effective at the Tier A need-and-budget authorization timestamp.
- Two locked independent outcome-blind ORI coding records completed before resolution and matching.
- A separate outcome-blind adjudication record for every component disagreement and a complete final ORI.
- Passed raw-record reliability gate: aggregate `ICC(A,1) >= 0.80` and every component reliability `>= 0.70`.
- Tier A start and end timestamps.
- A positive elapsed cycle duration.
- A documented `matched_pair_id` and matching fields.
- Exposure contrast meets the frozen `min_exposure_contrast` rule.

Report event, pair, and organization counts separately. Never treat events from one organization as independent organizations.

An organization contributes to the primary analysis when it yields at least one final eligible pair. Keep every additional pair created by the frozen no-replacement algorithm, report the pairs-per-organization distribution, and account for within-organization dependence. Organizations yielding zero pairs remain in the selection flow and cannot be admitted by extending the archival window or relaxing rules.

Pilot-development events remain excluded even if they are later recoded. They may inform variance and feasibility planning but cannot contribute to the confirmatory coefficient.

Organizations used for instrument development are also excluded from the confirmatory primary population. Report any later analysis involving pilot organizations separately as exploratory or transportability work.

The first confirmatory coefficient is specific to strategic private-sector procurement in Poland outside PZP. Do not pool public, PZP, concession, Downstream, or cross-country events in the primary model. Analyses outside this population are separate replication or transportability studies.

Compute `observed_procurement_cycle_days = elapsed_seconds / 86400` from full-precision endpoints. Keep strictly positive sub-day values unchanged for log transformation and estimation. Do not round or clamp analysis values. Zero or negative duration is an invalid outcome and removes the complete pair under the frozen attrition rule.

## Sampling and Selection

- Freeze one `extraction_cutoff_at`; use the preceding 24 calendar months for every organization.
- Determine window membership by `binding_commitment_at`, not by an organization-selected date.
- Export all qualifying events using a versioned source query.
- Determine eligibility and matching from pre-outcome fields without CPO case nomination.
- Preserve every frame record with inclusion, exclusion, and matching status.
- Publish counts for the source universe, eligible events, matched events, Tier A pairs, and final analysis.
- Expert-nominated examples are ineligible for the confirmatory primary coefficient unless they independently appear in the complete sampling frame and pass the same frozen process.
- Do not lengthen the window when an organization has too few events. Record it as ineligible or unmatched.
- Count events still open at cutoff and report completed-event selection as a limitation.

Matching follows `docs/research/matching_protocol.md`: exact/coarsened strata followed by outcome-blind nearest neighbor on frozen pre-outcome covariates. Freeze pair IDs, distances, exclusions, and balance diagnostics before outcome access.

The provisional exposure-contrast threshold is 0.20. Its final value is selected from outcome-blind pilot reliability and overlap diagnostics and then preregistered. Do not modify it after confirmatory outcome access.

Candidate edges must pass every frozen caliper before assignment. Provisional limits are absolute natural-log value difference `<= 0.50`; complexity, supply risk, and strategic importance differences `<= 1` ordinal point; same or adjacent technology environment; and binding-commitment dates within 12 calendar months. Final values may change only from outcome-blind pilot overlap, edge-yield, and balance diagnostics and must be preregistered before confirmatory recruitment.

Primary pairs are formed without replacement. Assert that every event occurs in zero or one primary pair before unblinding outcomes. Repeated-event matching is a separate sensitivity analysis only.

Pair assignment uses one study-level, balance-constrained minimum-weight maximum-cardinality matching problem across all strata; candidate edges remain restricted to events in the same stratum. Orient candidate edges from higher to lower ORI, freeze SMD denominators from the complete eligible pre-match pool, maximize cardinality subject to every `|SMD| <= 0.10` constraint, and then minimize total distance. Archive graph eligibility, balance constraints, denominators, feasibility, total distance, cardinality, solver version, and deterministic hash-based tie resolution before unblinding outcomes.

Before outcome unblinding, the complete matched sample must satisfy `|SMD| <= 0.10` for every frozen pre-outcome matching covariate. Evaluate categorical variables through their preregistered indicator levels and archive the scaling convention, pre-match SMDs, post-match SMDs, and pass/fail result. Do not remove individual organizations selectively to improve balance. If no feasible solution reaches the preregistered powered sample-size floor, do not unblind outcomes or report a primary effect.

After pair freeze, a failed Tier A endpoint or other preregistered primary-outcome validity check in either event removes the complete pair. Never impute the primary outcome, rematch the surviving event, or use a reserve partner. Archive the reason and timing. Recalculate the global balance gate and powered organization/pair floors on the surviving frozen pairs; failure of either condition prevents the primary test.

A missing or evidence-invalid ORI component makes an event ineligible for the primary analysis. Require all six components, exclude the full pair, and do not impute, prorate, renormalize weights, or rematch. Treat only codebook-defined and prescored `not_applicable` categories as observed values, and report them separately from missing components.

Each component must cite an event-applicable artifact or system trace, including source ID, effective period, retrieval date, and exact source location. Interviews may clarify evidence but cannot supply the primary value alone. Treat interview-only or temporally inapplicable support as missing under the full-pair exclusion rule.

Set `exposure_reference_at` equal to the primary cycle start: exact Tier A formal authorization of need and budget. Score the baseline ORI only from constraints effective then. Preserve every later procedural change with timestamp and source as a separate descriptor; do not use post-start information to recode baseline exposure.

Code `ORI_EXCEPTION` only from the exception route available at baseline, including authority, evidence, approval, scope, and formal usability. Actual use, bypass, noncompliance, escalation, and work-arounds are post-start variables. Exclude them from ORI, matching, and primary covariate adjustment; report them as mechanisms or secondary outcomes.

Mechanism analyses report event timing, frequencies, pair-level contrasts, and associations of post-start exception use, bypass, escalation, and work-arounds with baseline ORI and outcomes. Do not estimate natural direct or indirect effects, use causal-mediation labels, or interpret adjustment for these post-treatment variables as a direct ORI effect. Any model including them is explicitly descriptive.

Every confirmatory event is independently coded by two trained raters blinded to outcomes, pair membership, and each other's values. Lock and retain both raw six-component vectors, evidence references, coder IDs, codebook versions, and timestamps. Compute reliability on these raw records before resolution; do not estimate agreement from a subset or from adjudicated scores.

A third trained adjudicator independently scores every disputed component from source evidence without seeing outcomes, pair membership, coder identities, or their prior values. Use the adjudicator's valid rubric score as final; retain the common value where coders agree. Complete and audit all adjudications before calculating the final ORI or running matching. Never overwrite the two raw coding records.

Before matching, require aggregate raw-score absolute-agreement `ICC(A,1) >= 0.80` and reliability `>= 0.70` for each component, measured with weighted kappa for ordinal rubrics and `ICC(A,1)` for continuous rubrics. Calculate over all confirmatory events and report 95% confidence intervals and coder distributions. A failed component fails the complete measurement gate regardless of aggregate ICC.

After a first failed gate, permit one full outcome-blind recoding by a newly trained coder pair under the identical codebook; they cannot access prior values. Archive both rounds and recalculate reliability once. A second failure prevents adjudication into eligibility, matching, and the primary test. Any codebook change restarts confirmatory work with new holdout organizations; the current sample becomes developmental only.

## Primary Exposure and Outcome

- Exposure: continuous `observed_rigidity_index` from 0 to 1.
- Outcome: `observed_procurement_cycle_days`, including all elapsed calendar time.
- Binary rigid/flexible labels are descriptive only.

## Primary Estimand

The primary estimand is the relative difference in procurement cycle time associated with a 0.10 increase in observed rigidity within matched pairs.

```text
log(cycle_days_event) = matched_pair_fixed_effect + beta * observed_rigidity_index + error

reported_effect_10pp = 100 * (exp(0.10 * beta) - 1)
```

Interpretation: the estimated percentage difference in cycle time associated with a 0.10 higher rigidity index among otherwise matched events. This is an associational estimand unless a later design supplies credible causal identification.

## Minimum Substantively Important Effect

Power the confirmatory design for a 10% difference in cycle time per `+0.10` ORI:

```text
beta_MSI = ln(1.10) / 0.10 = 0.9531
effect_at_ORI_contrast_0.20 = 100 * (exp(0.20 * beta_MSI) - 1) = 21%
```

This threshold is a prospective decision criterion, not an estimate from pilot data or the ProcuraCost simulation model. Report corresponding absolute-day differences at representative baseline durations for interpretation, but use the log-scale threshold in power calculations.

The primary test is two-sided with `alpha = 0.05`. The prospective simulation must demonstrate at least 90% power for `beta_MSI` under the preregistered conservative nuisance-parameter scenario. A positive association is theoretically expected, but an association in the opposite direction is not excluded by the inferential procedure.

## Pilot Analysis

- Show each pair's exposure difference, raw cycle-time difference, and cycle-time ratio.
- Summarize distributions and coding feasibility.
- Do not present p-values, significance claims, or a definitive effect estimate from the pilot.
- Use pilot variance and attrition to plan the confirmatory sample.
- Report coding reliability, timestamp yield, match eligibility, missingness, and respondent burden as the pilot's primary outputs.
- Do not describe the pilot as an effect-estimation study or empirical validation of ProcuraCost.

## Confirmatory Analysis Requirements

- Ordinary least squares on log cycle time with matched-pair fixed effects and the continuous ORI exposure.
- Unit analysis weight for every matched event; no inverse organization-size or pair-count weights in the primary model.
- Bias-reduced `CR2` variance clustered by organization with Satterthwaite degrees of freedom.
- A two-sided `alpha = 0.05` test and 95% confidence interval for the transformed 10-percentage-point ORI effect.
- One common ORI coefficient across Direct and Indirect events; every matched pair remains exact on `spend_type`.
- A linear ORI term on the log-cycle-time scale.
- No additional matching covariates in the primary outcome regression.
- Frozen exclusions, codebooks, and transformation rules.
- No stepwise selection, outcome-optimized matching, or replacement of missing outcomes with model values.
- Report absolute days alongside the relative effect for interpretation.

Wild cluster bootstrap-t inference at organization level and a preregistered multilevel model are sensitivity analyses. They cannot replace the `CR2` result based on statistical significance or effect direction.

A separate covariate-adjusted sensitivity model adds the complete frozen set of non-collinear, event-level matching covariates that vary within pairs: log contract value, complexity, urgency, supply risk, strategic importance, technology environment, and calendar period. Do not select or remove these terms using outcome associations, p-values, fit statistics, or effect movement. Exact stratum variables and pair-constant terms are absorbed by pair fixed effects.

The unweighted primary model targets the association across matched procurement events in the sampled organizations. Organizations with more eligible no-replacement pairs contribute more observations to the coefficient; organization-clustered `CR2` changes uncertainty, not point-estimate weights. Report an equal-total-organization-weight sensitivity, where events within organization `g` share total weight 1, and leave-one-organization-out estimates for every organization. Neither sensitivity can replace the primary estimate based on its magnitude or significance.

Prespecify an `ORI × spend_type` interaction and Direct/Indirect stratum-specific estimates as heterogeneity analyses. These do not create co-primary estimands. A stratum-specific confirmatory claim requires that the stratum independently meet a preregistered power requirement; otherwise report its estimate and interval as exploratory.

Assess functional-form sensitivity with a restricted cubic spline containing three knots at the 10th, 50th, and 90th percentiles of the matched-sample ORI distribution. Compute and freeze these exposure-only locations before outcome unblinding. Plot the fitted association only over observed ORI support, report uncertainty, and do not vary knot number or placement using outcome fit, p-values, or effect movement.

Confirmatory sample-size planning prioritizes the number of independent organizations. It does not require three pairs per organization, because that restriction would change the target population toward organizations with unusually large or mature procurement archives.

## Prospective Power Simulation

Determine the confirmatory sample-size floor by simulating the frozen primary estimator under the planned organization-to-pair structure. The simulation must represent:

- Unequal eligible pair counts per organization.
- The preregistered ORI distribution and minimum within-pair contrast.
- Variance of log cycle time and within-organization dependence.
- Tier A timestamp yield, matching yield, missingness, and recruitment attrition.
- Component-level qualifying artifact/system-evidence yield.
- Whole-pair attrition from missing or invalid ORI components.
- Post-freeze whole-pair attrition from failed outcome validity checks.
- The selected small-cluster correction or multilevel inference procedure.
- Failure to obtain a powered balance-feasible matching solution.
- The primary pair-fixed-effects OLS estimator with organization-clustered `CR2` and Satterthwaite inference.

Pilot data may inform nuisance-parameter ranges and feasibility yields only. Use the frozen 10% per `+0.10` ORI effect in the primary power calculation, not the pilot point estimate. Because a 3–4-organization pilot gives unstable variance and correlation estimates, use conservative parameter values or ranges rather than treating pilot estimates as known.

Archive executable simulation code, random seeds, parameter scenarios, Monte Carlo error, and the power curve over candidate organization and pair counts. Before confirmatory recruitment, preregister the minimum numbers of organizations and balance-feasible pairs required for the primary analysis. Do not replace these floors with a convenience target.

Select the smallest organization/pair design that achieves at least 90% power under the frozen conservative scenario at two-sided `alpha = 0.05`. Report power under the full preregistered nuisance-parameter grid rather than only the most favorable case.

## Outcome-Blind Recruitment Stopping

Before recruitment, preregister batch size/definition, invitation order, the minimum independent-organization count, the minimum balance-feasible pair count, and the maximum organization/time/resource cap. Process complete sampling frames for every organization in each started batch.

Construct the eligible-organization frame from objective pre-recruitment fields, archive its provenance and keyed hash, and stratify at minimum by sector and organization size. Freeze stratum definitions, allocation, random seed, and within-stratum invitation order in the public registration. Do not use known policy rigidity, procurement outcomes, researcher relationships, or anticipated cooperation to order the frame.

Log every invitation, contact attempt, eligibility failure, controlled-group exclusion, refusal, nonresponse, agreement, and completed extraction. Replace a refusal or nonresponse only with the next organization in the same frozen stratum order. Report frame undercoverage and deviations; do not insert an off-list convenience organization without a registered new-study amendment.

For every framed organization, retain lawfully available sector, size, region, stratum, invitation batch/order, contact history, and final recruitment status. Compare participants with refusals, nonrespondents, and the full invited frame using counts, distributions, and standardized differences. Do not condition this diagnostic on internal procurement outcomes or unavailable post-invitation data.

Preregister a parsimonious organization participation-probability model using only frame variables observed for every invitee. Report specification, overlap, calibration, predicted probabilities, and weight distribution. A sensitivity analysis combines resulting stabilized organization inverse-probability weights with equal event weights within organization under a frozen trimming rule. It cannot replace the unit-event-weight primary result based on effect size or significance.

After a full batch is complete, use only exposure, evidence, eligibility, and pre-outcome matching fields to rerun the provisional global solver. Stop recruitment after the first complete batch for which both powered minima are met. Do not drop eligible organizations from the terminal batch, stop mid-batch, or inspect cycle time or another outcome. Pair assignments remain provisional until recruitment stops and all measurement, balance, and attrition gates pass.

If the preregistered cap is reached before both powered minima are met, close recruitment, publish the feasibility and selection flow, and do not run or report the primary test. Do not extend the cap after viewing outcomes.

## Confidential Data Reproducibility

Release the complete frozen analysis code, environment lockfiles, preregistration, codebooks, matching configuration, schema-identical synthetic data, disclosure-controlled aggregate outputs, and keyed source-manifest digests. Public synthetic data must exercise every branch of the pipeline without reproducing confidential values or rare identifying combinations.

Keep raw artifacts, pseudonym keys, coder identity mappings, and restricted row-level data in a logged, read-only controlled environment. An independent auditor with no role in ORI coding, matching, or the original analysis reruns the complete eligibility-to-output pipeline and publishes a signed report identifying the code commit, configuration hash, data-manifest hash, output checksums, deviations, and access limits. This audit establishes computational and provenance reproduction, not causal validity.

## Preregistration and Amendments

Deposit this SAP and all artifacts listed in `docs/research/confirmatory_preregistration_manifest.md` in a public immutable timestamped registry before recruiting the first confirmatory organization and before extracting any confirmatory data. Include immutable code, configuration, environment, and document hashes.

Do not replace the registered record. Every correction or feasibility change is an additive timestamped amendment recording the rationale, old and new hashes, recruitment/extraction status, data available, who had access to exposure/matching/outcome fields, analytical impact, and whether the change forces a new study version or organization-level holdout.

## Secondary and Sensitivity Analyses

Every analysis in this section is exploratory. Report the complete prespecified set with effect estimates and 95% confidence intervals, clearly noting that the intervals are not simultaneous and do not define additional confirmatory tests. Do not classify secondary results as statistically significant or non-significant, apply a data-selected multiplicity procedure, or promote a favorable secondary result to the primary conclusion.

- Raw day differences.
- `net_cycle_days` after subtracting the union of exact auditable `EXT_BINDING_SUSPENSION`, `EXT_FORCE_MAJEURE`, and `EXT_CRITICAL_INFRASTRUCTURE` intervals only, under `docs/research/procurement_cycle_outcome_codebook.md`.
- Business-day duration.
- Actual exception use, bypass, escalation, and work-around outcomes.
- Descriptive mechanism associations only; no causal mediation estimands.
- Leave-one-component-out rigidity indices.
- Tier B interval-censored outcomes using appropriate methods.
- Prespecified 2x2 interactions only if the sample provides adequate support.
- The `ORI × spend_type` interaction and Direct/Indirect stratum-specific estimates.
- The prespecified three-knot ORI restricted cubic spline.
- Organization-level wild cluster bootstrap-t inference.
- A preregistered multilevel model with pair and organization structure.
- The fully prespecified covariate-adjusted pair-fixed-effects model.
- Equal-total-organization weighting.
- Leave-one-organization-out influence estimates for every organization.
- Organization participation inverse-probability weighting from the preregistered nonresponse model.

The primary cycle-time estimand is the sole test using two-sided `alpha = 0.05`. All secondary analyses must remain labeled exploratory and cannot replace the primary estimand after results are known.
