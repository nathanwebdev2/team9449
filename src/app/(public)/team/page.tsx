import type { Metadata } from "next";
import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata: Metadata = {
  title: "Team — 9449 Yellowjackets",
};

export default function TeamPage() {
  return (
    <ComingSoon
      title="Team"
      description="Meet the Yellowjackets — this page is under construction."
    />
  );
}
