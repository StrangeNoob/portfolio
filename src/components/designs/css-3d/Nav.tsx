import { navItems, personalInfo } from "@/data/resume";
import styles from "./styles.module.css";
import { cn } from "@/lib/utils";

export function Nav() {
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
        <a
          href={`mailto:${personalInfo.email}`}
          className="font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline"
          style={{ color: "var(--accent-ink)" }}
        >
          Hire me
        </a>
      </nav>
    </header>
  );
}
