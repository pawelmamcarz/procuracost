"use client";

import { Suspense, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { navigationT, type Lang } from "@/lib/i18n";
import { localizedCounterpart, navigationFor } from "@/lib/site-routes";

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function languageSwitchHref(pathname: string, search: string, hash: string, targetLang: Lang) {
  return localizedCounterpart(`${pathname}${search ? `?${search}` : ""}${hash}`, targetLang);
}

function subscribeToHashChange(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function useHash() {
  return useSyncExternalStore(
    subscribeToHashChange,
    () => window.location.hash,
    () => "",
  );
}

type NavChromeProps = {
  brand: { href: string; label: string };
  items: { href: string; label: string; highlight?: boolean; active: boolean }[];
  lang: Lang;
  targetLang: Lang;
  labels: { languageSwitch: string; primaryNavigation: string; openMenu: string; closeMenu: string };
  pathname: string;
};

function ContextualNavBar({ brand, items, lang, targetLang, labels, pathname }: NavChromeProps) {
  const search = useSearchParams().toString();
  const hash = useHash();
  const langSwitch = { href: languageSwitchHref(pathname, search, hash, targetLang), label: labels.languageSwitch };

  return <NavBar key={`${pathname}?${search}${hash}`} brand={brand} items={items} lang={lang} langSwitch={langSwitch} labels={labels} pathname={pathname} />;
}

export default function AppShell({ children, lang }: { children: React.ReactNode; lang: Lang }) {
  const pathname = usePathname() ?? "/";
  const targetLang: Lang = lang === "en" ? "pl" : "en";
  const labels = navigationT[lang];
  const brand = { href: lang === "en" ? "/en" : "/", label: "ProcuraCost" };
  const items = navigationFor(lang).map((item) => ({ ...item, active: isActiveRoute(pathname, item.href) }));
  const fallbackLangSwitch = { href: localizedCounterpart(pathname, targetLang), label: labels.languageSwitch };

  return (
    <>
      <a
        className="sr-only z-50 bg-white px-5 py-3 font-semibold text-blue-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-2 focus:outline-blue-600"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        {labels.skipToContent}
      </a>
      <Suspense fallback={<NavBar key={pathname} brand={brand} items={items} lang={lang} langSwitch={fallbackLangSwitch} labels={labels} pathname={pathname} />}>
        <ContextualNavBar brand={brand} items={items} lang={lang} targetLang={targetLang} labels={labels} pathname={pathname} />
      </Suspense>
      <main className="min-w-0 flex-1" id="main-content" tabIndex={-1}>{children}</main>
      <SiteFooter lang={lang} />
    </>
  );
}
