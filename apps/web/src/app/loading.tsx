import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-border bg-background/95 sticky top-0 z-20 border-b px-5 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary flex size-10 items-center justify-center rounded-[13px] text-white shadow-[0_8px_18px_rgba(37,99,235,.2)]">
              <Skeleton className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-20" /> {/* brand name */}
              <Skeleton className="h-2 w-10" /> {/* tagline */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" /> {/* auth link */}
            <Skeleton className="h-8 w-24" /> {/* get started button */}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl min-w-0 flex-1 p-5 pb-24 sm:p-8 lg:p-10">
        <div className="mb-8">
          <Skeleton className="h-3 w-32" /> {/* eyebrow/date */}
          <Skeleton className="h-6 w-40" /> {/* page title */}
          <Skeleton className="h-4 w-72" /> {/* page description */}
        </div>

        <div className="flex flex-col gap-5">
          {/* Top row: two full-width panel skeletons */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-40" />
              <Skeleton className="mt-5 h-full" />
            </div>
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-40" />
              <Skeleton className="mt-5 h-full" />
            </div>
          </div>

          {/* KPI metric row */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="border-border bg-card h-24 rounded-2xl border shadow-sm"
              />
            ))}
          </div>

          {/* Charts row */}
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-5 h-56" />
            </div>
            <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-5 h-56" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
