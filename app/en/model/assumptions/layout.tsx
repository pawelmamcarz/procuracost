import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Model Assumptions Explorer — ProcuraCost",
  description:
    "Adjust spend type and process phase live and see the exact multipliers the production cost model uses.",
};

export default function EnModelAssumptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
