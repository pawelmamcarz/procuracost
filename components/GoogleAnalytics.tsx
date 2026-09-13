"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { analyticsT, type Lang } from "@/lib/i18n";
import { analyticsLocation, createPageTracker, GA_MEASUREMENT_ID } from "@/lib/analytics";

const CONSENT_KEY = "procuracost-analytics-consent";
const CHANGE_EVENT = "procuracost-analytics-change";
let fallbackConsent: string | null = null;

function snapshot() {
  try {
    const value = localStorage.getItem(CONSENT_KEY) ?? fallbackConsent;
    return value === "granted" || value === "denied" ? value : null;
  }
  catch { return fallbackConsent; }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of ["", "; domain=www.procuracost.com", "; domain=.procuracost.com"]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

export default function GoogleAnalytics({ lang }: { lang: Lang }) {
  const tx = analyticsT[lang];
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribe, snapshot, () => null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const started = useRef(false);
  const track = useRef<ReturnType<typeof createPageTracker> | null>(null);
  const allowed = consent === "granted";

  useEffect(() => {
    if (!allowed) {
      if (started.current) {
        clearAnalyticsCookies();
        window.location.reload();
      }
      return;
    }
    if (!analyticsLocation(window.location.href)) return;
    const target = window as Window & { dataLayer?: unknown[] };
    target.dataLayer ??= [];
    track.current ??= createPageTracker(function () {
      // gtag queues an Arguments object, not a dataLayer event object.
      // eslint-disable-next-line prefer-rest-params
      target.dataLayer!.push(arguments);
    });
    track.current(true, window.location.href);
    started.current = true;
  }, [allowed, pathname]);

  function choose(value: "granted" | "denied") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      fallbackConsent = null;
    }
    catch { fallbackConsent = value; }
    setSettingsOpen(false);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  const productionHost = typeof window !== "undefined" && !!analyticsLocation(window.location.href);
  const showChoice = !consent || settingsOpen;
  return (
    <>
      {allowed && productionHost && (
        <Script id="procuracost-ga4" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      )}
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-600">
        <div className="mx-auto max-w-5xl">
          <button type="button" className="min-h-11 underline underline-offset-4" onClick={() => setSettingsOpen(!settingsOpen)} aria-expanded={showChoice}>
            {tx.settings}
          </button>
        </div>
      </div>
      {showChoice && (
        <section aria-label={tx.title} className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-blue-700 bg-white px-5 py-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-sm font-semibold text-gray-900">{tx.title}</h2>
            <p className="mt-2 max-w-3xl text-sm text-gray-700">{tx.description}</p>
            <a className="mt-2 inline-block text-xs underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">{tx.privacy}</a>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm" onClick={() => choose("denied")}>{tx.reject}</button>
              <button type="button" className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm" onClick={() => choose("granted")}>{tx.accept}</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
