'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ReminderProps {
  icon: ReactNode;
  title: string;
  detail: string;
  className?: string;
}

export function Reminder({ icon, title, detail, className }: ReminderProps) {
  return (
    <div className={cn('border-border flex items-center gap-3 rounded-xl border p-3', className)}>
      <div className="bg-secondary text-primary grid size-9 place-items-center rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="text-muted-foreground mt-1 text-[11px]">{detail}</p>
      </div>
    </div>
  );
}
