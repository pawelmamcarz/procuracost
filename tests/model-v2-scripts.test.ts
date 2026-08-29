import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { SCENARIO_V2_IDS } from "@/lib/model-v2/scenarios";

const ROOT = process.cwd();
const temporaryDirectories: string[] = [];

function runScript(
  relativePath: string,
  environment: Record<string, string> = {}
): string {
  return execFileSync(
    process.execPath,
    ["--import", "tsx", join(ROOT, relativePath)],
    {
      cwd: ROOT,
      encoding: "utf8",
      env: { ...process.env, ...environment },
    }
  );
}

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    rmSync(temporaryDirectories.pop()!, { recursive: true, force: true });
  }
});

describe("model 2.3 command-line diagnostics and replication", () => {
  it("recomputes all canonical records through the native decision-record path", () => {
    const first = runScript("scripts/recompute.ts");
    const second = runScript("scripts/recompute.ts");

    expect(second).toBe(first);
    expect(first).toContain("Model 2.3.0 diagnostics");
    let previous = -1;
    for (const scenarioId of SCENARIO_V2_IDS) {
      const current = first.indexOf(scenarioId);
      expect(current).toBeGreaterThan(previous);
      previous = current;
    }
    expect(first).not.toMatch(/winner|recommended|robustly favours/i);
  });

  it("runs the native swap-symmetry invariant without sign quotas", () => {
    const output = runScript("scripts/symmetry-sweep.ts");

    expect(output).toContain("Model 2.3.0 swap-symmetry sweep");
    expect(output).toContain("Examined inputs: 10");
    expect(output).toContain("Invariant failures: 0");
    expect(output).not.toMatch(/favours|winner|positive|negative|confidence/i);
  });

  it("writes only the three deterministic model 2.3 replication artifacts", () => {
    const outputDirectory = mkdtempSync(join(tmpdir(), "procuracost-replication-"));
    temporaryDirectories.push(outputDirectory);

    const stdout = runScript("scripts/generate-replication.ts", {
      PROCURACOST_REPLICATION_OUTPUT_DIR: outputDirectory,
    });

    expect(readdirSync(outputDirectory).sort()).toEqual([
      "built-in-scenarios.csv",
      "built-in-scenarios.json",
      "built-in-scenarios.md",
    ]);
    expect(stdout).toContain("Wrote 3 deterministic replication artifacts");
    expect(
      JSON.parse(readFileSync(join(outputDirectory, "built-in-scenarios.json"), "utf8"))
        .metadata.modelVersion
    ).toBe("2.3.0");
  });
});
