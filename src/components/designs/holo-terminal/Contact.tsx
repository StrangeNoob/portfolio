'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Send } from 'lucide-react';
import { personalInfo, socialLinks } from '@/data/resume';
import { cn } from '@/lib/utils';
import { HoloPanel, SectionHeading } from './HoloPanel';
import styles from './holo.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(`request failed: ${res.status}`);
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <SectionHeading index="05" command="./transmit --channel open" title="Contact" />

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <HoloPanel accent="cyan" className="p-8">
          <p
            className={cn(
              styles.fontDisplay,
              'mb-4 text-2xl uppercase tracking-wide text-terminal-cyan [text-shadow:0_0_12px_rgba(0,255,255,0.35)]',
            )}
          >
            {'// open channels'}
          </p>
          <p className="text-[#c5dcc9]">
            Have a project, a role, or a slow API that needs fixing? Transmissions are
            answered within 24 hours.
          </p>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#87a78f]">direct_line</p>
          <a
            href={`mailto:${personalInfo.email}`}
            className="mt-1 inline-block break-all text-terminal-green underline decoration-terminal-green/40 underline-offset-4 transition-colors hover:[text-shadow:0_0_10px_currentColor]"
          >
            {personalInfo.email}
          </a>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#87a78f]">frequencies</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-[#87a78f] transition-colors hover:text-terminal-cyan hover:[text-shadow:0_0_10px_currentColor]"
                >
                  [{link.name.toLowerCase()}]
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 border-t border-terminal-cyan/20 pt-4 text-xs text-[#87a78f]">
            <span className="text-terminal-green">$</span> uplink status:{' '}
            <span className="text-terminal-green">ONLINE</span> · {personalInfo.location} (UTC+5:30)
          </p>
        </HoloPanel>

        <HoloPanel delay={0.12} className="p-8">
          <form onSubmit={handleSubmit} className="flex h-full flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="holo-name"
                  className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-[#87a78f]"
                >
                  --name
                </label>
                <input
                  id="holo-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className={styles.input}
                />
              </div>
              <div>
                <label
                  htmlFor="holo-email"
                  className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-[#87a78f]"
                >
                  --email
                </label>
                <input
                  id="holo-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@signal.dev"
                  className={styles.input}
                />
              </div>
            </div>

            <div className="flex-1">
              <label
                htmlFor="holo-message"
                className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-[#87a78f]"
              >
                --message
              </label>
              <textarea
                id="holo-message"
                name="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Initiating transmission..."
                className={cn(styles.input, 'h-full min-h-36 resize-y')}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className={cn(styles.cmdButton, 'disabled:cursor-wait disabled:opacity-60')}
              >
                {status === 'sending' ? (
                  <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                {status === 'sending' ? 'transmitting...' : './send_message'}
              </button>

              <p role="status" aria-live="polite" className="text-sm">
                {status === 'success' && (
                  <span className="text-terminal-green [text-shadow:0_0_8px_rgba(57,255,20,0.5)]">
                    ✓ transmission received — exit code 0
                  </span>
                )}
                {status === 'error' && (
                  <span className="text-[#ff8a82]">
                    ✗ transmission failed — retry or use direct_line
                  </span>
                )}
              </p>
            </div>
          </form>
        </HoloPanel>
      </div>
    </section>
  );
}
