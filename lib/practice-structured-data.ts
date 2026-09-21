import { practiceT, type Lang } from "@/lib/i18n";
import { PROCUREMENT_BEYOND_8 } from "@/lib/model-v2";

const PRACTICE_PATH = {
  pl: "/practice/procurement-beyond-8",
  en: "/en/practice/procurement-beyond-8",
} as const;

const RECORDING_LANGUAGE = "pl";

const INTERVIEWEE = {
  "@type": "Person",
  name: "Paweł Mamcarz",
  url: "https://mamcarz.com",
  sameAs: ["https://mamcarz.com", "https://www.linkedin.com/in/pawelmamcarz/"],
} as const;

export function isoDuration(totalSeconds: number): string {
  if (!Number.isInteger(totalSeconds) || totalSeconds < 0) {
    throw new Error("A recording duration must be a non-negative whole number of seconds.");
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `PT${hours}H${minutes}M${seconds}S`;
}

export function youTubeVideoId(watchUrl: string): string {
  const id = new URL(watchUrl).searchParams.get("v");
  if (!id) throw new Error(`Practitioner source URL carries no YouTube video id: ${watchUrl}`);
  return id;
}

export function procurementBeyond8VideoJsonLd({
  lang,
  siteUrl,
}: {
  lang: Lang;
  siteUrl: string;
}) {
  const tx = practiceT[lang];
  const source = PROCUREMENT_BEYOND_8;
  const videoId = youTubeVideoId(source.url);
  const publisher = { "@type": "Organization", name: source.author } as const;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: tx.embedTitle,
    description: tx.metadata.description,
    inLanguage: RECORDING_LANGUAGE,
    uploadDate: source.publishedAtDateTime,
    duration: isoDuration(source.durationSeconds),
    thumbnailUrl: [`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`],
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    sameAs: source.url,
    url: `${siteUrl}${PRACTICE_PATH[lang]}`,
    creator: publisher,
    publisher,
    contributor: INTERVIEWEE,
    hasPart: source.refs.map((ref) => ({
      "@type": "Clip",
      name: tx.sections[ref.id].title,
      startOffset: ref.startSeconds,
      endOffset: ref.endSeconds ?? ref.startSeconds,
      url: ref.url,
    })),
  };
}

export function structuredDataScript(payload: unknown): string {
  return JSON.stringify(payload).replaceAll("<", "\\u003c");
}
