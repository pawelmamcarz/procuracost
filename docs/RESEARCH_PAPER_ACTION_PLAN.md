# Research Paper – 8–10 Week Action Plan (June – Mid-August 2026)

**Goal**: By mid-August 2026 have a complete, submission-ready first draft of the working paper + all supporting research infrastructure (replication package, survey instrument, pilot protocol, Supervisor Pitch).

This plan assumes you can dedicate **15–25 hours per week** to the paper track.

---

## Week-by-Week Plan

### Week 1 (June 2026) – Foundations & Model Freeze

**Primary Objectives**
- Freeze model v1.1
- Start formal mathematical appendix
- Begin literature review expansion

**Tasks**
1. **Model Freeze**
   - Tag current model as `v1.1` in GitHub
   - Export full parameter table from the app (use existing MODEL_PARAMETERS.md as base)
   - Document all changes introduced by the Direct/Indirect + Upstream/Downstream dimensions

2. **Mathematical Appendix (start)**
   - Create `docs/research/model_specification_draft.md`
   - Write sections for:
     - Cost components (time, coordination, opportunity, productivity, renegotiation, bypass, TCO)
     - How the 2×2 dimensions modify each component
   - Focus first on staff-hour and calendar-time adjustments (these are the most novel)

3. **Literature Review Gaps**
   - Identify 8–10 key papers that must be added (focus on TCE in procurement, behavioral public administration, digital governance)
   - Create a shared Zotero/Mendeley group or Notion database

**Deliverables by end of Week 1**
- Model v1.1 tagged
- First 40% of mathematical appendix draft
- Literature gap list (with priorities)

---

### Week 2 – Hypotheses + Survey Instrument v0.1

**Primary Objectives**
- Finalize 6–8 testable propositions
- Draft first version of the survey

**Tasks**
1. **Hypotheses**
   - Write the document `docs/research/testable_propositions_v1.md`
   - For each proposition: 
     - Theoretical justification
     - Operationalization (how it will be measured)
     - Data source (secondary vs primary)
     - Expected direction and effect size

2. **Survey Design (v0.1)**
   - Create `docs/research/survey_v0.1.md`
   - Core modules:
     - Procurement category classification (Direct/Indirect + Upstream/Downstream)
     - Time allocation by role and step (the most important module)
     - Delay cost perception
     - Renegotiation experience
     - Bypass behavior (frequency + reasons)
   - Aim for max 12–15 minutes completion time

3. **Begin mapping to ProcuraCost parameters**
   - Create a crosswalk table: Survey question → Model parameter(s)

**Deliverables**
- 6–8 propositions with justification
- Survey v0.1 (full draft)
- Crosswalk table

---

### Week 3 – Interview Protocol + Pilot Protocol

**Primary Objectives**
- Complete interview guide
- Design pilot case study protocol
- Start outreach to pilot organizations

**Tasks**
1. **Interview Protocol**
   - Create `docs/research/interview_protocol_v1.md`
   - Sections:
     - Opening (procurement philosophy)
     - Specific high-stakes decisions (use the 2×2 framework)
     - Behavioral mechanisms (compliance theater, enforcement fallacy, etc.)
     - Technology as compliance infrastructure
   - Prepare 8–10 core questions + follow-ups

2. **Pilot Case Study Protocol**
   - Create `docs/research/pilot_case_study_protocol.md`
   - Standard template that forces the organization to provide data in ProcuraCost format
   - Include consent language and data anonymization rules

3. **Outreach**
   - Prepare a short outreach email (1 page) for potential pilot organizations
   - Identify first 5–7 target organizations (mix of sectors)

**Deliverables**
- Interview protocol v1
- Pilot case study protocol + consent form
- Outreach list + email template

---

### Week 4 – Replication Package v0.8 + Researcher Export Spec

**Primary Objectives**
- Build the foundation of the replication package
- Design the "Researcher Export" feature in the app

**Tasks**
1. **Replication Package Structure**
   - Create folder `replication/` in the repo
   - Define exact structure (see `docs/research/replication_package_spec.md`)
   - Start populating:
     - `parameters/` (full table with sources)
     - `synthetic_data/` (start with 1–2 case studies)
     - `code/` (frozen versions of key functions)

2. **Researcher Export Feature**
   - Write detailed specification: `docs/research/researcher_export_spec.md`
   - Decide on output format (JSON schema + CSV)
   - Define which variables must be included (all inputs + all intermediate calculations + effective multipliers)
   - Plan UI (button in calculator + in Assumptions Explorer)

3. **Parameter Documentation**
   - Complete the full `docs/MODEL_PARAMETERS.md` with every parameter used in the paper

**Deliverables**
- Replication package skeleton + 30–40% populated
- Detailed spec for Researcher Export feature
- Updated MODEL_PARAMETERS.md

---

### Week 5 – Survey Pilot + First Draft of Measurement Section

**Primary Objectives**
- Pilot the survey with 15–25 people
- Write the first draft of the "Measurement and Operationalization" section for the paper

**Tasks**
1. **Survey Pilot**
   - Distribute survey v0.1 to 15–25 procurement professionals (use LinkedIn + personal network)
   - Collect feedback on clarity, length, and missing constructs
   - Produce survey v0.9

2. **Paper Writing – Measurement Section**
   - Draft `sections/measurement.md` (target 1500–2000 words)
   - Describe ProcuraCost as a formal measurement model
   - Explain how the 2×2 dimensions are operationalized
   - Discuss limitations of the current parameterization

3. **Continue replication package**
   - Add synthetic data for all four case studies from the paper

**Deliverables**
- Survey v0.9 (with pilot feedback summary)
- First draft of "Measurement and Operationalization" section
- Replication package at ~60% completeness

---

### Week 6 – Interview Pilot + Hypotheses Refinement

**Primary Objectives**
- Conduct 3–5 pilot interviews
- Refine hypotheses based on early qualitative insights
- Advance replication package

**Tasks**
1. **Pilot Interviews**
   - Conduct 3–5 interviews using the protocol
   - Transcribe key passages
   - Update interview protocol based on what worked/didn't

2. **Hypotheses Iteration**
   - Revise propositions based on pilot insights
   - Add or drop 1–2 propositions if needed
   - Produce `testable_propositions_v2.md`

3. **Paper Writing**
   - Expand the literature review with at least 6–8 new high-quality references

**Deliverables**
- Pilot interview summary (anonymized)
- Hypotheses v2
- Updated literature review draft

---

### Week 7 – Full Replication Package + App Feature Development

**Primary Objectives**
- Complete replication package v1.0
- Implement first version of "Researcher Export" in the app (if development capacity allows)

**Tasks**
1. **Replication Package v1.0**
   - Finalize all synthetic data
   - Add README with exact instructions to reproduce every number in the paper
   - Tag release `replication-v1.0`

2. **App Development (Researcher Export)**
   - Implement the export functionality (or at minimum a high-fidelity prototype)
   - Test with real scenarios

3. **Supervisor Pitch Document**
   - Create first draft of the 1–2 page "Supervisor Pitch"

**Deliverables**
- Replication package v1.0 (public)
- Researcher Export feature live (or advanced prototype)
- Supervisor Pitch v0.8

---

### Week 8 – Full Paper Draft (First Complete Version)

**Primary Objectives**
- Produce a complete first draft of the paper (including new sections)

**Tasks**
1. **Paper Assembly**
   - Integrate all new sections:
     - Measurement and Operationalization
     - Expanded literature review
     - Updated Discussion with boundary conditions
   - Ensure all numbers are traceable to the replication package

2. **Internal Review**
   - Do a full self-review + ask 1–2 trusted people for feedback (even if informal)

3. **Finalize Supporting Documents**
   - Supervisor Pitch v1.0
   - Research Agenda companion document (4–5 pages)

**Deliverables**
- Complete paper draft v1.0 (target 15–20 pages + appendices)
- All supporting documents in good shape

---

### Week 9–10 – Refinement + Submission Preparation

**Tasks**
- Incorporate feedback from internal review
- Polish language and flow
- Prepare submission package for first target journal
- Finalize conference submissions (at least one abstract)
- Record a 10–12 minute video walkthrough of the model (optional but high signal)

**Deliverables**
- Paper draft v1.5 (ready for external review or submission)
- Conference abstract(s) submitted
- Full set of supporting materials

---

## Summary Timeline

| Week | Focus Area                          | Main Deliverable                     | Status |
|------|-------------------------------------|--------------------------------------|--------|
| 1    | Model freeze + Math appendix start  | Model v1.1 + Appendix draft 40%      |        |
| 2    | Hypotheses + Survey v0.1            | Propositions + Survey draft          |        |
| 3    | Interview protocol + Pilots outreach| Interview guide + Outreach list      |        |
| 4    | Replication package foundation      | Package skeleton + Parameter table   |        |
| 5    | Survey pilot + Measurement section  | Survey v0.9 + Measurement draft      |        |
| 6    | Interview pilots + Hypotheses v2    | Pilot insights + Propositions v2     |        |
| 7    | Full replication package            | Replication v1.0 + Export feature    |        |
| 8    | First full paper draft              | Paper v1.0                           |        |
| 9–10 | Refinement + Submission prep        | Paper v1.5 + Conference submissions  |        |

---

## Critical Dependencies & Risks

- Access to pilot organizations (biggest risk)
- Your available time (this plan assumes 15–25h/week)
- Development capacity for the "Researcher Export" feature

Would you like me to now create the actual template files (survey structure, replication package specification, Supervisor Pitch template) as separate documents? Or adjust the timeline / priorities?