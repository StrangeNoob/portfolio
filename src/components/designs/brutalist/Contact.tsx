"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { personalInfo, socialLinks } from "@/data/resume";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";
import styles from "./brutalist.module.css";

const HARD_EASE = [0.9, 0, 0.1, 1] as const;

type FormStatus = "idle" | "sending" | "sent" | "error";

const inputClasses =
  "w-full border-4 border-[#0c0c0c] bg-transparent px-4 py-3 text-sm uppercase tracking-wide placeholder:text-[#9a9a96] focus:outline-none focus-visible:border-[#ff2b00] [font-family:var(--font-brutal-mono)]";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
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
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className={cn(
        styles.snapSection,
        "bg-[#f4f4f0] px-6 py-24 text-[#0c0c0c] md:px-12",
      )}
    >
      <SectionHeader index="05" title="Contact" meta="Transmission" />

      <div className="mt-12 grid gap-14 lg:grid-cols-[1.2fr_1fr]">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.3, ease: HARD_EASE }}
          onSubmit={handleSubmit}
          aria-label="Contact form"
        >
          <p className="text-[clamp(1.6rem,3.5vw,2.8rem)] uppercase leading-[0.95] [font-family:var(--font-brutal-display)]">
            Say it straight.
            <br />
            It lands in my inbox.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="brutal-name"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.35em]"
              >
                Name *
              </label>
              <input
                id="brutal-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="WHO ARE YOU"
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="brutal-email"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.35em]"
              >
                Email *
              </label>
              <input
                id="brutal-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="WHERE TO REPLY"
                className={inputClasses}
              />
            </div>
            <div>
              <label
                htmlFor="brutal-message"
                className="mb-2 block text-[11px] font-bold uppercase tracking-[0.35em]"
              >
                Message *
              </label>
              <textarea
                id="brutal-message"
                name="message"
                required
                rows={6}
                placeholder="NO SMALL TALK"
                className={cn(inputClasses, "resize-y")}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-[#0c0c0c] px-10 py-4 text-sm font-bold uppercase tracking-[0.3em] text-[#f4f4f0] hover:bg-[#ff2b00] hover:text-[#0c0c0c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2b00] disabled:cursor-wait disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send it"}
            </button>
            <p
              role="status"
              aria-live="polite"
              className="text-xs font-bold uppercase tracking-[0.25em]"
            >
              {status === "sent" && "Received. I will answer."}
              {status === "error" && (
                <span className="bg-[#ff2b00] px-2 py-1 text-[#0c0c0c]">
                  Failed. Try again or email directly.
                </span>
              )}
            </p>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.3, delay: 0.08, ease: HARD_EASE }}
          className="border-t-8 border-[#0c0c0c] pt-6 lg:border-l-8 lg:border-t-0 lg:pl-10 lg:pt-0"
        >
          <h3 className="text-[11px] font-bold uppercase tracking-[0.35em]">
            Direct lines
          </h3>
          <a
            href={`mailto:${personalInfo.email}`}
            className="mt-4 block break-all text-[clamp(1.2rem,2.4vw,1.9rem)] uppercase leading-tight underline underline-offset-8 [font-family:var(--font-brutal-display)] hover:bg-[#0c0c0c] hover:text-[#f4f4f0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2b00]"
          >
            {personalInfo.email}
          </a>

          <ul className="mt-10 border-t-2 border-[#0c0c0c]">
            {socialLinks.map((link) => {
              const external = link.url.startsWith("http");
              return (
                <li key={link.name}>
                  <a
                    href={link.url}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center justify-between border-b-2 border-[#0c0c0c] py-4 text-sm font-bold uppercase tracking-[0.3em] hover:bg-[#0c0c0c] hover:px-3 hover:text-[#f4f4f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2b00]"
                  >
                    {link.name}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    {external && (
                      <span className="sr-only"> (opens in new tab)</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block border-4 border-[#0c0c0c] px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#ff2b00] hover:border-[#ff2b00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2b00]"
          >
            Download résumé [PDF]
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
