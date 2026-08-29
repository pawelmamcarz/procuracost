import type { Metadata } from "next";

import TeamPage from "@/components/TeamPage";
import { teamT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "team",
  title: teamT.en.metadataTitle,
  description: teamT.en.metadataDescription,
});

export default function TeamEnPageRoute() {
  return <TeamPage lang="en" />;
}
