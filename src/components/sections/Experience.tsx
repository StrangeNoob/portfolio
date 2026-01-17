'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { experiences } from '@/data/resume';

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-24 md:py-32 px-4 grid-bg overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <div className="absolute left-10 top-0 h-72 w-72 rounded-full bg-terminal-purple/18 blur-[140px]" />
        <div className="absolute right-0 bottom-6 h-64 w-64 rounded-full bg-terminal-cyan/16 blur-[120px]" />
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-terminal-green mb-2">
            <span>$</span>
            <span>history --work</span>
            <span className="cursor" />
          </div>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="terminal-window glow-ring"
        >
          <div className="terminal-header">
            <div className="terminal-btn terminal-btn-close" />
            <div className="terminal-btn terminal-btn-minimize" />
            <div className="terminal-btn terminal-btn-maximize" />
            <span className="terminal-title">work_history.log</span>
          </div>
          <div className="terminal-body max-h-[600px] overflow-y-auto">
            {/* Git log style output */}
            <div className="text-xs text-foreground-muted mb-4">
              $ git log --oneline --graph work_history
            </div>

            {experiences.map((exp, index) => {
              const isActive = exp.endDate === null;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="mb-8 last:mb-0"
                >
                  {/* Commit line */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-terminal-amber">*</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-terminal-amber font-bold">
                          {exp.id.slice(0, 7)}
                        </span>
                        {isActive && (
                          <span className="text-terminal-green text-xs px-2 py-0.5 border border-terminal-green rounded">
                            HEAD
                          </span>
                        )}
                        <span className="text-foreground-muted text-sm">
                          ({exp.startDate} - {exp.endDate ?? 'Present'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Commit details */}
                  <div className="ml-6 pl-4 border-l border-border">
                    {/* Company & Role */}
                    <div className="mb-3">
                      <div className="text-terminal-cyan text-lg font-bold">
                        {exp.company}
                      </div>
                      <div className="text-terminal-purple text-sm">
                        {exp.role}
                      </div>
                      <div className="text-foreground-muted text-xs">
                        📍 {exp.location}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="text-foreground-muted text-sm mb-3">
                      {exp.description}
                    </div>

                    {/* Achievements as diff */}
                    <div className="bg-background/30 rounded p-3 mb-3 text-xs">
                      <div className="text-foreground-muted mb-2">
                        # Changes in this role:
                      </div>
                      {exp.achievements.map((achievement, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-terminal-green">+</span>
                          <span className="text-terminal-green">{achievement}</span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-0.5 bg-surface border border-border rounded text-foreground-muted hover:text-terminal-cyan hover:border-terminal-cyan transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connector line */}
                  {index < experiences.length - 1 && (
                    <div className="ml-6 mt-4 text-foreground-muted">|</div>
                  )}
                </motion.div>
              );
            })}

            {/* End of log */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="mt-6 text-foreground-muted text-xs"
            >
              <span className="text-terminal-green">$</span> # End of work history
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Experience;
