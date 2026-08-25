import { ImageResponse } from "next/og";
import { TAGLINE_EN } from "../../seo-config";

export const alt = "ProcuraCost: A tunnel has walls. A field has a horizon.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#2563eb" }}>
          ProcuraCost
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 42,
            fontWeight: 600,
            color: "#111827",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {TAGLINE_EN}
        </div>
        <div style={{ display: "flex", marginTop: 36, width: 120, height: 6, backgroundColor: "#2563eb", borderRadius: 3 }} />
      </div>
    ),
    { ...size }
  );
}
