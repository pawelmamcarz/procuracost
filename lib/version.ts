/**
 * Tesla-style versioning: yyyy.week.version.patch
 *
 * - Year and ISO week number are computed automatically (never manual).
 * - The third segment ("version" within the week) and patch default to 0.
 * - To mark a specific notable release within the same week, set at build time:
 *     NEXT_PUBLIC_VERSION=2026.19.3.0 npm run build
 */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function generateTeslaVersion(): string {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  return `${year}.${week}.0.0`;
}

export const VERSION =
  process.env.NEXT_PUBLIC_VERSION || generateTeslaVersion();

// Semantic version of the quantitative model. Bump whenever formulas,
// parameters, or interpretation of outputs change.
export const MODEL_VERSION = "1.2.0";
