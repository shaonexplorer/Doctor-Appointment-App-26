"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

export interface SymptomNotesFieldProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function SymptomNotesField({
  value,
  onChange,
  maxLength = 1000,
  placeholder = "Describe your symptoms, concerns, or reason for visit...",
  label = "Symptoms & Notes",
  description = "Help your doctor prepare for your visit (optional)",
  required = false,
  disabled = false,
  error,
  className,
}: SymptomNotesFieldProps) {
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isOverLimit = charCount > maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <label className="block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </label>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}

      <div className="mt-2 relative">
        <textarea
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={5}
          className={cn(
            "w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none transition resize-none",
            "focus:border-primary focus:ring-2 focus:ring-primary/15",
            "placeholder:text-muted-foreground/50",
            disabled && "cursor-not-allowed bg-secondary text-muted-foreground",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/15"
              : isOverLimit
              ? "border-destructive"
              : "border-border hover:border-primary/30"
          )}
          aria-invalid={error ? "true" : isOverLimit ? "true" : "false"}
          aria-describedby={error ? "symptoms-error" : isOverLimit ? "symptoms-limit" : undefined}
        />

        {/* Character Counter */}
        <div
          className={cn(
            "absolute bottom-2 right-2 text-[10px] font-medium transition-colors",
            isOverLimit
              ? "text-destructive"
              : isNearLimit
              ? "text-warning"
              : "text-muted-foreground"
          )}
          id="symptoms-limit"
          aria-live="polite"
        >
          {charCount}/{maxLength}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          id="symptoms-error"
          className="mt-2 flex items-center gap-1.5 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Success/Helper Text */}
      {!error && charCount > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle className="size-4 shrink-0" aria-hidden="true" />
          <span className="text-xs">Good detail level for your doctor</span>
        </div>
      )}

      {/* Helper Tips */}
      {!disabled && charCount === 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          <p className="font-medium">Tips for describing symptoms:</p>
          <ul className="mt-1 space-y-0.5 pl-4 list-disc">
            <li>When did the symptoms start?</li>
            <li>How severe are they? (mild/moderate/severe)</li>
            <li>Any triggers or patterns?</li>
            <li>Current medications or allergies?</li>
          </ul>
        </div>
      )}
    </div>
  );
}