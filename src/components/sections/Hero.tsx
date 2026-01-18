'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Animation timing constants
const TIMING = {
  BOOT_INTERVAL: 300,
  BOOT_COMPLETE_DELAY: 500,
  TYPE_SPEED: 50,
  OUTPUT_DELAY: 200,
  NEXT_COMMAND_DELAY: 500,
  STATS_INITIAL_DELAY: 2,
  STATS_STAGGER: 0.1,
  BUTTONS_DELAY: 2.5,
  SCROLL_INDICATOR_DELAY: 3,
} as const;

const ASCII_ART = `
 ██████╗ ██████╗  █████╗ ████████╗███████╗███████╗██╗  ██╗
 ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝██║ ██╔╝
 ██████╔╝██████╔╝███████║   ██║   █████╗  █████╗  █████╔╝
 ██╔═══╝ ██╔══██╗██╔══██║   ██║   ██╔══╝  ██╔══╝  ██╔═██╗
 ██║     ██║  ██║██║  ██║   ██║   ███████╗███████╗██║  ██╗
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝
`;

const bootSequence = [
  { id: 'bios', text: 'BIOS v2.4.1 - Portfolio System' },
  { id: 'init', text: 'Initializing system...' },
  { id: 'kernel', text: 'Loading kernel modules... [OK]' },
  { id: 'fs', text: 'Mounting filesystems... [OK]' },
  { id: 'network', text: 'Starting network services... [OK]' },
  { id: 'profile', text: 'Loading developer profile... [OK]' },
  { id: 'spacer', text: '' },
];

const commands = [
  { id: 'whoami', cmd: 'whoami', output: 'prateek-kumar-mohanty' },
  { id: 'title', cmd: 'cat title.txt', output: 'Full Stack Developer | 4+ Years Experience' },
  { id: 'status', cmd: 'cat status.txt', output: '> Available for opportunities' },
];

const stats = [
  { id: 'optimization', label: 'API_OPTIMIZATION', value: '98.5%', color: 'text-terminal-green' },
  { id: 'response', label: 'RESPONSE_TIME', value: '20s → 300ms', color: 'text-terminal-cyan' },
  { id: 'apps', label: 'APPS_PUBLISHED', value: '2', color: 'text-terminal-amber' },
  { id: 'services', label: 'MICROSERVICES', value: '3', color: 'text-terminal-purple' },
];

export function Hero() {
  const [bootComplete, setBootComplete] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCommands, setShowCommands] = useState(false);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [typingCommand, setTypingCommand] = useState('');
  const [showOutput, setShowOutput] = useState<boolean[]>([false, false, false]);

  // Use ref for charIndex to avoid closure issues
  const charIndexRef = useRef(0);

  useEffect(() => {
    const bootTimer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= bootSequence.length) {
          clearInterval(bootTimer);
          setTimeout(() => {
            setBootComplete(true);
            setShowCommands(true);
          }, TIMING.BOOT_COMPLETE_DELAY);
          return prev;
        }
        return prev + 1;
      });
    }, TIMING.BOOT_INTERVAL);

    return () => clearInterval(bootTimer);
  }, []);

  useEffect(() => {
    if (!showCommands || currentCommand >= commands.length) return;

    const cmd = commands[currentCommand].cmd;
    charIndexRef.current = 0;

    const typeTimer = setInterval(() => {
      if (charIndexRef.current <= cmd.length) {
        setTypingCommand(cmd.slice(0, charIndexRef.current));
        charIndexRef.current++;
      } else {
        clearInterval(typeTimer);
        setTimeout(() => {
          setShowOutput((prev) => {
            const newOutput = [...prev];
            newOutput[currentCommand] = true;
            return newOutput;
          });
          setTimeout(() => {
            setCurrentCommand((prev) => prev + 1);
            setTypingCommand('');
          }, TIMING.NEXT_COMMAND_DELAY);
        }, TIMING.OUTPUT_DELAY);
      }
    }, TIMING.TYPE_SPEED);

    return () => clearInterval(typeTimer);
  }, [showCommands, currentCommand]);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center py-20 px-4 grid-bg">
      <div className="w-full max-w-4xl">
        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="terminal-window"
        >
          {/* Terminal Header */}
          <div className="terminal-header" role="presentation">
            <div className="terminal-btn terminal-btn-close" aria-hidden="true" />
            <div className="terminal-btn terminal-btn-minimize" aria-hidden="true" />
            <div className="terminal-btn terminal-btn-maximize" aria-hidden="true" />
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
                aria-label="Prateek ASCII art logo"
              >
                {ASCII_ART}
              </motion.pre>
            )}

            {/* Boot Sequence */}
            <div className="space-y-1 mb-6" role="log" aria-label="System boot sequence">
              {bootSequence.slice(0, visibleLines).map((line) => (
                <motion.div
                  key={line.id}
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
              <div className="space-y-4" role="log" aria-label="Terminal commands">
                {commands.map((command, index) => (
                  <div key={command.id}>
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
                            ? 'text-terminal-cyan text-xl sm:text-2xl md:text-3xl font-bold text-glow'
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
                {currentCommand >= commands.length && (
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
            transition={{ delay: TIMING.STATS_INITIAL_DELAY, duration: 0.5 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            role="region"
            aria-label="Key statistics"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: TIMING.STATS_INITIAL_DELAY + TIMING.STATS_STAGGER + index * TIMING.STATS_STAGGER }}
                className="terminal-window p-4"
              >
                <div className="text-foreground-muted text-xs mb-1">
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
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: TIMING.BUTTONS_DELAY, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
            aria-label="Main navigation"
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-terminal-green/10 border border-terminal-green text-terminal-green
                         hover:bg-terminal-green hover:text-background transition-all duration-300
                         font-mono text-sm hover-glow"
              aria-label="View my projects"
            >
              $ view_projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-transparent border border-foreground-muted text-foreground-muted
                         hover:border-terminal-cyan hover:text-terminal-cyan transition-all duration-300
                         font-mono text-sm hover-glow"
              aria-label="Send me a message"
            >
              $ send_message
            </a>
            <a
              href="https://github.com/StrangeNoob"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent border border-foreground-muted text-foreground-muted
                         hover:border-terminal-amber hover:text-terminal-amber transition-all duration-300
                         font-mono text-sm hover-glow"
              aria-label="Open my GitHub profile in a new tab"
            >
              $ open github
            </a>
            <a
              href="/pdf/Prateek%20Kumar%20Mohanty.pdf"
              download="Prateek_Kumar_Mohanty_Resume.pdf"
              className="px-6 py-3 bg-transparent border border-foreground-muted text-foreground-muted
                         hover:border-terminal-purple hover:text-terminal-purple transition-all duration-300
                         font-mono text-sm hover-glow"
              aria-label="Download my resume as PDF"
            >
              $ wget resume.pdf
            </a>
          </motion.nav>
        )}

        {/* Scroll Indicator */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: TIMING.SCROLL_INDICATOR_DELAY, duration: 0.5 }}
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
