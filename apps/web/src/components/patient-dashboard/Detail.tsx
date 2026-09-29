"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DetailProps {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}

export function Detail({ icon, label, value, className }: DetailProps) {
  return (
    <div className={cn("flex items-center gap-2 rounded-xl bg-secondary p-3", className)}>
      <div className="size-4 text-primary">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-xs font-bold">{value}</p>
      </div>
    </div>
  );
}