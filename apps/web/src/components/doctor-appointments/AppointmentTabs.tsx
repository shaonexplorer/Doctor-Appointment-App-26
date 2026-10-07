'use client';

import { cn } from '@/lib/utils';
import type { AppointmentTabsProps, AppointmentTab } from './types';

const TABS: AppointmentTab[] = ['Today', 'Upcoming', 'Completed', 'Cancelled', 'No-show'];

export function AppointmentTabs({ activeTab, onChange, counts, className }: AppointmentTabsProps) {
  return (
    <div
      className={cn('border-border mt-4 flex flex-wrap gap-2 border-b pb-3', className)}
      role="tablist"
      aria-label="Appointment status"
    >
      {TABS.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls={`${tab.toLowerCase()}-panel`}
          id={`${tab.toLowerCase()}-tab`}
          onClick={() => onChange(tab)}
          className={cn(
            'rounded-lg px-3 py-2 text-xs font-bold transition',
            activeTab === tab
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary'
          )}
        >
          {tab}
          <span className="bg-secondary-foreground text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-[10px] leading-none font-bold">
            {counts[tab] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
