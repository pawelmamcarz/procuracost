# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@CLAUDE_DESIGN.md

## What this is

ProcuraCost is a bilingual (PL/EN) Next.js 16 site for a procurement-economics
research project. Model 2.1 compares formal/sequential and adaptive/compliant paths
under the same governance boundary. The interactive tools are driven by a
self-contained model layer in `lib/`; there is no backend, database or API.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000 (PL) and /en (EN)
npm run build      # production build (also computes the version string — see below)
npm run start      # serve the production build
npm run lint       # eslint (next/core-web-vitals + next/typescript)
npm test           # vitest run — tests/ covers calculations, optimizer legality, formatting, versioning

npm test -- tests/optimizer.test.ts        # single file
npm test -- -t "is deterministic"          # single test by name

# Test suites are prefixed with the audit letter they cover, e.g. "(e) optimize()
# never recommends a legally filtered-out path", "(f) getISOWeek at year boundaries".
```

Model-verification scripts (all `tsx`, run against the real `lib/` code — never a re-implementation):

```bash
npm run recompute  # per-dimension Δ table for every reference scenario + context-uplift
                   # invariant audit (no dimension's total uplift may exceed ~×1.5)
npm run sweep      # sign-robustness sweep over every process × tech × spend × phase combo
npm run replicate  # regenerate replication/outputs/ from SCENARIOS
npm run map        # decision-threshold map per category × tech × CV → replication/outputs/decision-thresholds.md
                   # (also rendered visually on the homepage by components/DecisionMap.tsx)
```

After any change under `lib/`, run `npm test && npm run recompute && npm run sweep && npm run build`. CI (`.github/workflows/ci.yml`, Node 22) runs lint → test → build → recompute on every PR and push to `main`; `sweep` and `replicate` are manual. Path alias `@/*` maps to the repo root.

> Per `AGENTS.md`: this is a non-standard Next.js build with breaking changes from training data. When touching App Router internals, routing, or framework APIs, consult `node_modules/next/dist/docs/` rather than assuming conventions.

## Architecture

### The model lives in `lib/` (this is the heart of the project)

The cost model is a layered pipeline of pure functions and constants. Changes to procurement economics happen here, not in components:

- **`lib/process-templates.ts`** — the foundational data layer. Defines 8 `ProcessType`s (including `custom`), 4 `TechLevelId`s, 6 `StakeholderRole`s, and the canonical per-step timing/staff derivation. Mandatory legal waits must remain invariant between paths and technologies. **All business-logic constants belong here — never inline magic numbers in components.**
- **`lib/calculations.ts`** — neutral 7-dimension model 2.1. Competition, contract rigidity, TCO capture, workflow, and bypass are separate. `calculateCosts` returns a central point, low/high scenario interval, and daily-cost-of-inaction break-even threshold. Beuve is an annual formal-amendment frequency; TCO is zero centrally.
- **`lib/optimizer.ts`** — common-criteria rule-based path optimizer (`optimize`) with 7 `PathId`s and 30 ±25% weight-sensitivity runs. Every path uses the same criteria and denominator; public candidates are hard-filtered by PZP. Deterministic by design.
- **`lib/scenarios.ts`** — reference scenarios, each a pre-filled `ProcurementInputs` + citation. Used for calculator presets and benchmark charts.
- **`lib/i18n.ts`** — every user-facing string, keyed by `pl` / `en` (`calculatorT`, `comparisonT`, etc.). See i18n rule below.
- **`lib/shortcasty.ts`** — podcast episode metadata. **`lib/version.ts`** — model semantic version. **`lib/version-core.ts`** — site version generator.

`scripts/` and `replication/` are the audit surface around this layer: the scripts import `lib/` directly (never a copy of the formulas), and `replication/outputs/` is generated output committed for reproducibility. Regenerate it with `npm run replicate` whenever `SCENARIOS` or `calculateCosts` changes, and commit the diff — a stale replication package silently contradicts the published paper.

### Routing: duplicated PL/EN route trees

Polish is the default at the root (`app/calculator`, `app/optimizer`, …). English lives under `app/en/` as a **parallel, manually-duplicated subtree** (`app/en/calculator`, …). There is no locale middleware or dynamic `[lang]` segment — changing a page that exists in both trees means editing both. The trees are **not** at full parity, and the exceptions each have a reason:

- Mirrored normally: `assessment`, `calculator`, `case-studies`, `methodology`, `model`, `optimizer`, `team`, `shortcasty`.
- `app/en/research/page.tsx` is a **redirect to `/research`**, not a translation — the working paper is written in English, so the PL route already serves the English text. Don't "fix" it by duplicating the paper.
- `app/research-agenda` is PL-only and has no EN counterpart.

Confirm a route exists under `app/en/` before assuming you must edit it. Language is selected via the NavBar lang switch and the `lang`/`Lang` param threaded into components and i18n lookups.

The interactive pages follow one pattern: the route file is a thin **async server component** that `await connection()` (from `next/server`, opting out of prerender because the tool reads `useSearchParams`) and renders a client wrapper — `CalculatorClient` (PL) / `EnCalculatorClient` (EN). The wrapper owns result state, `dynamic(..., { ssr: false })` imports of `CostComparison` and `PDFExport`, and URL round-tripping of calculator inputs via `encodeInputsToParams` / `inputsFromSearchParams` in `components/calculator-url.ts`. Adding an input to `ProcurementInputs` means updating that codec too, or shared links silently drop the field.

Chrome (NavBar + footer + projects bar) is rendered **once** by `components/AppShell.tsx`, a `"use client"` shell that the root `app/layout.tsx` wraps around all children. AppShell reads `usePathname()` and switches to English chrome for any path under `/en`. Because the root layout wraps every route, `app/en/layout.tsx` must **not** render its own NavBar/footer (doing so produced a duplicate navbar + mismatched-language footer) — it only sets EN `metadata` and returns `{children}`. The footer/projects bar markup lives in `components/SiteFooter.tsx` (language-aware via a `lang` prop). To change nav items, edit the `navItemsPl` / `navItemsEn` arrays in `AppShell`; to change the footer, edit `SiteFooter`.

### Components

`components/` holds the interactive client components (`CostCalculator`, `PathOptimizer`, `AssessmentQuiz`, `PipeFieldDiagram`, `PDFExport`, `NavBar`).

`CostComparison.tsx` is a ~40-line composition shell only — the results UI lives in `components/cost-comparison/` (`HeroSummary`, `CostMatrix`, `DimensionCharts`, `SensitivityChart`, `BenchmarkChart`, `StepsTable`, `DetailTable`, `SourcesList`, `PipeFieldExplainer`, `ResearchExportBar`). Edit the leaf, not the shell.

Charts use **Recharts only** (already a dependency). PDF export draws directly with `jspdf` — there is no `html2canvas` and no DOM screenshotting, so a new result field appears in the PDF only if you add it to `PDFExport.tsx` by hand. Researcher JSON/CSV/Markdown downloads go through `lib/research-export.ts` (browser-only Blob helpers) driven by `ResearchExportBar`.

Radix primitives (`@radix-ui/react-select|slider|tabs`), `lucide-react` icons, `class-variance-authority` and the `cn()` helper in `lib/utils.ts` are available dependencies. Follow `CLAUDE_DESIGN.md` for all styling — colors map to semantic roles (rigid=red, flexible=green, primary=blue) and must not introduce new palette entries.

### SEO and metadata

`app/seo-config.ts` centralises `SITE_URL` and the canonical taglines. The canonical production host is `https://www.procuracost.com` — the apex has no DNS record, and `VERCEL_URL` must only win on previews or `*.vercel.app` leaks into `og:url`. `app/sitemap.ts`, `app/robots.ts` and the two `opengraph-image.tsx` files read from it.

## Conventions that bite if ignored

- **i18n**: never hardcode Polish/English strings in components — route them through `lib/i18n.ts` (`tx = calculatorT[lang]`). Short label ternaries (`lang === "en" ? "days" : "dni"`) are the only allowed exception. See `CLAUDE_DESIGN.md`.
- **Design system**: `CLAUDE_DESIGN.md` is authoritative for color semantics, typography, card/button patterns, and the Tunnel-vs-Field metaphor vocabulary. The canonical tagline and the `∂Φ` notation must be used verbatim where referenced.
- **Site versioning**: the version is Tesla-style `ISO-week-year.ISO-week.release.patch`, computed at build time with `release.patch` defaulting to `1.2` (for example `2026.29.1.2` on 14 July 2026). `lib/version-core.ts` is the single generator; `next.config.ts` injects its result as `NEXT_PUBLIC_VERSION`. To pin a later release in the same week, run `NEXT_PUBLIC_VERSION=2026.29.2.1 npm run build`. The quantitative model has a separate semantic version in `lib/version.ts`.
- **No JSX comments** (`{/* */}`) in returned markup, no `useEffect` for derived values, no new chart libraries — see the Anti-patterns section of `CLAUDE_DESIGN.md`.

## Repo sync (machine-specific)

This working copy lives in an iCloud-synced folder shared with another machine ("Rokale"); GitHub `main` is the source of truth. `bin/claude-pull.sh` / `bin/claude-push.sh` and `SYNC.md` document the pull-before / push-after workflow. Never let `node_modules`, `.next`, `.turbo`, or `build` enter iCloud (`.gitignore` handles this).

## Research docs (not code)

`RESEARCH.md`, `PHD_ROADMAP.md`, `CHANGELOG.md`, `docs/MODEL_PARAMETERS.md`,
`docs/articles/doktorat/00-shared-foundation.md`, `docs/articles/pl/` (Polish
practitioner articles), `docs/supervisor/` (supervisor-outreach pack) and
`docs/research/` are the active academic materials. Everything under
`docs/archive/model-1.x/` is historical provenance and must never be used as a
current parameter, citation or instruction source.

- **`docs/MODEL_PARAMETERS.md`** is the model-2.1 source of truth. Reconcile every formula or scenario-bound change there.
- **Neutrality invariant (load-bearing).** Never tune parameters to preserve Tunnel–Field. Public comparisons must remain lawful under PZP and mandatory waits must not be compressed. Always display scenario uncertainty, allow sign reversal, and distinguish empirical anchors from Grade-C path profiles. Szucs monetizes price only; Beuve is an annual contractual-rigidity frequency; theory does not provide bypass probabilities.
