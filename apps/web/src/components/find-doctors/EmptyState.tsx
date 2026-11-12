'use client';

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface EmptyStateProps {
  onClear: () => void;
  className?: string;
}

export function EmptyState({ onClear, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card rounded-2xl border border-dashed p-12 text-center',
        className
      )}
    >
      <Search className="text-muted-foreground mx-auto size-8" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-black">No doctors found</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        Try a different name, specialty, symptom, or remove one of your filters.
      </p>
      <button
        onClick={onClear}
        className="bg-primary text-primary-foreground mt-5 rounded-xl px-4 py-2.5 text-xs font-bold"
      >
        Clear search
      </button>
    </div>
  );
}
