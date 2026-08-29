export type RangeKind = "fixed" | "calibrated" | "stress";

export type EvidenceClass =
  | "empirical_anchor"
  | "official_case"
  | "practitioner_observation"
  | "illustrative_scenario"
  | "research_hypothesis"
  | "retained_legacy_assumption"
  | "user_input"
  | "legal_rule";

export interface CalibratedValue {
  low: number;
  central: number;
  high: number;
  rangeKind: RangeKind;
  evidenceClass: EvidenceClass;
  evidenceIds: string[];
}

export interface RangeValues {
  low: number;
  central: number;
  high: number;
}

const RANGE_KINDS: readonly RangeKind[] = ["fixed", "calibrated", "stress"];
const EVIDENCE_CLASSES: readonly EvidenceClass[] = [
  "empirical_anchor",
  "official_case",
  "practitioner_observation",
  "illustrative_scenario",
  "research_hypothesis",
  "retained_legacy_assumption",
  "user_input",
  "legal_rule",
];

export function assertValidCalibratedValue(
  value: CalibratedValue,
  fieldName = "calibrated value"
): void {
  if (!RANGE_KINDS.includes(value.rangeKind)) {
    throw new Error(`${fieldName} must use a supported range kind`);
  }
  if (!EVIDENCE_CLASSES.includes(value.evidenceClass)) {
    throw new Error(`${fieldName} must use a supported evidence class`);
  }
  if (
    !Array.isArray(value.evidenceIds) ||
    value.evidenceIds.some(
      (evidenceId) =>
        typeof evidenceId !== "string" || evidenceId.trim().length === 0
    )
  ) {
    throw new Error(`${fieldName} must use valid evidence identifiers`);
  }
  if (![value.low, value.central, value.high].every(Number.isFinite)) {
    throw new Error(`${fieldName} must contain finite low, central, and high values`);
  }

  if (value.low > value.central || value.central > value.high) {
    throw new Error(`${fieldName} must satisfy low <= central <= high`);
  }

  if (
    value.rangeKind === "fixed" &&
    (value.low !== value.central || value.central !== value.high)
  ) {
    throw new Error(`${fieldName} marked fixed must use one identical value`);
  }
}
