# Task 5A2 report: process-map workspace and shared rail UI

## Status

Task 5A2 is implemented and verified on `codex/model-2-3`.

- Reviewed start commit: `d427513cd17acd0649184b230bf6b531f2ecee29`
- Implementation commit: `c1caf7cb1160c8d3125d6b3d7fed1215a166281d`
- Commit message: `feat: add model 2.3 process-map workspace`
- Reviewer-fix commit: `a8974328ed3762eb342128f3591c03876668cd1b`
- Reviewer-fix message: `fix: harden calculator workspace contracts`
- Reviewer-fix round 2 commit: `0d99f86b32ab704cb55f85f12a922ee8c48bc494`
- Reviewer-fix round 2 message: `fix: restore result region focusability`
- Worktree: `/private/tmp/procuracost-model-2-3`

No public calculator client or route was cut over. No final decision-record
leaf, export UI, model-v2 contract, model parameter, script, version or
replication artefact was changed. No push, merge or deployment was performed.

## Delivered UI contracts

### Shared workspace

`components/calculator-v2/CalculatorWorkspace.tsx` exports one shared
`CalculatorWorkspace({ lang })` client owner and a controlled
`CalculatorWorkspaceView`. The controlled view accepts the reviewed workspace
state, state/copy handlers, an optional partial-migration control and an
optional typed `resultSlot`.

The result slot is rendered only when `state.record` exists and is contained by
one `CalculatorResultBoundary` with:

- `id="decision-record"`;
- `role="region"`;
- `aria-labelledby="decision-record-heading"`;
- `tabIndex={-1}`;
- one `data-result-reveal="true"` boundary.

The declarative decision-record focus target resolves to the labelled
`decision-record-heading`, which is programmatically focusable with
`tabIndex={-1}`. The surrounding article remains the labelled,
programmatically focusable region, but is not the reveal target.

The public owner bootstraps the current query after hydration through the
reviewed URL decoder and `createRenderableCalculatorWorkspaceState()`. Invalid
v2, ambiguous legacy and unrepresentable legacy states retain a renderable
default draft while their typed source gate blocks submission. A visible
action discards imported link state and starts from the currently displayed v2
base scenario.

### Context, provenance and economics

The three-stage PL/EN form renders the context axes in the specified order,
resolved mandatory waits under one amber legal boundary and compatible
workflow/contract IDs as read-only base-design provenance. No incompatible
design selector matrix is exposed.

The economic stage edits contract value, daily cost of inaction, the applicable
competition-transfer range and every role hourly-rate range. Amendment and TCO
differentials remain read-only at zero and off-process purchasing remains
reported but non-monetised. Accepted economic edits clear the current record
through the reviewed reducer.

Partial legacy confirmation lists every field with a professional localised
name, materialises representable retained inputs only through the reviewed
adapter and keeps unrepresentable changes fail-closed. The previous result is
explicitly not reproduced. A blocked confirmation retains the migration
panel, field list and checked control so the existing control can receive the
declared focus target; the control is removed only after adaptation reaches
`ready`.

The price-competition transfer range now has a dedicated typed `0..1`
validation issue. Its PL/EN message is rendered both in the general submit
summary and through `aria-invalid` / `aria-describedby` on all three members
of the affected range.

### Reusable process rail

`components/process-map/rail-view-model.ts` exports:

- `ProcessRailViewModel`;
- `BuildProcessRailViewModelOptions`;
- `buildProcessRailViewModel()`;
- `resolveProcessStepLabel()`.

`ProcessRail` has discriminated `editable` and `read-only` modes over the same
resolved view model. It renders one shared legal boundary, equal formal and
adaptive lanes, deterministic topological node order, orthogonal supplemental
desktop SVG connectors and separate vertical mobile sequences. The only local
horizontal overflow is the desktop graph viewport.

Lock, critical-path, parallel, selected and error meaning is carried by text
and accessible names as well as colour/icon cues. Desktop and mobile copies of
editable and read-only nodes use unique predictable IDs. Read-only nodes are
semantic keyboard focus stops without fake click behaviour. Visible and
accessible step numbering comes from the same topological position. The focus
resolver chooses the visible viewport variant before focus transfer.

### Inspector, validation and focus

The selected-step inspector supports user label, allowed kind, active/queue
ranges, predecessors, role-hour ranges, non-labour cost, add, remove and one
level of undo. Locked legal steps remain selectable but show full read-only
provenance and no edit or remove control.

Validation renders only localised copy derived from typed issue codes and never
prints the engine's `.message`. `process-map-status` receives only graph,
step, custom-label and step-editor issues. URL, migration, context, design,
economic, source and submit issues render in the separate
`calculator-submit-status` summary next to the submit action. The disabled
submit button references the applicable summary or both summaries.

Critical-path preview is owned by the pure
`deriveProcessMapCriticalPathPreview()` controller. It builds the reviewed
calculation input from `state.draft` and `state.urlGate`, then calls the engine.
Any blocked or rejected state fails closed to two empty paths; React no longer
assembles a partial input or calls `calculateComparison()` directly.

Declarative focus targets cover node, new-step label, lane add, migration
confirmation and decision record. Only successful record creation invokes the
existing reduced-motion-aware `revealResult()` boundary. Base-scenario sharing
uses only the v2 canonical scenario codec and displays the exact disclosure
that local map, label, date and economic edits are not serialised.

## TDD evidence

### Cycle 1: shared rail

RED: `tests/process-rail-ui.test.ts` failed because `ProcessRail` and its public
view model did not exist.

GREEN: the rail UI and pure layout suites passed, 9 tests total.

### Cycle 2: inspector

RED: `tests/process-step-inspector.test.ts` failed because the inspector did
not exist.

GREEN: inspector, rail UI and rail layout passed, 14 tests total.

### Cycle 3: workspace

RED: `tests/calculator-workspace-ui.test.ts` failed on the absent alternative
controls and workspace composition.

GREEN: the initial workspace contract passed, 10 tests total.

### Cycle 4: focus IDs

RED: two tests exposed duplicate node IDs across simultaneously rendered
desktop/mobile structures and the missing mobile focus-ID variant.

GREEN: workspace, rail and focus suites passed, 17 tests total.

### Cycle 5: URL bootstrap and migration language

Separate RED cases proved that the public owner did not yet consume the
reviewed URL bootstrap, migration field names were generic and blocked imported
state lacked a direct discard action. Each case was implemented and returned
GREEN before the next change.

Final focused A2 rendering suites:

```text
Test Files 4 passed (4)
Tests 24 passed (24)
exit 0
```

The wider A1/A2 focused gate passed 12 files and 133 tests before the final URL
and migration refinements.

### Reviewer fix round

Cycle 1 RED exposed that URL and migration failures were rendered under the
process-map heading and that the approved PL/EN valid-map literals were not
exact. GREEN separated map/general summaries and restored the exact copy;
`calculator-workspace-ui` passed 13/13.

Cycle 2 RED exposed premature migration-panel removal, the absent typed
competition-transfer upper bound and decision-record focus on the article.
GREEN retained the control until `ready`, linked the dedicated range issue to
all three inputs and moved focus to the heading; the focused pair passed
16/16.

Cycle 3 RED exposed array-position text in topologically ordered nodes,
non-focusable read-only nodes and React-local preview calculation. GREEN made
node position consistent, added semantic read-only focus stops and introduced
the fail-closed preview controller; the focused pair passed 10/10.

Final reviewer-fix focused gate:

```text
Test Files 8 passed (8)
Tests 114 passed (114)
exit 0
```

### Reviewer fix round 2

One static regression first failed because the result article retained its
stable ID, region role and heading relationship but no longer had
`tabIndex={-1}`. The minimal fix restored article focusability while keeping
`calculatorFocusTargetElementId({ kind: "decision-record" })` resolved to the
separately focusable `decision-record-heading`.

```text
npm test -- tests/calculator-workspace-ui.test.ts tests/calculator-focus-contract.test.ts
Test Files 2 passed (2)
Tests 16 passed (16)
exit 0

./node_modules/.bin/tsc --noEmit
exit 0

npm run lint
eslint
exit 0
```

## Final verification

### Full tests

```text
npm test
Test Files 36 passed (36)
Tests 413 passed (413)
exit 0
```

Vitest continues to print the existing Node `module.register()` deprecation
warning.

### Types and lint

```text
./node_modules/.bin/tsc --noEmit
exit 0

npm run lint
eslint
exit 0
```

### Configured build and fallback

The configured Turbopack build reproduced the documented managed-host
restriction before application compilation:

```text
npm run build
TurbopackInternalError: Failed to write app endpoint /sitemap.xml/route
creating new process
binding to a port
Operation not permitted (os error 1)
exit 1
```

The required webpack fallback passed on the final source:

```text
./node_modules/.bin/next build --webpack
Compiled successfully
Finished TypeScript
Generating static pages (34/34)
exit 0
```

### Boundary and source checks

```text
git diff --cached --check
exit 0

rg 'gradient|shadow-|<table|grid-cols-5|transition-|animate-' components/calculator-v2 components/process-map
no matches

rg 'overflow-x-auto' components/calculator-v2 components/process-map
components/process-map/ProcessRail.tsx: one match
```

`lib/model-v2`, public route trees, `CalculatorClient`, `EnCalculatorClient`,
scripts, version and replication files have no Task 5A2 or reviewer-fix diff.
Therefore model recompute/sweep gates were not required by this UI-only slice.

## Verification boundary retained for Task 7

Node static rendering verifies semantic structure, written status, ID
uniqueness, SVG suppression, PL/EN leaf parity and rejected source patterns. It
does not prove computed 320 px layout, actual browser tab order, focus transfer,
scroll position, clipboard permission or reduced-motion media-query behaviour
inside a live page. Those browser and mobile visual claims remain explicitly
assigned to Task 7.

The configured Turbopack build also remains an environment gap limited to the
managed host's denied internal port bind; the webpack production build is the
successful application-level build evidence.
