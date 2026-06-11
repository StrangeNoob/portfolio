"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/resume";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";
import styles from "./brutalist.module.css";

const HARD_EASE = [0.9, 0, 0.1, 1] as const;

export default function Experience() {
  return (
    <section
      id="experience"
      className={cn(
        styles.snapSection,
        "bg-[#0c0c0c] px-6 py-24 text-[#e8e8e4] md:px-12",
      )}
    >
      <SectionHeader
        index="02"
        title="Work"
        meta={`Ledger / ${experiences.length} entries`}
      />

      <div className="mt-12 border-t-2 border-[#e8e8e4]">
        {experiences.map((exp, i) => (
          <motion.article
            key={exp.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: HARD_EASE }}
            className="group grid gap-6 border-b-2 border-[#e8e8e4] px-2 py-10 hover:bg-[#f4f4f0] hover:text-[#0c0c0c] md:grid-cols-[64px_1.1fr_1.4fr] md:px-4"
          >
            <p
              aria-hidden="true"
              className="text-sm font-bold text-[#ff2b00] [font-family:var(--font-brutal-mono)]"
            >
              {String(i + 1).padStart(2, "0")}
            </p>

            <div>
              <h3 className="text-[clamp(1.8rem,4vw,3.2rem)] uppercase leading-[0.9] [font-family:var(--font-brutal-display)]">
                {exp.company}
              </h3>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em]">
                {exp.role}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#9a9a96] group-hover:text-[#55554f]">
                {exp.startDate} — {exp.endDate ?? "PRESENT"} / {exp.location}
              </p>
              <p className="mt-4 max-w-sm text-xs leading-relaxed uppercase text-[#9a9a96] group-hover:text-[#3a3a38]">
                {exp.description}
              </p>
            </div>

            <div>
              <ul className="space-y-2">
                {exp.achievements.map((a) => (
                  <li
                    key={a}
                    className="flex gap-3 text-sm leading-snug uppercase"
                  >
                    <span aria-hidden="true" className="shrink-0 text-[#ff2b00]">
                      ▶
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[11px] uppercase tracking-[0.15em] text-[#9a9a96] group-hover:text-[#55554f]">
                {exp.technologies.map((t) => `[${t}]`).join(" ")}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
