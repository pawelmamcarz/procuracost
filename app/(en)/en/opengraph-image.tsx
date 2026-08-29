import { ImageResponse } from "next/og";

import OpenGraphBoundaryMark from "@/components/OpenGraphBoundaryMark";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";

import { TAGLINE_EN } from "../../seo-config";

export const alt = `ProcuraCost ${MODEL_V2_METADATA.modelVersion}: ${TAGLINE_EN}`;
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
            maxWidth: 540,
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
            Model {MODEL_V2_METADATA.modelVersion}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 70,
              fontWeight: 760,
              letterSpacing: "-0.045em",
              marginTop: 24,
            }}
          >
            ProcuraCost
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 35,
              fontWeight: 520,
              lineHeight: 1.24,
              marginTop: 28,
            }}
          >
            {TAGLINE_EN}
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
            Two compliant process designs. One transparent cost record.
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
