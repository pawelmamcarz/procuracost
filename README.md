# ProcuraCost

> **A tunnel has walls. A field has a horizon.**

ProcuraCost is an open-source research and consulting tool that quantifies the hidden opportunity costs of rigid procurement procedures compared to policy-based procurement. Built on peer-reviewed empirical studies, it demonstrates that rigid-procedure costs exceed policy-only costs by **100–400%**.

## The Model

Procurement *policy* defines principles and boundaries. Procurement *procedure* is just one of many ways to implement them. Conflating the two—treating one rigid workflow as if it were the policy itself—costs organizations millions through:

- Extended timelines and staff hours
- 2% price premium under rigid auctions (Szucs, JEEA 2024)
- 7.7–10.5 pp higher renegotiation probability (Beuve et al., NBER 2021)
- 42% longer project delivery (World Bank 2023)
- Up to 30% foregone TCO savings (ISM)

**The Tunnel vs. Field model:** a procedure is a tunnel — one path, binary compliance, human as step-executor. A procurement policy is a field — multiple compliant paths, human as value navigator.

## Features

- **Cost Calculator** — 7-dimension cost model (time, admin, opportunity, productivity, renegotiation, TCO, bypass) comparing rigid procedures vs. policy-based approaches across 7 process types
- **Path Optimizer** — Random Forest classifier (30 trees, deterministic) recommending the optimal procurement path for your context, with natural-language explanation of the recommendation
- **Maturity Assessment** — 10-question free audit placing your organization on the Tunnel→Field spectrum
- **Case Studies** — Fleet (Ryanair), ERP (Swiss Casinos), Logistics (Air France KLM), Production (Zara) with empirical benchmarks
- **Industry Benchmark** — See where your scenario sits relative to 8 reference cases
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

The cost model integrates four empirical studies:

1. **Szucs (2024)** — *Journal of the European Economic Association* 22(1): ~2% price premium under rigid auction requirements
2. **Beuve, Moszoro & Saussier (2021)** — *NBER WP 28491*: 7.7–10.5 pp renegotiation risk increase per SD of contractual rigidity
3. **World Bank (2021)** — Policy Research Paper 9690: 42% longer project delivery under rigid public rules
4. **ISM** — Up to 30% TCO savings over 3 years with flexible sourcing

Theoretical grounding: Lipsky (1980) Street-Level Bureaucracy · Vaughan (1996) Challenger · Holmström & Milgrom (1991) Multitask Principal-Agent

Full working paper: [`RESEARCH.md`](./RESEARCH.md) | Methodology page: `/methodology`

## Repository Structure

```
app/                    Next.js pages (PL + /en subtree)
  calculator/           Cost calculator
  optimizer/            RF path optimizer
  assessment/           Maturity quiz
  case-studies/         Case study browser
  research/             Research paper viewer
  methodology/          Academic methodology (EN)
components/             React components
  CostComparison.tsx    Results with benchmark chart
  PathOptimizer.tsx     RF optimizer with explainability
  AssessmentQuiz.tsx    10-question maturity assessment
  PipeFieldDiagram.tsx  Tunnel vs. Field visual
lib/
  calculations.ts       7-dimension cost model
  optimizer.ts          Random Forest (30 trees)
  scenarios.ts          8 reference case studies
  i18n.ts               All user-facing strings (PL + EN)
```

## License

MIT
