"use client";

import { cn } from "@/lib/utils";

export interface ToggleSwitchProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({ label, description, value, onChange, disabled = false, className }: ToggleSwitchProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-xl border border-border p-4", className)}>
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        aria-pressed={value}
        aria-disabled={disabled}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          value ? "bg-primary" : "bg-muted",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-4 rounded-full bg-white shadow transition",
            value ? "left-6" : "left-1"
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}