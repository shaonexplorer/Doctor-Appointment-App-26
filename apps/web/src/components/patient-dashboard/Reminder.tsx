"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ReminderProps {
  icon: ReactNode;
  title: string;
  detail: string;
  className?: string;
}

export function Reminder({ icon, title, detail, className }: ReminderProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-border p-3", className)}>
      <div className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}