import { ImageResponse } from "next/og";

export const alt = "Dotmask — styled QR code generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background:
            "linear-gradient(145deg, #f7fbfa 0%, #d7ebe6 45%, #c5e4f5 100%)",
          color: "#102a2a",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.04em" }}>
          Dotmask
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 34,
            maxWidth: 820,
            lineHeight: 1.35,
            color: "#4a6563",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Free styled QR codes — modules, gradients, logos, and image masks.
        </div>
      </div>
    ),
    { ...size },
  );
}
