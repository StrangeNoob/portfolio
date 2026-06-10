"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { experiences } from "@/data/resume";
import { GlassPanel, SectionHeading, Tag } from "./shared";
import styles from "./aurora.module.css";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative mx-auto max-w-5xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading
        eyebrow="02 · Trajectory"
        title="Experience"
        id="experience-heading"
      />

      <div className="relative">
        {/* Timeline rail */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-[7px] top-2 w-px bg-gradient-to-b from-teal-300/60 via-indigo-400/40 to-fuchsia-400/50 sm:left-[9px]"
        />

        <ol className="space-y-10">
          {experiences.map((experience, index) => (
            <li key={experience.id} className="relative pl-10 sm:pl-14">
              {/* Glowing node */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-7 h-[15px] w-[15px] rounded-full border border-teal-200/70 bg-[#070510] shadow-[0_0_16px_rgba(94,234,212,0.7)] sm:h-[19px] sm:w-[19px]"
              >
                <span className="absolute inset-[3px] rounded-full bg-gradient-to-br from-teal-300 to-fuchsia-400 sm:inset-1" />
              </span>

              <GlassPanel
                delay={index * 0.06}
                floatDelay={index * 1.3}
                hover
                innerClassName="p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <div>
                    <h3
                      className={cn(
                        styles.display,
                        "text-lg font-semibold text-white sm:text-xl",
                      )}
                    >
                      {experience.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-teal-200/90">
                      {experience.company} · {experience.location}
                    </p>
                  </div>
                  <p className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs tracking-wide text-white/70">
                    {experience.startDate} — {experience.endDate ?? "Present"}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-[15px]">
                  {experience.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {experience.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75"
                    >
                      <Sparkles
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-fuchsia-300/80"
                        aria-hidden="true"
                      />
                      {achievement}
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                  {experience.technologies.map((tech) => (
                    <li key={tech}>
                      <Tag>{tech}</Tag>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
