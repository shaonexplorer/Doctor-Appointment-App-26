'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PanelProps {
  title: string;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, action, onAction, children, className }: PanelProps) {
  return (
    <div className={cn('border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6', className)}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        {action && (
          <button onClick={onAction} className="text-primary text-xs font-bold hover:underline">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
