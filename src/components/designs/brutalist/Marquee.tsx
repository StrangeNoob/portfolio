"use client";

import { cn } from "@/lib/utils";
import styles from "./brutalist.module.css";

interface MarqueeProps {
  text: string;
  variant?: "red" | "dark";
}

export default function Marquee({ text, variant = "red" }: MarqueeProps) {
  const items = Array.from({ length: 5 }, () => text);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "select-none overflow-hidden border-y-4 py-3",
        variant === "red"
          ? "border-black bg-[#ff2b00] text-black"
          : "border-[#e8e8e4] bg-[#0c0c0c] text-[#e8e8e4]",
      )}
    >
      <div className={styles.marqueeTrack}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap px-5 text-2xl uppercase tracking-wide [font-family:var(--font-brutal-display)] md:text-3xl"
              >
                {item}
                <span className="ml-10 inline-block h-4 w-4 bg-current" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
