import type { Metadata } from "next";
import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Our sponsors, and how to support the team — this page is under construction.",
  alternates: {
    canonical: "/sponsors",
  },
};

export default function SponsorsPage() {
  return (
    <ComingSoon
      title="Sponsors"
      description="Our sponsors, and how to support the team — this page is under construction."
    />
  );
}
