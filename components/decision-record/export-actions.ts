import type { Lang } from "@/lib/i18n";
import type { DecisionRecordV2 } from "@/lib/model-v2";
import {
  buildResearchCsv,
  buildResearchJson,
  buildResearchMarkdown,
  researchExportBaseName,
} from "@/lib/research-export";

export type ResearchDownloadFormat = "json" | "csv" | "markdown";

export interface ResearchDownloadArtifact {
  format: ResearchDownloadFormat;
  filename: string;
  mime:
    | "application/json"
    | "text/csv;charset=utf-8"
    | "text/markdown;charset=utf-8";
  content: string;
}

export function buildResearchDownloadArtifacts(
  record: DecisionRecordV2,
  lang: Lang,
  exportedAt: string
): readonly ResearchDownloadArtifact[] {
  const baseName = researchExportBaseName(record.metadata.scenarioId, lang);
  return [
    {
      format: "json",
      filename: `${baseName}.json`,
      mime: "application/json",
      content: JSON.stringify(
        buildResearchJson(record, lang, exportedAt),
        null,
        2
      ),
    },
    {
      format: "csv",
      filename: `${baseName}.csv`,
      mime: "text/csv;charset=utf-8",
      content: buildResearchCsv(record, lang),
    },
    {
      format: "markdown",
      filename: `${baseName}.md`,
      mime: "text/markdown;charset=utf-8",
      content: buildResearchMarkdown(record, lang),
    },
  ];
}
