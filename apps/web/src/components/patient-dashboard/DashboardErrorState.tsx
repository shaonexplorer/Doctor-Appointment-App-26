"use client";

import { cn } from "@/lib/utils";

export interface DashboardErrorStateProps {
  className?: string;
  message?: string;
}

export function DashboardErrorState({ className, message }: DashboardErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm font-semibold text-destructive",
        className
      )}
    >
      {message ?? "We couldn&apos;t load your health overview. Please try again."}
    </div>
  );
}