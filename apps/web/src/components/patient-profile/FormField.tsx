"use client";

import { cn } from "@/lib/utils";

const inputClass = "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export interface FormFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "tel" | "password" | "date";
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
  id?: string;
}

export function FormField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder,
  className,
  required = false,
  error,
  id,
}: FormFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className={cn("grid gap-2 text-xs font-bold text-foreground", className)} htmlFor={fieldId}>
      <span>
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </span>
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          inputClass,
          disabled && "disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground",
          error && "border-destructive focus:border-destructive focus:ring-destructive/15"
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${fieldId}-error` : undefined}
      />
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

export interface TextareaFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
  id?: string;
  rows?: number;
}

export function TextareaField({
  label,
  value,
  onChange,
  disabled = false,
  placeholder,
  className,
  required = false,
  error,
  id,
  rows = 4,
}: TextareaFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className={cn("grid gap-2 text-xs font-bold text-foreground", className)} htmlFor={fieldId}>
      <span>
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </span>
      <textarea
        id={fieldId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "min-h-24 rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none",
          disabled && "disabled:bg-secondary disabled:text-muted-foreground",
          error && "border-destructive focus:border-destructive focus:ring-destructive/15"
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${fieldId}-error` : undefined}
      />
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
  id?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  disabled = false,
  className,
  required = false,
  error,
  id,
}: SelectFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className={cn("grid gap-2 text-xs font-bold text-foreground", className)} htmlFor={fieldId}>
      <span>
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </span>
      <select
        id={fieldId}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15",
          disabled && "disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground",
          error && "border-destructive focus:border-destructive focus:ring-destructive/15"
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${fieldId}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}