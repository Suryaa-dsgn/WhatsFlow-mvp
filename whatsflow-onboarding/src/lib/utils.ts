import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Sleep for specified ms (for simulating API calls etc.)
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 