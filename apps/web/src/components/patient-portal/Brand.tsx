"use client";

import { cn } from "@/lib/utils";

export interface BrandProps {
  collapsed?: boolean;
  className?: string;
}

export function Brand({ collapsed = false, className }: BrandProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-5 py-6",
        collapsed ? "justify-center px-0" : "",
        className
      )}
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <PlusMark />
      </div>
      {!collapsed && (
        <span className="text-lg font-black tracking-tight text-foreground">
          Medi<span className="text-primary">Book</span>
        </span>
      )}
    </div>
  );
}

function PlusMark() {
  return (
    <span className="relative block size-4">
      <span className="absolute left-1/2 top-0 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute left-0 top-1/2 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
    </span>
  );
}