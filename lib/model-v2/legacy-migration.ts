import type { ProcurementInputs, StakeholderRole } from "../calculations";
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
  draftState: V2CalculatorUrlState;
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

const ECONOMIC_PARAM_KEYS = [
  "cv",
  "tco",
  "dur",
  "dci",
  "rc",
  "bae",
  "dr",
  "st",
  "pp",
  "sh",
] as const;

type LegacyEconomicParam = (typeof ECONOMIC_PARAM_KEYS)[number];

function legacyEconomicParamValue(
  inputs: ProcurementInputs,
  key: LegacyEconomicParam
): string | null {
  switch (key) {
    case "cv":
      return String(inputs.contractValue);
    case "tco":
      return String(inputs.tcoHorizonYears);
    case "dur":
      return String(inputs.contractDurationYears);
    case "dci":
      return String(inputs.dailyCostOfInaction);
    case "rc":
      return String(inputs.renegotiationCost);
    case "bae":
      return String(inputs.bypassAuditExposure);
    case "dr":
      return inputs.discountRatePct === undefined
        ? null
        : String(inputs.discountRatePct);
    case "st":
      return inputs.spendType ?? null;
    case "pp":
      return inputs.processPhase ?? null;
    case "sh":
      return STAKEHOLDER_ROLE_ORDER.map(
        (role) =>
          `${inputs.stakeholders[role].count}:${inputs.stakeholders[role].dailyRate}`
      ).join(",");
  }
}

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

function ambiguousMigration(
  legacyScenarioId: string | null,
  code: LegacyMigrationValidationError["code"],
  messageKey: string
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
        field: "sid",
        value: legacyScenarioId,
        messageKey,
      },
    ],
  };
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
  const legacyProcessType = params.get("pt");
  if (
    legacyProcessType !== null &&
    legacyProcessType !== mapping.legacyProcessType
  ) {
    for (const [field, compactField] of [
      ["governanceBoundaryId", "gb"],
      ["procedureFamilyId", "pf"],
      ["purchaseArchetypeId", "pa"],
      ["executionChannelId", "ec"],
      ["workflowDesign", "wdf"],
    ] as const) {
      addConfirmation(
        fieldsRequiringConfirmation,
        validationErrors,
        field,
        compactField,
        legacyProcessType
      );
    }
  }

  const legacyTechLevel = params.get("tl");
  if (
    legacyTechLevel !== null &&
    legacyTechLevel !== mapping.legacyTechLevel
  ) {
    addConfirmation(
      fieldsRequiringConfirmation,
      validationErrors,
      "systemSupportId",
      "ss",
      legacyTechLevel
    );
  }

  for (const key of ECONOMIC_PARAM_KEYS) {
    if (
      params.has(key) &&
      params.get(key) !== legacyEconomicParamValue(legacyScenario.inputs, key)
    ) {
      addConfirmation(
        fieldsRequiringConfirmation,
        validationErrors,
        "economicAssumptions",
        "economicAssumptions",
        params.get(key)
      );
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
      draftState: targetState,
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
