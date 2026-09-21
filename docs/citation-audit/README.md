# Citation audit

Standalone editorial tool, outside the application and cost model. It assesses
selected claim/source pairs, not entire articles automatically. Every verdict
requires editorial review. A supported claim is not proof that the source is true.

Input: a JSON array of `id`, `claim`, `source` (the relevant passage with enough
context), `sourceRef` (URL or document location), optional verbatim `quote`, and
optional `expected` (`supports`, `contradicts`, `unsupported`, `quote_missing`).
References are provenance labels; the script does not retrieve or authenticate them.
Use public or explicitly approved text: live mode sends claim and source to TypeSafe.

```sh
node scripts/audit-citations.mjs docs/citation-audit/examples.json
# Set TYPESAFE_API_KEY in your shell, then:
node scripts/audit-citations.mjs docs/citation-audit/examples.json --live
node --test tests/citation-audit.node.mjs
```

JSON reports go to stdout. Local mode checks quoted text only and marks semantic
judgments `not_evaluated`; it never simulates model results. Live mode makes at
most one request per pair, with a 30-second timeout and no automatic retries.
Service failures are recorded separately and produce exit code 1. They do not
count as unsupported claims. The key and service error bodies are never printed.

`TYPESAFE_MODEL` optionally selects a model; default `jev-latest` follows the API
documentation. Reports retain returned model, source hash, question hash,
probabilities and usage. Pin a model for repeatable comparisons. Confidence is
not a truth guarantee; no automatic acceptance threshold is used.

The six bilingual examples are synthetic, agent-labelled smoke fixtures, not
human-validated research data or an accuracy benchmark. Before measuring useful
accuracy, have an editor label representative real pairs independently, including
overclaims and contradictions. Review errors and report coverage as well as
agreement; missing quotes are deterministic checks, not model successes.

API contract: https://docs.typesafe.ai/api
Pattern: https://docs.typesafe.ai/cookbooks/citation_check

The complete active-publication editorial pass is documented in
[`PUBLICATIONS_REVIEW.md`](PUBLICATIONS_REVIEW.md). Its section triage is
separate from claim/source checking. To load a local key file, use
`node --env-file=.env.local` before the script path; the scripts do not load
dotenv files themselves.
