import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "../lib/site";

export const alt = `${SITE_NAME} — Computer Science at Oregon State University`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Link preview for LinkedIn, Slack, iMessage, and other social sites. */
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
          padding: "0 96px",
          background: "#f9f4e8",
          color: "#1b1c17",
        }}
      >
        <div style={{ fontSize: 30, color: "#aa314d", letterSpacing: 4, textTransform: "uppercase" }}>
          {`${SITE_NAME} · CS @ Oregon State`}
        </div>
        <div style={{ fontSize: 88, lineHeight: 1.05, marginTop: 24 }}>
          Building high-performance software
        </div>
        <div style={{ fontSize: 28, color: "#5c4039", marginTop: 32 }}>
          Systems programming · Data visualization · High-performance computing
        </div>
        <div style={{ fontSize: 28, color: "#9a2c46", marginTop: 48 }}>
          {new URL(SITE_URL).host}
        </div>
      </div>
    ),
    size,
  );
}
