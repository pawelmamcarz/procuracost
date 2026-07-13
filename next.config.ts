import type { NextConfig } from "next";
import { resolveSiteVersion } from "./lib/version-core";

const buildVersion = resolveSiteVersion(process.env.NEXT_PUBLIC_VERSION);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_VERSION: buildVersion,
  },
};

export default nextConfig;
