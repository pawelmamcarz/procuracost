import type { Metadata } from "next";
import ProcurementBeyond8 from "@/components/ProcurementBeyond8";
import { practiceT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "procurementBeyond8",
  ...practiceT.pl.metadata,
});

export default function ProcurementBeyond8Page() {
  return <ProcurementBeyond8 lang="pl" />;
}
