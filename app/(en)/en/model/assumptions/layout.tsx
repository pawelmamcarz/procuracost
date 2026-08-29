import type { Metadata } from "next";
import type { ReactNode } from "react";

import { modelAssumptionsT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "modelAssumptions",
  ...modelAssumptionsT.en.metadata,
});

export default function EnModelAssumptionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
