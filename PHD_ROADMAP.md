# ProcuraCost – Ambitious 4–5 Month Research Roadmap (Version A)

**Goal**: Secure academic supervision (promotor for an external-mode doctorate, *tryb eksternistyczny*) or formal collaboration on a major research project, by approaching a parallel shortlist of 3–5 academics whose work touches procurement economics, TCE, or public administration.

**Re-baseline (14 July 2026)**: model 1.x materials are archived. Supervisor outreach, the article cycle and any pilot fieldwork must use the model 2.1 foundation; historical v1.x pitches and protocols are not reusable without redesign.

This roadmap treats ProcuraCost as a potential **hybrid academic-consulting project** with clear scientific contribution.

---

## Core Thesis (to be refined)

**"The relative cost of formal/sequential and adaptive/compliant procurement paths is conditional on competition, contract design, delay, coordination and governance risk; separating policy boundaries from path design makes those trade-offs measurable and testable."**

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
- [ ] Full technical appendix describing the seven cost dimensions and their functional forms
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
- [x] Versioned model 2.1 with frozen, generated replication outputs
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

This package is what most serious academics are asking for.

---

## Immediate Next Actions (Model 2.1)

1. Review the three-article cycle against the binding 2.1 foundation; do not restore
   or rename archived 1.x drafts.
2. Design a new empirical protocol that separately measures workflow,
   competition and contractual rigidity before collecting data.
3. Review the central calibration profiles with domain experts without fitting
   them to a preferred sign.
4. Freeze a publication snapshot only after the article text, generated
   replication outputs and public calculator agree.

Historical action plans, surveys and pitch templates are available under
`docs/archive/model-1.x/` for provenance only.
