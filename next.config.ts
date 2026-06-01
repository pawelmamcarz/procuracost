import type { NextConfig } from "next";

/**
 * Tesla-style version computed at build time.
 * This ensures production builds always get the correct year.week without manual editing.
 */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const now = new Date();
const buildYear = now.getFullYear();
const buildWeek = getISOWeek(now);
const buildVersion = `${buildYear}.${buildWeek}.0.0`;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_VERSION: buildVersion,
  },
};

export default nextConfig;
