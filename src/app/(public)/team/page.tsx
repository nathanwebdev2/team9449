import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { Section } from "@/components/layout/Section";
import { SubteamCard } from "@/components/content/SubteamCard";

export const metadata: Metadata = {
  title: "Team — 9449 Yellowjackets",
};

const SUBTEAMS = [
  {
    name: "CAD",
    description: "Designs the robot in 3D CAD before anything is built or machined.",
  },
  {
    name: "Build",
    description:
      "Turns CAD designs into a physical robot — machining, fabrication, and assembly.",
  },
  {
    name: "Programming",
    description:
      "Writes the robot's control software, from autonomous routines to driver controls.",
  },
  {
    name: "Business",
    description:
      "Handles sponsorship, outreach, and the team's presentation and communications.",
  },
  {
    name: "Drive",
    description: "Operates the robot in competition matches and practices driving it.",
  },
];

export default function TeamPage() {
  return (
    <>
      <Section className="pb-0 md:pb-0">
        <Container>
          <h1 className="font-display text-h1 text-aluminum">Team</h1>
          <p className="mt-4 measure text-body text-steel-200">
            9449 Yellowjackets is a community FRC robotics team based in
            Calgary, Alberta — open to any student grades 9–12, regardless of
            school. No prior experience required.
          </p>
          <Link
            href="/team/join"
            className="mt-8 inline-flex min-h-11 items-center rounded-sm bg-jacket-500 px-5 font-medium text-ink-900 transition-opacity duration-interface ease-standard hover:opacity-90"
          >
            Join the team
          </Link>
        </Container>
      </Section>

      <Section>
        <Container>
          <Eyebrow as="h2">Subteams</Eyebrow>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUBTEAMS.map((subteam) => (
              <SubteamCard
                key={subteam.name}
                name={subteam.name}
                description={subteam.description}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <h2 className="font-display text-h3 text-aluminum">Where we meet</h2>
          <p className="mt-4 measure text-body text-steel-200">
            The team meets at Renert School, our in-kind build space sponsor.
          </p>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <h2 className="font-display text-h3 text-aluminum">Contact</h2>
          <p className="mt-4 text-body text-steel-200">
            Lead mentor: Chris —{" "}
            <a
              href="mailto:christanh@albertarobotics.com"
              className="text-link-500 underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              christanh@albertarobotics.com
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}
