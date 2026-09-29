"use client";

import { cn } from "@/lib/utils";

export interface SummaryRowProps {
  label: string;
  value: string;
  className?: string;
}

export function SummaryRow({ label, value, className }: SummaryRowProps) {
  return (
    <div className={cn("border-b border-border py-3 last:border-0", className)}>
      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}