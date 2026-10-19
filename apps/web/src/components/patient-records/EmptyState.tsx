'use client';

import { cn } from '@/lib/utils';
import { FileText, Search } from 'lucide-react';

export interface EmptyStateProps {
  type?: 'empty' | 'search';
  onClear?: () => void;
  className?: string;
}

export function EmptyState({ type = 'empty', onClear, className }: EmptyStateProps) {
  const Icon = type === 'search' ? Search : FileText;

  return (
    <section
      className={cn(
        'border-border bg-card rounded-2xl border p-10 text-center shadow-sm sm:p-12',
        className
      )}
    >
      <div className="bg-secondary text-primary mx-auto mb-5 grid size-14 place-items-center rounded-2xl">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      {type === 'search' ? (
        <>
          <h3 className="mb-1 text-lg font-black">No prescriptions found</h3>
          <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
            Try a different keyword, or clear your search to see all your prescriptions.
          </p>
        </>
      ) : (
        <>
          <h3 className="mb-1 text-lg font-black">No prescriptions yet</h3>
          <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
            Your prescriptions will appear here when they are added to your secure record.
          </p>
        </>
      )}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="border-border text-secondary hover:bg-secondary hover:text-secondary-foreground mt-5 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
        >
          <Search className="size-4" aria-hidden="true" />
          Clear search
        </button>
      )}
    </section>
  );
}
