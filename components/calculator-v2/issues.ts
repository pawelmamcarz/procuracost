import type {
  AlternativeId,
  LegacyMigrationDraftIssueCode,
  ProcessMapValidationCode,
  V2UrlField,
  V2UrlValidationCode,
} from "@/lib/model-v2";

interface IssueLocation {
  alternativeId?: AlternativeId;
  stepId?: string;
  field?: string;
  predecessorId?: string;
}

export interface EditorUiIssue extends IssueLocation {
  source: "editor";
  code:
    | "locked_step"
    | "unknown_step"
    | "unknown_role"
    | "invalid_calibrated_range"
    | "invalid_step_kind";
  messageKey:
    | "calculatorV2.validation.lockedStep"
    | "calculatorV2.validation.unknownStep"
    | "calculatorV2.validation.unknownRole"
    | "calculatorV2.validation.invalidCalibratedRange"
    | "calculatorV2.validation.invalidStepKind";
}

export interface ContextUiIssue extends IssueLocation {
  source: "context";
  code:
    | "illegal_context"
    | "incompatible_locked_wait_shape"
    | "context_reconciliation_failed";
  messageKey:
    | "calculatorV2.validation.illegalContext"
    | "calculatorV2.validation.incompatibleLockedWaitShape"
    | "calculatorV2.validation.contextReconciliationFailed";
}

export interface UrlUiIssue {
  source: "url";
  code: V2UrlValidationCode;
  field: V2UrlField;
  value: string | null;
  messageKey: string;
}

export interface MigrationUiIssue {
  source: "migration";
  code: LegacyMigrationDraftIssueCode;
  field: string;
  messageKey: string;
}

export interface ProcessMapUiIssue extends IssueLocation {
  source: "process-map";
  code: ProcessMapValidationCode;
  messageKey: `calculatorV2.validation.processMap.${ProcessMapValidationCode}`;
}

export interface RangeUiIssue extends IssueLocation {
  source: "range";
  code: "invalid_calibrated_range";
  messageKey: "calculatorV2.validation.invalidCalibratedRange";
}

export interface CustomLabelUiIssue extends IssueLocation {
  source: "custom-label";
  code: "blank_custom_label";
  messageKey: "calculatorV2.validation.blankCustomLabel";
}

export interface DesignUiIssue extends IssueLocation {
  source: "design";
  code:
    | "incompatible_workflow_design"
    | "incompatible_contract_design";
  messageKey:
    | "calculatorV2.validation.incompatibleWorkflowDesign"
    | "calculatorV2.validation.incompatibleContractDesign";
}

export interface SubmitUiIssue extends IssueLocation {
  source: "submit";
  code: "calculation_rejected";
  messageKey: "calculatorV2.validation.calculationRejected";
}

export type CalculatorUiIssue =
  | EditorUiIssue
  | ContextUiIssue
  | UrlUiIssue
  | MigrationUiIssue
  | ProcessMapUiIssue
  | RangeUiIssue
  | CustomLabelUiIssue
  | DesignUiIssue
  | SubmitUiIssue;
