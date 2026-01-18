'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const systemInfo = {
  user: 'prateek-kumar-mohanty',
  role: 'Full Stack Developer',
  location: 'India',
  uptime: '4+ years',
  status: 'active',
};

const bioLines = [
  '# Developer Profile',
  '',
  'I build software that moves fast and handles scale.',
  '',
  'Over the past 4 years, I have optimized APIs by 98.5%,',
  'published apps to the App Store, and led teams to ship',
  'production-ready products across the full stack.',
  '',
  '## Current Role @ Pathfndr',
  '',
  '- Building intelligent search systems powered by RAG',
  '- Deploying microservices on GCP',
  '- Fetching 1000s of hotels in <10 seconds',
  '',
  '## Previous Achievements',
  '',
  '- Increased database efficiency by 35% @ Dextr Labs',
  '- Built 50+ component UI library @ Frifty',
  '- Led team of 5 developers',
  '- Integrated 3 payment gateways @ Aarna',
];

const skills = [
  { category: 'frontend', items: ['React', 'Next.js', 'Flutter', 'TypeScript'] },
  { category: 'backend', items: ['Node.js', 'Python', 'FastAPI', 'GraphQL'] },
  { category: 'cloud', items: ['GCP', 'AWS', 'Docker'] },
  { category: 'database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Firebase'] },
];

const metrics = [
  { key: 'api_optimization', value: '98.5%', color: 'text-terminal-green' },
  { key: 'experience_years', value: '4+', color: 'text-terminal-cyan' },
  { key: 'team_size_led', value: '5+', color: 'text-terminal-amber' },
  { key: 'apps_published', value: '2', color: 'text-terminal-purple' },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 md:py-32 px-4 grid-bg"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-terminal-green mb-2">
            <span>$</span>
            <span>cat about.md</span>
            <span className="cursor" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - System Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Neofetch-style info */}
            <div className="terminal-window mb-6">
              <div className="terminal-header">
                <div className="terminal-btn terminal-btn-close" />
                <div className="terminal-btn terminal-btn-minimize" />
                <div className="terminal-btn terminal-btn-maximize" />
                <span className="terminal-title">neofetch</span>
              </div>
              <div className="terminal-body">
                <div className="flex gap-8">
                  {/* ASCII Logo */}
                  <pre className="text-terminal-green text-xs hidden md:block">
{`    ____  __  ___
   / __ \\/  |/  /
  / /_/ / /|_/ /
 / ____/ /  / /
/_/   /_/  /_/
                 `}
                  </pre>

                  {/* System Info */}
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-terminal-cyan">user</span>
                      <span className="text-foreground-muted">@</span>
                      <span className="text-terminal-cyan">portfolio</span>
                    </div>
                    <div className="text-foreground-muted">──────────────────</div>
                    <div>
                      <span className="text-terminal-purple">OS:</span>
                      <span className="text-foreground ml-2">Developer v4.0</span>
                    </div>
                    <div>
                      <span className="text-terminal-purple">Host:</span>
                      <span className="text-foreground ml-2">{systemInfo.user}</span>
                    </div>
                    <div>
                      <span className="text-terminal-purple">Role:</span>
                      <span className="text-foreground ml-2">{systemInfo.role}</span>
                    </div>
                    <div>
                      <span className="text-terminal-purple">Location:</span>
                      <span className="text-foreground ml-2">{systemInfo.location}</span>
                    </div>
                    <div>
                      <span className="text-terminal-purple">Uptime:</span>
                      <span className="text-foreground ml-2">{systemInfo.uptime}</span>
                    </div>
                    <div>
                      <span className="text-terminal-purple">Status:</span>
                      <span className="text-terminal-green ml-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse inline-block" />
                        {systemInfo.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-btn terminal-btn-close" />
                <div className="terminal-btn terminal-btn-minimize" />
                <div className="terminal-btn terminal-btn-maximize" />
                <span className="terminal-title">skills.json</span>
              </div>
              <div className="terminal-body text-sm">
                <div className="text-foreground-muted">{'{'}</div>
                {skills.map((skill, index) => (
                  <div key={skill.category} className="ml-4">
                    <span className="text-terminal-cyan">{`"${skill.category}"`}</span>
                    <span className="text-foreground-muted">: [</span>
                    <div className="ml-4">
                      {skill.items.map((item, i) => (
                        <span key={item}>
                          <span className="text-terminal-amber">{`"${item}"`}</span>
                          {i < skill.items.length - 1 && <span className="text-foreground-muted">, </span>}
                        </span>
                      ))}
                    </div>
                    <span className="text-foreground-muted">]</span>
                    {index < skills.length - 1 && <span className="text-foreground-muted">,</span>}
                  </div>
                ))}
                <div className="text-foreground-muted">{'}'}</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Bio & Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Bio Terminal */}
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-btn terminal-btn-close" />
                <div className="terminal-btn terminal-btn-minimize" />
                <div className="terminal-btn terminal-btn-maximize" />
                <span className="terminal-title">about.md</span>
              </div>
              <div className="terminal-body text-sm space-y-0.5 max-h-80 overflow-y-auto">
                {bioLines.map((line, index) => (
                  <motion.div
                    key={`bio-${index}-${line.slice(0, 20)}`}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.1, delay: 0.5 + index * 0.03 }}
                    className={`${
                      line.startsWith('#')
                        ? 'text-terminal-green font-bold text-glow'
                        : line.startsWith('-')
                        ? 'text-terminal-cyan'
                        : 'text-foreground-muted'
                    }`}
                  >
                    {line || '\u00A0'}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-btn terminal-btn-close" />
                <div className="terminal-btn terminal-btn-minimize" />
                <div className="terminal-btn terminal-btn-maximize" />
                <span className="terminal-title">metrics --export</span>
              </div>
              <div className="terminal-body">
                <div className="text-xs text-foreground-muted mb-3">
                  $ metrics --format=table
                </div>
                <div className="border border-border rounded overflow-hidden">
                  <div className="grid grid-cols-2 text-xs">
                    {metrics.map((metric, index) => (
                      <motion.div
                        key={metric.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                        className={`p-4 ${index < 2 ? 'border-b border-border' : ''} ${index % 2 === 0 ? 'border-r border-border' : ''}`}
                      >
                        <div className="text-foreground-muted text-[10px] uppercase tracking-wider mb-1">
                          {metric.key.replace(/_/g, ' ')}
                        </div>
                        <div className={`text-2xl font-bold ${metric.color} text-glow`}>
                          {metric.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
