import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const LOGO_PATH = "public/nlsc-tab-logo.png";
const LOGO_SCALE = 1.1;

export default async function AppleIcon() {
  const file = await readFile(path.join(process.cwd(), LOGO_PATH));
  const base64 = file.toString("base64");
  const circleSize = size.width;
  const imageSize = Math.round(circleSize * LOGO_SCALE);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000000",
          }}
        >
          <img
            src={`data:image/png;base64,${base64}`}
            width={imageSize}
            height={imageSize}
            alt=""
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
