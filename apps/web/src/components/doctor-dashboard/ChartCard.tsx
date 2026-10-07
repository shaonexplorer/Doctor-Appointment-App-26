'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

export interface ChartCardProps extends ComponentPropsWithoutRef<'section'> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const ChartCard = forwardRef<HTMLElement, ChartCardProps>(
  ({ title, subtitle, action, children, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6', className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>}
          </div>
          {action}
        </div>
        <div className="mt-5">{children}</div>
      </section>
    );
  }
);
ChartCard.displayName = 'ChartCard';
