"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { About } from "./About";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import styles from "./aurora.module.css";

/* The R3F canvas only ever renders on the client. */
const AuroraScene = dynamic(() => import("./AuroraScene"), { ssr: false });

export default function AuroraGlassPage() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      data-design-root
      id="top"
      className={cn(
        styles.root,
        "relative min-h-screen overflow-x-clip selection:bg-fuchsia-400/30 selection:text-white",
      )}
    >
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-teal-300 px-5 py-2.5 text-sm font-semibold text-[#070510] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* Cosmic backdrop: static gradient fallback + animated WebGL aurora.
          With prefers-reduced-motion the shader renders one frozen frame. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-0",
          styles.staticAurora,
        )}
      >
        <AuroraScene frozen={reducedMotion === true} />
      </div>

      <Nav />

      <main id="main-content" className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <Footer />

      {/* Escape hatch to the design gallery */}
      <Link
        href="/designs"
        className={cn(
          styles.glass,
          "fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-white/80 transition-colors duration-300 hover:text-teal-100",
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        all designs
      </Link>
    </div>
  );
}
