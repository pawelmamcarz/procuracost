import { describe, expect, it } from "vitest";

import {
  buildPdfCopy,
  pdfExportFilename,
} from "@/lib/model-v2/pdf-copy";
import { buildDecisionRecordV2 } from "@/lib/model-v2/decision-record";
import { createScenarioDraft } from "@/lib/model-v2/scenarios";
import { decisionRecordWithTopology } from "@/tests/fixtures/branched-decision-record-v2";

const EXPORTED_AT = "2026-08-28T14:05:06.000Z";

function fleetRecord() {
  return buildDecisionRecordV2(createScenarioDraft("fleet_tco_reframing"));
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
