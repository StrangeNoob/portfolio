'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ASCII_ART = `
 ██████╗ ██████╗  █████╗ ████████╗███████╗███████╗██╗  ██╗
 ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝██║ ██╔╝
 ██████╔╝██████╔╝███████║   ██║   █████╗  █████╗  █████╔╝
 ██╔═══╝ ██╔══██╗██╔══██║   ██║   ██╔══╝  ██╔══╝  ██╔═██╗
 ██║     ██║  ██║██║  ██║   ██║   ███████╗███████╗██║  ██╗
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝
`;

const bootSequence = [
  { text: 'BIOS v2.4.1 - Portfolio System', delay: 0 },
  { text: 'Initializing system...', delay: 200 },
  { text: 'Loading kernel modules... [OK]', delay: 400 },
  { text: 'Mounting filesystems... [OK]', delay: 600 },
  { text: 'Starting network services... [OK]', delay: 800 },
  { text: 'Loading developer profile... [OK]', delay: 1000 },
  { text: '', delay: 1200 },
];

const commands = [
  { cmd: 'whoami', output: 'prateek-kumar-mohanty' },
  { cmd: 'cat title.txt', output: 'Full Stack Developer | 4+ Years Experience' },
  { cmd: 'cat status.txt', output: '> Available for opportunities' },
];

const stats = [
  { label: 'API_OPTIMIZATION', value: '98.5%', color: 'text-terminal-green' },
  { label: 'RESPONSE_TIME', value: '20s → 300ms', color: 'text-terminal-cyan' },
  { label: 'APPS_PUBLISHED', value: '2', color: 'text-terminal-amber' },
  { label: 'MICROSERVICES', value: '3', color: 'text-terminal-purple' },
];

export function Hero() {
  const [bootComplete, setBootComplete] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCommands, setShowCommands] = useState(false);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [typingCommand, setTypingCommand] = useState('');
  const [showOutput, setShowOutput] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    // Boot sequence
    const bootTimer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= bootSequence.length) {
          clearInterval(bootTimer);
          setTimeout(() => {
            setBootComplete(true);
            setShowCommands(true);
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(bootTimer);
  }, []);

  useEffect(() => {
    if (!showCommands || currentCommand >= commands.length) return;

    const cmd = commands[currentCommand].cmd;
    let charIndex = 0;

    const typeTimer = setInterval(() => {
      if (charIndex <= cmd.length) {
        setTypingCommand(cmd.slice(0, charIndex));
        charIndex++;
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
          }, 500);
        }, 200);
      }
    }, 50);

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
          <div className="terminal-header">
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
              >
                {ASCII_ART}
              </motion.pre>
            )}

            {/* Boot Sequence */}
            <div className="space-y-1 mb-6">
              {bootSequence.slice(0, visibleLines).map((line, index) => (
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
              <div className="space-y-4">
                {commands.map((command, index) => (
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
                            <span className="cursor" />
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
                    <span className="cursor" />
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
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.1 }}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <a
              href="#projects"
              className="px-6 py-3 bg-terminal-green/10 border border-terminal-green text-terminal-green
                         hover:bg-terminal-green hover:text-background transition-all duration-300
                         font-mono text-sm hover-glow"
            >
              $ view_projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-transparent border border-foreground-muted text-foreground-muted
                         hover:border-terminal-cyan hover:text-terminal-cyan transition-all duration-300
                         font-mono text-sm hover-glow"
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
            >
              $ open github
            </a>
            <a
              href="/pdf/Prateek%20Kumar%20Mohanty.pdf"
              download="Prateek_Kumar_Mohanty_Resume.pdf"
              className="px-6 py-3 bg-transparent border border-foreground-muted text-foreground-muted
                         hover:border-terminal-purple hover:text-terminal-purple transition-all duration-300
                         font-mono text-sm hover-glow"
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
