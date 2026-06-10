"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/data/resume";
import { GlassPanel, SectionHeading } from "./shared";
import styles from "./aurora.module.css";

const HIGHLIGHTS = [
  { value: "97%", label: "API latency cut — 20s down to 300-700ms" },
  { value: "1.2K+", label: "Hotels aggregated in under 10 seconds" },
  { value: "2", label: "iOS apps published to the App Store" },
  { value: "3", label: "Microservices deployed on GCP" },
];

export function About() {
  const paragraphs = personalInfo.bio
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading eyebrow="01 · Orbit" title="About" id="about-heading" />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel innerClassName="p-7 sm:p-10" floatDelay={0.4}>
          <h3
            className={cn(
              styles.display,
              "mb-5 text-lg font-medium text-teal-100/95 sm:text-xl",
            )}
          >
            Engineering at the speed of light
          </h3>
          <div className="space-y-4 text-[15px] leading-relaxed text-white/75 sm:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/90 transition-colors duration-300 hover:border-fuchsia-300/50 hover:bg-white/[0.12]"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            View résumé
          </a>
        </GlassPanel>

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {HIGHLIGHTS.map((highlight, index) => (
            <GlassPanel
              key={highlight.value + highlight.label}
              delay={0.12 + index * 0.08}
              floatDelay={1 + index * 0.9}
              hover
              innerClassName="flex flex-col justify-between p-5 sm:p-6"
            >
              <p
                className={cn(
                  styles.display,
                  styles.iridescent,
                  "text-3xl font-bold sm:text-4xl",
                )}
              >
                {highlight.value}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/65 sm:text-[13px]">
                {highlight.label}
              </p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
