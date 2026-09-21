import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Editorial triage, not source verification or an automatic acceptance gate.
const questions = {
  internalConflict: { type: 'noul', instructions: 'Does section contradict itself, confuse a proposed hypothesis with an established finding, or mix incompatible definitions? Historical descriptions and future research proposals are not current model claims.' },
  overclaim: { type: 'noul', instructions: 'Does section present an unqualified universal, causal certainty, frequency ranking or numerical empirical claim beyond its stated evidence? Do not flag explicitly labelled hypotheses, assumptions, examples, proposals, or normative advice solely because they are unproven.' },
  externalCheck: { type: 'noul', instructions: 'Does section contain a factual external research result, market statistic, product capability, legal rule or attributed practitioner statement requiring original-source verification? This is a coverage flag, not an error verdict.' },
};
const digest = (value) => createHash('sha256').update(value).digest('hex');
const output = process.argv[2];
if (!output || !process.env.TYPESAFE_API_KEY) throw new Error('Supply report directory and TYPESAFE_API_KEY.');
const files = ['RESEARCH.md'];
for (const dir of ['docs/articles/pl', 'docs/articles/doktorat']) {
  for (const name of (await readdir(dir)).sort()) if (name.endsWith('.md') && !name.startsWith('00-')) files.push(`${dir}/${name}`);
}
const tasks = [];
const excluded = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  const lines = text.split('\n');
  let start = 0;
  for (let end = 1; end <= lines.length; end++) {
    if (end !== lines.length && !/^## /.test(lines[end])) continue;
    const section = lines.slice(start, end).join('\n');
    if (section.trim()) tasks.push({ file, line: start + 1, section, fileHash: digest(text) });
    start = end;
  }
}
const publicCopy = await readFile('lib/i18n.ts', 'utf8');
const publicStart = publicCopy.indexOf('const researchPaperEn =');
const publicEnd = publicCopy.indexOf('export const researchPaperT', publicStart);
if (publicStart < 0 || publicEnd < 0) throw new Error('Public paper copy not found.');
const section = publicCopy.slice(publicStart, publicEnd);
tasks.push({ file: 'lib/i18n.ts#researchPaperEn', line: publicCopy.slice(0, publicStart).split('\n').length,
  section, fileHash: digest(section) });
files.push('lib/i18n.ts#researchPaperEn');
await mkdir(output, { recursive: true });
await writeFile(`${output}/manifest.json`, JSON.stringify({ files, excluded, sections: tasks.length, questions, model: 'jev-1.13.0' }, null, 2));
let cursor = 0;
let errors = 0;
async function worker() {
  while (cursor < tasks.length) {
    const index = cursor++;
    const task = tasks[index];
    const request = { model: 'jev-1.13.0', state: { section: task.section }, questions };
    const requestHash = digest(JSON.stringify(request));
    const target = `${output}/${String(index).padStart(3, '0')}.json`;
    try {
      const cached = JSON.parse(await readFile(target, 'utf8'));
      if (cached.requestHash === requestHash && !cached.error) {
        await writeFile(target, JSON.stringify({ ...cached, ...task }, null, 2));
        continue;
      }
    } catch {}
    let record;
    try {
      const response = await fetch('https://api.typesafe.ai/v1/systemone', {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(60000),
        headers: { Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      if (typeof body.model !== 'string' || !Object.keys(questions).every((key) => body.answers?.[key]?.type === 'noul' && Number.isFinite(body.answers[key].noul) && body.answers[key].noul >= 0 && body.answers[key].noul <= 1)) throw new Error('Invalid response');
      record = { ...task, requestHash, ...body, reviewRequired: true };
    } catch {
      errors++;
      record = { ...task, requestHash, error: 'service_error' };
    }
    await writeFile(target, JSON.stringify(record, null, 2));
    console.log(`${index + 1}/${tasks.length} ${task.file}:${task.line} ${record.error || JSON.stringify(record.answers)}`);
  }
}
await Promise.all([worker(), worker(), worker()]);
if (errors) process.exitCode = 1;
