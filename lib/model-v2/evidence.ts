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

export interface EvidenceSourceMetadata {
  titleKey: string;
  publisherKey: string;
  publishedOn?: string;
  publicationKind:
    | "official_webpage"
    | "official_report"
    | "peer_reviewed_article"
    | "practitioner_report";
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

export function evidenceRecordById(id: string): EvidenceRecord | undefined {
  return EVIDENCE_REGISTRY.find((record) => record.id === id);
}
