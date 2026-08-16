import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { ScrubSequence } from "@/components/motion/ScrubSequence";
import { heroFrames } from "@/lib/hero-frames";

export default function Home() {
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
    </>
  );
}
