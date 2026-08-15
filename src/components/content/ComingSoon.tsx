import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { Section } from "@/components/layout/Section";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Section>
      <Container>
        <h1 className="font-display text-h1 text-aluminum">{title}</h1>
        <p className="mt-4 measure text-body text-steel-200">
          {description}
        </p>
        <Eyebrow className="mt-8">In progress</Eyebrow>
        <Link
          href="/"
          className="mt-8 inline-block text-body text-link-500 underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          Back to homepage
        </Link>
      </Container>
    </Section>
  );
}
