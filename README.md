# ProcuraCost

> **A tunnel has walls. A field has a horizon.**

ProcuraCost is an open-source research and consulting tool that quantifies the hidden opportunity costs of rigid procurement procedures compared to policy-based procurement. It combines peer-reviewed empirical findings with explicit modeling assumptions (roughly 35–40% of parameters are peer-reviewed; the rest are calibrated or modeling judgments — see `docs/MODEL_PARAMETERS.md`). Its headline result — that rigid-procedure costs can exceed policy-only costs by **100–400%** — is a model **estimate** under documented assumptions, not a measured fact. The model is symmetric: in low-corruption-risk operational contexts the rigid path can be net-cheaper.

## The Model

Procurement *policy* defines principles and boundaries. Procurement *procedure* is just one of many ways to implement them. Conflating the two—treating one rigid workflow as if it were the policy itself—carries costs the model captures through:

- Extended timelines and staff hours
- A favoritism / selection-quality cost borne mainly by the **discretionary** path: discretion raises prices (~6pp, structural) and selects less-productive contractors; competitive tendering averts this premium (Szucs, JEEA 2024)
- 7.7–10.5 pp higher renegotiation probability associated with contractual rigidity, observational (Beuve, Moszoro & Spiller, NBER 2021 / JLEO 2023)
- Up to 30% foregone TCO savings as a multi-year practitioner ceiling, discounted to present value (ISM, practitioner benchmark)

**The Tunnel vs. Field model:** a procedure is a tunnel — one path, binary compliance, human as step-executor. A procurement policy is a field — multiple compliant paths, human as value navigator.

## Features

- **Cost Calculator** — 7-dimension cost model (time, admin, opportunity, productivity, renegotiation, TCO, bypass) comparing rigid procedures vs. policy-based approaches across 7 process types
- **Path Optimizer** — a weighted, rule-based scoring function (one closed-form formula per path) recommending a procurement path for your context, with a 30-run sensitivity sweep for stability, genuine ablation feature importance, and a natural-language explanation. It is illustrative, not trained ML, and not validated on real procurement data; public-sector recommendations above threshold are hard-filtered to lawful PZP trybów
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

The cost model draws on peer-reviewed and practitioner sources (only a subset of the model's parameters are peer-reviewed):

1. **Szucs (2024)** — *Journal of the European Economic Association* 22(1):117–160, DOI 10.1093/jeea/jvad017: discretion raises prices (~6pp, structural) and selects less-productive contractors; competitive (rigid) tendering averts this favoritism premium. Note: Szucs attributes roughly two-thirds of the discontinuity to selection/sorting (an endogeneity caveat)
2. **Beuve, Moszoro & Spiller (2021)** — *NBER WP 28491* (published in *JLEO* 2023): contractual rigidity is **associated with** a 7.7–10.5 pp increase in renegotiation probability (observational, not causal)
3. **ISM / CAPS Research** — up to 30% TCO reduction as a multi-year practitioner ceiling (not a flat annual rate), discounted to present value and capped at 30% of contract value in the model

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
  scenarios.ts          8 reference case studies
  i18n.ts               All user-facing strings (PL + EN)
```

## License

MIT
