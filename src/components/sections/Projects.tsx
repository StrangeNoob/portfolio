'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useRef, useMemo, memo } from 'react';
import { projects, type Project } from '@/data/resume';

type FilterCategory = 'all' | 'frontend' | 'backend' | 'mobile' | 'ai' | 'fullstack' | 'web';

const filters: { label: string; value: FilterCategory; cmd: string }[] = [
  { label: 'all', value: 'all', cmd: 'ls -la' },
  { label: 'ai', value: 'ai', cmd: 'grep -r "ai"' },
  { label: 'backend', value: 'backend', cmd: 'grep -r "backend"' },
  { label: 'mobile', value: 'mobile', cmd: 'grep -r "mobile"' },
  { label: 'frontend', value: 'frontend', cmd: 'grep -r "frontend"' },
];

const categoryColors: Record<string, string> = {
  ai: 'text-terminal-purple',
  backend: 'text-terminal-cyan',
  mobile: 'text-terminal-amber',
  frontend: 'text-terminal-green',
  fullstack: 'text-terminal-pink',
  web: 'text-terminal-blue',
};

const ProjectCard = memo(function ProjectCard({ project, index }: { project: Project; index: number }) {
  const color = categoryColors[project.category] || 'text-terminal-green';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="terminal-window group"
    >
      <div className="terminal-header" role="presentation">
        <div className="terminal-btn terminal-btn-close" aria-hidden="true" />
        <div className="terminal-btn terminal-btn-minimize" aria-hidden="true" />
        <div className="terminal-btn terminal-btn-maximize" aria-hidden="true" />
        <span className="terminal-title">{project.title.toLowerCase().replace(/\s/g, '_')}.md</span>
      </div>
      <div className="terminal-body text-sm">
        {/* Category & Featured badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs uppercase tracking-wider ${color}`}>
            [{project.category}]
          </span>
          {project.featured && (
            <span className="text-xs text-terminal-amber" aria-label="Featured project">★ featured</span>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold mb-2 ${color} text-glow`}>
          # {project.title}
        </h3>

        {/* Description */}
        <p className="text-foreground-muted text-sm mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-foreground-muted mb-2"># Metrics:</div>
            <div className="flex flex-wrap gap-2">
              {project.metrics.map((metric) => (
                <span
                  key={`${project.id}-metric-${metric}`}
                  className="text-xs px-2 py-1 bg-terminal-green/10 border border-terminal-green/30 text-terminal-green rounded"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        <div className="mb-4">
          <div className="text-xs text-foreground-muted mb-2"># Tech stack:</div>
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech) => (
              <span
                key={`${project.id}-tech-${tech}`}
                className="text-xs px-2 py-0.5 bg-surface border border-border rounded text-foreground-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-3 border-t border-border text-xs">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-cyan hover:text-glow hover:underline"
              aria-label={`View ${project.title} live demo`}
            >
              $ open --live
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-cyan hover:text-glow hover:underline"
              aria-label={`View ${project.title} source code on GitHub`}
            >
              $ git clone
            </a>
          ) : null}
          {!project.liveUrl && !project.githubUrl && (
            <span className="text-foreground-muted italic">// private repo</span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (activeFilter === 'all') return true;
      return project.category === activeFilter;
    });
  }, [activeFilter]);

  return (
    <section
      id="projects"
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
            <span>ls ./projects</span>
            <span className="cursor" aria-hidden="true" />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="terminal-window inline-block">
            <div className="terminal-header" role="presentation">
              <div className="terminal-btn terminal-btn-close" aria-hidden="true" />
              <div className="terminal-btn terminal-btn-minimize" aria-hidden="true" />
              <div className="terminal-btn terminal-btn-maximize" aria-hidden="true" />
              <span className="terminal-title">filter</span>
            </div>
            <div className="p-3 flex flex-wrap gap-2" role="tablist" aria-label="Project category filters">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  role="tab"
                  aria-selected={activeFilter === filter.value}
                  aria-controls="projects-grid"
                  className={`px-3 py-1.5 text-xs font-mono border rounded transition-all ${activeFilter === filter.value
                      ? 'bg-terminal-green/20 border-terminal-green text-terminal-green text-glow'
                      : 'border-border text-foreground-muted hover:border-terminal-green hover:text-terminal-green'
                    }`}
                >
                  {filter.cmd}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          id="projects-grid"
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="tabpanel"
          aria-label={`Projects filtered by ${activeFilter}`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-foreground-muted"
              role="status"
            >
              <div className="font-mono">
                <span className="text-terminal-amber">!</span> No projects found matching filter
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GitHub link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/StrangeNoob"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground-muted hover:text-terminal-green transition-colors font-mono"
            aria-label="View all projects on GitHub"
          >
            $ open https://github.com/StrangeNoob
          </a>
        </motion.div>
      </div>
    </section>
  );
}
