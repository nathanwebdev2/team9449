"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const DURATION = 0.32; // --dur-3
const EASE = [0.16, 1, 0.3, 1] as const; // --ease-out-expo

/**
 * L3 Section motion primitive (CLAUDE.md §5). Fade + 8px rise on
 * scroll into view, once. Only opacity/transform ever animate.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: DURATION, ease: EASE, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
