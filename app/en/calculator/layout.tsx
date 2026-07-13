import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procurement Cost Calculator — ProcuraCost",
  description:
    "Compare rigid-procedure costs against policy-based procurement across 7 cost dimensions: time, admin, opportunity, favoritism, renegotiation, TCO, bypass.",
};

export default function EnCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
