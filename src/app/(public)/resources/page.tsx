import type { Metadata } from "next";
import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata: Metadata = {
  title: "Resources — 9449 Yellowjackets",
};

export default function ResourcesPage() {
  return (
    <ComingSoon
      title="Resources"
      description="Guides and resources from the team — this page is under construction."
    />
  );
}
