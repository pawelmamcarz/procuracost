import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { researchPaperT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "research",
  ...researchPaperT.en.metadata,
  robots: { index: false, follow: true },
});

// The research paper is written in English and lives at /research.
// We redirect /en/research to the canonical English version for consistency.
export default function EnResearchPage() {
  redirect("/research");
}
