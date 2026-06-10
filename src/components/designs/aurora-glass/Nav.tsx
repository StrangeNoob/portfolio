"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/resume";
import styles from "./aurora.module.css";

export function Nav() {
  const reducedMotion = useReducedMotion();

  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-3 sm:top-6">
      <motion.nav
        aria-label="Primary"
        initial={reducedMotion ? false : { opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.6, 0.35, 1] }}
        className={cn(
          styles.glass,
          "flex items-center gap-0.5 rounded-full px-2 py-1.5 sm:gap-1 sm:px-3 sm:py-2",
        )}
      >
        <a
          href="#top"
          className={cn(
            styles.display,
            styles.iridescent,
            "px-2 text-sm font-bold sm:px-3",
          )}
          aria-label="Back to top — Prateek Kumar Mohanty"
        >
          PKM
        </a>
        <span
          aria-hidden="true"
          className="mx-0.5 h-4 w-px bg-white/15 sm:mx-1"
        />
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full px-2 py-1 text-[11px] text-white/75 transition-colors duration-300 hover:bg-white/10 hover:text-white sm:px-3 sm:py-1.5 sm:text-sm"
          >
            {item.name}
          </a>
        ))}
      </motion.nav>
    </header>
  );
}
