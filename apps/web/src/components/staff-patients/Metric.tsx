'use client';

import { cn } from '@/lib/utils';

interface MetricProps {
  label: string;
  value: string;
  tone?: string;
}

export function Metric({ label, value }: MetricProps) {
  return (
    <div className={cn('border-border bg-card rounded-2xl border p-4 shadow-sm')}>
      <div className="mb-3 inline-flex rounded-lg px-2.5 py-1.5 text-lg font-black">{value}</div>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}
