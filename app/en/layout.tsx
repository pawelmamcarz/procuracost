import NavBar from "@/components/NavBar";

export const metadata = {
  title: "ProcuraCost — Procurement Cost Calculator",
  description:
    "Measure the hidden opportunity costs of rigid procurement procedures versus flexible policy-based compliance.",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar
        brand={{ href: "/en", label: "ProcuraCost" }}
        items={[
          { href: "/en/calculator", label: "Calculator" },
          { href: "/en/optimizer", label: "RF Optimizer", highlight: true },
          { href: "/en/case-studies", label: "Case Studies" },
          { href: "/methodology", label: "Methodology" },
        ]}
        langSwitch={{ href: "/", label: "PL" }}
      />
      {children}
    </>
  );
}
