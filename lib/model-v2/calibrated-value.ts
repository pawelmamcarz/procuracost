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

export function assertValidCalibratedValue(
  value: CalibratedValue,
  fieldName = "calibrated value"
): void {
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
