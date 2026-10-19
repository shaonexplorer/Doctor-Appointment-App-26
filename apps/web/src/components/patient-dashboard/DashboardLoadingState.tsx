'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface DashboardLoadingStateProps {
  className?: string;
}

/**
 * Respects the user's reduced-motion preference: under
 * `prefers-reduced-motion: reduce` the pulse animation is disabled so the
 * skeletons remain visible but still.
 */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

/**
 * shadcn Skeleton already applies `animate-pulse`. Under reduced motion we
 * override it with `animate-none` so the fallback stays visible without
 * animating (tailwind-merge resolves the conflict to the last class).
 */
function PulseSkeleton(props: React.ComponentProps<typeof Skeleton>) {
  const reduced = usePrefersReducedMotion();
  return (
    <Skeleton
      {...props}
      className={cn(reduced ? 'animate-none' : 'animate-pulse', props.className)}
    />
  );
}

function LoadingPanelHeader({ action = false }: { action?: boolean } = {}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex flex-col gap-3">
        <PulseSkeleton className="h-4 w-24" /> {/* panel title */}
        {action && <PulseSkeleton className="h-3 w-20" />} {/* action button */}
      </div>
      <PulseSkeleton className="bg-secondary text-primary size-6 rounded-full" /> {/* avatar */}
    </div>
  );
}

function LoadingDetailRow() {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-secondary flex items-center gap-4 rounded-xl p-3">
          <PulseSkeleton className="text-primary size-4" />
          <div>
            <PulseSkeleton className="h-3 w-10" /> {/* label */}
            <PulseSkeleton className="mt-1 h-3 w-20" /> {/* value */}
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingMetricCard() {
  return (
    <div className="border-border bg-card flex items-center gap-3 rounded-2xl border p-4 shadow-sm">
      <div className="bg-secondary text-primary grid size-10 place-items-center rounded-xl">
        <PulseSkeleton className="size-5" /> {/* metric icon */}
      </div>
      <div className="flex flex-col gap-2">
        <PulseSkeleton className="h-5 w-20" /> {/* value */}
        <PulseSkeleton className="h-4 w-28" /> {/* label */}
      </div>
    </div>
  );
}

function LoadingPieChartPanel() {
  return (
    <div className="flex items-center sm:gap-5">
      <div className="relative h-44 shrink-0 sm:w-44">
        <PulseSkeleton className="bg-secondary h-full w-full rounded-full" /> {/* donut */}
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="bg-muted size-2.5 rounded-full" />
            <PulseSkeleton className="h-4 w-20" /> {/* specialty name */}
            <PulseSkeleton className="h-4 w-8" /> {/* percentage */}
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingBarChartPanel() {
  return (
    <div className="h-56">
      <PulseSkeleton className="bg-secondary h-full w-full rounded-xl" /> {/* chart area */}
    </div>
  );
}

function LoadingPrescriptionsPanel() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl p-2">
          <div className="bg-secondary grid size-9 place-items-center rounded-lg">
            <PulseSkeleton className="text-primary size-4" /> {/* pill icon */}
          </div>
          <div className="min-w-0 flex-1">
            <PulseSkeleton className="h-4 w-24" /> {/* prescription name */}
            <div className="mt-1 flex items-center gap-1">
              <PulseSkeleton className="h-3 w-16" /> {/* doctor */}
              <span className="text-muted-foreground text-[10px]">·</span>
              <PulseSkeleton className="h-3 w-14" /> {/* date */}
            </div>
          </div>
          <PulseSkeleton className="bg-secondary h-6 w-6 rounded-lg" /> {/* download button */}
        </div>
      ))}
    </div>
  );
}

function LoadingQuickActionsPanel() {
  return (
    <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <PulseSkeleton className="h-4 w-24" /> {/* section title */}
          <PulseSkeleton className="h-3 w-40" /> {/* section subtitle */}
        </div>
        <PulseSkeleton className="text-muted-foreground size-5" /> {/* MoreHorizontal */}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border-border flex items-center gap-3 rounded-xl border p-3 text-left"
          >
            <div className="bg-secondary text-primary grid size-9 place-items-center rounded-lg">
              <PulseSkeleton className="size-4" /> {/* action icon */}
            </div>
            <PulseSkeleton className="h-4 w-16" /> {/* action label */}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardLoadingState({ className }: DashboardLoadingStateProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className={cn('mx-5 mt-20 flex max-w-7xl flex-col gap-5 sm:mx-auto', className)}
      role="status"
      aria-label="Loading your health overview"
      aria-busy={true}
    >
      {/* Page header skeleton (mirrors PatientPortalShell header area) */}
      <div className="flex flex-col gap-2">
        <PulseSkeleton className="h-3 w-32" /> {/* greeting line */}
        <PulseSkeleton className="h-6 w-40" /> {/* page title */}
        <PulseSkeleton className="h-4 w-72" /> {/* page description */}
      </div>

      {/* Next appointment + What to do next (xl:grid-cols-[1.35fr_1fr]) */}
      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <LoadingPanelHeader />
          <LoadingDetailRow />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <PulseSkeleton className="text-primary h-6 rounded-full bg-[#383b39] px-3 py-1" />{' '}
            {/* status */}
            <PulseSkeleton className="text-muted-foreground h-5 text-xs" /> {/* days until */}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {/* action buttons */}
            {[1, 2, 3].map((i) => (
              <PulseSkeleton
                key={i}
                className="border-border bg-card h-9 w-20 rounded-xl border px-4 py-2.5"
              />
            ))}
          </div>
        </div>
        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <LoadingPanelHeader />
          <div className="mt-5 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-border flex items-center gap-3 rounded-xl border p-3">
                <div className="bg-secondary text-primary grid size-9 place-items-center rounded-lg">
                  <PulseSkeleton className="text-primary size-5" />
                </div>
                <div>
                  <PulseSkeleton className="h-4 w-24" /> {/* reminder title */}
                  <PulseSkeleton className="text-muted-foreground mt-1 h-3 w-48 text-[11px]" />{' '}
                  {/* detail */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KPI metrics (gap-3 sm:grid-cols-2 xl:grid-cols-4) */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(() => (
          <LoadingMetricCard />
        ))}
      </section>

      {/* Charts (xl:grid-cols-[1.15fr_1fr]) */}
      <section className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <LoadingPanelHeader />
          <LoadingPieChartPanel />
        </div>
        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <LoadingPanelHeader />
          <LoadingBarChartPanel />
        </div>
      </section>

      {/* Prescriptions + Monthly medical expenses (xl:grid-cols-[1fr_1.15fr]) */}
      <section className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <LoadingPanelHeader action />
          <LoadingPrescriptionsPanel />
        </div>
        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <LoadingPanelHeader />
          <LoadingBarChartPanel />
        </div>
      </section>

      {/* Quick actions */}
      <LoadingQuickActionsPanel />

      {/* Refreshing overview indicator */}
      <div className="mt-4 flex justify-end">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold">
          <RefreshCw className={cn(reduced ? 'animate-none' : 'animate-spin')} aria-hidden="true" />
          <span>Refreshing overview</span>
        </div>
      </div>
    </section>
  );
}
