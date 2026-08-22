import { ImageResponse } from "next/og";
import { BrandMarkImage } from "@/lib/og/brand-mark";
import { ogFonts } from "@/lib/og/fonts";

export const alt = "Robot Archive — Yellowjackets 9449";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <BrandMarkImage
        eyebrow="Yellowjackets 9449"
        title="Robot Archive"
        subtitle="FIRST Robotics Competition"
      />
    ),
    { ...size, fonts: ogFonts() }
  );
}
