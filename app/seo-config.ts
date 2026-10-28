// Production uses the canonical domain; non-production Railway environments must not be indexed.
const PRODUCTION_URL = "https://www.procuracost.com";
const railwayEnvironment = process.env.RAILWAY_ENVIRONMENT_NAME?.trim();
export const IS_PREVIEW = Boolean(railwayEnvironment && railwayEnvironment !== "production");
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim().replace(/\/+$/, "");
export const SITE_URL =
  configuredSiteUrl ||
  (IS_PREVIEW && railwayDomain ? `https://${railwayDomain}` : PRODUCTION_URL);

export const TAGLINE_PL = "Tunel ma ściany. Pole ma horyzont.";
export const TAGLINE_EN = "A tunnel has walls. A field has a horizon.";
