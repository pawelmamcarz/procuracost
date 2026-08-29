import type { Metadata } from "next";
import { siteMetadataT } from "@/lib/i18n";

export const metadata: Metadata = siteMetadataT.pl.calculator;

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
