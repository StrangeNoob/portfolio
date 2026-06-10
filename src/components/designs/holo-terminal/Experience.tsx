'use client';

import { experiences } from '@/data/resume';
import { cn } from '@/lib/utils';
import { HoloPanel, SectionHeading } from './HoloPanel';
import styles from './holo.module.css';

export function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <SectionHeading index="02" command="git log --career --oneline" title="Experience" />

      <ol className="relative ml-2 space-y-10 border-l border-terminal-green/25 pl-8">
        {experiences.map((exp, i) => {
          const isCurrent = exp.endDate === null;
          return (
            <li key={exp.id} className="relative">
              {/* timeline node */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -left-[39px] top-8 h-3 w-3 rounded-full',
                  isCurrent
                    ? 'bg-terminal-amber shadow-[0_0_12px_rgba(255,176,0,0.9)]'
                    : 'bg-terminal-green shadow-[0_0_10px_rgba(57,255,20,0.8)]',
                )}
              />

              <HoloPanel
                accent={isCurrent ? 'amber' : i % 2 === 0 ? 'green' : 'cyan'}
                delay={Math.min(i * 0.08, 0.3)}
                className="p-7"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3
                    className={cn(
                      styles.fontDisplay,
                      'text-3xl uppercase tracking-wide text-terminal-green [text-shadow:0_0_12px_rgba(57,255,20,0.4)]',
                    )}
                  >
                    {exp.company}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#87a78f]">
                    {exp.startDate} — {exp.endDate ?? 'present'} · {exp.location}
                  </p>
                </div>

                <p className="mt-1 flex flex-wrap items-center gap-3 text-terminal-cyan">
                  {exp.role}
                  {isCurrent && (
                    <span className="border border-terminal-amber/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-terminal-amber [text-shadow:0_0_8px_rgba(255,176,0,0.5)]">
                      active
                    </span>
                  )}
                </p>

                <p className="mt-3 text-sm text-[#a9c4af]">{exp.description}</p>

                <ul className="mt-4 space-y-2">
                  {exp.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-3 text-sm text-[#c5dcc9]">
                      <span aria-hidden="true" className="mt-px shrink-0 text-terminal-green">
                        ▸
                      </span>
                      {achievement}
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="border border-terminal-green/30 bg-terminal-green/5 px-2.5 py-1 text-xs uppercase tracking-wider text-[#9fe8a8]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </HoloPanel>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
