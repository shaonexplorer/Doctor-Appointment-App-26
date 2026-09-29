"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectFilterProps {
  label: string;
  options: string[];
  onChange?: (value: string) => void;
  className?: string;
}

export function SelectFilter({ label, options, onChange, className }: SelectFilterProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label={label}
        defaultValue={label}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-3 pr-9 text-sm font-semibold outline-none focus:border-primary"
      >
        <option disabled value={label}>
          {label}
        </option>
        {options.filter((option) => option !== label).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}