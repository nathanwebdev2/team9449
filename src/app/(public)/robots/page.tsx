import type { Metadata } from "next";
import { getRobotImages, getRobots } from "@/lib/content/robots";
import { RobotCard } from "@/components/content/RobotCard";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Robots",
  description: "Every competition robot the Yellowjackets have built, season by season.",
  alternates: {
    canonical: "/robots",
  },
};

export default function RobotsPage() {
  const robots = [...getRobots()].sort((a, b) => b.year - a.year);

  return (
    <Section>
      <Container>
        <h1 className="font-display text-h1 text-aluminum">Robots</h1>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {robots.map((robot) => (
            <RobotCard
              key={robot.slug}
              robot={robot}
              hero={getRobotImages(robot.slug, robot.name).hero?.src ?? null}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
