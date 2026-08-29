import type { Metadata } from "next";
import MechanismsEvidencePage from "@/components/MechanismsEvidencePage";

export const metadata: Metadata = {
  title: "Case studies: ProcuraCost",
  description:
    "Ilustracje mechanizmów zakupowych z jawnym oddzieleniem źródeł od wyników modelu.",
};

export default function CaseStudiesPage() {
  return <MechanismsEvidencePage lang="pl" />;
}
