"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/data/resume";
import { SocialLinks } from "./shared";
import styles from "./aurora.module.css";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.21, 0.6, 0.35, 1] as const },
  },
};

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 pb-24 pt-32 text-center sm:px-6"
    >
      <motion.div
        variants={container}
        initial={reducedMotion ? "visible" : "hidden"}
        animate="visible"
        className="flex max-w-4xl flex-col items-center"
      >
        <motion.p
          variants={item}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs tracking-wide text-white/80 backdrop-blur-md"
        >
          <span
            aria-hidden="true"
            className={cn(
              styles.pulseDot,
              "h-1.5 w-1.5 rounded-full bg-teal-300",
            )}
          />
          SDE II at Pathfndr · {personalInfo.yearsOfExperience}+ years of
          experience
        </motion.p>

        <motion.h1
          variants={item}
          id="hero-heading"
          className={cn(
            styles.display,
            styles.iridescent,
            "text-balance text-4xl font-bold leading-[1.12] sm:text-6xl lg:text-7xl",
          )}
        >
          {personalInfo.name}
        </motion.h1>

        <motion.p
          variants={item}
          className={cn(
            styles.display,
            "mt-6 text-base font-light tracking-[0.18em] text-teal-100/90 sm:text-lg",
          )}
        >
          {personalInfo.title.toUpperCase()}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
        >
          {personalInfo.tagline} — from 20-second APIs tuned down to 300ms, to
          RAG-powered search across the stars of travel data.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-400/90 via-indigo-400/90 to-fuchsia-400/90 px-6 py-3 text-sm font-semibold text-[#070510] shadow-[0_0_32px_rgba(167,139,250,0.45)] transition-shadow duration-300 hover:shadow-[0_0_48px_rgba(167,139,250,0.65)]"
          >
            Explore my work
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-md transition-colors duration-300 hover:border-teal-200/50 hover:bg-white/[0.12]"
          >
            Get in touch
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <SocialLinks />
          <p className="inline-flex items-center gap-1.5 text-xs text-white/55">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {personalInfo.location} · {personalInfo.email}
          </p>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-teal-200"
      >
        <ChevronDown className={cn(styles.drift, "h-6 w-6")} aria-hidden="true" />
      </motion.a>
    </section>
  );
}
