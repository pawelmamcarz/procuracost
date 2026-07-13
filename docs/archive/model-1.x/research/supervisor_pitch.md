# Supervisor / Co-author Pitch Document

**Date**: July 2026  
**Author**: Paweł Mamcarz  
**Working title**: The Hidden Cost of Procedural Compliance: Quantifying Opportunity Costs of Rigid Procurement Rules vs. Policy-Based Procurement

---

## One-sentence core claim

The policy/procedure distinction can be formalized as a transparent, falsifiable measurement framework whose assumptions and predicted cost differences vary across Direct/Indirect spend and Upstream/Downstream phases.

---

## The Problem (3–4 sentences)

Organizations may conflate procurement *policy* (binding constraints) with procurement *procedure* (one operational path). We propose that this can favor procedural safety over less observable value creation. ProcuraCost turns the proposed mechanism into explicit constructs and assumptions that can be audited, challenged, and calibrated; it does not yet establish prevalence or effect size.

---

## Our Contribution (what is new)

1. **Methodological — primary contribution**: Open candidate measurement instrument (ProcuraCost) with a calculation trace, role-level staff costs, researcher exports, regression tests, generated scenario tables, and separate model/build versions (model v1.2).

2. **Computational**: Transparent 2×2 simulation framework (Direct/Indirect × Upstream/Downstream) whose assumptions and transformations are reproducible and sensitivity-testable.

3. **Conceptual — secondary framing**: Working distinction between policy and procedure, with Tunnel vs. Field used as an organizing metaphor rather than a validated theory.

4. **Empirical agenda**: Falsifiable propositions and pilot instruments connecting each construct to survey, interview, timestamp, contract, and transaction data.

**Evidence so far**: Computational verification and synthetic scenario outputs only. No primary organizational data have yet been collected. The parameter register identifies the 2×2, TCO, bypass, technology, duration, and role-hour values as calibration targets.

---

## Current State (July 2026)

- Implemented cost model v1.2 with per-step calendar time and senior-effort assumptions for the 2×2 dimensions.
- Public live tool at procuracost.com (Polish + English) including the interactive Assumptions Explorer that exposes the exact multipliers used in every calculation.
- Methodological working draft (RESEARCH.md) under evidence audit, with four illustrative archetypes clearly separated from empirical cases.
- Parameter register (MODEL_PARAMETERS.md) distinguishing empirical anchors, user inputs, assumptions, disabled terms, and validation gaps.
- Replication workflow (`npm run replicate`) producing complete JSON traces and Markdown/CSV scenario tables.
- Full set of research instruments ready for pilots:
  - `testable_propositions_v1.md` (6–8 propositions with justification, operationalization, data sources)
  - `survey_crosswalk.md` (direct mapping survey questions → model parameters)
  - `interview_protocol_v1.md` (45–60 min protocol using the 2×2 lens)
  - `pilot_case_study_protocol.md` (standardized template that feeds directly into researcher exports)
- Researcher Export live in the calculator results and Assumptions Explorer (full inputs + multipliers + breakdown + metadata) — the primary mechanism for structured data collection.

---

## Proposed Collaboration / What We Are Looking For

**Primary ask – Promotor for an external-mode doctorate (tryb eksternistyczny)**  
I am pursuing the doctorate in the external mode: the research program is self-funded and already in motion, so the ask is scientific supervision of a dissertation built around Paper 1 (conceptual-methodological, near submission-ready) and Paper 2 (confirmatory empirical study, fully designed). No doctoral-school slot or stipend is involved.

**What I bring: a shovel-ready confirmatory study (Paper 2)**  
The confirmatory design is specified to preregistration grade before any data collection: within-organization matched pairs of procurement events, a continuous observed-rigidity index with a frozen codebook, outcome-blind matching protocol, statistical analysis plan, and power simulation targets (see `docs/research/confirmatory_preregistration_manifest.md` and companion documents). By construction it requires resources I cannot supply alone — two outcome-blind trained coders plus a blinded adjudicator, and multi-organization recruitment. It is therefore an ideal core for a small grant (e.g., NCN) executed with the supervisor's team; a *doktorat wdrożeniowy* is a natural upgrade path if a partner organization formalizes.

**Option B – Active Co-authorship**  
Joint refinement and execution of the empirical validation (pilot cases + archival matching). Co-writing of Measurement & Operationalization and identification sections. Paper 1's journal submission is deliberately held so that venue choice and authorship can be decided jointly (*Journal of Public Procurement*, *Journal of Purchasing & Supply Management*, *Public Administration Review* are candidates).

**Option C – Institutional / Data Access**  
Introductions to 3–5 organizations for confidential pilots (2–4 hours effort per org). Support for grant applications to fund the confirmatory study.

---

## Why This Project Might Be Interesting (for the supervisor)

- Timely: public procurement reform debates, digital transformation of governance, behavioral public administration.
- Clear policy and managerial implications (when to keep the "tunnel", when to move to the "field").
- Strong multi-paper potential (model paper + validation paper + sector/country extensions).
- Open research infrastructure with computational reproducibility: model outputs can be regenerated from tests, exports, and documented functions. Reproducibility is explicitly separated from empirical validity.
- Direct relevance to Polish (PZP) and broader European procurement discussions.
- Transparent, honest positioning: we have a working measurement model and pilot instruments; we are now seeking the right partnership for credible empirical validation.

---

## Contact & Next Step

Paweł Mamcarz  
pawel@mamcarz.com  
https://mamcarz.com  
ORCID: 0009-0002-3274-4226

I can immediately provide:
- Current working paper draft (RESEARCH.md) with formal Reproducibility Statement and section 3.8 recipe
- Extended abstract v1.0 (docs/research/extended_abstract_v1.md) — methodological draft for feedback
- Updated supervisor pitch and evidence-audited parameter register
- Review package / feedback request (`docs/research/v1.0_feedback_request.md`) — focused questions on 2×2 integration, measurement model, and reproducibility. We have a full structured process ready: summary template, incorporation log, and post-feedback checklist (to ensure traceability and re-verification after changes).
- Live tool + Assumptions Explorer walkthrough
- Full replication materials with concrete reproduction guide for the paper's numbers
- This 1–2 page pitch + the detailed 8–10 week action plan

I am available for a 30–45 minute call at your convenience.

---

*Tone note: Professional, confident, and intellectually honest. We are past the "idea" stage and have concrete, versioned, open artifacts, but we are still in the demonstration + instrument-building phase and are explicitly looking for the right academic partnership to reach submission-ready empirical work.*
