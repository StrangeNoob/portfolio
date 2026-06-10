"use client";

import { motion } from "framer-motion";
import {
  experiences,
  personalInfo,
  projects,
  skills,
} from "@/data/resume";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";
import styles from "./brutalist.module.css";

const HARD_EASE = [0.9, 0, 0.1, 1] as const;

const STATS = [
  { value: `${personalInfo.yearsOfExperience}+`, label: "Years shipping" },
  { value: `${experiences.length}`, label: "Roles held" },
  { value: `${projects.length}`, label: "Projects indexed" },
  { value: `${skills.length}`, label: "Tools mastered" },
];

export default function About() {
  const paragraphs = personalInfo.bio
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section
      id="about"
      className={cn(
        styles.snapSection,
        "bg-[#f4f4f0] px-6 py-24 text-[#0c0c0c] md:px-12",
      )}
    >
      <SectionHeader index="01" title="About" meta="The subject" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: HARD_EASE }}
              className={cn(
                "uppercase leading-tight [font-family:var(--font-brutal-display)]",
                i === 0
                  ? "text-[clamp(1.6rem,4vw,3.2rem)]"
                  : "mt-8 max-w-3xl text-[clamp(1.1rem,2.2vw,1.8rem)] text-[#3a3a38]",
              )}
            >
              {p}
            </motion.p>
          ))}

          <p className="mt-10 max-w-2xl border-l-4 border-[#0c0c0c] pl-4 text-sm leading-relaxed">
            BASED IN {personalInfo.location.toUpperCase()}. CURRENTLY{" "}
            {experiences[0].role.toUpperCase()} AT{" "}
            {experiences[0].company.toUpperCase()}. REACHABLE AT{" "}
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-bold underline underline-offset-4 hover:bg-[#0c0c0c] hover:text-[#f4f4f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2b00]"
            >
              {personalInfo.email.toUpperCase()}
            </a>
            .
          </p>
        </div>

        {/* Stat slabs with exposed grid lines */}
        <div className="grid grid-cols-2 border-2 border-[#0c0c0c] lg:grid-cols-1">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.25, delay: i * 0.06, ease: HARD_EASE }}
              className="group border border-[#0c0c0c] p-6 hover:bg-[#0c0c0c]"
            >
              <p className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none [font-family:var(--font-brutal-display)] group-hover:text-[#ff2b00]">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] group-hover:text-[#f4f4f0]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
