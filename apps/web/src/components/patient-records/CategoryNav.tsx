"use client";

import { cn } from "@/lib/utils";
import { Pill, FileText, FlaskConical, History } from "lucide-react";

export type RecordCategory = "Prescriptions" | "Diagnostic Reports" | "Lab Results" | "Visit History";

export interface CategoryNavProps {
  activeCategory: RecordCategory;
  onCategoryChange: (category: RecordCategory) => void;
  className?: string;
}

const categories: { label: RecordCategory; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Prescriptions", icon: Pill },
  { label: "Diagnostic Reports", icon: FileText },
  { label: "Lab Results", icon: FlaskConical },
  { label: "Visit History", icon: History },
];

export function CategoryNav({ activeCategory, onCategoryChange, className }: CategoryNavProps) {
  return (
    <nav
      className={cn("rounded-2xl border border-border bg-card p-2 shadow-sm", className)}
      aria-label="Record categories"
    >
      {categories.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => onCategoryChange(label)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition",
            activeCategory === label
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
          aria-current={activeCategory === label ? "page" : undefined}
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </button>
      ))}
    </nav>
  );
}