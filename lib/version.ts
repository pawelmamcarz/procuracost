import { resolveSiteVersion } from "./version-core";

export {
  generateSiteVersion,
  getISOWeek,
  getISOWeekParts,
  resolveSiteVersion,
} from "./version-core";

export const VERSION = resolveSiteVersion(process.env.NEXT_PUBLIC_VERSION);

// Semantic version of the quantitative model. Bump whenever formulas,
// parameters, or interpretation of outputs change.
export const MODEL_VERSION = "2.2.1";
