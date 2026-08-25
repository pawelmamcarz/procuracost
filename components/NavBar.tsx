"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";

interface NavItem {
  href: string;
  label: string;
  highlight?: boolean;
  active: boolean;
}

interface NavBarProps {
  brand: { href: string; label: string };
  items: NavItem[];
  lang: Lang;
  langSwitch: { href: string; label: string };
  labels: { primaryNavigation: string; openMenu: string; closeMenu: string };
  pathname: string;
}

function desktopLinkClass(item: NavItem) {
  if (item.active) return "font-semibold text-blue-700";
  return item.highlight ? "font-medium text-blue-600 hover:text-blue-700" : "hover:text-blue-600";
}

function mobileLinkClass(item: NavItem) {
  if (item.active || item.highlight) return "rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700";
  return "rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-blue-700";
}

export default function NavBar({ brand, items, lang, langSwitch, labels, pathname }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const mobileMenuId = `mobile-navigation-${lang}-${pathname.replaceAll("/", "-") || "home"}`;

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <nav aria-label={labels.primaryNavigation} className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link href={brand.href} className="shrink-0 text-xl font-bold tracking-tight text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          {brand.label}
        </Link>

        <div className="hidden items-center gap-4 whitespace-nowrap text-sm text-gray-600 xl:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`${desktopLinkClass(item)} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
            >
              {item.label}
            </Link>
          ))}
          <Link href={langSwitch.href} className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            {langSwitch.label}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-controls={mobileMenuId}
          aria-expanded={open}
          aria-label={open ? labels.closeMenu : labels.openMenu}
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div id={mobileMenuId} className="mx-auto mt-3 grid max-w-7xl grid-cols-1 gap-1 border-t border-gray-100 pt-3 pb-2 text-sm text-gray-700 sm:grid-cols-2 xl:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`${mobileLinkClass(item)} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={langSwitch.href}
            className="mx-3 mt-1 inline-block w-fit rounded-full border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => setOpen(false)}
          >
            {langSwitch.label}
          </Link>
        </div>
      )}
    </nav>
  );
}
