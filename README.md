# ProcuraCost

> **A tunnel has walls. A field has a horizon.**

ProcuraCost is an open-source decision model comparing formal/sequential and adaptive/compliant procurement designs under the same governance boundary. Version 2.2 reports ΔC decomposed into process, delay and lifecycle buckets, an unclamped break-even daily cost of inaction, and a scenario interval covering two axes — the evidence parameters and the two structural inputs that actually carry the result. Under that interval the model identifies a robust winner in only 1 of 10 built-in scenarios. The delay bucket is an accounting identity between a template day count and a user-supplied price per day, and it carried 80.5–99.6% of the 2.1 headline; excluding it, the formal path is cheaper on process cost in 7 of 10 built-in scenarios. The model may favor either path and does not claim a universal causal advantage.

## The Model

Procurement *policy* defines principles and boundaries. Procurement *procedure* is just one of many ways to implement them. Conflating the two—treating one rigid workflow as if it were the policy itself—carries costs the model captures through:

- Extended timelines and staff hours
- A supplier-selection cost linked to discretion and competition effectiveness (Szucs, JEEA 2024)
- An annual formal-amendment frequency linked specifically to **contractual** rigidity and contract duration (Beuve, Moszoro & Spiller, JLEO 2023; 2SLS/IV)
- Broad, explicitly non-empirical TCO and bypass scenarios that no longer determine a precise headline result

**The Tunnel vs. Field hypothesis:** prescribed workflow may act like a tunnel; adaptive workflow may offer a field of lawful paths. Either can be preferable depending on competition, delay, contract design, controls, and organizational capability.

## Features

- **Cost Calculator** — 7-dimension model comparing formal/sequential and adaptive/compliant paths under the same governance boundary across 7 process types
- **Path Optimizer** — a common-criteria, rule-based scorer with a 30-run ±25% weight-sensitivity sweep, ranking-margin ablation, and a natural-language explanation. It is illustrative, not trained ML, and not validated on real procurement data; public recommendations are filtered to procedures available without separate statutory grounds, within zamówienia klasyczne only; withheld procedures are named in the UI
- **Maturity Assessment** — 10-question free self-assessment placing your organization on the Tunnel→Field spectrum
- **Illustrative cases** — practitioner and company examples used for mechanism illustration, not causal evidence
- **Industry Benchmark** — See where your scenario sits relative to the 9 non-custom reference scenarios (7 of which carry an illustrative case study)
- **Bilingual** — Full Polish and English interfaces

## Team

| Name | Role |
|------|------|
| [Paweł Mamcarz](https://mamcarz.com) | Model architect / ProcureTech |
| Tomasz Ślusarczyk | Procurement expert |
| Rafał Madejewski | Analyst & researcher |

## Tech Stack

- **Next.js 16** (App Router, Server + Client Components)
- **Tailwind CSS** — design system documented in `CLAUDE_DESIGN.md`
- **Recharts** — cost breakdown charts and benchmark visualization
- **TypeScript** — fully typed throughout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the Polish interface or [http://localhost:3000/en](http://localhost:3000/en) for English.

## Academic Foundation

The cost model draws on peer-reviewed and practitioner sources (only a subset of the model's parameters are peer-reviewed):

1. **Szucs (2024)** — structural estimates: about 6% higher price and about 10% lower average contractor total factor productivity under discretion. Identified on Hungarian public contracts below a ~25m HUF threshold, so the transfer caveat is substantial.
2. **Beuve, Moszoro & Spiller (2023)** — 2SLS/IV estimate of 0.077–0.105 additional formal amendments per contract-year for a simultaneous one-SD increase in *each* of seven z-scored rigidity categories, in French car-park contracts; not an event probability, not a workflow estimate, and not the effect of a one-SD move on the summed index.
3. **TCO and bypass** — scenario assumptions with broad bounds. The unsupported 30% TCO rule and the former bypass sigmoid are excluded from the baseline.

Theoretical grounding: Lipsky (1980) Street-Level Bureaucracy · Vaughan (1996) Challenger · Holmström & Milgrom (1991) Multitask Principal-Agent

Full working paper: [`RESEARCH.md`](./RESEARCH.md) | Methodology page: `/methodology`

## Repository Structure

```
app/                    Next.js pages (PL + /en subtree)
  calculator/           Cost calculator
  optimizer/            rule-based path optimizer
  assessment/           Maturity quiz
  case-studies/         Case study browser
  research/             Research paper viewer
  methodology/          Academic methodology (EN)
components/             React components
  CostComparison.tsx    Results with benchmark chart
  PathOptimizer.tsx     rule-based optimizer with explainability
  AssessmentQuiz.tsx    10-question maturity assessment
  PipeFieldDiagram.tsx  Tunnel vs. Field visual
lib/
  calculations.ts       7-dimension cost model
  optimizer.ts          rule-based path scorer (30-run sensitivity sweep)
  scenarios.ts          10 reference scenarios (9 exported; 7 with case studies)
  i18n.ts               All user-facing strings (PL + EN)
```

## License

MIT
