'use client';

import { navItems } from '@/data/resume';
import { cn } from '@/lib/utils';
import styles from './holo.module.css';

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-terminal-green/20 bg-[#050807]/80 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6"
      >
        <a
          href="#top"
          className={cn(
            styles.fontDisplay,
            'text-xl uppercase tracking-widest text-terminal-green [text-shadow:0_0_10px_rgba(57,255,20,0.5)] transition-colors hover:text-terminal-cyan',
          )}
        >
          ~/prateek<span aria-hidden="true" className={styles.blink} />
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((nav) => (
            <li key={nav.href}>
              <a
                href={nav.href}
                className="text-xs uppercase tracking-[0.2em] text-[#87a78f] transition-colors hover:text-terminal-green hover:[text-shadow:0_0_10px_currentColor]"
              >
                ./{nav.name.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="text-xs uppercase tracking-[0.2em] text-terminal-amber transition-colors hover:[text-shadow:0_0_10px_currentColor] md:hidden"
        >
          ./contact
        </a>
      </nav>
    </header>
  );
}
