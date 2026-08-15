"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const EASE = [0.16, 1, 0.3, 1] as const; // --ease-out-expo

/**
 * Numbers counting up on scroll into view, once. `.font-mono` carries
 * `font-variant-numeric: tabular-nums` globally (globals.css) so digits
 * never jitter mid-count.
 */
export function CountUp({
  value,
  duration = 450,
  decimals = 0,
  className = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const hasAnimated = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reducedMotion || !isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const controls = animate(0, value, {
      duration: duration / 1000,
      ease: EASE,
      onUpdate: setDisplay,
    });

    return () => controls.stop();
  }, [isInView, reducedMotion, value, duration]);

  const shown = reducedMotion ? value : display;

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {shown.toFixed(decimals)}
    </span>
  );
}
