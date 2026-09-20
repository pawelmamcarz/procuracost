<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Everything above is managed by create-next-app; keep additions below the END marker. -->

# AGENTS.md — ProcuraCost

Guidance for AI coding agents working in this repository. The companion files
`CLAUDE.md` and `CLAUDE_DESIGN.md` carry the same working rules and the design
system; read them before non-trivial changes. This file is the self-contained
orientation: what the project is, how to build and test it, how the code is
organised, and which invariants are enforced by tests.

## Project overview

ProcuraCost (package name `procuracost`) is a bilingual (Polish/English)
research-site built with Next.js 16 (App Router, Turbopack) and React 19. It
hosts an interactive procurement-economics model that compares two procurement
workflow designs for the same purchase under an identical legal and governance
boundary:

- `formalSequential` — a prescribed sequential design;
- `adaptiveCompliant` — a policy-bounded adaptive design.

The active model is **native model 2.3.0** (`schemaVersion: 2`,
`calibrationId: "source-scenario-2026-08-28"`, `legalRulesetId: "pl-pzp-2026-2027"`,
Polish public procurement law). The model implementation is a self-contained
pure-TypeScript layer in `lib/model-v2/`. There is **no backend, database or
API**; the production site is a static-rendered Next.js app deployed on Vercel
(canonical host `https://www.procuracost.com`, configured in `app/seo-config.ts`).

The project is also a PhD/research artefact: `docs/MODEL_PARAMETERS.md` is the
parameter and evidence contract, `docs/research/`, `docs/articles/` and
`docs/supervisor/` hold the academic materials, and `replication/` holds
deterministic replication outputs. Everything under `docs/archive/model-1.x/`
and the model 2.2.2 modules are historical provenance only.

## Technology stack

- **Framework:** Next.js 16.3.5 (App Router, route groups, Turbopack via
  `next.config.ts`), React 19.2.8, TypeScript 5 in `strict` mode, ES2018 target.
- **Styling:** Tailwind CSS v4 through `@tailwindcss/postcss`; fonts are
  self-hosted Public Sans and IBM Plex Mono in `public/fonts/`.
- **UI primitives:** Radix UI (`react-select`, `react-slider`, `react-tabs`),
  `lucide-react` icons, `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Charts:** Recharts only. **PDF:** `jspdf`.
- **Tests:** Vitest 4 running in the default **node** environment (no jsdom, no
  Testing Library).
- **Scripts:** `tsx` (TypeScript execution) for the audit/verification scripts
  in `scripts/`.
- **Lint:** ESLint 9 flat config (`eslint.config.mjs`) extending
  `eslint-config-next` core-web-vitals and TypeScript presets.
- **Path alias:** `@/*` maps to the repository root (configured in
  `tsconfig.json` and mirrored in `vitest.config.ts`).

## Build, test and verification commands

```bash
npm ci             # install (CI uses this)
npm run dev        # dev server: PL at http://localhost:3000, EN at /en
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm test           # full Vitest suite (77 files, ~800 tests, ~10 s)
npm test -- tests/decision-record-v2.test.ts   # single file
npm test -- -t "stays swap-neutral"            # single test by name
```

Model verification scripts (import the native implementation directly):

```bash
npm run recompute  # canonical diagnostics for all 10 scenarios
npm run sweep      # alternative-swap symmetry audit
npm run replicate  # regenerate the deterministic replication artefacts
npm run map:legacy # regenerates the quarantined 2.2.2 decision-threshold map;
                   # NOT part of the model 2.3 output surface — never a routine step
```

After any change under `lib/`: run the focused test first, then
`npm test && npm run recompute && npm run sweep && npm run replicate && npm run build`,
and `npm run lint` before hand-off. Regenerate `replication/outputs/` whenever
scenarios, the engine or the decision-record schema change.

**Dev-server warning:** always start the dev server through `npm run dev`. The
script sets `NODE_OPTIONS=--max-old-space-size=4096`; bare `next dev` drops that
cap and, combined with route preloading, turns dev-server restarts into a
cascade of node processes. `next.config.ts` also sets
`experimental.preloadEntriesOnStart: false` for the same reason (comment in
Polish explains the heap behaviour).

## Repository layout

```
app/(pl)/            Polish route tree (default, served at /)
app/(en)/en/         English route tree (manually duplicated parallel subtree)
app/seo-config.ts    SITE_URL, canonical host and taglines for sitemap/robots/OG
components/          React components; domain-owned subdirectories (below)
lib/model-v2/        The native model 2.3 implementation (pure, no React)
lib/                 i18n, routing table, readiness, exports, legacy modules
scripts/             Verification scripts (recompute, sweep, replicate, decision-map)
tests/               Vitest suite incl. architecture-enforcement tests
replication/         Replication package README and generated outputs (JSON/CSV/MD)
docs/                Research and parameter documentation (MODEL_PARAMETERS.md is the contract)
bin/ + SYNC.md       iCloud two-machine sync helpers (machine-specific)
.github/workflows/   CI (ci.yml)
```

The `@/*` alias points at the repo root, so imports look like
`@/lib/model-v2`, `@/components/...`.

## Architecture

### Native model (`lib/model-v2/`)

All procurement economics lives here, in pure modules — never in components:

- `domain.ts` — model metadata and the public axes (legal/governance boundary,
  procedure family, purchase archetype, workflow design, execution channel,
  system support, contract design). Do not collapse these axes into one
  process type or aggregate score.
- `calibrated-value.ts` — ordered low/central/high values with range kind and
  evidence identifiers.
- `legal.ts` — dated legal waits; locked and identical in both alternatives.
  Unsupported sectoral/defence contexts fail closed.
- `process-map.ts` — DAG validation, predecessors, legal-step integrity.
- `engine.ts` — critical-path duration, role/non-labour/delay/contract costs
  and the difference envelope. `deltaCost` is always
  formal-sequential total minus adaptive-compliant total.
- `scenarios.ts` — ten canonical scenarios with provenance.
- `evidence.ts`, `decision-record.ts`, `suitability.ts`, `diagnostics.ts`,
  `replication.ts` — evidence classes, the auditable output contract, lawful
  procedure comparison (no scoring/ranking), invariant audits and artefact
  rendering.

Import public model code from the `@/lib/model-v2` barrel. `index.ts` is a
curated surface: it omits `diagnostics.ts`, `replication.ts`, `deep-freeze.ts`,
the legacy modules, and re-exports `decision-record.ts` through an explicit
named list — add new decision-record exports to that list. Reach for deep
module paths only from scripts, tests and the migration surface.

`calculateComparison` accepts only the canonical registry object or a builder
output recorded by object identity; inputs are deeply frozen and treated as
immutable (a raw draft or copied object fails closed).

### Legacy boundary (enforced by tests)

The former 2.2.2 modules (`lib/calculations.ts`, `lib/scenarios.ts`,
`lib/decision-map.ts`, `lib/optimizer.ts`, `lib/process-templates.ts`,
`lib/model-v2/legacy-adapter.ts`, `legacy-migration*.ts`) are provenance for
explicit migration only. `tests/model-v2-runtime-reachability.test.ts` walks
the App Router import graph (including dynamic edges) and fails if any of them
becomes reachable from a route; legacy components importing them
(`CostCalculator.tsx`, `cost-comparison/`, `PathOptimizer.tsx`,
`DecisionMap.tsx`) are deliberately kept unreachable. Legacy links enter the
runtime only through the deferred dynamic import in `lib/load-legacy-adapter.ts`.
`tests/legacy-model-version-seal.test.ts` pins the legacy modules to
`LEGACY_MODEL_VERSION`.

### Routing: duplicated PL/EN trees

Polish is the default at `/`; English lives under `app/(en)/en/` as a manually
duplicated parallel subtree. Route groups do not appear in public URLs, and
there is no locale middleware — paired page changes usually require editing
both trees. Confirm the counterpart in `lib/site-routes.ts` (the route table)
before editing; navigation labels live in `lib/i18n.ts`, footer markup in
`components/SiteFooter.tsx`, and `components/AppShell.tsx` renders nav/footer
once per route-group layout. Notable asymmetries: `/en/research` redirects to
`/research` (one canonical English working paper), and `research-agenda` plus
`shortcasty/[slug]` episodes are PL-only.

### Components

Domain-owned directories keep formulas and legal constants out of UI code:
`components/calculator-v2/` (editable workspace, validation, legacy migration
confirmation), `components/process-map/` (the connected process rail),
`components/decision-record/` (neutral result, coverage, reference-scenario
comparison). `SuitabilityComparison.tsx`, `ReadinessDiagnostic.tsx` and
`ProcurementBeyond8.tsx` are separate public surfaces with separate contracts;
readiness (`lib/readiness.ts`) must stay independent of `deltaCost`.

### i18n, versioning, SEO

All user-facing strings (including validation, PDF and export labels) go
through `lib/i18n.ts` (~6 000 lines, paired PL/EN dictionaries with matching
leaf paths). English copy uses British spelling; the `lang === "en" ? … : …`
inline exception is reserved for short units. The site version is a
Tesla-style `year.ISO-week.release.patch` string generated by
`lib/version-core.ts` and injected as `NEXT_PUBLIC_VERSION` by
`next.config.ts` at config load (so it applies to `dev` too); an override must
match that format or the config throws before the server starts.

## Testing strategy

- Vitest, **node environment only** — deliberately no jsdom/Testing Library.
  Component tests use `renderToStaticMarkup` plus `readFileSync` source
  assertions (see e.g. `tests/decision-record-ui.test.ts`,
  `tests/process-rail-ui.test.ts`). Follow that pattern; do not add a DOM
  environment.
- Beyond unit tests, the suite enforces architecture: runtime reachability of
  legacy modules, the legacy model-version seal, diagnostics/symmetry invariants,
  public vocabulary and focus contracts, replication-artefact freshness.
- CI (`.github/workflows/ci.yml`, Node 22, `npm ci`) runs lint, test, build and
  `npm run recompute` on every PR and push to `main`. It does **not** run
  `sweep` or `replicate`, so symmetry regressions and stale replication
  artefacts are caught only by the local sequence above — run it before
  hand-off.

Verified state at the time of writing: `npm test` passes (78 files, 820 tests).

## Conventions and invariants that bite if ignored

- **Neutrality:** never tune parameters, assumptions or tests to preserve a
  preferred "Tunnel and Field" result. Public comparisons must remain lawful
  under PZP; mandatory legal waits stay locked and identical in both
  alternatives; show scenario ranges and permit sign reversal. Always
  reconcile formula, legal-rule or scenario changes with
  `docs/MODEL_PARAMETERS.md`.
- **Vocabulary:** use `formalSequential` / `adaptiveCompliant` in the v2 data
  contract. Do not expose `rigid`, `flexible`, `processType`, `techLevel`,
  `spendType` or `processPhase` outside marked legacy metadata.
- **Evidence boundary:** Szucs supports only the bounded competition-transfer
  stress; contract-amendment and TCO differentials are zero in the native
  calculation; informal bypass stays non-monetised. Practitioner material
  (Procurement&Beyond episode 8) may inform questions and hypotheses only —
  never thresholds, weights or calibration. Bielik may structure market data;
  the transparent model performs the calculation.
- **Design:** follow `CLAUDE_DESIGN.md`. No prose em dashes, gradients,
  shadows, generic card grids, JSX comments in returned markup, or a second
  chart library. Colour semantics: red/green identify the two compared
  alternatives only — never a judgement.
- **Style:** match the surrounding code; no multi-paragraph docstrings or
  comment blocks on functions; no magic numbers or legal rules in components —
  use named native model constants.

## Deployment and repository sync

- Deployment is Vercel; production host `https://www.procuracost.com`
  (`VERCEL_URL` may win only for previews). Sitemap, robots and Open Graph
  images read `app/seo-config.ts`.
- The working copy lives in an iCloud-synced folder shared with a second
  machine ("Rokale"); GitHub `main` is the source of truth. `bin/claude-pull.sh`,
  `bin/claude-push.sh` and `SYNC.md` document the workflow. Never put
  `node_modules`, `.next`, `.turbo` or `build` into iCloud.
- There are no secrets in the repo and no server-side credential handling; the
  legal resolver and input validation fail closed by design, and legal waits
  are immutable at runtime.
