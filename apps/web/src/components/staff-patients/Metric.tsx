'use client';

import { cn } from '@/lib/utils';

interface MetricProps {
  label: string;
  value: string;
  tone: string;
}

export function Metric({ label, value, tone }: MetricProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-card p-4 shadow-sm', tone)}>
      <div className="mb-3 inline-flex rounded-lg px-2.5 py-1.5 text-lg font-black">{value}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}