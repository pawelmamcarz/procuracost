import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("SEO origin configuration", () => {
  it("passes Railway environment metadata to the Docker build", () => {
    const dockerfile = readFileSync("Dockerfile", "utf8");
    for (const name of ["RAILWAY_ENVIRONMENT_NAME", "RAILWAY_PUBLIC_DOMAIN"]) {
      expect(dockerfile).toMatch(new RegExp(`^ARG ${name}$`, "m"));
    }
  });
  it.each([
    " https://www.procuracost.com ",
    "https://www.procuracost.com/",
    "https://www.procuracost.com/\n",
  ])("normalises the configured origin %j in robots and sitemap", async (origin) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
    vi.stubEnv("RAILWAY_ENVIRONMENT_NAME", "production");
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
    vi.stubEnv("RAILWAY_ENVIRONMENT_NAME", "production");
    vi.stubEnv("RAILWAY_PUBLIC_DOMAIN", "production.up.railway.app");
    vi.resetModules();
    const { SITE_URL } = await import("@/app/seo-config");
    expect(SITE_URL).toBe("https://www.procuracost.com");
  });

  it("uses the Railway domain and disables indexing in non-production environments", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("RAILWAY_ENVIRONMENT_NAME", "staging");
    vi.stubEnv("RAILWAY_PUBLIC_DOMAIN", "preview.up.railway.app");
    vi.resetModules();
    const { SITE_URL, IS_PREVIEW } = await import("@/app/seo-config");
    expect(SITE_URL).toBe("https://preview.up.railway.app");
    expect(IS_PREVIEW).toBe(true);
  });
});
