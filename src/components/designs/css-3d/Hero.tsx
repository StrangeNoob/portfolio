"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { personalInfo } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";

const [first, middle, last] = personalInfo.name.split(" ");

const lineVariants = {
  hidden: { opacity: 0, y: 80, rotateX: 28, transformPerspective: 1000 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transformPerspective: 1000,
    transition: {
      duration: 0.9,
      delay: 0.15 + i * 0.13,
      ease: [0.21, 0.65, 0.3, 1] as const,
    },
  }),
};

/** depth style helper for decorative shapes */
function depth(dx: number, dy: number, dz: number): CSSProperties {
  return {
    "--dx": String(dx),
    "--dy": String(dy),
    "--dz": `${dz}px`,
  } as CSSProperties;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const frame = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const enabled = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const noMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    enabled.current = fine && !noMotion;
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const flush = useCallback(() => {
    frame.current = null;
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty("--px", pointer.current.x.toFixed(4));
    el.style.setProperty("--py", pointer.current.y.toFixed(4));
  }, []);

  const schedule = useCallback(() => {
    if (frame.current === null) {
      frame.current = requestAnimationFrame(flush);
    }
  }, [flush]);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      schedule();
    },
    [schedule]
  );

  const onPointerLeave = useCallback(() => {
    pointer.current.x = 0;
    pointer.current.y = 0;
    schedule();
  }, [schedule]);

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-label="Introduction"
      className={cn(
        styles.perspective,
        "relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-28 pb-20 sm:px-10 lg:px-16"
      )}
    >
      {/* ---- background wash + halftone, deepest layer ---- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 700px at 78% 18%, var(--paper-deep), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className={cn(
          styles.dots,
          styles.decoDrift,
          "absolute top-[14%] left-[6%] hidden h-44 w-64 opacity-70 md:block"
        )}
        style={depth(10, 8, -60)}
      />

      {/* ---- 3D stage: everything inside tilts with the pointer ---- */}
      <div className={cn(styles.heroStage, "mx-auto w-full max-w-6xl")}>
        {/* floating geometric decorations at distinct depths */}
        <div
          aria-hidden="true"
          className={cn(
            styles.decoDrift,
            styles.float,
            "absolute -top-16 right-[4%] h-32 w-32 rounded-full sm:h-44 sm:w-44"
          )}
          style={{
            ...depth(-34, -26, 90),
            background: "var(--accent)",
          }}
        />
        <div
          aria-hidden="true"
          className={cn(
            styles.decoDrift,
            styles.floatSlow,
            "absolute top-[30%] -left-10 h-40 w-40 rounded-full border-2 sm:h-56 sm:w-56"
          )}
          style={{ ...depth(18, 14, -50), borderColor: "var(--line)" }}
        />
        <div
          aria-hidden="true"
          className={cn(
            styles.decoDrift,
            styles.spin,
            "absolute right-[14%] bottom-[6%] hidden h-16 w-16 md:block"
          )}
          style={{ ...depth(-22, -18, 50), background: "var(--ink)" }}
        />
        <div
          aria-hidden="true"
          className={cn(
            styles.decoDrift,
            "absolute top-[12%] left-[38%] hidden font-mono text-xl md:block"
          )}
          style={{ ...depth(-14, -10, 30), color: "var(--accent-ink)" }}
        >
          +
        </div>

        {/* kicker — outer div owns the CSS depth, inner motion owns entrance */}
        <div className={styles.layerMid}>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 font-mono text-xs tracking-[0.3em] uppercase sm:text-sm"
            style={{ color: "var(--accent-ink)" }}
          >
            {personalInfo.title} · {personalInfo.yearsOfExperience}+ yrs ·{" "}
            {personalInfo.location}
          </motion.p>
        </div>

        {/* name split across z-depths */}
        <h1
          className={cn(
            styles.display,
            styles.preserve3d,
            "text-[clamp(3.2rem,11.5vw,9.5rem)] leading-[0.94] font-semibold tracking-tight uppercase"
          )}
        >
          <span className={cn(styles.layerBack, "block")}>
            <motion.span
              custom={0}
              variants={lineVariants}
              initial={reduced ? { opacity: 0 } : "hidden"}
              animate={reduced ? { opacity: 1 } : "show"}
              className="block"
              style={{ color: "var(--ink-soft)" }}
            >
              {first}
            </motion.span>
          </span>
          <span className={cn(styles.layerFront, "block")}>
            <motion.span
              custom={1}
              variants={lineVariants}
              initial={reduced ? { opacity: 0 } : "hidden"}
              animate={reduced ? { opacity: 1 } : "show"}
              className="block pl-[0.06em] italic"
              style={{ color: "var(--accent)" }}
            >
              {middle}
            </motion.span>
          </span>
          <span className={cn(styles.layerMid, "block")}>
            <motion.span
              custom={2}
              variants={lineVariants}
              initial={reduced ? { opacity: 0 } : "hidden"}
              animate={reduced ? { opacity: 1 } : "show"}
              className="block"
            >
              {last}
            </motion.span>
          </span>
        </h1>

        {/* tagline + CTAs, floating in front */}
        <div className={styles.layerFront}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
            className="mt-10 flex max-w-2xl flex-col gap-8"
          >
          <p
            className="border-l-2 pl-5 text-lg sm:text-xl"
            style={{ borderColor: "var(--accent)", color: "var(--ink-soft)" }}
          >
            {personalInfo.tagline}.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wider uppercase transition-colors duration-200"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
            >
              View work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-[rgba(29,24,18,0.3)] px-6 py-3 font-mono text-sm tracking-wider uppercase text-[#1d1812] transition-colors duration-200 hover:border-[#1d1812]"
            >
              Get in touch
            </a>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm tracking-wider uppercase underline underline-offset-4"
              style={{ color: "var(--accent-ink)" }}
            >
              Résumé
            </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll hint */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2"
        style={{ color: "var(--ink-soft)" }}
      >
        <ArrowDown className={cn(styles.float, "h-5 w-5")} aria-hidden="true" />
      </motion.a>
    </section>
  );
}
