"use client";

import { cn } from "@/lib/utils";

export type AvailabilityStatus = "available" | "pending" | "unavailable" | "limited";

export interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<AvailabilityStatus, { dot: string; label: string; pulse: boolean }> = {
  available: {
    dot: "bg-[#218765]",
    label: "Available",
    pulse: true,
  },
  pending: {
    dot: "bg-[#d97706]",
    label: "Pending",
    pulse: false,
  },
  unavailable: {
    dot: "bg-[#b86f63]",
    label: "Unavailable",
    pulse: false,
  },
  limited: {
    dot: "bg-[#4f6ef7]",
    label: "Limited slots",
    pulse: true,
  },
};

const sizeClasses = {
  sm: { dot: "size-1.5", label: "text-[10px]", gap: "gap-1" },
  md: { dot: "size-2", label: "text-xs", gap: "gap-1.5" },
  lg: { dot: "size-2.5", label: "text-sm", gap: "gap-2" },
};

export function AvailabilityIndicator({
  status,
  size = "md",
  showLabel = true,
  label,
  pulse,
  className,
}: AvailabilityIndicatorProps) {
  const config = statusConfig[status];
  const sizes = sizeClasses[size];
  const shouldPulse = pulse ?? config.pulse;

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold transition-colors",
        sizes.gap,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full transition-all",
          config.dot,
          sizes.dot,
          shouldPulse && "animate-pulse"
        )}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={cn(sizes.label, "text-foreground")}>
          {label || config.label}
        </span>
      )}
    </span>
  );
}

export function AvailabilityDot({
  status,
  size = "md",
  pulse,
  className,
}: {
  status: AvailabilityStatus;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}) {
  const config = statusConfig[status];
  const sizes = sizeClasses[size];
  const shouldPulse = pulse ?? config.pulse;

  return (
    <span
      className={cn(
        "rounded-full transition-all",
        config.dot,
        sizes.dot,
        shouldPulse && "animate-pulse",
        className
      )}
      aria-label={config.label}
    />
  );
}

export function AvailabilityBadge({
  status,
  size = "md",
  className,
}: {
  status: AvailabilityStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const config = statusConfig[status];
  const sizes = sizeClasses[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-bold border transition-colors",
        sizes.label,
        config.dot.replace("bg-", "bg-").replace("text-", "text-"),
        config.pulse && "animate-pulse",
        className
      )}
    >
      {config.label}
    </span>
  );
}