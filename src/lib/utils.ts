import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTime24(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function getMinutesUntil(timeStr: string): number {
  const [targetH, targetM] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(targetH, targetM, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  return Math.round(diffMs / 60000);
}
