import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {}
        <img src={src} width={56} height={56} style={{ objectFit: "contain" }} alt="ELEVA" />
      </div>
    ),
    { ...size }
  );
}
