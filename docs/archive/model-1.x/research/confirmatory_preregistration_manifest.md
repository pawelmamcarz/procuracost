# Confirmatory Preregistration Manifest v0.1

**Status**: template; complete and deposit in a public immutable timestamped registry before confirmatory recruitment or data extraction.

## Registration Identity

- Study title and stable study ID.
- Registry URL/DOI and timestamp.
- Repository URL, branch, and immutable commit hash.
- Named principal investigator, statistician, data custodian, and independent auditor.
- Signed declaration that no confirmatory organization has been recruited and no confirmatory data have been extracted.

## Frozen Artifacts

Record the path, version, and cryptographic hash for each artifact:

- Research question, primary estimand, and confirmatory population.
- `docs/research/observed_rigidity_codebook.md`.
- `docs/research/procurement_cycle_outcome_codebook.md`.
- `docs/research/matching_protocol.md` and machine-readable solver configuration.
- `docs/research/statistical_analysis_plan.md`.
- Eligibility, archival-window, evidence-tier, missingness, and attrition rules.
- Prospective power-simulation code, seeds, nuisance scenarios, and minimum organization/pair floors.
- Recruitment batch definition, invitation order rule, minimum organization/pair thresholds, and maximum organization/time/resource cap.
- Organization sampling-frame provenance and hash, sector/size stratum definitions, allocation rule, random seed, and frozen within-stratum invitation order.
- Frame variables available for all invitees, recruitment-status taxonomy, nonresponse diagnostics, participation model, and sensitivity-weight specification.
- Data schema, extraction specification, pseudonymization plan, and disclosure-control plan.
- Analysis code, software lockfiles, expected synthetic-data outputs, and test checksums.
- Blinding roles, access controls, independent-audit protocol, and publication plan.

## Freeze Assertions

- Confirmatory recruitment has not started.
- Confirmatory extraction has not started.
- No confirmatory outcome value has been viewed by coders, matching analysts, or the primary statistician.
- Pilot organizations and controlled-group exclusions are recorded in the restricted phase registry.
- Pilot data and organizations cannot enter the confirmatory primary analysis.
- All required measurement, balance, evidence, and power gates have explicit pass/fail rules.
- The outcome-blind recruitment stopping rule and no-primary-result condition are executable from registered fields.

## Amendment Log

Never replace the original registration. Deposit each amendment as an additive timestamped record containing:

| Field | Required content |
|---|---|
| Amendment ID | Stable sequential identifier |
| Timestamp | Registry timestamp |
| Author | Responsible person |
| Files/configuration affected | Paths, old hashes, and new hashes |
| Reason | Error correction, feasibility, external requirement, or other rationale |
| Data state | Recruitment/extraction status and records available |
| Blinding state | Who had access to exposure, matching fields, and outcomes |
| Analysis impact | Primary, secondary, sensitivity, or no analytical impact |
| Disposition | Allowed amendment, new study version, or confirmatory restart |

## Sign-Off

- Principal investigator signature/date.
- Statistician signature/date.
- Data custodian signature/date.
- Registry receipt and complete hash manifest.
