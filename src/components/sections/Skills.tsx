'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { skills, type Skill } from '@/data/resume';

const categoryColors: Record<string, string> = {
  frontend: 'terminal-cyan',
  backend: 'terminal-green',
  mobile: 'terminal-amber',
  cloud: 'terminal-blue',
  database: 'terminal-purple',
  ai: 'terminal-pink',
  tools: 'terminal-yellow',
};

function SkillBar({
  skill,
  index,
  isInView,
  color,
}: {
  skill: Skill;
  index: number;
  isInView: boolean;
  color: string;
}) {
  const barWidth = skill.proficiency;
  const barChar = '█';
  const emptyChar = '░';
  const totalChars = 20;
  const filledChars = Math.round((barWidth / 100) * totalChars);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className="flex items-center gap-3 text-sm font-mono"
    >
      <span className="text-foreground w-28 truncate">{skill.name}</span>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 'auto' } : {}}
        transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
        className={`text-${color} text-xs tracking-tighter`}
      >
        {barChar.repeat(filledChars)}
        <span className="text-foreground-muted opacity-30">
          {emptyChar.repeat(totalChars - filledChars)}
        </span>
      </motion.div>
      <span className={`text-${color} text-xs w-10 text-right`}>
        {skill.proficiency}%
      </span>
    </motion.div>
  );
}

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  // Sort skills within each category by proficiency
  Object.keys(groupedSkills).forEach((category) => {
    groupedSkills[category].sort((a, b) => b.proficiency - a.proficiency);
  });

  const categoryOrder = ['frontend', 'backend', 'ai', 'mobile', 'cloud', 'database', 'tools'];

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
            <span>htop --skills</span>
            <span className="cursor" />
          </div>
        </motion.div>

        {/* Main Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="terminal-window"
        >
          <div className="terminal-header">
            <div className="terminal-btn terminal-btn-close" />
            <div className="terminal-btn terminal-btn-minimize" />
            <div className="terminal-btn terminal-btn-maximize" />
            <span className="terminal-title">skill_monitor</span>
          </div>
          <div className="terminal-body">
            {/* Header row */}
            <div className="text-xs text-foreground-muted mb-4 border-b border-border pb-2">
              <div className="flex justify-between">
                <span>SKILL PROFICIENCY MONITOR</span>
                <span className="text-terminal-green">ACTIVE</span>
              </div>
            </div>

            {/* Skills by category */}
            <div className="grid md:grid-cols-2 gap-8">
              {categoryOrder.map((category, catIndex) => {
                const categorySkills = groupedSkills[category];
                if (!categorySkills || categorySkills.length === 0) return null;
                const color = categoryColors[category] || 'terminal-green';

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + catIndex * 0.1 }}
                  >
                    <div className={`text-${color} text-sm font-bold mb-3 flex items-center gap-2`}>
                      <span className="text-foreground-muted">#</span>
                      {category.toUpperCase()}
                      <span className="text-foreground-muted text-xs">
                        ({categorySkills.length})
                      </span>
                    </div>
                    <div className="space-y-2 pl-4 border-l border-border">
                      {categorySkills.map((skill, skillIndex) => (
                        <SkillBar
                          key={skill.name}
                          skill={skill}
                          index={skillIndex}
                          isInView={isInView}
                          color={color}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="mt-8 pt-4 border-t border-border"
            >
              <div className="flex flex-wrap justify-between text-xs text-foreground-muted gap-4">
                <div>
                  <span className="text-terminal-green">TOTAL:</span> {skills.length} skills
                </div>
                <div>
                  <span className="text-terminal-cyan">CATEGORIES:</span> {Object.keys(groupedSkills).length}
                </div>
                <div>
                  <span className="text-terminal-amber">AVG PROFICIENCY:</span>{' '}
                  {Math.round(skills.reduce((a, b) => a + b.proficiency, 0) / skills.length)}%
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
