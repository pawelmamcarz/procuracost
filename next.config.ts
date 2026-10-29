import type { NextConfig } from "next";
import { existsSync, lstatSync, realpathSync } from "node:fs";
import { dirname } from "node:path";
import { resolveSiteVersion } from "./lib/version-core";

const buildVersion = resolveSiteVersion(process.env.NEXT_PUBLIC_VERSION);
const linkedDependencies = existsSync("node_modules") && lstatSync("node_modules").isSymbolicLink()
  ? dirname(realpathSync("node_modules"))
  : undefined;

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    ...(linkedDependencies ? { turbopackAdditionalRoots: { linkedDependencies: { path: linkedDependencies } } } : {}),
    globalNotFound: true,
    turbopackPluginRuntimeStrategy: "workerThreads",
    // `next dev` bez limitu sterty w NODE_OPTIONS ustawia dziecku
    // --max-old-space-size na 50% RAM (na 64 GB maszynie to 32 GB), a restartuje
    // je dopiero po przekroczeniu 80% tego limitu - bez backoffu i bez limitu
    // prob. Preload modulow wszystkich tras przy kazdym forku podbija sterte do
    // progu i restarty zamieniaja sie w lawine procesow node. Limit siedzi w
    // skrypcie `dev`, tutaj tniemy zuzycie u zrodla.
    preloadEntriesOnStart: false,
  },
  env: {
    NEXT_PUBLIC_VERSION: buildVersion,
  },
};

export default nextConfig;
