import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "@/components/designs/css-3d/styles.module.css";
import { Nav } from "@/components/designs/css-3d/Nav";
import { Hero } from "@/components/designs/css-3d/Hero";
import { About } from "@/components/designs/css-3d/About";
import { Experience } from "@/components/designs/css-3d/Experience";
import { Projects } from "@/components/designs/css-3d/Projects";
import { Skills } from "@/components/designs/css-3d/Skills";
import { Contact } from "@/components/designs/css-3d/Contact";
import { Footer } from "@/components/designs/css-3d/Footer";

export default function Css3dDesignPage() {
  return (
    <div
      data-design-root
      id="top"
      className={cn(styles.root, "min-h-screen")}
    >
      {/* film-grain overlay, pure CSS */}
      <div className={styles.noise} aria-hidden="true" />

      <a
        href="#main"
        className="sr-only z-[80] focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:bg-[#1d1812] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-[#f7f1e6]"
      >
        Skip to content
      </a>

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
        className="fixed bottom-5 left-5 z-[60] border border-[rgba(29,24,18,0.25)] bg-[#fffdf6]/90 px-3 py-2 font-mono text-xs tracking-[0.15em] uppercase shadow-sm backdrop-blur-sm transition-colors hover:text-[#b0350f]"
      >
        ← all designs
      </Link>
    </div>
  );
}
