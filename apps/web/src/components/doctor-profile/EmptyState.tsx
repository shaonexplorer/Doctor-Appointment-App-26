'use client';

import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline';
    icon?: React.ReactNode;
  };
  className?: string;
}

export function EmptyState({
  icon = <CalendarDays className="text-primary/50 size-14" aria-hidden="true" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'border-border bg-card rounded-2xl border p-10 text-center shadow-sm',
        className
      )}
    >
      <div className="bg-secondary/50 mx-auto mb-5 grid size-14 place-items-center rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-black">{title}</h3>
      {description && (
        <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            'mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors',
            action.variant === 'outline'
              ? 'border-border bg-background hover:bg-secondary border'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </section>
  );
}

export interface ScheduleCalendarEmptyStateProps {
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline';
    icon?: React.ReactNode;
  };
  className?: string;
}

export function ScheduleCalendarEmptyState({ action, className }: ScheduleCalendarEmptyStateProps) {
  return (
    <EmptyState
      icon={<CalendarDays className="text-primary/50 size-14" aria-hidden="true" />}
      title="No available slots"
      description="This doctor has no open appointment slots right now. Please check back later."
      action={action}
      className={className}
    />
  );
}
