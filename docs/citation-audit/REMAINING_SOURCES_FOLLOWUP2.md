# Remaining source gaps: follow-up 2 (resolution round)

Checked **22 September 2026**. Scope: the four unresolved items in [REMAINING_SOURCES_FOLLOWUP.md](REMAINING_SOURCES_FOLLOWUP.md) (21 September 2026). This round **applies corrections**: the model, the Polish article and parameter documentation are updated on branch `audit/2026-09-22-source-closure` (details in §5). The same evidentiary boundaries hold: no login, registration, form submission, paywall bypass or author contact was used; "not found" describes these searches, not proof of non-existence; tool errors are distinguished from access restrictions.

**Result:** the Beuve discrepancy is **resolved** (a version difference, not a transcription error); the ProcureCon 67%/54%/51% denominators are **resolved** (subgroup base, not full sample); Zero100 remains **unverified** with a strong N=100/December 2025 pointer; the Lipsky and Vaughan page locators are **confirmed**, full texts remain lawfully inaccessible.

## 1. Beuve, Moszoro and Spiller: RESOLVED as a version difference

**NBER w28491 (February 2021), full PDF obtained.** Table 4 (printed p. 29) shows IV coefficients for contractual rigidity of **0.015\*\* (0.008) / 0.011\*\* (0.005) / 0.013\* (0.008)**. The prose (printed p. 19) is identical to the published wording: *"an increase in one standard deviation in each category of contractual rigidity increases contract renegotiation by 7.7–10.5 percent"*. Arithmetic: 7×0.011 = 0.077, 7×0.015 = 0.105 — **prose consistent with table**. The working paper's §6 has no numbered subsections.

**MPRA 117230 / Renegotiations_v5c.pdf (March 2023, posted 10 May 2023), full PDF obtained.** The title page declares *Journal of Law, Economics, & Organization* 39(1): 281–308 and the title matches the Crossref record for DOI 10.1093/jleo/ewab039; the file post-dates print publication (22 February 2023) and OpenAlex identifies it as the only open-access location for the DOI. Table 4 (printed p. 31) shows **0.014\* (0.007) / 0.011\*\* (0.005) / 0.012\* (0.007)** — exactly the values flagged in the earlier audit. §6.2 (printed pp. 21–22) retains the **unchanged** "7.7–10.5 percent" prose. Arithmetic: 7×0.014 = 0.098 < 0.105 — the prose is **internally inconsistent with its own Table 4**, with high probability an editing leftover from the working paper after re-estimation. Reaching 0.105 would require 0.015, which does not appear in this version.

**No erratum.** Crossref (`relation`/`update-to`/`updated-by`/`assertion` empty), Crossmark ("CrossMark data for this content is not currently available"), the JLEO corrigendum index (only unrelated corrigenda, ewab009, ewy020), and the author's site (moszoro.net links only the NBER working paper; no published-version PDF, no errata) show no correction notice. This is still not a complete version-history certification.

**Access boundary, carried forward:** the OUP version of record (`/jleo/article/39/1/281/6462048`, and the VOR PDF link from Crossref) returned HTTP 403 (Cloudflare) or timed out from this environment; SSRN delivery timed out. The published article itself was therefore not read directly. Identifying MPRA v5c with the published text rests on (a) its own JLEO citation declaration, (b) its post-print date, (c) title match with Crossref, (d) OpenAlex's OA location record. A marginal possibility that the VOR differs from v5c remains.

**Calibration consequence (applied):** for the published version the defensible effect is **0.077–0.098 amendments per contract-year (7.7–9.8 p.p.)**, from coefficients 0.014/0.011/0.012. The legacy frozen high value 0.105 is supported only by the working paper (0.015) and is now documented as such; it must not be attributed to the published article.

## 2. January 2026 Annual ProcureCon CPO Report: denominators RESOLVED, N still unknown

**Denominators confirmed.** The primary research publisher (ProcureCon Insights / WBR) states in its own release (PRNewswire, 3–4 March 2026): *"Among those not fully ready for AI, 67% cite data privacy, security, and compliance, and 54% cite insufficient data quality and integration as major barriers."* The base of **67%/54%/51%** is therefore the **"not fully ready" subgroup (89% of the sample), not the full sample**. Independent corroboration: the report's own "Key Insights" extract (via a public index excerpt) and Tendergate.ai's documented full read (27 June 2026). The ProcureAbility release (21 January 2026) is ambiguous on this point; the primary publisher's wording resolves it.

**89% decomposition:** 65% "mostly ready" / piloting + 24% variously labelled "evaluating AI opportunities" (Icertis, 19 February 2026) or "still building capability" (Tendergate.ai, quoting the report); 11% "fully ready". "1 in 10" is PR rounding of 11%. The exact third-category label awaits the gated full PDF.

**Sample composition:** procurement 36% / supply chain 42% / risk management 22%; 51% C-level (Tendergate.ai, quoting the report; consistent with the report's "About the Respondents" section visible in a public extract).

**Still not found:** N, fieldwork dates, sampling frame, response rate, weighting. Every prior edition of this series (2022, 2023, 2025) publicly states N=100; all published 2026 distributions are whole percentages (25/64/11/0; 43/39/18; 11/48/37; 36/42/22; 65/24/11), consistent with N=100 at 1-p.p. rounding — **inference, not evidence**. The series has never published fieldwork dates, response rates or weighting. The full 2026 PDF remains behind registration forms (ProcureAbility, GEP, Icertis, ProcureCon East/West) and paid aggregators — not obtained. web.archive.org was entirely unreachable from this environment (tool/network error, not an archive.org restriction); a re-check from another network is recommended.

**Report-identity cautions from the previous round remain in force**, extended by one more distinct publication: the **European** *ProcureCon CPO Report 2026* (ProcureCon Insights, fieldwork Q3 2026, N=100 European senior CPOs, procureconeu.wbresearch.com) is a separate study.

**Usage rule (unchanged in substance):** percentages may be cited with their now-confirmed bases (full sample vs. not-fully-ready subgroup); no respondent counts may be computed while N is unpublished.

## 3. Zero100: Rise of the AI-Enabled CPO: still unverified, strong pointer

**The preview contains no methodology.** The full 30 January 2026 preview (both URL variants, byline Geraint John) was re-read verbatim: no N, fieldwork dates, recruitment, geography, weighting, response rate, item non-response, or complete question wording. The member hub remains behind login — not entered.

**Strong pointer (medium-high confidence, not official):** an authorized Zero100 article (Geraint John, *"Taming AI in Sourcing: Takeaways from the Zero100 CPO Summit"*, 4 February 2026, zero100.com) refers to *"100 CPOs and sourcing executives we surveyed just before Christmas"* — a description matching the report preview word-for-word, with consistent adjacent statistics (67% top-5 skills ↔ 51% #1/#2; 2028 horizon). Caveat: some figures in that article appear to describe CPO Summit participants (NYC, late January 2026) rather than the survey (e.g., "All agreed" vs. the preview's "85% agree").

**Documented traps:** the 90% AI-agent statistic explicitly belongs to a separate 2025 survey; two distinct "78%" statistics circulate in adjacent publications; the "4% Translators" figure has a different base ("sourcing roles", not the survey).

**Usage rule (unchanged):** 85%/78% remain attributed respondent statements; if N is needed for aggregation, treat it as withheld. "N≈100, fieldwork ~December 2025" may be mentioned only as a pointer with its source.

## 4. Original books: page locators CONFIRMED, full texts still lawfully inaccessible

| Work | This round | Remaining limit |
|---|---|---|
| Lipsky (1980), *Street-Level Bureaucracy* | Russell Sage Foundation publishes free, no-login PDFs of the 2010 edition's **table of contents and preface** (`russellsage.org/sites/default/files/Lipsky_TOC_0.pdf`, `Lipsky_Preface.pdf`). Publisher TOC: chapter 3 "The Problem of Resources", p. 29; chapter 4 "Goals and Performance Measures", p. 40; chapter 5, p. 54. Independent scholarly citations of the **1980 edition** (Cambridge *Legal Studies* p. 29; *Michigan Law Review* pp. 40, 49; verbatim quotes from pp. 40 and 50 in two theses) converge with the 2010 TOC — pagination of chapters 1–13 is identical across editions. JSTOR records `.8`/`.9` confirm "CHAPTER 3 … (pp. 29-39)" / "CHAPTER 4 … (pp. 40-53)" (read indirectly via index; JSTOR page itself returns an anti-bot challenge — access restriction). | Chapter locators and short verified quotes only. Full chapters/book not obtained; no claim of complete original-text review. |
| Vaughan (1996), *The Challenger Launch Decision* | The chapter starting at p. 73 is **Chapter Three, "Risk, Work Group Culture, and the Normalization of Deviance"** (pp. 73–114; chapter 4 from p. 115) — confirmed via the Google Books 1996 record's table-of-contents snippet and the University of Chicago Press TOC; reviews confirm xv+575 pp. UCP provides **no excerpt** (link disabled, files 404). | No original substantive passage verified directly; only secondary quotations (pp. 55–56, 78–110, 390, 409 in scholarly literature). |

**Access boundary:** Google domains (including the Books API), Open Library, archive.org and HathiTrust were network-unreachable from this environment (tool errors, not restrictions) — Google Books `accessInfo`/viewability could not be checked and a re-check from another network is recommended. Indirect evidence (the 2010 Lipsky ebook is paid on Google Play via the publisher's link) suggests no free full preview exists. Unverified third-party uploads (Scribd/SlideShare/academia.edu, including a full 2010 e-book) were again rejected.

**Usage rule (unchanged):** both books remain conceptual context with now-confirmed original-edition page locators; they do not support numerical model calibration.

## 5. Applied corrections (this round changes the model and texts)

Branch `audit/2026-09-22-source-closure`:

1. **Model v2 — `contract_amendment` differential enabled** from the published-version coefficients: effect **0.077–0.098 per contract-year** (central 0.084), replacing the hard-zero convention (`zeroDifferential`, `assertZeroAllocation`). New evidence record documents the full trail: NBER 0.015/0.011/0.013 vs. post-print 0.014/0.011/0.012, the internally inconsistent published prose, absence of errata, and the residual uncertainty that the OUP VOR was not read directly. Legacy model 2.2.2 remains frozen and sealed; its 0.105 is now documented as working-paper-only.
2. **Tests** updated to enforce the 0.077–0.098 range and the source arithmetic (7 × 0.014/0.011/0.012); legacy seals unchanged.
3. **MODEL_PARAMETERS.md / CHANGELOG.md** updated with the source resolution and the signed allocation convention.
4. **Polish article** `docs/articles/pl/2026-09-bariery-autonomicznego-sourcingu.md`: ProcureCon figures re-based to the confirmed denominators (subgroup vs. full sample; N unpublished); Zero100 figures kept as attributed respondent statements with the N≈100/XII 2025 pointer flagged as such.

**What remains withheld:** N for the 2026 ProcureCon report; all Zero100 methodology; full original texts of Lipsky (1980) and Vaughan (1996); direct reading of the OUP VOR for ewab039. The existing evidence boundaries otherwise remain in force.
