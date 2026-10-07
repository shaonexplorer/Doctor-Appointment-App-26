'use client';

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { SearchFilterProps } from './types';

export function SearchFilter({
  value,
  onChange,
  placeholder = 'Search patient or symptom',
  className,
}: SearchFilterProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none sm:w-72"
        aria-label="Search appointments"
      />
    </div>
  );
}
