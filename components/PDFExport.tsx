"use client";

import { useState } from "react";
import { ComparisonResult, formatPLN } from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";

interface Props {
  result: ComparisonResult;
  scenario: Scenario;
  lang?: "pl" | "en";
}

const COST_LABELS_PL: Record<string, string> = {
  timeCost: "Koszt czasu",
  adminCost: "Koszty administracyjne",
  opportunityCost: "Utracone okazje",
  productivityCost: "Spadek produktywności dostawcy",
  renegotiationCost: "Koszty renegocjacji",
  tcoCost: "Utracone oszczędności TCO",
  bypassCost: "Koszty obejść tunelu",
};

const COST_LABELS_EN: Record<string, string> = {
  timeCost: "Time Cost",
  adminCost: "Administrative Overhead",
  opportunityCost: "Opportunity Cost",
  productivityCost: "Supplier Productivity Drag",
  renegotiationCost: "Renegotiation Cost",
  tcoCost: "Foregone TCO Savings",
  bypassCost: "Bypass Risk Cost",
};

export default function PDFExport({ result, scenario, lang = "pl" }: Props) {
  const [generating, setGenerating] = useState(false);

  function openPrintView(exportLang: "pl" | "en") {
    const labels = exportLang === "pl" ? COST_LABELS_PL : COST_LABELS_EN;
    const now = new Date().toLocaleDateString(exportLang === "pl" ? "pl-PL" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const rows = (Object.keys(labels) as Array<keyof typeof result.rigid>)
      .map((key) => {
        const r = result.rigid[key as keyof typeof result.rigid] as number;
        const f = result.flexible[key as keyof typeof result.flexible] as number;
        const diff = r - f;
        return `
          <tr>
            <td>${labels[key]}</td>
            <td class="red">${formatPLN(r)}</td>
            <td class="green">${formatPLN(f)}</td>
            <td class="${diff > 0 ? "red" : "green"}">${diff > 0 ? "+" : ""}${formatPLN(diff)}</td>
          </tr>`;
      })
      .join("");

    const title =
      exportLang === "pl"
        ? "Raport: Koszty utracone procedur zakupowych"
        : "Report: Hidden Cost of Procurement Procedures";

    const html = `<!DOCTYPE html>
<html lang="${exportLang}">
<head>
  <meta charset="UTF-8">
  <title>ProcuraCost — ${scenario.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #1f2937; padding: 32px 40px; }
    .header { border-bottom: 2px solid #1d4ed8; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 18px; font-weight: 700; color: #1d4ed8; }
    .header p { color: #6b7280; font-size: 10px; margin-top: 4px; }
    .headline { background: linear-gradient(135deg, #1d4ed8, #1e40af); color: white; border-radius: 8px; padding: 20px 24px; margin-bottom: 20px; }
    .headline .label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
    .headline .amount { font-size: 28px; font-weight: 700; margin: 4px 0; }
    .headline .sub { font-size: 12px; opacity: 0.9; }
    .totals { display: flex; gap: 16px; margin-bottom: 20px; }
    .total-box { flex: 1; border-radius: 6px; padding: 12px 16px; }
    .total-box.red-box { background: #fef2f2; border: 1px solid #fecaca; }
    .total-box.green-box { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .total-box .label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .total-box.red-box .label { color: #dc2626; }
    .total-box.green-box .label { color: #16a34a; }
    .total-box .value { font-size: 18px; font-weight: 700; margin-top: 4px; }
    .total-box.red-box .value { color: #dc2626; }
    .total-box.green-box .value { color: #16a34a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { text-align: left; padding: 8px 10px; background: #f9fafb; font-size: 9px; font-weight: 600; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
    td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; }
    tfoot td { font-weight: 700; background: #f9fafb; border-top: 1px solid #e5e7eb; }
    .red { color: #dc2626; }
    .green { color: #16a34a; }
    .sources { background: #f9fafb; border-radius: 6px; padding: 12px 16px; }
    .sources h3 { font-size: 9px; text-transform: uppercase; color: #9ca3af; margin-bottom: 6px; letter-spacing: 1px; }
    .sources li { margin-bottom: 3px; color: #6b7280; font-size: 9px; }
    .case-study { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; }
    .case-study h3 { font-size: 10px; font-weight: 700; color: #1d4ed8; margin-bottom: 4px; }
    .case-study p { color: #374151; font-size: 10px; }
    .case-study .src { color: #6b7280; font-size: 9px; margin-top: 4px; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 9px; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 20px 28px; }
      @page { margin: 1cm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ProcuraCost — ${title}</h1>
    <p>${exportLang === "pl" ? "Scenariusz" : "Scenario"}: ${scenario.name} · ${exportLang === "pl" ? "Data" : "Date"}: ${now}</p>
  </div>

  <div class="headline">
    <div class="label">${exportLang === "pl" ? "Koszt utracony przywiązania do procedur" : "Hidden cost of procedural compliance"}</div>
    <div class="amount">${formatPLN(result.delta)}</div>
    <div class="sub">${exportLang === "pl" ? `+${result.deltaPercent.toFixed(1)}% wyższy niż podejście oparte na polityce zakupowej` : `+${result.deltaPercent.toFixed(1)}% higher than policy-based procurement`}</div>
  </div>

  <div class="totals">
    <div class="total-box red-box">
      <div class="label">${exportLang === "pl" ? "Procedura sztywna" : "Rigid Procedure"}</div>
      <div class="value">${formatPLN(result.rigid.total)}</div>
    </div>
    <div class="total-box green-box">
      <div class="label">${exportLang === "pl" ? "Polityka zakupowa" : "Procurement Policy"}</div>
      <div class="value">${formatPLN(result.flexible.total)}</div>
    </div>
  </div>

  ${
    scenario.caseStudy
      ? `<div class="case-study">
    <h3>${scenario.caseStudy.title}</h3>
    <p>${scenario.caseStudy.insight}</p>
    <div class="src">${exportLang === "pl" ? "Źródło" : "Source"}: ${scenario.caseStudy.source}</div>
  </div>`
      : ""
  }

  <table>
    <thead>
      <tr>
        <th>${exportLang === "pl" ? "Wymiar kosztów" : "Cost Dimension"}</th>
        <th class="red">${exportLang === "pl" ? "Procedura sztywna" : "Rigid Procedure"}</th>
        <th class="green">${exportLang === "pl" ? "Polityka zakupowa" : "Policy-Based"}</th>
        <th>${exportLang === "pl" ? "Różnica" : "Difference"}</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td>${exportLang === "pl" ? "SUMA" : "TOTAL"}</td>
        <td class="red">${formatPLN(result.rigid.total)}</td>
        <td class="green">${formatPLN(result.flexible.total)}</td>
        <td class="red">+${formatPLN(result.delta)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="sources">
    <h3>${exportLang === "pl" ? "Źródła naukowe modelu" : "Academic Sources"}</h3>
    <ul>
      ${Object.entries(result.sources)
        .map(([k, v]) => `<li><strong>${labels[k]}:</strong> ${v}</li>`)
        .join("")}
    </ul>
  </div>

  <div class="footer">
    <span>ProcuraCost · Model oparty na badaniach akademickich</span>
    <span>${now}</span>
  </div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (w) {
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => { setGenerating(true); openPrintView(lang); setTimeout(() => setGenerating(false), 1000); }}
        disabled={generating}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.75 19.77m10.56-5.941l-.001 5.94M10.5 8.5h3M10.5 12h3M12 3v1m0 16v1m8.485-9H21M3 12H2.515M6.343 6.343l-.707-.707M17.657 6.343l.707-.707M6.343 17.657l-.707.707M17.657 17.657l.707.707" />
        </svg>
        {lang === "pl" ? "Raport PDF (PL)" : "Report PDF (EN)"}
      </button>
      <button
        onClick={() => { setGenerating(true); openPrintView(lang === "pl" ? "en" : "pl"); setTimeout(() => setGenerating(false), 1000); }}
        disabled={generating}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {lang === "pl" ? "Report PDF (EN)" : "Raport PDF (PL)"}
      </button>
    </div>
  );
}
