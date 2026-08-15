import type { Metadata } from "next";
import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata: Metadata = {
  title: "Impact — 9449 Yellowjackets",
};

export default function ImpactPage() {
  return (
    <ComingSoon
      title="Impact"
      description="How the Yellowjackets contribute to FIRST and our community — this page is under construction."
    />
  );
}
