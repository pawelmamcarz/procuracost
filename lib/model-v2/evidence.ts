import {
  MECHANISM_WORKFLOW_EVIDENCE_ID,
  MECHANISM_WORKFLOW_SOURCE,
} from "./mechanism-workflow-seeds";

export const EVIDENCE_TYPES = [
  "empirical_anchor",
  "official_case",
  "practitioner_observation",
  "illustrative_scenario",
  "research_hypothesis",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const EVIDENCE_CONSTRUCTS = [
  "workflow_duration",
  "role_effort",
  "problem_definition",
  "market_consultation",
  "modular_contracting",
  "supplier_access",
  "competition_transfer",
  "contract_adaptability",
  "contract_amendment",
  "tco",
  "informal_bypass",
  "innovation_procurement",
] as const;

export type EvidenceConstruct = (typeof EVIDENCE_CONSTRUCTS)[number];

export type PractitionerSourceRefId =
  | "professionalisation"
  | "friction_mapping"
  | "marginal_requirements"
  | "operational_purchasing"
  | "requirements_blind_spots"
  | "internal_challenger"
  | "internal_ambassador"
  | "champion_continuity"
  | "legacy_procedure"
  | "policy_boundary"
  | "tco"
  | "bielik"
  | "category_transfer"
  | "data_math_separation";

export interface PractitionerSourceRef {
  id: PractitionerSourceRefId;
  startSeconds: number;
  endSeconds?: number;
  url: string;
}

export interface PractitionerSource {
  id: "procurement-beyond-8";
  kind: "practitioner_interview";
  title: "Procurement&Beyond, odcinek 8. Nawet najlepsze narzędzie nie uratuje złego wdrożenia.";
  author: "Procurement&Beyond";
  url: "https://www.youtube.com/watch?v=5KYUdTLlvvg";
  publishedAt: "2026-08-26";
  durationSeconds: 4026;
  transcriptKind: "youtube_auto_captions_pl";
  transcriptHumanVerified: false;
  calibrationEligible: false;
  permittedUse: "question_design_and_hypothesis_generation_only";
  refs: readonly PractitionerSourceRef[];
}

export interface EvidenceSourceMetadata {
  titleKey: string;
  publisherKey: string;
  publishedOn?: string;
  publicationKind:
    | "official_webpage"
    | "official_report"
    | "peer_reviewed_article"
    | "practitioner_report"
    | "internal_model_record";
}

export interface EvidenceRecord {
  id: string;
  type: EvidenceType;
  sourceUrl: string;
  source: EvidenceSourceMetadata;
  supportedClaimKey: string;
  unsupportedClaimKey: string;
  jurisdictionOrPopulationKey: string;
  constructs: EvidenceConstruct[];
  assumptionKeys: string[];
}

export const OFFICIAL_EVIDENCE_IDS = [
  "california_modular_it_procurement",
  "oecd_rvul_problem_definition",
  "uzp_preliminary_market_consultation",
  "ec_innovation_procurement_guidance",
] as const;

export const INTERNAL_EVIDENCE_IDS = [
  MECHANISM_WORKFLOW_EVIDENCE_ID,
] as const;

export const INTERNAL_EVIDENCE_REGISTRY: EvidenceRecord[] = [
  {
    id: MECHANISM_WORKFLOW_EVIDENCE_ID,
    type: "illustrative_scenario",
    sourceUrl: MECHANISM_WORKFLOW_SOURCE.sourceUrl,
    source: {
      titleKey: "evidence.mechanismWorkflow.sourceTitle",
      publisherKey: "evidence.mechanismWorkflow.publisher",
      publicationKind: "internal_model_record",
    },
    supportedClaimKey: "evidence.mechanismWorkflow.supported",
    unsupportedClaimKey: "evidence.mechanismWorkflow.unsupported",
    jurisdictionOrPopulationKey: "evidence.mechanismWorkflow.population",
    constructs: [
      "workflow_duration",
      "role_effort",
      "problem_definition",
      "market_consultation",
      "modular_contracting",
      "supplier_access",
      "contract_adaptability",
      "tco",
    ],
    assumptionKeys: ["evidence.mechanismWorkflow.assumption"],
  },
];

export const EVIDENCE_REGISTRY: EvidenceRecord[] = [
  {
    id: "california_modular_it_procurement",
    type: "official_case",
    sourceUrl:
      "https://www.cdt.ca.gov/newsroom/2022/08/california-redefines-state-technology-procurement/",
    source: {
      titleKey: "evidence.californiaModular.sourceTitle",
      publisherKey: "evidence.californiaModular.publisher",
      publishedOn: "2022-08-03",
      publicationKind: "official_webpage",
    },
    supportedClaimKey: "evidence.californiaModular.supported",
    unsupportedClaimKey: "evidence.californiaModular.unsupported",
    jurisdictionOrPopulationKey: "evidence.californiaModular.population",
    constructs: [
      "modular_contracting",
      "supplier_access",
      "contract_adaptability",
    ],
    assumptionKeys: ["evidence.californiaModular.assumption"],
  },
  {
    id: "oecd_rvul_problem_definition",
    type: "official_case",
    sourceUrl:
      "https://www.oecd.org/en/publications/public-procurement-in-lithuania_aa1b196c-en/full-report/component-8.html",
    source: {
      titleKey: "evidence.oecdRvul.sourceTitle",
      publisherKey: "evidence.oecdRvul.publisher",
      publicationKind: "official_report",
    },
    supportedClaimKey: "evidence.oecdRvul.supported",
    unsupportedClaimKey: "evidence.oecdRvul.unsupported",
    jurisdictionOrPopulationKey: "evidence.oecdRvul.population",
    constructs: ["problem_definition", "market_consultation", "role_effort"],
    assumptionKeys: ["evidence.oecdRvul.assumption"],
  },
  {
    id: "uzp_preliminary_market_consultation",
    type: "official_case",
    sourceUrl: "https://www.gov.pl/web/uzp/wstepne-konsultacje-rynkowe",
    source: {
      titleKey: "evidence.uzpConsultation.sourceTitle",
      publisherKey: "evidence.uzpConsultation.publisher",
      publicationKind: "official_webpage",
    },
    supportedClaimKey: "evidence.uzpConsultation.supported",
    unsupportedClaimKey: "evidence.uzpConsultation.unsupported",
    jurisdictionOrPopulationKey: "evidence.uzpConsultation.population",
    constructs: ["market_consultation", "problem_definition"],
    assumptionKeys: ["evidence.uzpConsultation.assumption"],
  },
  {
    id: "ec_innovation_procurement_guidance",
    type: "official_case",
    sourceUrl:
      "https://public-buyers-community.ec.europa.eu/resources/guidance-innovation-procurement",
    source: {
      titleKey: "evidence.ecInnovation.sourceTitle",
      publisherKey: "evidence.ecInnovation.publisher",
      publishedOn: "2021-06-21",
      publicationKind: "official_webpage",
    },
    supportedClaimKey: "evidence.ecInnovation.supported",
    unsupportedClaimKey: "evidence.ecInnovation.unsupported",
    jurisdictionOrPopulationKey: "evidence.ecInnovation.population",
    constructs: [
      "innovation_procurement",
      "market_consultation",
      "contract_adaptability",
    ],
    assumptionKeys: ["evidence.ecInnovation.assumption"],
  },
  {
    id: "szucs_discretion_price_2024",
    type: "empirical_anchor",
    sourceUrl: "https://doi.org/10.1093/jeea/jvad017",
    source: {
      titleKey: "evidence.szucs.sourceTitle",
      publisherKey: "evidence.szucs.publisher",
      publicationKind: "peer_reviewed_article",
    },
    supportedClaimKey: "evidence.szucs.supported",
    unsupportedClaimKey: "evidence.szucs.unsupported",
    jurisdictionOrPopulationKey: "evidence.szucs.population",
    constructs: ["competition_transfer"],
    assumptionKeys: ["evidence.szucs.assumption"],
  },
];

const PROCUREMENT_BEYOND_8_VIDEO_ID = "5KYUdTLlvvg";

function practitionerRef(
  id: PractitionerSourceRefId,
  startSeconds: number,
  endSeconds: number,
): PractitionerSourceRef {
  return {
    id,
    startSeconds,
    endSeconds,
    url: `https://youtu.be/${PROCUREMENT_BEYOND_8_VIDEO_ID}?t=${startSeconds}`,
  };
}

export const PROCUREMENT_BEYOND_8: PractitionerSource = {
  id: "procurement-beyond-8",
  kind: "practitioner_interview",
  title:
    "Procurement&Beyond, odcinek 8. Nawet najlepsze narzędzie nie uratuje złego wdrożenia.",
  author: "Procurement&Beyond",
  url: "https://www.youtube.com/watch?v=5KYUdTLlvvg",
  publishedAt: "2026-08-26",
  durationSeconds: 4026,
  transcriptKind: "youtube_auto_captions_pl",
  transcriptHumanVerified: false,
  calibrationEligible: false,
  permittedUse: "question_design_and_hypothesis_generation_only",
  refs: [
    practitionerRef("professionalisation", 271, 408),
    practitionerRef("friction_mapping", 592, 656),
    practitionerRef("marginal_requirements", 946, 1017),
    practitionerRef("operational_purchasing", 1023, 1068),
    practitionerRef("requirements_blind_spots", 1074, 1103),
    practitionerRef("internal_challenger", 1639, 1689),
    practitionerRef("internal_ambassador", 1707, 1746),
    practitionerRef("champion_continuity", 1781, 1789),
    practitionerRef("legacy_procedure", 2385, 2495),
    practitionerRef("policy_boundary", 2614, 2659),
    practitionerRef("tco", 2863, 2954),
    practitionerRef("bielik", 3539, 3649),
    practitionerRef("category_transfer", 3678, 3807),
    practitionerRef("data_math_separation", 3810, 3954),
  ],
};

export const PRACTITIONER_SOURCES: readonly PractitionerSource[] = [
  PROCUREMENT_BEYOND_8,
];

export function evidenceRecordById(id: string): EvidenceRecord | undefined {
  return [...INTERNAL_EVIDENCE_REGISTRY, ...EVIDENCE_REGISTRY].find(
    (record) => record.id === id
  );
}
