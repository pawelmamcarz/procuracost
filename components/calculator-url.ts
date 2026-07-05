import { ProcessType, ProcurementInputs, StakeholderRole, TechLevelId } from "@/lib/calculations";

const STAKEHOLDER_ROLE_ORDER: StakeholderRole[] = [
  "requestor",
  "buyer",
  "lawyer",
  "finance",
  "manager",
  "executive",
];

const VALID_PROCESS_TYPES: ProcessType[] = [
  "pzp_eu",
  "pzp_krajowy",
  "private_formal",
  "policy_only",
  "catalog_order",
  "mrp_order",
  "capex",
  "custom",
];

const VALID_TECH_LEVELS: TechLevelId[] = ["manual", "sourcing_tool", "partial_erp", "end_to_end"];

function parseNumber(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Encodes the calculator's full state into short, stable query params for a shareable link. */
export function encodeInputsToParams(inputs: ProcurementInputs, scenarioId: string): URLSearchParams {
  const params = new URLSearchParams();
  params.set("sid", scenarioId);
  params.set("pt", inputs.processType);
  params.set("tl", inputs.techLevel);
  params.set("cv", String(inputs.contractValue));
  params.set("tco", String(inputs.tcoHorizonYears));
  params.set("dci", String(inputs.dailyCostOfInaction));
  params.set("rc", String(inputs.renegotiationCost));
  params.set("bae", String(inputs.bypassAuditExposure));
  if (inputs.spendType) params.set("st", inputs.spendType);
  if (inputs.processPhase) params.set("pp", inputs.processPhase);
  params.set(
    "sh",
    STAKEHOLDER_ROLE_ORDER.map((role) => `${inputs.stakeholders[role].count}:${inputs.stakeholders[role].dailyRate}`).join(",")
  );
  return params;
}

/**
 * Reads calculator state from URL query params, falling back to `base` for any
 * field that's missing or malformed. Supports both full permalinks (every field
 * set) and partial context links like the ones model/assumptions pages generate
 * (only `st`/`pp` set).
 */
export function inputsFromSearchParams(
  params: URLSearchParams,
  base: ProcurementInputs
): { inputs: ProcurementInputs; scenarioId: string | null } {
  const next: ProcurementInputs = { ...base, stakeholders: { ...base.stakeholders } };

  const pt = params.get("pt");
  if (pt && (VALID_PROCESS_TYPES as string[]).includes(pt)) next.processType = pt as ProcessType;

  const tl = params.get("tl");
  if (tl && (VALID_TECH_LEVELS as string[]).includes(tl)) next.techLevel = tl as TechLevelId;

  const cv = parseNumber(params.get("cv"));
  if (cv !== null) next.contractValue = cv;

  const tco = parseNumber(params.get("tco"));
  if (tco !== null) next.tcoHorizonYears = tco;

  const dci = parseNumber(params.get("dci"));
  if (dci !== null) next.dailyCostOfInaction = dci;

  const rc = parseNumber(params.get("rc"));
  if (rc !== null) next.renegotiationCost = rc;

  const bae = parseNumber(params.get("bae"));
  if (bae !== null) next.bypassAuditExposure = bae;

  const st = params.get("st");
  if (st === "direct" || st === "indirect") next.spendType = st;

  const pp = params.get("pp");
  if (pp === "upstream" || pp === "downstream") next.processPhase = pp;

  const sh = params.get("sh");
  if (sh) {
    const parts = sh.split(",");
    if (parts.length === STAKEHOLDER_ROLE_ORDER.length) {
      const stakeholders = { ...next.stakeholders };
      let valid = true;
      STAKEHOLDER_ROLE_ORDER.forEach((role, i) => {
        const [countStr, rateStr] = parts[i].split(":");
        const count = parseNumber(countStr);
        const dailyRate = parseNumber(rateStr);
        if (count === null || dailyRate === null) {
          valid = false;
          return;
        }
        stakeholders[role] = { count, dailyRate };
      });
      if (valid) next.stakeholders = stakeholders;
    }
  }

  return { inputs: next, scenarioId: params.get("sid") };
}
