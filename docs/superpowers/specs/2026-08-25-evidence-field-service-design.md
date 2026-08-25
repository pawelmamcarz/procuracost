# ProcuraCost Evidence Field Service Design

**Status:** approved by the product owner on 2026-08-25

## Goal

Rebuild ProcuraCost as a manager-first, research-backed decision service. The public experience must help a procurement manager compare a real purchase while preserving the model's neutrality, evidential limits, and reproducibility.

## Product hierarchy

The primary job is to compare a purchase scenario. The calculator is therefore the main homepage action. The optimizer and descriptive self-assessment remain supporting tools. Research material supplies trust and scrutiny rather than competing with the tools in the primary navigation.

The four user journeys are:

1. **Compare a purchase:** calculator, interpretation, versioned export.
2. **Choose a lawful path:** optimizer, explanation, calculator.
3. **Reflect on the process:** descriptive self-assessment, relevant next action.
4. **Scrutinize the model:** model, assumptions, methodology, paper, replication.

## Information architecture

Polish remains the root language and English remains under `/en`. The two route trees stay separate because that is the repository contract. Shared components, typed dictionaries, and a route manifest remove accidental drift without introducing a dynamic locale segment.

The homepage sequence is:

1. Hero with one primary action: calculate a scenario.
2. The signature boundary diagram: tunnel, `∂Φ`, admissible field.
3. A compact model contract: model version, uncertainty, no assumed winner.
4. Three user jobs: compare costs, choose a path, assess a process.
5. Decision map based on the same combined uncertainty contract as the calculator.
6. Comparable scenario records.
7. Evidence chain: assumptions, methodology, paper, replication.
8. Neutral final action to calculate the user's own case.

Team content leaves the homepage. Shortcasts are not promoted in primary navigation until real published episodes and owned distribution links exist. Placeholder links and collection forms are removed.

The language switch preserves route context whenever a counterpart exists. Intentional exceptions remain explicit: `/research` is the canonical English working paper and `/en/research` redirects there; `/research-agenda` remains a Polish-tree research surface without a fabricated translated counterpart.

## Visual direction: Evidence Field

The service uses an analytical, institutional visual language rather than a generic SaaS card catalogue or an editorial newspaper pastiche.

### Palette

No new semantic colors are introduced.

| Token | Value | Role |
| --- | --- | --- |
| Canvas | `#f9fafb` | page background |
| Ink | `#111827` | primary text |
| Action | `#2563eb` | links and primary actions |
| Tunnel | `#dc2626` | formal/sequential path only |
| Field | `#16a34a` | adaptive/compliant path only |
| Boundary | `#fbbf24` | assumptions and constraints |

Red and green identify paths. They never act as a universal expensive/cheap scale. Comparative magnitude uses ink, gray, action blue, signs, and labels.

### Typography

Public Sans is the interface and reading face. IBM Plex Mono is reserved for model versions, numeric values, assumptions, and notation. Both are self-hosted by `next/font`. The existing accidental Arial override is removed.

### Signature

The memorable element is the decision boundary:

```text
tunnel  ->  ∂Φ = {authority, competition, ethics, documentation}  ->  admissible field
```

The field is bounded. The interface must not imply infinite or unconstrained freedom. The homepage signature is static. Existing result transitions must be disabled when the user prefers reduced motion.

### Layout rules

- Use one analytical column system at `max-w-5xl` for both languages.
- Prefer rules, tables, aligned values, and open whitespace to nested rounded cards.
- Use at most one emphasized surface per section.
- Remove gradients from page heroes and calls to action. The existing result summary may retain its gradient as the single emphasized analytical surface.
- Use numbered markers only for a real sequence.
- Keep visible keyboard focus and usable mobile layouts at 390 px.

## Voice and editorial rules

The voice is precise, calm, and decision-oriented.

- State the mechanism first, then the result, condition, and limitation.
- Use short sentences and active verbs.
- Do not promise savings, losses, transformation, or a winner.
- Remove formulaic contrasts, corporate filler, decorative badges, and prose em dashes.
- Preserve en dashes in numeric ranges, mathematical minus signs, arrows, citations, and canonical notation.
- Keep Polish interfaces Polish and English interfaces English, except proper names and necessary domain terms.
- Use `MODEL_VERSION` for current public version labels. Historical descriptions of earlier models may retain their original version.

## Integrity requirements

1. `MODEL_VERSION = 2.2.2` is the current public model version.
2. The decision map must classify a point from `uncertainty.lowDelta` and `uncertainty.highDelta`, the full evidence and structural cross-product. Evidence-only bands cannot be called robust.
3. All ten fixed reference scenarios may cross zero under the audited envelope. Public copy must not imply otherwise.
4. Cost of delay is a template-day difference multiplied by a user-supplied cost, not an empirical effect.
5. The optimizer remains illustrative, rule-based, legally filtered, and unvalidated on outcome data.
6. The self-assessment remains descriptive and unvalidated. It must not be sold as an audit.
7. No parameter may be changed to preserve a Tunnel–Field result.

## Localization and route contract

A typed route manifest owns public route pairs, navigation exposure, sitemap exposure, and intentional exceptions. It must support:

- context-preserving language switches;
- parity tests for normal route pairs;
- complete sitemap coverage of indexable routes;
- omission of unpublished or untranslated surfaces from primary navigation;
- the canonical `/research` exception.

Shared homepage content lives in `lib/i18n.ts` and a single language-aware component. Page files own only language-specific metadata and the `lang` prop.

## Accessibility and interaction

- Dynamic results receive programmatic focus or a live-region announcement.
- Programmatic scrolling respects `prefers-reduced-motion`.
- The mobile menu has localized labels, `aria-controls`, Escape handling, active-route state, and visible focus.
- Charts retain textual explanations. Color is never the only signal.
- The decision map remains horizontally usable on small screens and exposes an accurate accessible label.

## Technical hygiene

- Install the locked dependencies before implementation so local execution uses Next 16.3.1.
- Set an explicit absolute `turbopack.root` to stop Next from selecting the unrelated home-level lockfile.
- Follow the installed Next 16.3.1 guides for internationalization, metadata, sitemap, fonts, and Turbopack.
- Do not introduce a backend, database, external lead service, new chart library, or dynamic locale middleware.

## Verification

Every behavior change follows red-green-refactor where an automated boundary exists. The completed branch must pass:

```bash
npm run lint
npm test
npm run recompute
npm run sweep
npm run build
```

Browser verification covers `/`, `/en`, `/calculator`, `/en/calculator`, the language switch, mobile navigation, decision-map copy, and representative research routes at desktop and 390 px widths.

## Explicitly out of scope

- Changing model parameters or formulas to obtain a preferred result.
- New data collection, research recruitment, accounts, database, or API.
- Publishing podcast channels without real owned URLs.
- Push, merge, production deployment, or remote data changes without a separate instruction.
