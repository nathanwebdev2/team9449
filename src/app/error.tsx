"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section>
      <Container>
        <p className="font-mono text-label uppercase tracking-widest text-steel-400">Error</p>
        <h1 className="mt-4 font-display text-h1 text-aluminum">Something went wrong</h1>
        <p className="mt-4 measure text-body text-steel-200">
          An unexpected error occurred. You can try again, or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center rounded-sm bg-jacket-500 px-5 font-medium text-ink-900 transition-opacity duration-interface ease-standard hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-sm border border-ink-600 px-5 font-medium text-aluminum transition-opacity duration-interface ease-standard hover:opacity-80"
          >
            Back to homepage
          </Link>
        </div>
      </Container>
    </Section>
  );
}
