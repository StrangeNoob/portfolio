"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/data/resume";
import styles from "./aurora.module.css";

/* ------------------------------------------------------------------ */
/* GlassPanel — Framer reveal on the outer node, CSS float on inner    */
/* ------------------------------------------------------------------ */

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  float?: boolean;
  floatDelay?: number;
  hover?: boolean;
}

export function GlassPanel({
  children,
  className,
  innerClassName,
  delay = 0,
  float = true,
  floatDelay = 0,
  hover = false,
}: GlassPanelProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.21, 0.6, 0.35, 1] }}
      className={className}
    >
      <div
        className={cn(
          styles.glass,
          float && styles.float,
          hover && styles.glassHover,
          "h-full",
          innerClassName,
        )}
        style={floatDelay ? { animationDelay: `${floatDelay}s` } : undefined}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeading                                                      */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
      className="mb-10 sm:mb-14"
    >
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.4em] text-teal-200/80">
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          styles.display,
          styles.iridescent,
          "text-3xl font-semibold sm:text-5xl",
        )}
      >
        {title}
      </h2>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Tag                                                                 */
/* ------------------------------------------------------------------ */

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-xs text-white/75">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Social links                                                        */
/* ------------------------------------------------------------------ */

const ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  mail: Mail,
};

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {socialLinks.map((link) => {
        const Icon = ICONS[link.icon] ?? Mail;
        return (
          <li key={link.name}>
            <a
              href={link.url}
              target={link.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={link.name}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/75 transition-colors duration-300 hover:border-teal-200/50 hover:bg-white/[0.12] hover:text-teal-100"
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
