import { describe, expect, it } from "vitest";
import { createPageTracker, analyticsLocation } from "../lib/analytics";

describe("analytics privacy boundary", () => {
  it("removes query values and fragments and blocks other hosts", () => {
    expect(analyticsLocation("https://www.procuracost.com/calculator?cost=123#private"))
      .toBe("https://www.procuracost.com/calculator");
    expect(analyticsLocation("http://localhost:3000/en")).toBeNull();
    expect(analyticsLocation("https://preview.vercel.app/en")).toBeNull();
  });

  it("requires consent and sends one view per route without private inputs", () => {
    const commands: unknown[][] = [];
    const track = createPageTracker((...args) => commands.push(args));
    track(false, "https://www.procuracost.com/calculator?cost=123");
    expect(commands).toEqual([]);
    track(true, "http://localhost:3000/");
    expect(commands).toEqual([]);
    track(true, "https://www.procuracost.com/calculator?cost=123");
    track(true, "https://www.procuracost.com/calculator?cost=456#secret");
    track(true, "https://www.procuracost.com/en");
    expect(commands.filter(([command]) => command === "event")).toHaveLength(2);
    expect(JSON.stringify(commands)).not.toMatch(/123|456|secret/);
    expect(commands.find(([command]) => command === "config")?.[2])
      .toMatchObject({ send_page_view: false, allow_google_signals: false });
  });
});
