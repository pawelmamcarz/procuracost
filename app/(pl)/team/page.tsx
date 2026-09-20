import type { Metadata } from "next";

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import TeamPage from "@/components/TeamPage";
import { navigationT, teamT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "team",
  title: teamT.pl.metadataTitle,
  description: teamT.pl.metadataDescription,
});

export default function TeamPageRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="pl"
        crumbs={[{ name: navigationT.pl.team, path: "/team" }]}
      />
      <TeamPage lang="pl" />
    </>
  );
}
