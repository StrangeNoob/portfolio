'use client';

import { useRef } from 'react';
import { useInView, type UseInViewOptions } from 'framer-motion';

interface UseInViewAnimationOptions {
  once?: boolean;
  margin?: UseInViewOptions['margin'];
}

interface InViewAnimationResult<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
  isInView: boolean;
  animateProps: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number } | Record<string, never>;
  };
}

export function useInViewAnimation<T extends HTMLElement = HTMLElement>(
  options: UseInViewAnimationOptions = {}
): InViewAnimationResult<T> {
  const { once = true, margin = '-100px' as UseInViewOptions['margin'] } = options;
  const ref = useRef<T | null>(null);
  const isInView = useInView(ref, { once, margin });

  return {
    ref,
    isInView,
    animateProps: {
      initial: { opacity: 0, y: 20 },
      animate: isInView ? { opacity: 1, y: 0 } : {},
    },
  };
}
