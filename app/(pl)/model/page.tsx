import type { Metadata } from "next";

import ModelOverview from "@/components/ModelOverview";
import { modelOverviewT } from "@/lib/i18n";

export const metadata: Metadata = modelOverviewT.pl.metadata;

export default function ModelPage() {
  return <ModelOverview lang="pl" />;
}
