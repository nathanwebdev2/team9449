import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { Section } from "@/components/layout/Section";
import { ScrubSequence } from "@/components/motion/ScrubSequence";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { RobotCard } from "@/components/content/RobotCard";
import { heroFrames } from "@/lib/hero-frames";
import { getRobotImages, getRobots } from "@/lib/content/robots";
import { siteStats } from "../../content/site-stats";

export default function Home() {
  const recentRobots = [...getRobots()].sort((a, b) => b.year - a.year).slice(0, 3);

  // Only stats with a confirmed value render a tile — a `null` field is
  // omitted entirely, never a "—" placeholder or a zero (spec 0013 §3.1).
  // Built inline rather than via the shared `StatGrid` (used unmodified on
  // /robots/[slug]) so that CountUp's bundle cost stays scoped to the
  // homepage and doesn't leak into every page that renders a stat grid.
  const numericStats = (
    [
      { label: "Founded", value: siteStats.foundedYear },
      { label: "First competition", value: siteStats.firstCompetitionYear },
      { label: "Members", value: siteStats.memberCount },
      { label: "Mentors", value: siteStats.mentorCount },
      { label: "Sponsors", value: siteStats.sponsorCount },
      { label: "Robots built", value: siteStats.robotsBuilt },
    ] satisfies { label: string; value: number | null }[]
  ).filter((stat): stat is { label: string; value: number } => stat.value !== null);

  return (
    <>
      {/* The hero poster is the LCP element. React hoists this into <head>, so
          it starts downloading with the document rather than waiting for the
          client bundle. Exactly one preloaded image on this page. */}
      <link
        rel="preload"
        as="image"
        href={heroFrames[0]}
        fetchPriority="high"
      />
      <ScrubSequence frames={heroFrames}>
        {/* The sequence itself is aria-hidden, so everything it conveys — which
            robot this is, and what it is — lives here as text (CLAUDE.md §7). */}
        <Container className="text-center">
          <Eyebrow>FRC 9449 · Calgary, Alberta</Eyebrow>
          <h1 className="mt-4 font-display text-display text-aluminum">
            Yellowjackets
          </h1>
          <p className="mx-auto mt-5 measure text-balance text-steel-200">
            Honeycomb, our 2026 REBUILT competition robot — 95 lb on a REV
            MaxSwerve drivetrain, with a slapdown intake and a 12.5-inch drum
            shooter.
          </p>
        </Container>
      </ScrubSequence>

      <Section>
        <Container>
          <Reveal>
            <h2 className="font-display text-h3 text-aluminum">By the numbers</h2>

            {numericStats.length > 0 && (
              /* flex-wrap, not a fixed grid-cols count — with as few as two
                 tiles today, a fixed column count would leave a visible
                 empty cell (spec 0013 §7 edge case: "do not force a fixed
                 ... layout that leaves gaps"). Tiles reflow to however many
                 stats are actually populated. */
              <dl className="mt-6 flex flex-wrap gap-px overflow-hidden rounded-md border border-ink-600 bg-ink-600">
                {numericStats.map((stat) => (
                  <div key={stat.label} className="min-w-40 flex-1 bg-ink-800 px-5 py-6">
                    <dd className="font-mono text-h2 text-jacket-500">
                      <CountUp value={stat.value} />
                    </dd>
                    <dt className="mt-1 font-mono text-label uppercase tracking-widest text-steel-400">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}

            {/* A confirmed fact, not a counted number — rendered as its own
                badge rather than a StatGrid tile (spec 0013 §3.1). */}
            <div className="mt-4 inline-flex items-start rounded-md border border-ink-600 border-l-2 border-l-jacket-500 bg-ink-800 py-3 pl-4 pr-5">
              <div>
                <p className="font-mono text-label uppercase tracking-widest text-steel-400">
                  Award
                </p>
                <p className="mt-1 text-body text-aluminum">
                  Regional FIRST Impact Award (Idaho)
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {recentRobots.length > 0 && (
        <Section className="pt-0 md:pt-0">
          <Container>
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-display text-h3 text-aluminum">Robots we&apos;ve built</h2>
                <Link
                  href="/robots"
                  className="text-body text-link-500 underline underline-offset-4 transition-opacity hover:opacity-80"
                >
                  View full archive →
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentRobots.map((robot) => (
                  <RobotCard
                    key={robot.slug}
                    robot={robot}
                    hero={getRobotImages(robot.slug, robot.name).hero?.src ?? null}
                  />
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      <Section className="pt-0 md:pt-0">
        <Container>
          <Reveal>
            <h2 className="font-display text-h3 text-aluminum">Impact</h2>
            <p className="mt-4 measure text-body text-steel-200">
              The Yellowjackets are winners of the Regional FIRST Impact Award (Idaho).
            </p>
            <Link
              href="/impact"
              className="mt-4 inline-block text-body text-link-500 underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Read more →
            </Link>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <Reveal>
            <h2 className="font-display text-h3 text-aluminum">Sponsors</h2>
            <p className="mt-4 measure text-body text-steel-200">
              Sponsorship from local businesses keeps the team building,
              travelling to competitions, and mentoring students every season.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/sponsors"
                className="text-body text-link-500 underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                Learn about sponsorship →
              </Link>
              <a
                href="mailto:christanh@albertarobotics.com"
                className="text-body text-link-500 underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                Become a sponsor
              </a>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
