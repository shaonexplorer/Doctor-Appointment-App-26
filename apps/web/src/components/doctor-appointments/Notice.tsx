'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { NoticeProps } from './types';

export function Notice({ message, onDismiss, className }: NoticeProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      className={cn(
        'border-primary/20 bg-primary/5 text-primary flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-semibold',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Check className="size-4" aria-hidden="true" />
        {message}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-primary/70 hover:text-primary p-1"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
