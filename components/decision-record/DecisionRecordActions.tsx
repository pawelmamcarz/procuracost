import PDFExport from "@/components/PDFExport";
import ResearchExportBar from "@/components/cost-comparison/ResearchExportBar";
import type { Lang } from "@/lib/i18n";
import type { DecisionRecordV2 } from "@/lib/model-v2";

export interface DecisionRecordActionsProps {
  lang: Lang;
  record: DecisionRecordV2;
}

export default function DecisionRecordActions({
  lang,
  record,
}: DecisionRecordActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 sm:flex-1">
        <ResearchExportBar lang={lang} record={record} />
      </div>
      <PDFExport lang={lang} record={record} />
    </div>
  );
}
