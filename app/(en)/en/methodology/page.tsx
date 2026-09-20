import type { Metadata } from "next";

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MethodologyOverview from "@/components/MethodologyOverview";
import { methodologyOverviewT, navigationT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "methodology",
  ...methodologyOverviewT.en.metadata,
});

export default function EnMethodologyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="en"
        crumbs={[{ name: navigationT.en.methodology, path: "/en/methodology" }]}
      />
      <MethodologyOverview lang="en" />
    </>
  );
}
