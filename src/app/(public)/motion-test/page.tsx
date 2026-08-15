// Temporary route to visually confirm the three motion primitives
// (spec 0008). Delete once a real page uses Reveal/CountUp/ScrubSequence.

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { ScrubSequence } from "@/components/motion/ScrubSequence";

export default function MotionTestPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display text-h1 text-aluminum">Motion test</h1>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 120, 240].map((delay) => (
            <Reveal
              key={delay}
              delay={delay}
              className="rounded-md border border-ink-600 bg-ink-800 p-8"
            >
              <p className="font-mono text-label uppercase tracking-widest text-steel-400">
                Reveal, delay {delay}ms
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <p className="font-mono text-label uppercase tracking-widest text-steel-400">
            CountUp
          </p>
          <CountUp value={247} className="text-display text-jacket-500" />
        </div>

        <div className="mt-12">
          <p className="mb-4 font-mono text-label uppercase tracking-widest text-steel-400">
            ScrubSequence (no frames)
          </p>
          <ScrubSequence frames={[]} />
        </div>
      </Container>
    </Section>
  );
}
