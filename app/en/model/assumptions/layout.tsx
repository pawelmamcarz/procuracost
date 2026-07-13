import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Model 2.0 assumptions — ProcuraCost",
  description:
    "Evidence ranges, calibration assumptions and uncertainty in ProcuraCost 2.0.",
};

export default function EnModelAssumptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
