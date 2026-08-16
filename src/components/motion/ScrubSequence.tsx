"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * L4 Hero motion primitive (CLAUDE.md §5) — the one pinned section on the
 * entire site. Scroll position drives a frame index; the frame is blitted to a
 * canvas clipped to the hexagonal aperture.
 *
 * Layout (the sticky pin, the aperture, the reduced-motion collapse) is all in
 * `globals.css`, not here, so it is correct on first paint. This component only
 * loads frames and draws them.
 *
 * Three ways it degrades, in order of how often they happen:
 *   - reduced motion, mobile, or Save-Data: the poster `<img>` is the whole
 *     hero. GSAP is never imported and frames 2-61 are never fetched.
 *   - frames still loading: the canvas draws the nearest decoded frame, so the
 *     turn just looks coarser until the rest arrive.
 *   - no JS at all: the poster is server-rendered, so the hero still works.
 */

// Fixed by scripts/build-hero-frames.mjs — every frame is exactly this size,
// which is what lets the scrub blit with a bare drawImage and no per-frame
// maths. Change them there and here together.
const FRAME_W = 780;
const FRAME_H = 675;

const DESKTOP = "(min-width: 48rem)"; // --breakpoint-sm
const LOAD_CONCURRENCY = 6;

/** `navigator.connection` is not in lib.dom; narrow it rather than reach for `any`. */
type ConnectionNavigator = Navigator & {
  connection?: { saveData?: boolean };
};

function whenIdle(run: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(run, 200);
  return () => window.clearTimeout(id);
}

export function ScrubSequence({
  frames,
  children,
  className = "",
}: {
  frames: string[];
  /** Rendered inside the pinned stage, above the aperture, so the hero's
   *  heading stays with the robot while the section is pinned. */
  children?: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (reducedMotion || !track || !canvas || frames.length === 0) return;

    const saveData =
      (navigator as ConnectionNavigator).connection?.saveData === true;
    if (saveData) return;

    const query = window.matchMedia(DESKTOP);
    let stop: (() => void) | undefined;

    const start = () => {
      const context = canvas.getContext("2d");
      if (!context) return;

      const images = new Array<HTMLImageElement | undefined>(frames.length);
      const cleanups: Array<() => void> = [];
      let cancelled = false;
      let drawn = -1;

      const draw = (target: number) => {
        let index = target;
        if (!images[index]) {
          // Walk outward, preferring the frame just behind, so a partly loaded
          // sequence reads as a coarser turn rather than a blank aperture.
          let nearest = -1;
          for (let d = 1; d < images.length; d++) {
            if (images[index - d]) {
              nearest = index - d;
              break;
            }
            if (images[index + d]) {
              nearest = index + d;
              break;
            }
          }
          if (nearest < 0) return;
          index = nearest;
        }
        if (index === drawn) return;
        const image = images[index];
        if (!image) return;
        context.drawImage(image, 0, 0, FRAME_W, FRAME_H);
        drawn = index;
      };

      // Frames load in order at a capped concurrency: earliest-needed first,
      // never enough parallel requests to starve anything else on the page.
      const loadAll = () => {
        let cursor = 0;
        const worker = async () => {
          while (!cancelled) {
            const index = cursor++;
            if (index >= frames.length) return;
            try {
              const image = new window.Image();
              image.decoding = "async";
              image.src = frames[index];
              await image.decode();
              if (cancelled) return;
              images[index] = image;
              if (index === 0) {
                // Frame 1 is already the poster underneath, so switching the
                // canvas on here is visually a no-op.
                draw(0);
                canvas.dataset.active = "true";
              }
            } catch {
              // A frame that never arrives just means the scrub holds the
              // previous one. Never a broken hero.
            }
          }
        };
        for (let i = 0; i < LOAD_CONCURRENCY; i++) void worker();
      };

      const cancelIdle = whenIdle(async () => {
        if (cancelled) return;
        loadAll();

        // Must be the full `gsap` entry, not `gsap/gsap-core`. Tempting to use
        // the core build since this tween only drives a number on a plain
        // object and never touches CSS — but ScrollTrigger.enable() calls
        // `gsap.utils.checkPrefix`, which only exists once CSSPlugin has
        // registered. Core alone throws at runtime.
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        const position = { frame: 0 };
        const tween = gsap.to(position, {
          frame: frames.length - 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
          onUpdate: () => draw(Math.round(position.frame)),
        });

        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      });

      stop = () => {
        cancelled = true;
        cancelIdle();
        for (const cleanup of cleanups) cleanup();
        canvas.dataset.active = "false";
      };
    };

    // Re-evaluate if the viewport crosses the breakpoint mid-session.
    const sync = () => {
      stop?.();
      stop = undefined;
      if (query.matches) start();
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      stop?.();
    };
  }, [frames, reducedMotion]);

  if (frames.length === 0) return null;

  return (
    <div ref={trackRef} className={`hero-track ${className}`}>
      <div className="hero-stage">
        {children}
        <div className="hero-aperture">
          <div className="hero-aperture-inner">
            {/* Poster, LCP element, and the entire hero on mobile / reduced
                motion. Deliberately a plain <img> rather than next/image
                (CLAUDE.md §6): the frames are already generated at their exact
                display size and compressed, so the optimiser has nothing to do
                and `unoptimized` would leave only next/image's client runtime
                as cost. Explicit width/height still pin the box, so there is no
                CLS, and the preload is declared in page.tsx. Serving the raw
                URL also means the canvas loader shares this exact cache entry —
                frame 1 is fetched once, not twice. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
            <img
              src={frames[0]}
              alt=""
              width={FRAME_W}
              height={FRAME_H}
              fetchPriority="high"
              decoding="async"
              className="hero-plate"
            />
            <canvas
              ref={canvasRef}
              width={FRAME_W}
              height={FRAME_H}
              aria-hidden="true"
              className="hero-plate hero-canvas"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
