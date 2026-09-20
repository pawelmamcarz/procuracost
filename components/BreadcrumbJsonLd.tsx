import type { Lang } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  jsonLdScriptContent,
  type BreadcrumbCrumb,
} from "@/lib/structured-data";

const HOME_CRUMB: Record<Lang, BreadcrumbCrumb> = {
  pl: { name: "ProcuraCost", path: "/" },
  en: { name: "ProcuraCost", path: "/en" },
};

export default function BreadcrumbJsonLd({ lang, crumbs }: { lang: Lang; crumbs: BreadcrumbCrumb[] }) {
  return (
    <script
      type="application/ld+json"
      data-breadcrumb="true"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(breadcrumbJsonLd([HOME_CRUMB[lang], ...crumbs])) }}
    />
  );
}
