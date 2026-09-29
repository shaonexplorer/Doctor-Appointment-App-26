"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface EmptyStateProps {
  onClear: () => void;
  className?: string;
}

export function EmptyState({ onClear, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-border bg-card p-12 text-center", className)}>
      <Search className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-black">No doctors found</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Try a different name, specialty, symptom, or remove one of your filters.
      </p>
      <button onClick={onClear} className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground">
        Clear search
      </button>
    </div>
  );
}