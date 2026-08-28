import {
  modelV2T,
  researchExportV2T,
  type Lang,
} from "./i18n";
import type { CalibratedValue, RangeValues } from "./model-v2/calibrated-value";
import type {
  DecisionAxisRecord,
  DecisionRecordMigrationMetadata,
  DecisionRecordV2,
  MonetaryDriverRecord,
} from "./model-v2/decision-record";
import { MODEL_V2_METADATA, type AlternativeId } from "./model-v2/domain";
import type { ScenarioV2Id } from "./model-v2/scenarios";

export interface ResearchJsonV2 {
  metadata: {
    schemaVersion: DecisionRecordV2["metadata"]["schemaVersion"];
    modelVersion: DecisionRecordV2["metadata"]["modelVersion"];
    calibrationId: DecisionRecordV2["metadata"]["calibrationId"];
    legalRulesetId: DecisionRecordV2["metadata"]["legalRulesetId"];
    scenarioId: ScenarioV2Id;
    currency: DecisionRecordV2["metadata"]["currency"];
    locale: Lang;
    exportedAt: string;
  };
  context: { axes: DecisionRecordV2["axes"] };
  alternatives: DecisionRecordV2["alternatives"];
  results: {
    comparison: DecisionRecordV2["comparison"];
    drivers: DecisionRecordV2["drivers"];
    coverage: DecisionRecordV2["coverage"];
    nonMonetizedDimensions: DecisionRecordV2["nonMonetizedDimensions"];
  };
  assumptions: DecisionRecordV2["assumptions"];
  evidence: {
    calculationAnchors: DecisionRecordV2["calculationAnchors"];
    externalEvidence: DecisionRecordV2["externalEvidence"];
    retainedAssumptions: DecisionRecordV2["retainedAssumptions"];
  };
  legalProvenance: DecisionRecordV2["legalProvenance"];
  migration: DecisionRecordMigrationMetadata;
}

export const RESEARCH_CSV_HEADERS = [
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
] as const;

type CsvHeader = (typeof RESEARCH_CSV_HEADERS)[number];
type CsvRow = Record<CsvHeader, string | number | boolean | null | undefined>;

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

function assertExportableRecord(record: DecisionRecordV2): void {
  if (!record || typeof record !== "object") {
    throw new Error("A model 2.3 decision record is required");
  }
  const metadata = record.metadata;
  if (
    metadata.schemaVersion !== MODEL_V2_METADATA.schemaVersion ||
    metadata.modelVersion !== MODEL_V2_METADATA.modelVersion ||
    metadata.calibrationId !== MODEL_V2_METADATA.calibrationId ||
    metadata.legalRulesetId !== MODEL_V2_METADATA.legalRulesetId
  ) {
    throw new Error("Decision record metadata does not match model 2.3");
  }
  const migration = metadata.migration as DecisionRecordMigrationMetadata & {
    confirmed?: boolean;
    status?: string;
  };
  if (
    migration.confirmed !== true ||
    !["native", "exact", "partial"].includes(migration.status ?? "")
  ) {
    throw new Error("Unconfirmed migration cannot be exported");
  }
}

function assertExplicitIsoTimestamp(exportedAt: string): void {
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
  const values = researchExportV2T[lang].axisValues as Record<string, string>;
  const label = values[axis.value];
  if (!label) throw new Error(`Missing ${lang} axis value label for ${axis.value}`);
  return label;
}

function rangeText(range: RangeValues, lang: Lang, currency = true): string {
  const formatter = currency ? formatCurrency : formatNumber;
  return `${formatter(range.low, lang)} / ${formatter(
    range.central,
    lang
  )} / ${formatter(range.high, lang)}`;
}

function comparisonSignCopy(record: DecisionRecordV2, lang: Lang): string {
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

function markdownCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

function csvEscape(value: CsvRow[CsvHeader]): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[,"\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function emptyCsvRow(locale: Lang): CsvRow {
  return Object.fromEntries(
    RESEARCH_CSV_HEADERS.map((header) => [header, header === "locale" ? locale : ""])
  ) as CsvRow;
}

function csvRow(locale: Lang, values: Partial<CsvRow>): CsvRow {
  return { ...emptyCsvRow(locale), ...values };
}

function rangeCsvRows(
  locale: Lang,
  section: string,
  recordId: string,
  fieldId: string,
  range: RangeValues,
  values: Partial<CsvRow> = {}
): CsvRow {
  return csvRow(locale, {
    section,
    record_id: recordId,
    field_id: fieldId,
    low: range.low,
    central: range.central,
    high: range.high,
    ...values,
  });
}

function calibratedCsvRow(
  locale: Lang,
  section: string,
  recordId: string,
  fieldId: string,
  value: CalibratedValue,
  localizedLabel: string,
  values: Partial<CsvRow> = {}
): CsvRow {
  return rangeCsvRows(locale, section, recordId, fieldId, value, {
    status: value.rangeKind,
    evidence_class: value.evidenceClass,
    evidence_ids: value.evidenceIds.join(";"),
    localized_label: localizedLabel,
    ...values,
  });
}

function driverCsvRows(
  locale: Lang,
  section: "driver" | "coverage",
  entry: MonetaryDriverRecord,
  status = ""
): CsvRow[] {
  const label = (
    researchExportV2T[locale].drivers as Record<string, string>
  )[entry.id];
  return [
    rangeCsvRows(locale, section, entry.id, "cost", entry.formalSequential, {
      alternative_id: "formalSequential",
      status,
      localized_label: label,
    }),
    rangeCsvRows(locale, section, entry.id, "cost", entry.adaptiveCompliant, {
      alternative_id: "adaptiveCompliant",
      status,
      localized_label: label,
    }),
    rangeCsvRows(locale, section, entry.id, "contribution", entry.contribution, {
      status,
      localized_label: label,
    }),
  ];
}

export function buildResearchJson(
  record: DecisionRecordV2,
  locale: Lang,
  exportedAt: string
): ResearchJsonV2 {
  assertExportableRecord(record);
  assertExplicitIsoTimestamp(exportedAt);
  return structuredClone({
    metadata: {
      schemaVersion: record.metadata.schemaVersion,
      modelVersion: record.metadata.modelVersion,
      calibrationId: record.metadata.calibrationId,
      legalRulesetId: record.metadata.legalRulesetId,
      scenarioId: record.metadata.scenarioId,
      currency: record.metadata.currency,
      locale,
      exportedAt,
    },
    context: { axes: record.axes },
    alternatives: record.alternatives,
    results: {
      comparison: record.comparison,
      drivers: record.drivers,
      coverage: record.coverage,
      nonMonetizedDimensions: record.nonMonetizedDimensions,
    },
    assumptions: record.assumptions,
    evidence: {
      calculationAnchors: record.calculationAnchors,
      externalEvidence: record.externalEvidence,
      retainedAssumptions: record.retainedAssumptions,
    },
    legalProvenance: record.legalProvenance,
    migration: record.metadata.migration,
  });
}

export function researchExportBaseName(
  scenarioId: ScenarioV2Id,
  locale: Lang
): string {
  return `procuracost-model-${MODEL_V2_METADATA.modelVersion}-${scenarioId}-${locale}`;
}

export function buildResearchCsv(
  record: DecisionRecordV2,
  locale: Lang
): string {
  assertExportableRecord(record);
  const tx = researchExportV2T[locale];
  const rows: CsvRow[] = [];
  const metadataValues: Array<[string, string | number, string]> = [
    ["schemaVersion", record.metadata.schemaVersion, tx.fields.schemaVersion],
    ["modelVersion", record.metadata.modelVersion, tx.fields.modelVersion],
    ["calibrationId", record.metadata.calibrationId, tx.fields.calibrationId],
    ["legalRulesetId", record.metadata.legalRulesetId, tx.fields.legalRulesetId],
    ["scenarioId", record.metadata.scenarioId, scenarioName(record, locale)],
    ["currency", record.metadata.currency, tx.fields.currency],
    ["locale", locale, tx.fields.locale],
  ];
  for (const [fieldId, value, label] of metadataValues) {
    rows.push(
      csvRow(locale, {
        section: "metadata",
        record_id: "decision_record",
        field_id: fieldId,
        value,
        localized_label: label,
      })
    );
  }

  for (const axis of record.axes) {
    rows.push(
      csvRow(locale, {
        section: "context",
        record_id: axis.id,
        field_id: axis.id,
        value: axis.value,
        localized_label: `${tx.axes[axis.id]}: ${axisValueLabel(axis, locale)}`,
      })
    );
  }

  for (const alternativeId of ALTERNATIVE_IDS) {
    const alternative = record.alternatives[alternativeId];
    rows.push(
      csvRow(locale, {
        section: "alternative",
        record_id: alternativeId,
        alternative_id: alternativeId,
        field_id: "workflowDesignId",
        value: alternative.designIds.workflowDesignId,
        localized_label: tx.fields.workflowDesign,
      }),
      csvRow(locale, {
        section: "alternative",
        record_id: alternativeId,
        alternative_id: alternativeId,
        field_id: "contractDesignId",
        value: alternative.designIds.contractDesignId,
        localized_label: tx.fields.contractDesign,
      })
    );
    const resultRanges: Array<[string, RangeValues, string]> = [
      ["elapsedDays", alternative.result.elapsedDays, tx.fields.elapsedDays],
      ["roleCost", alternative.result.roleCost, tx.fields.roleCost],
      ["nonLabourCost", alternative.result.nonLabourCost, tx.fields.nonLabourCost],
      ["delayCost", alternative.result.delayCost, tx.fields.delayCost],
      ["contractCost", alternative.result.contractCost, tx.fields.contractCost],
      ["totalCost", alternative.result.totalCost, tx.fields.totalCost],
    ];
    for (const [fieldId, range, label] of resultRanges) {
      rows.push(
        rangeCsvRows(locale, "alternative_result", alternativeId, fieldId, range, {
          alternative_id: alternativeId,
          localized_label: label,
        })
      );
    }
    for (const step of alternative.workflow.steps) {
      const stepLabel = step.userLabel ?? lookupModelCopy(locale, step.labelKey);
      rows.push(
        csvRow(locale, {
          section: "workflow_step",
          record_id: step.id,
          alternative_id: alternativeId,
          field_id: "predecessorIds",
          value: step.predecessorIds.join(";"),
          status: step.kind,
          label_key: step.labelKey,
          localized_label: tx.fields.predecessorIds,
        }),
        csvRow(locale, {
          section: "workflow_step",
          record_id: step.id,
          alternative_id: alternativeId,
          field_id: "criticalPathCases",
          value: step.criticalPathCases.join(";"),
          status: step.kind,
          label_key: step.labelKey,
          localized_label: tx.fields.criticalPathCases,
        }),
        calibratedCsvRow(
          locale,
          "workflow_step",
          step.id,
          "activeDays",
          step.activeDays,
          stepLabel,
          {
            alternative_id: alternativeId,
            status: step.kind,
            label_key: step.labelKey,
          }
        ),
        calibratedCsvRow(
          locale,
          "workflow_step",
          step.id,
          "queueDays",
          step.queueDays,
          stepLabel,
          {
            alternative_id: alternativeId,
            status: step.kind,
            label_key: step.labelKey,
          }
        ),
        calibratedCsvRow(
          locale,
          "workflow_step",
          step.id,
          "nonLabourCost",
          step.nonLabourCost,
          stepLabel,
          {
            alternative_id: alternativeId,
            status: step.kind,
            label_key: step.labelKey,
          }
        )
      );
      for (const [roleId, roleHours] of Object.entries(step.roleHours)) {
        rows.push(
          calibratedCsvRow(
            locale,
            "workflow_role_hours",
            step.id,
            roleId,
            roleHours,
            stepLabel,
            {
              alternative_id: alternativeId,
              status: step.kind,
              label_key: step.labelKey,
            }
          )
        );
      }
    }
  }

  rows.push(
    csvRow(locale, {
      section: "comparison",
      record_id: "formalSequential_minus_adaptiveCompliant",
      field_id: "deltaCost",
      value: record.comparison.deltaCost,
      localized_label: tx.fields.deltaCost,
    }),
    rangeCsvRows(
      locale,
      "comparison",
      "formalSequential_minus_adaptiveCompliant",
      "deltaCostOuterEnvelope",
      {
        low: record.comparison.deltaCostOuterEnvelope.low,
        central: record.comparison.deltaCost,
        high: record.comparison.deltaCostOuterEnvelope.high,
      },
      { localized_label: tx.fields.outerEnvelope }
    )
  );
  for (const entry of record.drivers) {
    rows.push(...driverCsvRows(locale, "driver", entry));
  }
  for (const entry of record.coverage) {
    rows.push(...driverCsvRows(locale, "coverage", entry, entry.status));
  }
  for (const dimension of record.nonMonetizedDimensions) {
    for (const alternativeId of ALTERNATIVE_IDS) {
      const entry = dimension.alternatives[alternativeId];
      if (!entry) continue;
      rows.push(
        csvRow(locale, {
          section: "non_monetized_dimension",
          record_id: dimension.id,
          alternative_id: alternativeId,
          field_id: dimension.id,
          status: "notMonetized",
          evidence_ids: entry.evidenceIds.join(";"),
          label_key: entry.reasonKey,
          localized_label: lookupModelCopy(locale, entry.reasonKey),
        })
      );
    }
  }

  const assumptions = record.assumptions;
  const calibratedAssumptions: Array<[string, CalibratedValue]> = [
    ["contractValue", assumptions.contractValue],
    ["dailyCostOfInaction", assumptions.dailyCostOfInaction],
    ["amendmentDifferential", assumptions.amendmentDifferential],
    ["tcoDifferential", assumptions.tcoDifferential],
  ];
  if (assumptions.competitionTransferRate) {
    calibratedAssumptions.splice(2, 0, [
      "competitionTransferRate",
      assumptions.competitionTransferRate,
    ]);
  } else {
    rows.push(
      csvRow(locale, {
        section: "assumption",
        record_id: "competitionTransferRate",
        field_id: "competitionTransferRate",
        status: "notApplicable",
        localized_label: tx.assumptions.competitionTransferRate,
      })
    );
  }
  for (const [fieldId, value] of calibratedAssumptions) {
    rows.push(
      calibratedCsvRow(
        locale,
        "assumption",
        fieldId,
        fieldId,
        value,
        (tx.assumptions as Record<string, string>)[fieldId]
      )
    );
  }
  rows.push(
    csvRow(locale, {
      section: "assumption",
      record_id: "pathCompetitionDiffers",
      field_id: "pathCompetitionDiffers",
      value: assumptions.pathCompetitionDiffers,
      localized_label: tx.assumptions.pathCompetitionDiffers,
    }),
    csvRow(locale, {
      section: "assumption",
      record_id: "informal_bypass",
      field_id: assumptions.bypass.id,
      status: assumptions.bypass.status,
      evidence_ids: assumptions.bypass.evidenceIds.join(";"),
      label_key: assumptions.bypass.reasonKey,
      localized_label: lookupModelCopy(locale, assumptions.bypass.reasonKey),
    })
  );

  for (const anchor of record.calculationAnchors) {
    rows.push(
      csvRow(locale, {
        section: "calculation_anchor",
        record_id: anchor.path,
        field_id: anchor.path,
        evidence_class: anchor.evidenceClass,
        evidence_ids: anchor.evidenceIds.join(";"),
        localized_label: (
          tx.evidenceClasses as Record<string, string>
        )[anchor.evidenceClass],
      })
    );
  }
  for (const evidence of record.externalEvidence) {
    rows.push(
      csvRow(locale, {
        section: "external_evidence",
        record_id: evidence.id,
        field_id: "sourceTitle",
        value: lookupModelCopy(locale, evidence.source.titleKey),
        status: evidence.type,
        evidence_class: evidence.type,
        source_url: evidence.sourceUrl,
        label_key: evidence.source.titleKey,
        localized_label: lookupModelCopy(locale, evidence.source.titleKey),
      }),
      csvRow(locale, {
        section: "external_evidence",
        record_id: evidence.id,
        field_id: "supportedClaim",
        value: lookupModelCopy(locale, evidence.supportedClaimKey),
        status: evidence.type,
        evidence_class: evidence.type,
        source_url: evidence.sourceUrl,
        label_key: evidence.supportedClaimKey,
        localized_label: tx.fields.supportedClaim,
      }),
      csvRow(locale, {
        section: "external_evidence",
        record_id: evidence.id,
        field_id: "unsupportedClaim",
        value: lookupModelCopy(locale, evidence.unsupportedClaimKey),
        status: evidence.type,
        evidence_class: evidence.type,
        source_url: evidence.sourceUrl,
        label_key: evidence.unsupportedClaimKey,
        localized_label: tx.fields.unsupportedClaim,
      }),
      csvRow(locale, {
        section: "external_evidence",
        record_id: evidence.id,
        field_id: "jurisdictionOrPopulation",
        value: lookupModelCopy(locale, evidence.jurisdictionOrPopulationKey),
        status: evidence.type,
        evidence_class: evidence.type,
        source_url: evidence.sourceUrl,
        label_key: evidence.jurisdictionOrPopulationKey,
        localized_label: tx.fields.population,
      }),
      csvRow(locale, {
        section: "external_evidence",
        record_id: evidence.id,
        field_id: "constructs",
        value: evidence.constructs.join(";"),
        status: evidence.type,
        evidence_class: evidence.type,
        source_url: evidence.sourceUrl,
        localized_label: tx.fields.constructs,
      }),
      csvRow(locale, {
        section: "external_evidence",
        record_id: evidence.id,
        field_id: "assumptionKeys",
        value: evidence.assumptionKeys.join(";"),
        status: evidence.type,
        evidence_class: evidence.type,
        source_url: evidence.sourceUrl,
        localized_label: tx.sections.assumptions,
      })
    );
  }
  for (const assumption of record.retainedAssumptions) {
    rows.push(
      csvRow(locale, {
        section: "retained_assumption",
        record_id: assumption.id,
        field_id: assumption.evidenceClass,
        value: lookupModelCopy(locale, assumption.detailKey),
        evidence_class: assumption.evidenceClass,
        source_url: assumption.sourceUrl,
        label_key: assumption.labelKey,
        localized_label: lookupModelCopy(locale, assumption.labelKey),
      }),
      csvRow(locale, {
        section: "retained_assumption",
        record_id: assumption.id,
        field_id: "constructs",
        value: assumption.constructs.join(";"),
        evidence_class: assumption.evidenceClass,
        source_url: assumption.sourceUrl,
        localized_label: tx.fields.constructs,
      })
    );
  }
  for (const legal of record.legalProvenance) {
    const legalValues: Array<[string, string | number, string]> = [
      ["legalRulesetId", legal.legalRulesetId, tx.fields.legalRulesetId],
      ["provision", legal.provision, tx.fields.provision],
      ["initiatedOn", legal.initiatedOn, tx.axes.initiatedOn],
      ["lockedActiveDays", legal.lockedActiveDays, tx.fields.activeDays],
      ["lockedQueueDays", legal.lockedQueueDays, tx.fields.queueDays],
      [
        "occurrences",
        legal.occurrences
          .map(({ alternativeId, stepId }) => `${alternativeId}:${stepId}`)
          .join(";"),
        tx.fields.occurrences,
      ],
    ];
    for (const [fieldId, value, label] of legalValues) {
      rows.push(
        csvRow(locale, {
          section: "legal_provenance",
          record_id: legal.ruleId,
          field_id: fieldId,
          value,
          status: "locked",
          evidence_class: "legal_rule",
          localized_label: label,
        })
      );
    }
  }
  const migration = record.metadata.migration;
  const migrationValues: Array<[string, string | boolean]> = [
    ["sourceSchemaVersion", migration.sourceSchemaVersion],
    ["status", migration.status],
    ["confirmed", migration.confirmed],
    ["legacyScenarioId", migration.legacyScenarioId ?? ""],
    ["fieldsRequiringConfirmation", migration.fieldsRequiringConfirmation.join(";")],
  ];
  for (const [fieldId, value] of migrationValues) {
    rows.push(
      csvRow(locale, {
        section: "migration",
        record_id: "migration",
        field_id: fieldId,
        value,
        localized_label:
          fieldId === "status"
            ? tx.migration[migration.status]
            : (tx.fields as Record<string, string>)[fieldId] ?? fieldId,
      })
    );
  }

  return `${[
    RESEARCH_CSV_HEADERS.join(","),
    ...rows.map((row) =>
      RESEARCH_CSV_HEADERS.map((header) => csvEscape(row[header])).join(",")
    ),
  ].join("\r\n")}\r\n`;
}

function markdownRangeRow(
  label: string,
  range: RangeValues,
  lang: Lang,
  currency = true
): string {
  return `| ${markdownCell(label)} | ${rangeText(range, lang, currency)} |`;
}

export function buildResearchMarkdown(
  record: DecisionRecordV2,
  locale: Lang
): string {
  assertExportableRecord(record);
  const tx = researchExportV2T[locale];
  const lines: string[] = [
    `# ${tx.title}`,
    "",
    `## ${tx.sections.metadata}`,
    "",
    `- **${tx.fields.schemaVersion}:** ${record.metadata.schemaVersion}`,
    `- **${tx.fields.modelVersion}:** ${record.metadata.modelVersion}`,
    `- **${tx.fields.calibrationId}:** \`${record.metadata.calibrationId}\``,
    `- **${tx.fields.legalRulesetId}:** \`${record.metadata.legalRulesetId}\``,
    `- **${tx.fields.scenario}:** ${scenarioName(record, locale)} (\`${record.metadata.scenarioId}\`)`,
    `- **${tx.fields.currency}:** ${record.metadata.currency}`,
    "",
    `## ${tx.sections.context}`,
    "",
    `| ${tx.fields.field} | ${tx.fields.value} |`,
    "|---|---|",
    ...record.axes.map(
      (axis) =>
        `| ${tx.axes[axis.id]} | ${markdownCell(axisValueLabel(axis, locale))} |`
    ),
    "",
    `## ${tx.sections.designs}`,
    "",
    `| ${tx.fields.alternative} | ${tx.fields.workflowDesign} | ${tx.fields.contractDesign} |`,
    "|---|---|---|",
    ...ALTERNATIVE_IDS.map((alternativeId) => {
      const alternative = record.alternatives[alternativeId];
      return `| ${tx.alternatives[alternativeId]} | \`${alternative.designIds.workflowDesignId}\` | \`${alternative.designIds.contractDesignId}\` |`;
    }),
    "",
    `### ${tx.sections.workflowSteps}`,
    "",
    ...ALTERNATIVE_IDS.flatMap((alternativeId) => [
      `**${tx.alternatives[alternativeId]}**`,
      "",
      `| ${tx.fields.field} | ${tx.fields.value} | ${tx.fields.stepKind} | ${tx.fields.predecessorIds} | ${tx.fields.criticalPathCases} |`,
      "|---|---|---|---|---|",
      ...record.alternatives[alternativeId].workflow.steps.map((step) => {
        const label = step.userLabel ?? lookupModelCopy(locale, step.labelKey);
        const predecessorIds = step.predecessorIds.length
          ? step.predecessorIds.map((id) => `\`${markdownCell(id)}\``).join("; ")
          : tx.words.notApplicable;
        const criticalPathCases = step.criticalPathCases.length
          ? step.criticalPathCases.join("; ")
          : tx.words.notApplicable;
        return `| ${markdownCell(label)} | \`${markdownCell(step.id)}\` | ${step.kind} | ${predecessorIds} | ${criticalPathCases} |`;
      }),
      "",
    ]),
    `## ${tx.sections.results}`,
    "",
    comparisonSignCopy(record, locale),
    "",
    `| ${tx.fields.alternative} | ${tx.range.low} | ${tx.range.central} | ${tx.range.high} |`,
    "|---|---:|---:|---:|",
    ...ALTERNATIVE_IDS.map((alternativeId) => {
      const total = record.alternatives[alternativeId].result.totalCost;
      return `| ${tx.alternatives[alternativeId]} | ${formatCurrency(
        total.low,
        locale
      )} | ${formatCurrency(total.central, locale)} | ${formatCurrency(
        total.high,
        locale
      )} |`;
    }),
    `| ${tx.fields.deltaCost} | ${formatCurrency(
      record.comparison.deltaCostOuterEnvelope.low,
      locale
    )} | ${formatCurrency(record.comparison.deltaCost, locale)} | ${formatCurrency(
      record.comparison.deltaCostOuterEnvelope.high,
      locale
    )} |`,
    "",
    `## ${tx.sections.drivers}`,
    "",
    `| ${tx.fields.driver} | ${tx.alternatives.formalSequential} | ${tx.alternatives.adaptiveCompliant} | ${tx.fields.deltaCost} |`,
    "|---|---:|---:|---:|",
    ...record.drivers.map((driver) => {
      const label = (tx.drivers as Record<string, string>)[driver.id];
      return `| ${label} | ${formatCurrency(
        driver.formalSequential.central,
        locale
      )} | ${formatCurrency(
        driver.adaptiveCompliant.central,
        locale
      )} | ${formatCurrency(driver.contribution.central, locale)} |`;
    }),
    "",
    `## ${tx.sections.coverage}`,
    "",
    ...record.coverage.map(
      (entry) =>
        `- ${(tx.drivers as Record<string, string>)[entry.id]}: ${tx.words.included}`
    ),
    "",
    `## ${tx.sections.nonMonetized}`,
    "",
    ...record.nonMonetizedDimensions.map((dimension) => {
      const reasons = ALTERNATIVE_IDS.map((alternativeId) => {
        const entry = dimension.alternatives[alternativeId];
        return entry ? lookupModelCopy(locale, entry.reasonKey) : tx.words.notApplicable;
      });
      return `- ${(tx.drivers as Record<string, string>)[dimension.id]}: ${tx.words.notMonetized}. ${reasons.join(" ")}`;
    }),
    "",
    `## ${tx.sections.assumptions}`,
    "",
    `| ${tx.fields.assumption} | ${tx.range.low} / ${tx.range.central} / ${tx.range.high} | ${tx.fields.evidenceStatus} |`,
    "|---|---|---|",
    markdownRangeRow(
      tx.assumptions.contractValue,
      record.assumptions.contractValue,
      locale
    ).replace(
      / \|$/,
      ` | ${tx.evidenceClasses[record.assumptions.contractValue.evidenceClass]} |`
    ),
    markdownRangeRow(
      tx.assumptions.dailyCostOfInaction,
      record.assumptions.dailyCostOfInaction,
      locale
    ).replace(
      / \|$/,
      ` | ${tx.evidenceClasses[record.assumptions.dailyCostOfInaction.evidenceClass]} |`
    ),
    `| ${tx.assumptions.pathCompetitionDiffers} | ${
      record.assumptions.pathCompetitionDiffers ? tx.words.yes : tx.words.no
    } | ${tx.words.notApplicable} |`,
    ...(record.assumptions.competitionTransferRate
      ? [
          markdownRangeRow(
            tx.assumptions.competitionTransferRate,
            record.assumptions.competitionTransferRate,
            locale,
            false
          ).replace(
            / \|$/,
            ` | ${
              tx.evidenceClasses[
                record.assumptions.competitionTransferRate.evidenceClass
              ]
            } |`
          ),
        ]
      : [
          `| ${tx.assumptions.competitionTransferRate} | ${tx.words.notApplicable} | ${tx.words.notApplicable} |`,
        ]),
    markdownRangeRow(
      tx.assumptions.amendmentDifferential,
      record.assumptions.amendmentDifferential,
      locale
    ).replace(
      / \|$/,
      ` | ${
        tx.evidenceClasses[record.assumptions.amendmentDifferential.evidenceClass]
      } |`
    ),
    markdownRangeRow(
      tx.assumptions.tcoDifferential,
      record.assumptions.tcoDifferential,
      locale
    ).replace(
      / \|$/,
      ` | ${tx.evidenceClasses[record.assumptions.tcoDifferential.evidenceClass]} |`
    ),
    `| ${tx.assumptions.bypass} | ${tx.words.notMonetized} | ${lookupModelCopy(
      locale,
      record.assumptions.bypass.reasonKey
    )} |`,
    "",
    `## ${tx.sections.calculationAnchors}`,
    "",
    `| ${tx.fields.path} | ${tx.fields.evidenceStatus} | ${tx.fields.evidenceIds} |`,
    "|---|---|---|",
    ...record.calculationAnchors.map(
      (anchor) =>
        `| \`${anchor.path}\` | ${tx.evidenceClasses[anchor.evidenceClass]} | ${
          anchor.evidenceIds.map((id) => `\`${id}\``).join(", ") ||
          tx.words.noEvidenceIds
        } |`
    ),
    "",
    `## ${tx.sections.externalEvidence}`,
    "",
    ...record.externalEvidence.flatMap((evidence) => [
      `### ${lookupModelCopy(locale, evidence.source.titleKey)}`,
      "",
      `- **${tx.fields.evidenceStatus}:** ${
        tx.evidenceClasses[evidence.type]
      } (\`${evidence.id}\`)`,
      `- **${tx.fields.supportedClaim}:** ${lookupModelCopy(
        locale,
        evidence.supportedClaimKey
      )}`,
      `- **${tx.fields.unsupportedClaim}:** ${lookupModelCopy(
        locale,
        evidence.unsupportedClaimKey
      )}`,
      `- **${tx.fields.population}:** ${lookupModelCopy(
        locale,
        evidence.jurisdictionOrPopulationKey
      )}`,
      `- **${tx.fields.constructs}:** ${evidence.constructs.join(", ")}`,
      `- **${tx.fields.source}:** ${evidence.sourceUrl}`,
      "",
    ]),
    `## ${tx.sections.retainedAssumptions}`,
    "",
    ...record.retainedAssumptions.map(
      (assumption) =>
        `- **${lookupModelCopy(locale, assumption.labelKey)}** (\`${
          assumption.id
        }\`): ${lookupModelCopy(locale, assumption.detailKey)} ${assumption.sourceUrl}`
    ),
    "",
    `## ${tx.sections.legalProvenance}`,
    "",
    ...record.legalProvenance.map(
      (legal) =>
        `- **${legal.provision}** (\`${legal.ruleId}\`, \`${
          legal.legalRulesetId
        }\`, ${formatIsoDate(legal.initiatedOn, locale)}): ${
          tx.fields.activeDays
        } ${formatNumber(legal.lockedActiveDays, locale)}, ${tx.fields.queueDays} ${formatNumber(
          legal.lockedQueueDays,
          locale
        )}. ${legal.occurrences
          .map(
            ({ alternativeId, stepId }) =>
              `${tx.alternatives[alternativeId]} (\`${stepId}\`)`
          )
          .join(", ")}`
    ),
    "",
    `## ${tx.sections.migration}`,
    "",
    `- **${tx.fields.status}:** ${tx.migration[record.metadata.migration.status]}`,
    `- **${tx.fields.sourceSchemaVersion}:** ${record.metadata.migration.sourceSchemaVersion}`,
    `- **${tx.fields.confirmed}:** ${
      record.metadata.migration.confirmed ? tx.words.yes : tx.words.no
    }`,
    `- **${tx.fields.legacyScenarioId}:** ${
      record.metadata.migration.legacyScenarioId ?? tx.words.notApplicable
    }`,
    `- **${tx.fields.fieldsRequiringConfirmation}:** ${
      record.metadata.migration.fieldsRequiringConfirmation.join(", ") ||
      tx.words.notApplicable
    }`,
    "",
  ];
  return lines.join("\n");
}

// Browser-side transport helpers retained for the current 2.2.2 components.

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function isoDateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}
