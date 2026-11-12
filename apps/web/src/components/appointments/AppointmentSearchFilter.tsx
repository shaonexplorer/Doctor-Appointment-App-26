'use client';

import { cn } from '@/lib/utils';
import { Search, Filter, X } from 'lucide-react';

export interface AppointmentSearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  specialtyValue: string;
  onSpecialtyChange: (value: string) => void;
  specialties: string[];
  dateFrom?: string;
  onDateFromChange?: (value: string) => void;
  dateTo?: string;
  onDateToChange?: (value: string) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function AppointmentSearchFilter({
  searchValue,
  onSearchChange,
  specialtyValue,
  onSpecialtyChange,
  specialties,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClearFilters,
  hasActiveFilters,
  className,
}: AppointmentSearchFilterProps) {
  const handleClearAll = () => {
    onSearchChange('');
    onSpecialtyChange('All specialties');
    onDateFromChange?.('');
    onDateToChange?.('');
    onClearFilters?.();
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {/* Search Input */}
      <label className="relative min-w-[200px] flex-1">
        <Search
          className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search appointments..."
          className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none"
          aria-label="Search appointments"
        />
      </label>

      {/* Specialty Filter */}
      <select
        value={specialtyValue}
        onChange={(e) => onSpecialtyChange(e.target.value)}
        className="border-border bg-background focus:border-primary h-10 rounded-xl border px-3 text-xs font-bold outline-none"
        aria-label="Filter by specialty"
      >
        {specialties.map((specialty) => (
          <option key={specialty} value={specialty}>
            {specialty}
          </option>
        ))}
      </select>

      {/* Date Range Filters */}
      {onDateFromChange && (
        <input
          type="date"
          value={dateFrom || ''}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="border-border bg-background focus:border-primary h-10 rounded-xl border px-3 text-xs outline-none"
          aria-label="Filter from date"
        />
      )}

      {onDateToChange && (
        <input
          type="date"
          value={dateTo || ''}
          onChange={(e) => onDateToChange(e.target.value)}
          className="border-border bg-background focus:border-primary h-10 rounded-xl border px-3 text-xs outline-none"
          aria-label="Filter to date"
        />
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <button
          type="button"
          onClick={handleClearAll}
          className="border-border text-muted-foreground hover:bg-secondary flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold"
        >
          <X className="size-4" aria-hidden="true" />
          Clear
        </button>
      )}

      {/* More Filters Button */}
      <button
        type="button"
        className="border-border text-muted-foreground hover:bg-secondary flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold"
      >
        <Filter className="size-4" aria-hidden="true" />
        Filters
      </button>
    </div>
  );
}
