import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { researchPaperT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "research",
  ...researchPaperT.en.metadata,
  robots: { index: false, follow: true },
});

export default function EnResearchPage() {
  permanentRedirect("/research");
}
