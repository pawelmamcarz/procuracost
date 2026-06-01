# Replication Package Specification – ProcuraCost Research Paper v1.0

**Goal**: Anyone with basic technical skills should be able to reproduce every number, table, and figure appearing in the paper using only the materials in this package.

---

## Folder Structure (recommended)

```
replication-v1.0/
├── README.md                    # Main instructions
├── parameters/
│   ├── full_parameter_table.xlsx
│   ├── full_parameter_table.md
│   └── sources_and_justifications/
├── code/
│   ├── python/                  # Reference implementation
│   ├── r/                       # (optional)
│   └── frozen_js/               # Snapshot of key functions from the app
├── synthetic_data/
│   ├── case_fleet/
│   ├── case_erp/
│   ├── case_logistics/
│   └── case_materials/
├── outputs/
│   └── paper_figures_and_tables/   # All numbers that appear in the paper
├── scripts/
│   └── reproduce_all.py
└── docs/
    └── model_v1.1_specification.pdf
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

### 3. Synthetic Data

For each of the four case studies in the paper:
- Complete input file (all parameters needed to run the model)
- Expected output (the numbers that appear in the paper)
- Short narrative explaining the scenario in business terms

### 4. Reproducibility Script

One script (Python preferred) that:
- Loads all synthetic data
- Runs the model
- Generates CSV/Excel files with all tables and key figures from the paper
- Ideally also generates the LaTeX or Markdown tables used in the paper

---

## Minimum Acceptance Criteria for v1.0

A reviewer or independent researcher should be able to:
1. Clone the repo
2. Run one command
3. Obtain CSV files that match (within rounding) every quantitative claim in the paper

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
- Each of the five/six cost components separately
- Effective multipliers applied (from `getDimensionMultipliers`)

**Metadata**
- Timestamp
- Model version (e.g. "ProcuraCost v1.1 – frozen June 2026")
- Git commit hash (if possible)

**Formats**
- Primary: JSON (machine readable)
- Secondary: CSV (flattened) + human-readable PDF summary

This export should be the main way future empirical studies feed data back into the model in a structured, comparable way.