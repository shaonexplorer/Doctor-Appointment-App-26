"use client";

import { cn } from "@/lib/utils";

export interface InfoProps {
  label: string;
  value: string;
  className?: string;
}

export function Info({ label, value, className }: InfoProps) {
  return (
    <div className={cn("rounded-xl bg-secondary p-3", className)}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-xs font-bold">{value}</p>
    </div>
  );
}