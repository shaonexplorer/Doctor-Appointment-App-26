'use client';

import { cn } from '@/lib/utils';

export interface BrandProps {
  collapsed?: boolean;
  className?: string;
}

export function Brand({ collapsed = false, className }: BrandProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-5 py-6',
        collapsed ? 'justify-center px-0' : '',
        className
      )}
    >
      <div className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-xl shadow-sm">
        <PlusMark />
      </div>
      {!collapsed && (
        <span className="text-foreground text-lg font-black tracking-tight">
          Medi<span className="text-primary">Book</span>
        </span>
      )}
    </div>
  );
}

function PlusMark() {
  return (
    <span className="relative block size-4">
      <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
    </span>
  );
}
