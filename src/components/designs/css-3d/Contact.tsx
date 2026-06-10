"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { personalInfo, socialLinks } from "@/data/resume";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ParallaxY } from "./Parallax";

type FormStatus = "idle" | "sending" | "sent" | "error";

const inputClasses =
  "w-full border bg-[#fffdf6] px-4 py-3 text-base placeholder:text-[#8a8174] focus-visible:outline-2 focus-visible:outline-offset-2";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      {/* signature rook reprise — small, tilted, drifting at its own
          scroll speed in the section's bottom padding zone */}
      <ParallaxY
        from={44}
        to={-28}
        className="absolute right-[6%] bottom-1 -z-10 hidden lg:block"
      >
        <Image
          src="/designs/rook-cream.png"
          alt=""
          width={696}
          height={900}
          sizes="87px"
          className={cn(
            styles.rookImg,
            "h-[112px] w-auto rotate-6 opacity-90 select-none"
          )}
        />
      </ParallaxY>

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          number="05"
          title="Let’s Build Something"
          eyebrow="Open to opportunities"
        />

        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Reveal>
            <div className="flex flex-col gap-8">
              <p
                className={cn(styles.display, "text-2xl leading-snug sm:text-3xl")}
              >
                Have a product to ship, an API to make{" "}
                <em style={{ color: "var(--accent-ink)" }}>fast</em>, or an
                idea worth prototyping?
              </p>
              <p style={{ color: "var(--ink-soft)" }}>
                I’m based in {personalInfo.location} and work remotely
                worldwide. The fastest way to reach me is email — I usually
                reply within a day.
              </p>
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-mono text-sm tracking-wide break-all underline underline-offset-4"
                style={{ color: "var(--accent-ink)" }}
              >
                {personalInfo.email}
              </a>
              <ul className="flex flex-wrap gap-x-7 gap-y-3" aria-label="Social links">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline"
                      style={{ color: "var(--ink)" }}
                    >
                      {link.name}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block font-mono text-xs tracking-[0.2em] uppercase"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    className={inputClasses}
                    style={{ borderColor: "var(--line)" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block font-mono text-xs tracking-[0.2em] uppercase"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="ada@example.com"
                    className={inputClasses}
                    style={{ borderColor: "var(--line)" }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block font-mono text-xs tracking-[0.2em] uppercase"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell me about your project…"
                  className={cn(inputClasses, "resize-y")}
                  style={{ borderColor: "var(--line)" }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="px-7 py-3 font-mono text-sm tracking-wider uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "var(--ink)", color: "var(--paper)" }}
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
                <p role="status" aria-live="polite" className="text-sm">
                  {status === "sent" && (
                    <span style={{ color: "var(--accent-ink)" }}>
                      Message sent — thank you! I’ll get back to you soon.
                    </span>
                  )}
                  {status === "error" && (
                    <span style={{ color: "#9d1f0a" }}>
                      Something went wrong. Please email me directly instead.
                    </span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
