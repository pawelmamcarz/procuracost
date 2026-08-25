import type { Metadata } from "next";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";

export const metadata: Metadata = {
  title: "ProcuraCost | Porównanie kosztów ścieżek zakupowych",
  description:
    "Neutralny model decyzji zakupowych. Porównaj ścieżkę formalną i adaptacyjną, składniki kosztu oraz pełny zakres niepewności.",
};

export default function HomePage() {
  return <EvidenceFieldHome lang="pl" />;
}
