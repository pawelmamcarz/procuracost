# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@CLAUDE_DESIGN.md

## What this is

ProcuraCost is a bilingual (PL/EN) Next.js 16 site for a procurement-economics
research project. Native model 2.3.0 compares `formalSequential` and
`adaptiveCompliant` procurement workflow designs under the same legal and
governance boundary. The interactive tools use a self-contained model layer in
`lib/model-v2/`. There is no backend, database or API.

The public contract separates the legal and governance boundary, procedure
family, purchase archetype, procurement workflow design, purchase execution
channel, system support and contract design. Do not collapse these axes into a
single process type, technology level or aggregate capability score.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000 (PL) and /en (EN)
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint (next/core-web-vitals + next/typescript)
npm test           # full Vitest suite

npm test -- tests/decision-record-v2.test.ts  # single file
npm test -- -t "stays swap-neutral"           # single test by name
```

Always start the dev server through `npm run dev`. Bare `next dev` drops the
heap cap that the script sets and, combined with route preloading, turns
dev-server restarts into a cascade of node processes. `next.config.ts` disables
`experimental.preloadEntriesOnStart` for the same reason.

Model verification scripts import the native implementation directly:

```bash
npm run recompute  # canonical diagnostics for all 10 scenarios
npm run sweep      # alternative-swap symmetry audit
npm run replicate  # regenerate the three deterministic replication artefacts
```

`npm run map:legacy` regenerates the quarantined model 2.2.2 decision-threshold
map. It is not part of the model 2.3 output surface. Do not run it as a routine
verification step.

After a change under `lib/`, run the focused test first, then
`npm test && npm run recompute && npm run sweep && npm run replicate && npm run build`.
Run `npm run lint` before hand-off. The `@/*` path alias maps to the repository root.

CI (`.github/workflows/ci.yml`) runs lint, test, build and recompute on every
pull request and push to `main`. It does not run `sweep` or `replicate`, so
symmetry regressions and stale replication artefacts are caught only by the
local sequence above.

Tests run in the default Vitest node environment. There is no jsdom and no
Testing Library. Component tests use `renderToStaticMarkup` plus `readFileSync`
source assertions, which is what makes the design, vocabulary and focus
contracts testable. Follow that pattern instead of adding a DOM environment.

Per `AGENTS.md`, this Next.js version may differ from training data. Read the
relevant guide in `node_modules/next/dist/docs/` before changing App Router
internals, routing or framework APIs.

## Architecture

### The native model lives in `lib/model-v2/`

Changes to procurement economics belong in pure model modules, not components.

- **`domain.ts`** defines model metadata and the public axes. Fixed metadata is
  `schemaVersion: 2`, `modelVersion: "2.3.0"`,
  `calibrationId: "source-scenario-2026-08-28"` and
  `legalRulesetId: "pl-pzp-2026-2027"`.
- **`calibrated-value.ts`** validates ordered low, central and high values plus
  range kind, evidence class and evidence identifiers.
- **`legal.ts`** resolves dated legal waits. Unsupported sectoral and
  defence/security contexts fail closed. Legal waits are locked and identical
  in both alternatives.
- **`process-map.ts`** validates directed acyclic workflow maps, predecessor
  references, legal-step integrity and registered legal-ancestor dependencies.
- **`engine.ts`** calculates critical-path duration, role cost, non-labour cost,
  delay cost, monetised contract cost and the outer difference envelope.
- **`scenarios.ts`** contains ten canonical starting points and their retained
  assumption provenance. Scenario economic values are declared starting
  assumptions, not observed organisational outcomes.
- **`evidence.ts`** distinguishes empirical anchors, official cases,
  practitioner observations, illustrative scenarios and research hypotheses.
- **`decision-record.ts`** creates the auditable output contract with drivers,
  coverage, non-monetised dimensions, evidence and legal provenance.
- **`suitability.ts`** compares lawful procedure families without scoring,
  ranking or inferring organisational readiness.
- **`diagnostics.ts`** audits canonical metadata, ordered ranges, delta identity,
  legal waits, neutral controls and alternative-swap symmetry.
- **`replication.ts`** renders deterministic JSON, CSV and Markdown artefacts.

`lib/readiness.ts` is intentionally independent of the cost model. It may import
practitioner source identifiers, but it must not import calculations, process
templates, scenarios or suitability logic. Readiness responses and their summary must never affect
`deltaCost`.

`lib/i18n.ts` contains all public copy. `lib/version-core.ts` generates the site
release identifier. `lib/shortcasty.ts` is the separate Shortcasty catalogue;
Procurement&Beyond episode 8 does not belong in that catalogue.

Import public model code from the `@/lib/model-v2` barrel. `index.ts` is a
curated surface: it deliberately omits `diagnostics.ts`, `replication.ts`,
`deep-freeze.ts`, `legacy-adapter.ts` and both `legacy-migration` modules, and
re-exports `decision-record.ts` through an explicit named list rather than
`export *`. A new decision-record export must be added to that list. Reach for a
deep path only from scripts, tests and the migration surface.

The former 2.2.2 modules and outputs are provenance for explicit migration and
historical reproduction only. Do not import them into a native 2.3 public
runtime path. Never use `docs/archive/model-1.x/` as an active source.

That boundary is enforced, not advisory. `tests/model-v2-runtime-reachability.test.ts`
walks the App Router import graph, including dynamic edges, and fails if
`lib/calculations.ts`, `lib/decision-map.ts`, `lib/optimizer.ts`,
`lib/scenarios.ts`, `lib/process-templates.ts`, `lib/model-v2/legacy-adapter.ts`,
`lib/model-v2/legacy-migration.ts` or `lib/model-v2/legacy-migration-draft.ts`
becomes reachable. `components/CostCalculator.tsx`,
`components/cost-comparison/`, `components/PathOptimizer.tsx` and
`components/DecisionMap.tsx` still import those modules and are kept unreachable
from every route. Legacy migration enters the runtime only through the deferred
dynamic import in `lib/load-legacy-adapter.ts`; a static import of
`legacy-adapter` breaks the contract. `tests/legacy-model-version-seal.test.ts`
separately pins `lib/calculations.ts` and `lib/scenarios.ts` to
`LEGACY_MODEL_VERSION` and forbids `MODEL_VERSION` in them.

`scripts/` and `replication/` form the computational audit surface. Regenerate
`replication/outputs/` whenever the scenarios, engine or decision-record schema
changes. The native output directory contains the generated JSON, CSV and
Markdown scenario artefacts. The tracked `decision-thresholds.md` file is a
quarantined model 2.2.2 exception pending separately approved removal; it is not
generated or interpreted as a model 2.3 output. Decision-threshold maps
otherwise belong to the historical archive. A stale package contradicts the
active model documentation.

### Routing: duplicated PL/EN route trees

Polish is the default at the root. English lives under `app/(en)/en/` as a
parallel, manually duplicated subtree. Route groups do not appear in public
URLs. There is no locale middleware or dynamic `[lang]` segment, so paired page
changes usually require both trees.

- Paired routes include `assessment`, `calculator`, `case-studies`,
  `methodology`, `model`, `model/assumptions`, `optimizer`,
  `practice/procurement-beyond-8`, `readiness`, `team` and the Shortcasty index.
- The `/optimizer` URL now renders the suitability comparison. Do not restore
  scoring or prescriptive procedure selection under that URL.
- `app/(en)/en/research/page.tsx` redirects to `/research`. The working paper is
  English and has one canonical page. Do not duplicate it.
- `app/(pl)/research-agenda` and the `app/(pl)/shortcasty/[slug]` episode pages
  are PL-only and have no EN counterpart.

Confirm the counterpart in `lib/site-routes.ts` before editing. Language is
passed through the `lang` or `Lang` prop and paired i18n dictionaries.

The calculator route is a thin async server component. It calls `connection()`
because the client workspace reads URL state. V2 sharing uses
`lib/model-v2/calculator-url.ts`. Any new public axis requires a codec update and
a round-trip test. Legacy links pass through the explicit migration adapter;
ambiguous migrations block calculation until the user confirms them.

The legal boundary, procedure family and other design-shaping context axes are
loaded atomically with a registered base scenario. Only compatible same-design
legal updates, currently limited to the initiation date, may reconcile the
existing maps. Legal ancestry metadata is checked against the immutable design
registry before calculation; the mutable draft is not its own source of truth.
`calculateComparison` accepts only the canonical registry object or a builder
output recorded by object identity in the module-private materialisation
registry. Builder outputs are deeply frozen before registration, while the
engine also rechecks the registered scenario context, excluding only the
permitted initiation-date update. Treat a materialised input as immutable: a
raw draft or copied object must fail closed, and post-build mutation is
impossible. The builder first takes one plain structured clone of the complete
draft and URL gate; validation and materialisation use only that snapshot.

`components/AppShell.tsx` renders the navigation and footer once per route-group
layout. Change routes in `lib/site-routes.ts`, navigation labels in `lib/i18n.ts`
and footer markup in `components/SiteFooter.tsx`.

### Components

`components/calculator-v2/` owns the editable workspace, validation and legacy
migration confirmation. `components/process-map/` owns the connected process
rail. `components/decision-record/` owns the neutral result, coverage and
reference-scenario comparison. Keep formulas and legal constants out of all
three directories.

`SuitabilityComparison.tsx`, `ReadinessDiagnostic.tsx` and
`ProcurementBeyond8.tsx` are separate public surfaces with separate contracts.
Do not couple readiness or practitioner material to calculation inputs.

Charts use Recharts only. PDF output uses `jspdf`; each new field requires an
explicit renderer and paired copy in `lib/i18n.ts`. Browser JSON, CSV and
Markdown downloads use pure functions in `lib/research-export.ts`. Replication
artefacts use the separate pure functions in `lib/model-v2/replication.ts`.

### SEO and metadata

`app/seo-config.ts` centralises `SITE_URL` and the canonical taglines. The
canonical production host is `https://www.procuracost.com`. `VERCEL_URL` may win
only for previews. The sitemap, robots file and Open Graph images read from this
configuration.

## Conventions that bite if ignored

- **i18n:** all public strings, export labels and PDF copy go through
  `lib/i18n.ts`. English uses British spelling.
- **Public vocabulary:** use `formalSequential` and `adaptiveCompliant` in the
  v2 data contract. Do not expose `rigid`, `flexible`, `processType`,
  `techLevel`, `spendType` or `processPhase` outside marked legacy metadata.
- **Neutrality:** `deltaCost` always equals formal/sequential total minus
  adaptive/compliant total. Do not tune assumptions or tests to preserve a sign.
- **Practitioner boundary:** Procurement&Beyond episode 8 may inform question
  design and hypothesis generation only. It cannot set thresholds, weights or
  calibration ranges. Bielik may structure market data; the transparent model
  performs the calculation.
- **Site versioning:** `lib/version-core.ts` generates the Tesla-style site
  version. `next.config.ts` resolves it at config load and injects
  `NEXT_PUBLIC_VERSION`, so it applies to `dev` as well as `build`. An override
  must match `year.ISO-week.release.patch` or the config throws before the
  server starts. Quantitative model metadata is separate and lives in
  `lib/model-v2/domain.ts`.
- **Design:** follow `CLAUDE_DESIGN.md`. Do not add prose em dashes, gradients,
  shadows, generic card grids, JSX comments or a new chart library.

## Repo sync (machine-specific)

This working copy lives in an iCloud-synced folder shared with another machine
("Rokale"). GitHub `main` is the source of truth. `bin/claude-pull.sh`,
`bin/claude-push.sh` and `SYNC.md` document the workflow. Never put
`node_modules`, `.next`, `.turbo` or `build` into iCloud.

## Research docs (not code)

`RESEARCH.md`, `PHD_ROADMAP.md`, `CHANGELOG.md`, `docs/MODEL_PARAMETERS.md`,
`docs/articles/doktorat/00-shared-foundation.md`, `docs/articles/pl/` (Polish
practitioner articles), `docs/supervisor/` (supervisor-outreach pack) and
`docs/research/` are the active academic materials. Everything under
`docs/archive/model-1.x/` is historical provenance and must never be used as a
current parameter, citation or instruction source.

- **`docs/MODEL_PARAMETERS.md`** is the model 2.3 parameter and evidence-boundary
  source of truth. Reconcile every formula, legal rule or scenario-bound change
  there.
- **Neutrality invariant:** never tune parameters to preserve the Tunnel and
  Field hypothesis. Public comparisons must remain lawful under PZP. Mandatory
  waits cannot be compressed. Always show scenario ranges, permit sign reversal
  and distinguish empirical anchors from retained assumptions and user inputs.
- **Evidence limit:** Szucs supports only the bounded competition-transfer
  stress. Contract-amendment and TCO differentials are zero in the native
  calculation. Informal bypass remains non-monetised in native model 2.3.0.
- **Historical scope:** references to model 2.1 or 2.2.2 are valid only when a
  document explicitly describes a past defect, audit or immutable archive.
