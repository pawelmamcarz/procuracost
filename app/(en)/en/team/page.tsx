import type { Metadata } from "next";

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import TeamPage from "@/components/TeamPage";
import { navigationT, teamT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "team",
  title: teamT.en.metadataTitle,
  description: teamT.en.metadataDescription,
});

export default function TeamEnPageRoute() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="en"
        crumbs={[{ name: navigationT.en.team, path: "/en/team" }]}
      />
      <TeamPage lang="en" />
    </>
  );
}
