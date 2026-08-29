import { describe, expect, it } from "vitest";

import {
  REPLICATION_CSV_HEADERS,
  buildCanonicalDecisionRecords,
  buildReplicationArtifacts,
  buildReplicationBundle,
  renderCsvRow,
  renderReplicationCsv,
  renderReplicationJson,
  renderReplicationMarkdown,
} from "@/lib/model-v2/replication";
import { SCENARIO_V2_IDS } from "@/lib/model-v2/scenarios";

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (quoted) {
      if (character === '"' && csv[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\r" && csv[index + 1] === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      index += 1;
    } else {
      cell += character;
    }
  }
  return rows;
}

function nestedKeys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => [
    key,
    ...nestedKeys(child),
  ]);
}

describe("native model 2.3 replication artifacts", () => {
  it("builds ten decision records in canonical order", () => {
    const records = buildCanonicalDecisionRecords();
    expect(records.map(({ metadata }) => metadata.scenarioId)).toEqual(
      SCENARIO_V2_IDS
    );
    expect(records).toHaveLength(10);
  });

  it("builds the exact timestamp-free package schema", () => {
    const bundle = buildReplicationBundle(buildCanonicalDecisionRecords());
    expect(Object.keys(bundle)).toEqual(["metadata", "scenarios"]);
    expect(bundle.metadata).toEqual({
      schemaVersion: 2,
      modelVersion: "2.3.0",
      calibrationId: "source-scenario-2026-08-28",
      legalRulesetId: "pl-pzp-2026-2027",
      currency: "PLN",
      deltaOperation: "formalSequential_minus_adaptiveCompliant",
      rangeSemantics: "declared_ranges_not_confidence_intervals",
      evidenceBoundary: "deterministic_outputs_not_empirical_estimates",
      scenarioOrder: SCENARIO_V2_IDS,
    });
    expect(Object.keys(bundle.scenarios[0])).toEqual([
      "scenarioId",
      "axes",
      "alternatives",
      "comparison",
      "coverage",
      "nonMonetizedDimensions",
      "assumptions",
      "roleHourlyRates",
      "calculationAnchors",
      "externalEvidence",
      "retainedAssumptions",
      "legalProvenance",
      "migration",
    ]);
    expect(nestedKeys(bundle)).not.toEqual(
      expect.arrayContaining(["exportedAt", "generatedAt", "timestamp"])
    );
  });

  it("renders exactly three byte-stable artifacts with terminal newlines", () => {
    const first = buildReplicationArtifacts();
    const second = buildReplicationArtifacts();
    expect(Object.keys(first)).toEqual([
      "built-in-scenarios.json",
      "built-in-scenarios.csv",
      "built-in-scenarios.md",
    ]);
    expect(second).toEqual(first);
    for (const content of Object.values(first)) {
      expect(content.endsWith("\n")).toBe(true);
    }
  });

  it("round-trips JSON and one RFC 4180 CSV row per scenario", () => {
    const bundle = buildReplicationBundle(buildCanonicalDecisionRecords());
    expect(JSON.parse(renderReplicationJson(bundle))).toEqual(bundle);

    const rows = parseCsv(renderReplicationCsv(bundle));
    expect(rows).toHaveLength(11);
    expect(rows[0]).toEqual(REPLICATION_CSV_HEADERS);
    expect(rows.slice(1).map((row) => row[4])).toEqual(SCENARIO_V2_IDS);
    for (const [index, row] of rows.slice(1).entries()) {
      const scenario = bundle.scenarios[index];
      expect(JSON.parse(row[10])).toEqual(scenario.axes);
      expect(JSON.parse(row[11])).toEqual(scenario.alternatives);
      expect(JSON.parse(row[12])).toEqual(scenario.coverage);
      expect(JSON.parse(row[13])).toEqual(scenario.nonMonetizedDimensions);
      expect(JSON.parse(row[14])).toEqual(scenario.migration);
    }
    expect(renderReplicationCsv(bundle).endsWith("\r\n")).toBe(true);
  });

  it("quotes commas, quotes, newlines and Polish characters without loss", () => {
    const value = 'Zażółć, "gęślą"\njaźń';
    expect(renderCsvRow([value, "plain"])).toBe(
      '"Zażółć, ""gęślą""\nJaźń"'.replace("Jaźń", "jaźń") + ",plain"
    );
  });

  it("renders canonical English Markdown without prescriptive or legacy fields", () => {
    const bundle = buildReplicationBundle(buildCanonicalDecisionRecords());
    const markdown = renderReplicationMarkdown(bundle, "en");
    let previous = -1;
    for (const id of SCENARIO_V2_IDS) {
      const current = markdown.indexOf(id);
      expect(current).toBeGreaterThan(previous);
      previous = current;
    }
    expect(markdown).toContain("Declared ranges are not confidence intervals");
    expect(markdown).toContain("Coverage anchors");
    expect(markdown).toContain("Non-monetised dimensions");
    expect(markdown).toContain("Migration status");
    expect(markdown).not.toMatch(/winner|recommended|robust|confidence score/i);
    expect(markdown).not.toMatch(/\b(?:rigid|flexible|processType|techLevel|spendType|processPhase)\b/);
  });
});
