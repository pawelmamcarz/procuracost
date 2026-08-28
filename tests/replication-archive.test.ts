import { createHash } from "node:crypto";
import {
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const ARCHIVE_ROOT = join(ROOT, "replication/archive/model-2.2.2");

const HISTORICAL_HASHES = {
  "MODEL_PARAMETERS.md":
    "be6da275c98dbd58f1aa33fc6135a9bdf34490b375fefc64bf01803ff8b80960",
  "REPLICATION_README.md":
    "2d8cdba48816c11661558b709f68c4fce15e27d519969650cdbf9a9a10fdf346",
  "outputs/built-in-scenarios.csv":
    "0af8c81639e72cd864c8b863311a778dfb0310fbd7302de458392a5f0c7b01fa",
  "outputs/built-in-scenarios.json":
    "f2f12b7095cc2c6fcb7c31afc136fff308ecf685592a52c7c34771f4cc8fd780",
  "outputs/built-in-scenarios.md":
    "10d28ed64ead38fc842943adf5e49d5ee90435fd3dfd119292a7de781b975bb8",
  "outputs/decision-thresholds.md":
    "e93d3202e0d78a5c5a6b2969ed9818325b5608973e8c5a84f7241fb84d758290",
} as const;

const SOURCE_PATHS = {
  "MODEL_PARAMETERS.md": "docs/MODEL_PARAMETERS.md",
  "REPLICATION_README.md": "replication/README.md",
  "outputs/built-in-scenarios.csv":
    "replication/outputs/built-in-scenarios.csv",
  "outputs/built-in-scenarios.json":
    "replication/outputs/built-in-scenarios.json",
  "outputs/built-in-scenarios.md":
    "replication/outputs/built-in-scenarios.md",
  "outputs/decision-thresholds.md":
    "replication/outputs/decision-thresholds.md",
} as const;

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function absoluteArchiveFiles(directory = ARCHIVE_ROOT): string[] {
  return readdirSync(directory)
    .flatMap((name) => {
      const path = join(directory, name);
      return statSync(path).isDirectory() ? absoluteArchiveFiles(path) : [path];
    });
}

function archiveFiles(): string[] {
  return absoluteArchiveFiles()
    .map((path) => relative(ARCHIVE_ROOT, path))
    .sort();
}

function parseManifest(): Record<string, string> {
  return Object.fromEntries(
    readFileSync(join(ARCHIVE_ROOT, "MANIFEST.sha256"), "utf8")
      .trim()
      .split("\n")
      .map((line) => {
        const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
        if (!match) throw new Error(`Invalid SHA-256 manifest line: ${line}`);
        return [match[2], match[1]];
      })
  );
}

function declaredOutputRoots(source: string): string[] {
  return [...source.matchAll(/resolve\(process\.cwd\(\), "([^"]+)"\)/g)].map(
    ([, path]) => path
  );
}

describe("immutable model 2.2.2 replication archive", () => {
  it("contains exactly the reviewed historical files, provenance note and manifest", () => {
    expect(archiveFiles()).toEqual([
      "ARCHIVE.md",
      "MANIFEST.sha256",
      "MODEL_PARAMETERS.md",
      "REPLICATION_README.md",
      "outputs/built-in-scenarios.csv",
      "outputs/built-in-scenarios.json",
      "outputs/built-in-scenarios.md",
      "outputs/decision-thresholds.md",
    ]);
  });

  it("preserves every historical source byte for byte at the reviewed hashes", () => {
    for (const [archivePath, expectedHash] of Object.entries(
      HISTORICAL_HASHES
    )) {
      const archived = join(ARCHIVE_ROOT, archivePath);
      expect(sha256(archived)).toBe(expectedHash);
    }
  });

  it("binds the manifest to every copied historical file and no mutable note", () => {
    expect(parseManifest()).toEqual(HISTORICAL_HASHES);
    expect(parseManifest()).not.toHaveProperty("ARCHIVE.md");
    expect(parseManifest()).not.toHaveProperty("MANIFEST.sha256");
  });

  it("records model, source commit, original paths and the no-correction rule", () => {
    const note = readFileSync(join(ARCHIVE_ROOT, "ARCHIVE.md"), "utf8");

    expect(note).toContain("model 2.2.2");
    expect(note).toContain("22c584a0ec9c871a75195257821d5815cfbd52e3");
    for (const sourcePath of Object.values(SOURCE_PATHS)) {
      expect(note).toContain(sourcePath);
    }
    expect(note).toContain("intentionally not corrected in place");
  });

  it("keeps both active generator output roots outside the archive", () => {
    const replicationGenerator = readFileSync(
      join(ROOT, "scripts/generate-replication.ts"),
      "utf8"
    );
    const mapGenerator = readFileSync(
      join(ROOT, "scripts/decision-map.ts"),
      "utf8"
    );

    expect(declaredOutputRoots(replicationGenerator)).toEqual([
      "replication/outputs",
    ]);
    expect(declaredOutputRoots(mapGenerator)).toEqual([
      "replication/outputs",
    ]);
    expect(`${replicationGenerator}\n${mapGenerator}`).not.toContain(
      "replication/archive"
    );
  });
});
