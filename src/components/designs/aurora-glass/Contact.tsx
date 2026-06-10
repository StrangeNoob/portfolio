"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, MapPin, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/data/resume";
import { GlassPanel, SectionHeading, SocialLinks } from "./shared";
import styles from "./aurora.module.css";

type FormStatus = "idle" | "sending" | "success" | "error";

const INPUT_CLASSES =
  "w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/35 transition-colors duration-300 focus:border-teal-200/60 focus:bg-white/[0.08]";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setErrorMessage("Please fill in every field before launching.");
      return;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Failed to send message");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative mx-auto max-w-5xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <SectionHeading
        eyebrow="05 · Transmission"
        title="Contact"
        id="contact-heading"
      />

      <GlassPanel innerClassName="grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="flex flex-col">
          <h3
            className={cn(
              styles.display,
              styles.iridescent,
              "text-2xl font-semibold leading-snug sm:text-3xl",
            )}
          >
            Let’s build something stellar.
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-[15px]">
            Whether it’s a product idea, an API that needs to go faster, or an
            AI feature that needs grounding — my inbox is open. I usually reply
            within a day.
          </p>

          <dl className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <dt className="sr-only">Email</dt>
              <Mail className="h-4 w-4 text-teal-200/80" aria-hidden="true" />
              <dd>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-white/85 underline decoration-teal-300/40 underline-offset-4 transition-colors hover:text-teal-100"
                >
                  {personalInfo.email}
                </a>
              </dd>
            </div>
            <div className="flex items-center gap-3">
              <dt className="sr-only">Location</dt>
              <MapPin
                className="h-4 w-4 text-fuchsia-300/80"
                aria-hidden="true"
              />
              <dd className="text-white/70">{personalInfo.location}</dd>
            </div>
          </dl>

          <SocialLinks className="mt-auto pt-10" />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="aurora-name"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/60"
              >
                Name
              </label>
              <input
                id="aurora-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Ada Lovelace"
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <label
                htmlFor="aurora-email"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/60"
              >
                Email
              </label>
              <input
                id="aurora-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@galaxy.dev"
                className={INPUT_CLASSES}
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="aurora-message"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-white/60"
            >
              Message
            </label>
            <textarea
              id="aurora-message"
              name="message"
              required
              rows={6}
              placeholder="Tell me about your project, idea, or the bug that keeps you up at night…"
              className={cn(INPUT_CLASSES, "resize-y")}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-400/90 via-indigo-400/90 to-fuchsia-400/90 px-6 py-3 text-sm font-semibold text-[#070510] shadow-[0_0_28px_rgba(167,139,250,0.4)] transition-all duration-300 hover:shadow-[0_0_44px_rgba(167,139,250,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              {status === "sending" ? "Transmitting…" : "Send message"}
            </button>

            <p role="status" aria-live="polite" className="text-sm">
              {status === "success" && (
                <span className="text-teal-200">
                  Message received — I’ll get back to you soon.
                </span>
              )}
              {status === "error" && (
                <span className="text-rose-300">
                  {errorMessage ?? "Something went wrong. Please try again."}
                </span>
              )}
            </p>
          </div>
        </form>
      </GlassPanel>
    </section>
  );
}
