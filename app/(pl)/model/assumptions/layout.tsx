import type { Metadata } from "next";
import { MODEL_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: `Założenia modelu ${MODEL_VERSION}: ProcuraCost`,
  description:
    `Zakresy dowodowe, założenia kalibracyjne i niepewność w ProcuraCost ${MODEL_VERSION}.`,
};

export default function ModelAssumptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
