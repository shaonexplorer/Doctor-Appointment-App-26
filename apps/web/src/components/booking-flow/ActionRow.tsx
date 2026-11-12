'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ActionRowProps {
  label: string;
  onClick: () => void;
  onBack?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ActionRow({ label, onClick, onBack, disabled, className }: ActionRowProps) {
  return (
    <div
      className={cn(
        'border-border mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end',
        className
      )}
    >
      {onBack && (
        <button
          onClick={onBack}
          disabled={disabled}
          className={cn(
            'border-border hover:bg-secondary rounded-xl border px-5 py-3 text-sm font-black disabled:opacity-50',
            disabled && 'cursor-not-allowed'
          )}
        >
          <ChevronLeft className="mr-2 inline size-4" />
          Back
        </button>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'bg-primary text-primary-foreground rounded-xl px-5 py-3 text-sm font-black shadow-sm hover:opacity-90',
          disabled && 'cursor-wait opacity-60'
        )}
      >
        {label}
        <ChevronRight className="ml-2 inline size-4" />
      </button>
    </div>
  );
}
