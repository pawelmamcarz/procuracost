import type { Metadata } from "next";
import MechanismsEvidencePage from "@/components/MechanismsEvidencePage";

export const metadata: Metadata = {
  title: "Case Studies | ProcuraCost",
  description:
    "Procurement-mechanism illustrations with sources kept separate from model outputs.",
};

export default function EnCaseStudiesPage() {
  return <MechanismsEvidencePage lang="en" />;
}
