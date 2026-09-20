import { ImageResponse } from "next/og";

import OpenGraphBoundaryMark from "@/components/OpenGraphBoundaryMark";
import { shortcastsT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { getEpisode } from "@/lib/shortcasty";

export const alt = shortcastsT.pl.metadataTitle();
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = getEpisode(slug);
  if (!episode?.publishedAt) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#f9fafb",
          color: "#111827",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 78px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 560,
          }}
        >
          <div
            style={{
              color: "#b45309",
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {shortcastsT.pl.detail.episodeLabel(episode.number, episode.dimension)}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 760,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              marginTop: 24,
            }}
          >
            {episode.title}
          </div>
          <div
            style={{
              color: "#4b5563",
              display: "flex",
              fontSize: 20,
              lineHeight: 1.35,
              marginTop: 28,
            }}
          >
            {`Model ${MODEL_V2_METADATA.modelVersion} / ${episode.focus}`}
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            width: 470,
          }}
        >
          <OpenGraphBoundaryMark />
        </div>
      </div>
    ),
    { ...size }
  );
}
