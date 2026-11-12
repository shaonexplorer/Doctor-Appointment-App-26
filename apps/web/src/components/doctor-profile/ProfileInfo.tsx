'use client';

import { cn } from '@/lib/utils';

export interface ProfileInfoProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}

export function ProfileInfo({ icon: Icon, label, value, className }: ProfileInfoProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="bg-secondary text-primary grid size-9 shrink-0 place-items-center rounded-lg">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          {label}
        </p>
        <p className="mt-1 text-xs leading-5 font-bold">{value}</p>
      </div>
    </div>
  );
}
