"use client";

import { useEffect, useState } from "react";
import { navItems, personalInfo } from "@/data/resume";
import styles from "./styles.module.css";
import { cn } from "@/lib/utils";

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--line)",
        background: "color-mix(in srgb, var(--paper) 82%, transparent)",
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10"
      >
        <a
          href="#top"
          className={cn(styles.display, "text-xl font-bold tracking-tight")}
        >
          PKM<span style={{ color: "var(--accent)" }}>.</span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-xs tracking-[0.2em] uppercase text-[#5d554a] transition-colors duration-150 hover:text-[#b0350f]"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${personalInfo.email}`}
            className="font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline"
            style={{ color: "var(--accent-ink)" }}
          >
            Hire me
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="font-mono text-xs tracking-[0.2em] uppercase text-[#1d1812] underline-offset-4 hover:text-[#b0350f] md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="mobile-nav"
          className="border-t px-6 py-4 md:hidden"
          style={{
            borderColor: "var(--line)",
            background: "color-mix(in srgb, var(--paper) 96%, transparent)",
          }}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-sm tracking-[0.2em] uppercase text-[#1d1812] hover:text-[#b0350f]"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
