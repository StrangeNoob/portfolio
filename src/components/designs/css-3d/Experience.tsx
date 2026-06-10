import { experiences } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function Experience() {
  return (
    <section
      id="experience"
      aria-label="Experience"
      className="relative px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
      style={{ background: "var(--paper-deep)" }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          number="02"
          title="Experience"
          eyebrow="2022 — Present"
        />

        <ol className="relative flex flex-col gap-10 lg:gap-12">
          {/* timeline rail */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] hidden w-px lg:block"
            style={{ background: "var(--line)" }}
          />
          {experiences.map((exp, i) => (
            <li key={exp.id} className="lg:pl-14">
              <Reveal delay={Math.min(i * 0.06, 0.2)}>
                <div className="relative">
                  {/* timeline node */}
                  <span
                    aria-hidden="true"
                    className="absolute top-8 -left-14 hidden h-[15px] w-[15px] rounded-full border-2 lg:block"
                    style={{
                      borderColor: "var(--accent-ink)",
                      background: exp.endDate
                        ? "var(--paper-deep)"
                        : "var(--accent)",
                    }}
                  />
                  <TiltCard
                    maxTilt={3.5}
                    className="border border-[rgba(29,24,18,0.16)] bg-[#fffdf6] p-7 sm:p-9"
                    glare={false}
                  >
                    <article>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <h3
                          className={cn(
                            styles.display,
                            "text-2xl font-semibold sm:text-3xl"
                          )}
                        >
                          {exp.role}{" "}
                          <span
                            className="italic"
                            style={{ color: "var(--accent-ink)" }}
                          >
                            @ {exp.company}
                          </span>
                        </h3>
                        <p
                          className="font-mono text-xs tracking-[0.18em] uppercase"
                          style={{ color: "var(--ink-soft)" }}
                        >
                          {exp.startDate} — {exp.endDate ?? "Present"} ·{" "}
                          {exp.location}
                        </p>
                      </div>

                      <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
                        {exp.description}
                      </p>

                      <ul className="mt-5 flex flex-col gap-2">
                        {exp.achievements.map((a) => (
                          <li key={a} className="flex gap-3 text-[0.95rem]">
                            <span
                              aria-hidden="true"
                              className="mt-[0.7em] h-px w-5 shrink-0"
                              style={{ background: "var(--accent)" }}
                            />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>

                      <ul
                        className="mt-6 flex flex-wrap gap-2"
                        aria-label="Technologies used"
                      >
                        {exp.technologies.map((t) => (
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
                    </article>
                  </TiltCard>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
