import { cn } from "@/lib/utils";
import styles from "./styles.module.css";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  number: string;
  title: string;
  eyebrow?: string;
}

export function SectionHeading({ number, title, eyebrow }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="mb-12 sm:mb-16">
        <div className="mb-4 flex items-center gap-4">
          <span
            className="font-mono text-sm tracking-[0.25em]"
            style={{ color: "var(--accent-ink)" }}
          >
            {number} /
          </span>
          <span
            className="h-px flex-1"
            style={{ background: "var(--line)" }}
            aria-hidden="true"
          />
          {eyebrow && (
            <span
              className="font-mono text-xs tracking-[0.25em] uppercase"
              style={{ color: "var(--ink-soft)" }}
            >
              {eyebrow}
            </span>
          )}
        </div>
        <h2
          className={cn(
            styles.display,
            "text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          )}
        >
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
