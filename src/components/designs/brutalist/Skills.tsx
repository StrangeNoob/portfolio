"use client";

import { motion } from "framer-motion";
import { skills, type Skill } from "@/data/resume";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";
import styles from "./brutalist.module.css";

const HARD_EASE = [0.9, 0, 0.1, 1] as const;
const CELLS = 20;

const CATEGORIES: { key: Skill["category"]; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "mobile", label: "Mobile" },
  { key: "cloud", label: "Cloud" },
  { key: "database", label: "Database" },
  { key: "ai", label: "AI / ML" },
  { key: "tools", label: "Tools" },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className={cn(
        styles.snapSection,
        "bg-[#0c0c0c] px-6 py-24 text-[#e8e8e4] md:px-12",
      )}
    >
      <SectionHeader
        index="04"
        title="Skills"
        meta={`Inventory / ${skills.length} units / scale 0–100`}
      />

      <div className="mt-12 grid gap-x-12 gap-y-14 lg:grid-cols-2">
        {CATEGORIES.map((cat, ci) => {
          const group = skills.filter((s) => s.category === cat.key);
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.3, delay: (ci % 2) * 0.07, ease: HARD_EASE }}
            >
              <h3 className="border-b-4 border-[#e8e8e4] pb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#ff2b00]">
                {String(ci + 1).padStart(2, "0")} —{" "}
                <span className="text-[#e8e8e4]">{cat.label}</span>
              </h3>
              <ul>
                {group.map((skill) => {
                  const filled = Math.round((skill.proficiency / 100) * CELLS);
                  return (
                    <li
                      key={skill.name}
                      className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-[#2a2a28] py-4 hover:bg-[#f4f4f0] hover:px-3 sm:grid-cols-[minmax(8rem,1fr)_2fr_auto]"
                    >
                      <span className="text-lg uppercase leading-none [font-family:var(--font-brutal-display)] group-hover:text-[#0c0c0c] md:text-xl">
                        {skill.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className="col-span-2 flex h-3.5 gap-px sm:col-span-1"
                      >
                        {Array.from({ length: CELLS }, (_, i) => (
                          <span
                            key={i}
                            className={cn(
                              "flex-1",
                              i < filled
                                ? "bg-[#9a9a96] group-hover:bg-[#0c0c0c]"
                                : "bg-[#222220] group-hover:bg-[#c9c9c4]",
                            )}
                          />
                        ))}
                      </span>
                      <span className="row-start-1 text-right text-2xl leading-none [font-family:var(--font-brutal-display)] group-hover:text-[#ff2b00] sm:col-start-3">
                        {skill.proficiency}
                        <span className="sr-only"> out of 100</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
