import { Anton, IBM_Plex_Mono, Fraunces, Instrument_Sans } from "next/font/google";
import HomeExperience from "@/components/home/HomeExperience";

/* Both theme personalities need their fonts available at the root:
   Anton + IBM Plex Mono drive the brutalist dark theme, Fraunces +
   Instrument Sans drive the layered-depth light theme. Variable names
   must match the design components' CSS exactly. */
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

export default function Home() {
  return (
    <div
      className={`${anton.variable} ${plexMono.variable} ${fraunces.variable} ${instrument.variable}`}
    >
      <HomeExperience />
    </div>
  );
}
