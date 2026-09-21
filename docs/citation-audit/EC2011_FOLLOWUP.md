# EC2011 and EC2021 source-gap follow-up

Verified: **21 September 2026**. Scope: the two access gaps in
[OFFICIAL_VENDOR_REVIEW.md](OFFICIAL_VENDOR_REVIEW.md). Historical model 2.2.2
comparison only; no active calibration, model changes or commits.

## Primary sources and reproducible access

All three complete English PDFs were obtained anonymously from the EU
Publications Office using ordinary HTTPS GET (`curl -L`), without accounts.
Text was extracted with `pdftotext -layout`; EC2011 pages 78 and 84 were also
rendered and visually checked. Page numbers below are printed pages and match
the one-based PDF pages in these downloads.

| Document | Stable catalogue record | Working full PDF | Extent |
|---|---|---|---|
| EC2011, *Public procurement in Europe: Cost and effectiveness*, prepared for the European Commission by PwC, London Economics and Ecorys | [Report](https://op.europa.eu/en/publication-detail/-/publication/0cfa3445-7724-4af5-8c2b-d657cd690c03) | [Official download](https://op.europa.eu/o/opportal-service/download-handler?identifier=0cfa3445-7724-4af5-8c2b-d657cd690c03&format=pdf&language=en&productionSystem=cellar&part=) | 128 pages; cover: March 2011 |
| EC2011, *Annex: Detailed methodology and data* | [Annex](https://op.europa.eu/en/publication-detail/-/publication/eb5f2d5a-a034-4123-83af-2ea7eb363825) | [Official download](https://op.europa.eu/o/opportal-service/download-handler?identifier=eb5f2d5a-a034-4123-83af-2ea7eb363825&format=pdf&language=en&productionSystem=cellar&part=) | 121 pages; cover: March 2011 |
| EC2021, *Commission Notice: Guidance on Innovation Procurement*, 2021/C 267/01 | [Notice](https://op.europa.eu/en/publication-detail/-/publication/9f9537e9-de23-11eb-895a-01aa75ed71a1) | [Official download](https://op.europa.eu/o/opportal-service/download-handler?identifier=9f9537e9-de23-11eb-895a-01aa75ed71a1&format=pdf&language=en&productionSystem=cellar&part=) | 72 pages, including annexes; OJ C 267, 6 July 2021, pp. 1–72; CELEX 52021XC0706(03) |

The [Commission studies catalogue](https://single-market-economy.ec.europa.eu/single-market/public-procurement/studies-and-expert-groups_en)
links the report and annex separately under 2011. The annex catalogue's
27 March 2013 release date is not the report's cover date.
The [EC2021 resource page](https://public-buyers-community.ec.europa.eu/resources/guidance-innovation-procurement)
dates its entry 21 June 2021, distinct from OJ publication.

Access failures reproduced: the old EC2011
`ec.europa.eu/internal_market/publicprocurement/docs/modernising_rules/cost-effectiveness_en.pdf`
and EC2021 DocsRoom `/documents/45975` returned 404 through the web tool;
EUR-Lex presented a JavaScript/robot check. The public Publications Office
download endpoint resolved the full-text gaps without bypassing those checks.

## EC2011: exact evidence and historical comparison

- **Report §2.2, Figure 2.1, p. 78:** the authority column in the row labelled
  “Average” is **22 person-days**. The figure caption explicitly specifies
  medians; that row label must not be read as an arithmetic mean. The same
  row gives firms 16 and total effort 108, which are different quantities.
  The open-procedure authority median is 21; restricted is 28.
- **Report p. 84, final paragraph:** explicitly gives government effort
  **mean 36, median 22 and standard deviation 36 person-days**, describing a
  right-skewed distribution. This is prose, not a numbered statistics table.
  Figure 2.10 on that page is the cost-model diagram. Page 85 continues the
  methodology. Thus the historical locator “84–85” is broadly correct;
  **p. 84, final paragraph** is the exact locator for the pair.
- **Report pp. 76–77:** effort means full-time-equivalent person-days, not
  elapsed procurement duration. The surveyed activities cover preparation,
  award, post-award and complaints/litigation. **Pp. 84–85** explain that
  monetisation uses the midpoint of median and mean, with those statistics
  as low/high endpoints; this is not a confidence interval or the observed
  minimum/maximum.
- **Annex §1.2.2, pp. 10–11:** documents the survey and respondent approach.
  **§3.6, Table 3.9, pp. 90–95** contains cost regressions for authorities
  and firms. It is not the descriptive table for the 22/36 pair. No annex
  table number is substituted for the directly verified report paragraph.

Repository provenance: `rg` located
[CALIBRATION_BENCHMARKS.md §1](../research/CALIBRATION_BENCHMARKS.md), dated
26 July 2026 for model 2.2.2; `git show fd717ad:docs/research/CALIBRATION_BENCHMARKS.md`
confirms the original claim. It records `pzp_eu`, `partial_erp` effort of
**23.8 person-days**, with **16.8–33.0** across technology assumptions.

**Narrow finding:** the documented central value satisfies
`22 < 23.8 < 36` (about 1.08 times the median). The whole documented technology
range does **not** lie between 22 and 36, since 16.8 is below 22. These are
comparisons with recorded historical model outputs, not a fresh execution of
the old model. They support an order-of-magnitude comparison only. They do not
establish a percentile, organisational accuracy, Polish representativeness,
matched activity coverage, or the historical assertion that this was the
best-calibrated model layer. None validates native model 2.3.

## EC2021: qualitative use verified in full text

- **Disclaimer, p. 1:** practical, non-binding guidance; it does not change
  legislative rights and obligations.
- **§4.1.2, pp. 35–37:** preliminary market consultation supports learning
  about available solutions, prices and capabilities before specification.
  Page 35 explicitly preserves competition, equal treatment,
  non-discrimination and transparency, including information availability
  for other bidders. This supports qualitative market-learning discussion.
- **§4.1.8, pp. 46–47:** performance indicators, fair exit provisions and
  contract modification clauses support discussion of contract adaptability.
  Footnote 49 on p. 46 refers to Article 72(1)(a) of Directive 2014/24/EU
  and Article 89(1)(a) of Directive 2014/25/EU. Page 47 discusses
  value-engineering clauses. This is bounded contractual design, not
  unrestricted renegotiation.

The qualitative use described in `RESEARCH.md` §3.5 is supported. The guidance
does not establish ProcuraCost monetary inputs or a causal advantage for one
workflow. This check concerns the 2021 document, not subsequent legal changes.

## Remaining limits and hand-off

Both full-text access gaps are closed. The EC2011 22/36 source pair and exact
locator are verified; broader historical calibration claims remain qualified.
The old model's 23.8 and 16.8–33.0 calculations were not independently rerun.
The audit's separate national-procedure, private-procurement and cost-share
comparisons are not closed by this finding. No other file was edited in this
follow-up; prior review wording remains for its owner to reconcile.

Downloaded PDF SHA-256, in table order:

```text
97a15b3f660f123d480e2d7040bedc218656b2421b78569447e734ebdc06b917
1c2052f11bc4867ae3c5d9379da02cd590fe8233761da8cd9866e39871a0dcb2
402047ce7b0062e151429c48202a5035d0fb7247c5bfb7a3b3800b99b7fd1cf6
```
