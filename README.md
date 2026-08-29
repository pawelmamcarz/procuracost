# ProcuraCost

> **A tunnel has walls. A field has a horizon.**

ProcuraCost is an open-source, bilingual procurement decision model. Native model 2.3.0 compares a formal/sequential workflow with an adaptive/compliant workflow inside the same legal and governance boundary. It separates the boundary, purchase archetype, procurement workflow design, purchase execution channel, system support and contract design instead of treating them as one aggregate capability score.

The calculation is deterministic. It works from declared process maps, role rates, non-labour costs, contract cost allocations and the daily cost of inaction. It reports both alternatives, the central difference `formalSequential - adaptiveCompliant`, an outer scenario envelope, the critical path, monetisation coverage, non-monetised dimensions, assumptions and evidence provenance.

ProcuraCost is not a trained estimator and does not establish that either workflow causes a lower cost. Its low, central and high values are declared scenario ranges, not confidence intervals. Mandatory legal waits are resolved from the dated ruleset, locked in both alternatives and excluded from system-support scaling.

## Decision surfaces

- **Procurement cost calculator:** edits two independent process maps and produces a neutral decision record.
- **Suitability comparison:** presents lawful procedure families on equal terms, with conditions and limitations. It does not score or rank them. The existing `/optimizer` and `/en/optimizer` URLs are retained for compatibility.
- **Procurement process design profile:** describes the current balance between sequential and adaptive process characteristics. It is not an organisational capability or readiness score.
- **Mechanisms and evidence:** separates empirical anchors, official cases, practitioner observations, illustrative scenarios and research hypotheses.
- **Organisational implementation readiness:** records a self-description across purpose, ownership, process, requirements, data and automation, governance, adoption, and value and rollout. It does not validate readiness or issue a go/no-go decision, and it remains independent of the cost calculation.
- **Practitioner material:** [Procurement&Beyond, episode 8](https://www.youtube.com/watch?v=5KYUdTLlvvg) informs readiness questions and research hypotheses only. It does not calibrate the model.
- **Replication and diagnostics:** generate three deterministic scenario artefacts and audit metadata, range ordering, delta identity, legal waits, neutral controls and swap symmetry.

## Reference scenarios

Model 2.3.0 provides ten named starting points. Their economic values are declared assumptions, not measured outcomes from the named sectors or organisations. Applicable legal waits remain fixed by the ruleset.

1. Fleet TCO reframing
2. ERP transformation discovery
3. Logistics service redesign
4. Critical material continuity
5. Public IT open procedure with preliminary market consultation
6. Stable private standard service
7. Stable CAPEX replacement
8. Discovery and solution co-design
9. Catalogue call-off control
10. MRP release control

The catalogue call-off and MRP release scenarios are neutral controls because both process maps are identical and no competition difference is declared. Their alternative ranges are equal, the central difference is zero and the outer difference envelope is symmetric. The discovery scenario deliberately permits the adaptive workflow to require more time and effort. No scenario is tuned to preserve a preferred result.

The first five scenarios use mechanism-specific model 2.3 maps. Their aggregate
base-day totals are retained from model 2.2.2 (`44/24` for the four private maps
and `42/26` non-legal days for public IT), while step order, allocation of days
and role-hour allocations are illustrative inputs. Retained support profiles are
applied afterwards. The decision record exposes both provenance classes.

## Evidence boundary

Szucs (2024) provides the empirical anchor for the competition-transfer stress where the compared alternatives explicitly differ in supplier access. The 2%, 6% and 9% values are a declared transfer range from a specific Hungarian public-procurement population, not a Polish estimate. Only the stable standard-service sensitivity starts with this difference: open policy-qualified competition is compared with a restricted shortlist or incumbent continuation. The user can assign the restricted access to either alternative or remove the difference; it is not inferred from a workflow label.

The active official cases cover modular technology procurement, problem
definition, preliminary market consultation and innovation procurement. They
support mechanism design, not step durations, role hours or monetary values.
The internal record `model_2_3_mechanism_workflow_allocations` documents the
illustrative map allocations. Contract-amendment and TCO differentials remain
zero in the native calculation until a supported allocation convention is
introduced. Informal bypass is disclosed but remains non-monetised in native
model 2.3.0.

Historical model 2.2.2 outputs remain in the immutable replication archive. Its calibration audit is explicitly historical in [`docs/research/CALIBRATION_BENCHMARKS.md`](./docs/research/CALIBRATION_BENCHMARKS.md). The active working paper is [`RESEARCH.md`](./RESEARCH.md), and the active parameter contract is [`docs/MODEL_PARAMETERS.md`](./docs/MODEL_PARAMETERS.md).

## Team

- [Paweł Mamcarz](https://mamcarz.com)
- Mariusz Kościółek
- Marcin Bogucki
- Tomasz Ślusarczyk
- Rafał Madejewski

## Technology

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS, following [`CLAUDE_DESIGN.md`](./CLAUDE_DESIGN.md)
- Recharts for quantitative charts
- Vitest for model and presentation contracts

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for Polish or [http://localhost:3000/en](http://localhost:3000/en) for English.

Core verification commands:

```bash
npm run lint
npm test
npm run recompute
npm run sweep
npm run replicate
npm run build
```

`npm run recompute` prints the canonical diagnostics. `npm run sweep` audits alternative-swap symmetry. `npm run replicate` writes the JSON, CSV and Markdown artefacts described in [`replication/README.md`](./replication/README.md).

## Repository structure

```text
app/                         Paired Polish and English route trees
components/calculator-v2/    Process-map workspace and validation
components/decision-record/  Neutral comparison result
components/process-map/      Connected process rail
lib/model-v2/                Native 2.3 domain, legal rules, engine and scenarios
lib/readiness.ts             Independent implementation-readiness self-description
lib/i18n.ts                  Paired Polish and English copy
scripts/                     Diagnostics, symmetry and replication entry points
replication/                 Native outputs and immutable historical archive
```

The working paper is [`RESEARCH.md`](./RESEARCH.md). The public methodology is available at `/methodology` and `/en/methodology`.

## Licence

MIT
