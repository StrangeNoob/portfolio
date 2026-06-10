"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { skills, type Skill } from "@/data/resume";
import { GlassPanel, SectionHeading } from "./shared";
import styles from "./aurora.module.css";

const CATEGORIES: { key: Skill["category"]; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "mobile", label: "Mobile" },
  { key: "cloud", label: "Cloud & DevOps" },
  { key: "database", label: "Databases" },
  { key: "ai", label: "AI / ML" },
  { key: "tools", label: "Tools & Workflow" },
];

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <li>
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <span className="text-sm text-white/85">{skill.name}</span>
        <span className="text-xs tabular-nums text-white/50">
          {skill.proficiency}
        </span>
      </div>
      <div
        role="meter"
        aria-label={`${skill.name} proficiency`}
        aria-valuenow={skill.proficiency}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-white/10"
      >
        <motion.div
          initial={reducedMotion ? false : { width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 1.1,
            delay: 0.15 + index * 0.07,
            ease: [0.21, 0.6, 0.35, 1],
          }}
          className={styles.bar}
          style={reducedMotion ? { width: `${skill.proficiency}%` } : undefined}
        />
      </div>
    </li>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading
        eyebrow="04 · Spectrum"
        title="Skills"
        id="skills-heading"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, categoryIndex) => {
          const items = skills.filter((s) => s.category === category.key);
          if (items.length === 0) return null;

          return (
            <GlassPanel
              key={category.key}
              delay={(categoryIndex % 3) * 0.1}
              floatDelay={categoryIndex * 0.8}
              innerClassName="p-6 sm:p-7"
            >
              <h3
                className={cn(
                  styles.display,
                  "mb-5 text-sm font-medium uppercase tracking-[0.22em] text-teal-100/90",
                )}
              >
                {category.label}
              </h3>
              <ul className="space-y-4">
                {items.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </ul>
            </GlassPanel>
          );
        })}
      </div>
    </section>
  );
}
