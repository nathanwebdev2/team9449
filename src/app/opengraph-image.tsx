import { ImageResponse } from "next/og";
import { BrandMarkImage } from "@/lib/og/brand-mark";
import { ogFonts } from "@/lib/og/fonts";

export const alt = "Yellowjackets — FRC Team 9449, Calgary, Alberta";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <BrandMarkImage
        eyebrow="FRC Team 9449 · Calgary, Alberta"
        title="Yellowjackets"
        subtitle="FIRST Robotics Competition"
      />
    ),
    { ...size, fonts: ogFonts() }
  );
}
