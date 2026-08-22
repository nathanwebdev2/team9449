import type { Metadata } from "next";
import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "How the Yellowjackets contribute to FIRST and our community — this page is under construction.",
  alternates: {
    canonical: "/impact",
  },
};

export default function ImpactPage() {
  return (
    <ComingSoon
      title="Impact"
      description="How the Yellowjackets contribute to FIRST and our community — this page is under construction."
    />
  );
}
