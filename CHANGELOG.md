# Changelog

All notable changes to ProcuraCost are documented here.

## [2026.19.3.0] - 2026-05

### Deep Model Differentiation (Direct/Indirect × Upstream/Downstream)

This release significantly deepens the two contextual dimensions introduced after academic feedback (Prof. Krzysztof Piech review). The model no longer treats all procurement uniformly.

**Key technical changes:**

- **Step-level calendar time differentiation** (`deriveRigidDays`, `deriveFlexibleDays` in `lib/process-templates.ts`)
  - Strategic steps (specification prep, clarifications, award committee, contract signing, needs analysis) now receive +22% extra calendar days in rigid path under Direct+Upstream.
  - Flexible path receives correspondingly stronger compression on the same high-overhead steps.

- **Per-step senior effort granularity** (`deriveStaffCost`)
  - Executive and legal hours now receive additional targeted multipliers on the most governance-heavy individual steps (award_committee, contract_signing, siwz_prep, needs_analysis) when context = Direct+Upstream. This is the strongest academic differentiation yet.

- **Live numeric multipliers everywhere**
  - New exported `getDimensionMultiplierDetails()` + improved `getDimensionMultipliers()`.
  - Cost Comparison view now shows a prominent "Zastosowane mnożniki kontekstu" block with exact live values (e.g. TCO leverage 1.62x, Coordination 1.30x).
  - PDF reports contain a clean, paginated numeric table of all applied multipliers with bilingual labels and methodology link.

- **Optimizer scoring strengthened**
  - `scorePath` now applies even sharper conditional weights (up to 1.8× on negotiations, 1.6× on competitive dialogue for Direct+Upstream; strong down-weighting of direct award in the same context).
  - PathOptimizer UI shows quantified impact statements.

- **Interactive Assumptions Explorer (production model)**
  - `/model/assumptions` (and English `/en/model/assumptions`) completely rebuilt.
  - Sliders/selector now drive the *real* `getDimensionMultipliers()` function — you see exactly what the calculator and optimizer will use.
  - Full bilingual support.

### Production visibility & versioning

- All dimension effects are now immediately visible in the main calculator flow (no need to open PDF).
- Version bumped to **2026.19.3.0** (Tesla-style) to clearly mark this model-deepening release and avoid collision with 19.2 deployments.
- English assumptions explorer page added for full production coverage.

### Files changed (core model/UI)

- `lib/process-templates.ts` (days + per-step staff)
- `lib/calculations.ts` (exported helpers)
- `components/CostComparison.tsx` (live multiplier strip + rich context header)
- `components/PDFExport.tsx` (proper numeric table)
- `components/PathOptimizer.tsx` (quantified explanations)
- `app/model/assumptions/page.tsx` + new `app/en/model/assumptions/page.tsx`

This release was built under the explicit mandate "automatycznie rozbudowuj i zmieniaj model" — no heavy documentation, maximum visible model depth.

## Previous versions

See git history for earlier changes.
