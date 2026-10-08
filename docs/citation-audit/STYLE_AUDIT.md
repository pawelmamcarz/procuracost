# Style audit

Standalone editorial tool, outside the application and cost model. It scores
selected prose sections against four Noul questions. Every result needs
editorial review. A high or low score is not a publication decision, a
readability grade, or an AI-authorship finding.

Jev evaluates only. It does not generate rewritten prose. Humans revise from
the signals, as in [`STYLE_REVIEW.md`](STYLE_REVIEW.md).

Input: a JSON array of `id`, `text`, and `location` or `path`. Optional
`expected` flags name the questions that a synthetic fixture should raise or
clear. References are provenance labels. Live mode sends the section text to
TypeSafe. Use public or explicitly approved text.

```sh
node scripts/audit-style.mjs docs/citation-audit/examples-style.json
# Set TYPESAFE_API_KEY in your shell, then:
node scripts/audit-style.mjs docs/citation-audit/examples-style.json --live
node --test tests/style-audit.node.mjs
```

JSON reports go to stdout. Local mode checks the schema only and marks every
section `not_evaluated`. It never simulates model scores. Live mode makes at
most one request per section, with a 30-second timeout and no automatic
retries. Service failures are recorded separately and produce exit code 1. The
key and service error bodies are never printed.

`TYPESAFE_MODEL` optionally selects a model; default `jev-latest` follows the
API documentation. Reports retain the question definitions, their hash, the
section hash, returned model, noul values, derived yes/no probabilities, usage,
and confidence when the API returns it. Pin a model for repeatable
comparisons. Confidence is not a quality guarantee. No automatic acceptance
threshold is used for publication.

The `expected` flags exist for smoke fixtures. Live matching treats a noul of
0.5 or above as a raised flag. That cut is a fixture convenience, not an
editorial bar and not a detector of machine writing.

## Questions

Definitions live in `scripts/audit-style.mjs` and are hashed into every report.

- `stockRhetoric`: promotional filler, stock punchlines, or rhetorical
  not-X-but-Y contrasts that should become concrete prose. Necessary scientific
  distinctions, evidence limits, equations, source titles and labelled
  hypotheses are out of scope.
- `redundancy`: the same point restated, or several sentences that only
  announce a point. Concise abstracts, definitions, formula notes, limits and
  reference lists are out of scope.
- `overclaim`: an unqualified universal, causal certainty, frequency ranking
  or numerical empirical claim beyond the stated evidence. Labelled hypotheses,
  assumptions, examples, proposals and advice are out of scope.
- `aiStockVoice`: generic large-language-model cadence, empty fluency or
  interchangeable corporate voice. This is an editorial cue for revision. It is
  not an authorship detector and must not be reported as one.

API contract: https://docs.typesafe.ai/api
Noul: https://docs.typesafe.ai/primitives/noul

The six bilingual examples are synthetic, agent-labelled smoke fixtures, not
human-validated editorial data. To load a local key file, use
`node --env-file=.env.local` before the script path; the scripts do not load
dotenv files themselves.

A modest UI and remaining-research batch lives in
`style-ui-pass/sections.json`. Live evaluation completed on 22 September
2026 outside this VM (`jev-1.13.0`, 34/34, 0 errors). First pass: 13
flags ≥ 0.5 (`live-triage.json`). After the second rewrite: 5 flags
(`live-triage-pass2.json`); practice and OG cleared; `phd-roadmap-purpose`
stayed high at 0.80. Scores were not invented. `live-results.json` is
absent because the key was not available here. The first-pass
`questionHash` belongs to the pre-typo `overclaim` wording
(`Does section present`). The script now reads `Does this section
present`; later hashes will differ. The earlier publication language
pass is documented in [`STYLE_REVIEW.md`](STYLE_REVIEW.md). The UI and
remaining-research pass is documented in
[`STYLE_UI_AND_REMAINING.md`](STYLE_UI_AND_REMAINING.md).
