import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground-muted">
              © {new Date().getFullYear()} Prateek Kumar Mohanty. All rights reserved.
            </p>
            <p className="text-sm text-foreground-muted">
              Built with{' '}
              <span className="text-accent-primary">Next.js</span>,{' '}
              <span className="text-accent-secondary">Tailwind</span>, and{' '}
              <span className="text-accent-tertiary">Framer Motion</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
