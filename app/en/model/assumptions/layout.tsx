import type { Metadata } from "next";
import { MODEL_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: `Model ${MODEL_VERSION} assumptions: ProcuraCost`,
  description:
    `Evidence ranges, calibration assumptions and uncertainty in ProcuraCost ${MODEL_VERSION}.`,
};

export default function EnModelAssumptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
