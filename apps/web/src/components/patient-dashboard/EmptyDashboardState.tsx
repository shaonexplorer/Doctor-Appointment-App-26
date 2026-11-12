'use client';

import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyDashboardStateProps {
  className?: string;
}

export function EmptyDashboardState({ className }: EmptyDashboardStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card rounded-2xl border border-dashed p-10 text-center',
        className
      )}
    >
      <CalendarDays className="text-muted-foreground mx-auto size-8" aria-hidden="true" />
      <h2 className="mt-3 font-bold">No upcoming appointments</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Book a visit with a trusted doctor to get started.
      </p>
    </div>
  );
}
