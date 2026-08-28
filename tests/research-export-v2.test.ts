import { describe, expect, it } from "vitest";

import { encodeInputsToParams } from "@/components/calculator-url";
import { buildDecisionRecordV2 } from "@/lib/model-v2/decision-record";
import {
  createScenarioDraftFromLegacyMigration,
  migrateLegacyCalculatorParams,
} from "@/lib/model-v2";
import { createScenarioDraft } from "@/lib/model-v2/scenarios";
import { SCENARIOS } from "@/lib/scenarios";
import {
  RESEARCH_CSV_HEADERS,
  buildResearchCsv,
  buildResearchJson,
  buildResearchMarkdown,
  researchExportBaseName,
} from "@/lib/research-export";
import { decisionRecordWithTopology } from "@/tests/fixtures/branched-decision-record-v2";

const EXPORTED_AT = "2026-08-28T14:05:06.000Z";

function fleetRecord() {
  return buildDecisionRecordV2(createScenarioDraft("fleet_tco_reframing"));
}

function migratedRecord() {
  const scenario = SCENARIOS.find(({ id }) => id === "erp")!;
  const params = encodeInputsToParams(scenario.inputs, scenario.id);
  params.set("cv", "3750000");
  params.set("dci", "9999");
  const adaptation = createScenarioDraftFromLegacyMigration(
    migrateLegacyCalculatorParams(params),
    true
  );
  if (adaptation.status !== "ready") {
    throw new Error("Expected representable partial migration fixture");
  }
  return buildDecisionRecordV2(adaptation.draft, adaptation.gate);
}

function userFixed(value: number, evidenceId = "") {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed" as const,
    evidenceClass: "user_input" as const,
    evidenceIds: evidenceId ? [evidenceId] : [],
  };
}

function editedPartialFixture() {
  const adaptation = createScenarioDraftFromLegacyMigration(
    migrateLegacyCalculatorParams(new URLSearchParams({ sid: "erp" })),
    true
  );
  if (adaptation.status !== "ready") {
    throw new Error("Expected confirmed partial migration fixture");
  }
  const draft = structuredClone(adaptation.draft);
  draft.economicAssumptions.contractValue = userFixed(
    4_200_000,
    "user.contract-value"
  );
  const dailyCost = userFixed(12_345, "user.daily-cost");
  draft.economicAssumptions.dailyCostOfInaction = structuredClone(dailyCost);
  draft.dailyCostOfInaction = structuredClone(dailyCost);
  ["requestor", "buyer", "lawyer", "finance", "manager", "executive"].forEach(
    (roleId, index) => {
      draft.roleHourlyRates[roleId] = userFixed(
        201 + index,
        `user.hourly-rate.${roleId}`
      );
    }
  );
  return {
    adaptation,
    draft,
    record: buildDecisionRecordV2(draft, adaptation.gate),
  };
}

function editedExactRecord() {
  const scenario = SCENARIOS.find(({ id }) => id === "fleet")!;
  const migration = migrateLegacyCalculatorParams(
    encodeInputsToParams(scenario.inputs, scenario.id)
  );
  const adaptation = createScenarioDraftFromLegacyMigration(migration);
  if (adaptation.status !== "ready") {
    throw new Error("Expected exact migration fixture");
  }
  const draft = structuredClone(adaptation.draft);
  draft.economicAssumptions.contractValue = userFixed(5_500_000);
  draft.roleHourlyRates.buyer = userFixed(321, "user.hourly-rate.buyer");
  return buildDecisionRecordV2(draft, adaptation.gate);
}

function recordWithComparison(
  deltaCost: number,
  low: number,
  high: number
) {
  const record = structuredClone(fleetRecord());
  record.comparison.deltaCost = deltaCost;
  record.comparison.deltaCostOuterEnvelope = { low, high };
  return record;
}

function nestedKeys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(nestedKeys);
  return Object.entries(value).flatMap(([key, child]) => [
    key,
    ...nestedKeys(child),
  ]);
}

describe("model 2.3 pure research exports", () => {
  it("builds the complete versioned JSON schema from one decision record", () => {
    const record = fleetRecord();
    const before = structuredClone(record);

    const payload = buildResearchJson(record, "en", EXPORTED_AT);

    expect(Object.keys(payload)).toEqual([
      "metadata",
      "context",
      "alternatives",
      "results",
      "assumptions",
      "roleHourlyRates",
      "evidence",
      "legalProvenance",
      "migration",
    ]);
    expect(payload.metadata).toEqual({
      schemaVersion: 2,
      modelVersion: "2.3.0",
      calibrationId: "source-scenario-2026-08-28",
      legalRulesetId: "pl-pzp-2026-2027",
      scenarioId: "fleet_tco_reframing",
      currency: "PLN",
      locale: "en",
      exportedAt: EXPORTED_AT,
    });
    expect(payload.context.axes).toEqual(record.axes);
    expect(payload.alternatives).toEqual(record.alternatives);
    expect(payload.results).toEqual({
      comparison: record.comparison,
      drivers: record.drivers,
      coverage: record.coverage,
      nonMonetizedDimensions: record.nonMonetizedDimensions,
    });
    expect(payload.assumptions).toEqual(record.assumptions);
    expect(payload.roleHourlyRates).toEqual(record.roleHourlyRates);
    expect(payload.evidence).toEqual({
      calculationAnchors: record.calculationAnchors,
      externalEvidence: record.externalEvidence,
      retainedAssumptions: record.retainedAssumptions,
    });
    expect(payload.legalProvenance).toEqual(record.legalProvenance);
    expect(payload.migration).toEqual(record.metadata.migration);
    expect(payload.roleHourlyRates.buyer).not.toBe(
      record.roleHourlyRates.buyer
    );
    expect(payload.roleHourlyRates.buyer.evidenceIds).not.toBe(
      record.roleHourlyRates.buyer.evidenceIds
    );
    const payloadCoverageAnchor = payload.results.coverage[0].anchors[0];
    const recordCoverageAnchor = record.coverage[0].anchors[0];
    expect(payloadCoverageAnchor).toEqual(recordCoverageAnchor);
    expect(payloadCoverageAnchor).not.toBe(recordCoverageAnchor);
    expect(payloadCoverageAnchor.evidenceIds).not.toBe(
      recordCoverageAnchor.evidenceIds
    );
    expect(record).toEqual(before);
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("exports an edited role rate and its role-cost anchor without inferring it from workflow effort", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.roleHourlyRates.buyer = userFixed(
      321,
      "user.hourly-rate.buyer"
    );
    const record = buildDecisionRecordV2(draft);
    const payload = buildResearchJson(record, "en", EXPORTED_AT);
    const csv = buildResearchCsv(record, "en");
    const markdown = buildResearchMarkdown(record, "en");

    expect(record.roleHourlyRates.buyer).toEqual({
      low: 321,
      central: 321,
      high: 321,
      rangeKind: "fixed",
      evidenceClass: "user_input",
      evidenceIds: ["user.hourly-rate.buyer"],
    });
    expect(payload.roleHourlyRates.buyer).toEqual(record.roleHourlyRates.buyer);
    expect(csv).toContain(
      "role_hourly_rate,buyer,,hourlyRate,,321,321,321,fixed,user_input,user.hourly-rate.buyer"
    );
    expect(markdown).toContain("### Role hourly rates");
    expect(markdown).toContain("Buyer (`buyer`)");
    expect(markdown).toContain(
      "321.00 PLN / 321.00 PLN / 321.00 PLN"
    );
    expect(markdown).toContain("User-supplied input");
    expect(markdown).toContain("`user.hourly-rate.buyer`");

    const roleCoverage = record.coverage.find(({ id }) => id === "role_cost")!;
    expect(roleCoverage.anchors).toContainEqual({
      path: "roleHourlyRates.buyer",
      evidenceClass: "user_input",
      evidenceIds: ["user.hourly-rate.buyer"],
    });
    expect(csv).toContain(
      "coverage_anchor,role_cost,,roleHourlyRates.buyer,,,,,included,user_input,user.hourly-rate.buyer"
    );
    expect(markdown).toContain("`roleHourlyRates.buyer`");
  });

  it("emits one ordered coverage-anchor CSV row per record anchor without changing the header", () => {
    const record = fleetRecord();
    const csv = buildResearchCsv(record, "en");
    const lines = csv.trimEnd().split("\r\n");
    const coverageAnchorLines = lines.filter((line) =>
      line.startsWith("coverage_anchor,")
    );

    expect(RESEARCH_CSV_HEADERS).toEqual([
      "section",
      "record_id",
      "alternative_id",
      "field_id",
      "value",
      "low",
      "central",
      "high",
      "status",
      "evidence_class",
      "evidence_ids",
      "source_url",
      "label_key",
      "localized_label",
      "locale",
    ]);
    expect(lines[0]).toBe(RESEARCH_CSV_HEADERS.join(","));
    expect(coverageAnchorLines).toHaveLength(
      record.coverage.reduce((count, entry) => count + entry.anchors.length, 0)
    );
    let cursor = 0;
    for (const entry of record.coverage) {
      for (const anchor of entry.anchors) {
        expect(coverageAnchorLines[cursor]).toContain(
          `coverage_anchor,${entry.id},,${anchor.path},`
        );
        cursor += 1;
      }
    }
  });

  it("prints complete coverage anchors in supplied order without a flattened row evidence class", () => {
    const record = fleetRecord();
    const coverage = record.coverage.find(({ id }) => id === "role_cost")!;
    const markdown = buildResearchMarkdown(record, "en");
    const coverageSection = markdown.slice(
      markdown.indexOf("## Monetisation coverage"),
      markdown.indexOf("## Non-monetised dimensions")
    );

    expect(coverageSection).toContain(
      "Driver | Data path | Evidence status | Evidence identifiers"
    );
    let previousIndex = -1;
    for (const anchor of coverage.anchors) {
      const index = coverageSection.indexOf(`\`${anchor.path}\``);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(coverageSection).not.toMatch(/role_cost.*retained_legacy_assumption/);
  });

  it("preserves the complete migration audit in JSON, CSV and both Markdown locales", () => {
    const record = migratedRecord();
    const payload = buildResearchJson(record, "en", EXPORTED_AT);
    const csv = buildResearchCsv(record, "en");
    const english = buildResearchMarkdown(record, "en");
    const polish = buildResearchMarkdown(record, "pl");

    expect(payload.migration.audit).toEqual(record.metadata.migration.audit);
    expect(payload.migration.audit).not.toBe(record.metadata.migration.audit);
    expect(payload.migration.audit?.retainedLegacyInputs).toMatchObject({
      contractValue: 3_750_000,
      dailyCostOfInaction: 9_999,
    });
    expect(payload.migration.audit?.fieldDispositions).toContainEqual(
      expect.objectContaining({
        field: "contractValue",
        disposition: "materialised",
        retainedValue: 3_750_000,
        materializedPaths: ["economicAssumptions.contractValue"],
      })
    );
    expect(csv).toContain(
      "migration_input,retainedLegacyInputs.contractValue,,contractValue,3750000"
    );
    expect(csv).toContain(
      "migration_input,retainedLegacyInputs.contractValue,,sourceClass,legacy_migration_input"
    );
    expect(csv).not.toContain(",materialised,legacy_migration_input,");
    expect(csv).toContain(
      "migration_input,retainedLegacyInputs.stakeholders.requestor.dailyRate"
    );
    expect(csv).not.toContain(
      "external_evidence,legacy-v1.erp.retainedLegacyInputs.contractValue"
    );
    expect(english).toContain("### Retained legacy input audit");
    expect(english).toContain(
      "`retainedLegacyInputs.contractValue` | `materialised` | 3750000"
    );
    expect(polish).toContain("### Audyt przeniesionych danych wejściowych");
    expect(polish).toContain(
      "`retainedLegacyInputs.dailyCostOfInaction` | `materialised` | 9999"
    );
  });

  it("exports the model-derived post-migration overlay without rewriting the original audit", () => {
    const { adaptation, draft, record } = editedPartialFixture();
    const payload = buildResearchJson(record, "en", EXPORTED_AT);
    const csv = buildResearchCsv(record, "en");
    const markdown = buildResearchMarkdown(record, "en");
    const editLines = csv
      .trimEnd()
      .split("\r\n")
      .filter((line) => line.startsWith("post_migration_edit,"));

    expect(payload.migration.audit).toEqual(adaptation.audit);
    expect(payload.migration.postMigrationEdits).toEqual(
      record.metadata.migration.postMigrationEdits
    );
    expect(payload.migration.postMigrationEdits).not.toBe(
      record.metadata.migration.postMigrationEdits
    );
    expect(editLines).toHaveLength(8 * 9);
    expect(csv).toContain(
      "post_migration_edit,retainedLegacyInputs.contractValue,,before,,3000000,3000000,3000000,fixed,user_input,legacy-v1.erp.retainedLegacyInputs.contractValue"
    );
    expect(csv).toContain(
      "post_migration_edit,retainedLegacyInputs.contractValue,,after,,4200000,4200000,4200000,fixed,user_input,user.contract-value"
    );
    for (const fieldId of [
      "field",
      "sourceField",
      "materializedPaths",
      "sourceClass",
      "sourceSchemaVersion",
      "legacyScenarioId",
      "originalDisposition",
    ]) {
      expect(csv).toContain(
        `post_migration_edit,retainedLegacyInputs.contractValue,,${fieldId},`
      );
    }
    expect(markdown).toContain("### Post-migration edits");
    expect(markdown).toContain(
      "Source field | Materialised paths | Before | Before evidence | After | After evidence | Provenance"
    );
    expect(markdown).toContain(
      "`economicAssumptions.dailyCostOfInaction`, `dailyCostOfInaction`"
    );
    expect(markdown).toContain("`post_migration_user_edit`");

    payload.migration.postMigrationEdits[0].before.evidenceIds.push(
      "payload-mutated"
    );
    payload.migration.postMigrationEdits[0].after.evidenceIds.push(
      "payload-mutated"
    );
    payload.migration.postMigrationEdits[0].materializedPaths.push(
      "roleHourlyRates.buyer"
    );
    expect(
      record.metadata.migration.postMigrationEdits[0].before.evidenceIds
    ).not.toContain("payload-mutated");
    expect(
      record.metadata.migration.postMigrationEdits[0].after.evidenceIds
    ).not.toContain("payload-mutated");
    expect(
      adaptation.audit.fieldDispositions.find(
        ({ field }) => field === "contractValue"
      )?.materializedPaths
    ).toEqual(["economicAssumptions.contractValue"]);
    expect(draft.economicAssumptions.contractValue.evidenceIds).toEqual([
      "user.contract-value",
    ]);
  });

  it("exports an exact legacy edit with an explicit empty overlay in every format", () => {
    const record = editedExactRecord();
    const payload = buildResearchJson(record, "en", EXPORTED_AT);
    const csv = buildResearchCsv(record, "en");
    const markdown = buildResearchMarkdown(record, "en");

    expect(payload.migration).toMatchObject({
      status: "exact",
      postMigrationEdits: [],
    });
    expect(payload.assumptions.contractValue.central).toBe(5_500_000);
    expect(payload.roleHourlyRates.buyer.central).toBe(321);
    expect(csv).toContain(
      "post_migration_edit,post_migration_edits,,postMigrationEdits,0,,,,none"
    );
    expect(markdown).toContain("### Post-migration edits");
    expect(markdown).toContain("No post-migration edits");
  });

  it("uses one exact base filename across locales", () => {
    expect(researchExportBaseName("fleet_tco_reframing", "pl")).toBe(
      "procuracost-model-2.3.0-fleet_tco_reframing-pl"
    );
    expect(researchExportBaseName("fleet_tco_reframing", "en")).toBe(
      "procuracost-model-2.3.0-fleet_tco_reframing-en"
    );
  });

  it("keeps the CSV machine header stable and quotes comma, quote, CR, LF and Polish text", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    draft.alternatives.formalSequential.workflowDesign.steps[0].userLabel =
      'Oferta, "pilna"\r\nŁódź';
    const record = buildDecisionRecordV2(draft);

    const polish = buildResearchCsv(record, "pl");
    const english = buildResearchCsv(record, "en");
    const expectedHeader = RESEARCH_CSV_HEADERS.join(",");

    expect(polish.slice(0, expectedHeader.length)).toBe(expectedHeader);
    expect(english.slice(0, expectedHeader.length)).toBe(expectedHeader);
    expect(polish).toContain('"Oferta, ""pilna""\r\nŁódź"');
    expect(english).toContain('"Oferta, ""pilna""\r\nŁódź"');
    expect(polish).toContain("Flota: przeformułowanie TCO");
    expect(english).toContain("Fleet TCO reframing");
    expect(polish).toContain("fleet_tco_reframing");
    expect(english).toContain("fleet_tco_reframing");
    expect(english).toContain(
      "external_evidence,ec_innovation_procurement_guidance,,unsupportedClaim"
    );
    expect(english).toContain(
      "external_evidence,ec_innovation_procurement_guidance,,jurisdictionOrPopulation"
    );
    expect(english).toContain(
      "external_evidence,ec_innovation_procurement_guidance,,constructs"
    );
    expect(polish.endsWith("\r\n")).toBe(true);
  });

  it("produces fully Polish and British-English Markdown with context and designs before results", () => {
    const record = fleetRecord();
    const polish = buildResearchMarkdown(record, "pl");
    const english = buildResearchMarkdown(record, "en");

    expect(polish).toContain("# Rekord decyzji zakupowej");
    expect(polish).toContain("## Wspólny kontekst");
    expect(polish).toContain("Formalna ścieżka sekwencyjna");
    expect(polish).toContain("Wymiary niemonetyzowane");
    expect(polish).toContain("## Kotwice obliczeniowe");
    expect(polish).toContain("| Pole | Wartość |");
    expect(polish).not.toContain("Shared context");
    expect(polish).not.toContain("Non-monetised");

    expect(english).toContain("# Procurement decision record");
    expect(english).toContain("## Shared context");
    expect(english).toContain("Formal sequential alternative");
    expect(english).toContain("Non-monetised dimensions");
    expect(english).toContain("Non-labour cost");
    expect(english).toContain("## Calculation anchors");
    expect(english).toContain("| Field | Value |");
    expect(english).toContain("| Alternative | Procurement workflow design");
    expect(english).toContain("| Driver | Formal sequential alternative");
    expect(english).not.toContain("Wspólny kontekst");
    const visibleEnglish = english.replace(/`[^`]*`/g, "");
    expect(visibleEnglish).not.toMatch(
      /\b(organization|authorization|catalog|labor|modeled|materialized|monetized)\b/i
    );

    expect(polish.indexOf("## Wspólny kontekst")).toBeLessThan(
      polish.indexOf("## Wyniki")
    );
    expect(polish.indexOf("## Projekty alternatyw")).toBeLessThan(
      polish.indexOf("## Wyniki")
    );
    expect(english.indexOf("## Shared context")).toBeLessThan(
      english.indexOf("## Results")
    );
    expect(english.indexOf("## Alternative designs")).toBeLessThan(
      english.indexOf("## Results")
    );
  });

  it("states positive, negative, zero and crossing-zero comparisons neutrally", () => {
    expect(
      buildResearchMarkdown(recordWithComparison(1250, 500, 2000), "en")
    ).toContain("costs 1,250.00 PLN more");
    expect(
      buildResearchMarkdown(recordWithComparison(-1250, -2000, -500), "en")
    ).toContain("costs 1,250.00 PLN less");
    expect(
      buildResearchMarkdown(recordWithComparison(0, 0, 0), "en")
    ).toContain("have the same central total cost");
    expect(
      buildResearchMarkdown(recordWithComparison(1250, -500, 2000), "en")
    ).toContain("range crosses zero");

    expect(
      buildResearchMarkdown(recordWithComparison(1250, 500, 2000), "pl")
    ).toContain("kosztuje o 1250,00 zł więcej");
    expect(
      buildResearchMarkdown(recordWithComparison(-1250, -2000, -500), "pl")
    ).toContain("kosztuje o 1250,00 zł mniej");
    expect(
      buildResearchMarkdown(recordWithComparison(0, 0, 0), "pl")
    ).toContain("mają taki sam centralny koszt całkowity");
    expect(
      buildResearchMarkdown(recordWithComparison(1250, -500, 2000), "pl")
    ).toContain("zakres obejmuje zero");
  });

  it("keeps null assumptions and confirmed migration explicit instead of omitting them", () => {
    const record = buildDecisionRecordV2(
      createScenarioDraft("catalog_calloff_control")
    );
    const csv = buildResearchCsv(record, "en");
    const markdown = buildResearchMarkdown(record, "en");

    expect(csv).toContain(
      "assumption,competitionTransferRate,,competitionTransferRate,,,,,notApplicable"
    );
    expect(csv).toContain("migration,migration,,confirmed,true");
    expect(markdown).toContain("| Competition-transfer range | not applicable |");
    expect(markdown).toContain("**Confirmed:** yes");
    expect(markdown).toContain("Catalogue call-off control");
    expect(markdown).toContain("Catalogue selection");
    expect(markdown).not.toMatch(/\bcatalog\b/i);
  });

  it("serialises predecessor IDs and case-specific critical paths in stable CSV rows", () => {
    const csv = buildResearchCsv(decisionRecordWithTopology("branched"), "en");

    expect(csv).toContain(
      "workflow_step,fixture.finish,formalSequential,predecessorIds,fixture.long;fixture.short,,,,milestone,,,,workflow.steps.fixture_finish,Predecessor identifiers,en\r\n"
    );
    expect(csv).toContain(
      "workflow_step,fixture.long,formalSequential,criticalPathCases,central,,,,approval,,,,workflow.steps.fixture_long,Critical-path cases,en\r\n"
    );
    expect(csv).toContain(
      "workflow_step,fixture.short,formalSequential,criticalPathCases,low;high,,,,activity,,,,workflow.steps.fixture_short,Critical-path cases,en\r\n"
    );
  });

  it("keeps same-step branched and sequential workflow maps distinguishable in Markdown", () => {
    const branched = buildResearchMarkdown(
      decisionRecordWithTopology("branched"),
      "en"
    );
    const sequential = buildResearchMarkdown(
      decisionRecordWithTopology("sequential"),
      "en"
    );

    expect(branched).toContain(
      "| Finish | `fixture.finish` | milestone | `fixture.long`; `fixture.short` | low; central; high |"
    );
    expect(branched).toContain(
      "| Long review | `fixture.long` | approval | `fixture.root` | central |"
    );
    expect(branched).toContain(
      "| Variable review | `fixture.short` | activity | `fixture.root` | low; high |"
    );
    expect(sequential).toContain(
      "| Finish | `fixture.finish` | milestone | `fixture.short` | low; central; high |"
    );
    expect(sequential).toContain(
      "| Variable review | `fixture.short` | activity | `fixture.long` | low; central; high |"
    );
    expect(sequential).not.toBe(branched);
  });

  it("does not reintroduce legacy axes or prescriptive result fields", () => {
    const payload = buildResearchJson(fleetRecord(), "en", EXPORTED_AT);
    const keys = nestedKeys(payload);
    const markdown = buildResearchMarkdown(fleetRecord(), "en");
    const csv = buildResearchCsv(fleetRecord(), "en");

    for (const forbidden of [
      "rigid",
      "flexible",
      "processType",
      "techLevel",
      "spendType",
      "processPhase",
      "winner",
      "recommended",
      "recommendation",
      "optimal",
      "confidence",
    ]) {
      expect(keys).not.toContain(forbidden);
      expect(markdown.toLowerCase()).not.toContain(forbidden.toLowerCase());
      expect(csv.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
  });
});
