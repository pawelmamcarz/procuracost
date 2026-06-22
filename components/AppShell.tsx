"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

interface NavItem {
  href: string;
  label: string;
  highlight?: boolean;
}

const navItemsPl: NavItem[] = [
  { href: "/calculator", label: "Kalkulator" },
  { href: "/optimizer", label: "Optymalizator RF", highlight: true },
  { href: "/case-studies", label: "Case studies" },
  { href: "/assessment", label: "Ocena dojrzałości" },
  { href: "/shortcasty", label: "Shortcasty" },
  { href: "/team", label: "Zespół" },
  { href: "/research", label: "Research paper" },
  { href: "/methodology", label: "Methodology" },
];

const navItemsEn: NavItem[] = [
  { href: "/en/calculator", label: "Calculator" },
  { href: "/en/optimizer", label: "RF Optimizer", highlight: true },
  { href: "/en/case-studies", label: "Case Studies" },
  { href: "/methodology", label: "Methodology" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en") ?? false;

  useEffect(() => {
    document.documentElement.lang = isEnglish ? "en" : "pl";
  }, [isEnglish]);

  const brand = { href: isEnglish ? "/en" : "/", label: "ProcuraCost" };
  const items = isEnglish ? navItemsEn : navItemsPl;
  const langSwitch = isEnglish
    ? { href: "/", label: "PL" }
    : { href: "/en", label: "EN" };

  return (
    <>
      <NavBar brand={brand} items={items} langSwitch={langSwitch} />
      <main className="flex-1">{children}</main>
      <SiteFooter lang={isEnglish ? "en" : "pl"} />
    </>
  );
}
