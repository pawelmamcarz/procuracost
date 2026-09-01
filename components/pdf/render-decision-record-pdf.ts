import type { jsPDF } from "jspdf";

import type {
  PdfCopyV2,
  PdfEvidenceCopy,
  PdfRangeCopy,
} from "@/lib/model-v2";
import type { ComparisonDisplayNames } from "@/components/calculator-v2/local-draft";

function isRange(value: string | PdfRangeCopy): value is PdfRangeCopy {
  return typeof value !== "string";
}

function printable(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

export function renderDecisionRecordPdf(
  doc: jsPDF,
  copy: PdfCopyV2,
  displayNames?: ComparisonDisplayNames
): void {
  const margin = 16;
  const footerHeight = 12;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const labels = copy.rendererLabels;
  let y = 15;

  function ensureSpace(height: number) {
    if (y + height <= pageHeight - footerHeight) return;
    doc.addPage();
    y = 15;
  }

  function writeWrapped(
    value: string,
    options: { size?: number; bold?: boolean; indent?: number } = {}
  ) {
    const size = options.size ?? 8;
    const indent = options.indent ?? 0;
    const lineHeight = size * 0.48 + 1.5;
    doc.setFont("NotoSans", options.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(55, 65, 81);
    const split = doc.splitTextToSize(value, contentWidth - indent);
    const lines = Array.isArray(split) ? split : [split];
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    }
  }

  function heading(value: string) {
    const spacing = y > 18 ? 3 : 0;
    ensureSpace(15 + spacing);
    y += spacing;
    doc.setDrawColor(156, 163, 175);
    doc.setLineWidth(0.25);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
    writeWrapped(value, { size: 11, bold: true });
    y += 1;
  }

  function subheading(value: string) {
    ensureSpace(9);
    y += 2;
    writeWrapped(value, { size: 9, bold: true });
  }

  function labelValue(label: string, value: unknown, indent = 0) {
    const displayValue =
      value === null || value === undefined
        ? labels.values.notApplicable
        : printable(value);
    writeWrapped(`${label}: ${displayValue}`, { indent });
  }

  function listValue(label: string, values: readonly unknown[], indent = 0) {
    labelValue(
      label,
      values.length > 0 ? values.map(printable).join(", ") : labels.values.none,
      indent
    );
  }

  function labelledIdentifier(label: string, identifier: string): string {
    return `${label} (${identifier})`;
  }

  function rangeDescription(range: PdfRangeCopy): string {
    return `${labels.range.low}: ${range.low}; ${labels.range.central}: ${range.central}; ${labels.range.high}: ${range.high}`;
  }

  function rangeValue(label: string, range: PdfRangeCopy, indent = 0) {
    writeWrapped(`${label}: ${rangeDescription(range)}`, { indent });
  }

  function evidenceCollection(items: readonly PdfEvidenceCopy[]) {
    for (const item of items) {
      subheading(item.title);
      labelValue(labels.fields.id, item.id, 4);
      labelValue(labels.fields.evidenceClass, item.type, 4);
      labelValue(labels.fields.supportedClaim, item.supportedClaim, 4);
      labelValue(labels.fields.unsupportedClaim, item.unsupportedClaim, 4);
      labelValue(labels.fields.population, item.population, 4);
      listValue(
        labels.fields.constructs,
        item.constructs.map((construct) =>
          labelledIdentifier(
            (labels.constructs as Record<string, string>)[construct] ?? construct,
            construct
          )
        ),
        4
      );
      listValue(labels.fields.assumptionKeys, item.assumptionKeys, 4);
      labelValue(labels.fields.source, item.sourceUrl, 4);
    }
  }

  writeWrapped(copy.title, { size: 16, bold: true });
  writeWrapped(copy.scenarioName, { size: 11, bold: true });
  writeWrapped(copy.exportedAt, { size: 8 });

  heading(copy.sectionLabels.metadata);
  for (const item of copy.metadata) labelValue(item.label, item.value);

  heading(copy.sectionLabels.context);
  for (const item of copy.context) {
    labelValue(item.label, item.value);
    labelValue(labels.fields.id, item.id, 4);
  }

  heading(copy.sectionLabels.alternatives);
  for (const alternative of copy.alternatives) {
    const displayName =
      alternative.id === "formalSequential" ||
      alternative.id === "adaptiveCompliant"
        ? displayNames?.[alternative.id]
        : undefined;
    subheading(
      displayName ? `${displayName} · ${alternative.label}` : alternative.label
    );
    labelValue(labels.fields.id, alternative.id, 4);
    labelValue(alternative.workflowDesign.label, alternative.workflowDesign.value, 4);
    labelValue(alternative.contractDesign.label, alternative.contractDesign.value, 4);
    for (const step of alternative.workflowSteps) {
      subheading(step.label);
      labelValue(labels.fields.id, step.id, 4);
      labelValue(labels.fields.labelKey, step.labelKey, 4);
      labelValue(
        labels.fields.userLabel,
        step.userLabel ?? labels.values.notApplicable,
        4
      );
      labelValue(
        labels.fields.stepKind,
        `${labels.stepKinds[step.kind as keyof typeof labels.stepKinds]} (${step.kind})`,
        4
      );
      listValue(labels.fields.predecessorIds, step.predecessorIds, 4);
      rangeValue(labels.fields.activeDays, step.activeDays, 4);
      rangeValue(labels.fields.queueDays, step.queueDays, 4);
      subheading(labels.fields.roleHours);
      for (const role of step.roleHours) {
        const roleLabel = labels.roles[role.roleId] ?? labels.roles.unknown;
        rangeValue(`${roleLabel} (${role.roleId})`, role.hours, 8);
      }
      rangeValue(labels.fields.nonLabourCost, step.nonLabourCost, 4);
      listValue(
        labels.fields.criticalPathCases,
        step.criticalPathCases.map((range) =>
          labelledIdentifier(labels.range[range], range)
        ),
        4
      );
      labelValue(
        labels.fields.lockedLegalWait,
        step.locked ? labels.values.yes : labels.values.no,
        4
      );
      if (step.lockedLegalProvenance) {
        const legal = step.lockedLegalProvenance;
        labelValue(labels.fields.legalRulesetId, legal.legalRulesetId, 8);
        labelValue(labels.fields.ruleId, legal.ruleId, 8);
        labelValue(labels.fields.provision, legal.provision, 8);
        labelValue(labels.fields.initiatedOn, legal.initiatedOn, 8);
        labelValue(labels.fields.lockedActiveDays, legal.lockedActiveDays, 8);
        labelValue(labels.fields.lockedQueueDays, legal.lockedQueueDays, 8);
      }
    }
  }

  heading(copy.sectionLabels.results);
  writeWrapped(copy.comparisonSummary, { bold: true });
  writeWrapped(rangeDescription(copy.comparisonRange));
  for (const result of copy.results) {
    subheading(result.label);
    labelValue(labels.fields.id, result.id, 4);
    rangeValue(labels.fields.elapsedDays, result.elapsedDays, 4);
    rangeValue(labels.fields.totalCost, result.total, 4);
  }

  heading(copy.sectionLabels.drivers);
  for (const driver of copy.drivers) {
    subheading(driver.label);
    labelValue(labels.fields.id, driver.id, 4);
    rangeValue(labels.alternatives.formalSequential, driver.formalSequential, 4);
    rangeValue(labels.alternatives.adaptiveCompliant, driver.adaptiveCompliant, 4);
    rangeValue(labels.fields.contribution, driver.contribution, 4);
  }

  heading(copy.sectionLabels.coverage);
  for (const item of copy.coverage) {
    subheading(item.label);
    labelValue(labels.fields.id, item.id, 4);
    labelValue(labels.fields.status, item.value, 4);
    for (const anchor of item.anchors) {
      labelValue(labels.fields.path, anchor.path, 8);
      labelValue(labels.fields.evidenceClass, anchor.evidenceClass, 8);
      labelValue(labels.fields.evidenceStatus, anchor.evidenceStatus, 8);
      listValue(labels.fields.evidenceIds, anchor.evidenceIds, 8);
    }
  }

  heading(copy.sectionLabels.nonMonetized);
  for (const item of copy.nonMonetizedDimensions) {
    subheading(item.label);
    labelValue(labels.fields.id, item.id, 4);
    labelValue(labels.fields.status, item.status, 4);
    listValue(labels.fields.reasons, item.reasons, 4);
    listValue(labels.fields.evidenceIds, item.evidenceIds, 4);
  }

  heading(copy.sectionLabels.assumptions);
  for (const item of copy.assumptions) {
    subheading(item.label);
    labelValue(labels.fields.id, item.id, 4);
    if (isRange(item.value)) {
      rangeValue(labels.fields.value, item.value, 4);
    } else {
      labelValue(labels.fields.value, item.value, 4);
    }
    labelValue(labels.fields.evidenceStatus, item.evidenceStatus, 4);
    listValue(labels.fields.evidenceIds, item.evidenceIds, 4);
  }
  subheading(labels.fields.roleHourlyRates);
  for (const role of copy.roleHourlyRates) {
    subheading(role.roleLabel);
    labelValue(labels.fields.id, role.roleId, 4);
    rangeValue(labels.fields.hourlyRate, role.rate, 4);
    labelValue(
      labels.fields.rangeKind,
      labelledIdentifier(labels.rangeKinds[role.rangeKind], role.rangeKind),
      4
    );
    labelValue(labels.fields.evidenceClass, role.evidenceClass, 4);
    labelValue(labels.fields.evidenceStatus, role.evidenceStatus, 4);
    listValue(labels.fields.evidenceIds, role.evidenceIds, 4);
  }

  heading(copy.sectionLabels.calculationAnchors);
  for (const anchor of copy.calculationAnchors) {
    labelValue(labels.fields.path, anchor.path);
    labelValue(labels.fields.evidenceClass, anchor.evidenceClass, 4);
    labelValue(labels.fields.evidenceStatus, anchor.evidenceStatus, 4);
    listValue(labels.fields.evidenceIds, anchor.evidenceIds, 4);
  }

  heading(copy.sectionLabels.internalEvidence);
  evidenceCollection(copy.internalEvidence);

  heading(copy.sectionLabels.evidence);
  evidenceCollection(copy.externalEvidence);

  heading(copy.sectionLabels.retainedAssumptions);
  for (const item of copy.retainedAssumptions) {
    subheading(item.label);
    labelValue(labels.fields.id, item.id, 4);
    labelValue(labels.fields.detail, item.detail, 4);
    labelValue(labels.fields.evidenceStatus, item.evidenceStatus, 4);
    listValue(
      labels.fields.constructs,
      item.constructs.map((construct) =>
        labelledIdentifier(
          (labels.constructs as Record<string, string>)[construct] ?? construct,
          construct
        )
      ),
      4
    );
    labelValue(labels.fields.source, item.sourceUrl, 4);
  }

  heading(copy.sectionLabels.legalProvenance);
  for (const item of copy.legalProvenance) {
    labelValue(labels.fields.legalRulesetId, item.legalRulesetId);
    labelValue(labels.fields.ruleId, item.ruleId, 4);
    labelValue(labels.fields.provision, item.provision, 4);
    labelValue(labels.fields.initiatedOn, item.initiatedOn, 4);
    labelValue(labels.fields.lockedActiveDays, item.lockedActiveDays, 4);
    labelValue(labels.fields.lockedQueueDays, item.lockedQueueDays, 4);
    listValue(labels.fields.occurrences, item.occurrences, 4);
  }

  heading(copy.sectionLabels.migration);
  for (const item of copy.migration) labelValue(item.label, item.value);
  if (copy.migrationAudit) {
    const audit = copy.migrationAudit;
    labelValue(labels.fields.sourceClass, audit.sourceClass);
    labelValue(labels.fields.sourceSchemaVersion, audit.sourceSchemaVersion);
    labelValue(labels.fields.legacyScenarioId, audit.legacyScenarioId);
    labelValue(
      labels.fields.retainedValue,
      printable(audit.retainedLegacyInputs)
    );
    for (const field of audit.fieldDispositions) {
      subheading(field.field);
      labelValue(labels.fields.disposition, labels.migrationDispositions[field.disposition], 4);
      labelValue(labels.fields.retainedValue, field.retainedValue, 4);
      labelValue(
        labels.fields.changedFromLegacyScenario,
        field.changedFromLegacyScenario ? labels.values.yes : labels.values.no,
        4
      );
      listValue(labels.fields.materializedPaths, field.materializedPaths, 4);
      labelValue(labels.fields.sourceClass, field.provenance.sourceClass, 4);
      labelValue(
        labels.fields.sourceSchemaVersion,
        field.provenance.sourceSchemaVersion,
        4
      );
      labelValue(labels.fields.legacyScenarioId, field.provenance.legacyScenarioId, 4);
      labelValue(labels.fields.sourceField, field.provenance.sourceField, 4);
    }
  }

  heading(copy.sectionLabels.postMigrationEdits);
  if (copy.postMigrationEdits.length === 0) {
    writeWrapped(labels.values.noPostMigrationEdits);
  }
  for (const edit of copy.postMigrationEdits) {
    subheading(edit.field);
    listValue(labels.fields.materializedPaths, edit.materializedPaths, 4);
    subheading(labels.fields.beforeEdit);
    rangeValue(labels.fields.value, edit.before.range, 8);
    labelValue(
      labels.fields.rangeKind,
      labelledIdentifier(
        labels.rangeKinds[edit.before.rangeKind],
        edit.before.rangeKind
      ),
      8
    );
    labelValue(labels.fields.evidenceClass, edit.before.evidenceClass, 8);
    labelValue(labels.fields.evidenceStatus, edit.before.evidenceStatus, 8);
    listValue(labels.fields.evidenceIds, edit.before.evidenceIds, 8);
    subheading(labels.fields.afterEdit);
    rangeValue(labels.fields.value, edit.after.range, 8);
    labelValue(
      labels.fields.rangeKind,
      labelledIdentifier(
        labels.rangeKinds[edit.after.rangeKind],
        edit.after.rangeKind
      ),
      8
    );
    labelValue(labels.fields.evidenceClass, edit.after.evidenceClass, 8);
    labelValue(labels.fields.evidenceStatus, edit.after.evidenceStatus, 8);
    listValue(labels.fields.evidenceIds, edit.after.evidenceIds, 8);
    labelValue(
      labels.fields.sourceClass,
      `${edit.provenance.sourceClassLabel} (${edit.provenance.sourceClass})`,
      4
    );
    labelValue(
      labels.fields.sourceSchemaVersion,
      edit.provenance.sourceSchemaVersion,
      4
    );
    labelValue(labels.fields.legacyScenarioId, edit.provenance.legacyScenarioId, 4);
    labelValue(labels.fields.sourceField, edit.provenance.sourceField, 4);
    labelValue(
      labels.fields.originalDisposition,
      `${edit.provenance.originalDispositionLabel} (${edit.provenance.originalDisposition})`,
      4
    );
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFont("NotoSans", "normal");
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    doc.text(copy.pageLabel(page, totalPages), margin, pageHeight - 5);
  }
}
