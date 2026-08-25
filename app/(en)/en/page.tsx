import type { Metadata } from "next";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";

export const metadata: Metadata = {
  title: "ProcuraCost | Procurement path cost comparison",
  description:
    "A neutral procurement decision model. Compare formal and adaptive paths, cost components, and the full uncertainty range.",
};

export default function EnHomePage() {
  return <EvidenceFieldHome lang="en" />;
}
