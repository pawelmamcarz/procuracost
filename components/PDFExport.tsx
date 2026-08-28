"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { jsPDF } from "jspdf";

import { renderDecisionRecordPdf } from "@/components/pdf/render-decision-record-pdf";
import { decisionRecordT, type Lang } from "@/lib/i18n";
import {
  buildPdfCopy,
  type DecisionRecordV2,
  type PdfCopyV2,
} from "@/lib/model-v2";

export interface PDFExportProps {
  lang: Lang;
  record: DecisionRecordV2;
}

const PDF_FONTS = [
  {
    file: "NotoSans-Regular-subset.ttf",
    vfs: "NotoSans-Regular.ttf",
    style: "normal",
  },
  {
    file: "NotoSans-Bold-subset.ttf",
    vfs: "NotoSans-Bold.ttf",
    style: "bold",
  },
] as const;

interface EmbeddedPdfFont {
  vfs: string;
  style: (typeof PDF_FONTS)[number]["style"];
  base64: string;
}

let fontPromise: Promise<readonly EmbeddedPdfFont[]> | null = null;

async function loadPdfFonts(): Promise<readonly EmbeddedPdfFont[]> {
  if (!fontPromise) {
    fontPromise = Promise.all(
      PDF_FONTS.map(async ({ file, vfs, style }) => {
        const response = await fetch("/fonts/" + file);
        if (!response.ok) {
          throw new Error("font " + file + ": HTTP " + response.status);
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        let binary = "";
        for (let offset = 0; offset < bytes.length; offset += 8192) {
          binary += String.fromCharCode(
            ...bytes.subarray(offset, offset + 8192)
          );
        }
        return { vfs, style, base64: btoa(binary) };
      })
    ).catch((error: unknown) => {
      fontPromise = null;
      throw error;
    });
  }
  return fontPromise;
}

export function renderAndSaveDecisionRecordPdf(
  doc: jsPDF,
  copy: PdfCopyV2
): void {
  renderDecisionRecordPdf(doc, copy);
  doc.save(copy.filename);
}

export default function PDFExport({ lang, record }: PDFExportProps) {
  const [generating, setGenerating] = useState(false);
  const [failed, setFailed] = useState(false);
  const tx = decisionRecordT[lang].actions;

  async function downloadPdf() {
    setGenerating(true);
    setFailed(false);
    try {
      const [{ default: JsPDF }, fonts] = await Promise.all([
        import("jspdf"),
        loadPdfFonts(),
      ]);
      const copy = buildPdfCopy(record, lang, new Date().toISOString());
      const doc = new JsPDF();
      for (const font of fonts) {
        doc.addFileToVFS(font.vfs, font.base64);
        doc.addFont(font.vfs, "NotoSans", font.style);
      }
      doc.setFont("NotoSans", "normal");
      renderAndSaveDecisionRecordPdf(doc, copy);
    } catch {
      setFailed(true);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={downloadPdf}
        disabled={generating}
        aria-busy={generating}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        <Download aria-hidden="true" className="h-4 w-4" />
        {generating ? tx.generatingPdf : tx.downloadPdf}
      </button>
      {failed ? (
        <p
          role="status"
          className="border-l-2 border-amber-500 bg-amber-50 px-3 py-2 text-xs leading-5 text-gray-700"
        >
          {tx.pdfError}
        </p>
      ) : null}
    </div>
  );
}
