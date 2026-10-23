import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const source = "docs/articles/pl/2026-12-kupiec-po-automatyzacji.md";
const outputDirectory = resolve(process.cwd(), "lib/articles");
const outputFile = resolve(outputDirectory, "kupiec-po-automatyzacji.generated.ts");
const markdown = readFileSync(resolve(process.cwd(), source), "utf8");
const contents = `// Generated from ${source}. Do not edit; run npm run articles.\n\nexport const kupiecPoAutomatyzacjiMarkdown = ${JSON.stringify(markdown)};\n`;

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputFile, contents, "utf8");
process.stdout.write(`Wrote article content to ${outputFile}\n`);
