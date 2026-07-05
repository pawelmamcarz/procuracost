import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator kosztów procedur zakupowych — ProcuraCost",
  description:
    "Porównaj koszty procedury sztywnej z polityką zakupową w 7 wymiarach: czas, admin, opportunity, faworyzacja, renegocjacje, TCO, obejścia.",
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
