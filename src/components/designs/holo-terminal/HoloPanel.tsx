'use client';

import { useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './holo.module.css';

type Accent = 'green' | 'cyan' | 'amber';

const accentClass: Record<Accent, string | undefined> = {
  green: undefined,
  cyan: styles.panelCyan,
  amber: styles.panelAmber,
};

interface HoloPanelProps {
  children: React.ReactNode;
  accent?: Accent;
  delay?: number;
  className?: string;
  wrapperClassName?: string;
  tilt?: boolean;
}

/**
 * Translucent bordered "hologram" panel with glowing edges and corner
 * brackets. Tilts slightly in 3D toward the cursor on hover and reveals
 * on scroll via Framer Motion.
 */
export function HoloPanel({
  children,
  accent = 'green',
  delay = 0,
  className,
  wrapperClassName,
  tilt = true,
}: HoloPanelProps) {
  const reduced = useReducedMotion();

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt || reduced) return;
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--ry', `${(px * 4).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-py * 4).toFixed(2)}deg`);
    },
    [tilt, reduced],
  );

  const handleLeave = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--rx', '0deg');
    event.currentTarget.style.setProperty('--ry', '0deg');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      style={{ perspective: 900 }}
      className={wrapperClassName}
    >
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(styles.panel, accentClass[accent], className)}
      >
        <span aria-hidden="true" className={cn(styles.corner, styles.cornerTl)} />
        <span aria-hidden="true" className={cn(styles.corner, styles.cornerTr)} />
        <span aria-hidden="true" className={cn(styles.corner, styles.cornerBl)} />
        <span aria-hidden="true" className={cn(styles.corner, styles.cornerBr)} />
        {children}
      </div>
    </motion.div>
  );
}

interface SectionHeadingProps {
  index: string;
  command: string;
  title: string;
}

/** Terminal-prompt section heading: `guest@prateek:~$ <command>` + big display title. */
export function SectionHeading({ index, command, title }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-10"
    >
      <p className="text-sm tracking-wider text-[#87a78f]">
        <span className="text-terminal-green">guest@prateek</span>
        <span className="text-[#5d7763]">:~$</span> {command}
      </p>
      <h2
        className={cn(
          styles.fontDisplay,
          styles.chroma,
          'mt-2 text-4xl uppercase tracking-wide text-terminal-green sm:text-5xl',
        )}
      >
        <span className="mr-3 text-terminal-cyan">{index}/</span>
        {title}
      </h2>
    </motion.div>
  );
}
