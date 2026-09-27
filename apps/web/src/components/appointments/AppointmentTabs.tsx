"use client";

import { cn } from "@/lib/utils";

export type AppointmentTab = "Upcoming" | "Completed" | "Cancelled";

export interface AppointmentTabsProps {
  activeTab: AppointmentTab;
  onChange: (tab: AppointmentTab) => void;
  counts: Record<AppointmentTab, number>;
  className?: string;
}

export function AppointmentTabs({
  activeTab,
  onChange,
  counts,
  className,
}: AppointmentTabsProps) {
  const tabs: AppointmentTab[] = ["Upcoming", "Completed", "Cancelled"];

  return (
    <div className={cn("flex gap-6 overflow-x-auto border-b border-border", className)} role="tablist" aria-label="Appointment status">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          aria-controls={`${tab.toLowerCase()}-panel`}
          id={`${tab.toLowerCase()}-tab`}
          onClick={() => onChange(tab)}
          className={cn(
            "whitespace-nowrap -mb-px border-b-2 px-1 pb-3 text-sm font-black transition",
            activeTab === tab
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {tab}
          <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold">
            {counts[tab] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}