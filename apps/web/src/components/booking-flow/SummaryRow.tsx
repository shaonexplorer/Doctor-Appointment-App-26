'use client';

import { cn } from '@/lib/utils';

export interface SummaryRowProps {
  label: string;
  value: string;
  className?: string;
}

export function SummaryRow({ label, value, className }: SummaryRowProps) {
  return (
    <div className={cn('border-border border-b py-3 last:border-0', className)}>
      <p className="text-muted-foreground text-[10px] font-black tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
