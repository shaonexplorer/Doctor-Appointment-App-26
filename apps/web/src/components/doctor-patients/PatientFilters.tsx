'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PatientFiltersProps } from './types';

export function PatientFilters({
  filters,
  onSearchChange,
  onConditionChange,
  onStatusChange,
  conditions,
  statuses,
  resultCount,
}: PatientFiltersProps) {
  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black">Patient directory</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Search and manage your care panel securely.
          </p>
        </div>
        <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold">
          Add patient
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <label className="relative min-w-[240px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            aria-label="Search patients"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Patient name, ID, or phone"
            className={cn(
              'border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none',
              'transition-colors'
            )}
          />
        </label>
        <select
          aria-label="Condition filter"
          value={filters.condition}
          onChange={(e) => onConditionChange(e.target.value)}
          className="border-border bg-background h-10 rounded-xl border px-3 text-xs font-semibold"
        >
          <option>All conditions</option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
        <select
          aria-label="Appointment status filter"
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="border-border bg-background h-10 rounded-xl border px-3 text-xs font-semibold"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <p className="text-muted-foreground mt-4 text-xs">
        <span className="text-primary font-bold">{resultCount}</span> patients in your care panel
      </p>
    </section>
  );
}
