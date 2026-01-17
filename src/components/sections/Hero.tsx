'use client';

import { motion } from 'framer-motion';
import { useBootSequence } from '@/hooks/useBootSequence';

const ASCII_ART = `
 ██████╗ ██████╗  █████╗ ████████╗███████╗███████╗██╗  ██╗
 ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝██║ ██╔╝
 ██████╔╝██████╔╝███████║   ██║   █████╗  █████╗  █████╔╝
 ██╔═══╝ ██╔══██╗██╔══██║   ██║   ██╔══╝  ██╔══╝  ██╔═██╗
 ██║     ██║  ██║██║  ██║   ██║   ███████╗███████╗██║  ██╗
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝
`;

const BOOT_SEQUENCE = [
  { text: 'BIOS v2.4.1 - Portfolio System', delay: 0 },
  { text: 'Initializing system...', delay: 200 },
  { text: 'Loading kernel modules... [OK]', delay: 400 },
  { text: 'Mounting filesystems... [OK]', delay: 600 },
  { text: 'Starting network services... [OK]', delay: 800 },
  { text: 'Loading developer profile... [OK]', delay: 1000 },
  { text: '', delay: 1200 },
] as const;

const COMMANDS = [
  { cmd: 'whoami', output: 'prateek-kumar-mohanty' },
  { cmd: 'cat title.txt', output: 'Full Stack Developer | 4+ Years Experience' },
  { cmd: 'cat status.txt', output: '> Available for opportunities' },
] as const;

const STATS = [
  { label: 'API_OPTIMIZATION', value: '98.5%', color: 'text-terminal-green' },
  { label: 'RESPONSE_TIME', value: '20s → 300ms', color: 'text-terminal-cyan' },
  { label: 'APPS_PUBLISHED', value: '2', color: 'text-terminal-amber' },
  { label: 'MICROSERVICES', value: '3', color: 'text-terminal-purple' },
] as const;

export function Hero(): React.JSX.Element {
  const {
    bootComplete,
    visibleLines,
    showCommands,
    currentCommand,
    typingCommand,
    showOutput,
  } = useBootSequence({
    bootSequenceLength: BOOT_SEQUENCE.length,
    commands: [...COMMANDS],
  });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center py-24 px-4 grid-bg overflow-hidden"
      aria-label="Hero section with terminal-style introduction"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-terminal-green/20 blur-[120px]" />
        <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-terminal-pink/20 blur-[140px]" />
      </div>

      <div className="w-full max-w-5xl relative">
        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="terminal-window glow-ring"
          role="region"
          aria-label="Terminal emulator displaying developer information"
        >
          {/* Terminal Header */}
          <div className="terminal-header" aria-hidden="true">
            <div className="terminal-btn terminal-btn-close" />
            <div className="terminal-btn terminal-btn-minimize" />
            <div className="terminal-btn terminal-btn-maximize" />
            <span className="terminal-title">guest@portfolio:~</span>
          </div>

          {/* Terminal Body */}
          <div className="terminal-body font-mono text-sm leading-relaxed">
            {/* ASCII Art */}
            {bootComplete && (
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-terminal-green text-[8px] sm:text-xs md:text-sm mb-6 overflow-x-auto text-glow whitespace-pre"
                aria-label="ASCII art displaying the name PRATEEK"
                role="img"
              >
                {ASCII_ART}
              </motion.pre>
            )}

            {/* Boot Sequence */}
            <div className="space-y-1 mb-6" aria-live="polite" aria-atomic="false">
              {BOOT_SEQUENCE.slice(0, visibleLines).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${line.text.includes('[OK]')
                      ? 'text-terminal-green'
                      : 'text-foreground-muted'
                    }`}
                >
                  {line.text.includes('[OK]') ? (
                    <>
                      {line.text.replace('[OK]', '')}
                      <span className="text-terminal-green">[OK]</span>
                    </>
                  ) : (
                    line.text
                  )}
                </motion.div>
              ))}
            </div>

            {/* Commands */}
            {showCommands && (
              <div className="space-y-4" aria-live="polite">
                {COMMANDS.map((command, index) => (
                  <div key={index}>
                    {/* Command line */}
                    {(index < currentCommand || index === currentCommand) && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-terminal-green">guest@portfolio</span>
                        <span className="text-foreground-muted">:</span>
                        <span className="text-terminal-blue">~</span>
                        <span className="text-foreground-muted">$</span>
                        <span className="text-foreground ml-2">
                          {index === currentCommand ? typingCommand : command.cmd}
                          {index === currentCommand && (
                            <span className="cursor" aria-hidden="true" />
                          )}
                        </span>
                      </div>
                    )}

                    {/* Output */}
                    {showOutput[index] && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mt-1 pl-4 ${index === 0
                          ? 'text-terminal-cyan text-2xl sm:text-3xl md:text-4xl font-bold text-glow'
                          : index === 1
                            ? 'text-foreground-muted text-sm sm:text-base'
                            : 'text-terminal-green text-sm sm:text-base'
                        }`}
                      >
                        {command.output}
                      </motion.div>
                    )}
                  </div>
                ))}

                {/* Final prompt with cursor */}
                {currentCommand >= COMMANDS.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <span className="text-terminal-green">guest@portfolio</span>
                    <span className="text-foreground-muted">:</span>
                    <span className="text-terminal-blue">~</span>
                    <span className="text-foreground-muted">$</span>
                    <span className="cursor" aria-hidden="true" />
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
            role="list"
            aria-label="Key metrics and achievements"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.1 }}
                className="glass-panel p-4 glow-ring"
                role="listitem"
              >
                <div className="text-foreground-muted text-[11px] tracking-wide mb-1">
                  {stat.label}
                </div>
                <div className={`text-lg sm:text-xl font-bold ${stat.color} text-glow`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Action Buttons */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
            role="navigation"
            aria-label="Quick actions"
          >
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg border border-terminal-green bg-terminal-green/10 text-terminal-green hover:bg-terminal-green hover:text-background transition-all duration-300 font-mono text-sm hover-glow glow-ring"
            >
              $ view_projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg border border-terminal-cyan/60 bg-terminal-cyan/10 text-terminal-cyan hover:bg-terminal-cyan hover:text-background transition-all duration-300 font-mono text-sm hover-glow glow-ring"
            >
              $ send_message
            </a>
            <a
              href="https://github.com/StrangeNoob"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-terminal-amber/60 bg-terminal-amber/10 text-terminal-amber hover:bg-terminal-amber hover:text-background transition-all duration-300 font-mono text-sm hover-glow glow-ring"
              aria-label="Open GitHub profile in new tab"
            >
              $ open github
            </a>
            <a
              href="/pdf/Prateek%20Kumar%20Mohanty.pdf"
              download="Prateek_Kumar_Mohanty_Resume.pdf"
              className="px-6 py-3 rounded-lg border border-terminal-purple/60 bg-terminal-purple/10 text-terminal-purple hover:bg-terminal-purple hover:text-background transition-all duration-300 font-mono text-sm hover-glow glow-ring"
              aria-label="Download resume as PDF"
            >
              $ wget resume.pdf
            </a>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="mt-16 text-center"
            aria-hidden="true"
          >
            <div className="text-foreground-muted text-xs mb-2">
              {'// scroll to explore'}
            </div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-terminal-green"
            >
              ▼
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Hero;
