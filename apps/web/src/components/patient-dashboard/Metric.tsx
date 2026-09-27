"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MetricProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone: string;
  className?: string;
}

export function Metric({ label, value, icon, tone, className }: MetricProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <div className={`grid size-10 place-items-center rounded-xl ${tone}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}