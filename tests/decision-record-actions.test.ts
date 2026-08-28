import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  buildResearchDownloadArtifacts,
  type ResearchDownloadArtifact,
} from "@/components/decision-record/export-actions";
import DecisionRecordActions from "@/components/decision-record/DecisionRecordActions";
import { renderDecisionRecordPdf } from "@/components/pdf/render-decision-record-pdf";
import { renderAndSaveDecisionRecordPdf } from "@/components/PDFExport";
import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import { submitCalculatorWorkspace } from "@/components/calculator-v2/workspace-validation";
import {
  buildDecisionRecordV2,
  buildPdfCopy,
  createScenarioDraft,
  createScenarioDraftFromLegacyMigration,
  migrateLegacyCalculatorParams,
  type PdfCopyV2,
} from "@/lib/model-v2";
import {
  buildResearchCsv,
  buildResearchJson,
  buildResearchMarkdown,
} from "@/lib/research-export";
import { researchExportV2T } from "@/lib/i18n";
import {
  B1_EXPORTED_AT,
  fleetDecisionRecord,
  publicItDecisionRecord,
} from "@/tests/fixtures/decision-record-ui-v2";

class FakePdfDocument {
  readonly drawn: string[] = [];
  readonly saved: string[] = [];
  private pages = 1;
  private page = 1;
  internal = {
    pageSize: {
      getWidth: () => 210,
      getHeight: () => 96,
    },
  };

  setFont() { return this; }
  setFontSize() { return this; }
  setTextColor() { return this; }
  setDrawColor() { return this; }
  setLineWidth() { return this; }
  line() { return this; }
  splitTextToSize(value: string | string[], width: number) {
    void width;
    return Array.isArray(value) ? value : [value];
  }
  text(value: string | string[], x: number, y: number) {
    void x;
    void y;
    for (const line of Array.isArray(value) ? value : [value]) {
      this.drawn.push(`p${this.page}:${line}`);
    }
    return this;
  }
  addPage() {
    this.pages += 1;
    this.page = this.pages;
    return this;
  }
  getNumberOfPages() { return this.pages; }
  setPage(page: number) {
    this.page = page;
    return this;
  }
  save(filename: string) {
    this.saved.push(filename);
  }
}

function byFormat(
  artifacts: readonly ResearchDownloadArtifact[],
  format: ResearchDownloadArtifact["format"]
) {
  return artifacts.find((artifact) => artifact.format === format)!;
}

function editedPartialDecisionRecord() {
  const adaptation = createScenarioDraftFromLegacyMigration(
    migrateLegacyCalculatorParams(new URLSearchParams({ sid: "erp" })),
    true
  );
  if (adaptation.status !== "ready") {
    throw new Error("Expected a confirmed partial migration fixture");
  }
  const draft = structuredClone(adaptation.draft);
  draft.economicAssumptions.contractValue = {
    low: 4_200_000,
    central: 4_200_000,
    high: 4_200_000,
    rangeKind: "fixed",
    evidenceClass: "user_input",
    evidenceIds: ["user.contract-value"],
  };
  return buildDecisionRecordV2(draft, adaptation.gate);
}

describe("decision-record download actions", () => {
  it("uses the approved control treatment for all four export actions", () => {
    const markup = renderToStaticMarkup(
      createElement(DecisionRecordActions, {
        lang: "en",
        record: fleetDecisionRecord(),
      })
    );

    expect(markup.match(/<button\b/g)).toHaveLength(4);
    expect(markup.match(/min-h-11/g)).toHaveLength(4);
    expect(markup.match(/rounded-lg/g)).toHaveLength(4);
  });

  it.each(["pl", "en"] as const)(
    "delegates %s text artifacts byte for byte with exact MIME types and filenames",
    (lang) => {
      const record = fleetDecisionRecord();
      const artifacts = buildResearchDownloadArtifacts(
        record,
        lang,
        B1_EXPORTED_AT
      );
      const base = `procuracost-model-2.3.0-fleet_tco_reframing-${lang}`;

      expect(artifacts.map(({ format, filename, mime }) => ({
        format,
        filename,
        mime,
      }))).toEqual([
        {
          format: "json",
          filename: `${base}.json`,
          mime: "application/json",
        },
        {
          format: "csv",
          filename: `${base}.csv`,
          mime: "text/csv;charset=utf-8",
        },
        {
          format: "markdown",
          filename: `${base}.md`,
          mime: "text/markdown;charset=utf-8",
        },
      ]);
      expect(byFormat(artifacts, "json").content).toBe(
        JSON.stringify(buildResearchJson(record, lang, B1_EXPORTED_AT), null, 2)
      );
      expect(byFormat(artifacts, "csv").content).toBe(
        buildResearchCsv(record, lang)
      );
      expect(byFormat(artifacts, "markdown").content).toBe(
        buildResearchMarkdown(record, lang)
      );
    }
  );

  it("does not read the clock while preparing pure text artifacts", () => {
    const NativeDate = Date;
    vi.stubGlobal(
      "Date",
      class extends NativeDate {
        constructor(value?: string | number | Date) {
          if (value === undefined) throw new Error("unexpected clock read");
          super(value instanceof NativeDate ? value.getTime() : value);
        }
        static override now(): number {
          throw new Error("unexpected clock read");
        }
      }
    );

    try {
      expect(() =>
        buildResearchDownloadArtifacts(
          fleetDecisionRecord(),
          "en",
          B1_EXPORTED_AT
        )
      ).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("draws every supplied PDF-copy collection, paginates and localises every page label", () => {
    const copy = buildPdfCopy(fleetDecisionRecord(), "en", B1_EXPORTED_AT);
    const doc = new FakePdfDocument();

    renderDecisionRecordPdf(doc as never, copy);

    const output = doc.drawn.join("\n");
    expect(output).toContain(copy.title);
    expect(output).toContain(copy.scenarioName);
    for (const label of Object.values(copy.sectionLabels)) {
      expect(output, label).toContain(label);
    }
    expect(output).toContain(copy.alternatives[0].workflowSteps[0].label);
    expect(output).toContain(copy.externalEvidence[0].supportedClaim);
    expect(output).toContain(copy.roleHourlyRates[0].roleLabel);
    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
    for (let page = 1; page <= doc.getNumberOfPages(); page += 1) {
      expect(output).toContain(`p${page}:${copy.pageLabel(page, doc.getNumberOfPages())}`);
    }
  });

  it("carries the export locale and pairs Polish labels with invariant PDF identifiers", () => {
    const copy = buildPdfCopy(fleetDecisionRecord(), "pl", B1_EXPORTED_AT);
    const doc = new FakePdfDocument();

    renderDecisionRecordPdf(doc as never, copy);

    expect(copy.metadata).toContainEqual({
      label: researchExportV2T.pl.fields.locale,
      value: "pl",
    });

    const output = doc.drawn.join("\n");
    expect(output).toContain(
      "Warianty ścieżki krytycznej: Niski (low), Centralny (central), Wysoki (high)"
    );
    expect(output).toContain("Rodzaj zakresu: Skalibrowany (calibrated)");
    expect(output).toContain(
      "czas przebiegu procesu (workflow_duration)"
    );
    expect(output).not.toContain(
      "Warianty ścieżki krytycznej: low, central, high"
    );
    expect(output).not.toContain("Rodzaj zakresu: calibrated");
  });

  it("renders the supplied copy and saves only its exact filename", () => {
    const copy: PdfCopyV2 = buildPdfCopy(
      fleetDecisionRecord(),
      "pl",
      B1_EXPORTED_AT
    );
    const doc = new FakePdfDocument();

    renderAndSaveDecisionRecordPdf(doc as never, copy);

    expect(doc.saved).toEqual([
      "procuracost-model-2.3.0-fleet_tco_reframing-pl.pdf",
    ]);
  });

  it("draws supplied legal, migration-audit and post-migration-edit details", () => {
    const publicCopy = buildPdfCopy(
      publicItDecisionRecord(),
      "en",
      B1_EXPORTED_AT
    );
    const publicDoc = new FakePdfDocument();
    renderDecisionRecordPdf(publicDoc as never, publicCopy);
    const publicOutput = publicDoc.drawn.join("\n");

    expect(publicOutput).toContain(publicCopy.legalProvenance[0].provision);
    const lockedStep = publicCopy.alternatives
      .flatMap(({ workflowSteps }) => workflowSteps)
      .find(({ lockedLegalProvenance }) => lockedLegalProvenance !== null);
    expect(publicOutput).toContain(lockedStep?.lockedLegalProvenance?.ruleId);

    const migratedCopy = buildPdfCopy(
      editedPartialDecisionRecord(),
      "en",
      B1_EXPORTED_AT
    );
    const migratedDoc = new FakePdfDocument();
    renderDecisionRecordPdf(migratedDoc as never, migratedCopy);
    const migratedOutput = migratedDoc.drawn.join("\n");
    const auditField = migratedCopy.migrationAudit?.fieldDispositions[0];
    const edit = migratedCopy.postMigrationEdits[0];

    expect(auditField).toBeDefined();
    expect(edit).toBeDefined();
    expect(migratedOutput).toContain(auditField?.provenance.sourceField);
    expect(migratedOutput).toContain(edit.before.range.central);
    expect(migratedOutput).toContain(edit.after.range.central);
    expect(migratedOutput).toContain(edit.provenance.sourceClass);
  });

  it("falls back from a blank submitted base-step label in every download", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const sourceStep =
      initial.draft.alternatives.formalSequential.workflowDesign.steps[0];
    const edited = calculatorWorkspaceReducer(initial, {
      type: "edit-step-label",
      alternativeId: "formalSequential",
      stepId: sourceStep.id,
      userLabel: "",
    });
    const submitted = submitCalculatorWorkspace(edited);
    expect(submitted.status).toBe("submitted");
    if (submitted.status !== "submitted") throw new Error("Expected submit");

    const record = submitted.state.record;
    if (!record) throw new Error("Expected decision record");
    const step = record.alternatives.formalSequential.workflow.steps.find(
      ({ id }) => id === sourceStep.id
    );
    expect(step?.userLabel).toBeNull();

    const fallback = "Market sounding";
    const pdf = buildPdfCopy(record, "en", B1_EXPORTED_AT);
    expect(
      pdf.alternatives[0].workflowSteps.find(({ id }) => id === sourceStep.id)
        ?.label
    ).toBe(fallback);

    const artifacts = buildResearchDownloadArtifacts(
      record,
      "en",
      B1_EXPORTED_AT
    );
    const json = JSON.parse(byFormat(artifacts, "json").content);
    expect(
      json.alternatives.formalSequential.workflow.steps.find(
        ({ id }: { id: string }) => id === sourceStep.id
      ).userLabel
    ).toBeNull();
    expect(byFormat(artifacts, "csv").content).toContain(
      `workflow_step,${sourceStep.id},formalSequential,activeDays,`
    );
    expect(byFormat(artifacts, "csv").content).toContain(`,${fallback},en`);
    expect(byFormat(artifacts, "markdown").content).toContain(
      `| ${fallback} | \`${sourceStep.id}\` |`
    );
  });
});
