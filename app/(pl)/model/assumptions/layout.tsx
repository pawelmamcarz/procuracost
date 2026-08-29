import type { Metadata } from "next";
import type { ReactNode } from "react";

import { modelAssumptionsT } from "@/lib/i18n";

export const metadata: Metadata = modelAssumptionsT.pl.metadata;

export default function ModelAssumptionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
