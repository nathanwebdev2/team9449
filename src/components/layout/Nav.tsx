"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "./Container";

const NAV_LINKS = [
  { label: "Robots", href: "/robots" },
  { label: "Team", href: "/team" },
  { label: "Impact", href: "/impact" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Resources", href: "/resources" },
];

const COMPACT_THRESHOLD = 80;

export function Nav() {
  const [compact, setCompact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const wasOpen = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setCompact((prev) => {
          if (y <= COMPACT_THRESHOLD) return false;
          if (y > lastY.current) return true;
          if (y < lastY.current) return false;
          return prev;
        });
        lastY.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (wasOpen.current && !mobileOpen) {
      toggleRef.current?.focus();
    }
    wasOpen.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const siteContent = document.getElementById("site-content");
    siteContent?.setAttribute("inert", "");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusables?.[0];
    const last = focusables && focusables.length > 0 ? focusables[focusables.length - 1] : undefined;
    first?.focus();

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key === "Tab" && first && last) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeydown);

    return () => {
      document.removeEventListener("keydown", onKeydown);
      siteContent?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <div aria-hidden="true" className="h-20" />
      <header className="fixed inset-x-0 top-0 z-[var(--z-nav)]">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 border-b border-ink-600 bg-ink-900/85 backdrop-blur-md transition-opacity duration-[var(--dur-3)] ease-[var(--ease-standard)] ${
            compact ? "opacity-100" : "opacity-0"
          }`}
        />
        <Container
          className={`relative flex items-center justify-between ${compact ? "py-3" : "py-5"}`}
        >
          <Link
            href="/"
            className="inline-flex min-h-11 items-center font-display text-h3 text-aluminum"
          >
            9449
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-small text-steel-200 transition-opacity hover:opacity-80"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center border-l border-ink-600 pl-6 md:flex">
            <Link
              href="/thehive"
              className="inline-flex min-h-11 items-center font-mono text-small uppercase tracking-wide text-jacket-500 transition-opacity hover:opacity-80"
            >
              The Hive
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className="inline-flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              className="text-aluminum"
            >
              {mobileOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </Container>
      </header>

      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-[var(--z-overlay)] flex flex-col bg-ink-900 md:hidden"
        >
          <Container className="flex items-center justify-between py-5">
            <span className="inline-flex min-h-11 items-center font-display text-h3 text-aluminum">
              9449
            </span>
            <button
              type="button"
              onClick={closeMobile}
              className="inline-flex h-11 w-11 items-center justify-center"
            >
              <span className="sr-only">Close menu</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="text-aluminum"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6l-12 12" />
              </svg>
            </button>
          </Container>

          <Container className="flex flex-1 flex-col justify-center gap-2 pb-16">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="inline-flex min-h-11 items-center text-h3 text-aluminum"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/thehive"
              onClick={closeMobile}
              className="mt-6 inline-flex min-h-11 items-center border-t border-ink-600 pt-6 font-mono text-small uppercase tracking-wide text-jacket-500"
            >
              The Hive
            </Link>
          </Container>
        </div>
      )}
    </>
  );
}
