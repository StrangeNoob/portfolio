import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { About } from "./About";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

interface LayeredDepthPageProps {
  /** show the fixed "← all designs" link (design-exploration routes only) */
  showDesignsLink?: boolean;
}

export default function LayeredDepthPage({
  showDesignsLink = true,
}: LayeredDepthPageProps) {
  return (
    <div data-design-root id="top" className={cn(styles.root, "min-h-screen")}>
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

      {showDesignsLink && (
        <Link
          href="/designs"
          className="fixed bottom-5 left-5 z-[60] border border-[rgba(29,24,18,0.25)] bg-[#fffdf6]/90 px-3 py-2 font-mono text-xs tracking-[0.15em] uppercase shadow-sm backdrop-blur-sm transition-colors hover:text-[#b0350f]"
        >
          ← all designs
        </Link>
      )}
    </div>
  );
}
