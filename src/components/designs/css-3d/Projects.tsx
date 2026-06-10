import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { ParallaxY } from "./Parallax";

export function Projects() {
  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <ParallaxY
        from={120}
        to={-80}
        className="absolute -left-20 top-1/3 -z-10 hidden lg:block"
      >
        <div
          className="h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)",
          }}
        />
      </ParallaxY>

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          number="03"
          title="Selected Work"
          eyebrow={`${projects.length} featured builds`}
        />

        <div className="grid gap-7 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal
              key={project.id}
              delay={Math.min((i % 2) * 0.1, 0.2)}
              className="h-full"
            >
              <TiltCard
                maxTilt={6}
                className="group flex h-full flex-col border border-[rgba(29,24,18,0.16)] bg-[#fffdf6] p-7 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.2em] uppercase"
                    style={{
                      borderColor: "var(--accent-ink)",
                      color: "var(--accent-ink)",
                    }}
                  >
                    {project.category}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  className={cn(
                    styles.display,
                    "mt-6 text-2xl font-semibold sm:text-3xl"
                  )}
                >
                  {project.title}
                </h3>

                <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
                  {project.description}.
                </p>

                {project.metrics && (
                  <ul
                    className="mt-5 flex flex-wrap gap-x-5 gap-y-1"
                    aria-label="Highlights"
                  >
                    {project.metrics.map((m) => (
                      <li
                        key={m}
                        className="font-mono text-xs tracking-wide"
                        style={{ color: "var(--accent-ink)" }}
                      >
                        ▪ {m}
                      </li>
                    ))}
                  </ul>
                )}

                <ul
                  className="mt-6 flex flex-wrap gap-2"
                  aria-label="Technologies"
                >
                  {project.technologies.map((t) => (
                    <li
                      key={t}
                      className="border px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.15em] uppercase"
                      style={{
                        borderColor: "var(--line)",
                        color: "var(--ink-soft)",
                      }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-auto flex gap-6 border-t pt-5"
                  style={{ borderColor: "var(--line)" }}
                >
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline"
                      style={{ color: "var(--ink)" }}
                    >
                      Code
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">
                        {" "}
                        for {project.title} (opens in new tab)
                      </span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline"
                      style={{ color: "var(--accent-ink)" }}
                    >
                      Live
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">
                        {" "}
                        demo of {project.title} (opens in new tab)
                      </span>
                    </a>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
