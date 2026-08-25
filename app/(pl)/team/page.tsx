import TeamPage from "@/components/TeamPage";
import { teamT } from "@/lib/i18n";

export const metadata = {
  title: teamT.pl.metadataTitle,
  description: teamT.pl.metadataDescription,
};

export default function TeamPageRoute() {
  return <TeamPage lang="pl" />;
}
