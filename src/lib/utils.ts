import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Filters skills by category
 */
export function getSkillsByCategory<T extends { category: string }>(
  skills: T[],
  category: string
): T[] {
  return skills.filter((skill) => skill.category === category);
}

/**
 * Scrolls to a section by ID with smooth behavior
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
