import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6366F1",
          borderRadius: "14px",
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#FFFFFF",
            fontFamily: "sans-serif",
            letterSpacing: "-1px",
          }}
        >
          s
        </span>
      </div>
    ),
    { ...size }
  );
}
