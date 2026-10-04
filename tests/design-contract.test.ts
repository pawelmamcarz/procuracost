import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));

// Legacy model 2.2.2 surfaces are quarantined provenance (unreachable from
// routes, see tests/model-v2-runtime-reachability.test.ts) and keep their
// original styling, but the recharts radar family is banned repo-wide.
const LEGACY_QUARANTINE_FILES = [
  "components/CostCalculator.tsx",
  "components/PathOptimizer.tsx",
  "components/DecisionMap.tsx",
] as const;
const LEGACY_QUARANTINE_PREFIXES = ["components/cost-comparison/"] as const;

function isLegacyQuarantined(path: string) {
  return (
    (LEGACY_QUARANTINE_FILES as readonly string[]).includes(path)
    || LEGACY_QUARANTINE_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

function collectSources(directories: readonly string[], extension: string) {
  const paths: string[] = [];

  function visit(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        paths.push(relative(root, absolutePath).split("\\").join("/"));
      }
    }
  }

  for (const directory of directories) {
    visit(join(root, directory));
  }
  return paths.sort();
}

const RADAR_FAMILY = /\b(?:RadarChart|PolarGrid|PolarAngleAxis|PolarRadiusAxis)\b/;

const CLASS_NAME_SPAN =
  /className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{"([^"]*)"\}|\{'([^']*)'\})/g;
const HEX_COLOUR = /#[0-9a-fA-F]{3,8}\b/;

function classNameHexViolations(path: string) {
  const source = readFileSync(join(root, path), "utf8");
  const violations: string[] = [];

  for (const match of source.matchAll(CLASS_NAME_SPAN)) {
    const span = match.slice(1).find((group) => group !== undefined) ?? "";
    if (!HEX_COLOUR.test(span)) continue;
    const line = source.slice(0, match.index).split("\n").length;
    violations.push(`${path}:${line}:${span.trim()}`);
  }
  return violations;
}

// Non-alternative surfaces: validation, readiness, suitability, team,
// navigation and footer must stay neutral. Red and green identify the two
// compared alternatives only (the result-bar pins are covered by
// tests/calculation-result-bar.test.ts).
const NON_ALTERNATIVE_SURFACES = [
  "components/SuitabilityComparison.tsx",
  "components/ReadinessDiagnostic.tsx",
  "components/calculator-v2/CalculatorValidationSummary.tsx",
  "components/calculator-v2/ProcessMapValidationSummary.tsx",
  "components/TeamPage.tsx",
  "components/SiteFooter.tsx",
  "components/AppShell.tsx",
] as const;

const ALTERNATIVE_COLOUR_CLASS = /(?:text|bg|border)-(?:red|green)-\d/;

describe("design contract", () => {
  it("keeps the recharts radar family out of reachable sources", () => {
    const sources = collectSources(["app", "components", "lib"], ".tsx")
      .concat(collectSources(["app", "components", "lib"], ".ts"))
      .filter((path) => !isLegacyQuarantined(path));

    for (const path of sources) {
      const source = readFileSync(join(root, path), "utf8");
      expect(source, path).not.toMatch(RADAR_FAMILY);
    }
  });

  it("keeps the radar family out of every source file", () => {
    const sources = collectSources(["app", "components", "lib"], ".tsx")
      .concat(collectSources(["app", "components", "lib"], ".ts"));

    for (const path of sources) {
      const source = readFileSync(join(root, path), "utf8");
      expect(source, path).not.toMatch(RADAR_FAMILY);
    }
  });

  it("keeps hex colour literals out of className strings", () => {
    const tsxSources = collectSources(["app", "components"], ".tsx").filter(
      (path) => !isLegacyQuarantined(path)
    );
    const violations = tsxSources.flatMap(classNameHexViolations);

    expect(violations).toEqual([]);
  });

  it("reserves red and green for the two compared alternatives", () => {
    for (const path of NON_ALTERNATIVE_SURFACES) {
      const source = readFileSync(join(root, path), "utf8");
      expect(source, path).not.toMatch(ALTERNATIVE_COLOUR_CLASS);
    }
  });
});
