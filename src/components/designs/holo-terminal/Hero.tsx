'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Download, FolderGit2 } from 'lucide-react';
import { personalInfo, socialLinks } from '@/data/resume';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from './hooks';
import styles from './holo.module.css';

const HoloScene = dynamic(() => import('./HoloScene'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(57,255,20,0.06),transparent_60%)]"
    />
  ),
});

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length && interval) clearInterval(interval);
      }, 26);
    }, delay);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, reduced]);

  const visible = reduced ? text : text.slice(0, count);
  return <span aria-label={text}>{visible}</span>;
}

const STATS: ReadonlyArray<readonly [string, string]> = [
  ['4+', 'years shipping'],
  ['97%', 'api speedup'],
  ['1.2K+', 'hotels in <10s'],
  ['2', 'ios apps live'],
];

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden">
      {/* 3D holographic scene */}
      <div aria-hidden="true" className="absolute inset-0">
        <HoloScene reduced={reduced} />
      </div>

      {/* readability gradients over the canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050807]/85 via-[#050807]/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050807] to-transparent"
      />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-32">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
          className="max-w-2xl"
        >
          <motion.p variants={item} className="mb-4 text-sm text-[#87a78f]">
            <span className="text-terminal-green">guest@prateek</span>
            <span className="text-[#5d7763]">:~$</span>{' '}
            <Typewriter text="ssh prateek.dev --holo // connection established" delay={400} />
            <span aria-hidden="true" className={styles.blink} />
          </motion.p>

          <motion.h1
            variants={item}
            className={cn(
              styles.fontDisplay,
              styles.chroma,
              styles.flicker,
              'text-6xl uppercase leading-[0.95] tracking-wide text-terminal-green sm:text-7xl lg:text-8xl',
            )}
          >
            Prateek
            <br />
            Kumar Mohanty
          </motion.h1>

          <motion.p
            variants={item}
            className={cn(
              styles.fontDisplay,
              styles.chromaSoft,
              'mt-5 text-2xl uppercase tracking-[0.18em] text-terminal-cyan sm:text-3xl',
            )}
          >
            {'>'} {personalInfo.title}
          </motion.p>

          <motion.p variants={item} className="mt-6 max-w-xl text-base text-[#c5dcc9]">
            {personalInfo.tagline}. Currently SDE II at Pathfndr — wiring RAG search,
            GCP microservices and ruthless API optimization into travel tech.
          </motion.p>

          <motion.dl variants={item} className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(([value, label]) => (
              <div
                key={label}
                className="flex flex-col-reverse border-l-2 border-terminal-green/40 pl-3"
              >
                <dt className="text-xs uppercase tracking-wider text-[#87a78f]">{label}</dt>
                <dd
                  className={cn(
                    styles.fontDisplay,
                    'text-3xl text-terminal-amber [text-shadow:0_0_10px_rgba(255,176,0,0.45)]',
                  )}
                >
                  {value}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#projects" className={cn(styles.cmdButton, 'pointer-events-auto')}>
              <FolderGit2 size={16} aria-hidden="true" />
              ./view_projects
            </a>
            <a
              href={personalInfo.resumeUrl}
              download
              className={cn(styles.cmdButton, styles.cmdButtonCyan, 'pointer-events-auto')}
            >
              <Download size={16} aria-hidden="true" />
              ./download_resume
            </a>
          </motion.div>

          <motion.ul variants={item} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="pointer-events-auto text-[#87a78f] transition-colors hover:text-terminal-green hover:[text-shadow:0_0_10px_currentColor]"
                >
                  [{link.name.toLowerCase()}]
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-[#87a78f] transition-colors hover:text-terminal-green"
      >
        <span className="flex flex-col items-center gap-1">
          scroll
          <ChevronDown size={16} aria-hidden="true" className={reduced ? '' : 'animate-bounce'} />
        </span>
      </motion.a>
    </section>
  );
}
