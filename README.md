# ProcuraCost

> **A tunnel has walls. A field has a horizon.**

ProcuraCost is an open-source research prototype for exploring the opportunity costs of rigid procurement procedures compared with policy-based procurement. It combines selected empirical findings with explicit modeling assumptions. Its outputs are deterministic scenario simulations, not empirically validated estimates of realized organizational effects.

## The Model

Procurement *policy* defines principles and boundaries. Procurement *procedure* is one way to implement them. ProcuraCost explores the hypothesis that conflating the two may create costs through:

- Extended timelines and staff hours
- A countervailing risk from poorly governed discretion: higher prices and less productive suppliers (Szucs, JEEA 2024)
- 7.7–10.5 pp higher renegotiation probability per SD of contractual rigidity (Beuve et al., NBER 2021)
- Procurement time and competition effects documented in public-sector evidence reviews
- Explicit, sensitivity-testable assumptions for TCO, bypass, technology, and the 2×2 context

**The Tunnel vs. Field model:** a procedure is a tunnel — one path, binary compliance, human as step-executor. A procurement policy is a field — multiple compliant paths, human as value navigator.

## Features

- **Cost Calculator** — auditable model of active time, admin, opportunity, renegotiation, TCO, and bypass components; the legacy productivity field is inactive in v1.2
- **Path Optimizer** — transparent decision-support heuristic using 30 deterministic scoring variants and explicit expert rules; it is not a trained ML classifier or legal compliance check
- **Maturity Assessment** — 10-question free audit placing your organization on the Tunnel→Field spectrum
- **Illustrative Archetypes** — fleet, ERP, logistics, and production scenarios inspired by public practice descriptions; financial inputs are model assumptions
- **Scenario Benchmark** — compare a result with 8 illustrative reference scenarios
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

## Evidence Status

The model separates external evidence from modeling assumptions:

1. **Szucs (2024)** — *Journal of the European Economic Association* 22(1): high discretion can increase prices and select less productive suppliers. ProcuraCost treats this as a boundary condition, not a rigidity penalty.
2. **Beuve, Moszoro & Saussier (2021)** — *NBER WP 28491*: 7.7–10.5 pp renegotiation risk increase per SD of contractual rigidity
3. **World Bank (2021)** — Policy Research Paper 9690: the evidence base for procurement interventions is uneven and context-dependent.
4. **Model assumptions** — TCO opportunity, bypass sigmoid, technology effects, step durations, and 2×2 multipliers require external calibration. TCO is capped at 30% of contract value in model v1.2.

Theoretical grounding: Lipsky (1980) Street-Level Bureaucracy · Vaughan (1996) Challenger · Holmström & Milgrom (1991) Multitask Principal-Agent

Full working paper: [`RESEARCH.md`](./RESEARCH.md) | Methodology page: `/methodology`

## Repository Structure

```
app/                    Next.js pages (PL + /en subtree)
  calculator/           Cost calculator
  optimizer/            Heuristic path optimizer
  assessment/           Maturity quiz
  case-studies/         Illustrative scenario browser
  research/             Research paper viewer
  methodology/          Academic methodology (EN)
components/             React components
  CostComparison.tsx    Results with benchmark chart
  PathOptimizer.tsx     Heuristic optimizer with explainability
  AssessmentQuiz.tsx    10-question maturity assessment
  PipeFieldDiagram.tsx  Tunnel vs. Field visual
lib/
  calculations.ts       Auditable cost simulation
  optimizer.ts          Deterministic heuristic scoring ensemble
  scenarios.ts          8 illustrative reference scenarios
  i18n.ts               All user-facing strings (PL + EN)
```

## License

MIT
