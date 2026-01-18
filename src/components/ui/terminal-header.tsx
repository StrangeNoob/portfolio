'use client';

interface TerminalHeaderProps {
  title: string;
}

export function TerminalHeader({ title }: TerminalHeaderProps) {
  return (
    <div className="terminal-header" role="presentation">
      <div className="terminal-btn terminal-btn-close" aria-hidden="true" />
      <div className="terminal-btn terminal-btn-minimize" aria-hidden="true" />
      <div className="terminal-btn terminal-btn-maximize" aria-hidden="true" />
      <span className="terminal-title">{title}</span>
    </div>
  );
}
