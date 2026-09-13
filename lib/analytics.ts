export const GA_MEASUREMENT_ID = "G-TXEHBTT8E7";

export function analyticsLocation(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.origin !== "https://www.procuracost.com") return null;
    return `${url.origin}${url.pathname}`;
  } catch {
    return null;
  }
}

export function createPageTracker(send: (...args: unknown[]) => void) {
  let initialised = false;
  let previous: string | null = null;
  return (consent: boolean, href: string) => {
    const location = analyticsLocation(href);
    if (!consent || !location || location === previous) return;
    const page = { page_location: location, page_title: new URL(location).pathname, page_referrer: previous ?? "" };
    send("set", page);
    if (!initialised) {
      send("consent", "default", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      send("js", new Date());
      send("config", GA_MEASUREMENT_ID, {
        ...page,
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_expires: 60 * 60 * 24 * 90,
      });
      initialised = true;
    }
    send("event", "page_view", { ...page, send_to: GA_MEASUREMENT_ID });
    previous = location;
  };
}
