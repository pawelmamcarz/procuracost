# Evidence Field Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn ProcuraCost into a manager-first, research-backed service with one bilingual Evidence Field homepage, honest public model language, consistent routing, and accessible decision tools.

**Architecture:** Keep the separate PL and EN App Router trees, but move shared route behavior, homepage composition, and public copy into typed modules. Correctness-sensitive map classification becomes a pure tested helper that consumes the existing model's combined uncertainty output. UI work does not change model parameters.

**Tech Stack:** Next.js 16.3.1 App Router, React 19.2, TypeScript, Tailwind CSS 4, Vitest 3, Recharts 3.

**Spec:** `docs/superpowers/specs/2026-08-25-evidence-field-service-design.md`

## Global Constraints

- `MODEL_VERSION = 2.2.2` is the only current public model version.
- Do not change model parameters, process templates, calculations, optimizer weights, or scenario inputs to influence the Tunnel–Field result.
- All user-facing shared strings go through `lib/i18n.ts`; PL and EN remain separate route trees.
- `/research` remains the canonical English paper and `/en/research` remains its redirect.
- Red identifies the formal path, green identifies the adaptive path, blue identifies actions, and amber identifies assumptions.
- Do not add a backend, external form provider, database, chart library, locale middleware, or dynamic `[lang]` tree.
- Public prose contains no em dash. Numeric ranges, mathematical minus signs, arrows, and canonical notation are preserved.
- Before changing App Router APIs, use the installed guides under `node_modules/next/dist/docs/`.

---

### Task 1: Typed route manifest and contextual language switch

**Files:**
- Create: `lib/site-routes.ts`
- Create: `tests/site-routes.test.ts`
- Modify: `components/AppShell.tsx`
- Modify: `components/NavBar.tsx`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Produces: `SITE_ROUTES`, `localizedCounterpart(pathname, targetLang)`, `navigationFor(lang)`, and `sitemapPaths()`.
- Consumers: AppShell, NavBar, sitemap, and later homepage evidence links.

- [ ] **Step 1: Write failing route-contract tests**

```ts
import { describe, expect, it } from "vitest";
import { localizedCounterpart, navigationFor, sitemapPaths } from "@/lib/site-routes";

describe("public route contract", () => {
  it("keeps language switches on the equivalent route", () => {
    expect(localizedCounterpart("/calculator", "en")).toBe("/en/calculator");
    expect(localizedCounterpart("/en/model/assumptions", "pl")).toBe("/model/assumptions");
  });

  it("keeps the working paper canonical at /research", () => {
    expect(localizedCounterpart("/research", "en")).toBe("/research");
    expect(localizedCounterpart("/en/research", "pl")).toBe("/research");
  });

  it("exposes no placeholder shortcast navigation", () => {
    expect(navigationFor("pl").some((item) => item.href.includes("shortcasty"))).toBe(false);
    expect(navigationFor("en").some((item) => item.href.includes("shortcasty"))).toBe(false);
  });

  it("includes every indexable bilingual route in the sitemap", () => {
    expect(sitemapPaths()).toEqual(expect.arrayContaining([
      "/methodology", "/en/methodology", "/team", "/en/team",
    ]));
  });
});
```

- [ ] **Step 2: Run the test and verify the missing-module failure**

Run: `npm test -- tests/site-routes.test.ts`

Expected: FAIL because `@/lib/site-routes` does not exist.

- [ ] **Step 3: Implement the typed manifest**

Use a literal route array with `pl`, optional `en`, `nav`, `sitemap`, and localized labels. `localizedCounterpart` must preserve query/hash suffixes and fall back to the target-language homepage only when no counterpart exists. Mark research as a canonical exception and shortcasts as non-navigation surfaces.

- [ ] **Step 4: Wire the manifest into chrome and sitemap**

AppShell derives items and the contextual language target from the manifest. NavBar receives `lang`, `pathname`, localized menu labels, and active state. Sitemap uses `sitemapPaths()` and adds localized alternates only for genuine route pairs.

- [ ] **Step 5: Run focused and full tests**

Run: `npm test -- tests/site-routes.test.ts && npm test`

Expected: route tests and all existing tests PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/site-routes.ts tests/site-routes.test.ts components/AppShell.tsx components/NavBar.tsx app/sitemap.ts
git commit -m "fix: make bilingual routing contextual"
```

### Task 2: Public-version and editorial integrity gate

**Files:**
- Create: `tests/public-content.test.ts`
- Modify: `app/layout.tsx`
- Modify: `app/en/layout.tsx`
- Modify: `app/model/page.tsx`
- Modify: `app/en/model/page.tsx`
- Modify: `app/model/assumptions/layout.tsx`
- Modify: `app/en/model/assumptions/layout.tsx`
- Modify: `app/model/assumptions/page.tsx`
- Modify: `app/en/model/assumptions/page.tsx`
- Modify: `app/assessment/page.tsx`
- Modify: `app/en/assessment/page.tsx`
- Modify: `app/research-agenda/page.tsx`
- Modify: `app/shortcasty/page.tsx`
- Modify: `app/en/shortcasty/page.tsx`
- Modify: `app/shortcasty/[slug]/page.tsx`
- Modify: `lib/i18n.ts`
- Modify: `lib/shortcasty.ts`
- Modify: `lib/scenarios.ts`

**Interfaces:**
- Consumes: `MODEL_VERSION` from `lib/version.ts`.
- Produces: a regression test that prevents current public surfaces from drifting back to 2.1 or placeholder calls to action.

- [ ] **Step 1: Write the failing integrity test**

The test reads the listed current public files and asserts that they contain neither `formspree.io/f/placeholder`, `href: "#"`, nor current-facing phrases such as `Model 2.1`, `modelu 2.1`, or `ProcuraCost 2.1`. Keep an explicit allow-list for historical comparison sentences in `lib/i18n.ts`; do not scan research history or changelogs.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/public-content.test.ts`

Expected: FAIL on stale 2.1 labels and placeholder Shortcast links.

- [ ] **Step 3: Replace current labels with `MODEL_VERSION`**

Import `MODEL_VERSION` in server metadata and page modules. Add the version to assessment dictionaries through interpolation. Leave sentences that explicitly describe what model 2.1 used to do unchanged.

- [ ] **Step 4: Make Shortcasts honest**

Remove platform arrays, `href="#"`, the placeholder Formspree form, the EN `mailto:` subscription promise, and the biweekly publishing promise. Present the route as a planned source-bounded editorial series with no collection action. Keep it outside primary navigation and sitemap until an episode has a real `publishedAt` and owned URL.

- [ ] **Step 5: Remove high-confidence AI tells**

Replace current-facing em-dash constructions with sentences, commas, or colons. Change outcome-assumptive copy to task language. Do not touch numeric ranges, citations, formulas, or historical correction prose.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- tests/public-content.test.ts && npm test && npm run lint`

```bash
git add tests/public-content.test.ts app lib/i18n.ts lib/shortcasty.ts lib/scenarios.ts
git commit -m "fix: align public copy with model 2.2.2"
```

### Task 3: Decision map on the full uncertainty contract

**Files:**
- Create: `lib/decision-map.ts`
- Create: `tests/decision-map.test.ts`
- Modify: `components/DecisionMap.tsx`
- Modify: `lib/i18n.ts`

**Interfaces:**
- Produces: `classifyDecisionRange(lowDelta, highDelta)` and `buildDecisionRegimes()`.
- Consumes: `calculateCosts(inputs).uncertainty.lowDelta/highDelta` and central `delta`.

- [ ] **Step 1: Write failing classification tests**

```ts
import { describe, expect, it } from "vitest";
import { classifyDecisionRange } from "@/lib/decision-map";

describe("decision-map uncertainty classification", () => {
  it("calls formal robust only when the whole combined range is negative", () => {
    expect(classifyDecisionRange(-20, -1)).toBe("formal");
  });

  it("calls adaptive robust only when the whole combined range is positive", () => {
    expect(classifyDecisionRange(1, 20)).toBe("adaptive");
  });

  it("calls assumptions decisive whenever the combined range crosses zero", () => {
    expect(classifyDecisionRange(-1, 20)).toBe("undecided");
    expect(classifyDecisionRange(-20, 1)).toBe("undecided");
  });
});
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/decision-map.test.ts`

Expected: FAIL because the pure helper does not exist.

- [ ] **Step 3: Implement point classification and regime compression**

For each reference row, evaluate daily inaction costs from 0 to 6,000 PLN in 100 PLN increments. At each point call the real `calculateCosts` and classify from the combined low/high deltas. Compress adjacent equal classifications into SVG segments. Derive the central marker from `decisionThreshold.breakEvenDailyCostOfInaction`; do not reconstruct model formulas.

- [ ] **Step 4: Rebuild the component copy and semantics**

Move DecisionMap strings into a typed `decisionMapT` dictionary. State that bands cover evidence and structural assumptions and are not confidence intervals. Use the existing chart constants for path colors and a textual legend, so color is not the only signal.

- [ ] **Step 5: Verify model-sensitive work**

Run: `npm test -- tests/decision-map.test.ts && npm test && npm run recompute && npm run sweep && npm run build`

Expected: all commands PASS; recompute retains the context-uplift invariant and sweep still covers 12,960 configurations.

- [ ] **Step 6: Commit**

```bash
git add lib/decision-map.ts tests/decision-map.test.ts components/DecisionMap.tsx lib/i18n.ts
git commit -m "fix: align decision map with combined uncertainty"
```

### Task 4: Shared Evidence Field homepage

**Files:**
- Create: `components/EvidenceFieldHome.tsx`
- Create: `components/BoundaryField.tsx`
- Create: `tests/home-content.test.ts`
- Modify: `app/page.tsx`
- Modify: `app/en/page.tsx`
- Modify: `lib/i18n.ts`
- Modify: `lib/scenarios.ts`

**Interfaces:**
- Produces: `EvidenceFieldHome({ lang }: { lang: Lang })` and `homeT`.
- Consumes: `MODEL_VERSION`, `SCENARIOS`, `calculateCosts`, `DecisionMap`, and route-manifest URLs.

- [ ] **Step 1: Write failing content-contract tests**

Assert PL/EN dictionary key parity, the canonical tagline, neutral primary CTA, the exact `∂Φ` notation, current model version, and absence of phrases equivalent to “see how much your organization is losing.” Also assert English case-study records have English titles and sources.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/home-content.test.ts`

Expected: FAIL because `homeT` and English case-study fields do not exist.

- [ ] **Step 3: Add typed bilingual homepage content**

Add `homeT` to `lib/i18n.ts`. Extend case-study data with `titleEn` and `sourceEn` where the visible title or source is language-specific. Do not rewrite evidence claims or scenario inputs.

- [ ] **Step 4: Build the signature and shared page**

Implement the approved sequence from the spec. Use semantic sections, rules, aligned values, and a scenario table rather than repeated card grids. The `BoundaryField` must show a bounded field, the canonical boundary notation, and no infinity symbol.

- [ ] **Step 5: Reduce route pages to metadata wrappers**

Both route files render the same shared component with `lang="pl"` or `lang="en"`. Metadata remains localized and uses no prose em dash.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- tests/home-content.test.ts && npm test && npm run lint && npm run build`

```bash
git add components/EvidenceFieldHome.tsx components/BoundaryField.tsx tests/home-content.test.ts app/page.tsx app/en/page.tsx lib/i18n.ts lib/scenarios.ts
git commit -m "feat: introduce the Evidence Field homepage"
```

### Task 5: Typography, component semantics, and accessible result reveal

**Files:**
- Create: `components/result-reveal.ts`
- Create: `tests/result-reveal.test.ts`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `next.config.ts`
- Modify: `components/CalculatorClient.tsx`
- Modify: `components/EnCalculatorClient.tsx`
- Modify: `components/PathOptimizer.tsx`
- Modify: `components/PipeFieldDiagram.tsx`
- Modify: `components/cost-comparison/CostMatrix.tsx`
- Modify: `components/SiteFooter.tsx`

**Interfaces:**
- Produces: `scrollBehaviorFor(reducedMotion)` and `revealResult(element)`.
- Consumes: result container refs in calculator and optimizer.

- [ ] **Step 1: Write the failing motion-policy test**

```ts
import { expect, it } from "vitest";
import { scrollBehaviorFor } from "@/components/result-reveal";

it("disables smooth scrolling for reduced motion", () => {
  expect(scrollBehaviorFor(true)).toBe("auto");
  expect(scrollBehaviorFor(false)).toBe("smooth");
});
```

- [ ] **Step 2: Verify RED, then implement result reveal**

`revealResult` focuses a `tabIndex={-1}` results region and calls `scrollIntoView` with behavior selected from `matchMedia("(prefers-reduced-motion: reduce)")`. Result containers use `aria-live="polite"` and an accessible label.

- [ ] **Step 3: Apply approved typography and Turbopack root**

Use `Public_Sans` and `IBM_Plex_Mono` through `next/font/google` variables. Wire those variables into Tailwind theme tokens and remove the Arial override. Set `turbopack.root` to the absolute `process.cwd()` project directory while retaining the documented memory experiment.

- [ ] **Step 4: Correct remaining semantic visuals**

Remove the infinity claim from `PipeFieldDiagram`. Use a neutral blue/gray magnitude scale in CostMatrix rather than red/green cost coloring. Restrict footer colors to the documented palette and remove decorative rainbow assignment.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/result-reveal.test.ts && npm test && npm run lint && npm run build`

Confirm the build output contains no inferred-workspace-root warning.

```bash
git add components/result-reveal.ts tests/result-reveal.test.ts app/layout.tsx app/globals.css next.config.ts components
git commit -m "fix: make the interface semantic and accessible"
```

### Task 6: Team and secondary-surface editorial cleanup

**Files:**
- Create: `components/TeamPage.tsx`
- Modify: `app/team/page.tsx`
- Modify: `app/en/team/page.tsx`
- Modify: `components/SiteFooter.tsx`
- Modify: `CLAUDE_DESIGN.md`

**Interfaces:**
- Produces: one shared bilingual team component and updated design-system enforcement notes.
- Consumes: existing verified names and LinkedIn URLs; no new claims or logos.

- [ ] **Step 1: Extend the public-content test and verify RED**

Add assertions that active team pages contain none of `pełne e2e kompletnego`, `procurement ecosystem`, or `deep tech wizard`, and that shared team content has PL/EN parity.

- [ ] **Step 2: Implement factual team copy**

Describe roles with concrete nouns such as procurement, analytics, systems, implementation, negotiation, and research. Do not claim universal project experience. Use one neutral visual treatment for people and competencies.

- [ ] **Step 3: Update the design-system document**

Record Public Sans and IBM Plex Mono, the no-prose-em-dash rule, the no-gradient-page-hero rule, the bounded-field requirement, and the rule that red/green never encode generic cost magnitude.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/public-content.test.ts && npm test && npm run lint && npm run build`

```bash
git add components/TeamPage.tsx app/team/page.tsx app/en/team/page.tsx components/SiteFooter.tsx CLAUDE_DESIGN.md tests/public-content.test.ts
git commit -m "refactor: make secondary surfaces factual and consistent"
```

### Task 7: Full verification and browser acceptance

**Files:**
- Modify only if verification exposes a regression.

**Interfaces:**
- Consumes every deliverable above.
- Produces fresh command evidence and desktop/mobile visual evidence.

- [ ] **Step 1: Run the complete repository gate**

```bash
npm run lint
npm test
npm run recompute
npm run sweep
npm run build
```

Expected: lint exit 0, 0 failed tests, recompute invariant holds, sweep covers 12,960 configurations, build exit 0 on Next 16.3.1 with no wrong-root warning.

- [ ] **Step 2: Run static integrity scans**

Check current public files for placeholder links, accidental current-facing 2.1 labels, prose em dashes, JSX comments, and unapproved palette classes. Classify historical/version-comparison matches rather than deleting them mechanically.

- [ ] **Step 3: Browser-check desktop and mobile**

Verify `/`, `/en`, `/calculator`, `/en/calculator`, `/model`, `/en/model`, `/team`, `/en/team`, mobile navigation, contextual language switching, focus after results, and the combined-envelope Decision Map. Use default desktop viewport and 390×844 mobile viewport.

- [ ] **Step 4: Request whole-branch review**

Review the diff from the branch merge-base through HEAD against the spec. Fix every Critical or Important finding, rerun the affected focused tests, then rerun the complete repository gate.

- [ ] **Step 5: Commit verification-only fixes if any**

```bash
git add -u
git commit -m "fix: close Evidence Field review findings"
```
