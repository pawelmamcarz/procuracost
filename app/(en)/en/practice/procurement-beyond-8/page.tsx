import type { Metadata } from "next";
import ProcurementBeyond8 from "@/components/ProcurementBeyond8";
import { practiceT } from "@/lib/i18n";

export const metadata: Metadata = practiceT.en.metadata;

export default function EnProcurementBeyond8Page() {
  return <ProcurementBeyond8 lang="en" />;
}
