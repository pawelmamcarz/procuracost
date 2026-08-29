"use client";

import { Download } from "lucide-react";

import {
  buildResearchDownloadArtifacts,
  type ResearchDownloadFormat,
} from "@/components/decision-record/export-actions";
import { decisionRecordT, type Lang } from "@/lib/i18n";
import type { DecisionRecordV2 } from "@/lib/model-v2";
import { downloadTextFile } from "@/lib/research-export";

export interface ResearchExportBarProps {
  lang: Lang;
  record: DecisionRecordV2;
}

export default function ResearchExportBar({
  lang,
  record,
}: ResearchExportBarProps) {
  const tx = decisionRecordT[lang].actions;
  const labels: Record<ResearchDownloadFormat, string> = {
    json: tx.downloadJson,
    csv: tx.downloadCsv,
    markdown: tx.downloadMarkdown,
  };

  function download(format: ResearchDownloadFormat) {
    const exportedAt = new Date().toISOString();
    const artifact = buildResearchDownloadArtifacts(record, lang, exportedAt).find(
      (candidate) => candidate.format === format
    );
    if (!artifact) return;
    downloadTextFile(artifact.filename, artifact.content, artifact.mime);
  }

  return (
    <div
      aria-label={tx.researchLabel}
      className="grid gap-2 sm:grid-cols-3"
      role="group"
    >
      {(["json", "csv", "markdown"] as const).map((format) => (
        <button
          key={format}
          type="button"
          onClick={() => download(format)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:border-gray-500 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          {labels[format]}
        </button>
      ))}
    </div>
  );
}
