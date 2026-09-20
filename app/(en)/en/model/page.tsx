import type { Metadata } from "next";

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ModelOverview from "@/components/ModelOverview";
import { modelOverviewT, navigationT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "model",
  ...modelOverviewT.en.metadata,
});

export default function EnModelPage() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="en"
        crumbs={[{ name: navigationT.en.model, path: "/en/model" }]}
      />
      <ModelOverview lang="en" />
    </>
  );
}
