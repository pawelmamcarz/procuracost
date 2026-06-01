# ProcuraCost – Ambitious 4–5 Month Research Roadmap (Version A)

**Goal**: By September/October 2026 have material strong enough to approach Professor Krzysztof Piech (or another academic) with a credible request for supervision or formal collaboration on a PhD / major research project.

This roadmap treats ProcuraCost as a potential **hybrid academic-consulting project** with clear scientific contribution.

---

## Core Thesis (to be refined)

**"The opportunity costs of rigid procurement procedures significantly exceed those of policy-only compliance, and these costs can be systematically quantified and reduced through better distinction between policy and procedure, supported by modern information systems."**

Key extensions:
- Explicit incorporation of **Direct vs Indirect** spend
- Explicit incorporation of **Upstream vs Downstream** process phases
- Behavioral and organizational mechanisms (bypass, compliance theater)

---

## 4–5 Month Phased Plan

### Phase 1: Foundations (Weeks 1–4) – "Make the model defensible"

**Objective**: Every parameter in the model has a clear, documented source or explicit assumption.

**Key Deliverables**:
- [ ] Complete **Parameter Documentation Table** (Excel + Markdown)
  - For each parameter: Name, Value, Source (paper + page), Type (Empirical / Calibrated / Assumption), Sensitivity, Justification
- [ ] Full technical appendix describing the five cost dimensions and their functional forms
- [ ] Clear separation of:
  - Parameters taken directly from literature (with citations)
  - Parameters calibrated from multiple studies
  - Pure modeling assumptions
- [ ] Public GitHub repository with clean code + documentation (at minimum the core calculation logic)

**App Changes**:
- Create new page/section: `/model` or `/assumptions` with interactive parameter explorer (user can see and modify key assumptions)
- Add "Source" tooltips throughout the calculator

---

### Phase 2: Conceptual Strengthening (Weeks 3–6)

**Objective**: Stronger theoretical grounding and clearer contribution.

**Key Deliverables**:
- [ ] Expanded literature review section (add more on TCE, behavioral procurement, information systems in governance)
- [ ] Formal propositions / hypotheses (3–5)
- [ ] Clear positioning: "This paper contributes to X, Y, Z literatures by..."
- [ ] Refined "Tunnel vs Field" model with the new Direct/Indirect + Upstream/Downstream dimensions

**App Changes**:
- Update the research paper viewer and methodology page to reflect the new framing
- Add a short "Theoretical Framework" interactive diagram

---

### Phase 3: Empirical Validation Strategy (Weeks 5–10) – **Most Critical**

This is the part the professor cares about most.

**Key Deliverables**:
- [ ] Detailed **Empirical Validation Plan** (10–15 pages)
  - Research design options (multiple possible paths):
    - Option A: Multi-case study (4–6 organizations, mixed methods)
    - Option B: Survey + archival data (target n=150–300 procurement professionals + matched financial data)
    - Option C: Difference-in-differences or synthetic control using regulatory changes
  - Specific hypotheses linked to the model
  - Data collection instruments (draft survey + interview protocol)
  - Identification strategy and limitations
  - Power calculations / minimum detectable effects (where relevant)
- [ ] Short "Pilot Validation Proposal" (3–4 pages) that could be sent to potential partner companies or used for small grant application

**App Changes** (very high signal):
- Add a new section: **"Validation & Next Steps"**
  - Publicly show the validation plan
  - Allow interested organizations to express interest (simple form)
  - Possibly a "Contribute Data" section (anonymized)

---

### Phase 4: Tool as Research Infrastructure (Weeks 8–14)

**Objective**: Turn the calculator from a demonstration tool into a proper research instrument.

**Key Deliverables**:
- [ ] Versioned model (v1.0) with frozen assumptions for replication
- [ ] Export functionality for researchers (full parameter set + results in structured format)
- [ ] Optional: Simple "Research Mode" that logs (anonymized) inputs for future validation studies (with clear consent)
- [ ] Public technical documentation (how the model works, all formulas)

**App Changes**:
- Add "Researcher Tools" section
- Improve PDF export to include full parameter traceability
- Add data export (JSON/CSV) of current scenario with all parameters

---

### Phase 5: Positioning & Outreach (Months 4–5)

**Objective**: Have a coherent story for academics and potential supervisors.

**Key Deliverables**:
- [ ] Updated full working paper (target 12–18 pages + appendices)
- [ ] 3–4 page "Research Agenda" document specifically for potential supervisors
- [ ] Short pitch deck (8–10 slides) for academic audiences
- [ ] List of 8–12 potential supervisors / co-authors / partner institutions (with rationale)

---

## Success Criteria for Version A (End of Month 5)

By the end of this period you should be able to credibly say:

1. "Here is a complete, documented model with transparent assumptions."
2. "Here is a rigorous plan for empirical validation (with multiple feasible paths)."
3. "Here is working, versioned, open-source software that implements the model."
4. "Here is a working paper that positions the contribution clearly."

This package is what Professor Piech (and most serious academics) are asking for.

---

## Immediate Next Actions (June 2026)

See the detailed, week-by-week execution plan:

→ **`docs/RESEARCH_PAPER_ACTION_PLAN.md`** (8–10 week plan with concrete deliverables)

This plan is the current operational version of the research paper track.

Supporting templates (ready to use/customize):
- `docs/research/survey_structure.md`
- `docs/research/replication_package_spec.md`
- `docs/research/supervisor_pitch_template.md`

The high-level structure of the older roadmap below remains valid as strategic context.