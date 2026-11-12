'use client';

import { cn } from '@/lib/utils';

export interface InfoProps {
  label: string;
  value: string;
  className?: string;
}

export function Info({ label, value, className }: InfoProps) {
  return (
    <div className={cn('bg-secondary rounded-xl p-3', className)}>
      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-bold">{value}</p>
    </div>
  );
}
