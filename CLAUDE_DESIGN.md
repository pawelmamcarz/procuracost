# Design System: ProcuraCost

## Colour semantics

Every new UI element maps to one of these roles. Do not introduce new palette
entries.

| Role | Tailwind border/bg/text | Use when |
|---|---|---|
| Primary action | `blue-500/600`, `blue-50`, `blue-700` | Buttons, links, selected controls, comparison marks |
| Formal/sequential | `red-200/300`, `red-50`, `red-600/700/900` | The formal/sequential workflow only |
| Adaptive/compliant | `green-200/400`, `green-50`, `green-600/700` | The adaptive/compliant workflow only |
| Readiness to complete | `amber-400`, `amber-50`, `amber-800` | Self-described work still to complete |
| Readiness not met | `gray-300`, `gray-100`, `gray-700/900` | A self-described condition not currently met |
| Readiness confirmed | `blue-200/500`, `blue-50`, `blue-700` | A self-described condition confirmed by the respondent |
| Section surface | `gray-50`, `gray-100`, `border-gray-100` | Quiet grouped sections |
| Text hierarchy | `gray-900` → `gray-700` → `gray-600` → `gray-400` | h → body → label → meta/source |
| Legal lock | `amber-400`, `amber-50`, `amber-800` | Fixed legal provenance and mandatory waits |

Chart colour constants (Recharts): formal/sequential = `#ef4444`,
adaptive/compliant = `#22c55e`, delta = `#3b82f6`.

Red and green identify the two compared alternatives only. Never use them for a
positive/negative judgement, validated readiness or generic cost magnitude. Use the
neutral grey scale and action blue for magnitude.

## Typography

Use Public Sans for interface and body text. Use IBM Plex Mono for numeric values, assumptions, version strings, and notation. Do not use prose em dashes; use a full stop, colon, or parentheses when the sentence needs a pause.

```
Labels above inputs:  text-xs font-medium text-gray-600 mb-1
Section titles:       text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3
Body text:            text-sm text-gray-700
Small body / notes:   text-xs text-gray-500 leading-relaxed
Monospace values:     font-mono text-xs
Math / formulas:      font-mono text-xs text-gray-400
Source citations:     text-xs text-gray-400
Numeric highlights:   text-2xl font-bold text-blue-700
```

Use tabular numerals for ranges, costs and elapsed days. Use plain-language
headings for procurement decisions. Internal identifiers may appear only in
monospace provenance or export views.

## Visual composition

The product should read as a procurement working paper made interactive. Build
hierarchy with spacing, rules, aligned labels and connected visual elements.
Do not default to a dashboard grid of rounded text boxes.

- Use bordered sections only where a boundary has meaning, such as a legal lock,
  editable workspace or evidence docket.
- Prefer border-left annotations, horizontal rules, definition lists and
  connected rails over repeated cards.
- Pair formal/sequential and adaptive/compliant values in aligned rows with
  equal visual status.
- Avoid visual winner treatments. No trophy, tick, medal, green success panel or
  dominant callout may identify a lower-cost alternative.
- Do not use gradients or shadows. Depth comes from spacing, line weight and
  typography.
- Do not render an important diagram as a table with text inside framed cells.

## Decision-register architecture

The primary product metaphor is a decision register. It should explain the
service before exposing model detail.

- The global navigation has two destinations: comparison and research.
  Suitability, workflow profile and implementation readiness remain contextual
  supporting tools.
- The homepage leads with one promise, two explicit entry paths, the structure
  of the resulting record and the four-stage practical journey.
- The practical journey uses four stages in this order: case, workflows, costs,
  record. Render one active stage at a time.
- Use a cobalt vertical rule with numbered points as the signature motif for a
  record, sequence or provenance chain. The line represents traceability, not
  progress scoring.
- User-defined alternative names may aid recognition, but the canonical formal
  sequential and adaptive compliant types must remain visible beside them.
- Implementation readiness may be offered only after a cost record exists and
  must remain independent of the cost difference.
- Browser draft persistence is opt-in. A shared URL never contains process-map
  edits, custom labels or economic inputs beyond the registered base scenario.

## Signature process rail

The calculator's primary visual is a connected procurement process rail, not a
table or a stack of text cards.

- Render one swimlane per alternative with a persistent lane label.
- Connect steps with visible lines and arrow direction. Parallel branches must
  separate spatially and rejoin visibly.
- Use compact node geometry with an icon, short label and essential duration.
  Detailed assumptions belong in the inspector panel.
- Mark the critical path with line weight and blue emphasis without hiding the
  other branch.
- Show mandatory legal waits with a lock icon, amber accent, source reference
  and non-editable state in both lanes.
- Keep both lanes on the same horizontal scale where space permits. On mobile,
  use a readable vertical sequence with connectors intact.
- Animate only the focused transition between a selected node and its inspector.
  Respect `prefers-reduced-motion`.

The secondary boundary visual may use the Tunnel and Field metaphor, but it must
show a bounded field and must never imply that compliance disappears.

## Page and section patterns

Page headers use a quiet editorial composition: eyebrow, clear title, one short
description and optional provenance line. A solid blue action band is acceptable
only for a single high-priority next step. Page heroes must not use gradients.

For dense model output, use this order:

1. Compared alternatives and interpretation boundary
2. Central values and declared ranges
3. Driver analysis
4. Monetisation coverage and non-monetised dimensions
5. Assumptions, evidence and legal provenance
6. Export actions

Do not collapse assumptions or evidence behind vague labels such as "Learn
more". A decision record must make its coverage limits visible before export.

## Button patterns

Primary action:
```tsx
className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
```

Selected neutral control:
```tsx
className="rounded-lg border border-blue-500 bg-blue-50 text-blue-700"
```

Idle control:
```tsx
className="rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
```

Controls that change the legal boundary or scenario use explicit labels. Do not
encode axis type only through colour. Destructive process-map actions require a
text label and an undo path. Locked legal steps never expose an edit or delete
action.

## Layout

- Page max width: `max-w-5xl mx-auto px-6 py-12`
- Reading width: `max-w-3xl`
- Two-column workspace: `grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]`
- Paired values: `grid grid-cols-1 gap-3 sm:grid-cols-2`
- Form section spacing: `space-y-6`
- Within-section spacing: `space-y-3`

Do not force a five-column grid onto mobile. Process maps, evidence records and
readiness questions must remain readable at 320 CSS pixels without horizontal
page scrolling.

## Recharts conventions

Use locale-aware formatting for decision-record charts. Do not import legacy
calculations into a native component merely for display formatting.

```tsx
const formatValue = (value: number) =>
  new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    maximumFractionDigits: 0,
  }).format(value);

<ResponsiveContainer width="100%" height={240}>
  <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
    <YAxis tickFormatter={formatValue} />
    <Tooltip formatter={(v) => formatValue(Number(v))} />
    <Bar dataKey="formalSequential" fill="#ef4444" />
    <Bar dataKey="adaptiveCompliant" fill="#22c55e" />
  </BarChart>
</ResponsiveContainer>
```

Do not use radar charts for procurement suitability or readiness. Those
constructs are not weighted scores. A chart must include a text equivalent and
must not communicate status through colour alone.

## i18n pattern

All user-facing strings go through `lib/i18n.ts`, including validation, PDF and
research-export labels. Polish and English dictionaries must have matching leaf
paths. English copy uses British spelling.

The `lang === "en" ? "…" : "…"` exception is reserved for short units. Do not
use it for sentences, headings, metadata or error messages.

## Procurement terminology

Use these terms consistently:

| Concept | Polish | English |
|---|---|---|
| Legal and governance boundary | Ramy prawne i ład zakupowy | Legal and governance boundary |
| Purchase archetype | Archetyp zakupu | Purchase archetype |
| Procurement workflow design | Projekt przebiegu procesu zakupowego | Procurement workflow design |
| Purchase execution channel | Kanał realizacji zakupu | Purchase execution channel |
| System support | Wsparcie systemowe | System support |
| Contract design | Konstrukcja umowy | Contract design |
| Organisational implementation readiness | Gotowość organizacyjna do wdrożenia | Organisational implementation readiness |
| Business requestor | Wnioskodawca biznesowy | Business requestor |
| Contracting authority under PZP | Zamawiający | Contracting authority |
| Terms of reference under PZP | SWZ or opis potrzeb i wymagań | Procurement documents or description of needs and requirements |

Reserve `Zamawiający` for the PZP context. Use `Wnioskodawca biznesowy`
elsewhere. Do not use the obsolete `SIWZ` term.

## Tunnel and Field metaphor

The metaphor is a secondary explainer, not the model's public data contract.

| Concept | Polish | English |
|---|---|---|
| Prescribed sequential workflow | tunel | tunnel |
| Policy-bounded adaptive workflow | pole | field |
| Mandatory waiting period | obowiązkowy termin oczekiwania | mandatory wait |
| Informal bypass | obejście procesu | process bypass |
| Boundary constraint | granica | boundary |

Canonical tagline: **"Tunel ma ściany. Pole ma horyzont."** / **"A tunnel has walls. A field has a horizon."**

The mathematical notation `∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}` (PL) / `∂Φ = {auth, competition, ethics, docs}` (EN) is canonical. Use it wherever the formal model is referenced.

The field is bounded by the same admissibility constraints as the tunnel. Any field visual must show that boundary and must not imply an unbounded or infinite option space.

## Accessibility

- Every status combines text, icon and colour.
- Use native fieldsets and legends for suitability and readiness choices.
- Focus the summary heading after a completed readiness self-description.
- Process-map nodes are keyboard reachable and expose their lane, lock state,
  duration and predecessors to assistive technology.
- Iframes have a localised accessible title and never autoplay.
- Keep visible focus rings. Do not remove outlines without an equivalent.
- Honour reduced motion and maintain WCAG AA text contrast.

## Anti-patterns

- No inline hex colour values in `className`. Use semantic Tailwind classes only.
- No `useEffect` for values derivable from props/state. Compute inline or with `useMemo`.
- No new chart libraries. Use only Recharts, which is already a dependency.
- No magic numbers or legal rules in components. Use named native model constants.
- No JSX comments (`{/* comment */}`) in returned markup. They add noise, remove them.
- No multi-paragraph docstrings or comment blocks on functions.
- No prose em dashes.
- No gradients, shadows or glass effects.
- No generic card grid for a process, evidence chain or decision record.
- No public scoring, ranking, preferred-procedure badge or aggregate capability percentage.
- No `grid-cols-5` on mobile.
