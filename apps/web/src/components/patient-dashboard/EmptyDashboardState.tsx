"use client";

import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyDashboardStateProps {
  className?: string;
}

export function EmptyDashboardState({ className }: EmptyDashboardStateProps) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-border bg-card p-10 text-center", className)}>
      <CalendarDays className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-3 font-bold">No upcoming appointments</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Book a visit with a trusted doctor to get started.
      </p>
    </div>
  );
}