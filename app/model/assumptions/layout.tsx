import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Założenia modelu 2.1 — ProcuraCost",
  description:
    "Zakresy dowodowe, założenia kalibracyjne i niepewność w ProcuraCost 2.1.",
};

export default function ModelAssumptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
