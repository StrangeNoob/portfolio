'use client';

import Link from 'next/link';
import { MotionConfig } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { About } from './About';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { Contact } from './Contact';
import { Footer } from './Footer';
import styles from './holo.module.css';

export default function HoloTerminalPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div data-design-root className={cn(styles.root, 'relative min-h-screen overflow-x-clip')}>
        {/* skip link for keyboard users */}
        <a
          href="#main"
          className="sr-only z-[80] bg-[#050807] px-4 py-2 text-terminal-green focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          skip to content
        </a>

        {/* static CRT film + vignette (site-wide overlay is suppressed by data-design-root) */}
        <div aria-hidden="true" className={styles.scanlines} />
        <div aria-hidden="true" className={styles.vignette} />

        <Nav />

        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
        </main>

        <Footer />

        <Link
          href="/designs"
          className="fixed bottom-4 left-4 z-50 border border-terminal-green/40 bg-[#050807]/85 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-terminal-green backdrop-blur transition-colors hover:border-terminal-green hover:[text-shadow:0_0_8px_currentColor]"
        >
          ← all designs
        </Link>
      </div>
    </MotionConfig>
  );
}
