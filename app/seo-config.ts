// Canonical production host is www.procuracost.com (verified live 2026-07-05; the apex
// procuracost.com has no DNS record). VERCEL_URL is always the deployment-specific URL,
// so it must only win on previews — on production it would leak *.vercel.app into og:url.
const PRODUCTION_URL = "https://www.procuracost.com";
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? PRODUCTION_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : PRODUCTION_URL);

export const TAGLINE_PL = "Tunel ma ściany. Pole ma horyzont.";
export const TAGLINE_EN = "A tunnel has walls. A field has a horizon.";
