import TeamPage from "@/components/TeamPage";
import { teamT } from "@/lib/i18n";

export const metadata = {
  title: teamT.en.metadataTitle,
  description: teamT.en.metadataDescription,
};

export default function TeamEnPageRoute() {
  return <TeamPage lang="en" />;
}
