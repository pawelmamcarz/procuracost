import type { Metadata } from "next";

import TeamPage from "@/components/TeamPage";
import { teamT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "team",
  title: teamT.pl.metadataTitle,
  description: teamT.pl.metadataDescription,
});

export default function TeamPageRoute() {
  return <TeamPage lang="pl" />;
}
