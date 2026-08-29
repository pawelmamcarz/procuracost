import type { ProcurementInputs } from "../calculations";
import { SCENARIOS as LEGACY_SCENARIOS } from "../scenarios";
import {
  assertValidCalibratedValue,
  type CalibratedValue,
} from "./calibrated-value";
import { stateForScenarioV2 } from "./calculator-url";
import {
  migrateLegacyCalculatorParams,
  type AmbiguousLegacyMigration,
  type ExactLegacyMigration,
  type LegacyConfirmationField,
  type LegacyMigrationResult,
  type PartialLegacyMigration,
} from "./legacy-migration";
import { createScenarioDraft, type ScenarioDraft } from "./scenarios";

export const LEGACY_MATERIALIZED_ROLE_IDS = [
  "requestor",
  "buyer",
  "lawyer",
  "finance",
  "manager",
  "executive",
] as const;

export type LegacyMaterializedRoleId =
  (typeof LEGACY_MATERIALIZED_ROLE_IDS)[number];

type StakeholderRole = LegacyMaterializedRoleId;

export type LegacyMaterializedInputField =
  | "contractValue"
  | "dailyCostOfInaction"
  | `stakeholders.${LegacyMaterializedRoleId}.dailyRate`;

export type LegacyMaterializedPath =
  | "economicAssumptions.contractValue"
  | "economicAssumptions.dailyCostOfInaction"
  | "dailyCostOfInaction"
  | `roleHourlyRates.${LegacyMaterializedRoleId}`;

export interface PostMigrationEditProvenance {
  sourceClass: "post_migration_user_edit";
  sourceSchemaVersion: "legacy-v1";
  legacyScenarioId: string;
  sourceField: `retainedLegacyInputs.${LegacyMaterializedInputField}`;
  originalDisposition: "materialised";
}

export interface PostMigrationEditRecord {
  field: LegacyMaterializedInputField;
  materializedPaths: LegacyMaterializedPath[];
  before: CalibratedValue;
  after: CalibratedValue;
  provenance: PostMigrationEditProvenance;
}

export interface ValidatedLegacyMigrationDraft {
  adapted: LegacyMigrationDraftReady;
  postMigrationEdits: PostMigrationEditRecord[];
}

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

export interface LegacyMigrationCalculationGate {
  kind: "legacy_migration";
  result: LegacyMigrationResult;
  confirmed?: boolean;
  audit: LegacyMigrationAudit;
}

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
  ...LEGACY_MATERIALIZED_ROLE_IDS.flatMap((role) => [
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
  for (const role of LEGACY_MATERIALIZED_ROLE_IDS) {
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
      ...(confirmed === true ? { confirmed } : {}),
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
  if (confirmed !== true) {
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

const LEGACY_MATERIALIZED_FIELDS = [
  {
    field: "contractValue",
    materializedPaths: ["economicAssumptions.contractValue"],
  },
  {
    field: "dailyCostOfInaction",
    materializedPaths: [
      "economicAssumptions.dailyCostOfInaction",
      "dailyCostOfInaction",
    ],
  },
  ...LEGACY_MATERIALIZED_ROLE_IDS.map((role) => ({
    field: `stakeholders.${role}.dailyRate` as const,
    materializedPaths: [`roleHourlyRates.${role}` as const],
  })),
] as const satisfies readonly {
  field: LegacyMaterializedInputField;
  materializedPaths: readonly LegacyMaterializedPath[];
}[];

const CALIBRATED_VALUE_KEYS = [
  "low",
  "central",
  "high",
  "rangeKind",
  "evidenceClass",
  "evidenceIds",
] as const;

const V2_CALCULATOR_STATE_KEYS = [
  "schemaVersion",
  "modelVersion",
  "calibrationId",
  "scenarioId",
  "governanceBoundaryId",
  "procedureFamilyId",
  "purchaseArchetypeId",
  "executionChannelId",
  "systemSupportId",
  "workflowDesignFormalId",
  "workflowDesignAdaptiveId",
  "contractDesignFormalId",
  "contractDesignAdaptiveId",
] as const;

const LEGACY_CONFIRMATION_FIELDS = new Set<string>([
  "scenarioId",
  "governanceBoundaryId",
  "procedureFamilyId",
  "purchaseArchetypeId",
  "executionChannelId",
  "systemSupportId",
  "workflowDesignFormalId",
  "workflowDesignAdaptiveId",
  "contractDesignFormalId",
  "contractDesignAdaptiveId",
  "retainedProcessMap.formalSequential",
  "retainedProcessMap.adaptiveCompliant",
  "retainedRoleEffort.formalSequential",
  "retainedRoleEffort.adaptiveCompliant",
  "retainedNonLabourCost.formalSequential",
  "retainedNonLabourCost.adaptiveCompliant",
  "retainedLegacyInputs.contractValue",
  "retainedLegacyInputs.tcoHorizonYears",
  "retainedLegacyInputs.contractDurationYears",
  "retainedLegacyInputs.dailyCostOfInaction",
  "retainedLegacyInputs.renegotiationCost",
  "retainedLegacyInputs.bypassAuditExposure",
  "retainedLegacyInputs.discountRatePct",
  "retainedLegacyInputs.spendType",
  "retainedLegacyInputs.processPhase",
  ...LEGACY_MATERIALIZED_ROLE_IDS.flatMap((role) => [
    `retainedLegacyInputs.stakeholders.${role}.count`,
    `retainedLegacyInputs.stakeholders.${role}.dailyRate`,
  ]),
  "workflowDesign",
  "contractDesign",
  "economicAssumptions",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertExactKeys(
  value: unknown,
  keys: readonly string[],
  label: string
): asserts value is Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${label} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (
    actual.length !== expected.length ||
    actual.some((key, index) => key !== expected[index])
  ) {
    throw new Error(`${label} does not have the canonical shape`);
  }
}

function assertNoPostMigrationEditInput(
  value: unknown,
  seen = new WeakSet<object>()
): void {
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) {
    throw new Error("Legacy migration gate must be acyclic");
  }
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry) => assertNoPostMigrationEditInput(entry, seen));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === "postMigrationEdits") {
      throw new Error(
        "Legacy migration postMigrationEdits are model-derived and cannot be supplied"
      );
    }
    assertNoPostMigrationEditInput(child, seen);
  }
}

function valuesDeeplyEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (
    !left ||
    !right ||
    typeof left !== "object" ||
    typeof right !== "object"
  ) {
    return false;
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((entry, index) => valuesDeeplyEqual(entry, right[index]))
    );
  }
  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key) =>
        Object.hasOwn(rightRecord, key) &&
        valuesDeeplyEqual(leftRecord[key], rightRecord[key])
    )
  );
}

function assertCanonicalCalculatorState(
  value: unknown,
  label: string,
  includesRetainedLegacyInputs: boolean
): void {
  assertExactKeys(
    value,
    includesRetainedLegacyInputs
      ? [...V2_CALCULATOR_STATE_KEYS, "retainedLegacyInputs"]
      : V2_CALCULATOR_STATE_KEYS,
    label
  );
  const state = Object.fromEntries(
    V2_CALCULATOR_STATE_KEYS.map((key) => [key, value[key]])
  );
  if (typeof state.scenarioId !== "string") {
    throw new Error(`${label} scenario must be a string`);
  }
  let canonicalState: ReturnType<typeof stateForScenarioV2>;
  try {
    canonicalState = stateForScenarioV2(
      state.scenarioId as Parameters<typeof stateForScenarioV2>[0]
    );
  } catch {
    throw new Error(`${label} does not identify a canonical scenario`);
  }
  if (!valuesDeeplyEqual(state, canonicalState)) {
    throw new Error(`${label} does not match the canonical scenario state`);
  }
}

function assertCanonicalPartialValidation(
  fields: unknown,
  validationErrors: unknown
): void {
  if (
    !Array.isArray(fields) ||
    fields.length === 0 ||
    !fields.every(
      (field) =>
        typeof field === "string" && LEGACY_CONFIRMATION_FIELDS.has(field)
    ) ||
    new Set(fields).size !== fields.length
  ) {
    throw new Error(
      "Partial legacy migration confirmation fields violate canonical invariants"
    );
  }
  if (!Array.isArray(validationErrors) || validationErrors.length === 0) {
    throw new Error(
      "Partial legacy migration validation errors violate canonical invariants"
    );
  }
  for (const error of validationErrors) {
    assertExactKeys(
      error,
      ["code", "field", "value", "messageKey"],
      "Partial legacy migration validation error"
    );
    if (
      error.code !== "confirmation_required" ||
      typeof error.field !== "string" ||
      (error.value !== null && typeof error.value !== "string") ||
      error.messageKey !== "validation.legacyConfirmationRequired"
    ) {
      throw new Error(
        "Partial legacy migration validation error violates canonical invariants"
      );
    }
  }
}

function retainedParamValue(
  result: ExactLegacyMigration | PartialLegacyMigration,
  confirmationField: string,
  fallback: unknown
): string | null {
  const sourceError = result.validationErrors.find(
    ({ field }) => field === confirmationField
  );
  if (sourceError?.value === null) return null;
  if (sourceError?.value !== undefined) return sourceError.value;
  return fallback === undefined ? null : String(fallback);
}

function reconstructedLegacyParams(
  result: ExactLegacyMigration | PartialLegacyMigration
): URLSearchParams {
  const params = new URLSearchParams();
  if (result.legacyScenarioId) {
    params.set("sid", result.legacyScenarioId);
  }
  const retained = result.status === "partial"
    ? result.draftState.retainedLegacyInputs
    : LEGACY_SCENARIOS.find(({ id }) => id === result.legacyScenarioId)?.inputs;
  if (!retained) return params;

  const setRetained = (
    key: string,
    confirmationField: string,
    fallback: unknown
  ): void => {
    const value = retainedParamValue(result, confirmationField, fallback);
    if (value !== null) params.set(key, value);
  };

  setRetained("pt", "governanceBoundaryId", retained.processType);
  setRetained("tl", "systemSupportId", retained.techLevel);
  for (const [key, confirmationField, inputField] of [
    ["cv", "retainedLegacyInputs.contractValue", "contractValue"],
    ["tco", "retainedLegacyInputs.tcoHorizonYears", "tcoHorizonYears"],
    ["dur", "retainedLegacyInputs.contractDurationYears", "contractDurationYears"],
    ["dci", "retainedLegacyInputs.dailyCostOfInaction", "dailyCostOfInaction"],
    ["rc", "retainedLegacyInputs.renegotiationCost", "renegotiationCost"],
    ["bae", "retainedLegacyInputs.bypassAuditExposure", "bypassAuditExposure"],
    ["dr", "retainedLegacyInputs.discountRatePct", "discountRatePct"],
  ] as const) {
    setRetained(key, confirmationField, retained[inputField]);
  }
  const stakeholderMissing = result.validationErrors.some(
    ({ field, value }) =>
      field === "retainedLegacyInputs.stakeholders.requestor.count" &&
      value === null
  );
  if (!stakeholderMissing) {
    params.set(
      "sh",
      LEGACY_MATERIALIZED_ROLE_IDS.map(
        (role) =>
          `${retained.stakeholders[role].count}:${retained.stakeholders[role].dailyRate}`
      ).join(",")
    );
  }
  if (retained.spendType) params.set("st", retained.spendType);
  if (retained.processPhase) params.set("pp", retained.processPhase);
  return params;
}

function assertAuthenticLegacyMigrationResult(
  result: ExactLegacyMigration | PartialLegacyMigration
): void {
  const canonicalResult = migrateLegacyCalculatorParams(
    reconstructedLegacyParams(result)
  );
  if (!valuesDeeplyEqual(result, canonicalResult)) {
    throw new Error(
      "Legacy migration result does not match the authentic migrator output"
    );
  }
}

function assertCanonicalLegacyResultValues(
  result: LegacyMigrationCalculationGate["result"]
): void {
  if (
    result.sourceSchemaVersion !== "legacy-v1" ||
    result.readinessInferred !== false
  ) {
    throw new Error("Legacy migration result violates canonical invariants");
  }
  if (result.status === "exact") {
    if (
      result.canCalculate !== true ||
      !Array.isArray(result.fieldsRequiringConfirmation) ||
      result.fieldsRequiringConfirmation.length !== 0 ||
      !Array.isArray(result.validationErrors) ||
      result.validationErrors.length !== 0
    ) {
      throw new Error("Exact legacy migration result violates canonical invariants");
    }
    assertCanonicalCalculatorState(
      result.state,
      "Exact legacy migration state",
      false
    );
    assertAuthenticLegacyMigrationResult(result);
    return;
  }
  if (result.status !== "partial" || result.canCalculate !== false) {
    throw new Error("Partial legacy migration result violates canonical invariants");
  }
  assertCanonicalPartialValidation(
    result.fieldsRequiringConfirmation,
    result.validationErrors
  );
  assertCanonicalCalculatorState(
    result.draftState,
    "Partial legacy migration draft state",
    true
  );
  assertAuthenticLegacyMigrationResult(result);
}

function assertCanonicalLegacyGateShape(
  gate: LegacyMigrationCalculationGate
): void {
  assertNoPostMigrationEditInput(gate);
  if (!isRecord(gate.result)) {
    throw new Error("Legacy migration result must be an object");
  }
  const status = gate.result.status;
  if (status === "ambiguous") {
    throw new Error("Ambiguous legacy migration cannot be calculated");
  }
  if (status !== "exact" && status !== "partial") {
    throw new Error("Legacy migration result has an unsupported status");
  }
  assertExactKeys(
    gate,
    status === "partial"
      ? ["kind", "result", "confirmed", "audit"]
      : ["kind", "result", "audit"],
    "Legacy migration gate"
  );
  assertExactKeys(
    gate.result,
    [
      "status",
      "sourceSchemaVersion",
      "legacyScenarioId",
      "readinessInferred",
      "fieldsRequiringConfirmation",
      "validationErrors",
      "canCalculate",
      status === "partial" ? "draftState" : "state",
    ],
    "Legacy migration result"
  );
  assertExactKeys(
    gate.audit,
    [
      "sourceClass",
      "sourceSchemaVersion",
      "legacyScenarioId",
      "retainedLegacyInputs",
      "fieldDispositions",
    ],
    "Legacy migration audit"
  );
  assertCanonicalLegacyResultValues(gate.result);
}

function materializedDraftValue(
  draft: ScenarioDraft,
  field: LegacyMaterializedInputField
): unknown {
  switch (field) {
    case "contractValue":
      return draft.economicAssumptions.contractValue;
    case "dailyCostOfInaction":
      return draft.economicAssumptions.dailyCostOfInaction;
    case "stakeholders.requestor.dailyRate":
      return draft.roleHourlyRates.requestor;
    case "stakeholders.buyer.dailyRate":
      return draft.roleHourlyRates.buyer;
    case "stakeholders.lawyer.dailyRate":
      return draft.roleHourlyRates.lawyer;
    case "stakeholders.finance.dailyRate":
      return draft.roleHourlyRates.finance;
    case "stakeholders.manager.dailyRate":
      return draft.roleHourlyRates.manager;
    case "stakeholders.executive.dailyRate":
      return draft.roleHourlyRates.executive;
  }
}

function cloneCalibratedValue(value: CalibratedValue): CalibratedValue {
  return {
    low: value.low,
    central: value.central,
    high: value.high,
    rangeKind: value.rangeKind,
    evidenceClass: value.evidenceClass,
    evidenceIds: [...value.evidenceIds],
  };
}

function validatedMaterializedValue(
  value: unknown,
  field: LegacyMaterializedInputField
): CalibratedValue {
  if (!isRecord(value)) {
    throw new Error(`Missing materialised legacy value ${field}`);
  }
  assertExactKeys(value, CALIBRATED_VALUE_KEYS, `${field} calibrated value`);
  const candidate = value as unknown as CalibratedValue;
  if (
    typeof candidate.low !== "number" ||
    typeof candidate.central !== "number" ||
    typeof candidate.high !== "number" ||
    typeof candidate.rangeKind !== "string" ||
    typeof candidate.evidenceClass !== "string" ||
    !Array.isArray(candidate.evidenceIds) ||
    !candidate.evidenceIds.every((id) => typeof id === "string")
  ) {
    throw new Error(`Invalid calibrated range for ${field}`);
  }
  if (!(["fixed", "calibrated", "stress"] as const).includes(
    candidate.rangeKind as "fixed" | "calibrated" | "stress"
  )) {
    throw new Error(`${field} has an unsupported rangeKind`);
  }
  assertValidCalibratedValue(candidate, field);
  if (candidate.low < 0) {
    throw new Error(`${field} cannot be negative`);
  }
  return candidate;
}

function validatedPostMigrationValue(
  value: unknown,
  field: LegacyMaterializedInputField
): CalibratedValue {
  const candidate = validatedMaterializedValue(value, field);
  if (candidate.evidenceClass !== "user_input") {
    throw new Error(`${field} post-migration edit must use user_input evidence`);
  }
  const userEvidenceId = /^user\.[A-Za-z0-9][A-Za-z0-9._-]*$/;
  if (candidate.evidenceIds.some((id) => !userEvidenceId.test(id))) {
    throw new Error(`${field} post-migration edit has invalid user evidence`);
  }
  return candidate;
}

function assertMaterializedAuditContract(audit: LegacyMigrationAudit): void {
  const materialised = audit.fieldDispositions.filter(
    ({ disposition }) => disposition === "materialised"
  );
  if (materialised.length !== LEGACY_MATERIALIZED_FIELDS.length) {
    throw new Error("Partial migration must expose exactly eight materialised fields");
  }
  LEGACY_MATERIALIZED_FIELDS.forEach((expected, index) => {
    const actual = materialised[index];
    if (
      !actual ||
      actual.field !== expected.field ||
      actual.disposition !== "materialised" ||
      !valuesDeeplyEqual(actual.materializedPaths, expected.materializedPaths)
    ) {
      throw new Error(
        `Partial migration has a non-canonical materialised field ${expected.field}`
      );
    }
  });
}

export function validateLegacyMigrationDraftForCalculation(
  draft: ScenarioDraft,
  gate: LegacyMigrationCalculationGate
): ValidatedLegacyMigrationDraft {
  if (!gate || gate.kind !== "legacy_migration") {
    throw new Error("Legacy migration validation requires a legacy gate");
  }
  if (gate.result.status === "ambiguous") {
    throw new Error("Ambiguous legacy migration cannot be calculated");
  }
  if (gate.result.status === "partial" && gate.confirmed !== true) {
    throw new Error("Partial legacy migration requires explicit confirmation");
  }
  if (!gate.audit) {
    throw new Error("Legacy migration requires adapter-provided audit data");
  }
  assertCanonicalLegacyGateShape(gate);

  const adapted = createScenarioDraftFromLegacyMigration(
    gate.result,
    gate.result.status === "partial" ? true : undefined
  );
  if (adapted.status !== "ready") {
    const fields = adapted.issues.map(({ field }) => field).join(", ");
    throw new Error(`Confirmed legacy migration remains blocked by: ${fields}`);
  }
  if (adapted.draft.derivedFromScenarioId !== draft.derivedFromScenarioId) {
    throw new Error("Legacy migration scenario does not match submitted draft");
  }
  if (!valuesDeeplyEqual(gate.audit, adapted.audit)) {
    throw new Error(
      "Legacy migration adapter audit does not match retained inputs"
    );
  }
  if (
    !valuesDeeplyEqual(
      draft.economicAssumptions.dailyCostOfInaction,
      draft.dailyCostOfInaction
    )
  ) {
    throw new Error("Submitted dailyCostOfInaction mirrors must match exactly");
  }

  if (gate.result.status === "exact") {
    return { adapted, postMigrationEdits: [] };
  }

  assertMaterializedAuditContract(adapted.audit);
  const postMigrationEdits = LEGACY_MATERIALIZED_FIELDS.flatMap(
    ({ field, materializedPaths }): PostMigrationEditRecord[] => {
      const before = materializedDraftValue(adapted.draft, field);
      const after = materializedDraftValue(draft, field);
      if (valuesDeeplyEqual(before, after)) return [];
      const validatedBefore = validatedMaterializedValue(before, field);
      const validatedAfter = validatedPostMigrationValue(after, field);
      return [{
        field,
        materializedPaths: [...materializedPaths],
        before: cloneCalibratedValue(validatedBefore),
        after: cloneCalibratedValue(validatedAfter),
        provenance: {
          sourceClass: "post_migration_user_edit",
          sourceSchemaVersion: "legacy-v1",
          legacyScenarioId: adapted.audit.legacyScenarioId,
          sourceField: `retainedLegacyInputs.${field}`,
          originalDisposition: "materialised",
        },
      }];
    }
  );
  return {
    adapted: structuredClone(adapted),
    postMigrationEdits: structuredClone(postMigrationEdits),
  };
}
