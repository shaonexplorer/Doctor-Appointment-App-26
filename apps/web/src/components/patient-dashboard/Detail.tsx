'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DetailProps {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}

export function Detail({ icon, label, value, className }: DetailProps) {
  return (
    <div className={cn('bg-secondary flex items-center gap-4 rounded-xl p-3', className)}>
      <div className="text-primary size-4">{icon}</div>
      <div>
        <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
          {label}
        </p>
        <p className="mt-1 text-xs font-bold">{value}</p>
      </div>
    </div>
  );
}
