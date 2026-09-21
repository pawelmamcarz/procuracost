import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audit } from '../scripts/audit-citations.mjs';

const pair = { id: 'a', claim: 'Claim', source: 'Source passage', sourceRef: 'fixture' };
test('local mode does not call API or invent semantic results', async () => {
  const report = await audit([pair], { fetcher: () => assert.fail('network') });
  assert.equal(report.results[0].verdict, 'not_evaluated');
});
test('missing quote short circuits and remains reviewable', async () => {
  const report = await audit([{ ...pair, quote: 'absent' }], { live: true, apiKey: 'test', fetcher: () => assert.fail('network') });
  assert.equal(report.results[0].verdict, 'quote_missing');
  assert.equal(report.results[0].reviewRequired, true);
});
test('live request excludes expected labels and records validated response', async () => {
  const report = await audit([{ ...pair, expected: 'supports' }], { live: true, apiKey: 'test', fetcher: async (url, init) => {
    assert.equal(url, 'https://api.typesafe.ai/v1/systemone');
    assert.deepEqual(JSON.parse(init.body).state, { claim: pair.claim, source: pair.source });
    return Response.json({ model: 'test-model', answers: { relation: { type: 'choice', choice: 'supports', confidence: 0.9, probabilities: { supports: 0.9, contradicts: 0.05, unsupported: 0.05 } } } });
  } });
  assert.equal(report.summary.matched, 1);
  assert.equal(report.results[0].model, 'test-model');
});
test('malformed responses and HTTP failures fail closed', async () => {
  for (const response of [Response.json({}), new Response('', { status: 429 })]) {
    const report = await audit([pair], { live: true, apiKey: 'test', fetcher: async () => response });
    assert.equal(report.results[0].verdict, 'service_error');
    assert.equal(report.summary.evaluated, 0);
  }
});
test('missing credentials and duplicate identifiers reject before network', async () => {
  await assert.rejects(audit([pair], { live: true }), /API_KEY/);
  await assert.rejects(audit([pair, pair]), /Duplicate/);
});
