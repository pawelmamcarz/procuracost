import type { Metadata } from "next";

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ModelOverview from "@/components/ModelOverview";
import { modelOverviewT, navigationT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "model",
  ...modelOverviewT.pl.metadata,
});

export default function ModelPage() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="pl"
        crumbs={[{ name: navigationT.pl.model, path: "/model" }]}
      />
      <ModelOverview lang="pl" />
    </>
  );
}
