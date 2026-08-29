import type { Metadata } from "next";
import { siteMetadataT } from "@/lib/i18n";

export const metadata: Metadata = siteMetadataT.en.calculator;

export default function EnCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
