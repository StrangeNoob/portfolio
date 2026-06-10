"use client";

import { useState } from "react";
import { skills, type Skill } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const CATEGORIES: { key: Skill["category"]; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "mobile", label: "Mobile" },
  { key: "cloud", label: "Cloud & DevOps" },
  { key: "database", label: "Databases" },
  { key: "ai", label: "AI / ML" },
  { key: "tools", label: "Tooling" },
];

function FlipCard({
  index,
  label,
  items,
}: {
  index: number;
  label: string;
  items: Skill[];
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${label}: ${items.length} skills. Activate to flip the card.`}
      className={cn(styles.flip, "h-72 w-full text-left")}
    >
      <div className={styles.flipInner} data-flipped={flipped}>
        {/* front */}
        <div
          className={cn(
            styles.face,
            "flex flex-col justify-between border border-[rgba(29,24,18,0.16)] bg-[#fffdf6] p-6"
          )}
        >
          <div className="flex items-start justify-between">
            <span
              className="font-mono text-xs tracking-[0.2em]"
              style={{ color: "var(--accent-ink)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className="font-mono text-[0.65rem] tracking-[0.2em] uppercase"
              style={{ color: "var(--ink-soft)" }}
            >
              flip ↻
            </span>
          </div>
          <div>
            <h3
              className={cn(styles.display, "text-3xl leading-tight font-semibold")}
            >
              {label}
            </h3>
            <p
              className="mt-2 font-mono text-xs tracking-[0.2em] uppercase"
              style={{ color: "var(--ink-soft)" }}
            >
              {items.length} {items.length === 1 ? "skill" : "skills"}
            </p>
          </div>
        </div>

        {/* back */}
        <div
          className={cn(
            styles.face,
            styles.faceBack,
            "flex flex-col justify-center gap-3 p-6"
          )}
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          {items.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium">{skill.name}</span>
                <span
                  className="font-mono text-[0.65rem]"
                  style={{ color: "color-mix(in srgb, var(--paper) 65%, transparent)" }}
                >
                  {skill.proficiency}
                </span>
              </div>
              <div
                className="mt-1 h-1 w-full"
                style={{ background: "rgba(247, 241, 230, 0.18)" }}
                role="presentation"
              >
                <div
                  className="h-full"
                  style={{
                    width: `${skill.proficiency}%`,
                    background: "var(--accent)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

export function Skills() {
  const top = [...skills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 3);

  return (
    <section
      id="skills"
      aria-label="Skills"
      className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
      style={{ background: "var(--paper-deep)" }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          number="04"
          title="Tech Stack"
          eyebrow="Hover or tap to flip"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.key} delay={Math.min((i % 4) * 0.07, 0.25)}>
              <FlipCard
                index={i}
                label={cat.label}
                items={skills.filter((s) => s.category === cat.key)}
              />
            </Reveal>
          ))}

          {/* 8th tile: strongest tools, keeps the grid balanced */}
          <Reveal delay={0.25}>
            <div
              className="flex h-72 flex-col justify-between p-6"
              style={{ background: "var(--accent)", color: "#fff7ef" }}
            >
              <span className="font-mono text-xs tracking-[0.2em] uppercase">
                Sharpest tools
              </span>
              <div className="flex flex-col gap-1">
                {top.map((s) => (
                  <p
                    key={s.name}
                    className={cn(
                      styles.display,
                      "text-2xl leading-tight font-semibold"
                    )}
                  >
                    {s.name}{" "}
                    <span className="font-mono text-sm font-normal">
                      /{s.proficiency}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
