import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator kosztów procedur zakupowych: ProcuraCost",
  description:
    "Porównaj formalną i adaptacyjną ścieżkę zakupu w 7 wymiarach wraz z zakresem scenariuszowym.",
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
