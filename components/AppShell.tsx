"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { navigationT, type Lang } from "@/lib/i18n";
import { localizedCounterpart, navigationFor } from "@/lib/site-routes";

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const lang: Lang = pathname.startsWith("/en") ? "en" : "pl";
  const targetLang: Lang = lang === "en" ? "pl" : "en";
  const labels = navigationT[lang];
  const brand = { href: lang === "en" ? "/en" : "/", label: "ProcuraCost" };
  const items = navigationFor(lang).map((item) => ({ ...item, active: isActiveRoute(pathname, item.href) }));
  const langSwitch = { href: localizedCounterpart(pathname, targetLang), label: labels.languageSwitch };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <>
      <NavBar key={pathname} brand={brand} items={items} lang={lang} langSwitch={langSwitch} labels={labels} pathname={pathname} />
      <main className="flex-1">{children}</main>
      <SiteFooter lang={lang} />
    </>
  );
}
