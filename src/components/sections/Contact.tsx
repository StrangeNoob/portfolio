'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { socialLinks } from '@/data/resume';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setError(null);
    setCurrentStep(1);

    try {
      // Step 1: Validating
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCurrentStep(2);

      // Step 2: Connecting & Sending
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 300));

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });

      setTimeout(() => {
        setIsSubmitted(false);
        setCurrentStep(0);
      }, 5000);
    } catch (err) {
      setIsSubmitting(false);
      setCurrentStep(0);
      setError(err instanceof Error ? err.message : 'Something went wrong');

      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 md:py-32 px-4 grid-bg overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-terminal-pink/15 blur-[140px]" />
        <div className="absolute right-6 bottom-0 h-80 w-80 rounded-full bg-terminal-green/16 blur-[150px]" />
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-terminal-green mb-2">
            <span>$</span>
            <span>./send_message.sh</span>
            <span className="cursor" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Contact Info */}
            <div className="terminal-window mb-6 glow-ring">
              <div className="terminal-header">
                <div className="terminal-btn terminal-btn-close" />
                <div className="terminal-btn terminal-btn-minimize" />
                <div className="terminal-btn terminal-btn-maximize" />
                <span className="terminal-title">contact_info.sh</span>
              </div>
              <div className="terminal-body text-sm">
                <div className="text-foreground-muted mb-4">#!/bin/bash</div>
                <div className="space-y-3">
                  <div>
                    <span className="text-terminal-purple">EMAIL</span>
                    <span className="text-foreground-muted">=</span>
                    <span className="text-terminal-amber">&quot;itsprateekmohanty@gmail.com&quot;</span>
                  </div>
                  <div>
                    <span className="text-terminal-purple">LOCATION</span>
                    <span className="text-foreground-muted">=</span>
                    <span className="text-terminal-amber">&quot;India&quot;</span>
                  </div>
                  <div>
                    <span className="text-terminal-purple">STATUS</span>
                    <span className="text-foreground-muted">=</span>
                    <span className="text-terminal-green">&quot;Available&quot;</span>
                  </div>
                  <div>
                    <span className="text-terminal-purple">RESPONSE_TIME</span>
                    <span className="text-foreground-muted">=</span>
                    <span className="text-terminal-cyan">&quot;&lt; 24 hours&quot;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="terminal-window glow-ring">
              <div className="terminal-header">
                <div className="terminal-btn terminal-btn-close" />
                <div className="terminal-btn terminal-btn-minimize" />
                <div className="terminal-btn terminal-btn-maximize" />
                <span className="terminal-title">social_links.txt</span>
              </div>
              <div className="terminal-body text-sm space-y-2">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.2, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-surface transition-colors group"
                  >
                    <span className="text-terminal-green">→</span>
                    <span className="text-terminal-cyan group-hover:text-glow">
                      {link.name}
                    </span>
                    <span className="text-foreground-muted text-xs truncate flex-1">
                      {link.url}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="terminal-window glow-ring">
              <div className="terminal-header">
                <div className="terminal-btn terminal-btn-close" />
                <div className="terminal-btn terminal-btn-minimize" />
                <div className="terminal-btn terminal-btn-maximize" />
                <span className="terminal-title">compose_message</span>
              </div>
              <div className="terminal-body">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-terminal-green text-glow mb-4 text-lg">
                      ✓ Message sent successfully!
                    </div>
                    <div className="text-foreground-muted text-sm">
                      Thanks for reaching out. I will get back to you soon.
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name field */}
                    <div>
                      <label className="block text-xs text-foreground-muted mb-1">
                        <span className="text-terminal-purple">$</span> name:
                      </label>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-background/50 border border-border rounded px-3 py-2 text-sm text-foreground
                                   focus:outline-none focus:border-terminal-green focus:ring-1 focus:ring-terminal-green/50
                                   font-mono placeholder:text-foreground-muted/50"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    {/* Email field */}
                    <div>
                      <label className="block text-xs text-foreground-muted mb-1">
                        <span className="text-terminal-purple">$</span> email:
                      </label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-background/50 border border-border rounded px-3 py-2 text-sm text-foreground
                                   focus:outline-none focus:border-terminal-green focus:ring-1 focus:ring-terminal-green/50
                                   font-mono placeholder:text-foreground-muted/50"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {/* Message field */}
                    <div>
                      <label className="block text-xs text-foreground-muted mb-1">
                        <span className="text-terminal-purple">$</span> message:
                      </label>
                      <textarea
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        rows={5}
                        className="w-full bg-background/50 border border-border rounded px-3 py-2 text-sm text-foreground
                                   focus:outline-none focus:border-terminal-green focus:ring-1 focus:ring-terminal-green/50
                                   font-mono placeholder:text-foreground-muted/50 resize-none"
                        placeholder="Type your message here..."
                        required
                      />
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-terminal-green/10 border border-terminal-green text-terminal-green
                                 py-3 rounded font-mono text-sm
                                 hover:bg-terminal-green hover:text-background
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="loading-dots">Sending</span>
                        </span>
                      ) : (
                        '$ send_message --submit'
                      )}
                    </button>

                    {/* Progress indicator */}
                    {isSubmitting && (
                      <div className="text-xs text-foreground-muted space-y-1">
                        <div className={currentStep >= 1 ? 'text-terminal-green' : ''}>
                          {currentStep >= 1 ? '✓' : '○'} Validating input...
                        </div>
                        <div className={currentStep >= 2 ? 'text-terminal-green' : ''}>
                          {currentStep >= 2 ? '✓' : '○'} Establishing connection...
                        </div>
                        <div className={currentStep >= 3 ? 'text-terminal-green' : ''}>
                          {currentStep >= 3 ? '✓' : '○'} Sending message...
                        </div>
                      </div>
                    )}

                    {/* Error message */}
                    {error && (
                      <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/30 rounded p-3">
                        <span className="text-red-400">ERROR:</span> {error}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
