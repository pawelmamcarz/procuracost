import { describe, it, expect } from "vitest";
import { formatPLN, formatCompact, formatPercent } from "../lib/calculations";

describe("(g) formatting helpers sanity", () => {
  it("formatCompact abbreviates millions, thousands, and small values", () => {
    expect(formatCompact(1_500_000)).toBe("1.5M");
    expect(formatCompact(5_000)).toBe("5k");
    expect(formatCompact(500)).toBe("500");
    expect(formatCompact(0)).toBe("0");
  });

  it("formatCompact preserves the sign of negatives", () => {
    expect(formatCompact(-2_000_000)).toBe("-2.0M");
    expect(formatCompact(-5_000)).toBe("-5k");
    expect(formatCompact(-500)).toBe("-500");
  });

  it("formatPLN renders a PLN currency string with no fractional digits", () => {
    const s = formatPLN(1_234_567);
    expect(s).toContain("zł");
    expect(s).not.toContain(",");
    // grouped digits present
    expect(s.replace(/\D/g, "")).toBe("1234567");
  });

  it("formatPercent shows an explicit sign and one decimal", () => {
    expect(formatPercent(10)).toBe("+10.0%");
    expect(formatPercent(-5)).toBe("-5.0%");
    expect(formatPercent(0)).toBe("+0.0%");
    expect(formatPercent(35.782)).toBe("+35.8%");
  });
});
