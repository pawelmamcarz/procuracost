import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eksplorator założeń modelu — ProcuraCost",
  description:
    "Dostosuj typ wydatku i fazę procesu na żywo i zobacz dokładne mnożniki, których używa produkcyjny model kosztów.",
};

export default function ModelAssumptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
