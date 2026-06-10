"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Scroll-triggered "stand up into place" entrance:
 * elements rise with a rotateX fold (via transformPerspective).
 * Falls back to a plain fade when reduced motion is preferred.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 56, rotateX: 14, transformPerspective: 900 }
      }
      whileInView={
        reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }
      }
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.75, delay, ease: [0.21, 0.65, 0.3, 1] }}
      style={{ transformOrigin: "center bottom" }}
    >
      {children}
    </motion.div>
  );
}
