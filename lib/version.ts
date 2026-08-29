import { resolveSiteVersion } from "./version-core";

export {
  generateSiteVersion,
  getISOWeek,
  getISOWeekParts,
  resolveSiteVersion,
} from "./version-core";

export const VERSION = resolveSiteVersion(process.env.NEXT_PUBLIC_VERSION);

// Immutable compatibility identity for the archived model 2.2.2 runtime.
export const LEGACY_MODEL_VERSION = "2.2.2" as const;

// Active public model version. This is the only model-version literal to bump
// when the model 2.3 release is cut over.
export const MODEL_VERSION = "2.3.0" as const;
