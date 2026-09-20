import { ImageResponse } from "next/og";

import OpenGraphBoundaryMark from "@/components/OpenGraphBoundaryMark";
import { shortcastsT } from "@/lib/i18n";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";

export const alt = shortcastsT.pl.metadataTitle();
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            {shortcastsT.pl.badge(MODEL_V2_METADATA.modelVersion)}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 760,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              marginTop: 24,
            }}
          >
            {shortcastsT.pl.title}
          </div>
          <div
            style={{
              color: "#4b5563",
              display: "flex",
              fontSize: 22,
              lineHeight: 1.35,
              marginTop: 28,
            }}
          >
            {shortcastsT.pl.intro}
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
