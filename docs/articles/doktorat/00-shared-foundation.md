# 00 — Shared Foundation for the Three-Article Doctoral Cycle

**Binding contract for all three articles.** ProcuraCost / Tunnel-vs-Field doctoral programme, Uczelnia Łazarskiego (Lazarski University, Warsaw). Cross-disciplinary dissertation in *ekonomia i finanse* + *nauki o polityce i administracji*, submitted as a thematically-linked cycle of three peer-reviewed articles under **art. 187 ust. 3 ustawy z dnia 20 lipca 2018 r. — Prawo o szkolnictwie wyższym i nauce (PSWiN)**.

**Status:** normative reference. Every article in the cycle MUST conform to the notation (§2), draw citations only from the master bibliography (§3), state hypotheses consistently with (§4), reuse the recompute table in (§5) without recomputation, and close with the Claims/Non-Claims box (§6). Frozen against verification commit `a1063f9`; legal validity date **2026-06-28**. Sources of truth: `docs/VERIFICATION_REPORT.md` (citation table §2, parameter table §3, recompute §7), `docs/MODEL_PARAMETERS.md`, `RESEARCH.md`, `docs/EMPIRICAL_VALIDATION_PLAN.md`.

---

## 1. The red thread and the original-contribution statement (art. 187)

### 1.1 The cycle's red thread

Organizations — most acutely Polish public contracting authorities operating under *Prawo zamówień publicznych* (PZP) — **systematically conflate procurement POLICY with procurement PROCEDURE**. Policy is the binding boundary set, the constraints any award must satisfy: `∂Φ = {authorization, competition, ethics, documentation}`. Procedure is *one* ordered workflow `A = (a₁, …, aₖ)` that happens to cross that boundary. Treating one admissible procedure `Aᵢ` as if it *were* the policy collapses the optimization space `{A₁, …, Aₘ}` of all policy-satisfying procedures into a single locked path. The cycle argues this conflation produces two coupled effects: (i) a **measurable economic cost** (the seven-dimension opportunity-cost gap `ΔC_total`) and (ii) a **governance pathology** — *compliance theater*, in which procedural conformance is adopted as a personal risk shield that displaces value-seeking judgment.

The **key original inversion** that unifies and disciplines the whole cycle: the economics of public procurement show that **DISCRETION, not formality, is the price-and-selection cost driver**. Discretion raises prices (a structural effect of roughly 6%) and selects materially less-productive contractors (Szucs, 2024); competitive tendering is what *averts* this favoritism premium. The problem is therefore **symmetric and contingent**, not an ideological case against procedure. Rigidity carries real costs (delay, foregone TCO, renegotiation exposure, bypass hazard), but discretion carries its own — so the correct reform is "require competitive validation without mandating a single rigid competition *format*," preserving the price discipline of competition while restoring method flexibility within `∂Φ`.

### 1.2 Original-contribution statement (art. 187 ust. 1–3 PSWiN)

The cycle presents an **original solution to a scientific problem**: it formalizes, quantifies, and stress-tests the policy/procedure conflation as a *contingent* economic and governance pathology, overturning the intuitive (and, in an earlier draft of this very project, literally coded) assumption that *formality* is the cost driver. The contribution is genuinely **cross-disciplinary** and could not be produced from within either discipline alone:

- From **ekonomia i finanse**: a transparent, reproducible seven-dimension opportunity-cost model (`ΔC_total = Σ ΔCᵢ`) that imports the causal public-procurement-economics literature *honestly* — including the finding (Szucs, 2024) that cuts against the project's own headline — and exposes, via deterministic recompute, that the model's symmetry claim is directionally implemented but **numerically inert** at net (a structural, not accidental, result).
- From **nauki o polityce i administracji**: a theory of *compliance theater* and the *enforcement fallacy* under PZP, synthesizing street-level bureaucracy, normalization of deviance, multitask agency, Goodhart's Law, high-modernist legibility, and institutional isomorphism into a single prediction — that "make the tunnel harder to exit" is analytically self-defeating — and a reading of PZP that locates the boundary `∂Φ` *in the statute itself*, with the rigid procedure as an organizational choice layered on top.

The seam between the disciplines — that an economic cost number and a public-administration pathology are **two readings of the same conflation** — is itself the original move. The cycle demonstrates the candidate's general theoretical knowledge across both disciplines and the ability to conduct scientific work independently, as required by art. 187.

### 1.3 Discipline positioning of the three articles (see §7 for the binding table)

- **Article 1 — the cross-disciplinary SEAM (conceptual & formal foundation).** Locks the P/A/∂Φ notation, the Tunnel-vs-Field model, the conceptual decomposition `ΔC_total = Σ ΔCᵢ`, and the five-tradition enforcement-fallacy theory + symmetric reframe; does not quantify the model or run empirics.
- **Article 2 — anchors *ekonomia i finanse*.** Owns the closed-form cost model: deterministic recompute + parameter-provenance taxonomy + sensitivity/symmetry-inertness analysis, mapped onto the PZP legal-procedural structure. Reuses §5 verbatim.
- **Article 3 — anchors *nauki o polityce i administracji*.** Empirical secondary-data (UZP/BZP/TED) registered-report design + street-level operationalization of compliance theater under PZP (applying Article 1's enforcement-fallacy theory rather than re-deriving it).

---

## 2. Canonical notation block (use verbatim)

The following notation is **canonical** and must appear identically across all three articles. Do not re-letter, re-symbol, or paraphrase.

**Policy (the boundary):**
> **P = {r₁, …, rₙ}** — a set of rules defining authorization thresholds, competitive requirements, documentation standards, and ethical constraints that any procurement action must satisfy.

**Procedure (one path):**
> **A = (a₁, …, aₖ)** — a specific *ordered* sequence of actions constituting one sufficient method for satisfying policy P. For any P there generally exists a family {A₁, …, Aₘ} of valid procedures.

**The boundary set (canonical, verbatim):**
> **∂Φ = {authorization, competition, ethics, documentation}** (EN)
> **∂Φ = {uprawnienia, konkurencja, etyka, dokumentacja}** (PL)

Φ ⊂ ℝⁿ is the bounded space of policy-permissible actions; ∂Φ is its boundary, defined by the constraint set. Compliance in the field model is **continuous** (evaluated at every point of movement), not a momentary checkpoint state.

**The Tunnel vs. Field metaphor (canonical vocabulary):**

| Concept | English | Polish |
|---|---|---|
| Locked sequential procedure | tunnel | tunel |
| Policy-bounded freedom | field | pole |
| Mandatory waiting period | mandatory wait | obowiązkowe oczekiwanie |
| Informal bypass | bypass / exiting the tunnel | obejście / wyjście z tunelu |
| Boundary constraint | boundary | granica |
| Compliance navigator | navigator | nawigator |

In the tunnel, the human is a **step-executor** and compliance is binary; under pressure the actor faces force-reality-into-the-tunnel-or-exit, and exiting is the **bypass**. In the field, the human is a **navigator** maximizing value subject to staying inside ∂Φ; as compliant paths → ∞ the bypass incentive → 0 because there is nothing to bypass.

**Tagline (canonical, verbatim):**
> EN: **"A tunnel has walls. A field has a horizon."**
> PL: **"Tunel ma ściany. Pole ma horyzont."**

**The seven cost dimensions** (rigid path R vs. policy-flexible path F; each ΔCᵢ = cost(R) − cost(F)):

1. **Time** (`C_time`) — procurement staff time consumed by execution. `ΔC_time = (days_R − days_F) × n_buyers × rate_daily`.
2. **Admin** (`C_admin`) — fixed compliance-infrastructure overhead. `ΔC_admin = admin_R − admin_F`.
3. **Opportunity** (`C_opp`) — deployment-delay cost charged to **both** paths over their own duration (no zero-friction baseline). `ΔC_opp = (days_R − days_F) × rev_daily`.
4. **Favoritism / selection-quality** (`C_fav`; code field `productivityCost`, retained only for chart compatibility) — expected value loss from **discretion** in selection; borne mainly by the **flexible** path. `C_fav = V × δ × (1 − ρ) × κ`, with δ = `DISCRETION_FAVORITISM_PREMIUM` = 0.06, ρ = process rigidity index, κ = `CORRUPTION_RISK_CONTEXT`. **This is the dimension that makes the model symmetric.**
5. **Renegotiation** (`C_reneg`) — expected renegotiation cost *associated with* rigidity (observational/2SLS-IV, not a clean causal transfer). `P_R = P_base + Δp_rigidity × ρ_R`, `P_base ≈ 0.22`, `Δp_rigidity ∈ [0.077, 0.105]`; model uses the lower bound and scales by ρ.
6. **TCO** (`C_TCO`) — foregone total-cost-of-ownership savings, **discounted** (d = 0.05) and **capped** at 30% of contract value. `C_TCO = V × min(γ × A(T,d) × ρ, κ_TCO)`, γ = 0.10/yr, κ_TCO = 0.30.
7. **Bypass** (`C_bypass`) — expected audit/penalty cost of informal circumvention; ceiling-bounded sigmoid (steepness 6, threshold 0.9, ceiling 0.95) landing a maximally-rigid manual process near ~86% and falling to ~6% under end-to-end digital tooling.

**Total differential (canonical):**
> **ΔC_total = ΔC_time + ΔC_admin + ΔC_opp + ΔC_fav + ΔC_reneg + ΔC_TCO + ΔC_bypass = Σᵢ ΔCᵢ**

ΔC_total > 0 means the rigid path costs more. The favoritism and bypass dimensions can run *against* the flexible path, so ΔC_total is *structurally capable* of being negative — but see the symmetry-inertness verdict in §5.2 before making any net claim.

---

## 3. Master bibliography (APA 7) — caveats baked in

All three articles draw in-text citations and reference lists **only** from this list. Each empirical entry carries its verified identification and external-validity caveat (from `docs/VERIFICATION_REPORT.md` §2); reproduce the caveat wherever the source is used to ground a number. Use exact framings.

### 3.1 Anchor empirical studies (peer-reviewed)

**Szucs, F. (2024). Discretion and favoritism in public procurement. *Journal of the European Economic Association, 22*(1), 117–160. https://doi.org/10.1093/jeea/jvad017**
*Use exactly:* discretion raises normalized price by **~6% (structural causal estimate; reduced-form ~8%; raw discontinuity ~9%)** and selects **~10% less-productive** contractors. Hungarian public-procurement RDD around a 25M HUF reform threshold + structural selection-correction; **≈2/3 of the discontinuity is firm sorting/selection**, not a pure discretion treatment effect (read δ = 0.06 as an upper-bound, endogeneity-laden coefficient; value-manipulation/bunching caveat). **Competitive tendering averts the favoritism premium.** External validity: Hungarian public → generic/PL/private is a transfer, not a measured Polish value.

**Beuve, J., Moszoro, M. W., & Spiller, P. T. (2021). *Contractual rigidity and political contestability: Revisiting public contract renegotiations* (NBER Working Paper No. 28491). National Bureau of Economic Research. https://doi.org/10.3386/w28491** — published as **Beuve, J., Moszoro, M. W., & Spiller, P. T. (2023). Contractual rigidity and political contestability: Revisiting public contract renegotiations. *Journal of Law, Economics, and Organization, 39*(1), 281–308. https://doi.org/10.1093/jleo/ewab022**
*Use exactly:* a one-SD increase in contractual rigidity raises renegotiation by **7.7–10.5 percentage points**, from a **22% unconditional base**. Identification is **2SLS/IV** (rigidity instrumented by political contestability; exclusion restriction load-bearing) — **not** "observational." External validity: French car-park sector, single concession-granting setting, estimation sample n ≈ 279; per-SD dose. (Model uses 0.077 base premium scaled by ρ.)

**Guasch, J. L. (2004). *Granting and renegotiating infrastructure concessions: Doing it right*. World Bank. ISBN 0-8213-5792-1. https://doi.org/10.1596/0-8213-5792-1**
*Use exactly:* ~**30%** of LAC concessions renegotiated, rising to **≈41.5% EXCLUDING telecommunications** (the 41.5% figure is the *ex-telecom* rate, not the all-in rate). LAC infrastructure concessions; observational/probit, design jointly chosen. Corroborating cite for the 22% base only.

**Bajari, P., Houghton, S., & Tadelis, S. (2014). Bidding for incomplete contracts: An empirical analysis of adaptation costs. *American Economic Review, 104*(4), 1288–1319. https://doi.org/10.1257/aer.104.4.1288**
*Use exactly:* adaptation costs **7.5–14% of contract value** (version-of-record; author PDF 8–14%; working-paper ~10%). US Caltrans highway-paving; observational + structural with engineer-identity IV and firm FE. **Do NOT reuse as the TCO basis — it double-counts with the renegotiation dimension.**

**Bajari, P., & Tadelis, S. (2001). Incentives versus transaction costs: A theory of procurement contracts. *RAND Journal of Economics, 32*(3), 387–407. https://doi.org/10.2307/2696361**
*Use for:* the contract-form-endogeneity mechanism (form jointly chosen with complexity) behind the BHT 2014 result.

**Decarolis, F. (2014). Awarding price, contract performance, and bids screening: Evidence from procurement auctions. *American Economic Journal: Applied Economics, 6*(1), 108–132. https://doi.org/10.1257/app.6.1.108**
*Use exactly:* **at least half (≥50%)** of the cost savings from lower winning prices are lost to ex-post renegotiation; screening reduces initial savings by about a third. Italian public-works, non-binding bids; quasi-experimental staggered first-price adoption (adoption-timing caveat). Use the **full subtitle**.

**Coviello, D., & Mariniello, M. (2014). Publicity requirements in public procurement: Evidence from a regression discontinuity design. *Journal of Public Economics, 109*, 76–100. https://doi.org/10.1016/j.jpubeco.2013.10.008**
*Use exactly:* publicity/competition **does not increase (and reduces delay by ~7.8pp)** and does not increase subcontracting; sharp/fuzzy RDD at the €500k publicity threshold; low-value (€200k–800k) Italian public works. Mechanism is **selection**, not competition per se.

### 3.2 Practitioner / institutional benchmarks (NOT peer-reviewed — label as such)

**European Commission. (2011). *Evaluation report: Impact and effectiveness of EU public procurement legislation* [Prepared by PwC, London Economics & Ecorys]. European Commission.**
*Use exactly:* average procedure cost **~€28,000 (75% supplier-side)**, **5.4 bidders**, **38 days**, **€5.26 bn** aggregate, **<1.3% of value**; regressivity 18–29% / 6–9%. EU above-threshold public, EEA-30, 2009. Caveat: €28k is *total* procedure cost, not the rigidity premium; only ~0.4% of value (~€1.68 bn) is Directive-incremental.

**Institute for Supply Management. (n.d.). *Understanding total cost of ownership in procurement*. https://www.ism.ws/supply-chain/ownership-in-procurement/**
*Use exactly:* TCO-based sourcing "can deliver **up to 30%** … over three years" — a practitioner **ceiling / best-case**, not a flat ~10%/yr empirical rate; no control/counterfactual; *Supply Chain Management Review* best-case provenance. Used only as the cumulative cap κ_TCO = 0.30. **Do not attribute the figure to CAPS Research** (unsupported). Premise of the TCO dimension is anchored to Decarolis (2014), not to ISM.

### 3.3 Theory set (qualitative / formal — analogical transfer to procurement)

**Holmström, B., & Milgrom, P. (1991). Multitask principal–agent analyses: Incentive contracts, asset ownership, and job design. *Journal of Law, Economics, & Organization, 7*(Special Issue), 24–52. https://doi.org/10.1093/jleo/7.special_issue.24** — enforcing measurable (procedural) tasks crowds out unmeasured (value-creating) ones; formal model, transferred by analogy.

**Lipsky, M. (1980). *Street-level bureaucracy: Dilemmas of the individual in public services*. Russell Sage Foundation.** — discretionary adaptation of rules is the *normal* condition of complex frontline work; enforcement drives bypass underground, not away.

**Vaughan, D. (1996). *The Challenger launch decision: Risky technology, culture, and deviance at NASA*. University of Chicago Press.** — normalization of deviance: prohibited-but-necessary workarounds normalize invisibly and accumulate hidden risk.

**Goodhart, C. A. E. (1975). Problems of monetary management: The U.K. experience. *Papers in Monetary Economics, 1*. Reserve Bank of Australia.** (Popularized as "Goodhart's Law" by Strathern, 1997.) — when compliance-rate becomes the target it ceases to be a good measure.

**Strathern, M. (1997). 'Improving ratings': Audit in the British University system. *European Review, 5*(3), 305–321.**

**Scott, J. C. (1998). *Seeing like a state: How certain schemes to improve the human condition have failed*. Yale University Press.** — high-modernist procedural systems fail because they cannot encode *métis* (local, contextual practitioner knowledge).

**Norman, D. A. (1988). *The design of everyday things*. Basic Books.** — systematic user bypass indicates *design* failure, not user failure.

**DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited: Institutional isomorphism and collective rationality in organizational fields. *American Sociological Review, 48*(2), 147–160. https://doi.org/10.2307/2095101** — organizations adopt similar procedures for legitimacy, not optimality.

**Kraljic, P. (1983). Purchasing must become supply management. *Harvard Business Review, 61*(5), 109–117.** — strategic/leverage/bottleneck/routine segmentation underpinning the Direct/Indirect × Upstream/Downstream dimensions (direction only).

### 3.4 Supporting governance / measurement literature

**Fazekas, M., & Kocsis, G. (2020). Uncovering high-level corruption: Cross-national objective corruption risk indicators using public procurement data. *British Journal of Political Science, 50*(1), 155–164. https://doi.org/10.1017/S0007123417000461** — Corruption Risk Index; ordinal grounding for the `CORRUPTION_RISK_CONTEXT` direction only.

**Fazekas, M., & Blum, J. R. (2021). *Improving public procurement outcomes: Review of tools and the state of the evidence base* (Policy Research Working Paper No. 9690). World Bank Group.** — price/value-for-money effects. **Caveat:** does *not* measure project duration; the earlier "42% longer duration" claim was unsupported and is removed.

**Kelman, S. (1990). *Procurement and public management: The fear of discretion and the quality of government performance*. AEI Press.**

**Chartered Institute of Procurement & Supply. (2024). *Procurement policies & procedures explained*. CIPS Intelligence Hub.** — the policy/procedure working definition.

### 3.5 Legal sources — PZP (valid as of 2026-06-28; corrected articles)

**Ustawa z dnia 11 września 2019 r. — Prawo zamówień publicznych** (tekst jednolity **Dz.U. 2026 poz. 793**). Path-to-article mapping (all verified correct):

| Path | Article |
|---|---|
| przetarg nieograniczony | **art. 132** (132–139) |
| przetarg ograniczony | **art. 140** (140–151) |
| dialog konkurencyjny | **art. 169** (169–188) |
| negocjacje z ogłoszeniem (przesłanki) | **art. 153** |
| zamówienie z wolnej ręki | **art. 214 ust. 1** |
| tryb podstawowy | **art. 275** |

Statutory waiting periods (corrected):
- **art. 138 ust. 1** — **35-day** EU-procedure publication minimum (pzp_eu). Correct.
- **art. 283** — national tryb podstawowy minimum bid period: **7 days (dostawy/usługi) / 14 days (roboty budowlane)**. *(The previously coded "21-day national minimum" was wrong — it echoed the repealed 2004 PZP.)*
- **art. 264 ust. 1** — standstill: **10 days (komunikacja elektroniczna) / 15 days (inny sposób)**. *(The previously coded "11-day standstill" was not statutory.)*
- **art. 2 ust. 1 pkt 1** — **130,000 PLN** exemption threshold. Correct.

Thresholds (from the obwieszczenie below; EUR = 4.31 PLN):
- Sub-central supplies/services EU threshold: 216,000 EUR = **930,960 PLN** (use this, not the earlier 900,000 PLN approximation).
- Works EU threshold: 5,404,000 EUR = **23,291,240 PLN**.
- Central-government supplies/services threshold: 603,400 PLN.

**Obwieszczenie Prezesa Urzędu Zamówień Publicznych z dnia 8 grudnia 2025 r. w sprawie aktualnych progów unijnych** (**M.P. 2025 poz. 1247**). — 2026–2027 thresholds.

**Dyrektywa Parlamentu Europejskiego i Rady 2014/24/UE z dnia 26 lutego 2014 r. w sprawie zamówień publicznych** (Dz. Urz. UE L 94).

### 3.6 Illustrative private-sector cases (motivation ONLY — never evidence about PZP)

These appear strictly as illustrative motivation; they are **not** evidence about public-procurement law and must always be flagged as such (honest-framing invariant 4):

- **Ryanair fleet acquisition** — IJRAR (2019), *Ryanair strategic positioning and fleet management*, 6(2).
- **Swiss Casinos ERP (Lean Agile Procurement)** — EY Switzerland (2024), *Integrating agile practices into procurement processes*; Skylight Digital (2024), *Agile procurement playbook — Appendix A: Case studies*, U.S. Digital Service.
- **Air France KLM Martinair cargo** — EY Switzerland (2024).
- **Zara / Inditex** — Tradogram (2024), *Agile procurement practices: A comprehensive guide*.
- **GEP (2024), *Should-cost modeling*** — corroborating practitioner should-cost evidence (TCO dimension).

### 3.7 Article-3 empirical-design sources (registered-report / Polish-market layer)

Article 3 is an applied/empirical registered-report-style design and legitimately requires methods citations and Polish/EU statistical sources beyond §3.1–§3.6. These are **admitted to the binding master bibliography here** so the "cite only from this list" contract (§3 preamble) is honored cycle-wide. They are scoped to Article 3 (and any later empirical work) and sit **outside the verification report's citation table** — the two statistical sources below were **independently verified against their primary documents** (UZP 2023 *Sprawozdanie*: exec-summary "Najważniejsze dane" and Tab. 9–18; Scoreboard: Poland country card, June 2026) and must be cited with page/table provenance wherever a figure is reproduced; any figure that cannot be confirmed must be removed or marked provisional. Polish-language in-text articles render the author conjunction as "i"; the entries below use APA "&" in this English master list.

**Methods (regression-discontinuity density testing):**

**McCrary, J. (2008). Manipulation of the running variable in the regression discontinuity design: A density test. *Journal of Econometrics, 142*(2), 698–714. https://doi.org/10.1016/j.jeconom.2007.05.005** — running-variable density test; in A3 its role is **inverted from diagnostic to result** (bunching below thresholds = observable bypass signature).

**Cattaneo, M. D., Jansson, M., & Ma, X. (2020). Simple local polynomial density estimators. *Journal of the American Statistical Association, 115*(531), 1449–1455. https://doi.org/10.1080/01621459.2019.1635480** — modern local-polynomial density estimator (no pre-binning); robustness companion to McCrary for the same density test.

**Polish / EU statistical sources (descriptive context — NOT model outputs, NOT peer-reviewed; verified against primary documents):**

**Urząd Zamówień Publicznych. (2024). *Sprawozdanie Prezesa Urzędu Zamówień Publicznych z funkcjonowania systemu zamówień publicznych w 2023 r.* Urząd Zamówień Publicznych.** *Verified figures (2023):* market value PLN 279.8 bn ≈ 8.20% GDP (GDP est. PLN 3,410.1 bn), ~157,500 awards; 130k–EU band PLN 73.6 bn, above-EU PLN 206.2 bn; avg bids 2.64 (sub-EU) / 2.12 (EU); single-bid 38.5% / 54.0% (Tab. 15, 18); >90% competitive forms in each band; durations 40 / 90 days (Tab. 9–10); price-only criterion 23% / 42% (Tab. 11); 3,963 KIO appeals. Caveat: published aggregate, not a causal estimate.

**Komisja Europejska. (2024). *Single Market and Competitiveness Scoreboard: Public procurement — Poland*. European Commission.** *Verified figures:* single-bidder 56% (EU 28%), decision speed 54 days (EU 74), award to lowest price 56% (EU 54%), division into lots 47% (EU 32%). Caveat: composite indicators, comparative context only.

**Legal source (quasi-experimental variation for DiD):**

**Ustawa z dnia 2 marca 2020 r. o szczególnych rozwiązaniach związanych z zapobieganiem, przeciwdziałaniem i zwalczaniem COVID-19, innych chorób zakaźnych oraz wywołanych nimi sytuacji kryzysowych (Dz.U. 2020 poz. 374, z późn. zm.).** — temporary statutory PZP exemptions for pandemic-related purchases; the "less procedure" natural experiment for the COVID-era DiD. Use only as a design source, never as evidence of an effect.

---

## 4. Hypotheses H1–H4 (binding wording)

From `docs/EMPIRICAL_VALIDATION_PLAN.md` §2. These are **directional claims to be tested**, not assumed results; the model is **symmetric** and the empirical program must be able to detect the case where the gap vanishes or reverses.

- **H1 (Conditional Cost Gap).** In high-value, high-corruption-risk, strategic (**Direct × Upstream**) contexts, organizations using more rigid procedures experience materially higher total opportunity costs (`ΔC_total`) than policy-flexible approaches in comparable contexts. The model's illustrative **100–400%** range is the magnitude *to be tested*, not a confirmed effect; **H1 explicitly allows the gap to vanish or reverse in low-corruption-risk operational contexts.**
- **H2 (Direct > Indirect).** The cost gap is significantly larger for **Direct** spend than for **Indirect** spend.
- **H3 (Upstream > Downstream).** Rigidity in **Upstream** activities generates higher bypass risk and foregone strategic value than equivalent rigidity in **Downstream** execution.
- **H4 (Bypass as Mediator).** A substantial portion of the opportunity cost arises from informal **bypass behavior** rather than from direct compliance costs (bypass mediates the rigidity → cost relationship).

Identification posture (carry into every article): within-firm variation + category fixed effects; rigidity/bypass measured via validated multi-item scales + forensic PO-vs-communication analysis; propensity-score matching on observable category characteristics; legacy-system constraints as candidate instrument.

---

## 5. Deterministic recompute table + symmetry-inertness verdict (Article 2 reuses this verbatim)

Real-code recompute via Node v26 native TS type-stripping over verbatim `lib/` copies (imports the *actual* `calculateCosts` + `SCENARIOS`; no re-implementation). All 9 reference scenarios computed. All scenarios leave `spendType`/`processPhase` unset → Direct/Indirect × Upstream/Downstream multipliers = 1.0 (dormant for shipped cases). Source: `docs/VERIFICATION_REPORT.md` §7.

### 5.1 Per-dimension Δ (rigid − flexible), PLN. Δ > 0 means the rigid path costs more.

| scenario (type / tech) | CV | time | admin | opp | favor. | reneg | tco | bypass | TOT rigid | TOT flex | **deltaC** | **% CV** | dominant |
|--|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--|
| fleet (private_formal/partial_erp) | 5.0M | 0 | 3k | 120k | −54k | 17k | 418k | 32k | 940k | 404k | **+536k** | +10.72% | tco |
| erp (private_formal/sourcing_tool) | 3.0M | 0 | 6k | 420k | −32k | 34k | 368k | 27k | 1.44M | 621k | **+823k** | +27.42% | opp |
| logistics (private_formal/partial_erp) | 8.0M | 0 | 3k | 480k | −86k | 45k | 980k | 50k | 2.46M | 992k | **+1.47M** | +18.41% | tco |
| production (private_formal/manual) | 12.0M | 0 | 16k | 1.65M | −130k | 56k | 514k | 213k | 4.34M | 2.02M | **+2.32M** | +19.34% | opp |
| pipe_vs_field (pzp_eu/partial_erp) | 5.0M | 14k | 8k | 730k | −240k | 28k | 1.09M | 181k | 2.48M | 672k | **+1.81M** | +36.19% | tco |
| catalog (catalog_order/end_to_end) | 50k | 0 | 1k | 0 | −30 | 0 | 238 | −35 | 5k | 3k | **+1.6k** | +3.15% | admin |
| mrp (mrp_order/end_to_end) | 500k | 0 | 1k | 0 | 0 | 2k | 0 | −204 | 25k | 22k | **+2.7k** | +0.54% | reneg |
| capex_investment (capex/partial_erp) | 15.0M | 0 | 3k | 720k | −308k | 97k | 2.76M | 249k | 7.02M | 3.50M | **+3.52M** | +23.49% | tco |
| custom (private_formal/partial_erp) | 1.0M | 0 | 3k | 240k | −11k | 11k | 84k | 6k | 618k | 284k | **+334k** | +33.36% | opp |

### 5.2 Symmetry test — does `deltaC` ever flip sign? **No. 0 of 9 scenarios.**

`deltaC` is **strictly positive in every shipped scenario** — flexible is net-cheaper everywhere, *including* the maximal-stakes `pipe_vs_field` case (pzp_eu, `CORRUPTION_RISK_CONTEXT = 1.0`, ρ = 0.95), which is in fact the **single widest gap** as a share of contract value (+36%). The favoritism dimension *does* favor the rigid path in **8/9** scenarios (Δ from −11k to −308k; `mrp` is exactly 0 because ρ = 0.12 ≤ the 0.15 policy floor), so governance value is credited **per-dimension** — but it never wins at net. Among the 9 scenarios the dominant dimension is `tco` in 4 (fleet, logistics, pipe_vs_field, capex) and `opp` in 3 (erp, production, custom), with `catalog` (admin) and `mrp` (reneg) the two sub-threshold micro-cases; i.e., the gap is driven by `tcoCost` (4) or `opportunityCost` (3) in every value-significant case.

**Verdict (binding):** the model's central honesty claim — that it is symmetric, so "the rigid path can be net-cheaper for high-value, high-corruption-risk, competitive contexts" — **holds only as a per-dimension gesture and is refuted at net `deltaC`.** The single rigid-favoring term is structurally bounded (`|ΔC_fav| = CV × 0.06 × κ × (ρ_R − ρ_F)` ≤ 0.048·CV even at pzp_eu/κ=1.0), while the rigid-penalizing TCO (≤30% cap) and opportunity (long rigid day-counts) terms run 4–10× larger (20–36% of CV). No shipped scenario flips negative, and none realistically could without raising `DISCRETION_FAVORITISM_PREMIUM`, allowing `CORRUPTION_RISK_CONTEXT > 1.0`, or shrinking the TCO/opportunity penalties. **Symmetry is a STRUCTURAL POSSIBILITY whose net realization is sensitivity-dependent — directionally implemented but numerically inert. Disclose it; never present it as an observed or emergent net finding.**

---

## 6. Standard "Claims and Non-Claims" box (mandatory near the end of each article)

Each article MUST close with this box (adapt the article-specific line where noted), reproducing all six honest-framing invariants. Provide the English version in EN articles and the Polish version in PL articles; bilingual articles carry both.

### 6.1 English

> **Claims and Non-Claims**
>
> **What this article claims.** [Article-specific 1–2 sentences.] All quantitative outputs are **model estimates** generated under the assumptions documented in `docs/MODEL_PARAMETERS.md` — they are *not* measured empirical facts about Polish (or any) procurement.
>
> **What this article does NOT claim.**
> 1. The headline magnitude (e.g., rigid path 100–400% over policy-only) is an **estimate with sensitivity bands**, never a finding.
> 2. **Symmetry is numerically inert at net.** Real-code recompute of all 9 reference scenarios yields `ΔC_total > 0` in **9/9** (strictly positive everywhere); "the rigid path can be net-cheaper" holds **only per-dimension** (favoritism subsidizes the rigid path in 8/9 cases) and **never at net**, because the rigid-favoring term is structurally bounded an order of magnitude below the TCO and opportunity penalties. Symmetry is a *structural possibility*, not an observed net finding.
> 3. The path optimizer is a **weighted rule-based scoring function with a 30-run sensitivity sweep** — it is **NOT** machine learning, **NOT** a Random Forest, and **NOT** validated against real procurement outcomes.
> 4. The private-sector cases (Ryanair, Swiss Casinos, Air France, Zara) are **illustrative motivation only**; they are not evidence about public-procurement law.
> 5. Roughly **35–40% of model parameters are peer-reviewed**; the remainder are **calibrated or Grade-C modeling assumptions** rendered as cardinal numbers.
> 6. All imported effects carry their **identification and external-validity caveats** (Szucs: Hungarian-public RDD, ~2/3 selection; Beuve: French car-parks, 2SLS/IV; Guasch: LAC ex-telecom; Bajari-Houghton-Tadelis: US Caltrans; Decarolis/Coviello-Mariniello: Italian works). Transfers to the Polish context are benchmarks, not measurements.

### 6.2 Polish

> **Zakres twierdzeń (Claims and Non-Claims)**
>
> **Co artykuł twierdzi.** [1–2 zdania właściwe dla artykułu.] Wszystkie wyniki ilościowe są **estymacjami modelowymi** wygenerowanymi przy założeniach udokumentowanych w `docs/MODEL_PARAMETERS.md` — nie są zmierzonymi faktami empirycznymi o polskich (ani żadnych innych) zamówieniach.
>
> **Czego artykuł NIE twierdzi.**
> 1. Nagłówkowa wielkość (np. ścieżka sztywna 100–400% powyżej ścieżki policy-only) jest **estymacją z przedziałami wrażliwości**, nigdy ustaleniem (finding).
> 2. **Symetria jest liczbowo bezczynna na poziomie netto.** Przeliczenie na realnym kodzie wszystkich 9 scenariuszy referencyjnych daje `ΔC_total > 0` w **9/9** (ściśle dodatnie wszędzie); teza „ścieżka sztywna bywa tańsza netto" obowiązuje **wyłącznie per-wymiar** (faworytyzm subsydiuje ścieżkę sztywną w 8/9 przypadków) i **nigdy netto**, ponieważ człon sprzyjający sztywności jest strukturalnie ograniczony o rząd wielkości poniżej kar TCO i kosztu utraconych korzyści. Symetria to *możliwość strukturalna*, nie zaobserwowane ustalenie netto.
> 3. Optymalizator ścieżki to **ważona funkcja scoringowa oparta na regułach z 30-przebiegowym testem wrażliwości** — to **NIE** uczenie maszynowe, **NIE** Random Forest i **NIE** jest walidowany na rzeczywistych wynikach zamówień.
> 4. Przypadki sektora prywatnego (Ryanair, Swiss Casinos, Air France, Zara) są **wyłącznie ilustracyjną motywacją**; nie są dowodem w sprawie prawa zamówień publicznych.
> 5. Około **35–40% parametrów modelu jest recenzowanych (peer-reviewed)**; pozostałe to **założenia kalibrowane lub modelowe klasy C** wyrażone jako liczby kardynalne.
> 6. Wszystkie zaimportowane efekty niosą swoje **zastrzeżenia identyfikacyjne i zewnętrznej trafności** (Szucs: węgierski RDD sektora publicznego, ~2/3 selekcja; Beuve: francuskie parkingi, 2SLS/IV; Guasch: Ameryka Łac. bez telekomunikacji; Bajari-Houghton-Tadelis: US Caltrans; Decarolis/Coviello-Mariniello: włoskie roboty budowlane). Transfery na kontekst polski są benchmarkami, nie pomiarami.

---

## 7. Discipline-positioning note (binding allocation across the cycle)

| Article | Title | Discipline role | Primary literatures | Reuses |
|---|---|---|---|---|
| **Article 1** | *Tunnel or Field: Policy versus Procedure as the Hidden Architecture of Procurement Governance* (EN) | **Conceptual & formal foundation; the cross-disciplinary SEAM** | Formalizes P/A/∂Φ and the Tunnel-vs-Field model; the five-tradition enforcement-fallacy synthesis (Lipsky 1980; Vaughan 1996; Holmström-Milgrom 1991; Goodhart 1975/Strathern 1997; Scott 1998; Norman 1988; DiMaggio-Powell 1983; Kelman 1990); the symmetric reframe (Szucs 2024). Locks the notation + theory the companions reuse; does **not** quantify the model or run empirics. | defines §2 notation, §6 box |
| **Article 2** | *Ile kosztuje sztywność? Symetryczny, wielowymiarowy model kosztu proceduralnego w zamówieniach* (PL) | **Anchors *ekonomia i finanse*** | Szucs (2024); Beuve et al. (2021/2023); Guasch (2004); Bajari-Houghton-Tadelis (2014); Decarolis (2014); Coviello-Mariniello (2014); EC PwC (2011); ISM. **Owns** the closed-form specification of `ΔC_total = Σ ΔCᵢ`, the A/B/C parameter-provenance taxonomy, the deterministic recompute, the sensitivity sweeps (TCO yr1 6/8/12%; `CORRUPTION_RISK_CONTEXT` gradient; `PROCESS_RIGIDITY` pzp_eu=0.95; reneg factor 0.6–0.85), and binds paths to PZP arts. 132/140/169/153/214/275. | Article 1's notation + decomposition; **§5 recompute table verbatim**, §6 box |
| **Article 3** | *Gdzie sztywność naprawdę kosztuje? Zastosowanie modelu kosztu proceduralnego do polskich zamówień publicznych (UZP/BZP/TED)* (PL) | **Anchors *nauki o polityce i administracji*** | Empirical secondary-data design on Polish/EU sources (TED, BZP/e-Zamówienia, opentender.eu/DIGIWHIST, UZP sprawozdania, GUS); street-level operationalization of compliance theater (Lipsky/Vaughan/Goodhart/DiMaggio-Powell **applied**, citing Article 1 rather than re-deriving); PZP statute. | §2 notation, §4 hypotheses (H1–H4), §6 box |

**Seam logic.** **Article 1 is the seam:** it supplies the shared concept, notation, and theory that bridge economics and public administration — "two readings of one conflation." **Article 2 (the *ekonomia i finanse* anchor)** produces and stress-tests the cost number `ΔC_total` and binds it to the PZP path structure. **Article 3 (the *nauki o polityce i administracji* anchor)** takes the framework to Polish procurement data and to the street level. Each discipline's work is done once: Article 1 = theory; Article 2 = economic quantification; Article 3 = empirical/governance operationalization. No article may contradict another on any value, sign, or framing in §2–§6; the verification report (`a1063f9`) is the tie-breaker.
