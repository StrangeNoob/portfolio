"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  maxTilt?: number;
  /** show the moving sheen highlight */
  glare?: boolean;
}

/**
 * True 3D tilt-toward-cursor card. A single pointer handler writes
 * CSS custom properties through a ref inside requestAnimationFrame —
 * zero React re-renders while the pointer moves. Disabled for coarse
 * pointers and prefers-reduced-motion.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 6,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const state = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, go: 0 });
  const enabled = useRef(false);
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    enabled.current = fine && !reduced;
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const apply = useCallback(() => {
    frame.current = null;
    const el = ref.current;
    if (!el) return;
    const s = state.current;
    el.style.setProperty("--rx", `${s.rx.toFixed(3)}deg`);
    el.style.setProperty("--ry", `${s.ry.toFixed(3)}deg`);
    el.style.setProperty("--gx", `${s.gx.toFixed(2)}%`);
    el.style.setProperty("--gy", `${s.gy.toFixed(2)}%`);
    el.style.setProperty("--go", s.go.toFixed(2));
  }, []);

  const schedule = useCallback(() => {
    if (frame.current === null) {
      frame.current = requestAnimationFrame(apply);
    }
  }, [apply]);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!enabled.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      const s = state.current;
      s.ry = (x - 0.5) * 2 * maxTilt;
      s.rx = (0.5 - y) * 2 * maxTilt;
      s.gx = x * 100;
      s.gy = y * 100;
      s.go = 1;
      schedule();
    },
    [maxTilt, schedule]
  );

  const onPointerEnter = useCallback(() => {
    if (enabled.current) setLifted(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    const s = state.current;
    s.rx = 0;
    s.ry = 0;
    s.go = 0;
    schedule();
    setLifted(false);
  }, [schedule]);

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={cn(
        styles.tilt,
        lifted && styles.tiltLifted,
        "relative",
        className
      )}
    >
      {children}
      {glare && <div className={styles.glare} aria-hidden="true" />}
    </div>
  );
}
