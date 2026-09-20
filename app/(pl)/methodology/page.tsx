import type { Metadata } from "next";

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import MethodologyOverview from "@/components/MethodologyOverview";
import { methodologyOverviewT, navigationT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "methodology",
  ...methodologyOverviewT.pl.metadata,
});

export default function MethodologyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="pl"
        crumbs={[{ name: navigationT.pl.methodology, path: "/methodology" }]}
      />
      <MethodologyOverview lang="pl" />
    </>
  );
}
