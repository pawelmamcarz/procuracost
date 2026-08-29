import type { Metadata } from "next";

import ModelOverview from "@/components/ModelOverview";
import { modelOverviewT } from "@/lib/i18n";

export const metadata: Metadata = modelOverviewT.en.metadata;

export default function EnModelPage() {
  return <ModelOverview lang="en" />;
}
