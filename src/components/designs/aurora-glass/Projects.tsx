"use client";

import { ExternalLink, Github, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/data/resume";
import { GlassPanel, SectionHeading, Tag } from "./shared";
import styles from "./aurora.module.css";

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  ai: "AI / ML",
  backend: "Backend",
  fullstack: "Full Stack",
  frontend: "Frontend",
};

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading
        eyebrow="03 · Constellations"
        title="Projects"
        id="projects-heading"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <GlassPanel
            key={project.id}
            delay={(index % 2) * 0.1}
            floatDelay={index * 1.1}
            hover
            innerClassName="flex h-full flex-col p-6 sm:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-indigo-300/30 bg-indigo-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-indigo-200/90">
                  {CATEGORY_LABELS[project.category] ?? project.category}
                </span>
                {project.featured && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-200/80">
                    <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} on GitHub`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/70 transition-colors duration-300 hover:border-teal-200/50 hover:text-teal-100"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} live site`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/70 transition-colors duration-300 hover:border-fuchsia-300/50 hover:text-fuchsia-200"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            <h3
              className={cn(
                styles.display,
                "mt-5 text-lg font-semibold text-white sm:text-xl",
              )}
            >
              {project.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {project.description}
            </p>

            {project.longDescription && (
              <p className="mt-3 text-[13px] leading-relaxed text-white/55">
                {project.longDescription.replace(/\s+/g, " ").trim()}
              </p>
            )}

            {project.metrics && (
              <ul
                className="mt-5 flex flex-wrap gap-2"
                aria-label="Project highlights"
              >
                {project.metrics.map((metric) => (
                  <li
                    key={metric}
                    className="rounded-full border border-teal-300/25 bg-teal-400/10 px-3 py-1 text-[11px] font-medium text-teal-100/90 shadow-[0_0_14px_rgba(45,212,191,0.12)]"
                  >
                    {metric}
                  </li>
                ))}
              </ul>
            )}

            <ul
              className="mt-auto flex flex-wrap gap-2 pt-6"
              aria-label="Technologies"
            >
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
