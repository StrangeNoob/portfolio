import { experiences, personalInfo, projects, skills } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ParallaxY } from "./Parallax";

const bioParagraphs = personalInfo.bio
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const stats = [
  { value: `${personalInfo.yearsOfExperience}+`, label: "Years shipping" },
  { value: `${experiences.length}`, label: "Companies" },
  { value: `${projects.length}`, label: "Featured builds" },
  { value: `${skills.length}+`, label: "Technologies" },
];

export function About() {
  return (
    <section
      id="about"
      aria-label="About"
      className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      {/* background layer drifting at its own scroll speed */}
      <ParallaxY
        from={90}
        to={-90}
        className="absolute -right-24 top-10 -z-10 hidden lg:block"
      >
        <div
          className="h-72 w-72 rounded-full border-2"
          style={{ borderColor: "var(--line)" }}
        />
      </ParallaxY>
      <ParallaxY
        from={-50}
        to={70}
        className="absolute left-[4%] bottom-8 -z-10 hidden lg:block"
      >
        <div className={cn(styles.dots, "h-40 w-56 opacity-60")} />
      </ParallaxY>

      <div className="mx-auto max-w-6xl">
        <SectionHeading number="01" title="About" eyebrow="Who I am" />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <p
              className={cn(
                styles.display,
                "text-2xl leading-snug font-medium sm:text-3xl"
              )}
            >
              I build for the moment a 20-second request becomes{" "}
              <em style={{ color: "var(--accent-ink)" }}>300 milliseconds</em>{" "}
              — performance, polish, and products people actually feel.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex flex-col gap-5">
              {bioParagraphs.map((p) => (
                <p key={p.slice(0, 24)} style={{ color: "var(--ink-soft)" }}>
                  {p}
                </p>
              ))}
              <dl className="mt-2 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col border-t pt-3"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <dt
                      className="order-last font-mono text-[0.65rem] tracking-[0.2em] uppercase"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      {s.label}
                    </dt>
                    <dd
                      className={cn(
                        styles.display,
                        "text-3xl font-semibold"
                      )}
                      style={{ color: "var(--accent-ink)" }}
                    >
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
