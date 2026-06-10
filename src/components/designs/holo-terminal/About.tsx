'use client';

import { Cpu, Mail, MapPin, Terminal } from 'lucide-react';
import { experiences, personalInfo } from '@/data/resume';
import { cn } from '@/lib/utils';
import { HoloPanel, SectionHeading } from './HoloPanel';
import styles from './holo.module.css';

const FACTS = [
  {
    icon: Terminal,
    label: 'current_role',
    value: `${experiences[0].role} @ ${experiences[0].company}`,
  },
  { icon: Cpu, label: 'experience', value: `${personalInfo.yearsOfExperience}+ years` },
  { icon: MapPin, label: 'location', value: personalInfo.location },
  { icon: Mail, label: 'email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
] as const;

export function About() {
  const paragraphs = personalInfo.bio
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <SectionHeading index="01" command="cat ./about.txt" title="About" />

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <HoloPanel className="p-8">
          <p
            className={cn(
              styles.fontDisplay,
              'mb-4 text-2xl uppercase tracking-wide text-terminal-cyan [text-shadow:0_0_12px_rgba(0,255,255,0.35)]',
            )}
          >
            {'// human-readable output'}
          </p>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mb-4 text-[#c5dcc9] last:mb-0">
              {paragraph}
            </p>
          ))}
          <p className="mt-6 border-t border-terminal-green/20 pt-4 text-sm text-[#87a78f]">
            <span className="text-terminal-green">$</span> exit_code=0 — happiest when a slow
            endpoint becomes a fast one.
          </p>
        </HoloPanel>

        <HoloPanel accent="cyan" delay={0.12} className="p-8">
          <p
            className={cn(
              styles.fontDisplay,
              'mb-6 text-2xl uppercase tracking-wide text-terminal-green [text-shadow:0_0_12px_rgba(57,255,20,0.35)]',
            )}
          >
            {'// sysinfo'}
          </p>
          <dl className="space-y-5">
            {FACTS.map((fact) => (
              <div key={fact.label} className="flex items-start gap-3">
                <fact.icon
                  size={18}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-terminal-cyan"
                />
                <div className="min-w-0">
                  <dt className="text-xs uppercase tracking-[0.2em] text-[#87a78f]">
                    {fact.label}
                  </dt>
                  <dd className="break-words text-[#d9f0dc]">
                    {'href' in fact ? (
                      <a
                        href={fact.href}
                        className="underline decoration-terminal-green/40 underline-offset-4 transition-colors hover:text-terminal-green"
                      >
                        {fact.value}
                      </a>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </HoloPanel>
      </div>
    </section>
  );
}
