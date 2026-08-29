import {
  buildCalculationInputFromDraft,
  type NativeCalculationInputGateV2,
} from "./calculation-input";
import {
  buildDecisionRecordV2,
  type DecisionRecordMigrationMetadata,
  type DecisionRecordV2,
} from "./decision-record";
import type { ComparisonCalculationInput } from "./engine";
import {
  createScenarioDraftFromLegacyMigration,
  validateLegacyMigrationDraftForCalculation,
  type LegacyMigrationCalculationGate,
} from "./legacy-migration-draft";
import type { ScenarioDraft } from "./scenarios";

export * from "./legacy-migration";
export * from "./legacy-migration-draft";

export type CalculationInputGateV2 =
  | NativeCalculationInputGateV2
  | LegacyMigrationCalculationGate;

export function buildCalculationInputFromLegacyMigration(
  draft: ScenarioDraft,
  gate: LegacyMigrationCalculationGate
): ComparisonCalculationInput {
  validateLegacyMigrationDraftForCalculation(draft, gate);
  return buildCalculationInputFromDraft(draft);
}

export function migrationMetadataFromLegacyCalculationGate(
  gate: LegacyMigrationCalculationGate,
  draft?: ScenarioDraft
): DecisionRecordMigrationMetadata {
  if (!gate || gate.kind !== "legacy_migration") {
    throw new Error("Legacy migration metadata requires a legacy gate");
  }
  const migration = gate.result;
  if (migration.status === "ambiguous") {
    throw new Error(
      "Ambiguous legacy migration cannot produce a decision record"
    );
  }
  if (migration.status === "partial" && gate.confirmed !== true) {
    throw new Error("Partial legacy migration requires explicit confirmation");
  }
  if (!gate.audit) {
    throw new Error("Legacy migration requires adapter-provided audit data");
  }

  const baseline = draft
    ? null
    : migration.status === "partial"
      ? createScenarioDraftFromLegacyMigration(migration, true)
      : createScenarioDraftFromLegacyMigration(migration);
  if (baseline && baseline.status !== "ready") {
    throw new Error("Legacy migration cannot produce record metadata");
  }

  const validated = validateLegacyMigrationDraftForCalculation(
    draft ?? baseline!.draft,
    gate
  );
  const validatedMigration = validated.adapted.gate.result;
  if (validatedMigration.status === "ambiguous") {
    throw new Error(
      "Ambiguous legacy migration cannot produce record metadata"
    );
  }
  return {
    sourceSchemaVersion: validated.adapted.audit.sourceSchemaVersion,
    status: validatedMigration.status,
    confirmed: true,
    legacyScenarioId: validated.adapted.audit.legacyScenarioId,
    fieldsRequiringConfirmation: [
      ...validatedMigration.fieldsRequiringConfirmation,
    ],
    audit: structuredClone(validated.adapted.audit),
    postMigrationEdits: structuredClone(validated.postMigrationEdits),
  };
}

export function buildDecisionRecordFromLegacyMigration(
  draft: ScenarioDraft,
  gate: LegacyMigrationCalculationGate
): DecisionRecordV2 {
  const migration = migrationMetadataFromLegacyCalculationGate(gate, draft);
  const nativeRecord = buildDecisionRecordV2(draft);
  return {
    ...nativeRecord,
    metadata: {
      ...nativeRecord.metadata,
      migration,
    },
  };
}
