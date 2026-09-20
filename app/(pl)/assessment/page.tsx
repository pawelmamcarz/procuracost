import type { Metadata } from "next";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { navigationT, siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "assessment",
  ...siteMetadataT.pl.processDesignProfile,
});

export default function AssessmentPage() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="pl"
        crumbs={[{ name: navigationT.pl.assessment, path: "/assessment" }]}
      />
      <AssessmentQuiz lang="pl" />
    </>
  );
}
