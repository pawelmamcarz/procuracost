# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@CLAUDE_DESIGN.md

## What this is

ProcuraCost is a bilingual (PL/EN) Next.js 16 site for a procurement-economics
research project. Model 2.0 compares formal/sequential and adaptive/compliant paths
under the same governance boundary. The interactive tools are driven by a
self-contained model layer in `lib/`; there is no backend, database or API.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000 (PL) and /en (EN)
npm run build    # production build (also computes the version string — see below)
npm run start    # serve the production build
npm run lint     # eslint (next/core-web-vitals + next/typescript)
```

Vitest covers calculations, optimizer legality, formatting, and versioning. Verify model changes with `npm test`, `npm run recompute`, `npm run sweep`, and `npm run build`. Path alias `@/*` maps to the repo root.

> Per `AGENTS.md`: this is a non-standard Next.js build with breaking changes from training data. When touching App Router internals, routing, or framework APIs, consult `node_modules/next/dist/docs/` rather than assuming conventions.

## Architecture

### The model lives in `lib/` (this is the heart of the project)

The cost model is a layered pipeline of pure functions and constants. Changes to procurement economics happen here, not in components:

- **`lib/process-templates.ts`** — the foundational data layer. Defines the 7 `ProcessType`s (grouped into strategic / policy-driven / operational layers), 4 `TechLevelId`s, 6 `StakeholderRole`s, per-process `ProcessStep[]` templates (rigid vs. flexible day counts, mandatory-wait flags, per-role participation hours), and the `PROCESS_RIGIDITY` index. The `derive*` functions (`deriveRigidDays`, `deriveFlexibleDays`, `deriveStaffCost`) apply contextual multipliers based on the Direct/Indirect × Upstream/Downstream dimensions. **All business-logic constants belong here — never inline magic numbers in components.**
- **`lib/calculations.ts`** — neutral 7-dimension model 2.0. Competition, contract rigidity, TCO capture, workflow, and bypass are separate. `calculateCosts` returns a central point plus a low/high scenario interval; TCO and bypass ranges are assumptions, not sourced probabilities.
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
- **Site versioning**: the version is Tesla-style `ISO-week-year.ISO-week.release.patch`, computed at build time with `release.patch` defaulting to `1.1` (for example `2026.29.1.1` on 13 July 2026). `lib/version-core.ts` is the single generator; `next.config.ts` injects its result as `NEXT_PUBLIC_VERSION`. To pin a later release in the same week, run `NEXT_PUBLIC_VERSION=2026.29.2.1 npm run build`. The quantitative model has a separate semantic version in `lib/version.ts`.
- **No JSX comments** (`{/* */}`) in returned markup, no `useEffect` for derived values, no new chart libraries — see the Anti-patterns section of `CLAUDE_DESIGN.md`.

## Repo sync (machine-specific)

This working copy lives in an iCloud-synced folder shared with another machine ("Rokale"); GitHub `main` is the source of truth. `bin/claude-pull.sh` / `bin/claude-push.sh` and `SYNC.md` document the pull-before / push-after workflow. Never let `node_modules`, `.next`, `.turbo`, or `build` enter iCloud (`.gitignore` handles this).

## Research docs (not code)

`RESEARCH.md`, `PHD_ROADMAP.md`, `CHANGELOG.md`, `docs/MODEL_PARAMETERS.md`,
`docs/articles/doktorat/00-shared-foundation.md`, and `docs/research/` are the
active academic materials. Everything under `docs/archive/model-1.x/` is historical
provenance and must never be used as a current parameter, citation or instruction source.

- **`docs/MODEL_PARAMETERS.md`** is the model-2.0 source of truth. Reconcile every formula or scenario-bound change there.
- **Neutrality invariant (load-bearing).** Never tune parameters to preserve Tunnel–Field. Public comparisons must remain lawful under PZP. Always display scenario uncertainty, allow sign reversal, and distinguish empirical anchors from Grade-C path profiles. Szucs monetizes the price channel only; Beuve applies to contractual rigidity only; theory does not provide bypass probabilities.
