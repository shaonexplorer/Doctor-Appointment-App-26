"use client";

import { cn } from "@/lib/utils";
import { Search, Filter, X } from "lucide-react";

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
    onSearchChange("");
    onSpecialtyChange("All specialties");
    onDateFromChange?.("");
    onDateToChange?.("");
    onClearFilters?.();
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {/* Search Input */}
      <label className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search appointments..."
          className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
          aria-label="Search appointments"
        />
      </label>

      {/* Specialty Filter */}
      <select
        value={specialtyValue}
        onChange={(e) => onSpecialtyChange(e.target.value)}
        className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold outline-none focus:border-primary"
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
          value={dateFrom || ""}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary"
          aria-label="Filter from date"
        />
      )}

      {onDateToChange && (
        <input
          type="date"
          value={dateTo || ""}
          onChange={(e) => onDateToChange(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-xs outline-none focus:border-primary"
          aria-label="Filter to date"
        />
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <button
          type="button"
          onClick={handleClearAll}
          className="flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground hover:bg-secondary"
        >
          <X className="size-4" aria-hidden="true" />
          Clear
        </button>
      )}

      {/* More Filters Button */}
      <button
        type="button"
        className="flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground hover:bg-secondary"
      >
        <Filter className="size-4" aria-hidden="true" />
        Filters
      </button>
    </div>
  );
}