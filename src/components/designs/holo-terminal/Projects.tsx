'use client';

import { ArrowUpRight, Github } from 'lucide-react';
import { projects } from '@/data/resume';
import { cn } from '@/lib/utils';
import { HoloPanel, SectionHeading } from './HoloPanel';
import styles from './holo.module.css';

const CATEGORY_COLOR: Record<string, string> = {
  web: 'text-terminal-cyan border-terminal-cyan/50',
  frontend: 'text-terminal-cyan border-terminal-cyan/50',
  backend: 'text-terminal-amber border-terminal-amber/50',
  mobile: 'text-[#bd93f9] border-[#bd93f9]/50',
  ai: 'text-terminal-green border-terminal-green/50',
  fullstack: 'text-terminal-green border-terminal-green/50',
};

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <SectionHeading index="03" command="ls ./projects --featured" title="Projects" />

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <HoloPanel
            key={project.id}
            accent={i % 2 === 0 ? 'green' : 'cyan'}
            delay={Math.min(i * 0.08, 0.24)}
            className="flex h-full flex-col p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                className={cn(
                  styles.fontDisplay,
                  'text-3xl uppercase leading-tight tracking-wide text-terminal-green [text-shadow:0_0_12px_rgba(57,255,20,0.4)]',
                )}
              >
                {project.title}
              </h3>
              <span
                className={cn(
                  'shrink-0 border px-2 py-0.5 text-[10px] uppercase tracking-[0.25em]',
                  CATEGORY_COLOR[project.category] ?? CATEGORY_COLOR.fullstack,
                )}
              >
                {project.category}
              </span>
            </div>

            <p className="mt-3 text-sm text-[#c5dcc9]">{project.description}</p>

            {project.metrics && (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                {project.metrics.map((metric) => (
                  <li
                    key={metric}
                    className="text-xs uppercase tracking-wider text-terminal-amber [text-shadow:0_0_8px_rgba(255,176,0,0.4)]"
                  >
                    ◆ {metric}
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="border border-terminal-green/30 bg-terminal-green/5 px-2.5 py-1 text-xs uppercase tracking-wider text-[#9fe8a8]"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-5 border-t border-terminal-green/20 pt-5 text-sm">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#87a78f] transition-colors hover:text-terminal-green hover:[text-shadow:0_0_10px_currentColor]"
                >
                  <Github size={15} aria-hidden="true" />
                  source
                  <span className="sr-only"> for {project.title}</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#87a78f] transition-colors hover:text-terminal-cyan hover:[text-shadow:0_0_10px_currentColor]"
                >
                  <ArrowUpRight size={15} aria-hidden="true" />
                  live_demo
                  <span className="sr-only"> for {project.title}</span>
                </a>
              )}
            </div>
          </HoloPanel>
        ))}
      </div>
    </section>
  );
}
