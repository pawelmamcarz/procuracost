import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procurement Cost Calculator: ProcuraCost",
  description:
    "Compare formal and adaptive procurement paths across 7 cost dimensions with a scenario range.",
};

export default function EnCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
