"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { personalInfo } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./brutalist.module.css";

const MonolithScene = dynamic(() => import("./MonolithScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-end justify-end bg-[#0c0c0c] p-6">
      <span className="text-xs uppercase tracking-[0.35em] text-[#6e6e6a]">
        Pouring concrete…
      </span>
    </div>
  ),
});

const HARD_EASE = [0.9, 0, 0.1, 1] as const;

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const [firstName, ...restName] = personalInfo.name.toUpperCase().split(" ");

  return (
    <section
      id="top"
      aria-label="Intro"
      className={cn(
        styles.snapSection,
        "relative min-h-[640px] overflow-hidden bg-[#0c0c0c] text-[#e8e8e4]",
        "h-svh",
      )}
    >
      {/* Raw concrete monoliths — slow, deliberate rotation, hard shadows */}
      <div className="absolute inset-0" aria-hidden="true">
        <MonolithScene animate={!reducedMotion} />
      </div>

      {/* Exposed grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] grid grid-cols-2 md:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "border-l border-[#2a2a28]",
              i >= 2 && "hidden md:block",
            )}
          />
        ))}
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-6 pb-8 pt-24 md:px-12">
        <div className="flex flex-wrap items-start justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#9a9a96] md:text-xs">
          <span>{personalInfo.title}</span>
          <span>
            {personalInfo.location} / EST.{" "}
            {personalInfo.yearsOfExperience}+ YRS
          </span>
        </div>

        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: HARD_EASE }}
          className={cn(
            styles.heroTilt,
            "uppercase leading-[0.8] [font-family:var(--font-brutal-display)]",
          )}
        >
          <span className="block text-[clamp(4.5rem,18vw,17rem)]">
            {firstName}
            <span className="text-[#ff2b00]">.</span>
          </span>
          <span className="block text-transparent [-webkit-text-stroke:2px_#6e6e6a] [text-stroke:2px_#6e6e6a] text-[clamp(1.8rem,7vw,6.5rem)]">
            {restName.join(" ")}
          </span>
        </motion.h1>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35, ease: HARD_EASE }}
            className="max-w-md text-xs uppercase leading-relaxed tracking-[0.2em] text-[#9a9a96]"
          >
            {personalInfo.tagline}. No decoration. Just output.
          </motion.p>
          <a
            href="#about"
            className="pointer-events-auto border-2 border-[#e8e8e4] px-5 py-3 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#ff2b00] hover:border-[#ff2b00] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2b00]"
          >
            Descend ↓
          </a>
        </div>
      </div>
    </section>
  );
}
