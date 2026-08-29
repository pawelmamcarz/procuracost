import { redirect } from "next/navigation";
import { researchPaperT } from "@/lib/i18n";

export const metadata = researchPaperT.en.metadata;

// The research paper is written in English and lives at /research.
// We redirect /en/research to the canonical English version for consistency.
export default function EnResearchPage() {
  redirect("/research");
}
