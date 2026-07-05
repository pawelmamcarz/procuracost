// No documented production domain exists in README/docs; procuracost.com is inferred from the
// community CTA in lib/shortcasty.ts (episode 20). Falls back to the Vercel preview URL when set.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://procuracost.com");

export const TAGLINE_PL = "Tunel ma ściany. Pole ma horyzont.";
export const TAGLINE_EN = "A tunnel has walls. A field has a horizon.";
