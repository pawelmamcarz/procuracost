import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

// Editorial signals only. Jev evaluates; it does not rewrite prose or detect authorship.
export const questions = {
  stockRhetoric: {
    type: 'noul',
    instructions:
      'Does this section contain generic promotional filler, a stock motivational punchline, or a rhetorical not-X-but-Y contrast that should be replaced with concrete prose? Do not flag necessary scientific distinctions, explicit evidence limits, equations, source titles, or labelled hypotheses.',
    criteria: {
      true: 'The section uses promotional slogans, stock contrasts or motivational filler that should be replaced with concrete prose.',
      false: 'The section is concrete, or any contrast is a necessary distinction, evidence limit, equation, source title or labelled hypothesis.',
    },
  },
  redundancy: {
    type: 'noul',
    instructions:
      'Does this section unnecessarily restate the same substantive point or use several sentences only to announce a point without adding information? Do not flag a concise abstract, necessary definition, formula explanation, evidence limitation, or reference list merely because it is formal.',
    criteria: {
      true: 'The section repeats a point already made, or uses several sentences only to announce a point.',
      false: 'Each sentence adds information, or the formality is a necessary abstract, definition, formula, limit or reference list.',
    },
  },
  overclaim: {
    type: 'noul',
    instructions:
      'Does this section present an unqualified universal, causal certainty, frequency ranking or numerical empirical claim beyond its stated evidence? Do not flag explicitly labelled hypotheses, assumptions, examples, proposals, or normative advice solely because they are unproven.',
    criteria: {
      true: 'The section states an unqualified universal, causal certainty, frequency ranking or numerical empirical claim beyond the evidence it cites.',
      false: 'Claims stay within stated evidence, or they are labelled hypotheses, assumptions, examples, proposals or advice.',
    },
  },
  aiStockVoice: {
    type: 'noul',
    instructions:
      'Does this section read like generic large-language-model prose: balanced parallel slogans, empty fluency, interchangeable corporate voice, or a tidy three-part cadence with little specific content? This is an editorial signal for revision, not an authorship detector. Do not flag necessary legal or model vocabulary, labelled hypotheses, equations, or a deliberately plain technical register.',
    criteria: {
      true: 'The section has generic LLM cadence, interchangeable corporate voice or empty parallel slogans.',
      false: 'The section has a specific voice, necessary technical vocabulary, or plain practitioner prose.',
    },
  },
};
export const questionIds = Object.keys(questions);
const hash = (text) => createHash('sha256').update(text).digest('hex');
const probability = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1;
const FIXTURE_FLAG_THRESHOLD = 0.5;

export function validateSections(sections) {
  if (!Array.isArray(sections) || !sections.length || sections.length > 100) {
    throw new Error('Expected 1–100 sections.');
  }
  const ids = new Set();
  for (const item of sections) {
    if (typeof item?.id !== 'string' || !item.id.trim()) throw new Error('Missing id.');
    if (typeof item?.text !== 'string' || !item.text.trim()) throw new Error('Missing text.');
    const location = item.location ?? item.path;
    if (typeof location !== 'string' || !location.trim()) throw new Error('Missing location.');
    if (ids.has(item.id)) throw new Error('Duplicate section id.');
    ids.add(item.id);
    if (item.text.length > 40000) throw new Error('Section exceeds 40000 characters.');
    if (item.expected !== undefined) {
      if (!item.expected || typeof item.expected !== 'object' || Array.isArray(item.expected)) {
        throw new Error('Invalid expected flags.');
      }
      const keys = Object.keys(item.expected);
      if (!keys.length || keys.some((key) => !questionIds.includes(key) || typeof item.expected[key] !== 'boolean')) {
        throw new Error('Invalid expected flags.');
      }
    }
  }
  return sections;
}

function locationOf(item) {
  return item.location ?? item.path;
}

function recordNoul(answer) {
  const recorded = { type: 'noul', noul: answer.noul, probabilities: { yes: answer.noul, no: 1 - answer.noul } };
  if (probability(answer.confidence)) recorded.confidence = answer.confidence;
  return recorded;
}

function flagsFromAnswers(answers) {
  return Object.fromEntries(questionIds.map((id) => [id, answers[id].noul >= FIXTURE_FLAG_THRESHOLD]));
}

function expectedMatch(expected, flags) {
  return Object.entries(expected).every(([id, value]) => flags[id] === value);
}

export async function auditStyle(sections, { live = false, apiKey, model = 'jev-latest', fetcher = fetch } = {}) {
  validateSections(sections);
  if (live && !apiKey) throw new Error('Live mode requires TYPESAFE_API_KEY.');
  const results = [];
  for (const item of sections) {
    const location = locationOf(item);
    const result = {
      id: item.id,
      text: item.text,
      location,
      path: location,
      sourceHash: hash(item.text),
      reviewRequired: true,
    };
    if (item.expected) result.expected = item.expected;
    if (!live) {
      results.push({ ...result, verdict: 'not_evaluated' });
      continue;
    }
    try {
      const response = await fetcher('https://api.typesafe.ai/v1/systemone', {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, state: { section: item.text }, questions }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      if (typeof body.model !== 'string' || !body.answers) throw new Error('Invalid API response');
      const answers = {};
      for (const id of questionIds) {
        const answer = body.answers[id];
        if (answer?.type !== 'noul' || !probability(answer.noul)) throw new Error('Invalid API response');
        if (answer.confidence !== undefined && !probability(answer.confidence)) throw new Error('Invalid API response');
        answers[id] = recordNoul(answer);
      }
      const flags = flagsFromAnswers(answers);
      results.push({
        ...result,
        verdict: 'evaluated',
        answers,
        flags,
        model: body.model,
        usage: body.usage,
      });
    } catch {
      results.push({ ...result, verdict: 'service_error' });
    }
  }
  const evaluated = results.filter((row) => row.verdict === 'evaluated' && row.expected);
  return {
    mode: live ? 'live' : 'local-only',
    requestedModel: model,
    questions,
    questionHash: hash(JSON.stringify(questions)),
    fixtureFlagThreshold: FIXTURE_FLAG_THRESHOLD,
    createdAt: new Date().toISOString(),
    summary: {
      total: results.length,
      evaluated: results.filter((row) => row.verdict === 'evaluated').length,
      matched: evaluated.filter((row) => expectedMatch(row.expected, row.flags)).length,
      errors: results.filter((row) => row.verdict === 'service_error').length,
    },
    results,
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1 || args.length > 2 || (args[1] && args[1] !== '--live')) {
    throw new Error('Usage: node scripts/audit-style.mjs INPUT.json [--live]');
  }
  const report = await auditStyle(JSON.parse(await readFile(args[0], 'utf8')), {
    live: args[1] === '--live', apiKey: process.env.TYPESAFE_API_KEY,
    model: process.env.TYPESAFE_MODEL || 'jev-latest',
  });
  console.log(JSON.stringify(report, null, 2));
  if (report.summary.errors) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {
    console.error('Style audit failed. Check input schema, arguments and TYPESAFE_API_KEY for live mode.');
    process.exitCode = 1;
  });
}
