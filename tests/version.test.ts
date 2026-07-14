import { describe, it, expect } from "vitest";
import {
  generateSiteVersion,
  getISOWeek,
  getISOWeekParts,
  resolveSiteVersion,
} from "../lib/version";

describe("(f) getISOWeek at year boundaries (Dec 29 – Jan 4)", () => {
  // ISO-8601 week numbers; dates constructed in the local zone the function reads
  // (it re-derives a UTC date from getFullYear/getMonth/getDate).
  const cases: Array<{ date: string; week: number }> = [
    { date: "2019-12-29", week: 52 }, // Sunday -> last week of 2019
    { date: "2019-12-30", week: 1 },  // Monday -> week 1 of 2020
    { date: "2020-12-31", week: 53 }, // Thursday -> 2020 has 53 ISO weeks
    { date: "2021-01-01", week: 53 }, // Friday -> still week 53 of 2020
    { date: "2021-01-04", week: 1 },  // Monday -> week 1 of 2021
    { date: "2018-12-31", week: 1 },  // Monday -> week 1 of 2019
    { date: "2016-01-01", week: 53 }, // Friday -> week 53 of 2015
    { date: "2023-01-01", week: 52 }, // Sunday -> last week of 2022
    { date: "2024-12-30", week: 1 },  // Monday -> week 1 of 2025
  ];

  for (const { date, week } of cases) {
    it(`${date} -> ISO week ${week}`, () => {
      const [y, m, d] = date.split("-").map(Number);
      expect(getISOWeek(new Date(y, m - 1, d))).toBe(week);
    });
  }

  it("always returns a week in the valid 1..53 range", () => {
    for (let m = 0; m < 12; m++) {
      for (const d of [1, 15, 28]) {
        const w = getISOWeek(new Date(2025, m, d));
        expect(w).toBeGreaterThanOrEqual(1);
        expect(w).toBeLessThanOrEqual(53);
      }
    }
  });
});

describe("Tesla-style site version", () => {
  it("uses ISO week and the current release.patch default", () => {
    expect(generateSiteVersion(new Date(2026, 6, 13))).toBe("2026.29.1.2");
  });

  it("uses the ISO week-year at calendar-year boundaries", () => {
    expect(getISOWeekParts(new Date(2019, 11, 30))).toEqual({ year: 2020, week: 1 });
    expect(generateSiteVersion(new Date(2021, 0, 1))).toBe("2020.53.1.2");
  });

  it("accepts a valid build override", () => {
    expect(resolveSiteVersion("2026.29.2.3")).toBe("2026.29.2.3");
  });

  it("rejects an invalid build override", () => {
    expect(() => resolveSiteVersion("2.0.0")).toThrow(/year\.ISO-week/);
  });
});
