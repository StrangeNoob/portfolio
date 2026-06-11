"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/resume";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";
import styles from "./brutalist.module.css";

const HARD_EASE = [0.9, 0, 0.1, 1] as const;

export default function Projects() {
  return (
    <section
      id="projects"
      className={cn(
        styles.snapSection,
        "bg-[#f4f4f0] px-6 py-24 text-[#0c0c0c] md:px-12",
      )}
    >
      <SectionHeader
        index="03"
        title="Projects"
        meta={`Index / ${projects.length} slabs`}
      />

      <div className="mt-12 grid border-2 border-[#0c0c0c] md:grid-cols-2">
        {projects.map((project, i) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.3, delay: (i % 2) * 0.08, ease: HARD_EASE }}
            className="group flex flex-col border border-[#0c0c0c] p-7 hover:bg-[#0c0c0c] hover:text-[#f4f4f0] md:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <p
                aria-hidden="true"
                className="text-[clamp(2.2rem,4vw,3.5rem)] leading-none [font-family:var(--font-brutal-display)] group-hover:text-[#ff2b00]"
              >
                {String(i + 1).padStart(3, "0")}
              </p>
              <div className="text-right text-[10px] font-bold uppercase tracking-[0.3em]">
                <p>{project.category}</p>
                {project.featured && (
                  <p className="mt-1 bg-[#0c0c0c] px-2 py-1 text-[#f4f4f0] group-hover:bg-[#ff2b00] group-hover:text-[#0c0c0c]">
                    Featured
                  </p>
                )}
              </div>
            </div>

            <h3 className="mt-6 text-[clamp(1.8rem,3.5vw,3rem)] uppercase leading-[0.9] [font-family:var(--font-brutal-display)]">
              {project.title}
            </h3>

            <p className="mt-4 text-sm font-bold uppercase leading-snug">
              {project.description}
            </p>

            {project.longDescription && (
              <p className="mt-4 text-xs leading-relaxed text-[#55554f] group-hover:text-[#9a9a96]">
                {project.longDescription.replace(/\s+/g, " ").trim()}
              </p>
            )}

            {project.metrics && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.metrics.map((m) => (
                  <li
                    key={m}
                    className="border-2 border-current px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em]"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-5 text-[11px] uppercase tracking-[0.15em] text-[#55554f] group-hover:text-[#9a9a96]">
              {project.technologies.map((t) => `[${t}]`).join(" ")}
            </p>

            <div className="mt-auto flex gap-3 pt-8">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border-2 border-current px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#ff2b00] hover:text-[#0c0c0c] hover:border-[#ff2b00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2b00]"
                >
                  Code
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="sr-only">
                    {" "}
                    — {project.title} on GitHub (opens in new tab)
                  </span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border-2 border-current px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#ff2b00] hover:text-[#0c0c0c] hover:border-[#ff2b00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2b00]"
                >
                  Live
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="sr-only">
                    {" "}
                    — {project.title} live site (opens in new tab)
                  </span>
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
