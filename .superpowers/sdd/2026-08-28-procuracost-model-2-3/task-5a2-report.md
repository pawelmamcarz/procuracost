# Task 5A2 report: process-map workspace and shared rail UI

## Status

Task 5A2 is implemented and verified on `codex/model-2-3`.

- Reviewed start commit: `d427513cd17acd0649184b230bf6b531f2ecee29`
- Implementation commit: `c1caf7cb1160c8d3125d6b3d7fed1215a166281d`
- Commit message: `feat: add model 2.3 process-map workspace`
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
- `tabIndex={-1}`;
- `aria-labelledby="decision-record-heading"`;
- one `data-result-reveal="true"` boundary.

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
explicitly not reproduced.

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
editable nodes use unique predictable IDs. The focus resolver chooses the
visible viewport variant before focus transfer.

### Inspector, validation and focus

The selected-step inspector supports user label, allowed kind, active/queue
ranges, predecessors, role-hour ranges, non-labour cost, add, remove and one
level of undo. Locked legal steps remain selectable but show full read-only
provenance and no edit or remove control.

The validation summary renders only localised copy derived from typed issue
codes. It never prints the engine's `.message`. Invalid context, URL,
migration, design, calibrated range, custom-label or graph state disables the
submit button and associates it with `process-map-status`.

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

## Final verification

### Full tests

```text
npm test
Test Files 35 passed (35)
Tests 406 passed (406)
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
scripts, version and replication files have no Task 5A2 diff. Therefore model
recompute/sweep gates were not required by this UI-only slice.

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
