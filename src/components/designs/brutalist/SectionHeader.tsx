"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index: string;
  title: string;
  meta: string;
  className?: string;
}

const HARD_EASE = [0.9, 0, 0.1, 1] as const;

export default function SectionHeader({
  index,
  title,
  meta,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.35, ease: HARD_EASE }}
      className={cn("border-b-8 border-current pb-5", className)}
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em]">
        {meta}
      </p>
      <h2 className="text-[clamp(3.2rem,11vw,9.5rem)] uppercase leading-[0.85] [font-family:var(--font-brutal-display)]">
        <span className="text-[#ff2b00]">{index}/</span>
        {title}
      </h2>
    </motion.div>
  );
}
