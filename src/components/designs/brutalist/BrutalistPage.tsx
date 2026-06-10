"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { navItems, personalInfo } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./brutalist.module.css";
import Hero from "./Hero";
import Marquee from "./Marquee";
import About from "./About";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import Contact from "./Contact";
import Footer from "./Footer";

interface BrutalistPageProps {
  /** show the fixed "← all designs" link (design-exploration routes only) */
  showDesignsLink?: boolean;
}

export default function BrutalistPage({
  showDesignsLink = true,
}: BrutalistPageProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        data-design-root
        className={cn(
          styles.snapContainer,
          "h-dvh min-h-screen overflow-y-auto overflow-x-hidden bg-[#0c0c0c] text-base text-[#e8e8e4] antialiased [font-family:var(--font-brutal-mono)]",
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-[#ff2b00] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.3em] focus:text-[#0c0c0c]"
        >
          Skip to content
        </a>

        <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.3em] md:px-12"
          >
            <a
              href="#top"
              className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              PKM■{String(personalInfo.yearsOfExperience).padStart(2, "0")}
            </a>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 md:gap-x-7">
              {navItems.map((item, i) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <span aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}/
                    </span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main id="main">
          <Hero />
          <Marquee text={personalInfo.tagline} variant="red" />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Marquee
            text={`Available for work — ${personalInfo.email}`}
            variant="red"
          />
          <Contact />
        </main>

        <Footer />

        {showDesignsLink && (
          <Link
            href="/designs"
            className="fixed bottom-5 left-5 z-50 text-[11px] font-bold uppercase tracking-[0.3em] text-white mix-blend-difference hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            ← all designs
          </Link>
        )}
      </div>
    </MotionConfig>
  );
}
