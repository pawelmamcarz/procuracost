import type { ProcurementInputs, StakeholderRole } from "../calculations";
import {
  PROCESS_TEMPLATES,
  TECH_LEVELS,
  type ProcessType,
  type TechLevelId,
} from "../process-templates";
import { SCENARIOS as LEGACY_SCENARIOS } from "../scenarios";
import {
  stateForScenarioV2,
  type V2CalculatorUrlState,
} from "./calculator-url";
import type { ScenarioV2Id } from "./scenarios";

export type LegacyConfirmationField =
  | "scenarioId"
  | "governanceBoundaryId"
  | "procedureFamilyId"
  | "purchaseArchetypeId"
  | "executionChannelId"
  | "systemSupportId"
  | "workflowDesignFormalId"
  | "workflowDesignAdaptiveId"
  | "contractDesignFormalId"
  | "contractDesignAdaptiveId"
  | "retainedProcessMap.formalSequential"
  | "retainedProcessMap.adaptiveCompliant"
  | "retainedRoleEffort.formalSequential"
  | "retainedRoleEffort.adaptiveCompliant"
  | "retainedNonLabourCost.formalSequential"
  | "retainedNonLabourCost.adaptiveCompliant"
  | `retainedLegacyInputs.${
      | "contractValue"
      | "tcoHorizonYears"
      | "contractDurationYears"
      | "dailyCostOfInaction"
      | "renegotiationCost"
      | "bypassAuditExposure"
      | "discountRatePct"
      | "spendType"
      | "processPhase"}`
  | `retainedLegacyInputs.stakeholders.${StakeholderRole}.${
      | "count"
      | "dailyRate"}`
  | "workflowDesign"
  | "contractDesign"
  | "economicAssumptions";

export interface LegacyScenarioMigrationSpec {
  scenarioId: ScenarioV2Id;
  legacyProcessType: ProcurementInputs["processType"];
  legacyTechLevel: ProcurementInputs["techLevel"];
}

export const LEGACY_SCENARIO_MIGRATIONS: Record<
  string,
  LegacyScenarioMigrationSpec
> = {
  fleet: {
    scenarioId: "fleet_tco_reframing",
    legacyProcessType: "private_formal",
    legacyTechLevel: "partial_erp",
  },
  erp: {
    scenarioId: "erp_transformation_discovery",
    legacyProcessType: "private_formal",
    legacyTechLevel: "sourcing_tool",
  },
  logistics: {
    scenarioId: "logistics_service_redesign",
    legacyProcessType: "private_formal",
    legacyTechLevel: "partial_erp",
  },
  production: {
    scenarioId: "critical_material_continuity",
    legacyProcessType: "private_formal",
    legacyTechLevel: "manual",
  },
  pipe_vs_field: {
    scenarioId: "public_it_open_with_market_consultation",
    legacyProcessType: "pzp_eu",
    legacyTechLevel: "partial_erp",
  },
  governance_control: {
    scenarioId: "stable_private_standard_service",
    legacyProcessType: "policy_only",
    legacyTechLevel: "end_to_end",
  },
  capex_investment: {
    scenarioId: "stable_capex_replacement",
    legacyProcessType: "capex",
    legacyTechLevel: "partial_erp",
  },
  discovery_rd: {
    scenarioId: "discovery_solution_codesign",
    legacyProcessType: "discovery",
    legacyTechLevel: "partial_erp",
  },
  catalog: {
    scenarioId: "catalog_calloff_control",
    legacyProcessType: "catalog_order",
    legacyTechLevel: "end_to_end",
  },
  mrp: {
    scenarioId: "mrp_release_control",
    legacyProcessType: "mrp_order",
    legacyTechLevel: "end_to_end",
  },
};

export interface LegacyMigrationValidationError {
  code:
    | "missing_legacy_scenario"
    | "unknown_legacy_scenario"
    | "custom_legacy_scenario"
    | "invalid_legacy_value"
    | "confirmation_required";
  field: string;
  value: string | null;
  messageKey: string;
}

interface LegacyMigrationBase {
  sourceSchemaVersion: "legacy-v1";
  legacyScenarioId: string | null;
  readinessInferred: false;
  fieldsRequiringConfirmation: LegacyConfirmationField[];
  validationErrors: LegacyMigrationValidationError[];
}

export interface ExactLegacyMigration extends LegacyMigrationBase {
  status: "exact";
  canCalculate: true;
  state: V2CalculatorUrlState;
  fieldsRequiringConfirmation: [];
  validationErrors: [];
}

export interface PartialLegacyMigration extends LegacyMigrationBase {
  status: "partial";
  canCalculate: false;
  draftState: LegacyMigrationDraftState;
}

export interface LegacyMigrationDraftState extends V2CalculatorUrlState {
  retainedLegacyInputs: ProcurementInputs;
}

export interface AmbiguousLegacyMigration extends LegacyMigrationBase {
  status: "ambiguous";
  canCalculate: false;
}

export type LegacyMigrationResult =
  | ExactLegacyMigration
  | PartialLegacyMigration
  | AmbiguousLegacyMigration;

const STAKEHOLDER_ROLE_ORDER: StakeholderRole[] = [
  "requestor",
  "buyer",
  "lawyer",
  "finance",
  "manager",
  "executive",
];

const PROCESS_TYPE_CONFIRMATION_FIELDS: LegacyConfirmationField[] = [
  "governanceBoundaryId",
  "procedureFamilyId",
  "purchaseArchetypeId",
  "executionChannelId",
  "workflowDesignFormalId",
  "workflowDesignAdaptiveId",
  "contractDesignFormalId",
  "contractDesignAdaptiveId",
];

const TECH_LEVEL_CONFIRMATION_FIELDS: LegacyConfirmationField[] = [
  "systemSupportId",
  "retainedProcessMap.formalSequential",
  "retainedProcessMap.adaptiveCompliant",
  "retainedRoleEffort.formalSequential",
  "retainedRoleEffort.adaptiveCompliant",
  "retainedNonLabourCost.formalSequential",
  "retainedNonLabourCost.adaptiveCompliant",
];

const CORE_ECONOMIC_CONFIRMATION_FIELDS = {
  cv: "retainedLegacyInputs.contractValue",
  tco: "retainedLegacyInputs.tcoHorizonYears",
  dur: "retainedLegacyInputs.contractDurationYears",
  dci: "retainedLegacyInputs.dailyCostOfInaction",
  rc: "retainedLegacyInputs.renegotiationCost",
  bae: "retainedLegacyInputs.bypassAuditExposure",
} as const satisfies Record<string, LegacyConfirmationField>;

type NumericLegacyInputKey =
  | "contractValue"
  | "tcoHorizonYears"
  | "contractDurationYears"
  | "dailyCostOfInaction"
  | "renegotiationCost"
  | "bypassAuditExposure"
  | "discountRatePct";

const NUMERIC_PARAM_SPECS: Array<{
  compactField: string;
  inputField: NumericLegacyInputKey;
  confirmationField: LegacyConfirmationField;
}> = [
  {
    compactField: "cv",
    inputField: "contractValue",
    confirmationField: "retainedLegacyInputs.contractValue",
  },
  {
    compactField: "tco",
    inputField: "tcoHorizonYears",
    confirmationField: "retainedLegacyInputs.tcoHorizonYears",
  },
  {
    compactField: "dur",
    inputField: "contractDurationYears",
    confirmationField: "retainedLegacyInputs.contractDurationYears",
  },
  {
    compactField: "dci",
    inputField: "dailyCostOfInaction",
    confirmationField: "retainedLegacyInputs.dailyCostOfInaction",
  },
  {
    compactField: "rc",
    inputField: "renegotiationCost",
    confirmationField: "retainedLegacyInputs.renegotiationCost",
  },
  {
    compactField: "bae",
    inputField: "bypassAuditExposure",
    confirmationField: "retainedLegacyInputs.bypassAuditExposure",
  },
  {
    compactField: "dr",
    inputField: "discountRatePct",
    confirmationField: "retainedLegacyInputs.discountRatePct",
  },
];

function addConfirmation(
  fields: LegacyConfirmationField[],
  errors: LegacyMigrationValidationError[],
  field: LegacyConfirmationField,
  compactField: string,
  value: string | null
): void {
  if (!fields.includes(field)) fields.push(field);
  if (!errors.some((error) => error.field === compactField)) {
    errors.push({
      code: "confirmation_required",
      field: compactField,
      value,
      messageKey: "validation.legacyConfirmationRequired",
    });
  }
}

function addMissingCoreConfirmations(
  params: URLSearchParams,
  fields: LegacyConfirmationField[],
  errors: LegacyMigrationValidationError[]
): void {
  const addMissing = (field: LegacyConfirmationField): void =>
    addConfirmation(fields, errors, field, field, null);

  if (!params.get("pt")) {
    PROCESS_TYPE_CONFIRMATION_FIELDS.forEach(addMissing);
  }
  if (!params.get("tl")) {
    TECH_LEVEL_CONFIRMATION_FIELDS.forEach(addMissing);
  }
  for (const [compactField, field] of Object.entries(
    CORE_ECONOMIC_CONFIRMATION_FIELDS
  )) {
    if (!params.get(compactField)) addMissing(field);
  }
  if (!params.get("sh")) {
    for (const role of STAKEHOLDER_ROLE_ORDER) {
      addMissing(`retainedLegacyInputs.stakeholders.${role}.count`);
      addMissing(`retainedLegacyInputs.stakeholders.${role}.dailyRate`);
    }
  }
}

function isKnownProcessType(
  value: string
): value is Exclude<ProcessType, "custom"> {
  return Object.hasOwn(PROCESS_TEMPLATES, value);
}

function isKnownTechLevel(value: string): value is TechLevelId {
  return Object.hasOwn(TECH_LEVELS, value);
}

function parseNonNegativeNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseStakeholders(
  value: string
): ProcurementInputs["stakeholders"] | null {
  const parts = value.split(",");
  if (parts.length !== STAKEHOLDER_ROLE_ORDER.length) return null;

  const stakeholders = {} as ProcurementInputs["stakeholders"];
  for (const [index, role] of STAKEHOLDER_ROLE_ORDER.entries()) {
    const pair = parts[index].split(":");
    if (pair.length !== 2) return null;
    const count = parseNonNegativeNumber(pair[0]);
    const dailyRate = parseNonNegativeNumber(pair[1]);
    if (count === null || dailyRate === null) return null;
    stakeholders[role] = { count, dailyRate };
  }
  return stakeholders;
}

function ambiguousMigration(
  legacyScenarioId: string | null,
  code: LegacyMigrationValidationError["code"],
  messageKey: string,
  field = "sid",
  value: string | null = legacyScenarioId
): AmbiguousLegacyMigration {
  return {
    status: "ambiguous",
    canCalculate: false,
    sourceSchemaVersion: "legacy-v1",
    legacyScenarioId,
    readinessInferred: false,
    fieldsRequiringConfirmation: [
      "scenarioId",
      "governanceBoundaryId",
      "procedureFamilyId",
      "purchaseArchetypeId",
      "executionChannelId",
      "systemSupportId",
      "workflowDesign",
      "contractDesign",
      "economicAssumptions",
    ],
    validationErrors: [
      {
        code,
        field,
        value,
        messageKey,
      },
    ],
  };
}

function invalidLegacyValueMigration(
  legacyScenarioId: string,
  field: string,
  value: string
): AmbiguousLegacyMigration {
  return ambiguousMigration(
    legacyScenarioId,
    "invalid_legacy_value",
    "validation.legacyInvalidValue",
    field,
    value
  );
}

export function migrateLegacyCalculatorParams(
  params: URLSearchParams
): LegacyMigrationResult {
  const legacyScenarioId = params.get("sid");
  if (!legacyScenarioId) {
    return ambiguousMigration(
      null,
      "missing_legacy_scenario",
      "validation.legacyMissingScenario"
    );
  }
  if (legacyScenarioId === "custom") {
    return ambiguousMigration(
      legacyScenarioId,
      "custom_legacy_scenario",
      "validation.legacyCustomScenario"
    );
  }

  const mapping = LEGACY_SCENARIO_MIGRATIONS[legacyScenarioId];
  const legacyScenario = LEGACY_SCENARIOS.find(
    (scenario) => scenario.id === legacyScenarioId
  );
  if (!mapping || !legacyScenario) {
    return ambiguousMigration(
      legacyScenarioId,
      "unknown_legacy_scenario",
      "validation.legacyUnknownScenario"
    );
  }

  const fieldsRequiringConfirmation: LegacyConfirmationField[] = [];
  const validationErrors: LegacyMigrationValidationError[] = [];
  addMissingCoreConfirmations(
    params,
    fieldsRequiringConfirmation,
    validationErrors
  );
  const retainedLegacyInputs = structuredClone(legacyScenario.inputs);
  const legacyProcessType = params.get("pt");
  if (legacyProcessType) {
    if (!isKnownProcessType(legacyProcessType)) {
      return invalidLegacyValueMigration(
        legacyScenarioId,
        "pt",
        legacyProcessType
      );
    }
    retainedLegacyInputs.processType = legacyProcessType;
    if (legacyProcessType !== mapping.legacyProcessType) {
      for (const field of PROCESS_TYPE_CONFIRMATION_FIELDS) {
        addConfirmation(
          fieldsRequiringConfirmation,
          validationErrors,
          field,
          field,
          legacyProcessType
        );
      }
    }
  }

  const legacyTechLevel = params.get("tl");
  if (legacyTechLevel) {
    if (!isKnownTechLevel(legacyTechLevel)) {
      return invalidLegacyValueMigration(
        legacyScenarioId,
        "tl",
        legacyTechLevel
      );
    }
    retainedLegacyInputs.techLevel = legacyTechLevel;
    if (legacyTechLevel !== mapping.legacyTechLevel) {
      for (const field of TECH_LEVEL_CONFIRMATION_FIELDS) {
        addConfirmation(
          fieldsRequiringConfirmation,
          validationErrors,
          field,
          field,
          legacyTechLevel
        );
      }
    }
  }

  for (const {
    compactField,
    inputField,
    confirmationField,
  } of NUMERIC_PARAM_SPECS) {
    const rawValue = params.get(compactField);
    if (rawValue === null || rawValue === "") continue;
    const parsedValue = parseNonNegativeNumber(rawValue);
    if (parsedValue === null) {
      return invalidLegacyValueMigration(
        legacyScenarioId,
        compactField,
        rawValue
      );
    }
    retainedLegacyInputs[inputField] = parsedValue;
    if (parsedValue !== legacyScenario.inputs[inputField]) {
      addConfirmation(
        fieldsRequiringConfirmation,
        validationErrors,
        confirmationField,
        confirmationField,
        rawValue
      );
    }
  }

  const spendType = params.get("st");
  if (spendType !== null) {
    if (spendType !== "direct" && spendType !== "indirect") {
      return invalidLegacyValueMigration(legacyScenarioId, "st", spendType);
    }
    retainedLegacyInputs.spendType = spendType;
    if (spendType !== legacyScenario.inputs.spendType) {
      addConfirmation(
        fieldsRequiringConfirmation,
        validationErrors,
        "retainedLegacyInputs.spendType",
        "retainedLegacyInputs.spendType",
        spendType
      );
    }
  }

  const processPhase = params.get("pp");
  if (processPhase !== null) {
    if (processPhase !== "upstream" && processPhase !== "downstream") {
      return invalidLegacyValueMigration(
        legacyScenarioId,
        "pp",
        processPhase
      );
    }
    retainedLegacyInputs.processPhase = processPhase;
    if (processPhase !== legacyScenario.inputs.processPhase) {
      addConfirmation(
        fieldsRequiringConfirmation,
        validationErrors,
        "retainedLegacyInputs.processPhase",
        "retainedLegacyInputs.processPhase",
        processPhase
      );
    }
  }

  const stakeholderValue = params.get("sh");
  if (stakeholderValue) {
    const stakeholders = parseStakeholders(stakeholderValue);
    if (!stakeholders) {
      return invalidLegacyValueMigration(
        legacyScenarioId,
        "sh",
        stakeholderValue
      );
    }
    retainedLegacyInputs.stakeholders = stakeholders;
    for (const role of STAKEHOLDER_ROLE_ORDER) {
      for (const property of ["count", "dailyRate"] as const) {
        if (
          stakeholders[role][property] !==
          legacyScenario.inputs.stakeholders[role][property]
        ) {
          const field =
            `retainedLegacyInputs.stakeholders.${role}.${property}` as const;
          addConfirmation(
            fieldsRequiringConfirmation,
            validationErrors,
            field,
            field,
            String(stakeholders[role][property])
          );
        }
      }
    }
  }

  const targetState = stateForScenarioV2(mapping.scenarioId);
  if (fieldsRequiringConfirmation.length > 0) {
    return {
      status: "partial",
      canCalculate: false,
      sourceSchemaVersion: "legacy-v1",
      legacyScenarioId,
      readinessInferred: false,
      fieldsRequiringConfirmation,
      validationErrors,
      draftState: { ...targetState, retainedLegacyInputs },
    };
  }

  return {
    status: "exact",
    canCalculate: true,
    sourceSchemaVersion: "legacy-v1",
    legacyScenarioId,
    readinessInferred: false,
    fieldsRequiringConfirmation: [],
    validationErrors: [],
    state: targetState,
  };
}
