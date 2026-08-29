import type { Metadata } from "next";
import type { ReactNode } from "react";

import { modelAssumptionsT } from "@/lib/i18n";

export const metadata: Metadata = modelAssumptionsT.en.metadata;

export default function EnModelAssumptionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
