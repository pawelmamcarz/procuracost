import type { Metadata } from "next";
import ProcurementBeyond8 from "@/components/ProcurementBeyond8";
import { practiceT } from "@/lib/i18n";

export const metadata: Metadata = practiceT.pl.metadata;

export default function ProcurementBeyond8Page() {
  return <ProcurementBeyond8 lang="pl" />;
}
