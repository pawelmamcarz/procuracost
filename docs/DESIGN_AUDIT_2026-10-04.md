# Design audit 2026-10-04 — Editor checklist and zombie-UI sweep

Audit of the live UI against `CLAUDE_DESIGN.md`, run alongside the introduction
of the editor quality checklist (inspired by Katie Dill's four pillars:
point of view, encoded standards, "done is not good", protected uniqueness).
Scope: `components/`, `app/`, `lib/`. Legacy unreachable components
(`CostCalculator.tsx`, `cost-comparison/`, `PathOptimizer.tsx`,
`DecisionMap.tsx`) are reported separately.

## Verdict

Zero violations of the visual anti-patterns in live, reachable code. The
legacy quarantine holds: nothing leaks into routes. The remaining work is not
rule-breaking but contract drift on the prescriptive side: signature motifs
that exist only partially, orphaned visuals, and details the tests do not yet
lock.

## Live code: clean

- Gradients, shadows, glass, radar charts, `grid-cols-5`, JSX comments in
  markup, inline hex in `className`, non-Recharts chart libraries: zero hits.
- Red/green semantics compliant everywhere reachable; errors use amber,
  confirmed states use blue. No winner treatments, no trophy/medal icons.
- No em dashes in live copy (`lib/i18n.ts` and `lib/model-v2/` clean).
- No hardcoded user-facing strings in reachable components; all `lang === "en"`
  ternaries are short units or locale identifiers.
- British spelling consistent in reachable EN dictionaries.
- PL/EN dictionary parity enforced at compile time (`satisfies` + `LangShape`)
  and at runtime for eight dictionaries.
- Forbidden v2 vocabulary (rigid/flexible/processType/techLevel/spendType/
  processPhase) absent from all reachable v2 surfaces.

## Findings worth acting on (by impact)

1. **Tunnel and Field visual is unreachable.** `components/BoundaryField.tsx`
   is fully built, bounded and tested, but no page imports it;
   `tests/home-topology-graphic.test.ts:10-24` explicitly forbids it on the
   homepage. `components/PipeFieldDiagram.tsx` is orphaned dead code that also
   carries the banned term SIWZ (:10) and hardcoded PL/EN copy. Either surface
   `BoundaryField` on a model or research page, or delete both orphans. The
   signature metaphor currently exists only in the test suite.
2. **Rail connectors lack arrow direction.** No `marker-end` arrowheads on
   desktop connectors (`components/process-map/ProcessRail.tsx:74-86`); mobile
   shows direction only via split/merge glyphs, with no drawn connectors
   (`ProcessRail.tsx:135-187`). The contract requires visible arrow direction
   and connectors intact at 320 px.
3. **Critical-path emphasis disagrees with the contract.** Criticality is
   rendered in lane colour (red/green); blue marks selection only
   (`ProcessRail.tsx:37-45`, `ProcessStepNode.tsx:62-70`). The contract
   prescribes line weight + blue emphasis. Fix the implementation or amend
   `CLAUDE_DESIGN.md`; today they disagree.
4. **tabular-nums gaps.** Rail node timing summaries
   (`ProcessStepNode.tsx:94-98`) and cost/day values on the assumptions page
   (`ModelAssumptionsPage.tsx:636-646, 721-748`) lack tabular numerals. Extend
   the `tests/calculation-result-bar.test.ts:140-146` pattern to these
   surfaces.
5. **Cobalt numbered-rule motif applied once.** Canonical implementation at
   `components/home/EvidenceFieldHome.tsx:108-121`; the homepage journey
   (:136-150), evidence docket (`components/evidence/EvidenceDocket.tsx:55-58`)
   and practice reference chain (`components/ProcurementBeyond8.tsx:74-104`)
   present sequences/provenance with ad-hoc rows instead. Align them so the
   motif reads as a system.

## Secondary findings

- Small `text-gray-400` meta text on white is below WCAG AA
  (`ProcurementBeyond8.tsx:83`, `ReadinessDiagnostic.tsx:259`,
  `TeamPage.tsx:133`). The design system's own hierarchy sanctions gray-400
  for meta, so the contract is internally tense; decide and document.
- `transition-colors` without `motion-reduce` on suitability controls
  (`SuitabilityComparison.tsx:40, 418`).
- Decision record leads with the delta summary before the compared-alternatives
  detail; the prescribed order lists alternatives first. Either order is
  defensible; make one canonical in the contract.
- Three user-facing migration strings built by inline ternaries inside
  `lib/i18n.ts:288-301` bypass the paired-dictionary parity mechanism.
- `components/home/home-surface-data.ts` is imported only by tests: dead data
  module.

## Legacy-only findings (quarantined, unreachable)

- `PathOptimizer.tsx`: gradient (:292), shadows (:67, 388, 429, 468), card
  grid (:429-468), red/green as judgement (:478, 488).
- `cost-comparison/HeroSummary.tsx`: gradient hero (:34), glass cards (:43,
  85, 137).
- `cost-comparison/DimensionCharts.tsx`: the only radar chart (:10-13,
  87-106).
- `CostCalculator.tsx:99`: `sm:grid-cols-5`.
- Winner vocabulary in legacy-only dictionaries: `optimizerT`
  (`lib/i18n.ts:3407-3436`), `decisionMapT` legend (:4197-4199).
- `Zamawiający (biznes)` in legacy `calculatorT` (`lib/i18n.ts:97`); every
  reachable surface uses `Wnioskodawca biznesowy`.
- American spellings in legacy `comparisonT`: `gray` (:1780), `Tool license`
  (:1785).
- SIWZ in `lib/process-templates.ts:202-203, 448`; the :448 string is pinned
  verbatim in `tests/fixtures/approved-public-em-dashes.ts:23`, so the
  obsolete term is enshrined in an approved fixture.

## Test-enforcement gaps

Rules currently upheld by convention only (no dedicated test): the radar-chart
ban (global), inline hex in `className`, and red/green-reserved-for-alternatives
semantics. If the legacy components are ever revived rather than deleted,
these gaps become live risks.

## Resolution (same day)

All findings were implemented the same day:

1. `BoundaryField` now renders on the model page in both locales
   (`components/ModelOverview.tsx`, reusing the existing `homeT.*.boundary`
   copy); `components/PipeFieldDiagram.tsx` was deleted.
2. Rail connectors carry SVG marker-end arrowheads; the mobile sequence draws
   vertical connectors between nodes (`components/process-map/ProcessRail.tsx`).
3. Critical path is blue emphasis plus line weight (`text-blue-600`,
   stroke-width 4); lane red/green remains identity-only
   (`ProcessRail.tsx`, `ProcessStepNode.tsx`).
4. `tabular-nums` added to rail node timings and the assumptions-page cost/day
   values, locked by tests.
5. The cobalt numbered-rule motif is one shared system:
   `components/NumberedProvenanceRule.tsx` now backs the homepage record
   structure, the four-stage journey, the evidence docket and the practice
   reference chain.
6. Contrast: small meta text moved from `gray-400` to `gray-500` across
   reachable surfaces; this document's typography section now makes `gray-500`
   the meta colour and reserves `gray-400` for decorative mono notation.
7. `motion-reduce:transition-none` added to the suitability controls.
8. The decision-record order above was made canonical (difference summary
   first), matching the test-locked implementation.
9. The three inline-ternary migration strings moved into the paired
   `calculatorV2` migration dictionary (`lib/i18n.ts`).
10. The three test-enforcement gaps are closed by
    `tests/design-contract.test.ts` (radar ban, hex in className, red/green
    reserved), including a pin confining the radar family to the legacy
    quarantine.

Separately, the audit surfaced that HEAD was red: the committed
`beuve_amendment_frequency_2023` evidence record had no i18n copy. The
`evidence.beuve.*` blocks and the `verified_postprint` labels were added to
all PL/EN dictionaries the same day.
