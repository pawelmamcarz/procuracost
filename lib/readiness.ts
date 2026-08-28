import type { PractitionerSourceRefId } from "./model-v2/evidence";

export const READINESS_STATUSES = ["blocked", "risk", "ready"] as const;

export type ReadinessStatus = (typeof READINESS_STATUSES)[number];

export type ReadinessDomainId =
  | "purpose"
  | "ownership"
  | "process"
  | "requirements"
  | "data_automation"
  | "governance"
  | "adoption"
  | "value_rollout";

export type ReadinessQuestionId =
  | "purpose.friction"
  | "purpose.success"
  | "ownership.business_owner"
  | "ownership.sponsorship"
  | "process.current_state"
  | "process.target_state"
  | "requirements.traceability"
  | "requirements.discovery"
  | "data_automation.data"
  | "data_automation.ai"
  | "governance.boundary"
  | "governance.approvals"
  | "adoption.users"
  | "adoption.plan"
  | "value_rollout.business_case"
  | "value_rollout.rollout";

export type ReadinessResponses = Partial<
  Record<ReadinessQuestionId, ReadinessStatus>
>;

export interface ReadinessDomainResult {
  domainId: ReadinessDomainId;
  status: ReadinessStatus;
  riskQuestionIds: ReadinessQuestionId[];
  blockedQuestionIds: ReadinessQuestionId[];
}

export interface ReadinessResult {
  version: "1.0";
  status: ReadinessStatus;
  domains: ReadinessDomainResult[];
}

export interface ReadinessQuestionDefinition {
  id: ReadinessQuestionId;
  domainId: ReadinessDomainId;
  sourceRefIds: readonly PractitionerSourceRefId[];
}

export interface ReadinessQuestionCopy {
  prompt: string;
  answers: Record<ReadinessStatus, string>;
}

export interface ReadinessDomainDefinition {
  id: ReadinessDomainId;
  questions: readonly [ReadinessQuestionDefinition, ReadinessQuestionDefinition];
}

function question(
  id: ReadinessQuestionId,
  domainId: ReadinessDomainId,
  sourceRefIds: readonly PractitionerSourceRefId[],
): ReadinessQuestionDefinition {
  return { id, domainId, sourceRefIds };
}

export const READINESS_DOMAINS: readonly ReadinessDomainDefinition[] = [
  {
    id: "purpose",
    questions: [
      question("purpose.friction", "purpose", ["friction_mapping"]),
      question("purpose.success", "purpose", ["friction_mapping"]),
    ],
  },
  {
    id: "ownership",
    questions: [
      question("ownership.business_owner", "ownership", ["internal_challenger"]),
      question("ownership.sponsorship", "ownership", ["champion_continuity"]),
    ],
  },
  {
    id: "process",
    questions: [
      question("process.current_state", "process", ["operational_purchasing"]),
      question("process.target_state", "process", ["legacy_procedure"]),
    ],
  },
  {
    id: "requirements",
    questions: [
      question("requirements.traceability", "requirements", [
        "marginal_requirements",
        "requirements_blind_spots",
      ]),
      question("requirements.discovery", "requirements", [
        "requirements_blind_spots",
      ]),
    ],
  },
  {
    id: "data_automation",
    questions: [
      question("data_automation.data", "data_automation", [
        "bielik",
        "data_math_separation",
      ]),
      question("data_automation.ai", "data_automation", [
        "bielik",
        "data_math_separation",
      ]),
    ],
  },
  {
    id: "governance",
    questions: [
      question("governance.boundary", "governance", ["policy_boundary"]),
      question("governance.approvals", "governance", [
        "legacy_procedure",
        "policy_boundary",
      ]),
    ],
  },
  {
    id: "adoption",
    questions: [
      question("adoption.users", "adoption", ["internal_ambassador"]),
      question("adoption.plan", "adoption", ["internal_ambassador"]),
    ],
  },
  {
    id: "value_rollout",
    questions: [
      question("value_rollout.business_case", "value_rollout", [
        "tco",
        "category_transfer",
      ]),
      question("value_rollout.rollout", "value_rollout", ["category_transfer"]),
    ],
  },
];

function worstStatus(statuses: readonly ReadinessStatus[]): ReadinessStatus {
  if (statuses.includes("blocked")) return "blocked";
  if (statuses.includes("risk")) return "risk";
  return "ready";
}

export function evaluateReadiness(
  responses: ReadinessResponses,
): ReadinessResult | null {
  const questions = READINESS_DOMAINS.flatMap(({ questions: domainQuestions }) =>
    domainQuestions.map(({ id }) => id),
  );

  if (
    questions.some(
      (questionId) => !READINESS_STATUSES.includes(responses[questionId] as ReadinessStatus),
    )
  ) {
    return null;
  }

  const domains = READINESS_DOMAINS.map(({ id: domainId, questions: domainQuestions }) => {
    const answers = domainQuestions.map(({ id }) => responses[id] as ReadinessStatus);
    return {
      domainId,
      status: worstStatus(answers),
      riskQuestionIds: domainQuestions
        .filter(({ id }) => responses[id] === "risk")
        .map(({ id }) => id),
      blockedQuestionIds: domainQuestions
        .filter(({ id }) => responses[id] === "blocked")
        .map(({ id }) => id),
    } satisfies ReadinessDomainResult;
  });

  return {
    version: "1.0",
    status: worstStatus(domains.map(({ status }) => status)),
    domains,
  };
}
