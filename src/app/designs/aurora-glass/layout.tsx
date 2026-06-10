import type { Metadata } from "next";
import { Unbounded, Sora } from "next/font/google";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-aurora-display",
  display: "swap",
});

const body = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-aurora-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurora Glass — Prateek Kumar Mohanty",
  description:
    "Cosmic aurora glass portfolio of Prateek Kumar Mohanty — Full Stack Developer crafting performant web, mobile and AI-powered systems.",
};

export default function AuroraGlassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
