"use client";

import { personalInfo, socialLinks } from "@/data/resume";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-8 border-[#ff2b00] bg-[#0c0c0c] px-6 pb-10 pt-16 text-[#e8e8e4] md:px-12">
      <p
        aria-hidden="true"
        className="select-none overflow-hidden whitespace-nowrap text-[clamp(2.4rem,9vw,8rem)] uppercase leading-none text-transparent [-webkit-text-stroke:2px_#2a2a28] [text-stroke:2px_#2a2a28] [font-family:var(--font-brutal-display)]"
      >
        {personalInfo.name}
      </p>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-8 border-t-2 border-[#2a2a28] pt-8">
        <div className="text-[11px] uppercase leading-loose tracking-[0.25em] text-[#9a9a96]">
          <p>
            © {year} {personalInfo.name}. {personalInfo.location}.
          </p>
          <p>Poured in Next.js + Three.js. No cookies. No tracking. Just concrete.</p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.3em]">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                {...(link.url.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="hover:bg-[#e8e8e4] hover:text-[#0c0c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2b00]"
              >
                {link.name}
                {link.url.startsWith("http") && (
                  <span className="sr-only"> (opens in new tab)</span>
                )}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#top"
              className="text-[#ff2b00] hover:bg-[#ff2b00] hover:text-[#0c0c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2b00]"
            >
              ↑ Top
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
