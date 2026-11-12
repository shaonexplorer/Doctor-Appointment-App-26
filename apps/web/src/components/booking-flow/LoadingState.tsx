'use client';

import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Reserving your slot securely. Please don't close this window.",
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'border-primary/20 bg-primary/5 text-primary mt-5 flex items-center gap-3 rounded-xl border p-4 text-sm font-bold',
        className
      )}
    >
      <span
        className="border-primary/30 border-t-primary size-4 animate-spin rounded-full border-2"
        aria-hidden="true"
      />
      {message}
    </div>
  );
}
