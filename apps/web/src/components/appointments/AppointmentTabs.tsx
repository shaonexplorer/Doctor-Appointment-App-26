'use client';

import { cn } from '@/lib/utils';

export type AppointmentTab = 'Upcoming' | 'Completed' | 'Cancelled';

export interface AppointmentTabsProps {
  activeTab: AppointmentTab;
  onChange: (tab: AppointmentTab) => void;
  counts: Record<AppointmentTab, number>;
  className?: string;
}

export function AppointmentTabs({ activeTab, onChange, counts, className }: AppointmentTabsProps) {
  const tabs: AppointmentTab[] = ['Upcoming', 'Completed', 'Cancelled'];

  return (
    <div
      className={cn('border-border mt-4 flex flex-wrap gap-3 border-b sm:gap-6', className)}
      role="tablist"
      aria-label="Appointment status"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls={`${tab.toLowerCase()}-panel`}
          id={`${tab.toLowerCase()}-tab`}
          onClick={() => onChange(tab)}
          className={cn(
            '-mb-px border-b-2 px-1 pb-3 text-sm font-black whitespace-nowrap transition',
            activeTab === tab
              ? 'border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          )}
        >
          {tab}
          <span className="bg-secondary ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold">
            {counts[tab] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
