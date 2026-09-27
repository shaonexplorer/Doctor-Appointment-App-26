"use client";

import { cn } from "@/lib/utils";
import { FileText, Upload } from "lucide-react";

export type RecordCategory = "Prescriptions" | "Diagnostic Reports" | "Lab Results" | "Visit History";

export interface DocumentPlaceholderProps {
  category: RecordCategory;
  onUpload: () => void;
  className?: string;
}

export function DocumentPlaceholder({ category, onUpload, className }: DocumentPlaceholderProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-8 text-center shadow-sm", className)}>
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
        <FileText className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-black">{category}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Your {category.toLowerCase()} will appear here when they are added to your secure record.
      </p>
      <button
        type="button"
        onClick={onUpload}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground"
      >
        <Upload className="size-4" aria-hidden="true" />
        Upload document
      </button>
    </section>
  );
}