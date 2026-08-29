import {
  EVIDENCE_REGISTRY,
  type EvidenceRecord,
} from "@/lib/model-v2";

export const HOME_EVIDENCE_IDS: readonly [
  "california_modular_it_procurement",
  "oecd_rvul_problem_definition",
  "uzp_preliminary_market_consultation",
  "ec_innovation_procurement_guidance",
] = [
  "california_modular_it_procurement",
  "oecd_rvul_problem_definition",
  "uzp_preliminary_market_consultation",
  "ec_innovation_procurement_guidance",
];

const HOME_EVIDENCE_ID_SET = new Set<string>(HOME_EVIDENCE_IDS);

function cloneEvidenceRecord(record: EvidenceRecord): EvidenceRecord {
  return {
    ...record,
    source: { ...record.source },
    constructs: [...record.constructs],
    assumptionKeys: [...record.assumptionKeys],
  };
}

export function homeEvidenceRecords(): readonly EvidenceRecord[] {
  return EVIDENCE_REGISTRY.filter(({ id }) => HOME_EVIDENCE_ID_SET.has(id)).map(
    cloneEvidenceRecord
  );
}
