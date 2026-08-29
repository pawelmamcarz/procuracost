import type { Metadata } from "next";

import ModelOverview from "@/components/ModelOverview";
import { modelOverviewT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "model",
  ...modelOverviewT.pl.metadata,
});

export default function ModelPage() {
  return <ModelOverview lang="pl" />;
}
