import Link from "next/link";
import { Container } from "./Container";
import { Rule } from "./Rule";

const NAV_LINKS = [
  { label: "Robots", href: "/robots" },
  { label: "Team", href: "/team" },
  { label: "Impact", href: "/impact" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Resources", href: "/resources" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-800">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <p className="font-display text-h3 text-aluminum">9449 Yellowjackets</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-small text-steel-200 transition-opacity hover:opacity-80"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/thehive"
              className="inline-flex min-h-11 items-center text-small text-steel-200 transition-opacity hover:opacity-80"
            >
              The Hive
            </Link>
          </nav>
        </div>

        <Rule className="mt-12 mb-6" />

        <p className="text-small text-steel-400">
          © {year} FRC Team 9449 Yellowjackets. Calgary, Alberta.
        </p>
      </Container>
    </footer>
  );
}
