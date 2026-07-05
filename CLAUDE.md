# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@CLAUDE_DESIGN.md

## What this is

ProcuraCost is a bilingual (PL/EN) Next.js 16 marketing + tooling site for a procurement-economics research project. It quantifies the hidden opportunity costs of rigid procurement procedures vs. policy-based procurement. The interactive tools (cost calculator, weighted rule-based path optimizer, maturity assessment) are all driven by a self-contained model layer in `lib/` — there is no backend, database, or API; every calculation runs client/server-side from constants and pure functions.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000 (PL) and /en (EN)
npm run build    # production build (also computes the version string — see below)
npm run start    # serve the production build
npm run lint     # eslint (next/core-web-vitals + next/typescript)
```

There is **no test suite** and no test framework configured. Verify changes via `npm run lint` and by running the dev server. Path alias `@/*` maps to the repo root (e.g. `@/lib/calculations`).

> Per `AGENTS.md`: this is a non-standard Next.js build with breaking changes from training data. When touching App Router internals, routing, or framework APIs, consult `node_modules/next/dist/docs/` rather than assuming conventions.

## Architecture

### The model lives in `lib/` (this is the heart of the project)

The cost model is a layered pipeline of pure functions and constants. Changes to procurement economics happen here, not in components:

- **`lib/process-templates.ts`** — the foundational data layer. Defines the 7 `ProcessType`s (grouped into strategic / policy-driven / operational layers), 4 `TechLevelId`s, 6 `StakeholderRole`s, per-process `ProcessStep[]` templates (rigid vs. flexible day counts, mandatory-wait flags, per-role participation hours), and the `PROCESS_RIGIDITY` index. The `derive*` functions (`deriveRigidDays`, `deriveFlexibleDays`, `deriveStaffCost`) apply contextual multipliers based on the Direct/Indirect × Upstream/Downstream dimensions. **All business-logic constants belong here — never inline magic numbers in components.**
- **`lib/calculations.ts`** — the 7-dimension cost model (`calculateCosts`): time, admin, opportunity, favoritism / selection-quality (code field `productivityCost`, kept for chart compatibility), renegotiation, TCO, bypass. Consumes `ProcurementInputs`, returns a rigid-vs-flexible `ComparisonResult`. Each dimension documents its source in comments (Szucs JEEA 2024; Beuve, Moszoro & Spiller NBER 2021 / JLEO 2023; the ~30% TCO ceiling is an unattributed practitioner heuristic — no verifiable ISM source; bypass: Lipsky 1980 / Vaughan 1996 / Holmström & Milgrom 1991). Also exports the `formatPLN` / `formatPercent` / `formatCompact` formatters used everywhere.
- **`lib/optimizer.ts`** — the weighted rule-based path optimizer (`optimize`): one closed-form scoring formula per path with a 30-run sensitivity sweep, recommending one of 6 `PathId`s (mapped to Polish PZP articles). Returns scored paths + feature importances for explainability. Deterministic by design — no randomness at inference.
- **`lib/scenarios.ts`** — 8 reference case studies (Ryanair fleet, Swiss Casinos ERP, Zara, etc.), each a pre-filled `ProcurementInputs` + citation. Used for the calculator presets and the industry benchmark chart.
- **`lib/i18n.ts`** — every user-facing string, keyed by `pl` / `en` (`calculatorT`, `comparisonT`, etc.). See i18n rule below.
- **`lib/shortcasty.ts`** — podcast episode metadata. **`lib/version.ts`** — Tesla-style version string.

### Routing: duplicated PL/EN route trees

Polish is the default at the root (`app/calculator`, `app/optimizer`, …). English lives under `app/en/` as a **parallel, manually-duplicated subtree** (`app/en/calculator`, …). There is no locale middleware or dynamic `[lang]` segment — changing a page that exists in both trees means editing both. The trees are **not** at full parity: seven pages are mirrored in EN (`assessment`, `calculator`, `case-studies`, `methodology`, `model`, `optimizer`, `team`); `research` and `shortcasty` remain PL-only by design — the working paper and podcast are Polish-language content, so they have no EN counterpart. Confirm a route exists under `app/en/` before assuming you must edit it. Language is selected via the NavBar lang switch and the `lang`/`Lang` param threaded into components and i18n lookups.

Chrome (NavBar + footer + projects bar) is rendered **once** by `components/AppShell.tsx`, a `"use client"` shell that the root `app/layout.tsx` wraps around all children. AppShell reads `usePathname()` and switches to English chrome for any path under `/en`. Because the root layout wraps every route, `app/en/layout.tsx` must **not** render its own NavBar/footer (doing so produced a duplicate navbar + mismatched-language footer) — it only sets EN `metadata` and returns `{children}`. The footer/projects bar markup lives in `components/SiteFooter.tsx` (language-aware via a `lang` prop). To change nav items, edit the `navItemsPl` / `navItemsEn` arrays in `AppShell`; to change the footer, edit `SiteFooter`.

### Components

`components/` holds the interactive client components (`CostCalculator`, `CostComparison`, `PathOptimizer`, `AssessmentQuiz`, `PipeFieldDiagram`, `PDFExport`, `NavBar`). Charts use **Recharts only** (already a dependency); PDF export uses `jspdf` + `html2canvas`. Follow `CLAUDE_DESIGN.md` for all styling — colors map to semantic roles (rigid=red, flexible=green, primary=blue) and must not introduce new palette entries.

## Conventions that bite if ignored

- **i18n**: never hardcode Polish/English strings in components — route them through `lib/i18n.ts` (`tx = calculatorT[lang]`). Short label ternaries (`lang === "en" ? "days" : "dni"`) are the only allowed exception. See `CLAUDE_DESIGN.md`.
- **Design system**: `CLAUDE_DESIGN.md` is authoritative for color semantics, typography, card/button patterns, and the Tunnel-vs-Field metaphor vocabulary. The canonical tagline and the `∂Φ` notation must be used verbatim where referenced.
- **Versioning**: the version is Tesla-style `year.isoweek.minor.patch`, computed at build time. `next.config.ts` injects it as `NEXT_PUBLIC_VERSION`; `lib/version.ts` reads that or recomputes. Do not hand-edit a version string into source — to pin a release within a week, build with `NEXT_PUBLIC_VERSION=2026.19.3.0 npm run build`.
- **No JSX comments** (`{/* */}`) in returned markup, no `useEffect` for derived values, no new chart libraries — see the Anti-patterns section of `CLAUDE_DESIGN.md`.

## Repo sync (machine-specific)

This working copy lives in an iCloud-synced folder shared with another machine ("Rokale"); GitHub `main` is the source of truth. `bin/claude-pull.sh` / `bin/claude-push.sh` and `SYNC.md` document the pull-before / push-after workflow. Never let `node_modules`, `.next`, `.turbo`, or `build` enter iCloud (`.gitignore` handles this).

## Research docs (not code)

`RESEARCH.md`, `PHD_ROADMAP.md`, `CHANGELOG.md`, and `docs/` (including `docs/research/`) are the academic working paper, roadmap, and supporting materials. They drive the economics behind the model — read them when changing cost-model assumptions, but they are documentation, not part of the build.

- **`docs/MODEL_PARAMETERS.md`** is the per-parameter source-of-truth for every constant in `lib/`: exact value, citation, and whether it is peer-reviewed (~35–40%) or a calibrated/modeling assumption. **Before changing any constant in `lib/calculations.ts` or `lib/process-templates.ts`, reconcile it here** and keep the two in sync.
- **Honest-reframe invariant (load-bearing).** The model's framing is that *discretion* is the cost driver, not *rigidity* — `DISCRETION_FAVORITISM_PREMIUM` runs in that direction. An earlier inverted reading of Szucs (2024) (`RIGIDITY_PRICE_PREMIUM`, `RIGIDITY_PRODUCTIVITY_LOSS`) was **removed**; do not reintroduce rigidity-as-cost parameters. The model is **symmetric** — in low-corruption-risk operational contexts the rigid path can be net-cheaper. Headline figures (e.g. rigid 100–400% over policy-only) are model **estimates** under documented assumptions, not measured facts; preserve that hedging in any user-facing copy.
