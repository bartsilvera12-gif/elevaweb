import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const buffer = await readFile(join(process.cwd(), "public/uploads/Isotipo-eleva.png"));
  const src = `data:image/png;base64,${buffer.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          borderRadius: 38,
          overflow: "hidden",
        }}
      >
        {}
        <img src={src} width={160} height={160} style={{ objectFit: "contain" }} alt="ELEVA" />
      </div>
    ),
    { ...size }
  );
}
