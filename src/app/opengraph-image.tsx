import { ImageResponse } from "next/og"
export const runtime = "edge"
export const alt = "Xander — Full-Stack Developer & Designer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1C1C1E",
          padding: "64px 72px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(200,180,0,0.06) 0%, transparent 50%), " +
              "radial-gradient(circle at 85% 80%, rgba(200,180,0,0.04) 0%, transparent 50%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#F2F0ED",
              letterSpacing: "-0.02em",
            }}
          >
            xalonious
          </span>
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#C8B400" }}>
            .
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              width: "48px",
              height: "2px",
              backgroundColor: "#C8B400",
            }}
          />

          <div
            style={{
              fontSize: "88px",
              fontWeight: 900,
              color: "#F2F0ED",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
            }}
          >
            Xander
          </div>

          <div
            style={{
              fontSize: "22px",
              color: "#8E8E93",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            Full-Stack Developer & Designer
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "48px",
            alignItems: "flex-end",
          }}
        >
          {[
            { value: "7+", label: "Years" },
            { value: "Belgium", label: "Based in" },
            { value: "Open to work", label: "Status" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#C8B400",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#636366",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}

          <div
            style={{
              marginLeft: "auto",
              fontSize: "14px",
              color: "#636366",
              letterSpacing: "0.04em",
            }}
          >
            whoisxander.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}