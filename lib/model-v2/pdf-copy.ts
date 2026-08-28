import {
  modelV2T,
  pdfExportV2T,
  researchExportV2T,
  type Lang,
} from "../i18n";
import type {
  CalibratedValue,
  EvidenceClass,
  RangeValues,
} from "./calibrated-value";
import type {
  DecisionAxisRecord,
  DecisionProcessStep,
  DecisionRecordMigrationMetadata,
  DecisionRecordV2,
  MonetaryDriverId,
} from "./decision-record";
import type {
  LegacyMaterializedInputField,
  LegacyMaterializedPath,
  LegacyMigrationAudit,
  LegacyMigrationFieldDispositionKind,
} from "./legacy-migration-draft";
import {
  MODEL_V2_METADATA,
  type AlternativeId,
  type ProcessMapStepKind,
} from "./domain";
import type { EvidenceConstruct } from "./evidence";

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

export interface PdfLabelValue {
  label: string;
  value: string;
}

export interface PdfRangeCopy {
  low: string;
  central: string;
  high: string;
}

export interface PdfContextCopy extends PdfLabelValue {
  id: DecisionAxisRecord["id"];
}

export interface PdfWorkflowStepCopy {
  id: string;
  labelKey: DecisionProcessStep["labelKey"];
  label: string;
  userLabel: string | null;
  kind: string;
  predecessors: string[];
  predecessorIds: string[];
  activeDays: PdfRangeCopy;
  queueDays: PdfRangeCopy;
  roleHours: Array<{
    roleId: string;
    hours: PdfRangeCopy;
  }>;
  nonLabourCost: PdfRangeCopy;
  locked: boolean;
  lockedLegalProvenance: DecisionProcessStep["lockedLegalProvenance"];
  criticalPathCases: DecisionProcessStep["criticalPathCases"];
}

export interface PdfAlternativeCopy {
  id: AlternativeId;
  label: string;
  workflowDesign: PdfLabelValue;
  contractDesign: PdfLabelValue;
  workflowSteps: PdfWorkflowStepCopy[];
}

export interface PdfResultCopy {
  id: AlternativeId;
  label: string;
  elapsedDays: PdfRangeCopy;
  total: PdfRangeCopy;
}

export interface PdfDriverCopy {
  id: string;
  label: string;
  formalSequential: PdfRangeCopy;
  adaptiveCompliant: PdfRangeCopy;
  contribution: PdfRangeCopy;
}

export interface PdfNonMonetizedCopy {
  id: string;
  label: string;
  status: string;
  reasons: string[];
  evidenceIds: string[];
}

export interface PdfAssumptionCopy {
  id: string;
  label: string;
  value: string | PdfRangeCopy;
  evidenceStatus: string;
  evidenceIds: string[];
}

export interface PdfEvidenceCopy {
  id: string;
  type: string;
  title: string;
  supportedClaim: string;
  unsupportedClaim: string;
  population: string;
  constructs: string[];
  assumptionKeys: string[];
  sourceUrl: string;
}

export interface PdfCalculationAnchorCopy {
  path: string;
  evidenceClass: EvidenceClass;
  evidenceStatus: string;
  evidenceIds: string[];
}

export interface PdfCoverageCopy extends PdfLabelValue {
  id: MonetaryDriverId;
  status: "included";
  anchors: PdfCalculationAnchorCopy[];
}

export interface PdfRoleHourlyRateCopy {
  roleId: string;
  roleLabel: string;
  rate: PdfRangeCopy;
  rangeKind: CalibratedValue["rangeKind"];
  evidenceClass: EvidenceClass;
  evidenceStatus: string;
  evidenceIds: string[];
}

export interface PdfPostMigrationValueCopy {
  range: PdfRangeCopy;
  rangeKind: CalibratedValue["rangeKind"];
  evidenceClass: EvidenceClass;
  evidenceStatus: string;
  evidenceIds: string[];
}

export interface PdfPostMigrationEditCopy {
  field: LegacyMaterializedInputField;
  materializedPaths: LegacyMaterializedPath[];
  before: PdfPostMigrationValueCopy;
  after: PdfPostMigrationValueCopy;
  provenance: {
    sourceClass: "post_migration_user_edit";
    sourceClassLabel: string;
    sourceSchemaVersion: "legacy-v1";
    legacyScenarioId: string;
    sourceField: `retainedLegacyInputs.${LegacyMaterializedInputField}`;
    originalDisposition: "materialised";
    originalDispositionLabel: string;
  };
}

export interface PdfRendererLabels {
  range: { low: string; central: string; high: string };
  rangeKinds: Record<CalibratedValue["rangeKind"], string>;
  alternatives: Record<AlternativeId, string>;
  fields: {
    id: string;
    labelKey: string;
    userLabel: string;
    value: string;
    workflowDesign: string;
    contractDesign: string;
    activeDays: string;
    queueDays: string;
    elapsedDays: string;
    totalCost: string;
    roleHours: string;
    roleHourlyRates: string;
    hourlyRate: string;
    postMigrationEdits: string;
    beforeEdit: string;
    afterEdit: string;
    originalDisposition: string;
    nonLabourCost: string;
    predecessorIds: string;
    stepKind: string;
    criticalPathCases: string;
    lockedLegalWait: string;
    contribution: string;
    status: string;
    reasons: string;
    evidenceStatus: string;
    evidenceClass: string;
    evidenceIds: string;
    supportedClaim: string;
    unsupportedClaim: string;
    population: string;
    constructs: string;
    assumptionKeys: string;
    source: string;
    path: string;
    detail: string;
    legalRulesetId: string;
    ruleId: string;
    provision: string;
    initiatedOn: string;
    lockedActiveDays: string;
    lockedQueueDays: string;
    occurrences: string;
    sourceSchemaVersion: string;
    legacyScenarioId: string;
    field: string;
    sourceField: string;
    disposition: string;
    retainedValue: string;
    changedFromLegacyScenario: string;
    materializedPaths: string;
    sourceClass: string;
    rangeKind: string;
  };
  values: {
    yes: string;
    no: string;
    notApplicable: string;
    none: string;
    included: string;
    notMonetized: string;
    locked: string;
    noPostMigrationEdits: string;
  };
  stepKinds: Record<ProcessMapStepKind, string>;
  constructs: Record<EvidenceConstruct, string>;
  roles: Record<string, string>;
  migrationDispositions: Record<LegacyMigrationFieldDispositionKind, string>;
  migrationSourceClasses: Record<"post_migration_user_edit", string>;
}

export interface PdfRetainedAssumptionCopy {
  id: string;
  label: string;
  detail: string;
  evidenceStatus: string;
  constructs: string[];
  sourceUrl: string;
}

export interface PdfLegalProvenanceCopy {
  legalRulesetId: string;
  ruleId: string;
  provision: string;
  initiatedOn: string;
  lockedActiveDays: string;
  lockedQueueDays: string;
  occurrences: string[];
}

export interface PdfCopyV2 {
  filename: string;
  locale: Lang;
  title: string;
  scenarioName: string;
  exportedAt: string;
  pageLabel: (page: number, total: number) => string;
  sectionLabels: typeof pdfExportV2T.pl.sections | typeof pdfExportV2T.en.sections;
  rendererLabels: PdfRendererLabels;
  metadata: PdfLabelValue[];
  context: PdfContextCopy[];
  alternatives: PdfAlternativeCopy[];
  results: PdfResultCopy[];
  comparisonSummary: string;
  comparisonRange: PdfRangeCopy;
  drivers: PdfDriverCopy[];
  coverage: PdfCoverageCopy[];
  nonMonetizedDimensions: PdfNonMonetizedCopy[];
  assumptions: PdfAssumptionCopy[];
  roleHourlyRates: PdfRoleHourlyRateCopy[];
  calculationAnchors: PdfCalculationAnchorCopy[];
  externalEvidence: PdfEvidenceCopy[];
  retainedAssumptions: PdfRetainedAssumptionCopy[];
  legalProvenance: PdfLegalProvenanceCopy[];
  migration: PdfLabelValue[];
  migrationAudit: LegacyMigrationAudit | null;
  postMigrationEdits: PdfPostMigrationEditCopy[];
}

function assertPdfRecord(record: DecisionRecordV2): void {
  if (!record || typeof record !== "object") {
    throw new Error("A model 2.3 decision record is required for PDF copy");
  }
  if (
    record.metadata.schemaVersion !== MODEL_V2_METADATA.schemaVersion ||
    record.metadata.modelVersion !== MODEL_V2_METADATA.modelVersion ||
    record.metadata.calibrationId !== MODEL_V2_METADATA.calibrationId ||
    record.metadata.legalRulesetId !== MODEL_V2_METADATA.legalRulesetId
  ) {
    throw new Error("PDF decision record metadata does not match model 2.3");
  }
  const migration = record.metadata.migration as DecisionRecordMigrationMetadata & {
    confirmed?: boolean;
    status?: string;
  };
  if (
    migration.confirmed !== true ||
    !["native", "exact", "partial"].includes(migration.status ?? "")
  ) {
    throw new Error("Unconfirmed or ambiguous migration cannot produce PDF copy");
  }
}

function assertIsoTimestamp(exportedAt: string): void {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(exportedAt)) {
    throw new Error("exportedAt must be an explicit UTC ISO 8601 timestamp");
  }
}

function lookupModelCopy(lang: Lang, key: string): string {
  let value: unknown = modelV2T[lang];
  for (const segment of key.split(".")) {
    if (!value || typeof value !== "object" || !(segment in value)) {
      throw new Error(`Missing ${lang} model 2.3 copy for ${key}`);
    }
    value = (value as Record<string, unknown>)[segment];
  }
  if (typeof value !== "string") {
    throw new Error(`Model 2.3 copy key ${key} is not a string`);
  }
  return value;
}

function scenarioName(record: DecisionRecordV2, lang: Lang): string {
  return lookupModelCopy(lang, `scenarios.${record.metadata.scenarioId}.name`);
}

function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : "pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number, lang: Lang): string {
  if (lang === "pl") {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return `${formatNumber(value, lang)} PLN`;
}

function formatRange(
  value: RangeValues,
  lang: Lang,
  currency: boolean
): PdfRangeCopy {
  const formatter = currency ? formatCurrency : formatNumber;
  return {
    low: formatter(value.low, lang),
    central: formatter(value.central, lang),
    high: formatter(value.high, lang),
  };
}

function formatIsoDate(value: string, lang: Lang): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) throw new Error(`Expected an ISO date, received ${value}`);
  const [, year, month, day] = match;
  const tx = researchExportV2T[lang];
  const monthName = (tx.months as Record<string, string>)[month];
  if (!monthName) throw new Error(`Invalid ISO month in ${value}`);
  return tx.date(Number(day), monthName, Number(year));
}

function axisValueLabel(axis: DecisionAxisRecord, lang: Lang): string {
  if (axis.id === "initiatedOn") return formatIsoDate(axis.value, lang);
  const label = (
    researchExportV2T[lang].axisValues as Record<string, string>
  )[axis.value];
  if (!label) throw new Error(`Missing ${lang} axis value label for ${axis.value}`);
  return label;
}

function comparisonSummary(record: DecisionRecordV2, lang: Lang): string {
  const tx = researchExportV2T[lang].sign;
  const { low, high } = record.comparison.deltaCostOuterEnvelope;
  if (low < 0 && high > 0) return tx.crossingZero;
  if (record.comparison.deltaCost > 0) {
    return tx.positive(formatCurrency(record.comparison.deltaCost, lang));
  }
  if (record.comparison.deltaCost < 0) {
    return tx.negative(formatCurrency(-record.comparison.deltaCost, lang));
  }
  return tx.zero;
}

function calibratedAssumption(
  id: string,
  label: string,
  value: CalibratedValue,
  lang: Lang,
  currency = true
): PdfAssumptionCopy {
  return {
    id,
    label,
    value: formatRange(value, lang, currency),
    evidenceStatus: (
      researchExportV2T[lang].evidenceClasses as Record<string, string>
    )[value.evidenceClass],
    evidenceIds: [...value.evidenceIds],
  };
}

export function pdfExportFilename(
  record: DecisionRecordV2,
  locale: Lang
): string {
  assertPdfRecord(record);
  return `procuracost-model-${MODEL_V2_METADATA.modelVersion}-${record.metadata.scenarioId}-${locale}.pdf`;
}

export function buildPdfCopy(
  record: DecisionRecordV2,
  locale: Lang,
  exportedAt: string
): PdfCopyV2 {
  assertPdfRecord(record);
  assertIsoTimestamp(exportedAt);
  const tx = researchExportV2T[locale];
  const pdfTx = pdfExportV2T[locale];
  const assumptions = record.assumptions;

  const alternativeCopies = ALTERNATIVE_IDS.map((alternativeId) => {
    const alternative = record.alternatives[alternativeId];
    return {
      id: alternativeId,
      label: tx.alternatives[alternativeId],
      workflowDesign: {
        label: tx.fields.workflowDesign,
        value: alternative.designIds.workflowDesignId,
      },
      contractDesign: {
        label: tx.fields.contractDesign,
        value: alternative.designIds.contractDesignId,
      },
      workflowSteps: alternative.workflow.steps.map((step) => ({
        id: step.id,
        labelKey: step.labelKey,
        label: step.userLabel ?? lookupModelCopy(locale, step.labelKey),
        userLabel: step.userLabel,
        kind: step.kind,
        predecessors: [...step.predecessorIds],
        predecessorIds: [...step.predecessorIds],
        activeDays: formatRange(step.activeDays, locale, false),
        queueDays: formatRange(step.queueDays, locale, false),
        roleHours: Object.entries(step.roleHours).map(([roleId, hours]) => ({
          roleId,
          hours: formatRange(hours, locale, false),
        })),
        nonLabourCost: formatRange(step.nonLabourCost, locale, true),
        locked: step.lockedLegalProvenance !== null,
        lockedLegalProvenance: step.lockedLegalProvenance
          ? { ...step.lockedLegalProvenance }
          : null,
        criticalPathCases: [...step.criticalPathCases],
      })),
    } satisfies PdfAlternativeCopy;
  });

  const assumptionCopies: PdfAssumptionCopy[] = [
    calibratedAssumption(
      "contractValue",
      tx.assumptions.contractValue,
      assumptions.contractValue,
      locale
    ),
    calibratedAssumption(
      "dailyCostOfInaction",
      tx.assumptions.dailyCostOfInaction,
      assumptions.dailyCostOfInaction,
      locale
    ),
    {
      id: "pathCompetitionDiffers",
      label: tx.assumptions.pathCompetitionDiffers,
      value: assumptions.pathCompetitionDiffers ? tx.words.yes : tx.words.no,
      evidenceStatus: tx.words.notApplicable,
      evidenceIds: [],
    },
  ];
  if (assumptions.competitionTransferRate) {
    assumptionCopies.push(
      calibratedAssumption(
        "competitionTransferRate",
        tx.assumptions.competitionTransferRate,
        assumptions.competitionTransferRate,
        locale,
        false
      )
    );
  } else {
    assumptionCopies.push({
      id: "competitionTransferRate",
      label: tx.assumptions.competitionTransferRate,
      value: tx.words.notApplicable,
      evidenceStatus: tx.words.notApplicable,
      evidenceIds: [],
    });
  }
  assumptionCopies.push(
    calibratedAssumption(
      "amendmentDifferential",
      tx.assumptions.amendmentDifferential,
      assumptions.amendmentDifferential,
      locale
    ),
    calibratedAssumption(
      "tcoDifferential",
      tx.assumptions.tcoDifferential,
      assumptions.tcoDifferential,
      locale
    ),
    {
      id: assumptions.bypass.id,
      label: tx.assumptions.bypass,
      value: lookupModelCopy(locale, assumptions.bypass.reasonKey),
      evidenceStatus: tx.words.notMonetized,
      evidenceIds: [...assumptions.bypass.evidenceIds],
    }
  );

  const migration = record.metadata.migration;
  return {
    filename: pdfExportFilename(record, locale),
    locale,
    title: pdfTx.title,
    scenarioName: scenarioName(record, locale),
    exportedAt: formatIsoDate(exportedAt, locale),
    pageLabel: pdfTx.pageLabel,
    sectionLabels: pdfTx.sections,
    rendererLabels: structuredClone(pdfTx.renderer),
    metadata: [
      { label: tx.fields.schemaVersion, value: String(record.metadata.schemaVersion) },
      { label: tx.fields.modelVersion, value: record.metadata.modelVersion },
      { label: tx.fields.calibrationId, value: record.metadata.calibrationId },
      { label: tx.fields.legalRulesetId, value: record.metadata.legalRulesetId },
      { label: tx.fields.scenarioId, value: record.metadata.scenarioId },
      { label: tx.fields.currency, value: record.metadata.currency },
      { label: tx.fields.locale, value: locale },
      { label: pdfTx.exportedAt, value: formatIsoDate(exportedAt, locale) },
    ],
    context: record.axes.map((axis) => ({
      id: axis.id,
      label: tx.axes[axis.id],
      value: axisValueLabel(axis, locale),
    })),
    alternatives: alternativeCopies,
    results: ALTERNATIVE_IDS.map((alternativeId) => ({
      id: alternativeId,
      label: tx.alternatives[alternativeId],
      elapsedDays: formatRange(
        record.alternatives[alternativeId].result.elapsedDays,
        locale,
        false
      ),
      total: formatRange(
        record.alternatives[alternativeId].result.totalCost,
        locale,
        true
      ),
    })),
    comparisonSummary: comparisonSummary(record, locale),
    comparisonRange: {
      low: formatCurrency(record.comparison.deltaCostOuterEnvelope.low, locale),
      central: formatCurrency(record.comparison.deltaCost, locale),
      high: formatCurrency(record.comparison.deltaCostOuterEnvelope.high, locale),
    },
    drivers: record.drivers.map((driver) => ({
      id: driver.id,
      label: (tx.drivers as Record<string, string>)[driver.id],
      formalSequential: formatRange(driver.formalSequential, locale, true),
      adaptiveCompliant: formatRange(driver.adaptiveCompliant, locale, true),
      contribution: formatRange(driver.contribution, locale, true),
    })),
    coverage: record.coverage.map((entry) => ({
      id: entry.id,
      label: (tx.drivers as Record<string, string>)[entry.id],
      value: tx.words.included,
      status: entry.status,
      anchors: entry.anchors.map((anchor) => ({
        path: anchor.path,
        evidenceClass: anchor.evidenceClass,
        evidenceStatus: (
          tx.evidenceClasses as Record<string, string>
        )[anchor.evidenceClass],
        evidenceIds: [...anchor.evidenceIds],
      })),
    })),
    nonMonetizedDimensions: record.nonMonetizedDimensions.map((dimension) => {
      const entries = ALTERNATIVE_IDS.flatMap((alternativeId) => {
        const value = dimension.alternatives[alternativeId];
        return value ? [value] : [];
      });
      return {
        id: dimension.id,
        label: (tx.drivers as Record<string, string>)[dimension.id],
        status: tx.words.notMonetized,
        reasons: [...new Set(entries.map(({ reasonKey }) => lookupModelCopy(locale, reasonKey)))],
        evidenceIds: [...new Set(entries.flatMap(({ evidenceIds }) => evidenceIds))],
      };
    }),
    assumptions: assumptionCopies,
    roleHourlyRates: Object.entries(record.roleHourlyRates).map(
      ([roleId, rate]) => ({
        roleId,
        roleLabel:
          (pdfTx.renderer.roles as Record<string, string>)[roleId] ??
          pdfTx.renderer.roles.unknown,
        rate: formatRange(rate, locale, true),
        rangeKind: rate.rangeKind,
        evidenceClass: rate.evidenceClass,
        evidenceStatus: (
          tx.evidenceClasses as Record<string, string>
        )[rate.evidenceClass],
        evidenceIds: [...rate.evidenceIds],
      })
    ),
    calculationAnchors: record.calculationAnchors.map((anchor) => ({
      path: anchor.path,
      evidenceClass: anchor.evidenceClass,
      evidenceStatus: (
        tx.evidenceClasses as Record<string, string>
      )[anchor.evidenceClass],
      evidenceIds: [...anchor.evidenceIds],
    })),
    externalEvidence: record.externalEvidence.map((evidence) => ({
      id: evidence.id,
      type: tx.evidenceClasses[evidence.type],
      title: lookupModelCopy(locale, evidence.source.titleKey),
      supportedClaim: lookupModelCopy(locale, evidence.supportedClaimKey),
      unsupportedClaim: lookupModelCopy(locale, evidence.unsupportedClaimKey),
      population: lookupModelCopy(locale, evidence.jurisdictionOrPopulationKey),
      constructs: [...evidence.constructs],
      assumptionKeys: [...evidence.assumptionKeys],
      sourceUrl: evidence.sourceUrl,
    })),
    retainedAssumptions: record.retainedAssumptions.map((assumption) => ({
      id: assumption.id,
      label: lookupModelCopy(locale, assumption.labelKey),
      detail: lookupModelCopy(locale, assumption.detailKey),
      evidenceStatus: tx.evidenceClasses[assumption.evidenceClass],
      constructs: [...assumption.constructs],
      sourceUrl: assumption.sourceUrl,
    })),
    legalProvenance: record.legalProvenance.map((legal) => ({
      legalRulesetId: legal.legalRulesetId,
      ruleId: legal.ruleId,
      provision: legal.provision,
      initiatedOn: formatIsoDate(legal.initiatedOn, locale),
      lockedActiveDays: formatNumber(legal.lockedActiveDays, locale),
      lockedQueueDays: formatNumber(legal.lockedQueueDays, locale),
      occurrences: legal.occurrences.map(
        ({ alternativeId, stepId }) => `${tx.alternatives[alternativeId]}: ${stepId}`
      ),
    })),
    migration: [
      { label: tx.fields.status, value: tx.migration[migration.status] },
      {
        label: tx.fields.sourceSchemaVersion,
        value: migration.sourceSchemaVersion,
      },
      {
        label: tx.fields.confirmed,
        value: migration.confirmed ? tx.words.yes : tx.words.no,
      },
      {
        label: tx.fields.legacyScenarioId,
        value: migration.legacyScenarioId ?? tx.words.notApplicable,
      },
      {
        label: tx.fields.fieldsRequiringConfirmation,
        value:
          migration.fieldsRequiringConfirmation.join(", ") ||
          tx.words.notApplicable,
      },
    ],
    migrationAudit: migration.audit
      ? structuredClone(migration.audit)
      : null,
    postMigrationEdits: migration.postMigrationEdits.map((edit) => ({
      field: edit.field,
      materializedPaths: [...edit.materializedPaths],
      before: {
        range: formatRange(edit.before, locale, true),
        rangeKind: edit.before.rangeKind,
        evidenceClass: edit.before.evidenceClass,
        evidenceStatus: (
          tx.evidenceClasses as Record<string, string>
        )[edit.before.evidenceClass],
        evidenceIds: [...edit.before.evidenceIds],
      },
      after: {
        range: formatRange(edit.after, locale, true),
        rangeKind: edit.after.rangeKind,
        evidenceClass: edit.after.evidenceClass,
        evidenceStatus: (
          tx.evidenceClasses as Record<string, string>
        )[edit.after.evidenceClass],
        evidenceIds: [...edit.after.evidenceIds],
      },
      provenance: {
        sourceClass: edit.provenance.sourceClass,
        sourceClassLabel:
          pdfTx.renderer.migrationSourceClasses[edit.provenance.sourceClass],
        sourceSchemaVersion: edit.provenance.sourceSchemaVersion,
        legacyScenarioId: edit.provenance.legacyScenarioId,
        sourceField: edit.provenance.sourceField,
        originalDisposition: edit.provenance.originalDisposition,
        originalDispositionLabel:
          pdfTx.renderer.migrationDispositions[
            edit.provenance.originalDisposition
          ],
      },
    })),
  };
}
