import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple Tailwind CSS classes into a single string.
 * This utility uses `clsx` for conditional classes and `twMerge` to handle Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
