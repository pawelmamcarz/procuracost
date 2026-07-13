# Replication Package Specification – ProcuraCost Model v1.2 and Empirical Paper 2

**Goal**: Anyone with basic technical skills should be able to reproduce every Paper 1 model number, table, and figure from public materials. For Paper 2, the public package reproduces the complete pipeline on schema-identical synthetic data and verifies released aggregate outputs; exact reproduction from confidential organizational records occurs in a controlled environment and is documented by an independent audit report.

Do not claim that confidential empirical results are publicly reproducible when the source records cannot lawfully be released.

---

## Current runnable structure

```
replication/
├── README.md
├── outputs/
│   ├── built-in-scenarios.json
│   ├── built-in-scenarios.csv
│   └── built-in-scenarios.md
├── exports/
└── ... legacy artifacts

scripts/generate-replication.ts
tests/calculations.test.ts
tests/optimizer.test.ts
docs/MODEL_PARAMETERS.md
docs/research/model_specification_draft.md
```

---

## Required Contents

### 1. Parameters (highest priority)

- Every single number used in the paper must appear in `full_parameter_table.xlsx`
- Columns (minimum):
  - Parameter name (exact as used in code)
  - Value (point estimate)
  - Lower bound / Upper bound (for sensitivity)
  - Source (full citation + page if applicable)
  - Type: Empirical / Calibrated from multiple sources / Pure modeling assumption
  - Sensitivity (High / Medium / Low)
  - Justification / Notes
  - 2x2 applicability (which quadrants this parameter is adjusted for)

### 2. Code

- Frozen, runnable version of the core calculation engine
- Must be able to take the synthetic inputs and produce the exact outputs shown in the paper
- Clear separation between:
  - Base model (without 2×2)
  - Model with Direct/Indirect + Upstream/Downstream adjustments

### 3. Illustrative scenario data

For each built-in illustrative archetype:
- Complete input file (all parameters needed to run the model)
- Expected output (the numbers that appear in the paper)
- Short narrative explaining the scenario in business terms

### 4. Reproducibility command

`npm run replicate` compiles the TypeScript model and regenerates JSON, CSV, and Markdown outputs. `npm test` verifies computational invariants. Neither command validates the assumptions empirically.

### 5. Public empirical package

The Paper 2 public package must contain:

```text
replication/empirical/
├── README.md
├── preregistration/
├── codebooks/
├── schema/
├── synthetic-data/
├── matching-config/
├── analysis/
├── released-outputs/
├── source-manifest/
└── audit/
```

- Frozen preregistration, SAP, eligibility rules, codebook versions, and amendment log.
- Exact matching and analysis code, solver configuration, software lockfiles, seeds, and expected checksums.
- A row-complete synthetic dataset with the same schema, types, missingness flags, identifiers, and relational constraints as the restricted analysis data, without copying confidential values or rare identifying combinations.
- De-identified aggregate tables and figures released with disclosure-control review.
- A source manifest using keyed hashes or HMACs generated inside the restricted environment. Do not publish unhashed source names, pseudonym keys, raw paths, or low-entropy plain hashes.
- A public independent-audit report tied to code commit, configuration hash, data-manifest hash, and output checksums.

### 6. Restricted empirical package

The following remain outside the public repository in a controlled environment:

- Raw procurement artifacts and system exports.
- The organization/event pseudonymization key.
- Coder and adjudicator identity mapping.
- Row-level real-event analysis data when contractual or disclosure controls prohibit release.
- Consent, data-processing, and access-control records.

Access is read-only, logged, time-bounded, and governed by the applicable consent, NDA, data-processing agreement, ethics approval, and institutional policy. No raw source or pseudonym key leaves the environment.

### 7. Independent reproduction audit

An independent auditor who did not code ORI, construct pairs, or run the original primary analysis must:

1. Verify the restricted source manifest against the available raw artifacts.
2. Re-run eligibility, ORI completeness/reliability checks, adjudication joins, matching, balance gates, attrition gates, and the frozen primary analysis.
3. Compare every released empirical table and figure with regenerated outputs.
4. Record deviations, unresolved access limitations, software versions, commit hashes, configuration hashes, and output checksums.
5. Sign a public audit report stating exactly what was and was not reproduced.

The audit report is evidence of computational and provenance reproduction, not proof of causal identification or substantive validity.

### 8. Public preregistration

Deposit `docs/research/confirmatory_preregistration_manifest.md` and every frozen artifact it references in a public immutable timestamped registry before the first confirmatory organization is recruited and before any confirmatory extraction. The registry record must identify immutable code/configuration hashes. Never overwrite the original record; publish every change as an additive timestamped amendment that states the available data and blinding status.

---

## Minimum Acceptance Criteria

For Paper 1, a reviewer or independent researcher should be able to:
1. Clone the repo
2. Run one command
3. Obtain CSV files that match (within rounding) every quantitative claim in the paper

For Paper 2, a public reviewer should be able to run the complete pipeline on synthetic data and verify all released checksums. The independent restricted-data auditor must reproduce the exact empirical outputs and publish the signed scope-and-findings report.

---

## "Researcher Export" Feature Requirements (from the live tool)

When a user clicks "Export for Research" in ProcuraCost, the output must contain at minimum:

**Inputs**
- All user-provided values (contract value, TCO horizon, daily inaction cost, etc.)
- Chosen ProcessType
- Chosen TechLevel
- Chosen spendType and processPhase
- Any manual overrides (if the feature supports them)

**Intermediate calculations**
- Rigid and flexible days (after all adjustments)
- Staff cost breakdown by role (before and after 2×2 adjustments)
- Every active cost component plus the inactive productivity schema field
- Effective multipliers applied (from `getDimensionMultipliers`)

**Metadata**
- Timestamp
- Model version (currently `1.2.0`)
- App build version, recorded separately from the model version
- Git commit hash (if possible)

**Formats**
- Primary: JSON (machine readable)
- Secondary: CSV (flattened) + human-readable PDF summary

This export should be the main way future empirical studies feed data back into the model in a structured, comparable way.
