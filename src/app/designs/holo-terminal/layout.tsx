import type { Metadata } from 'next';
import { VT323, IBM_Plex_Mono } from 'next/font/google';

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-holo-display',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-holo-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Holo Terminal — Design Exploration',
  description:
    'Holographic terminal portfolio exploration: a WebGL phosphor-green hologram for Prateek Kumar Mohanty, Full Stack Developer.',
};

export default function HoloTerminalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${vt323.variable} ${plexMono.variable}`}>{children}</div>;
}
