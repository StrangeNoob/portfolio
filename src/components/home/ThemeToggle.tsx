"use client";

import { useTheme } from "./ThemeProvider";

/** Minimal castellated-rook silhouette — the site's signature object. */
function RookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 3h2.5v2.5h2V3h3v2.5h2V3H18v5l-1.5 1.5v8L19 20v1H5v-1l2.5-2.5v-8L6 8V3z" />
    </svg>
  );
}

/**
 * Fixed theme switch, bottom-right. Concrete-on-black in dark mode,
 * cream-on-paper in light mode — the rook is the shared mark.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={toggle}
      aria-pressed={!dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={
        dark
          ? "fixed right-5 bottom-5 z-[75] flex items-center gap-2 border border-[#3a3a3a] bg-[#0c0c0c]/90 px-3 py-2 font-mono text-[11px] font-bold tracking-[0.25em] text-[#9a9a96] uppercase backdrop-blur-sm transition-colors hover:border-[#ff2b00] hover:text-[#ff2b00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          : "fixed right-5 bottom-5 z-[75] flex items-center gap-2 rounded-sm border border-[rgba(29,24,18,0.25)] bg-[#fffdf6]/90 px-3 py-2 font-mono text-[11px] tracking-[0.25em] text-[#1d1812] uppercase shadow-sm backdrop-blur-sm transition-colors hover:text-[#b0350f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d1812]"
      }
    >
      <RookIcon className="h-4 w-4" />
      {dark ? "Light" : "Dark"}
    </button>
  );
}
