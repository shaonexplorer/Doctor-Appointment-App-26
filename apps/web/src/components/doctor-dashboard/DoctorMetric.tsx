'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export interface DoctorMetricProps extends ComponentPropsWithoutRef<'div'> {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  detail?: string;
  tone?: string;
}

export const DoctorMetric = forwardRef<HTMLDivElement, DoctorMetricProps>(
  (
    { icon: Icon, label, value, detail, tone = 'bg-primary/10 text-primary', className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('border-border bg-card rounded-2xl border p-4 shadow-sm', className)}
        {...props}
      >
        <div className={cn('grid size-10 place-items-center rounded-xl', tone)}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <p className="text-muted-foreground mt-4 text-xs">{label}</p>
        <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
        {detail && <p className="text-muted-foreground mt-1 text-[10px]">{detail}</p>}
      </div>
    );
  }
);
DoctorMetric.displayName = 'DoctorMetric';
