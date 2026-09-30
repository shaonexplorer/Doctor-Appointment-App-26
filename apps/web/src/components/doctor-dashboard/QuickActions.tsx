'use client';

import { cn } from '@/lib/utils';

export interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}

export interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold">Quick actions</h2>
          <p className="text-muted-foreground mt-1 text-xs">Get where you need to go faster.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((actionItem) => (
          <button
            key={actionItem.label}
            onClick={actionItem.onClick}
            className={cn(
              'border-border bg-card relative flex flex-col items-center gap-2 rounded-xl border p-4 shadow-sm transition-all',
              'hover:border-primary/50 focus-visible:ring-primary hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            )}
          >
            <actionItem.icon className="text-primary size-6" aria-hidden="true" />
            <span className="text-sm font-medium">{actionItem.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
