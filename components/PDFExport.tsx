"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import {
  ComparisonResult,
  ProcurementInputs,
  formatPLN,
  getDimensionMultiplierDetails,
} from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";
import { comparisonT, dimensionMultiplierLabelsT } from "@/lib/i18n";
import { MODEL_VERSION, VERSION } from "@/lib/version";

interface Props {
  result: ComparisonResult;
  scenario: Scenario;
  inputs: ProcurementInputs;
}

// jsPDF's built-in Helvetica is WinAnsi (cp1252), which has no Polish diacritics.
// Every ą ć ę ł ń ó ś ź ż and every "zł" in the exported report rendered as mojibake —
// "1 234 567 zB", "Zcielka formalna" — in the one artifact that leaves the site.
// Noto Sans is embedded instead, subsetted to Latin + Latin Extended-A (~23 KB each)
// and fetched only when an export actually runs, so it never enters the page bundle.
const PDF_FONTS = [
  { file: "NotoSans-Regular-subset.ttf", vfs: "NotoSans-Regular.ttf", style: "normal" },
  { file: "NotoSans-Bold-subset.ttf", vfs: "NotoSans-Bold.ttf", style: "bold" },
] as const;

let fontCache: Array<{ vfs: string; style: string; base64: string }> | null = null;

async function loadPdfFonts() {
  if (fontCache) return fontCache;
  fontCache = await Promise.all(
    PDF_FONTS.map(async ({ file, vfs, style }) => {
      const response = await fetch(`/fonts/${file}`);
      if (!response.ok) throw new Error(`font ${file}: HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = "";
      for (let i = 0; i < bytes.length; i += 8192) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      }
      return { vfs, style, base64: btoa(binary) };
    }),
  );
  return fontCache;
}

export default function PDFExport({ result, scenario, inputs }: Props) {
  const [generating, setGenerating] = useState<"pl" | "en" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { spendType, processPhase } = inputs;

  async function generatePDF(exportLang: "pl" | "en") {
    setGenerating(exportLang);
    setError(null);

    try {
      const t = comparisonT[exportLang];
      const labels = t.costLabels;

      // Note: spendType and processPhase are closed over from the component scope
      // (passed via props when the component renders the generate function)

    const fonts = await loadPdfFonts();
    const doc = new jsPDF();
    for (const { vfs, style, base64 } of fonts) {
      doc.addFileToVFS(vfs, base64);
      doc.addFont(vfs, "NotoSans", style);
    }
    doc.setFont("NotoSans", "normal");
    const margin = 18;
    let y = 18;
    let pageNumber = 1;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const now = new Date().toLocaleDateString(exportLang === "pl" ? "pl-PL" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    function addPageHeader() {
      doc.setFillColor(30, 64, 175);
      doc.rect(0, 0, pageWidth, 8, "F");
      doc.setTextColor(30, 64, 175);
      doc.setFontSize(10);
      doc.text("ProcuraCost", margin, 14);
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, 18, pageWidth - margin, 18);
      y = 24;
    }

    function addPageNumber() {
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(`Strona ${pageNumber}`, pageWidth / 2 - 10, pageHeight - 12);
    }

    function checkNewPage(neededSpace: number) {
      if (y + neededSpace > pageHeight - 25) {
        addPageNumber();           // number the page we're leaving
        doc.addPage();
        pageNumber++;
        addPageHeader();
      }
    }

    // First page header
    addPageHeader();
    doc.setFontSize(18);
    doc.text("ProcuraCost", margin, 14);
    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);
    doc.text(
      exportLang === "pl" ? "Raport: Koszty utracone procedur zakupowych" : "Report: Hidden Cost of Procurement Procedures",
      margin,
      22
    );
    y = 30;

    // Scenario + date
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(`${exportLang === "pl" ? "Scenariusz" : "Scenario"}: ${exportLang === "en" ? scenario.nameEn : scenario.name}`, margin, y);
    doc.text(`${exportLang === "pl" ? "Data" : "Date"}: ${now}`, pageWidth - margin - 55, y);
    y += 5;
    doc.text(`Model ${MODEL_VERSION} · Site ${VERSION}`, margin, y);
    y += 5;
    doc.text(
      `${exportLang === "pl" ? "Umowa" : "Contract"}: ${inputs.contractDurationYears} ${exportLang === "pl" ? "lat(a)" : "year(s)"} · ` +
      `${exportLang === "pl" ? "koszt bezczynności" : "inaction cost"}: ${formatPLN(inputs.dailyCostOfInaction)}/${exportLang === "pl" ? "dzień" : "day"}`,
      margin,
      y,
    );
    y += 9;

    // Big delta highlight box
    doc.setFillColor(239, 246, 255); // blue-50
    doc.roundedRect(margin, y, pageWidth - margin * 2, 31, 4, 4, "F");

    doc.setTextColor(30, 64, 175);
    doc.setFontSize(8);
    doc.text(exportLang === "pl" ? "Centralna różnica kosztu (formalna − adaptacyjna)" : "Central cost difference (formal − adaptive)", margin + 8, y + 7);

    doc.setFontSize(20);
    doc.setTextColor(185, 28, 28); // red-700
    doc.text(formatPLN(result.delta), margin + 8, y + 18);

    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    doc.text(
      `${result.deltaPercent >= 0 ? "+" : ""}${result.deltaPercent.toFixed(1)}% | ${exportLang === "pl" ? "zakres" : "range"} ${formatPLN(result.uncertainty.lowDelta)} – ${formatPLN(result.uncertainty.highDelta)}`,
      pageWidth - margin - 8 - 75,
      y + 16
    );

    doc.setFontSize(7);
    doc.setTextColor(75, 85, 99);
    const threshold = result.decisionThreshold.breakEvenDailyCostOfInaction;
    doc.text(
      threshold === null
        ? (exportLang === "pl" ? "Próg równowagi: nie dotyczy" : "Break-even threshold: not applicable")
        : `${exportLang === "pl" ? "Próg równowagi" : "Break-even threshold"}: ${formatPLN(threshold)}/${exportLang === "pl" ? "dzień" : "day"}`,
      margin + 8,
      y + 26,
    );

    y += 39;

    checkNewPage(50);

    // Two comparison boxes
    const boxWidth = (pageWidth - margin * 2 - 6) / 2;
    const boxHeight = 22;

    // Rigid (Tunnel) box
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, y, boxWidth, boxHeight, 3, 3, "F");
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(8);
    doc.text(t.rigidLabel, margin + 6, y + 7);
    doc.setFontSize(15);
    doc.text(formatPLN(result.rigid.total), margin + 6, y + 16);

    // Flexible (Field) box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin + boxWidth + 6, y, boxWidth, boxHeight, 3, 3, "F");
    doc.setTextColor(21, 128, 61);
    doc.setFontSize(8);
    doc.text(t.flexibleLabel, margin + boxWidth + 12, y + 7);
    doc.setFontSize(15);
    doc.text(formatPLN(result.flexible.total), margin + boxWidth + 12, y + 16);

    y += boxHeight + 14;

    // Case study (if present)
    if (scenario.caseStudy) {
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, "FD");
      doc.setTextColor(30, 64, 175);
      doc.setFontSize(9);
      doc.text(scenario.caseStudy.title, margin + 6, y + 7);
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(8);
      const caseInsight = exportLang === "en" ? scenario.caseStudy.insightEn : scenario.caseStudy.insight;
      const insight = caseInsight.length > 140
        ? caseInsight.slice(0, 137) + "…"
        : caseInsight;
      doc.text(insight, margin + 6, y + 13);
      doc.setTextColor(107, 114, 128);
      doc.text(`${exportLang === "pl" ? "Źródło" : "Source"}: ${scenario.caseStudy.source}`, margin + 6, y + 19);
      y += 26;
    }

    checkNewPage(90);

    // Cost breakdown table header
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, y, pageWidth - margin * 2, 7, "F");
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(7);
    doc.text(t.colCostDim.toUpperCase(), margin + 4, y + 5);
    doc.text(t.rigidLabel.toUpperCase(), margin + 72, y + 5);
    doc.text(t.flexibleLabel.toUpperCase(), margin + 112, y + 5);
    doc.text(t.colDiff.toUpperCase(), margin + 155, y + 5);

    y += 8;

    // Table rows
    const costKeys = Object.keys(labels) as Array<keyof typeof comparisonT.pl.costLabels>;

    costKeys.forEach((key, index) => {
      const r = result.rigid[key] as number;
      const f = result.flexible[key] as number;
      const diff = r - f;

      if (index % 2 === 1) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, y - 1, pageWidth - margin * 2, 7, "F");
      }

      doc.setTextColor(55, 65, 81);
      doc.setFontSize(8);
      doc.text(labels[key], margin + 4, y + 4);

      doc.text(formatPLN(r), margin + 72, y + 4);
      doc.text(formatPLN(f), margin + 112, y + 4);

      if (diff > 0) {
        doc.setTextColor(185, 28, 28);
        doc.text(`+${formatPLN(diff)}`, margin + 155, y + 4);
      } else {
        doc.setTextColor(21, 128, 61);
        doc.text(formatPLN(diff), margin + 155, y + 4);
      }

      y += 6.5;
    });

    // Total row
    doc.setFillColor(30, 64, 175);
    doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("TOTAL", margin + 4, y + 5.5);
    doc.text(formatPLN(result.rigid.total), margin + 72, y + 5.5);
    doc.text(formatPLN(result.flexible.total), margin + 112, y + 5.5);
    // Sign must follow the number. A hardcoded "+" printed "+-6 558 zł" on the one
    // built-in scenario constructed to demonstrate that the formal path can win.
    doc.text(`${result.delta >= 0 ? "+" : ""}${formatPLN(result.delta)}`, margin + 155, y + 5.5);

    y += 16;

    // Model Context Adjustments section — numeric multipliers (deepened)
    if (spendType || processPhase) {
      y += 4;
      const details = getDimensionMultiplierDetails(spendType, processPhase);

      const boxHeight = 38 + Math.max(0, (details.length - 3) * 4);
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y, pageWidth - margin * 2, boxHeight, "F");

      doc.setTextColor(75, 85, 99);
      doc.setFontSize(7);
      doc.text(exportLang === "pl" ? "KONTEKST MODELU — ZASTOSOWANE MNOŻNIKI" : "MODEL CONTEXT — APPLIED MULTIPLIERS", margin + 4, y + 5);

      doc.setFontSize(6.5);
      doc.setTextColor(55, 65, 81);
      let ctx = exportLang === "pl" ? "Kontekst: " : "Context: ";
      if (spendType) ctx += (spendType === "direct" ? "Direct (strategiczne)" : "Indirect (wspierające)");
      if (processPhase) ctx += ` × ${processPhase === "upstream" ? "Upstream (strategiczny)" : "Downstream (operacyjny)"}`;
      doc.text(ctx, margin + 4, y + 11);

      // Compact numeric table
      doc.setFontSize(6);
      let my = y + 17;
      const col1 = margin + 4;
      const col2 = margin + 95;

      details.slice(0, 6).forEach((d, idx) => {
        const label = dimensionMultiplierLabelsT[exportLang][d.key];
        const val = `${d.value.toFixed(2)}x`;
        const x = idx % 2 === 0 ? col1 : col2;
        if (idx % 2 === 0 && idx > 0) my += 4.2;
        doc.setTextColor(100, 116, 139);
        doc.text(`• ${label}:`, x, my);
        doc.setTextColor(30, 64, 175);
        doc.text(val, x + (idx % 2 === 0 ? 58 : 52), my);
      });

      doc.setFontSize(5.5);
      doc.setTextColor(120, 113, 108);
      doc.text(exportLang === "pl"
        ? "Jawne korekty pracy ról i narzutu koordynacyjnego. Szczegóły: /model/assumptions"
        : "Explicit role-effort and coordination-overhead factors. Details: /model/assumptions",
        margin + 4, y + boxHeight - 5);

      y += boxHeight + 4;
    }

    checkNewPage(60);

    // Sources section
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(7);
    doc.text(t.sourcesTitle.toUpperCase(), margin, y);
    y += 5;

    doc.setFontSize(6.5);
    doc.setTextColor(75, 85, 99);
    Object.entries(result.sources).forEach(([key, value]) => {
      const label = labels[key as keyof typeof labels] || key;
      const text = `• ${label}: ${value}`;
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - 4);
      checkNewPage(lines.length * 5 + 8);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 1;
    });

    // Add page number to the last page
    addPageNumber();

    // Save
    const filename = `ProcuraCost_${scenario.id || "report"}_${exportLang}.pdf`;
    doc.save(filename);

  } catch (err) {
      console.error("PDF generation failed:", err);
      setError(
        exportLang === "pl"
          ? "Wystąpił błąd podczas generowania PDF. Spróbuj ponownie."
          : "An error occurred while generating the PDF. Please try again."
      );
    } finally {
      setGenerating(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => generatePDF("pl")}
          disabled={!!generating}
          aria-busy={generating === "pl"}
          aria-label={generating === "pl" ? "Generowanie raportu PDF po polsku" : "Pobierz raport PDF po polsku"}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.75 19.77m10.56-5.941l-.001 5.94M10.5 8.5h3M10.5 12h3M12 3v1m0 16v1m8.485-9H21M3 12H2.515M6.343 6.343l-.707-.707M17.657 6.343l.707-.707M6.343 17.657l-.707.707M17.657 17.657l.707.707" />
          </svg>
          {generating === "pl" ? "Generowanie..." : "Raport PDF (PL)"}
        </button>

        <button
          onClick={() => generatePDF("en")}
          disabled={!!generating}
          aria-busy={generating === "en"}
          aria-label={generating === "en" ? "Generating English PDF report" : "Download English PDF report"}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {generating === "en" ? "Generating..." : "Report PDF (EN)"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
