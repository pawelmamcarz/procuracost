import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AssumptionsRecord from "@/components/decision-record/AssumptionsRecord";
import { decisionRecordT, researchExportV2T, type Lang } from "@/lib/i18n";
import {
  buildDecisionRecordV2,
  createScenarioDraft,
  type CalibratedValue,
} from "@/lib/model-v2";
import { buildPdfCopy } from "@/lib/model-v2/pdf-copy";
import { SCENARIOS_V2 } from "@/lib/model-v2/scenarios";
import {
  buildResearchCsv,
  buildResearchMarkdown,
  RESEARCH_CSV_HEADERS,
} from "@/lib/research-export";

const EXPORTED_AT = "2026-08-28T14:05:06.000Z";
const FIELDS = ["amendmentContractYears", "costPerAmendment"] as const;

function userRange(low: number, central: number, high: number): CalibratedValue {
  return {
    low,
    central,
    high,
    rangeKind: "calibrated",
    evidenceClass: "user_input",
    evidenceIds: [],
  };
}

function formatValue(value: number, lang: Lang, currency: boolean, pdf: boolean) {
  return new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-GB", {
    ...(currency && lang === "pl" ? { style: "currency", currency: "PLN" } : {}),
    minimumFractionDigits: pdf ? 2 : undefined,
    maximumFractionDigits: 2,
  }).format(value) + (currency && lang === "en" ? " PLN" : "");
}

describe("amendment assumption audit rows", () => {
  it.each(["pl", "en"] as const)(
    "includes both ranges and evidence classes in the UI, PDF, CSV and Markdown in %s",
    (lang) => {
      const draft = createScenarioDraft("fleet_tco_reframing");
      draft.economicAssumptions.contractRigidityDiffers = true;
      draft.economicAssumptions.amendmentDisadvantagedAlternative = "formalSequential";
      draft.economicAssumptions.amendmentDifferential = userRange(0.1, 0.2, 0.3);
      draft.economicAssumptions.amendmentContractYears = userRange(1, 2, 3);
      draft.economicAssumptions.costPerAmendment = userRange(100, 200, 300);
      const record = buildDecisionRecordV2(draft);
      const tx = researchExportV2T[lang];
      const html = renderToStaticMarkup(createElement(AssumptionsRecord, { lang, record }));
      const pdf = buildPdfCopy(record, lang, EXPORTED_AT);
      const csv = buildResearchCsv(record, lang);
      const markdown = buildResearchMarkdown(record, lang);

      expect(record.drivers.find(({ id }) => id === "contract_amendment")?.contribution.central).toBeGreaterThan(0);
      expect(html).toContain(decisionRecordT[lang].assumptions.summary(record.retainedAssumptions.length, 3));
      for (const field of FIELDS) {
        const value = record.assumptions[field]!;
        const label = tx.assumptions[field];
        const currency = field === "costPerAmendment";
        const uiRow = html.split("<dt ").find((row) => row.includes(`>${label}</dt>`));
        expect(uiRow).toBeDefined();
        expect(uiRow).toContain(tx.evidenceClasses.user_input);
        for (const key of ["low", "central", "high"] as const) {
          expect(uiRow).toContain(
            `${decisionRecordT[lang].reference[key]}: ${formatValue(value[key], lang, currency, false)}`
          );
        }
        const range = {
          low: formatValue(value.low, lang, currency, true),
          central: formatValue(value.central, lang, currency, true),
          high: formatValue(value.high, lang, currency, true),
        };
        expect(pdf.assumptions.find(({ id }) => id === field)).toEqual({
          id: field,
          label,
          value: range,
          evidenceStatus: tx.evidenceClasses.user_input,
          evidenceIds: [],
        });
        const csvRows = csv.split("\n").filter((row) => row.startsWith(`assumption,${field},`));
        expect(csvRows).toHaveLength(1);
        const cells = csvRows[0].trimEnd().split(",");
        for (const [header, expected] of [
          ["field_id", field],
          ["low", String(value.low)],
          ["central", String(value.central)],
          ["high", String(value.high)],
          ["evidence_class", "user_input"],
          ["localized_label", label],
        ] as const) {
          expect(cells[RESEARCH_CSV_HEADERS.indexOf(header)]).toBe(expected);
        }
        expect(markdown).toContain(
          `| ${label} | ${range.low} / ${range.central} / ${range.high} | ${tx.evidenceClasses.user_input} |`
        );
      }
    }
  );

  it.each(["pl", "en"] as const)("omits both rows for every canonical scenario with null inputs in %s", (lang) => {
    for (const scenario of SCENARIOS_V2) {
      const record = buildDecisionRecordV2(createScenarioDraft(scenario.id));
      const html = renderToStaticMarkup(createElement(AssumptionsRecord, { lang, record }));
      const pdf = buildPdfCopy(record, lang, EXPORTED_AT);
      const csv = buildResearchCsv(record, lang);
      const markdown = buildResearchMarkdown(record, lang);
      for (const field of FIELDS) {
        expect(record.assumptions[field]).toBeNull();
        expect(html).not.toContain(researchExportV2T[lang].assumptions[field]);
        expect(pdf.assumptions.some(({ id }) => id === field)).toBe(false);
        expect(csv).not.toContain(`assumption,${field},`);
        expect(markdown).not.toContain(`| ${researchExportV2T[lang].assumptions[field]} |`);
      }
    }
  });
});
