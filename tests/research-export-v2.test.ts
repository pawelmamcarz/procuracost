import { describe, expect, it } from "vitest";

import { buildDecisionRecordV2 } from "@/lib/model-v2/decision-record";
import { createScenarioDraft } from "@/lib/model-v2/scenarios";
import {
  RESEARCH_CSV_HEADERS,
  buildResearchCsv,
  buildResearchJson,
  buildResearchMarkdown,
  researchExportBaseName,
} from "@/lib/research-export";

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
    expect(payload.evidence).toEqual({
      calculationAnchors: record.calculationAnchors,
      externalEvidence: record.externalEvidence,
      retainedAssumptions: record.retainedAssumptions,
    });
    expect(payload.legalProvenance).toEqual(record.legalProvenance);
    expect(payload.migration).toEqual(record.metadata.migration);
    expect(record).toEqual(before);
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
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
    expect(english).not.toMatch(
      /\b(organization|authorization|catalog|labor|modeled)\b/i
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
