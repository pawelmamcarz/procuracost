import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditStyle, questions, questionIds } from '../scripts/audit-style.mjs';

const section = {
  id: 'a',
  text: 'Concrete procurement note about locked legal waits.',
  location: 'fixtures/a',
};

test('local mode does not call API or invent model scores', async () => {
  const report = await auditStyle([section], { fetcher: () => assert.fail('network') });
  assert.equal(report.mode, 'local-only');
  assert.equal(report.results[0].verdict, 'not_evaluated');
  assert.equal(report.results[0].answers, undefined);
  assert.equal(report.results[0].flags, undefined);
  assert.equal(report.summary.evaluated, 0);
  assert.ok(report.questionHash);
  assert.deepEqual(Object.keys(report.questions), questionIds);
});

test('accepts path as the location field and keeps the section reviewable', async () => {
  const report = await auditStyle([{ id: 'b', text: 'Plain note.', path: 'lib/i18n.ts#home' }]);
  assert.equal(report.results[0].location, 'lib/i18n.ts#home');
  assert.equal(report.results[0].path, 'lib/i18n.ts#home');
  assert.equal(report.results[0].reviewRequired, true);
  assert.equal(report.results[0].sourceHash.length, 64);
});

test('live request sends section state and records validated noul answers', async () => {
  const report = await auditStyle([{ ...section, expected: { stockRhetoric: false, aiStockVoice: false } }], {
    live: true,
    apiKey: 'test',
    fetcher: async (url, init) => {
      assert.equal(url, 'https://api.typesafe.ai/v1/systemone');
      const body = JSON.parse(init.body);
      assert.deepEqual(body.state, { section: section.text });
      assert.deepEqual(Object.keys(body.questions), questionIds);
      assert.equal(body.questions.stockRhetoric.type, 'noul');
      return Response.json({
        model: 'test-model',
        usage: { input_tokens: 10, output_tokens: 4 },
        answers: Object.fromEntries(questionIds.map((id) => [id, { type: 'noul', noul: 0.1, confidence: 0.8 }])),
      });
    },
  });
  assert.equal(report.summary.evaluated, 1);
  assert.equal(report.summary.matched, 1);
  assert.equal(report.results[0].verdict, 'evaluated');
  assert.equal(report.results[0].model, 'test-model');
  assert.equal(report.results[0].answers.stockRhetoric.noul, 0.1);
  assert.equal(report.results[0].answers.stockRhetoric.confidence, 0.8);
  assert.deepEqual(report.results[0].answers.stockRhetoric.probabilities, { yes: 0.1, no: 0.9 });
  assert.equal(report.results[0].flags.stockRhetoric, false);
});

test('malformed responses and HTTP failures fail closed', async () => {
  for (const response of [Response.json({}), new Response('', { status: 429 })]) {
    const report = await auditStyle([section], { live: true, apiKey: 'test', fetcher: async () => response });
    assert.equal(report.results[0].verdict, 'service_error');
    assert.equal(report.summary.evaluated, 0);
    assert.equal(report.results[0].answers, undefined);
  }
});

test('missing credentials, duplicate identifiers and invalid expected flags reject before network', async () => {
  await assert.rejects(auditStyle([section], { live: true }), /API_KEY/);
  await assert.rejects(auditStyle([section, section]), /Duplicate/);
  await assert.rejects(auditStyle([{ ...section, expected: { unknown: true } }]), /expected/);
  await assert.rejects(auditStyle([{ id: 'x', text: 'ok' }]), /location/);
});

test('question definitions stay reviewable and hashed', async () => {
  assert.equal(questions.aiStockVoice.type, 'noul');
  assert.match(questions.aiStockVoice.instructions, /not an authorship detector/);
  assert.equal(questionIds.length, 4);
});
