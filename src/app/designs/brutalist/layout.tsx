import type { Metadata } from "next";
import { Anton, IBM_Plex_Mono } from "next/font/google";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brutal-display",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-brutal-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRATEEK / BRUTALIST — Full Stack Developer",
  description:
    "Prateek Kumar Mohanty. Full Stack Developer. Raw output, no decoration: work, projects, skills, contact.",
};

export default function BrutalistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${anton.variable} ${plexMono.variable}`}>{children}</div>
  );
}
