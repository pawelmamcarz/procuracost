import {
  EXECUTION_CHANNEL_IDS,
  LEGAL_GOVERNANCE_BOUNDARY_IDS,
  MODEL_V2_METADATA,
  PROCEDURE_FAMILY_IDS,
  PURCHASE_ARCHETYPE_IDS,
  SYSTEM_SUPPORT_IDS,
  type ExecutionChannelId,
  type LegalGovernanceBoundaryId,
  type ProcedureFamilyId,
  type PurchaseArchetypeId,
  type SystemSupportId,
} from "./domain";
import {
  SCENARIOS_V2,
  scenarioV2ById,
  type ScenarioV2Id,
} from "./scenarios";

export const V2_URL_KEYS = [
  "sv",
  "mv",
  "cid",
  "sid",
  "gb",
  "pf",
  "pa",
  "ec",
  "ss",
  "wdf",
  "wda",
  "cdf",
  "cda",
] as const;

export type V2UrlField = (typeof V2_URL_KEYS)[number];

export interface V2CalculatorUrlState {
  schemaVersion: typeof MODEL_V2_METADATA.schemaVersion;
  modelVersion: typeof MODEL_V2_METADATA.modelVersion;
  calibrationId: typeof MODEL_V2_METADATA.calibrationId;
  scenarioId: ScenarioV2Id;
  governanceBoundaryId: LegalGovernanceBoundaryId;
  procedureFamilyId: ProcedureFamilyId;
  purchaseArchetypeId: PurchaseArchetypeId;
  executionChannelId: ExecutionChannelId;
  systemSupportId: SystemSupportId;
  workflowDesignFormalId: string;
  workflowDesignAdaptiveId: string;
  contractDesignFormalId: string;
  contractDesignAdaptiveId: string;
}

export type V2UrlValidationCode =
  | "missing_field"
  | "unsupported_version"
  | "unknown_id"
  | "scenario_mismatch";

export interface V2UrlValidationError {
  code: V2UrlValidationCode;
  field: V2UrlField;
  value: string | null;
  messageKey: string;
}

export interface ValidV2CalculatorUrl {
  status: "valid";
  canCalculate: true;
  state: V2CalculatorUrlState;
  validationErrors: [];
}

export interface InvalidV2CalculatorUrl {
  status: "invalid";
  canCalculate: false;
  validationErrors: V2UrlValidationError[];
}

export type V2CalculatorUrlDecodeResult =
  | ValidV2CalculatorUrl
  | InvalidV2CalculatorUrl;

const FIELD_TO_STATE = {
  sv: "schemaVersion",
  mv: "modelVersion",
  cid: "calibrationId",
  sid: "scenarioId",
  gb: "governanceBoundaryId",
  pf: "procedureFamilyId",
  pa: "purchaseArchetypeId",
  ec: "executionChannelId",
  ss: "systemSupportId",
  wdf: "workflowDesignFormalId",
  wda: "workflowDesignAdaptiveId",
  cdf: "contractDesignFormalId",
  cda: "contractDesignAdaptiveId",
} as const;

export function stateForScenarioV2(
  scenarioId: ScenarioV2Id
): V2CalculatorUrlState {
  const scenario = scenarioV2ById(scenarioId);
  if (!scenario) throw new Error(`Unknown model 2.3 scenario: ${scenarioId}`);
  const context = scenario.context;

  return {
    schemaVersion: MODEL_V2_METADATA.schemaVersion,
    modelVersion: MODEL_V2_METADATA.modelVersion,
    calibrationId: MODEL_V2_METADATA.calibrationId,
    scenarioId,
    governanceBoundaryId: context.boundaryId,
    procedureFamilyId: context.procedureFamilyId,
    purchaseArchetypeId: context.purchaseArchetypeId,
    executionChannelId: context.executionChannelId,
    systemSupportId: context.systemSupportId,
    workflowDesignFormalId: scenario.designIds.workflow.formalSequential,
    workflowDesignAdaptiveId: scenario.designIds.workflow.adaptiveCompliant,
    contractDesignFormalId: scenario.designIds.contract.formalSequential,
    contractDesignAdaptiveId: scenario.designIds.contract.adaptiveCompliant,
  };
}

export function encodeV2CalculatorState(
  state: V2CalculatorUrlState
): URLSearchParams {
  const values: Record<V2UrlField, string> = {
    sv: String(state.schemaVersion),
    mv: state.modelVersion,
    cid: state.calibrationId,
    sid: state.scenarioId,
    gb: state.governanceBoundaryId,
    pf: state.procedureFamilyId,
    pa: state.purchaseArchetypeId,
    ec: state.executionChannelId,
    ss: state.systemSupportId,
    wdf: state.workflowDesignFormalId,
    wda: state.workflowDesignAdaptiveId,
    cdf: state.contractDesignFormalId,
    cda: state.contractDesignAdaptiveId,
  };
  const params = new URLSearchParams();
  for (const key of V2_URL_KEYS) params.set(key, values[key]);
  return params;
}

function isOneOf<T extends string>(
  value: string | null,
  values: readonly T[]
): value is T {
  return value !== null && values.includes(value as T);
}

function addRequiredFieldErrors(
  params: URLSearchParams,
  errors: V2UrlValidationError[]
): void {
  for (const field of V2_URL_KEYS) {
    if (!params.has(field) || params.get(field) === "") {
      errors.push({
        code: "missing_field",
        field,
        value: params.get(field),
        messageKey: "validation.missingField",
      });
    }
  }
}

function addUnsupportedValue(
  errors: V2UrlValidationError[],
  field: V2UrlField,
  value: string | null,
  messageKey: string,
  code: V2UrlValidationCode = "unknown_id"
): void {
  if (value === null || value === "") return;
  errors.push({ code, field, value, messageKey });
}

function validateKnownValues(
  params: URLSearchParams,
  errors: V2UrlValidationError[]
): void {
  const schemaVersion = params.get("sv");
  if (schemaVersion !== String(MODEL_V2_METADATA.schemaVersion)) {
    addUnsupportedValue(
      errors,
      "sv",
      schemaVersion,
      "validation.invalidSchemaVersion",
      "unsupported_version"
    );
  }
  const modelVersion = params.get("mv");
  if (modelVersion !== MODEL_V2_METADATA.modelVersion) {
    addUnsupportedValue(
      errors,
      "mv",
      modelVersion,
      "validation.invalidModelVersion",
      "unsupported_version"
    );
  }
  const calibrationId = params.get("cid");
  if (calibrationId !== MODEL_V2_METADATA.calibrationId) {
    addUnsupportedValue(
      errors,
      "cid",
      calibrationId,
      "validation.invalidCalibrationId",
      "unsupported_version"
    );
  }
  if (!scenarioV2ById(params.get("sid") ?? "")) {
    addUnsupportedValue(
      errors,
      "sid",
      params.get("sid"),
      "validation.unknownScenario"
    );
  }
  if (!isOneOf(params.get("gb"), LEGAL_GOVERNANCE_BOUNDARY_IDS)) {
    addUnsupportedValue(
      errors,
      "gb",
      params.get("gb"),
      "validation.unknownBoundary"
    );
  }
  if (!isOneOf(params.get("pf"), PROCEDURE_FAMILY_IDS)) {
    addUnsupportedValue(
      errors,
      "pf",
      params.get("pf"),
      "validation.unknownProcedure"
    );
  }
  if (!isOneOf(params.get("pa"), PURCHASE_ARCHETYPE_IDS)) {
    addUnsupportedValue(
      errors,
      "pa",
      params.get("pa"),
      "validation.unknownArchetype"
    );
  }
  if (!isOneOf(params.get("ec"), EXECUTION_CHANNEL_IDS)) {
    addUnsupportedValue(
      errors,
      "ec",
      params.get("ec"),
      "validation.unknownExecutionChannel"
    );
  }
  if (!isOneOf(params.get("ss"), SYSTEM_SUPPORT_IDS)) {
    addUnsupportedValue(
      errors,
      "ss",
      params.get("ss"),
      "validation.unknownSystemSupport"
    );
  }

  const knownWorkflowIds = new Set(
    SCENARIOS_V2.flatMap(({ designIds }) => Object.values(designIds.workflow))
  );
  const knownContractIds = new Set(
    SCENARIOS_V2.flatMap(({ designIds }) => Object.values(designIds.contract))
  );
  for (const field of ["wdf", "wda"] as const) {
    const value = params.get(field);
    if (value && !knownWorkflowIds.has(value)) {
      addUnsupportedValue(
        errors,
        field,
        value,
        "validation.unknownWorkflowDesign"
      );
    }
  }
  for (const field of ["cdf", "cda"] as const) {
    const value = params.get(field);
    if (value && !knownContractIds.has(value)) {
      addUnsupportedValue(
        errors,
        field,
        value,
        "validation.unknownContractDesign"
      );
    }
  }
}

function validateScenarioCoherence(
  params: URLSearchParams,
  errors: V2UrlValidationError[]
): void {
  const scenario = scenarioV2ById(params.get("sid") ?? "");
  if (!scenario) return;
  const expected = encodeV2CalculatorState(stateForScenarioV2(scenario.id));

  for (const field of [
    "gb",
    "pf",
    "pa",
    "ec",
    "ss",
    "wdf",
    "wda",
    "cdf",
    "cda",
  ] as const) {
    const value = params.get(field);
    if (
      value !== null &&
      value !== "" &&
      value !== expected.get(field) &&
      !errors.some((error) => error.field === field)
    ) {
      errors.push({
        code: "scenario_mismatch",
        field,
        value,
        messageKey: "validation.axisMismatch",
      });
    }
  }
}

export function decodeV2CalculatorParams(
  params: URLSearchParams
): V2CalculatorUrlDecodeResult {
  const validationErrors: V2UrlValidationError[] = [];
  addRequiredFieldErrors(params, validationErrors);
  validateKnownValues(params, validationErrors);
  validateScenarioCoherence(params, validationErrors);

  if (validationErrors.length > 0) {
    return { status: "invalid", canCalculate: false, validationErrors };
  }

  const values = Object.fromEntries(
    V2_URL_KEYS.map((field) => [FIELD_TO_STATE[field], params.get(field)])
  ) as unknown as Omit<V2CalculatorUrlState, "schemaVersion">;
  return {
    status: "valid",
    canCalculate: true,
    state: {
      ...values,
      schemaVersion: MODEL_V2_METADATA.schemaVersion,
    },
    validationErrors: [],
  };
}
