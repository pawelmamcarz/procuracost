import NavBar from "@/components/NavBar";

export const metadata = {
  title: "ProcuraCost — Procurement Cost Calculator",
  description:
    "Simulate the costs of rigid procurement procedures and flexible policy-based approaches.",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar
        brand={{ href: "/en", label: "ProcuraCost" }}
        items={[
          { href: "/en/calculator", label: "Calculator" },
          { href: "/en/optimizer", label: "Optimizer", highlight: true },
          { href: "/en/case-studies", label: "Scenarios" },
          { href: "/methodology", label: "Methodology" },
        ]}
        langSwitch={{ href: "/", label: "PL" }}
      />
      {children}
    </>
  );
}
