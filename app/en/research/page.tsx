import { redirect } from "next/navigation";
import { MODEL_VERSION } from "@/lib/version";

export const metadata = {
  title: `Research Paper — ProcuraCost ${MODEL_VERSION}`,
  description:
    "Neutral decision model comparing formal/sequential and adaptive/compliant procurement paths with scenario uncertainty.",
};

// The research paper is written in English and lives at /research.
// We redirect /en/research to the canonical English version for consistency.
export default function EnResearchPage() {
  redirect("/research");
}
