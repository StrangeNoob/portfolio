import { navItems, personalInfo, socialLinks } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";

export function Footer() {
  return (
    <footer
      aria-label="Footer"
      className="px-6 pt-20 pb-10 sm:px-10 lg:px-16"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className={cn(
            styles.display,
            "text-[clamp(2.2rem,7vw,5.5rem)] leading-[1.02] font-semibold tracking-tight"
          )}
        >
          {personalInfo.name.split(" ")[0]}{" "}
          <em style={{ color: "var(--accent)" }}>builds</em> fast things.
        </p>

        <div
          className="mt-12 flex flex-col gap-8 border-t pt-8 md:flex-row md:items-end md:justify-between"
          style={{ borderColor: "rgba(247, 241, 230, 0.2)" }}
        >
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline"
                    style={{ color: "rgba(247, 241, 230, 0.75)" }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Social links">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline"
                  style={{ color: "rgba(247, 241, 230, 0.75)" }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="mt-10 font-mono text-[0.65rem] tracking-[0.2em] uppercase"
          style={{ color: "rgba(247, 241, 230, 0.5)" }}
        >
          © {new Date().getFullYear()} {personalInfo.name} · Layered Depth —
          CSS 3D, zero WebGL
        </p>
      </div>
    </footer>
  );
}
