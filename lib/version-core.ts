/** Tesla-style site version: ISO week-year.ISO week.release.patch. */
export const DEFAULT_RELEASE = 1;
export const DEFAULT_PATCH = 2;

export interface ISOWeek {
  year: number;
  week: number;
}

export function getISOWeekParts(date: Date): ISOWeek {
  const thursday = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = thursday.getUTCDay() || 7;
  thursday.setUTCDate(thursday.getUTCDate() + 4 - day);

  const year = thursday.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(
    ((thursday.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );

  return { year, week };
}

export function getISOWeek(date: Date): number {
  return getISOWeekParts(date).week;
}

export function generateSiteVersion(
  date = new Date(),
  release = DEFAULT_RELEASE,
  patch = DEFAULT_PATCH,
): string {
  if (!Number.isInteger(release) || release < 0) {
    throw new Error("Site release number must be a non-negative integer.");
  }
  if (!Number.isInteger(patch) || patch < 0) {
    throw new Error("Site patch number must be a non-negative integer.");
  }

  const { year, week } = getISOWeekParts(date);
  return `${year}.${week}.${release}.${patch}`;
}

const SITE_VERSION_PATTERN =
  /^\d{4}\.(?:[1-9]|[1-4]\d|5[0-3])\.\d+\.\d+$/;

export function resolveSiteVersion(
  override: string | undefined,
  date = new Date(),
): string {
  if (!override) return generateSiteVersion(date);
  if (!SITE_VERSION_PATTERN.test(override)) {
    throw new Error(
      `Invalid NEXT_PUBLIC_VERSION "${override}"; expected year.ISO-week.release.patch.`,
    );
  }
  return override;
}
