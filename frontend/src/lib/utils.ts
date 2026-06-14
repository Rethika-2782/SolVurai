import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format Firestore timestamp to human-readable */
export function formatDate(timestamp: any): string {
  if (!timestamp) return ''
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('ta-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(date)
}

/** Truncate text with ellipsis */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

/** Generate unique ID */
export function genId(): string {
  return Math.random().toString(36).slice(2, 11)
}

/** Sleep utility for animations */
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

/** Tamil script unicode range check */
export function hasTamil(text: string): boolean {
  return /[\u0B80-\u0BFF]/.test(text)
}
