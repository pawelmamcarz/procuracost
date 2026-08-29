import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import DecisionRecord from "@/components/decision-record/DecisionRecord";
import {
  MODEL_ASSUMPTIONS_DATA,
  type ModelAssumptionsData,
} from "@/components/model-assumptions/model-assumptions-data";
import {
  buildDecisionRecordV2,
  buildPdfCopy,
  createScenarioDraft,
  type DecisionRecordV2,
  type EvidenceRecord,
  type PdfCopyV2,
} from "@/lib/model-v2";
import { buildReplicationBundle } from "@/lib/model-v2/replication";
import {
  buildResearchCsv,
  buildResearchJson,
  buildResearchMarkdown,
  type ResearchJsonV2,
} from "@/lib/research-export";

const INTERNAL_EVIDENCE_ID =
  "model_2_3_mechanism_workflow_allocations";
const EXPORTED_AT = "2026-08-29T08:00:00.000Z";

type RecordWithInternalEvidence = DecisionRecordV2 & {
  internalEvidence?: EvidenceRecord[];
};

type JsonWithInternalEvidence = ResearchJsonV2 & {
  evidence: ResearchJsonV2["evidence"] & {
    internalEvidence?: EvidenceRecord[];
  };
};

type PdfWithInternalEvidence = PdfCopyV2 & {
  internalEvidence?: PdfCopyV2["externalEvidence"];
  sectionLabels: PdfCopyV2["sectionLabels"] & {
    internalEvidence?: string;
  };
};

type AssumptionsWithInternalEvidence = ModelAssumptionsData & {
  provenance: ModelAssumptionsData["provenance"] & {
    internalEvidence?: readonly EvidenceRecord[];
  };
};

function fleetRecord(): RecordWithInternalEvidence {
  return buildDecisionRecordV2(
    createScenarioDraft("fleet_tco_reframing")
  ) as RecordWithInternalEvidence;
}

describe("model 2.3 internal workflow evidence", () => {
  it("separates illustrative workflow provenance from external evidence in the decision record", () => {
    const record = fleetRecord();

    expect(record.internalEvidence?.map(({ id }) => id)).toEqual([
      INTERNAL_EVIDENCE_ID,
    ]);
    expect(record.internalEvidence?.[0]).toMatchObject({
      id: INTERNAL_EVIDENCE_ID,
      type: "illustrative_scenario",
      source: { publicationKind: "internal_model_record" },
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
    });
    expect(record.externalEvidence.map(({ id }) => id)).not.toContain(
      INTERNAL_EVIDENCE_ID
    );

    const workflowAnchors = record.calculationAnchors.filter(({ path }) =>
      path.includes("workflowDesign.steps")
    );
    expect(workflowAnchors.length).toBeGreaterThan(0);
    expect(
      workflowAnchors
        .filter(({ evidenceClass }) => evidenceClass !== "legal_rule")
        .every(
          ({ evidenceClass, evidenceIds }) =>
            evidenceClass === "illustrative_scenario" &&
            evidenceIds.includes(INTERNAL_EVIDENCE_ID) &&
            evidenceIds.includes(
              "scenario.fleet_tco_reframing.retained-legacy"
            )
        )
    ).toBe(true);
    expect(record.retainedAssumptions.map(({ id }) => id)).toEqual([
      "scenario.fleet_tco_reframing.retained-legacy",
    ]);
  });

  it("exports internal workflow provenance as its own JSON, CSV and Markdown collection", () => {
    const record = fleetRecord();
    const json = buildResearchJson(
      record,
      "en",
      EXPORTED_AT
    ) as JsonWithInternalEvidence;
    const csv = buildResearchCsv(record, "en");
    const markdown = buildResearchMarkdown(record, "en");

    expect(json.evidence.internalEvidence?.map(({ id }) => id)).toEqual([
      INTERNAL_EVIDENCE_ID,
    ]);
    expect(csv).toContain(
      `internal_evidence,${INTERNAL_EVIDENCE_ID},,supportedClaim`
    );
    expect(csv).not.toContain(
      `external_evidence,${INTERNAL_EVIDENCE_ID}`
    );
    expect(markdown).toContain("## Internal workflow provenance");
    expect(markdown).toContain(
      "Model 2.3 mechanism-workflow allocations"
    );
    expect(markdown).toContain(
      "External case studies support only the named mechanisms."
    );
  });

  it("keeps internal workflow provenance separate in PDF copy and the rendered record", () => {
    const record = fleetRecord();
    const copy = buildPdfCopy(
      record,
      "en",
      EXPORTED_AT
    ) as PdfWithInternalEvidence;
    const markup = renderToStaticMarkup(
      createElement(DecisionRecord, { lang: "en", record })
    );

    expect(copy.sectionLabels.internalEvidence).toBe(
      "Internal workflow provenance"
    );
    expect(copy.internalEvidence?.map(({ id }) => id)).toEqual([
      INTERNAL_EVIDENCE_ID,
    ]);
    expect(copy.externalEvidence.map(({ id }) => id)).not.toContain(
      INTERNAL_EVIDENCE_ID
    );
    expect(markup).toContain("Internal workflow provenance");
    expect(markup).toContain(
      "Model 2.3 mechanism-workflow allocations"
    );
  });

  it("publishes an isolated internal provenance collection on the assumptions page data boundary", () => {
    const data = MODEL_ASSUMPTIONS_DATA as AssumptionsWithInternalEvidence;

    expect(data.provenance.internalEvidence?.map(({ id }) => id)).toEqual([
      INTERNAL_EVIDENCE_ID,
    ]);
    expect(data.provenance.externalEvidence.map(({ id }) => id)).not.toContain(
      INTERNAL_EVIDENCE_ID
    );
    expect(Object.isFrozen(data.provenance.internalEvidence)).toBe(true);
    expect(Object.isFrozen(data.provenance.internalEvidence?.[0])).toBe(true);
  });

  it("carries internal workflow provenance into the canonical replication scenario", () => {
    const record = fleetRecord();
    const records = Array.from({ length: 10 }, () => record);
    const ordered = [
      "fleet_tco_reframing",
      "erp_transformation_discovery",
      "logistics_service_redesign",
      "critical_material_continuity",
      "public_it_open_with_market_consultation",
      "stable_private_standard_service",
      "stable_capex_replacement",
      "discovery_solution_codesign",
      "catalog_calloff_control",
      "mrp_release_control",
    ] as const;
    for (const [index, scenarioId] of ordered.entries()) {
      records[index] = buildDecisionRecordV2(createScenarioDraft(scenarioId));
    }
    const scenario = buildReplicationBundle(records).scenarios[0] as ReturnType<
      typeof buildReplicationBundle
    >["scenarios"][number] & { internalEvidence?: EvidenceRecord[] };

    expect(scenario.internalEvidence?.map(({ id }) => id)).toEqual([
      INTERNAL_EVIDENCE_ID,
    ]);
    expect(scenario.externalEvidence.map(({ id }) => id)).not.toContain(
      INTERNAL_EVIDENCE_ID
    );
  });
});
