"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ActionProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

export function Action({ icon, label, onClick, className }: ActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.03]",
        className
      )}
    >
      <div className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}