"use client";

import { useState } from "react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
  highlight?: boolean;
}

interface NavBarProps {
  brand: { href: string; label: string };
  items: NavItem[];
  langSwitch?: { href: string; label: string };
}

export default function NavBar({ brand, items, langSwitch }: NavBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href={brand.href} className="text-lg font-bold text-blue-700">
          {brand.label}
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.highlight
                  ? "font-medium text-blue-600 hover:text-blue-700"
                  : "hover:text-blue-600"
              }
            >
              {item.label}
            </Link>
          ))}
          {langSwitch && (
            <Link
              href={langSwitch.href}
              className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600"
            >
              {langSwitch.label}
            </Link>
          )}
        </div>

        <button
          className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="sm:hidden mx-auto max-w-5xl mt-3 border-t border-gray-100 pt-3 pb-2 flex flex-col gap-4 text-sm text-gray-600">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.highlight ? "font-medium text-blue-600" : "hover:text-blue-600"}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {langSwitch && (
            <Link
              href={langSwitch.href}
              className="inline-block w-fit rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-500"
              onClick={() => setOpen(false)}
            >
              {langSwitch.label}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
