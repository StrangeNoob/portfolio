'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useId } from 'react';
import { socialLinks } from '@/data/resume';
import { useFormSubmission } from '@/hooks/useFormSubmission';

export function Contact(): React.JSX.Element {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Generate unique IDs for form accessibility
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const nameErrorId = useId();
  const emailErrorId = useId();
  const messageErrorId = useId();
  const formErrorId = useId();

  const {
    formState,
    setFormState,
    isSubmitting,
    isSubmitted,
    currentStep,
    error,
    handleSubmit,
    clearError,
  } = useFormSubmission();

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 md:py-32 px-4 grid-bg overflow-hidden"
      aria-label="Contact section"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
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
            <span className="cursor" aria-hidden="true" />
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
              <div className="terminal-header" aria-hidden="true">
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
              <div className="terminal-header" aria-hidden="true">
                <div className="terminal-btn terminal-btn-close" />
                <div className="terminal-btn terminal-btn-minimize" />
                <div className="terminal-btn terminal-btn-maximize" />
                <span className="terminal-title">social_links.txt</span>
              </div>
              <nav className="terminal-body text-sm space-y-2" aria-label="Social links">
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
                    aria-label={`Visit ${link.name} profile`}
                  >
                    <span className="text-terminal-green" aria-hidden="true">→</span>
                    <span className="text-terminal-cyan group-hover:text-glow">
                      {link.name}
                    </span>
                    <span className="text-foreground-muted text-xs truncate flex-1">
                      {link.url}
                    </span>
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="terminal-window glow-ring">
              <div className="terminal-header" aria-hidden="true">
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
                    role="status"
                    aria-live="polite"
                  >
                    <div className="text-terminal-green text-glow mb-4 text-lg">
                      ✓ Message sent successfully!
                    </div>
                    <div className="text-foreground-muted text-sm">
                      Thanks for reaching out. I will get back to you soon.
                    </div>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    aria-describedby={error ? formErrorId : undefined}
                    noValidate
                  >
                    {/* Name field */}
                    <div>
                      <label
                        htmlFor={nameId}
                        className="block text-xs text-foreground-muted mb-1"
                      >
                        <span className="text-terminal-purple" aria-hidden="true">$</span> name:
                      </label>
                      <input
                        id={nameId}
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-background/50 border border-border rounded px-3 py-2 text-sm text-foreground
                                   focus:outline-none focus:border-terminal-green focus:ring-1 focus:ring-terminal-green/50
                                   font-mono placeholder:text-foreground-muted/50"
                        placeholder="Enter your name"
                        required
                        aria-required="true"
                        aria-describedby={nameErrorId}
                        autoComplete="name"
                      />
                      <span id={nameErrorId} className="sr-only">
                        Name is required
                      </span>
                    </div>

                    {/* Email field */}
                    <div>
                      <label
                        htmlFor={emailId}
                        className="block text-xs text-foreground-muted mb-1"
                      >
                        <span className="text-terminal-purple" aria-hidden="true">$</span> email:
                      </label>
                      <input
                        id={emailId}
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-background/50 border border-border rounded px-3 py-2 text-sm text-foreground
                                   focus:outline-none focus:border-terminal-green focus:ring-1 focus:ring-terminal-green/50
                                   font-mono placeholder:text-foreground-muted/50"
                        placeholder="Enter your email"
                        required
                        aria-required="true"
                        aria-describedby={emailErrorId}
                        autoComplete="email"
                      />
                      <span id={emailErrorId} className="sr-only">
                        A valid email address is required
                      </span>
                    </div>

                    {/* Message field */}
                    <div>
                      <label
                        htmlFor={messageId}
                        className="block text-xs text-foreground-muted mb-1"
                      >
                        <span className="text-terminal-purple" aria-hidden="true">$</span> message:
                      </label>
                      <textarea
                        id={messageId}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        rows={5}
                        className="w-full bg-background/50 border border-border rounded px-3 py-2 text-sm text-foreground
                                   focus:outline-none focus:border-terminal-green focus:ring-1 focus:ring-terminal-green/50
                                   font-mono placeholder:text-foreground-muted/50 resize-none"
                        placeholder="Type your message here..."
                        required
                        aria-required="true"
                        aria-describedby={messageErrorId}
                      />
                      <span id={messageErrorId} className="sr-only">
                        Message is required
                      </span>
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
                      aria-disabled={isSubmitting}
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
                      <div
                        className="text-xs text-foreground-muted space-y-1"
                        role="status"
                        aria-live="polite"
                      >
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
                      <div
                        id={formErrorId}
                        className="text-xs text-red-500 bg-red-500/10 border border-red-500/30 rounded p-3 flex items-start justify-between"
                        role="alert"
                        aria-live="assertive"
                      >
                        <div>
                          <span className="text-red-400">ERROR:</span> {error}
                        </div>
                        <button
                          type="button"
                          onClick={clearError}
                          className="text-red-400 hover:text-red-300 ml-2 text-sm"
                          aria-label="Dismiss error message"
                        >
                          ×
                        </button>
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
