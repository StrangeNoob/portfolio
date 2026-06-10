'use client';

import { personalInfo, socialLinks } from '@/data/resume';
import { cn } from '@/lib/utils';
import styles from './holo.module.css';

export function Footer() {
  return (
    <footer className="border-t border-terminal-green/20 bg-[#030504]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
        <p className="text-xs text-[#87a78f]">
          <span className={cn(styles.fontDisplay, 'mr-2 text-base text-terminal-green')}>
            ~/prateek
          </span>
          © {new Date().getFullYear()} {personalInfo.name} · next.js + react-three-fiber +
          framer-motion
        </p>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[#87a78f] transition-colors hover:text-terminal-green hover:[text-shadow:0_0_8px_currentColor]"
              >
                [{link.name.toLowerCase()}]
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs uppercase tracking-[0.25em] text-terminal-cyan/70">
          design: holo-terminal
        </p>
      </div>
    </footer>
  );
}
