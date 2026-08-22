import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Section>
      <Container>
        <p className="font-mono text-label uppercase tracking-widest text-steel-400">404</p>
        <h1 className="mt-4 font-display text-h1 text-aluminum">Page not found</h1>
        <p className="mt-4 measure text-body text-steel-200">
          We couldn&rsquo;t find that page. It may have moved, or the link might be out of date.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-sm bg-jacket-500 px-5 font-medium text-ink-900 transition-opacity duration-interface ease-standard hover:opacity-90"
        >
          Back to homepage
        </Link>
      </Container>
    </Section>
  );
}
