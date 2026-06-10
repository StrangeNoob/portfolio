"use client";

import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

interface ParallaxYProps {
  children: ReactNode;
  className?: string;
  /** y offset (px) at the top of the page scroll */
  from?: number;
  /** y offset (px) at the bottom of the page scroll */
  to?: number;
}

/**
 * Decorative scroll-speed layer: drifts vertically at a different
 * rate than the page (transform-only via useScroll/useTransform).
 */
export function ParallaxY({
  children,
  className,
  from = 60,
  to = -60,
}: ParallaxYProps) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div
      className={className}
      style={reduced ? undefined : { y }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}
