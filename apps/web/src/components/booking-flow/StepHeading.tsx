'use client';

import { cn } from '@/lib/utils';

export interface StepHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}

export function StepHeading({ eyebrow, title, description, className }: StepHeadingProps) {
  return (
    <div className={cn(className)}>
      <p className="text-primary text-xs font-black tracking-wider uppercase">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  );
}
