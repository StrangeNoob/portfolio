import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { navItems, personalInfo } from '@/data/resume';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Subtle gradient rings */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-terminal-green/20 blur-[140px]" />
        <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-terminal-pink/15 blur-[160px]" />
        <div className="absolute left-1/2 bottom-0 h-96 w-96 -translate-x-1/2 rounded-full bg-terminal-cyan/12 blur-[180px]" />
      </div>

      {/* Command bar */}
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-terminal-green/30 via-terminal-cyan/25 to-terminal-pink/25 border border-border flex items-center justify-center text-terminal-green text-lg font-bold glow-ring">
              $
            </div>
            <div>
              <div className="text-sm font-semibold text-terminal-green">guest@portfolio</div>
              <div className="text-xs text-foreground-muted">~/prateek/{personalInfo?.name ? personalInfo.name.split(' ')[0].toLowerCase() : 'profile'}</div>
            </div>
          </div>

          <nav className="ml-auto hidden items-center gap-2 rounded-lg border border-border bg-surface/60 px-2 py-1 text-xs font-mono shadow-lg sm:flex glow-ring">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="rounded-md px-3 py-2 text-foreground-muted hover:text-terminal-cyan hover:bg-terminal-cyan/10 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <a
            href={personalInfo.resumeUrl}
            download
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-terminal-green bg-terminal-green/10 px-4 py-2 text-sm font-mono text-terminal-green hover:bg-terminal-green hover:text-background transition-colors glow-ring"
          >
            wget resume.pdf
          </a>
        </div>
      </header>

      <main className="min-h-screen">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />

        {/* Footer */}
        <footer className="py-10 border-t border-border/70 bg-background/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-sm text-foreground-muted font-mono">
                © {new Date().getFullYear()} Prateek Kumar Mohanty — terminal mode engaged.
              </p>
              <p className="text-sm text-foreground-muted font-mono flex flex-wrap items-center gap-2">
                Built with <span className="text-accent-primary">Next.js</span>
                <span className="text-foreground-muted">+</span>
                <span className="text-accent-secondary">Tailwind</span>
                <span className="text-foreground-muted">+</span>
                <span className="text-accent-tertiary">Framer Motion</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
