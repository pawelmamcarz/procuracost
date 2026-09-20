import type { Metadata } from "next";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { navigationT, siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "assessment",
  ...siteMetadataT.en.processDesignProfile,
});

export default function AssessmentPageEn() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="en"
        crumbs={[{ name: navigationT.en.assessment, path: "/en/assessment" }]}
      />
      <AssessmentQuiz lang="en" />
    </>
  );
}
