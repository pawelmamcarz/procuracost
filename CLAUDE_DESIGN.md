# Design System: ProcuraCost

## Color semantics

Every new UI element maps to one of these roles. Never introduce new palette entries.

| Role | Tailwind border/bg/text | Use when |
|---|---|---|
| Primary action | `blue-500/600`, `blue-50`, `blue-700` | Buttons, links, scenario pills, chart bars |
| Rigid / tunnel | `red-200/300`, `red-50`, `red-600/700/900` | PZP-EU steps, mandatory waits, tunnel metaphor |
| Flexible / field | `green-200/400`, `green-50`, `green-600/700` | policy_only, field metaphor |
| Process type selector | `indigo-400`, `indigo-50`, `indigo-700` | Process type toggle buttons |
| Tech level selector | `teal-400`, `teal-50`, `teal-700` | Technology level toggle buttons |
| Section surface | `gray-50`, `gray-100`, `border-gray-100` | Section card backgrounds |
| Text hierarchy | `gray-900` → `gray-700` → `gray-600` → `gray-400` | h → body → label → meta/source |
| Highlight accent | `amber-400`, `amber-50` | Warnings, bypass probability bar |

Chart color constants (Recharts): rigid = `#ef4444`, flexible = `#22c55e`, delta = `#3b82f6`.

Red and green identify rigid and flexible paths only. Never use red or green to encode generic cost magnitude; use the neutral gray scale and action blue for magnitude instead.

## Typography

Use Public Sans for interface and body text. Use IBM Plex Mono for numeric values, assumptions, version strings, and notation. Do not use prose em dashes; use a full stop, colon, or parentheses when the sentence needs a pause.

```
Labels above inputs:   text-xs font-medium text-gray-600 mb-1
Section titles:        text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3
Body text:             text-sm text-gray-700
Small body / notes:    text-xs text-gray-500 leading-relaxed
Monospace values:      font-mono text-xs
Math / formulas:       font-mono text-xs text-gray-400  (e.g. a₁ → a₂)
Source citations:      text-xs text-gray-400
Numeric highlights:    text-2xl font-bold text-blue-700  (stat cards)
```

## Card / section patterns

Standard section card:
```tsx
<div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">TITLE</p>
</div>
```

Semantic tunnel card (red):
```tsx
<div className="rounded-xl border border-red-200 bg-red-50 p-4">
  <p className="text-xs font-bold uppercase tracking-wide text-red-700">…</p>
</div>
```

Semantic field card (green):
```tsx
<div className="rounded-xl border border-green-200 bg-green-50 p-4">
  <p className="text-xs font-bold uppercase tracking-wide text-green-700">…</p>
</div>
```

Page hero and CTA:
```tsx
<div className="rounded-2xl bg-blue-600 p-8 text-center text-white">
```

Page heroes must not use gradients.

## Button patterns

Primary CTA:
```tsx
className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
```

Toggle pill: selected scenario:
```tsx
className="rounded-lg border border-blue-500 bg-blue-50 text-blue-700"
```

Toggle pill: selected process type:
```tsx
className="rounded-lg border border-indigo-400 bg-indigo-50 text-indigo-700"
```

Toggle pill: selected tech level:
```tsx
className="rounded-lg border border-teal-400 bg-teal-50 text-teal-700"
```

Toggle pill: idle:
```tsx
className="rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
```

## Layout

- Page max width: `max-w-5xl mx-auto px-6 py-12`
- Two-column split: `grid grid-cols-1 gap-6 sm:grid-cols-2`
- Three columns: `grid grid-cols-1 gap-6 sm:grid-cols-3`
- Four columns (tight): `grid grid-cols-2 gap-2 sm:grid-cols-4`
- Form section spacing: `space-y-5` between sections
- Within-section spacing: `space-y-3`

## Recharts conventions

Always use `formatCompact` from `@/lib/calculations` for axis ticks and tooltips.

```tsx
import { formatCompact } from "@/lib/calculations";

<ResponsiveContainer width="100%" height={240}>
  <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
    <YAxis tickFormatter={formatCompact} />
    <Tooltip formatter={(v) => formatCompact(Number(v))} />
    <Bar dataKey="rigid" fill="#ef4444" />
    <Bar dataKey="flexible" fill="#22c55e" />
  </BarChart>
</ResponsiveContainer>
```

Radar / multi-axis charts: normalize values to 0–100 before passing to RadarChart.

## i18n pattern

All user-facing strings go through `lib/i18n.ts`. Never hardcode Polish or English text in components directly. Use `tx = calculatorT[lang]` or `comparisonT[lang]`.

Exception: the `lang === "en" ? "…" : "…"` ternary is acceptable only for very short labels (e.g., "days" / "dni") where adding an i18n key would be disproportionate.

## Tunnel vs Field metaphor: usage rules

Use these terms consistently across all UI surfaces:

| Concept | Polish | English |
|---|---|---|
| Locked sequential procedure | tunel | tunnel |
| Policy-bounded freedom | pole | field |
| Mandatory waiting period | obowiązkowe oczekiwanie | mandatory wait |
| Informal bypass | obejście / wyjście z tunelu | bypass / exiting the tunnel |
| Boundary constraint | granica | boundary |
| Compliance navigator | nawigator | navigator |

Tagline (canonical): **"Tunel ma ściany. Pole ma horyzont."** / **"A tunnel has walls. A field has a horizon."**

The mathematical notation `∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}` (PL) / `∂Φ = {auth, competition, ethics, docs}` (EN) is canonical. Use it wherever the formal model is referenced.

The field is bounded by the same admissibility constraints as the tunnel. Any field visual must show that boundary and must not imply an unbounded or infinite option space.

## Process type visual grouping

When displaying all 7 process types in the calculator, they represent three layers of procurement:

| Layer | Types | Rigidity |
|---|---|---|
| Strategic sourcing | `pzp_eu`, `pzp_krajowy`, `private_formal`, `capex` | 0.60–0.95 |
| Policy-driven | `policy_only` | 0.15 |
| Downstream operational | `catalog_order`, `mrp_order` | 0.12–0.20 |

Consider adding a visual separator or group label between layers if the selector feels crowded.

## Anti-patterns

- No inline hex color values in `className`. Use semantic Tailwind classes only.
- No `useEffect` for values derivable from props/state. Compute inline or with `useMemo`.
- No new chart libraries. Use only Recharts, which is already a dependency.
- No magic numbers in business logic. Use named constants from `process-templates.ts`.
- No JSX comments (`{/* comment */}`) in returned markup. They add noise, remove them.
- No multi-paragraph docstrings or comment blocks on functions
- No `grid-cols-5` on mobile. Always start with `grid-cols-2` minimum.
