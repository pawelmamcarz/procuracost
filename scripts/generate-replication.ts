import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildReplicationArtifacts } from "../lib/model-v2/replication";

const configuredOutputDirectory =
  process.env.PROCURACOST_REPLICATION_OUTPUT_DIR;
const outputDirectory = configuredOutputDirectory
  ? resolve(configuredOutputDirectory)
  : resolve(process.cwd(), "replication/outputs");
const artifacts = buildReplicationArtifacts();

mkdirSync(outputDirectory, { recursive: true });

for (const [filename, contents] of Object.entries(artifacts)) {
  writeFileSync(resolve(outputDirectory, filename), contents, "utf8");
}

process.stdout.write(
  `Wrote ${Object.keys(artifacts).length} deterministic replication artifacts to ${outputDirectory}\n`
);
