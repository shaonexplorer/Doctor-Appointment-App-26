'use client';

import { cn } from '@/lib/utils';
import { CalendarDays, CheckCircle2, Search, X } from 'lucide-react';
import type { EmptyStateProps } from './types';

const tabIcons = {
  Today: CalendarDays,
  Upcoming: CalendarDays,
  Completed: CheckCircle2,
  Cancelled: X,
  'No-show': X,
};

const tabMessages = {
  Today: 'No appointments scheduled for today.',
  Upcoming: 'No upcoming appointments.',
  Completed: 'No completed appointments yet.',
  Cancelled: 'No cancelled appointments.',
  'No-show': 'No missed appointments.',
};

const tabDescriptions = {
  Today: 'Enjoy your free day!',
  Upcoming: 'New bookings will appear here.',
  Completed: 'Completed consultations will show here.',
  Cancelled: 'Cancelled appointments will appear here.',
  'No-show': 'Missed appointments will appear here.',
};

export function EmptyState({ tab, onClearFilters, className }: EmptyStateProps) {
  const Icon = tabIcons[tab] || CalendarDays;

  return (
    <div className={cn('border-border bg-card rounded-2xl border p-10 text-center', className)}>
      <div className="bg-secondary/50 mx-auto mb-4 grid size-14 place-items-center rounded-full">
        <Icon className="text-muted-foreground size-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-black">{tabMessages[tab] || 'No appointments found.'}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{tabDescriptions[tab] || ''}</p>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-primary mt-6 flex items-center justify-center gap-2 text-sm font-bold hover:underline"
        >
          <Search className="size-4" aria-hidden="true" />
          Clear filters
        </button>
      )}
    </div>
  );
}
