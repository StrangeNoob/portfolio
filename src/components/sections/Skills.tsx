'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useMemo, memo } from 'react';
import { skills, type Skill } from '@/data/resume';

// htop-style bar component
const HtopBar = memo(function HtopBar({
  skill,
  index,
  isInView,
}: {
  skill: Skill;
  index: number;
  isInView: boolean;
}) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const barLength = 25; // Total bar length in characters

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedWidth(skill.proficiency);
      }, 100 + index * 50);
      return () => clearTimeout(timer);
    }
  }, [isInView, skill.proficiency, index]);

  const filledLength = Math.round((animatedWidth / 100) * barLength);

  // Create multicolored segments like htop
  // Green (low usage): 0-33%, Yellow: 34-66%, Red: 67-100%
  const greenEnd = Math.min(filledLength, Math.round(barLength * 0.33));
  const yellowEnd = Math.min(filledLength, Math.round(barLength * 0.66));
  const redEnd = filledLength;

  const greenBars = greenEnd;
  const yellowBars = Math.max(0, yellowEnd - greenEnd);
  const redBars = Math.max(0, redEnd - yellowEnd);
  const emptyBars = barLength - filledLength;

  const proficiencyLevel = skill.proficiency >= 80 ? 'Expert' :
                           skill.proficiency >= 60 ? 'Proficient' : 'Learning';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="flex items-center font-mono text-sm"
      role="listitem"
      aria-label={`${skill.name}: ${skill.proficiency}% proficiency, ${proficiencyLevel} level`}
    >
      {/* Index number like htop CPU cores */}
      <span className="text-terminal-cyan w-6 text-right mr-1" aria-hidden="true">
        {index}
      </span>
      <span className="text-foreground-muted" aria-hidden="true">[</span>

      {/* Multicolored bar segments */}
      <span className="text-green-400" aria-hidden="true">{'|'.repeat(greenBars)}</span>
      <span className="text-yellow-400" aria-hidden="true">{'|'.repeat(yellowBars)}</span>
      <span className="text-red-400" aria-hidden="true">{'|'.repeat(redBars)}</span>
      <span className="text-foreground-muted/20" aria-hidden="true">{' '.repeat(emptyBars)}</span>

      <span className="text-foreground-muted" aria-hidden="true">]</span>

      {/* Percentage and skill name */}
      <span className="text-foreground-muted ml-1 w-12 text-right">
        {animatedWidth.toFixed(1)}%
      </span>
      <span className="text-foreground ml-2 truncate">
        {skill.name}
      </span>
    </motion.div>
  );
});

// Memory/Swap style bar for category summary
const CategoryBar = memo(function CategoryBar({
  label,
  used,
  total,
  color,
  isInView,
  delay,
}: {
  label: string;
  used: number;
  total: number;
  color: string;
  isInView: boolean;
  delay: number;
}) {
  const [animatedUsed, setAnimatedUsed] = useState(0);
  const barLength = 20;

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedUsed(used);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, used, delay]);

  const filledLength = Math.round((animatedUsed / total) * barLength);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className="flex items-center font-mono text-sm"
      aria-label={`${label}: ${animatedUsed} of ${total}`}
    >
      <span className={`${color} w-8`}>{label}</span>
      <span className="text-foreground-muted" aria-hidden="true">[</span>
      <span className={color} aria-hidden="true">{'|'.repeat(filledLength)}</span>
      <span className="text-foreground-muted/20" aria-hidden="true">{' '.repeat(barLength - filledLength)}</span>
      <span className="text-foreground-muted" aria-hidden="true">]</span>
      <span className="text-foreground-muted ml-1">
        {animatedUsed}/{total}
      </span>
    </motion.div>
  );
});

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Memoize sorted skills
  const sortedSkills = useMemo(() => {
    return [...skills].sort((a, b) => b.proficiency - a.proficiency);
  }, []);

  // Memoize grouped skills
  const groupedSkills = useMemo(() => {
    return skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, Skill[]>
    );
  }, []);

  // Memoize category stats
  const categoryStats = useMemo(() => {
    return Object.entries(groupedSkills).map(([category, categorySkills]) => ({
      category,
      count: categorySkills.length,
      avgProficiency: Math.round(
        categorySkills.reduce((sum, s) => sum + s.proficiency, 0) / categorySkills.length
      ),
    }));
  }, [groupedSkills]);

  // Memoize total average
  const totalAvg = useMemo(() => {
    return Math.round(skills.reduce((a, b) => a + b.proficiency, 0) / skills.length);
  }, []);

  const uptime = '4y 2m 15d'; // Years of experience

  // Memoize skill halves for rendering
  const { firstHalf, secondHalf } = useMemo(() => ({
    firstHalf: sortedSkills.slice(0, Math.ceil(sortedSkills.length / 2)),
    secondHalf: sortedSkills.slice(Math.ceil(sortedSkills.length / 2)),
  }), [sortedSkills]);

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 md:py-32 px-4 grid-bg"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-terminal-green mb-2">
            <span>$</span>
            <span>htop</span>
            <span className="cursor" aria-hidden="true" />
          </div>
        </motion.div>

        {/* Main Terminal - htop style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="terminal-window"
        >
          <div className="terminal-header" role="presentation">
            <div className="terminal-btn terminal-btn-close" aria-hidden="true" />
            <div className="terminal-btn terminal-btn-minimize" aria-hidden="true" />
            <div className="terminal-btn terminal-btn-maximize" aria-hidden="true" />
            <span className="terminal-title">htop - skill monitor</span>
          </div>
          <div className="terminal-body p-0">
            {/* Top section with CPU bars and memory */}
            <div className="grid md:grid-cols-2 gap-4 p-4 border-b border-border bg-background/50">
              {/* Left column - First half of skills as CPU cores */}
              <div className="space-y-0.5" role="list" aria-label="Skills proficiency - first half">
                {firstHalf.map((skill, index) => (
                  <HtopBar
                    key={skill.name}
                    skill={skill}
                    index={index}
                    isInView={isInView}
                  />
                ))}
              </div>

              {/* Right column - Second half + memory stats */}
              <div className="space-y-0.5">
                <div role="list" aria-label="Skills proficiency - second half">
                  {secondHalf.map((skill, index) => (
                    <HtopBar
                      key={skill.name}
                      skill={skill}
                      index={index + Math.ceil(sortedSkills.length / 2)}
                      isInView={isInView}
                    />
                  ))}
                </div>

                {/* Memory-like stats */}
                <div className="mt-4 pt-2 border-t border-border/50" role="group" aria-label="Summary statistics">
                  <CategoryBar
                    label="Exp"
                    used={totalAvg}
                    total={100}
                    color="text-green-400"
                    isInView={isInView}
                    delay={800}
                  />
                  <CategoryBar
                    label="Skl"
                    used={skills.length}
                    total={30}
                    color="text-yellow-400"
                    isInView={isInView}
                    delay={900}
                  />
                </div>
              </div>
            </div>

            {/* Bottom section - Process-like table */}
            <div className="p-4">
              {/* Header row */}
              <div
                className="flex text-xs font-mono text-foreground-muted border-b border-border pb-2 mb-2"
                role="row"
                aria-hidden="true"
              >
                <span className="w-12">PID</span>
                <span className="w-20">CATEGORY</span>
                <span className="w-32">SKILL</span>
                <span className="w-16 text-right">PROF%</span>
                <span className="flex-1 text-right">STATUS</span>
              </div>

              {/* Skill rows as processes */}
              <div
                className="space-y-1 max-h-64 overflow-y-auto"
                role="table"
                aria-label="Detailed skill breakdown"
              >
                {sortedSkills.map((skill, index) => {
                  const status = skill.proficiency >= 80 ? 'EXPERT' :
                                 skill.proficiency >= 60 ? 'PROFICIENT' :
                                 'LEARNING';
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.2, delay: 0.5 + index * 0.02 }}
                      className="flex text-xs font-mono hover:bg-terminal-green/10 py-0.5 px-1 -mx-1 rounded cursor-default"
                      role="row"
                      aria-label={`${skill.name}, ${skill.category}, ${skill.proficiency}% proficiency, ${status}`}
                    >
                      <span className="w-12 text-terminal-cyan" role="cell">{1000 + index}</span>
                      <span className="w-20 text-terminal-purple truncate" role="cell">{skill.category}</span>
                      <span className="w-32 text-foreground truncate" role="cell">{skill.name}</span>
                      <span
                        className={`w-16 text-right ${
                          skill.proficiency >= 80 ? 'text-green-400' :
                          skill.proficiency >= 60 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}
                        role="cell"
                      >
                        {skill.proficiency}%
                        <span className="sr-only">
                          , {status} level
                        </span>
                      </span>
                      <span className="flex-1 text-right text-terminal-green" role="cell">
                        {status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer - htop style status bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap justify-between text-xs font-mono px-4 py-2 bg-terminal-green/10 border-t border-border gap-x-4 gap-y-1"
              role="contentinfo"
              aria-label="Skills summary"
            >
              <span>
                <span className="text-terminal-green">Tasks:</span>{' '}
                <span className="text-foreground">{skills.length}</span>
              </span>
              <span>
                <span className="text-terminal-cyan">Categories:</span>{' '}
                <span className="text-foreground">{Object.keys(groupedSkills).length}</span>
              </span>
              <span>
                <span className="text-terminal-amber">Avg:</span>{' '}
                <span className="text-foreground">{totalAvg}%</span>
              </span>
              <span>
                <span className="text-terminal-purple">Uptime:</span>{' '}
                <span className="text-foreground">{uptime}</span>
              </span>
              <span className="text-foreground-muted" aria-hidden="true">
                F1<span className="text-terminal-cyan">Help</span>{' '}
                F2<span className="text-terminal-cyan">Setup</span>{' '}
                F10<span className="text-terminal-cyan">Quit</span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
