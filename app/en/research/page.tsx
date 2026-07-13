import { redirect } from "next/navigation";

export const metadata = {
  title: "Research Paper — The Hidden Cost of Procedural Compliance | ProcuraCost",
  description:
    "Methodological working paper on a transparent simulation of rigid and policy-based procurement paths, with empirical anchors separated from modeling assumptions.",
};

// The research paper is written in English and lives at /research.
// We redirect /en/research to the canonical English version for consistency.
export default function EnResearchPage() {
  redirect("/research");
}
