import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Rule } from "@/components/layout/Rule";

export const metadata: Metadata = {
  title: "Join the Team",
  description:
    "Open to any Calgary-area student, grades 9–12, no robotics experience required. Fees, schedule, and how to get in touch.",
  alternates: {
    canonical: "/team/join",
  },
};

const FEES = [
  {
    value: "$2,100 CAD",
    label: "Team fee",
    detail:
      "Covers the full season (January through May) plus off-season, and includes travel (flights, hotels, local transit) to the CANPAC regional in Vancouver. Food during travel is a student/family expense.",
  },
  {
    value: "No added cost",
    label: "CANROC regional",
    detail: "Held in Calgary — no additional travel cost.",
  },
  {
    value: "~$2,000 CAD each",
    label: "Possible additional travel",
    detail:
      "If the team qualifies for the Idaho regional or the World Championship, those involve additional travel costs, approximately $2,000 CAD each based on last season. These are not guaranteed and depend on qualification.",
  },
];

const COMPETITIONS = [
  { name: "CANPAC Regional", when: "Vancouver — early March" },
  { name: "Idaho Regional", when: "End of March (if attending)" },
  { name: "CANROC", when: "Calgary — dates TBD" },
  { name: "World Championship", when: "Late April / early May, pending qualification" },
];

export default function JoinTeamPage() {
  return (
    <>
      <Section className="pb-0 md:pb-0">
        <Container>
          <h1 className="font-display text-h1 text-aluminum">Join the Team</h1>
          <p className="mt-4 measure text-body text-steel-200">
            Open to any Calgary-area student, grades 9–12, no robotics
            experience required.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="font-display text-h3 text-aluminum">The real numbers</h2>
          <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-ink-600 bg-ink-600 sm:grid-cols-3">
            {FEES.map((fee) => (
              <div key={fee.label} className="bg-ink-800 px-5 py-6">
                <p className="font-mono text-h2 text-jacket-500">{fee.value}</p>
                <p className="mt-1 font-mono text-label uppercase tracking-widest text-steel-400">
                  {fee.label}
                </p>
                <p className="mt-3 text-small text-steel-200">{fee.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <Rule className="mb-16" />
          <h2 className="font-display text-h3 text-aluminum">Schedule</h2>
          <div className="mt-4 measure text-body text-steel-200">
            <p>
              During build/competition season (January–May): meets Saturdays
              and Sundays, 10am–7pm.
            </p>
            <p className="mt-4">Typical weekly time commitment: around 12 hours.</p>
            <p className="mt-4">
              Commitment is flexible, but team success is directly tied to
              student involvement and participation.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <Rule className="mb-16" />
          <h2 className="font-display text-h3 text-aluminum">
            Competition calendar
          </h2>
          <p className="mt-2 text-small text-steel-400">
            This season, for context — informational, not a hard commitment.
          </p>
          <dl className="mt-6 flex flex-col gap-3">
            {COMPETITIONS.map((comp) => (
              <div
                key={comp.name}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-600 pb-3"
              >
                <dt className="text-body text-aluminum">{comp.name}</dt>
                <dd className="font-mono text-small text-steel-400">{comp.when}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <Rule className="mb-16" />
          <h2 className="font-display text-h3 text-aluminum">
            No experience needed
          </h2>
          <p className="mt-4 measure text-body text-steel-200">
            The team is genuinely open to complete beginners across all
            subteams — CAD, Build, Programming, Business, and Drive.
          </p>
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container>
          <Rule className="mb-16" />
          <h2 className="font-display text-h3 text-aluminum">How to join</h2>
          <button
            type="button"
            disabled
            className="mt-6 inline-flex min-h-11 cursor-not-allowed items-center rounded-sm border border-ink-600 px-5 font-medium text-steel-400"
          >
            Interest form — opening soon
          </button>
          <p className="mt-4 text-body text-steel-200">
            In the meantime, reach out directly: Chris (lead mentor) —{" "}
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
