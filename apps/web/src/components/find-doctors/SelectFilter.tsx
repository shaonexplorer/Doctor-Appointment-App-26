'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectFilterProps {
  label: string;
  options: string[];
  onChange?: (value: string) => void;
  className?: string;
}

export function SelectFilter({ label, options, onChange, className }: SelectFilterProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        aria-label={label}
        defaultValue={label}
        onChange={(e) => onChange?.(e.target.value)}
        className="border-border bg-background focus:border-primary h-11 w-full appearance-none rounded-xl border px-3 pr-9 text-sm font-semibold outline-none"
      >
        <option disabled value={label}>
          {label}
        </option>
        {options
          .filter((option) => option !== label)
          .map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
      <ChevronDown
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  );
}
