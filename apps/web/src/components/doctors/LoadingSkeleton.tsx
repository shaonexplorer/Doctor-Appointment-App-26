"use client";

import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps {
  variant?: "doctor-card" | "slot-grid" | "appointment-card" | "text" | "circular" | "rectangular";
  className?: string;
  count?: number;
  lines?: number;
  width?: string | number;
  height?: string | number;
}

export function LoadingSkeleton({
  variant = "rectangular",
  className,
  count = 1,
  lines = 3,
  width,
  height,
}: LoadingSkeletonProps) {
  const baseStyles = "animate-pulse rounded-xl bg-secondary";

  const variants = {
    "doctor-card": "h-64 sm:h-72 w-full",
    "slot-grid": "h-24 w-full",
    "appointment-card": "h-32 w-full",
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  const skeletonStyle = cn(baseStyles, variants[variant], className);
  const inlineStyle = {
    width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
  } as React.CSSProperties;

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div key={i} className={skeletonStyle} style={inlineStyle} aria-hidden="true" />
  ));

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse h-4 rounded bg-secondary",
              i === lines - 1 && "w-3/4"
            )}
            style={{ width: i === lines - 1 ? "75%" : "100%" }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return <div className={cn("space-y-4", className)} aria-hidden="true">{skeletons}</div>;
}

export function DoctorCardSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="size-20 sm:size-24 rounded-xl bg-secondary shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 space-y-2">
                  <div className="h-6 w-3/4 bg-secondary rounded" aria-hidden="true" />
                  <div className="h-4 w-1/2 bg-secondary rounded" aria-hidden="true" />
                  <div className="h-4 w-2/5 bg-secondary rounded" aria-hidden="true" />
                </div>
                <div className="h-12 w-24 shrink-0 bg-secondary rounded-xl" aria-hidden="true" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-4 w-24 bg-secondary rounded-full" aria-hidden="true" />
                <div className="h-4 w-28 bg-secondary rounded-full" aria-hidden="true" />
              </div>
              <div className="h-12 w-full bg-secondary rounded-xl" aria-hidden="true" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SlotGridSkeleton({ count = 6, columns = 3, className }: { count?: number; columns?: number; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        `grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns}`,
        className
      )}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse h-20 rounded-xl bg-secondary" />
      ))}
    </div>
  );
}

export function AppointmentCardSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="size-11 shrink-0 rounded-xl bg-secondary" />
              <div className="min-w-0 space-y-2">
                <div className="h-5 w-1/2 bg-secondary rounded" />
                <div className="h-4 w-1/3 bg-secondary rounded" />
                <div className="h-3 w-2/3 bg-secondary rounded" />
                <div className="h-3 w-3/5 bg-secondary rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-20 bg-secondary rounded-lg" />
              <div className="h-8 w-20 bg-secondary rounded-lg" />
              <div className="h-8 w-20 bg-secondary rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-5", className)} aria-hidden="true">
      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="size-10 rounded-lg bg-secondary" />
            <div className="space-y-1">
              <div className="h-8 w-16 bg-secondary rounded" />
              <div className="h-3 w-24 bg-secondary rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Panels */}
      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="h-6 w-1/3 bg-secondary rounded" />
          <div className="h-40 bg-secondary rounded-xl" />
        </div>
        <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="h-6 w-1/3 bg-secondary rounded" />
          <div className="h-40 bg-secondary rounded-xl" />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
        <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="h-6 w-1/3 bg-secondary rounded" />
          <div className="h-40 bg-secondary rounded-xl" />
        </div>
        <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="h-6 w-1/3 bg-secondary rounded" />
          <div className="h-56 bg-secondary rounded-xl" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="h-6 w-1/4 bg-secondary rounded" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-20 bg-secondary rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)} aria-hidden="true">
      {/* Header */}
      <div className="animate-pulse flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-secondary rounded" />
          <div className="h-8 w-48 bg-secondary rounded" />
          <div className="h-4 w-64 bg-secondary rounded" />
        </div>
        <div className="h-10 w-32 bg-secondary rounded-xl" />
      </div>

      {/* Content Grid */}
      <div className="grid gap-5 xl:grid-cols-4">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-5">
          <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="h-6 w-1/3 bg-secondary rounded" />
            <div className="h-60 bg-secondary rounded-xl" />
          </div>
          <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="h-6 w-1/3 bg-secondary rounded" />
            <div className="h-40 bg-secondary rounded-xl" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="h-6 w-1/3 bg-secondary rounded" />
            <div className="h-40 bg-secondary rounded-xl" />
          </div>
          <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="h-6 w-1/3 bg-secondary rounded" />
            <div className="h-32 bg-secondary rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}