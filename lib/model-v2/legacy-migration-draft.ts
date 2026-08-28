import type { ProcurementInputs } from "../calculations";
import { SCENARIOS as LEGACY_SCENARIOS } from "../scenarios";
import type { CalibratedValue } from "./calibrated-value";
import type { CalculationInputGateV2 } from "./calculation-input";
import type {
  AmbiguousLegacyMigration,
  ExactLegacyMigration,
  LegacyConfirmationField,
  LegacyMigrationResult,
  PartialLegacyMigration,
} from "./legacy-migration";
import { createScenarioDraft, type ScenarioDraft } from "./scenarios";

const STAKEHOLDER_ROLES = [
  "requestor",
  "buyer",
  "lawyer",
  "finance",
  "manager",
  "executive",
] as const;

type StakeholderRole = (typeof STAKEHOLDER_ROLES)[number];

export type LegacyRetainedInputField =
  | "processType"
  | "techLevel"
  | "contractValue"
  | "tcoHorizonYears"
  | "contractDurationYears"
  | "dailyCostOfInaction"
  | "renegotiationCost"
  | "bypassAuditExposure"
  | "discountRatePct"
  | "spendType"
  | "processPhase"
  | "customSteps"
  | `stakeholders.${StakeholderRole}.${"count" | "dailyRate"}`;

export type LegacyMigrationFieldDispositionKind =
  | "materialised"
  | "retained_only"
  | "blocked";

export type LegacyMigrationAuditValue =
  | string
  | number
  | null
  | NonNullable<ProcurementInputs["customSteps"]>;

export interface LegacyMigrationFieldProvenance {
  sourceClass: "legacy_migration_input";
  sourceSchemaVersion: "legacy-v1";
  legacyScenarioId: string;
  sourceField: `retainedLegacyInputs.${LegacyRetainedInputField}`;
}

export interface LegacyMigrationFieldDisposition {
  field: LegacyRetainedInputField;
  disposition: LegacyMigrationFieldDispositionKind;
  changedFromLegacyScenario: boolean;
  retainedValue: LegacyMigrationAuditValue;
  materializedPaths: string[];
  provenance: LegacyMigrationFieldProvenance;
}

export interface LegacyMigrationAudit {
  sourceClass: "legacy_migration_input";
  sourceSchemaVersion: "legacy-v1";
  legacyScenarioId: string;
  retainedLegacyInputs: ProcurementInputs;
  fieldDispositions: LegacyMigrationFieldDisposition[];
}

export type LegacyMigrationDraftIssueCode =
  | "confirmation_required"
  | "ambiguous_migration"
  | "unrepresentable_changed_field";

export type LegacyMigrationDraftIssue =
  | {
      code: "confirmation_required";
      field: LegacyConfirmationField;
      retainedValue: LegacyMigrationAuditValue;
      messageKey: "validation.legacyConfirmationRequired";
    }
  | {
      code: "ambiguous_migration";
      field: string;
      retainedValue: string | null;
      messageKey: string;
    }
  | {
      code: "unrepresentable_changed_field";
      field: `retainedLegacyInputs.${LegacyRetainedInputField}`;
      retainedValue: LegacyMigrationAuditValue;
      messageKey: "validation.legacyUnrepresentableChangedField";
    };

export type LegacyMigrationCalculationGate = Extract<
  CalculationInputGateV2,
  { kind: "legacy_migration" }
> & { audit: LegacyMigrationAudit };

export interface LegacyMigrationDraftReady {
  status: "ready";
  draft: ScenarioDraft;
  gate: LegacyMigrationCalculationGate;
  audit: LegacyMigrationAudit;
  issues: [];
}

export interface LegacyMigrationDraftBlocked {
  status: "blocked";
  draft: null;
  gate: null;
  audit: LegacyMigrationAudit | null;
  issues: LegacyMigrationDraftIssue[];
}

export type LegacyMigrationDraftResult =
  | LegacyMigrationDraftReady
  | LegacyMigrationDraftBlocked;

const TOP_LEVEL_FIELDS = [
  "processType",
  "techLevel",
  "contractValue",
  "tcoHorizonYears",
  "contractDurationYears",
  "dailyCostOfInaction",
  "renegotiationCost",
  "bypassAuditExposure",
  "discountRatePct",
  "spendType",
  "processPhase",
  "customSteps",
] as const satisfies readonly LegacyRetainedInputField[];

const RETAINED_INPUT_FIELDS: readonly LegacyRetainedInputField[] = [
  ...TOP_LEVEL_FIELDS,
  ...STAKEHOLDER_ROLES.flatMap((role) => [
    `stakeholders.${role}.count` as const,
    `stakeholders.${role}.dailyRate` as const,
  ]),
];

function auditValue(
  inputs: ProcurementInputs,
  field: LegacyRetainedInputField
): LegacyMigrationAuditValue {
  if (field.startsWith("stakeholders.")) {
    const [, role, property] = field.split(".") as [
      "stakeholders",
      StakeholderRole,
      "count" | "dailyRate",
    ];
    return inputs.stakeholders[role][property];
  }
  const value = inputs[field as keyof ProcurementInputs];
  return value === undefined
    ? null
    : structuredClone(value) as LegacyMigrationAuditValue;
}

function valuesEqual(
  left: LegacyMigrationAuditValue,
  right: LegacyMigrationAuditValue
): boolean {
  if (typeof left !== "object" || typeof right !== "object") {
    return Object.is(left, right);
  }
  return JSON.stringify(left) === JSON.stringify(right);
}

function materializedPaths(field: LegacyRetainedInputField): string[] {
  if (field === "contractValue") {
    return ["economicAssumptions.contractValue"];
  }
  if (field === "dailyCostOfInaction") {
    return ["economicAssumptions.dailyCostOfInaction", "dailyCostOfInaction"];
  }
  const match = /^stakeholders\.([^.]+)\.dailyRate$/.exec(field);
  return match ? [`roleHourlyRates.${match[1]}`] : [];
}

function legacyScenarioInputs(alias: string): ProcurementInputs | null {
  const scenario = LEGACY_SCENARIOS.find(({ id }) => id === alias);
  return scenario ? structuredClone(scenario.inputs) : null;
}

function buildAudit(
  legacyScenarioId: string,
  retainedLegacyInputs: ProcurementInputs,
  partial: boolean
): LegacyMigrationAudit | null {
  const baseline = legacyScenarioInputs(legacyScenarioId);
  if (!baseline) return null;

  const fieldDispositions = RETAINED_INPUT_FIELDS.map(
    (field): LegacyMigrationFieldDisposition => {
      const retainedValue = auditValue(retainedLegacyInputs, field);
      const changedFromLegacyScenario = !valuesEqual(
        retainedValue,
        auditValue(baseline, field)
      );
      const paths = partial ? materializedPaths(field) : [];
      const disposition: LegacyMigrationFieldDispositionKind = partial
        ? paths.length > 0
          ? "materialised"
          : changedFromLegacyScenario
            ? "blocked"
            : "retained_only"
        : "retained_only";
      return {
        field,
        disposition,
        changedFromLegacyScenario,
        retainedValue,
        materializedPaths: paths,
        provenance: {
          sourceClass: "legacy_migration_input",
          sourceSchemaVersion: "legacy-v1",
          legacyScenarioId,
          sourceField: `retainedLegacyInputs.${field}`,
        },
      };
    }
  );

  return {
    sourceClass: "legacy_migration_input",
    sourceSchemaVersion: "legacy-v1",
    legacyScenarioId,
    retainedLegacyInputs: structuredClone(retainedLegacyInputs),
    fieldDispositions,
  };
}

function fixedLegacyValue(
  value: number,
  legacyScenarioId: string,
  field: LegacyRetainedInputField
): CalibratedValue {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed",
    evidenceClass: "user_input",
    evidenceIds: [
      `legacy-v1.${legacyScenarioId}.retainedLegacyInputs.${field}`,
    ],
  };
}

function materializePartialDraft(
  migration: PartialLegacyMigration,
  audit: LegacyMigrationAudit
): ScenarioDraft {
  const draft = createScenarioDraft(migration.draftState.scenarioId);
  const retained = audit.retainedLegacyInputs;
  draft.economicAssumptions.contractValue = fixedLegacyValue(
    retained.contractValue,
    audit.legacyScenarioId,
    "contractValue"
  );
  const dailyCostOfInaction = fixedLegacyValue(
    retained.dailyCostOfInaction,
    audit.legacyScenarioId,
    "dailyCostOfInaction"
  );
  draft.economicAssumptions.dailyCostOfInaction = structuredClone(
    dailyCostOfInaction
  );
  draft.dailyCostOfInaction = structuredClone(dailyCostOfInaction);
  for (const role of STAKEHOLDER_ROLES) {
    draft.roleHourlyRates[role] = fixedLegacyValue(
      retained.stakeholders[role].dailyRate / 8,
      audit.legacyScenarioId,
      `stakeholders.${role}.dailyRate`
    );
  }
  return draft;
}

function confirmationIssues(
  migration: PartialLegacyMigration
): LegacyMigrationDraftIssue[] {
  return migration.fieldsRequiringConfirmation.map((field) => ({
    code: "confirmation_required",
    field,
    retainedValue: retainedValueForConfirmationField(
      migration.draftState.retainedLegacyInputs,
      field
    ),
    messageKey: "validation.legacyConfirmationRequired",
  }));
}

function retainedValueForConfirmationField(
  inputs: ProcurementInputs,
  field: LegacyConfirmationField
): LegacyMigrationAuditValue {
  const prefix = "retainedLegacyInputs.";
  if (!field.startsWith(prefix)) return null;
  const retainedField = field.slice(prefix.length) as LegacyRetainedInputField;
  return RETAINED_INPUT_FIELDS.includes(retainedField)
    ? auditValue(inputs, retainedField)
    : null;
}

function ambiguousIssues(
  migration: AmbiguousLegacyMigration
): LegacyMigrationDraftIssue[] {
  return migration.validationErrors.map((issue) => ({
    code: "ambiguous_migration",
    field: issue.field,
    retainedValue: issue.value,
    messageKey: issue.messageKey,
  }));
}

function blockedFieldIssues(
  audit: LegacyMigrationAudit
): LegacyMigrationDraftIssue[] {
  return audit.fieldDispositions
    .filter(({ disposition }) => disposition === "blocked")
    .map(({ provenance, retainedValue }) => ({
      code: "unrepresentable_changed_field",
      field: provenance.sourceField,
      retainedValue: structuredClone(retainedValue),
      messageKey: "validation.legacyUnrepresentableChangedField",
    }));
}

function blockedResult(
  issues: LegacyMigrationDraftIssue[],
  audit: LegacyMigrationAudit | null
): LegacyMigrationDraftBlocked {
  return {
    status: "blocked",
    draft: null,
    gate: null,
    audit: audit ? structuredClone(audit) : null,
    issues: structuredClone(issues),
  };
}

function readyResult(
  migration: ExactLegacyMigration | PartialLegacyMigration,
  draft: ScenarioDraft,
  audit: LegacyMigrationAudit,
  confirmed?: true
): LegacyMigrationDraftReady {
  const result = structuredClone(migration);
  const gateAudit = structuredClone(audit);
  return {
    status: "ready",
    draft: structuredClone(draft),
    gate: {
      kind: "legacy_migration",
      result,
      ...(confirmed ? { confirmed } : {}),
      audit: gateAudit,
    },
    audit: structuredClone(audit),
    issues: [],
  };
}

export function createScenarioDraftFromLegacyMigration(
  migration: ExactLegacyMigration
): LegacyMigrationDraftReady;
export function createScenarioDraftFromLegacyMigration(
  migration: PartialLegacyMigration,
  confirmed?: boolean
): LegacyMigrationDraftResult;
export function createScenarioDraftFromLegacyMigration(
  migration: AmbiguousLegacyMigration,
  confirmed?: boolean
): LegacyMigrationDraftBlocked;
export function createScenarioDraftFromLegacyMigration(
  migration: LegacyMigrationResult,
  confirmed?: boolean
): LegacyMigrationDraftResult;
export function createScenarioDraftFromLegacyMigration(
  migration: LegacyMigrationResult,
  confirmed = false
): LegacyMigrationDraftResult {
  if (migration.status === "ambiguous") {
    return blockedResult(ambiguousIssues(migration), null);
  }

  const retainedLegacyInputs = migration.status === "partial"
    ? migration.draftState.retainedLegacyInputs
    : legacyScenarioInputs(migration.legacyScenarioId ?? "");
  if (!migration.legacyScenarioId || !retainedLegacyInputs) {
    return blockedResult(
      [{
        code: "ambiguous_migration",
        field: "sid",
        retainedValue: migration.legacyScenarioId,
        messageKey: "validation.legacyUnknownScenario",
      }],
      null
    );
  }

  const audit = buildAudit(
    migration.legacyScenarioId,
    retainedLegacyInputs,
    migration.status === "partial"
  );
  if (!audit) {
    return blockedResult(
      [{
        code: "ambiguous_migration",
        field: "sid",
        retainedValue: migration.legacyScenarioId,
        messageKey: "validation.legacyUnknownScenario",
      }],
      null
    );
  }

  if (migration.status === "exact") {
    return readyResult(
      migration,
      createScenarioDraft(migration.state.scenarioId),
      audit
    );
  }
  if (!confirmed) {
    return blockedResult(confirmationIssues(migration), audit);
  }

  const issues = blockedFieldIssues(audit);
  if (issues.length > 0) return blockedResult(issues, audit);
  return readyResult(
    migration,
    materializePartialDraft(migration, audit),
    audit,
    true
  );
}
