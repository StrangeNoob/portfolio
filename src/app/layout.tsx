import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans, Syne } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Prateek Kumar Mohanty | Full Stack Developer',
    template: '%s | Prateek Kumar Mohanty',
  },
  description:
    'Full Stack Developer with 4+ years of experience in React, Flutter, Node.js, Python, and AI/ML. Building performant, scalable applications.',
  keywords: [
    'Full Stack Developer',
    'React Developer',
    'Node.js',
    'Python',
    'Flutter',
    'AI/ML',
    'Web Development',
    'Mobile Development',
    'Software Engineer',
  ],
  authors: [{ name: 'Prateek Kumar Mohanty' }],
  creator: 'Prateek Kumar Mohanty',
  icons: {
    icon: '/logo_2.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Prateek Kumar Mohanty Portfolio',
    title: 'Prateek Kumar Mohanty | Full Stack Developer',
    description:
      'Full Stack Developer with 4+ years of experience in React, Flutter, Node.js, Python, and AI/ML.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prateek Kumar Mohanty | Full Stack Developer',
    description:
      'Full Stack Developer with 4+ years of experience in React, Flutter, Node.js, Python, and AI/ML.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${syne.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
