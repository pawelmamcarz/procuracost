import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("SEO origin configuration", () => {
  it.each([
    " https://www.procuracost.com ",
    "https://www.procuracost.com/",
    "https://www.procuracost.com/\n",
  ])("normalises the configured origin %j in robots and sitemap", async (origin) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
    vi.stubEnv("VERCEL_ENV", "production");
    vi.resetModules();
    const { default: robots } = await import("@/app/robots");
    const { default: sitemap } = await import("@/app/sitemap");
    expect(robots().sitemap).toBe("https://www.procuracost.com/sitemap.xml");
    for (const entry of sitemap()) {
      expect(entry.url).toMatch(/^https:\/\/www\.procuracost\.com(?:\/[^\s/]*)*$/);
      for (const url of Object.values(entry.alternates?.languages ?? {})) {
        expect(String(url)).not.toMatch(/\s|\.com\/\//);
      }
    }
  });

  it("falls back to the production host for an empty configured origin", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", " \n");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_URL", "deployment.vercel.app");
    vi.resetModules();
    const { SITE_URL } = await import("@/app/seo-config");
    expect(SITE_URL).toBe("https://www.procuracost.com");
  });
});
