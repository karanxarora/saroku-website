import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#0B0B14",
          backgroundImage:
            "radial-gradient(circle at 78% 32%, rgba(99,102,241,0.35), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#6366F1",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            s
          </div>
          <div style={{ display: "flex", fontSize: "30px", fontWeight: 700, color: "#EDF0F7" }}>
            saroku
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-2px",
            lineHeight: 1.08,
            maxWidth: "920px",
          }}
        >
          Secure before it acts
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            color: "#A5B4FC",
            marginTop: "28px",
            maxWidth: "820px",
            lineHeight: 1.5,
          }}
        >
          Judges every agent tool call before it executes, and blocks it before it does damage.
        </div>
      </div>
    ),
    { ...size }
  );
}
