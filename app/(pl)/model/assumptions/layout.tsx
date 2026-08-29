import type { Metadata } from "next";
import type { ReactNode } from "react";

import { modelAssumptionsT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "modelAssumptions",
  ...modelAssumptionsT.pl.metadata,
});

export default function ModelAssumptionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
