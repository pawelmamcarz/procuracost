import {
  replicationPackageV2T,
  researchExportV2T,
  type Lang,
} from "../i18n";
import {
  buildDecisionRecordV2,
  type DecisionRecordMigrationMetadata,
  type DecisionRecordV2,
} from "./decision-record";
import { deepFreeze } from "./deep-freeze";
import { MODEL_V2_METADATA } from "./domain";
import {
  createScenarioDraft,
  SCENARIO_V2_IDS,
  type ScenarioV2Id,
} from "./scenarios";

const DELTA_OPERATION =
  "formalSequential_minus_adaptiveCompliant" as const;

export const REPLICATION_CSV_HEADERS = deepFreeze([
  "schema_version",
  "model_version",
  "calibration_id",
  "legal_ruleset_id",
  "scenario_id",
  "currency",
  "delta_operation",
  "delta_low",
  "delta_central",
  "delta_high",
  "axes_json",
  "alternatives_json",
  "coverage_json",
  "non_monetized_dimensions_json",
  "migration_json",
] as const);

export interface ReplicationBundleMetadataV2 {
  schemaVersion: typeof MODEL_V2_METADATA.schemaVersion;
  modelVersion: typeof MODEL_V2_METADATA.modelVersion;
  calibrationId: typeof MODEL_V2_METADATA.calibrationId;
  legalRulesetId: typeof MODEL_V2_METADATA.legalRulesetId;
  currency: "PLN";
  deltaOperation: typeof DELTA_OPERATION;
  rangeSemantics: "declared_ranges_not_confidence_intervals";
  evidenceBoundary: "deterministic_outputs_not_empirical_estimates";
  scenarioOrder: ScenarioV2Id[];
}

export interface ReplicationScenarioV2 {
  scenarioId: ScenarioV2Id;
  axes: DecisionRecordV2["axes"];
  alternatives: DecisionRecordV2["alternatives"];
  comparison: DecisionRecordV2["comparison"];
  coverage: DecisionRecordV2["coverage"];
  nonMonetizedDimensions: DecisionRecordV2["nonMonetizedDimensions"];
  assumptions: DecisionRecordV2["assumptions"];
  roleHourlyRates: DecisionRecordV2["roleHourlyRates"];
  calculationAnchors: DecisionRecordV2["calculationAnchors"];
  internalEvidence: DecisionRecordV2["internalEvidence"];
  externalEvidence: DecisionRecordV2["externalEvidence"];
  retainedAssumptions: DecisionRecordV2["retainedAssumptions"];
  legalProvenance: DecisionRecordV2["legalProvenance"];
  migration: DecisionRecordMigrationMetadata;
}

export interface ReplicationBundleV2 {
  metadata: ReplicationBundleMetadataV2;
  scenarios: ReplicationScenarioV2[];
}

export type ReplicationArtifactsV2 = Record<
  | "built-in-scenarios.json"
  | "built-in-scenarios.csv"
  | "built-in-scenarios.md",
  string
>;

function assertCanonicalRecord(
  record: DecisionRecordV2,
  expectedScenarioId: ScenarioV2Id
): void {
  if (!record || typeof record !== "object") {
    throw new Error(`Missing decision record for ${expectedScenarioId}`);
  }
  const { metadata, comparison } = record;
  if (
    metadata.schemaVersion !== MODEL_V2_METADATA.schemaVersion ||
    metadata.modelVersion !== MODEL_V2_METADATA.modelVersion ||
    metadata.calibrationId !== MODEL_V2_METADATA.calibrationId ||
    metadata.legalRulesetId !== MODEL_V2_METADATA.legalRulesetId ||
    metadata.scenarioId !== expectedScenarioId ||
    metadata.currency !== "PLN"
  ) {
    throw new Error(
      `Decision record metadata does not match canonical scenario ${expectedScenarioId}`
    );
  }
  if (comparison.operation !== DELTA_OPERATION) {
    throw new Error(`Unexpected delta operation for ${expectedScenarioId}`);
  }
  if (metadata.migration.confirmed !== true) {
    throw new Error(`Unconfirmed migration for ${expectedScenarioId}`);
  }
}

export function buildCanonicalDecisionRecords(): DecisionRecordV2[] {
  return deepFreeze(
    SCENARIO_V2_IDS.map((scenarioId) =>
      buildDecisionRecordV2(createScenarioDraft(scenarioId))
    )
  );
}

export function buildReplicationBundle(
  records: readonly DecisionRecordV2[]
): ReplicationBundleV2 {
  if (records.length !== SCENARIO_V2_IDS.length) {
    throw new Error(
      `Replication bundle requires ${SCENARIO_V2_IDS.length} canonical decision records`
    );
  }

  const scenarios = records.map((record, index): ReplicationScenarioV2 => {
    const scenarioId = SCENARIO_V2_IDS[index];
    assertCanonicalRecord(record, scenarioId);
    return {
      scenarioId,
      axes: structuredClone(record.axes),
      alternatives: structuredClone(record.alternatives),
      comparison: structuredClone(record.comparison),
      coverage: structuredClone(record.coverage),
      nonMonetizedDimensions: structuredClone(record.nonMonetizedDimensions),
      assumptions: structuredClone(record.assumptions),
      roleHourlyRates: structuredClone(record.roleHourlyRates),
      calculationAnchors: structuredClone(record.calculationAnchors),
      internalEvidence: structuredClone(record.internalEvidence),
      externalEvidence: structuredClone(record.externalEvidence),
      retainedAssumptions: structuredClone(record.retainedAssumptions),
      legalProvenance: structuredClone(record.legalProvenance),
      migration: structuredClone(record.metadata.migration),
    };
  });

  return deepFreeze({
    metadata: {
      schemaVersion: MODEL_V2_METADATA.schemaVersion,
      modelVersion: MODEL_V2_METADATA.modelVersion,
      calibrationId: MODEL_V2_METADATA.calibrationId,
      legalRulesetId: MODEL_V2_METADATA.legalRulesetId,
      currency: "PLN",
      deltaOperation: DELTA_OPERATION,
      rangeSemantics: "declared_ranges_not_confidence_intervals",
      evidenceBoundary: "deterministic_outputs_not_empirical_estimates",
      scenarioOrder: [...SCENARIO_V2_IDS],
    },
    scenarios,
  });
}

export function renderReplicationJson(bundle: ReplicationBundleV2): string {
  return `${JSON.stringify(bundle, null, 2)}\n`;
}

type CsvValue = string | number | boolean | null | undefined;

function escapeCsvCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (!/[,"\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function renderCsvRow(values: readonly CsvValue[]): string {
  return values.map(escapeCsvCell).join(",");
}

export function renderReplicationCsv(bundle: ReplicationBundleV2): string {
  const rows = [
    renderCsvRow(REPLICATION_CSV_HEADERS),
    ...bundle.scenarios.map((scenario) =>
      renderCsvRow([
        bundle.metadata.schemaVersion,
        bundle.metadata.modelVersion,
        bundle.metadata.calibrationId,
        bundle.metadata.legalRulesetId,
        scenario.scenarioId,
        bundle.metadata.currency,
        scenario.comparison.operation,
        scenario.comparison.deltaCostOuterEnvelope.low,
        scenario.comparison.deltaCost,
        scenario.comparison.deltaCostOuterEnvelope.high,
        JSON.stringify(scenario.axes),
        JSON.stringify(scenario.alternatives),
        JSON.stringify(scenario.coverage),
        JSON.stringify(scenario.nonMonetizedDimensions),
        JSON.stringify(scenario.migration),
      ])
    ),
  ];
  return `${rows.join("\r\n")}\r\n`;
}

function formatNumber(value: number, lang: Lang): string {
  const fixed = value.toFixed(2);
  return lang === "pl" ? fixed.replace(".", ",") : fixed;
}

function migrationLabel(
  migration: DecisionRecordMigrationMetadata,
  lang: Lang
): string {
  return researchExportV2T[lang].migration[migration.status];
}

function coverageLines(
  scenario: ReplicationScenarioV2,
  none: string
): string[] {
  if (scenario.coverage.length === 0) return [`- ${none}`];
  return scenario.coverage.map((entry) => {
    const paths = entry.anchors.map(({ path }) => `\`${path}\``).join(", ");
    return `- \`${entry.id}\`: ${paths || none}`;
  });
}

function nonMonetizedLines(
  scenario: ReplicationScenarioV2,
  none: string
): string[] {
  if (scenario.nonMonetizedDimensions.length === 0) return [`- ${none}`];
  return scenario.nonMonetizedDimensions.map(
    ({ id }) => `- \`${id}\``
  );
}

function legalProvenanceLines(
  scenario: ReplicationScenarioV2,
  none: string
): string[] {
  if (scenario.legalProvenance.length === 0) return [`- ${none}`];
  return scenario.legalProvenance.map((entry) => {
    const occurrences = entry.occurrences
      .map(({ alternativeId, stepId }) => `\`${alternativeId}/${stepId}\``)
      .join(", ");
    return `- \`${entry.ruleId}\` (${entry.provision}): ${occurrences}`;
  });
}

export function renderReplicationMarkdown(
  bundle: ReplicationBundleV2,
  lang: Lang = "en"
): string {
  const tx = replicationPackageV2T[lang];
  const exportTx = researchExportV2T[lang];
  const lines = [
    `# ${tx.title}`,
    "",
    tx.rangeNote,
    "",
    tx.evidenceNote,
    "",
    `- ${exportTx.fields.schemaVersion}: \`${bundle.metadata.schemaVersion}\``,
    `- ${exportTx.fields.modelVersion}: \`${bundle.metadata.modelVersion}\``,
    `- ${exportTx.fields.calibrationId}: \`${bundle.metadata.calibrationId}\``,
    `- ${exportTx.fields.legalRulesetId}: \`${bundle.metadata.legalRulesetId}\``,
    `- ${exportTx.fields.currency}: \`${bundle.metadata.currency}\``,
  ];

  for (const scenario of bundle.scenarios) {
    const range = scenario.comparison.deltaCostOuterEnvelope;
    lines.push(
      "",
      `## \`${scenario.scenarioId}\``,
      "",
      `### ${tx.sections.comparison}`,
      "",
      `- ${tx.fields.deltaOperation}: \`${scenario.comparison.operation}\``,
      `- ${tx.fields.centralDifference}: ${formatNumber(
        scenario.comparison.deltaCost,
        lang
      )} ${bundle.metadata.currency}`,
      `- ${tx.fields.outerEnvelope}: ${formatNumber(
        range.low,
        lang
      )} / ${formatNumber(range.high, lang)} ${bundle.metadata.currency}`,
      "",
      `### ${tx.sections.coverageAnchors}`,
      "",
      ...coverageLines(scenario, tx.none),
      "",
      `### ${tx.sections.nonMonetizedDimensions}`,
      "",
      ...nonMonetizedLines(scenario, tx.none),
      "",
      `### ${tx.sections.migrationStatus}`,
      "",
      `- ${migrationLabel(scenario.migration, lang)}`,
      "",
      `### ${tx.sections.legalProvenance}`,
      "",
      ...legalProvenanceLines(scenario, tx.none)
    );
  }

  return `${lines.join("\n")}\n`;
}

export function buildReplicationArtifacts(): ReplicationArtifactsV2 {
  const bundle = buildReplicationBundle(buildCanonicalDecisionRecords());
  return deepFreeze({
    "built-in-scenarios.json": renderReplicationJson(bundle),
    "built-in-scenarios.csv": renderReplicationCsv(bundle),
    "built-in-scenarios.md": renderReplicationMarkdown(bundle, "en"),
  });
}
