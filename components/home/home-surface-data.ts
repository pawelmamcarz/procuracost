import {
  buildIllustrativeProcessRailViewModel,
  type ProcessRailViewModel,
} from "@/components/process-map/rail-view-model";
import { homeT, type Lang } from "@/lib/i18n";
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

export function buildCompactHomeRail(lang: Lang): ProcessRailViewModel {
  const labels = homeT[lang].compactRail.steps;

  return buildIllustrativeProcessRailViewModel({
    lang,
    lanes: {
      formalSequential: [
        {
          id: "formal-frame",
          label: labels.formalFrame,
          predecessorIds: [],
          critical: true,
        },
        {
          id: "formal-check",
          label: labels.formalCheck,
          predecessorIds: ["formal-frame"],
          critical: true,
        },
        {
          id: "formal-evaluation",
          label: labels.formalEvaluation,
          predecessorIds: ["formal-check"],
          critical: true,
        },
        {
          id: "formal-award",
          label: labels.formalAward,
          predecessorIds: ["formal-evaluation"],
          critical: true,
        },
      ],
      adaptiveCompliant: [
        {
          id: "adaptive-frame",
          label: labels.adaptiveFrame,
          predecessorIds: [],
          critical: true,
        },
        {
          id: "adaptive-market",
          label: labels.adaptiveMarket,
          predecessorIds: ["adaptive-frame"],
          critical: true,
        },
        {
          id: "adaptive-design",
          label: labels.adaptiveDesign,
          predecessorIds: ["adaptive-frame"],
        },
        {
          id: "adaptive-merge",
          label: labels.adaptiveMerge,
          predecessorIds: ["adaptive-market", "adaptive-design"],
          critical: true,
        },
      ],
    },
  });
}
