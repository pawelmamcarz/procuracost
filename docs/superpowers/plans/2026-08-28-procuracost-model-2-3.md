# ProcuraCost 2.3 implementation plan

## Objective

Release a bilingual, professionally worded procurement process comparison model that separates legal boundaries, process design, contract design, execution channel, and system support. The release must add editable process maps, evidence-aware scenarios, a separate implementation-readiness diagnostic, and a practitioner material page for Procurement&Beyond episode 8.

## Global constraints

- Work on branch `codex/model-2-3`; do not push, merge, deploy, or mutate production.
- Follow `AGENTS.md`, `CLAUDE.md`, and `CLAUDE_DESIGN.md`. Read relevant local Next.js 16 documentation before changing App Router code.
- The quantitative model stays in `lib/`. Components may present results but must not contain business constants or formulas.
- Every behavior change follows TDD: write a focused failing test, confirm the expected failure, then implement and confirm green.
- Use `schemaVersion: 2`, `modelVersion: "2.3.0"`, `calibrationId: "source-scenario-2026-08-28"`, and `legalRulesetId: "pl-pzp-2026-2027"`.
- Public path IDs are `formalSequential` and `adaptiveCompliant`. Public v2 data and labels must not use `rigid`, `flexible`, `processType`, `techLevel`, `spendType`, or `processPhase` except inside explicitly marked legacy metadata or archived 2.2.2 artefacts.
- The neutrality identity is `deltaCost = formalSequential.total - adaptiveCompliant.total`. No parameter or test may be tuned to preserve a preferred sign.
- Mandatory legal waits are locked, sourced, identical between paths, and excluded from technology scaling.
- Implementation readiness is separate from cost inputs and must never affect `deltaCost`.
- Practitioner material can design questions and research hypotheses, but cannot set model parameters or calibration ranges.
- All user-facing strings, including exports and PDF labels, use `lib/i18n.ts`. Polish and English routes remain parallel. English uses British spelling.
- Do not edit `docs/archive/model-1.x/` or historical changelog entries. Preserve current 2.2.2 replication artefacts before replacing active outputs.
- Preserve the existing palette and typography. Red and green remain reserved for the compared paths; readiness uses blue, amber, and graphite.
- Use Recharts only where a chart is needed. Respect keyboard navigation, mobile layout, and reduced motion.
- After any `lib/` change run the focused test, then the full model gates before task completion where practical. The final gate is `npm run lint && npm test && npm run recompute && npm run sweep && npm run replicate && npm run map && npm run build`.

## Task 1: Introduce the model 2.3 domain contract and DAG engine

Create focused modules in `lib/` for the v2 domain contract, calibrated ranges, legal resolution, process-map validation, and critical-path calculation. Keep legacy modules available only long enough for explicit migration and archived results.

Required domain:

- `LegalGovernanceBoundaryId`: `private_policy`, `public_internal_rules`, `pzp_classic_national`, `pzp_classic_eu`.
- `ProcedureFamilyId`: `private_competitive`, `private_negotiated`, `public_internal_competitive`, `pzp_basic`, `pzp_open`, `pzp_restricted`, `framework_calloff`, `custom_lawful`.
- `PurchaseArchetypeId`: `standardized_recurring`, `incomplete_requirement`, `complex_service`, `continuity_critical`, `capital_investment`.
- `ExecutionChannelId`: `sourcing_event`, `catalog_calloff`, `mrp_release`, `custom`.
- `SystemSupportId`: `manual`, `sourcing_platform`, `transactional_erp`, `integrated_source_to_pay`.
- Each alternative has an independent `workflowDesign` and `contractDesign`; both use the same contract design by default.
- `CalibratedValue` contains `low`, `central`, `high`, `rangeKind`, `evidenceClass`, and `evidenceIds`.
- `ProcessMapStep` contains `id`, `labelKey`, `predecessorIds`, calibrated active days, queue days, role hours, non-labour cost, `kind`, and optional locked legal provenance.

The engine must reject cycles, unknown predecessors, illegal context combinations, and changes to locked legal waits. It must calculate elapsed duration from the DAG critical path, calculate low/central/high path cost, report non-monetised dimensions, preserve fixed legal waits, and satisfy swap symmetry for totals and the outer envelope.

Legal resolution uses `initiatedOn` and the versioned ruleset. Sectoral and defence/security contexts fail closed because they are outside v1 scope. Do not encode current clock time into resolution.

Tests must prove the expected failure before implementation for DAG duration, cycle rejection, mandatory-wait invariance, invalid contexts, calibrated range validation, unpriced dimensions, and swap symmetry.

## Task 2: Build the 2.3 scenarios, evidence registry, and legacy migration

Replace the active scenario contract with a separation between `ScenarioV2` and `EvidenceRecord`. Evidence types are `empirical_anchor`, `official_case`, `practitioner_observation`, `illustrative_scenario`, and `research_hypothesis`. Each record includes source URL, supported claim, unsupported claim, jurisdiction or population, and constructs.

Create these scenario IDs and preserve the stated legacy aliases:

1. `fleet_tco_reframing` (`fleet`)
2. `erp_transformation_discovery` (`erp`)
3. `logistics_service_redesign` (`logistics`)
4. `critical_material_continuity` (`production`)
5. `public_it_open_with_market_consultation` (`pipe_vs_field`)
6. `stable_private_standard_service` (`governance_control`)
7. `stable_capex_replacement` (`capex_investment`)
8. `discovery_solution_codesign` (`discovery_rd`)
9. `catalog_calloff_control` (`catalog`)
10. `mrp_release_control` (`mrp`)

Economic values may migrate only as labelled `retained_legacy_assumption` ranges. Legal constraints use fixed ranges. The default daily-cost stress is `0.25x`, `1x`, and `4x`. Competition transfer uses the documented 2/6/9 percent stress only when path competition actually differs. Amendment and TCO central differentials are zero without user or scenario evidence. Bypass is `notMonetized` without observed or user-supplied rates.

Add official evidence records for California modular IT procurement, OECD's RVUL problem-definition example, UZP market consultation, and European Commission innovation procurement. Remove Ryanair and Zara from active evidence. Swiss Casinos and Air France may remain only as bounded practitioner illustrations when the mechanism matches.

Implement the v2 URL codec with `sv`, `mv`, `cid`, `sid`, `gb`, `pf`, `pa`, `ec`, `ss`, `wdf`, `wda`, `cdf`, and `cda`. The legacy decoder returns `exact`, `partial`, or `ambiguous`; an ambiguous migration blocks calculation until confirmation. Readiness is never inferred from technology. Unknown IDs produce visible validation errors.

Tests cover every scenario, evidence provenance, zero-delta catalog and MRP controls when maps match, a slower adaptive discovery scenario, equal public legal waits, legacy aliases, all migration statuses, and v2 URL round trips. No test asserts that one path must win.

## Task 3: Update results, exports, optimiser, and replication

Adapt `calculateCosts`, the suitability comparison, result components, scripts, and research exports to the v2 contract. Rename the optimiser publicly to a suitability comparison and remove prescriptive `winner`, `optimal`, or `recommended` claims.

Move JSON, CSV, and Markdown generation into tested pure functions. Each format includes schema version, model version, calibration ID, legal ruleset ID, scenario ID, axes, alternatives, coverage, non-monetised dimensions, and migration metadata. CSV uses stable machine headers plus optional localised labels and correct RFC-style quoting. Markdown follows the selected locale. PDF uses localised page labels and filename `procuracost-model-2.3.0-<scenario>-<lang>.pdf`.

Archive the current `replication/outputs` under `replication/archive/model-2.2.2/` before regenerating active v2 outputs. Update recompute, sweep, replicate, and decision-map scripts to consume the real v2 engine. Generated scenario material must distinguish assumptions from evidence and must not claim statistical confidence.

Tests cover export schema snapshots, comma/quote/Polish-character CSV cases, PL and EN Markdown, PDF copy helpers, migration blocking, sign formatting, and script invariants. Update `MODEL_VERSION` only after the v2 pipeline is wired.

## Task 4: Add implementation readiness and the podcast practice material

Create an independent readiness module with eight domains: purpose, ownership, process, requirements, data and automation, governance, adoption, and value and rollout. Each domain has two questions and exactly three answers: `blocked`, `risk`, `ready`.

Domain and overall status use the worst answer. Incomplete responses return no result. There are no points, percentages, weights, thresholds, benchmarks, persistence, URL state, analytics, or backend calls. The result presents gates and corrective actions. Readiness modules must not import calculations, process templates, scenarios, or the optimiser.

Add `/readiness` and `/en/readiness`. Use semantic fieldsets and radio controls, status text plus icon plus colour, and move focus to the result heading when a complete result is produced. Use blue for ready, amber for risk, graphite for blocked.

Add practitioner source `procurement-beyond-8` with canonical URL `https://www.youtube.com/watch?v=5KYUdTLlvvg`, publication date `2026-08-26`, automatic Polish-caption provenance, `calibrationEligible: false`, and permitted use limited to question design and hypothesis generation.

Add `/practice/procurement-beyond-8` and `/en/practice/procurement-beyond-8`. Include a responsive lazy YouTube iframe with an accessible title, timestamped sections, a clear `supports / does not support` boundary, and calls to the readiness diagnostic and calculator. The English page states that the recording is in Polish. Do not add the episode to Shortcasty.

State that Bielik may structure market data while the transparent deterministic model performs the TCO calculation. Never claim that the language model calculates the result.

Tests cover the readiness truth table, completeness, source boundary, dependency isolation, route parity, accessible iframe metadata, and the invariant that readiness cannot affect `deltaCost`.

## Task 5: Rebuild the calculator and evidence UI around the process map

Replace the public process and technology selectors with the v2 axes and a two-path process-map editor. Users can edit each path's active work, waiting, predecessors, role hours, and non-labour costs. Locked legal steps cannot be removed or edited. Invalid graphs display actionable validation and block calculation.

The signature visual is a connected process rail with swimlanes, parallel branches, legal-lock markers, and critical-path emphasis. The editor uses a side panel rather than a table. On mobile, the rail becomes a readable vertical sequence. Motion is limited to one purposeful transition and disabled under reduced motion.

Replace generic result cards with a neutral decision record: compared alternatives, total and range, driver analysis, coverage, non-monetised dimensions, assumptions, and evidence docket. Use professional names `formalSequential` and `adaptiveCompliant`; the tunnel/field metaphor may appear only in a secondary explainer.

Replace the current assessment's maturity framing with `Procurement process design profile` / `Profil projektu procesu zakupowego`. Rename `Case Studies` to `Mechanisms and evidence` / `Mechanizmy i źródła`, and `Benchmark` to `Reference scenario comparison` / `Porównanie ze scenariuszem referencyjnym`.

All interaction copy belongs in i18n. Tests cover keyboard operation, locked-step behaviour, visible validation, mobile-safe structure, status not conveyed by colour alone, and PL/EN parity.

## Task 6: Complete the professional PL/EN editorial and documentation pass

Audit every public PL and EN route, metadata, navigation, footer, calculator surface, results, PDF, JSON/CSV/Markdown labels, team page, shortcast pages, sitemap, robots, and discovery files. Remove generic AI phrasing, unsupported specificity, sales language, em dashes, and mixed-language strings.

Use this terminology consistently:

- `Ramy prawne i ład zakupowy` / `Legal and governance boundary`
- `Archetyp zakupu` / `Purchase archetype`
- `Projekt przebiegu procesu zakupowego` / `Procurement workflow design`
- `Kanał realizacji zakupu` / `Purchase execution channel`
- `Wsparcie systemowe` / `System support`
- `Konstrukcja umowy` / `Contract design`
- `Gotowość organizacyjna do wdrożenia` / `Organisational implementation readiness`

Use `Wnioskodawca biznesowy` outside public-procurement legal contexts. Reserve `Zamawiający` for PZP. Replace obsolete `SIWZ` with `SWZ` or `opis potrzeb i wymagań`. Fix English `pkt`, Polish `Strona` in English PDFs, incorrect plus signs, and Polish scenario names or locale in English exports.

Use the podcast observations to explain why process friction, internal ownership, requirement discipline, operational purchasing, policy simplification, TCO, and bounded AI uses matter. Mark them as practitioner observations and avoid invented quotes or empirical claims.

Update `README.md`, `CLAUDE.md`, `CLAUDE_DESIGN.md`, `RESEARCH.md`, `docs/MODEL_PARAMETERS.md`, the active empirical plan, active research files, current supervisor pack where it describes the model, and active articles. Keep history untouched. Update route counts and model-version references.

Add readiness and practice routes to the sitemap and appropriate internal links from the home, model, methodology, team, and readiness surfaces. Do not overcrowd primary navigation; expose readiness through contextual links and the footer.

Tests scan all current public sources for forbidden terms, non-localised sentinel strings, unapproved em dashes, old model-version claims, and PL/EN route parity.

## Task 7: Integrate, regenerate, and verify the complete release

Resolve cross-task type errors without weakening the v2 contract. Review regenerated outputs and source diffs manually. Do not change parameters after seeing scenario signs.

Run the complete gate:

```bash
npm run lint
npm test
npm run recompute
npm run sweep
npm run replicate
npm run map
npm run build
```

Run focused browser or rendered-page checks for both languages at the homepage, calculator, result state, readiness, practice material, methodology, model, and evidence pages. Check mobile width, keyboard focus, locked legal steps, iframe title, exported filenames, and sitemap entries.

Run a whole-branch review against this plan. Fix every Critical and Important finding, then repeat the relevant focused checks and the complete gate. Leave push, PR, merge, Vercel preview promotion, and production deployment for a separate approved integration step.
