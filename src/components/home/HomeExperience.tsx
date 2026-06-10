"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BrutalistPage from "@/components/designs/brutalist/BrutalistPage";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

/* The light theme only loads when someone switches to it — the dark
   default ships without the Layered Depth bundle. */
const LayeredDepthPage = dynamic(
  () => import("@/components/designs/css-3d/LayeredDepthPage"),
  {
    ssr: false,
    loading: () => <div className="min-h-screen bg-[#f7f1e6]" />,
  },
);

const WIPE_MS = 900;

function ThemedSite() {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [wipe, setWipe] = useState<"dark" | "light" | null>(null);
  const [prevTheme, setPrevTheme] = useState(theme);

  // Render-time state adjustment: every theme change launches a
  // full-screen wipe colored like the incoming theme — including the
  // on-load preference switch, where it covers the swap.
  if (prevTheme !== theme) {
    setPrevTheme(theme);
    if (!reduced) setWipe(theme);
  }

  useEffect(() => {
    if (!wipe) return;
    const t = setTimeout(() => setWipe(null), WIPE_MS);
    return () => clearTimeout(t);
  }, [wipe]);

  // The light theme scrolls the window; the dark theme scrolls an inner
  // h-dvh container. A leftover window scroll position would strand the
  // viewport past the end of the (viewport-tall) dark document — blank
  // screen. Reset on every theme CHANGE (not on first mount, so anchor
  // deep-links keep working when no switch happens).
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [theme]);

  return (
    <>
      {theme === "dark" ? (
        <BrutalistPage showDesignsLink={false} />
      ) : (
        <LayeredDepthPage showDesignsLink={false} />
      )}

      <ThemeToggle />

      {wipe && (
        <motion.div
          key={wipe}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90]"
          style={{
            backgroundColor: wipe === "light" ? "#f7f1e6" : "#0c0c0c",
            borderTop:
              wipe === "light" ? "6px solid #ff5a36" : "6px solid #ff2b00",
            transformOrigin: "bottom",
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 1, 0] }}
          transition={{
            duration: WIPE_MS / 1000,
            times: [0, 0.35, 0.6, 1],
            ease: ["easeIn", "linear", "easeOut"],
          }}
        />
      )}
    </>
  );
}

export default function HomeExperience() {
  return (
    <ThemeProvider>
      <ThemedSite />
    </ThemeProvider>
  );
}
