import { describe, expect, it } from "vitest";

import { encodeInputsToParams } from "@/components/calculator-url";
import {
  buildPdfCopy,
  pdfExportFilename,
  type PdfLabelValue,
  type PdfRendererLabels,
} from "@/lib/model-v2/pdf-copy";
import { buildDecisionRecordV2 } from "@/lib/model-v2/decision-record";
import {
  createScenarioDraftFromLegacyMigration,
  migrateLegacyCalculatorParams,
} from "@/lib/model-v2";
import { createScenarioDraft } from "@/lib/model-v2/scenarios";
import { SCENARIOS } from "@/lib/scenarios";
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

function exactEditedRecord() {
  const scenario = SCENARIOS.find(({ id }) => id === "fleet")!;
  const adaptation = createScenarioDraftFromLegacyMigration(
    migrateLegacyCalculatorParams(
      encodeInputsToParams(scenario.inputs, scenario.id)
    )
  );
  if (adaptation.status !== "ready") {
    throw new Error("Expected exact migration fixture");
  }
  const draft = structuredClone(adaptation.draft);
  draft.economicAssumptions.contractValue = userFixed(5_500_000);
  draft.roleHourlyRates.buyer = userFixed(321, "user.hourly-rate.buyer");
  return buildDecisionRecordV2(draft, adaptation.gate);
}

function leafPaths(value: unknown, path = ""): string[] {
  if (typeof value === "string") return [path];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, path ? `${path}.${key}` : key)
  );
}

function stringLeaves(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(stringLeaves);
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

describe("model 2.3 pure PDF copy", () => {
  it("builds complete British-English copy and the exact filename without browser state", () => {
    const record = fleetRecord();
    const before = structuredClone(record);

    const copy = buildPdfCopy(record, "en", EXPORTED_AT);

    expect(copy.filename).toBe(
      "procuracost-model-2.3.0-fleet_tco_reframing-en.pdf"
    );
    expect(copy.title).toBe("ProcuraCost model 2.3 decision record");
    expect(copy.scenarioName).toBe("Fleet TCO reframing");
    expect(copy.exportedAt).toBe("28 August 2026");
    expect(copy.pageLabel(2, 4)).toBe("Page 2 of 4");
    expect(copy.metadata).toContainEqual({
      label: "Model version",
      value: "2.3.0",
    });
    expect(copy.context[0]).toEqual({
      id: "legalGovernanceBoundary",
      label: "Legal and governance boundary",
      value: "Private-sector procurement policy",
    });
    expect(copy.alternatives.map(({ label }) => label)).toEqual([
      "Formal sequential alternative",
      "Adaptive compliant alternative",
    ]);
    expect(copy.alternatives[0].workflowSteps[0].label).toBe(
      "Market sounding"
    );
    expect(copy.results[0].total.central).toMatch(/PLN$/);
    expect(copy.drivers.some(({ label }) => label === "Non-labour cost")).toBe(
      true
    );
    expect(copy.nonMonetizedDimensions[0].status).toBe("not monetised");
    expect(copy.calculationAnchors.length).toBeGreaterThan(0);
    expect(copy.externalEvidence.length).toBeGreaterThan(0);
    expect(copy.retainedAssumptions.length).toBeGreaterThan(0);
    expect(copy.retainedAssumptions[0].evidenceStatus).toBe(
      "Retained model 2.2.2 assumption"
    );
    expect(copy.migration).toContainEqual({
      label: "Status",
      value: "Native model 2.3 record",
    });
    expect(record).toEqual(before);
  });

  it("builds complete Polish copy and Polish page labels", () => {
    const copy = buildPdfCopy(fleetRecord(), "pl", EXPORTED_AT);

    expect(copy.filename).toBe(
      "procuracost-model-2.3.0-fleet_tco_reframing-pl.pdf"
    );
    expect(copy.title).toBe("Rekord decyzji modelu ProcuraCost 2.3");
    expect(copy.scenarioName).toBe("Flota: przeformułowanie TCO");
    expect(copy.exportedAt).toBe("28 sierpnia 2026");
    expect(copy.pageLabel(2, 4)).toBe("Strona 2 z 4");
    expect(copy.context[0].label).toBe("Ramy prawne i ład zakupowy");
    expect(copy.alternatives[0].label).toBe("Formalna ścieżka sekwencyjna");
    expect(copy.nonMonetizedDimensions[0].status).toBe("niemonetyzowany");
  });

  it("exposes a complete paired renderer vocabulary", () => {
    const polish = buildPdfCopy(fleetRecord(), "pl", EXPORTED_AT).rendererLabels;
    const english = buildPdfCopy(fleetRecord(), "en", EXPORTED_AT).rendererLabels;
    const requiredFields = [
      "id",
      "labelKey",
      "userLabel",
      "value",
      "workflowDesign",
      "contractDesign",
      "activeDays",
      "queueDays",
      "elapsedDays",
      "totalCost",
      "roleHours",
      "roleHourlyRates",
      "hourlyRate",
      "postMigrationEdits",
      "beforeEdit",
      "afterEdit",
      "originalDisposition",
      "nonLabourCost",
      "predecessorIds",
      "stepKind",
      "criticalPathCases",
      "lockedLegalWait",
      "contribution",
      "status",
      "reasons",
      "evidenceStatus",
      "evidenceClass",
      "evidenceIds",
      "supportedClaim",
      "unsupportedClaim",
      "population",
      "constructs",
      "assumptionKeys",
      "source",
      "path",
      "detail",
      "legalRulesetId",
      "ruleId",
      "provision",
      "initiatedOn",
      "lockedActiveDays",
      "lockedQueueDays",
      "occurrences",
      "sourceSchemaVersion",
      "legacyScenarioId",
      "field",
      "sourceField",
      "disposition",
      "retainedValue",
      "changedFromLegacyScenario",
      "materializedPaths",
      "sourceClass",
      "rangeKind",
    ] as const satisfies readonly (keyof PdfRendererLabels["fields"])[];

    expect(leafPaths(polish).sort()).toEqual(leafPaths(english).sort());
    expect(Object.keys(english.fields).sort()).toEqual(
      [...requiredFields].sort()
    );
    expect(Object.keys(english.stepKinds)).toEqual([
      "activity",
      "approval",
      "legal_wait",
      "milestone",
    ]);
    expect(Object.keys(english.roles)).toEqual([
      "requestor",
      "buyer",
      "lawyer",
      "finance",
      "manager",
      "executive",
      "unknown",
    ]);
    expect(Object.keys(english.migrationDispositions)).toEqual([
      "materialised",
      "retained_only",
      "blocked",
    ]);
    expect(english.alternatives).toEqual({
      formalSequential: "Formal sequential alternative",
      adaptiveCompliant: "Adaptive compliant alternative",
    });
    expect(english.fields.contribution).toBe(
      "Contribution to cost difference"
    );
    const englishCopy = stringLeaves(english).join(" ");
    expect(englishCopy).toMatch(/labour/i);
    expect(englishCopy).toMatch(/monetised/i);
    expect(englishCopy).toMatch(/materialised/i);
    expect(englishCopy).not.toMatch(/\blabor\b/i);
    expect(englishCopy).not.toMatch(/\bmonetized\b/i);
    expect(englishCopy).not.toMatch(/\bmaterialized\b/i);
  });

  it("preserves role rates and coverage provenance in isolated PDF copy", () => {
    const record = fleetRecord();
    const english = buildPdfCopy(record, "en", EXPORTED_AT);
    const polish = buildPdfCopy(record, "pl", EXPORTED_AT);
    const oldConsumer: PdfLabelValue[] = english.coverage;

    expect(oldConsumer).toHaveLength(6);
    expect(english.roleHourlyRates.map(({ roleId }) => roleId)).toEqual([
      "requestor",
      "buyer",
      "lawyer",
      "finance",
      "manager",
      "executive",
    ]);
    expect(english.roleHourlyRates.find(({ roleId }) => roleId === "buyer")).toMatchObject({
      roleId: "buyer",
      roleLabel: "Buyer",
      rate: {
        low: "100.00 PLN",
        central: "100.00 PLN",
        high: "100.00 PLN",
      },
    });
    expect(polish.roleHourlyRates.find(({ roleId }) => roleId === "buyer")?.roleLabel).toBe(
      "Kupiec"
    );
    expect(english.coverage.every(({ label, value, status, anchors }) =>
      Boolean(label && value && status === "included" && anchors.length > 0)
    )).toBe(true);
    const sourceAnchor = record.coverage[0].anchors[0];
    const copiedAnchor = english.coverage[0].anchors[0];
    expect(copiedAnchor).toMatchObject({
      path: sourceAnchor.path,
      evidenceClass: sourceAnchor.evidenceClass,
      evidenceStatus: "Retained model 2.2.2 assumption",
      evidenceIds: sourceAnchor.evidenceIds,
    });
    expect(copiedAnchor).not.toBe(sourceAnchor);
    expect(copiedAnchor.evidenceIds).not.toBe(sourceAnchor.evidenceIds);
    copiedAnchor.evidenceIds.push("copy-mutated");
    expect(sourceAnchor.evidenceIds).not.toContain("copy-mutated");
    sourceAnchor.evidenceIds.push("record-mutated");
    expect(copiedAnchor.evidenceIds).not.toContain("record-mutated");
  });

  it("keeps the PDF copy builder clock-free", () => {
    const record = fleetRecord();
    const OriginalDate = globalThis.Date;
    class ThrowingDate extends OriginalDate {
      constructor(..._args: ConstructorParameters<typeof Date>) {
        super(..._args);
        throw new Error("PDF copy must not construct Date");
      }

      static now(): number {
        throw new Error("PDF copy must not read Date.now");
      }
    }
    globalThis.Date = ThrowingDate as DateConstructor;
    try {
      expect(
        buildPdfCopy(record, "en", EXPORTED_AT).exportedAt
      ).toBe("28 August 2026");
    } finally {
      globalThis.Date = OriginalDate;
    }
  });

  it("preserves retained and materialised legacy values in isolated PDF copy data", () => {
    const record = migratedRecord();
    const copy = buildPdfCopy(record, "en", EXPORTED_AT);

    expect(copy.migrationAudit).toMatchObject({
      sourceClass: "legacy_migration_input",
      retainedLegacyInputs: {
        contractValue: 3_750_000,
        dailyCostOfInaction: 9_999,
      },
    });
    expect(copy.migrationAudit?.fieldDispositions).toContainEqual(
      expect.objectContaining({
        field: "contractValue",
        disposition: "materialised",
        retainedValue: 3_750_000,
        materializedPaths: ["economicAssumptions.contractValue"],
        provenance: expect.objectContaining({
          sourceField: "retainedLegacyInputs.contractValue",
        }),
      })
    );
    expect(copy.externalEvidence.map(({ id }) => id)).not.toContain(
      "legacy-v1.erp.retainedLegacyInputs.contractValue"
    );
    expect(copy.retainedAssumptions.map(({ id }) => id)).not.toContain(
      "legacy-v1.erp.retainedLegacyInputs.contractValue"
    );

    if (!record.metadata.migration.audit || !copy.migrationAudit) {
      throw new Error("Expected migration audit in record and PDF copy");
    }
    record.metadata.migration.audit.retainedLegacyInputs.contractValue = 1;
    expect(copy.migrationAudit.retainedLegacyInputs.contractValue).toBe(
      3_750_000
    );
    copy.migrationAudit.fieldDispositions[0].materializedPaths.push("mutated");
    expect(
      record.metadata.migration.audit.fieldDispositions[0].materializedPaths
    ).not.toContain("mutated");
  });

  it("preserves edited partial values and provenance without aliasing record, audit or draft", () => {
    const { adaptation, draft, record } = editedPartialFixture();
    const copy = buildPdfCopy(record, "en", EXPORTED_AT);
    const contractEdit = copy.postMigrationEdits[0];
    const dailyEdit = copy.postMigrationEdits[1];

    expect(copy.postMigrationEdits).toHaveLength(8);
    expect(contractEdit).toEqual({
      field: "contractValue",
      materializedPaths: ["economicAssumptions.contractValue"],
      before: {
        range: {
          low: "3,000,000.00 PLN",
          central: "3,000,000.00 PLN",
          high: "3,000,000.00 PLN",
        },
        rangeKind: "fixed",
        evidenceClass: "user_input",
        evidenceStatus: "User-supplied input",
        evidenceIds: [
          "legacy-v1.erp.retainedLegacyInputs.contractValue",
        ],
      },
      after: {
        range: {
          low: "4,200,000.00 PLN",
          central: "4,200,000.00 PLN",
          high: "4,200,000.00 PLN",
        },
        rangeKind: "fixed",
        evidenceClass: "user_input",
        evidenceStatus: "User-supplied input",
        evidenceIds: ["user.contract-value"],
      },
      provenance: {
        sourceClass: "post_migration_user_edit",
        sourceClassLabel: "User edit after migration",
        sourceSchemaVersion: "legacy-v1",
        legacyScenarioId: "erp",
        sourceField: "retainedLegacyInputs.contractValue",
        originalDisposition: "materialised",
        originalDispositionLabel: "Materialised",
      },
    });
    expect(dailyEdit.materializedPaths).toEqual([
      "economicAssumptions.dailyCostOfInaction",
      "dailyCostOfInaction",
    ]);

    contractEdit.before.evidenceIds.push("copy-mutated");
    contractEdit.after.evidenceIds.push("copy-mutated");
    contractEdit.materializedPaths.push("roleHourlyRates.buyer");
    expect(
      record.metadata.migration.postMigrationEdits[0].before.evidenceIds
    ).not.toContain("copy-mutated");
    expect(
      record.metadata.migration.postMigrationEdits[0].after.evidenceIds
    ).not.toContain("copy-mutated");
    expect(
      adaptation.audit.fieldDispositions.find(
        ({ field }) => field === "contractValue"
      )?.materializedPaths
    ).toEqual(["economicAssumptions.contractValue"]);
    expect(draft.economicAssumptions.contractValue.evidenceIds).toEqual([
      "user.contract-value",
    ]);
  });

  it("keeps exact legacy edits explicit with an empty post-migration copy", () => {
    const copy = buildPdfCopy(exactEditedRecord(), "en", EXPORTED_AT);

    expect(copy.postMigrationEdits).toEqual([]);
    expect(copy.rendererLabels.values.noPostMigrationEdits).toBe(
      "No post-migration edits"
    );
    expect(copy.roleHourlyRates.find(({ roleId }) => roleId === "buyer")?.rate.central).toBe(
      "321.00 PLN"
    );
  });

  it("preserves complete locked legal provenance without mixing it into evidence", () => {
    const record = buildDecisionRecordV2(
      createScenarioDraft("public_it_open_with_market_consultation")
    );
    const copy = buildPdfCopy(record, "en", EXPORTED_AT);

    expect(copy.legalProvenance[0]).toMatchObject({
      legalRulesetId: "pl-pzp-2026-2027",
      ruleId: "pl-pzp-art-138-1",
      provision: "PZP art. 138 ust. 1",
      lockedActiveDays: "0.00",
      lockedQueueDays: "35.00",
    });
    expect(copy.externalEvidence.map(({ id }) => id)).not.toContain(
      "pl-pzp-art-138-1"
    );
  });

  it("preserves an ordinary step label key and explicit null legal lock", () => {
    const copy = buildPdfCopy(fleetRecord(), "en", EXPORTED_AT);
    const step = copy.alternatives[0].workflowSteps.find(
      ({ label }) => label === "Market sounding"
    );

    expect(step).toMatchObject({
      labelKey: "workflow.steps.rfi",
      locked: false,
      lockedLegalProvenance: null,
    });
  });

  it("clones the complete locked PZP step provenance in isolation", () => {
    const record = buildDecisionRecordV2(
      createScenarioDraft("public_it_open_with_market_consultation")
    );
    const copy = buildPdfCopy(record, "en", EXPORTED_AT);
    const sourceStep = record.alternatives.formalSequential.workflow.steps.find(
      ({ lockedLegalProvenance }) =>
        lockedLegalProvenance?.ruleId === "pl-pzp-art-138-1"
    );
    const copiedStep = copy.alternatives[0].workflowSteps.find(
      ({ id }) => id === sourceStep?.id
    );

    expect(copiedStep).toMatchObject({
      labelKey: "workflow.legal.pzpOpen.bidSubmission",
      locked: true,
      lockedLegalProvenance: {
        legalRulesetId: "pl-pzp-2026-2027",
        ruleId: "pl-pzp-art-138-1",
        provision: "PZP art. 138 ust. 1",
        initiatedOn: "2026-08-28",
        lockedActiveDays: 0,
        lockedQueueDays: 35,
      },
    });
    expect(copiedStep?.lockedLegalProvenance).not.toBe(
      sourceStep?.lockedLegalProvenance
    );

    if (!sourceStep?.lockedLegalProvenance || !copiedStep?.lockedLegalProvenance) {
      throw new Error("Expected locked provenance in source and PDF copy");
    }
    sourceStep.lockedLegalProvenance.provision = "mutated source";
    expect(copiedStep.lockedLegalProvenance.provision).toBe(
      "PZP art. 138 ust. 1"
    );
    copiedStep.lockedLegalProvenance.ruleId = "mutated copy";
    expect(sourceStep.lockedLegalProvenance.ruleId).toBe("pl-pzp-art-138-1");
  });

  it("states positive, negative, zero and crossing-zero comparisons neutrally", () => {
    expect(buildPdfCopy(recordWithComparison(1250, 500, 2000), "en", EXPORTED_AT).comparisonSummary).toContain(
      "costs 1,250.00 PLN more"
    );
    expect(buildPdfCopy(recordWithComparison(-1250, -2000, -500), "en", EXPORTED_AT).comparisonSummary).toContain(
      "costs 1,250.00 PLN less"
    );
    expect(buildPdfCopy(recordWithComparison(0, 0, 0), "en", EXPORTED_AT).comparisonSummary).toContain(
      "same central total cost"
    );
    expect(buildPdfCopy(recordWithComparison(1250, -500, 2000), "en", EXPORTED_AT).comparisonSummary).toContain(
      "range crosses zero"
    );
  });

  it("keeps null assumptions and confirmed migration explicit in PDF copy", () => {
    const record = buildDecisionRecordV2(
      createScenarioDraft("catalog_calloff_control")
    );
    const copy = buildPdfCopy(record, "en", EXPORTED_AT);

    expect(
      copy.assumptions.find(({ id }) => id === "competitionTransferRate")
    ).toMatchObject({ value: "not applicable" });
    expect(copy.migration).toContainEqual({
      label: "Confirmed",
      value: "yes",
    });
    expect(copy.scenarioName).toBe("Catalogue call-off control");
    expect(
      copy.alternatives[0].workflowSteps.find(({ id }) =>
        id.endsWith(".catalog_selection")
      )
    ).toMatchObject({
      label: "Catalogue selection",
    });
  });

  it("exposes every cost, topology, authorship and critical-path field for a workflow step", () => {
    const copy = buildPdfCopy(
      decisionRecordWithTopology("branched"),
      "en",
      EXPORTED_AT
    );
    const root = copy.alternatives[0].workflowSteps.find(
      ({ id }) => id === "fixture.root"
    );

    expect(root).toEqual({
      id: "fixture.root",
      labelKey: "workflow.steps.fixture_root",
      label: "Scope root",
      userLabel: "Scope root",
      kind: "activity",
      predecessors: [],
      predecessorIds: [],
      activeDays: { low: "1.00", central: "1.00", high: "1.00" },
      queueDays: { low: "0.50", central: "0.50", high: "0.50" },
      roleHours: [
        {
          roleId: "buyer",
          hours: { low: "1.00", central: "2.00", high: "3.00" },
        },
        {
          roleId: "lawyer",
          hours: { low: "0.50", central: "0.50", high: "0.50" },
        },
      ],
      nonLabourCost: {
        low: "10.00 PLN",
        central: "20.00 PLN",
        high: "30.00 PLN",
      },
      locked: false,
      lockedLegalProvenance: null,
      criticalPathCases: ["low", "central", "high"],
    });
  });

  it("keeps same-step branched and sequential workflow maps distinguishable in PDF copy", () => {
    const branched = buildPdfCopy(
      decisionRecordWithTopology("branched"),
      "en",
      EXPORTED_AT
    ).alternatives[0].workflowSteps;
    const sequential = buildPdfCopy(
      decisionRecordWithTopology("sequential"),
      "en",
      EXPORTED_AT
    ).alternatives[0].workflowSteps;

    expect(branched.find(({ id }) => id === "fixture.finish")).toMatchObject({
      predecessorIds: ["fixture.long", "fixture.short"],
      criticalPathCases: ["low", "central", "high"],
    });
    expect(branched.find(({ id }) => id === "fixture.long")).toMatchObject({
      criticalPathCases: ["central"],
    });
    expect(branched.find(({ id }) => id === "fixture.short")).toMatchObject({
      criticalPathCases: ["low", "high"],
    });
    expect(sequential.find(({ id }) => id === "fixture.finish")).toMatchObject({
      predecessorIds: ["fixture.short"],
      criticalPathCases: ["low", "central", "high"],
    });
    expect(sequential).not.toEqual(branched);
  });

  it("blocks PDF copy and filenames for unconfirmed or ambiguous migration", () => {
    const unconfirmed = structuredClone(fleetRecord()) as unknown as ReturnType<
      typeof fleetRecord
    >;
    (unconfirmed.metadata.migration as { confirmed: boolean }).confirmed = false;
    const ambiguous = structuredClone(fleetRecord());
    (ambiguous.metadata.migration as { status: string }).status = "ambiguous";

    expect(() => buildPdfCopy(unconfirmed, "en", EXPORTED_AT)).toThrow(
      /migration/i
    );
    expect(() => pdfExportFilename(unconfirmed, "en")).toThrow(/migration/i);
    expect(() => buildPdfCopy(ambiguous, "en", EXPORTED_AT)).toThrow(
      /migration/i
    );
    expect(() => pdfExportFilename(ambiguous, "en")).toThrow(/migration/i);
  });
});
