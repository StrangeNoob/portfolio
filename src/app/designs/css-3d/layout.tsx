import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Instrument_Sans } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prateek Kumar Mohanty — Layered Depth",
  description:
    "Full Stack Developer portfolio — a CSS 3D editorial design exploration. Layered parallax, true 3D tilt, zero WebGL.",
};

export default function Css3dLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${instrument.variable}`}>
      {children}
    </div>
  );
}
