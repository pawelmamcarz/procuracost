import type { Metadata } from "next";

import ModelOverview from "@/components/ModelOverview";
import { modelOverviewT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "model",
  ...modelOverviewT.en.metadata,
});

export default function EnModelPage() {
  return <ModelOverview lang="en" />;
}
