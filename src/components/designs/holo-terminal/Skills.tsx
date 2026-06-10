'use client';

import { motion } from 'framer-motion';
import { skills, type Skill } from '@/data/resume';
import { cn } from '@/lib/utils';
import { HoloPanel, SectionHeading } from './HoloPanel';
import styles from './holo.module.css';

const CATEGORIES: ReadonlyArray<{ key: Skill['category']; label: string }> = [
  { key: 'frontend', label: 'frontend' },
  { key: 'backend', label: 'backend' },
  { key: 'mobile', label: 'mobile' },
  { key: 'cloud', label: 'cloud' },
  { key: 'database', label: 'database' },
  { key: 'ai', label: 'ai / ml' },
  { key: 'tools', label: 'tools' },
];

function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
  return (
    <li>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="text-[#d9f0dc]">{skill.name}</span>
        <span className="text-xs text-terminal-cyan [text-shadow:0_0_6px_rgba(0,255,255,0.4)]">
          {skill.proficiency}%
        </span>
      </div>
      <div
        aria-hidden="true"
        className="h-2 overflow-hidden border border-terminal-green/25 bg-[#020a06]"
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-terminal-green to-terminal-cyan shadow-[0_0_10px_rgba(57,255,20,0.5)]"
        />
      </div>
    </li>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <SectionHeading index="04" command="htop --sort proficiency" title="Skills" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, i) => {
          const group = skills.filter((skill) => skill.category === category.key);
          if (group.length === 0) return null;
          return (
            <HoloPanel
              key={category.key}
              accent={i % 3 === 1 ? 'cyan' : i % 3 === 2 ? 'amber' : 'green'}
              delay={Math.min((i % 3) * 0.08, 0.24)}
              className="p-6"
            >
              <h3
                className={cn(
                  styles.fontDisplay,
                  'mb-5 text-2xl uppercase tracking-[0.15em] text-terminal-green [text-shadow:0_0_10px_rgba(57,255,20,0.4)]',
                )}
              >
                <span aria-hidden="true" className="mr-2 text-terminal-cyan">
                  ▣
                </span>
                {category.label}
              </h3>
              <ul className="space-y-4">
                {group.map((skill, j) => (
                  <SkillBar key={skill.name} skill={skill} delay={j * 0.06} />
                ))}
              </ul>
            </HoloPanel>
          );
        })}
      </div>
    </section>
  );
}
