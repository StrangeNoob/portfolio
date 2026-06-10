"use client";

import { ArrowUp } from "lucide-react";
import { personalInfo } from "@/data/resume";
import { SocialLinks } from "./shared";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-white/[0.02] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-9 text-center sm:flex-row sm:px-6 sm:text-left">
        <div>
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} {personalInfo.name}
          </p>
          <p className="mt-1 text-xs text-white/45">
            Drawn from starlight — Next.js, Three.js & Framer Motion.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <SocialLinks />
          <a
            href="#top"
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/75 transition-colors duration-300 hover:border-teal-200/50 hover:text-teal-100"
          >
            <ArrowUp className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
