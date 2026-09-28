'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Grid2X2, List, Search, SlidersHorizontal, X, Loader2, AlertCircle } from 'lucide-react';
import { DoctorCard, FilterSidebar, SelectFilter, EmptyState } from './index';
import {
  useInfiniteDoctors,
  transformDoctorsToCardData,
  type DoctorSearchFilters,
} from '@/hooks/useDoctors';

export interface FindDoctorsProps {
  className?: string;
}

const specialties = [
  'All specialties',
  'Cardiology',
  'Dermatology',
  'Internal Medicine',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Oncology',
  'Ophthalmology',
  'ENT',
  'Urology',
  'Gastroenterology',
];

export function FindDoctors({ className }: FindDoctorsProps) {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All specialties');
  const [availableToday, setAvailableToday] = useState(false);
  const [consultation, setConsultation] = useState('Any type');
  const [sort, setSort] = useState('Recommended');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilters, setMobileFilters] = useState(false);
  const [notice, setNotice] = useState('');

  // Build filters for API
  const filters: Omit<DoctorSearchFilters, 'page'> = {
    search: query || undefined,
    specialty: specialty === 'All specialties' ? undefined : specialty,
    availableFrom: availableToday ? new Date().toISOString() : undefined,
    consultationType:
      consultation === 'Any type'
        ? undefined
        : consultation === 'In-clinic'
          ? 'IN_PERSON'
          : 'VIDEO',
    limit: 20,
    sortBy:
      sort === 'Recommended'
        ? undefined
        : sort === 'Experience'
          ? 'createdAt'
          : sort === 'Fee: low to high'
            ? 'fee'
            : undefined,
    sortOrder: sort === 'Fee: low to high' ? 'asc' : sort === 'Experience' ? 'desc' : undefined,
  };

  // Fetch doctors using TanStack Query with infinite scrolling
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteDoctors(filters);

  // Transform all fetched pages into a flat array of DoctorCardData
  const doctors = data?.pages.flatMap((page) => transformDoctorsToCardData(page.data)) ?? [];

  // Client-side filtering for immediate feedback (while API handles primary filtering)
  const filtered = doctors.filter((doctor) => {
    const haystack = [
      doctor.name,
      doctor.designation,
      ...doctor.specialties,
      ...doctor.symptoms,
      doctor.clinic,
    ]
      .join(' ')
      .toLowerCase();
    return (
      haystack.includes(query.toLowerCase()) &&
      (specialty === 'All specialties' || doctor.specialties.includes(specialty)) &&
      (!availableToday || doctor.availability === 'Available today')
    );
  });

  // Load more handler for infinite scrolling
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Skeleton loader for DoctorCard
  function DoctorCardSkeleton({ list = false }: { list?: boolean }) {
    return (
      <article
        className={cn(
          'border-border bg-card animate-pulse rounded-2xl border p-5',
          list ? 'sm:flex sm:items-center sm:gap-5' : ''
        )}
      >
        <div className="flex items-start gap-4">
          <div className="bg-muted grid size-14 shrink-0 place-items-center rounded-2xl" />
          <div className="min-w-0 flex-1">
            <div className="bg-muted mb-2 h-5 w-3/4 rounded" />
            <div className="bg-muted h-4 w-1/2 rounded" />
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="bg-muted h-5 w-20 rounded-full" />
              <span className="bg-muted h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>
        <div className="border-border mt-4 grid gap-3 border-y py-4 text-xs sm:grid-cols-2">
          <div className="bg-muted h-10 w-full rounded" />
          <div className="bg-muted h-10 w-full rounded" />
          <div className="bg-muted h-10 w-full rounded" />
          <div className="bg-muted h-10 w-full rounded" />
        </div>
        <div className="bg-muted mt-4 mb-4 h-4 w-full rounded" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="bg-muted mb-1 h-3 w-1/3 rounded" />
            <div className="bg-muted mb-1 h-6 w-1/4 rounded" />
            <div className="bg-muted h-3 w-1/2 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="bg-muted h-9 w-28 rounded-xl" />
            <div className="bg-primary h-9 w-28 rounded-xl" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {notice && (
        <div
          role="status"
          className="border-primary/20 bg-primary/5 text-primary flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold"
        >
          <span>{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss">
            <X className="size-4" />
          </button>
        </div>
      )}
      <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              Find the right doctor for your needs
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Search trusted specialists and book care that works for you.
            </p>
          </div>
          <button
            onClick={() => setMobileFilters(true)}
            className="border-border flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filters
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
          <label className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by doctor, specialty, or symptom"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border pr-3 pl-9 text-sm outline-none focus:ring-2"
            />
          </label>
          <SelectFilter label="All specialties" options={specialties} onChange={setSpecialty} />
          <SelectFilter
            label="Any consultation type"
            options={['Any consultation type', 'In-clinic', 'Video consultation']}
            onChange={setConsultation}
          />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[25%_1fr]">
        <FilterSidebar
          specialty={specialty}
          onSpecialtyChange={setSpecialty}
          availableToday={availableToday}
          onAvailableTodayChange={setAvailableToday}
          consultation={consultation}
          onConsultationChange={setConsultation}
          designation="Any designation"
          onDesignationChange={() => {}}
          feeRange={150}
          onFeeRangeChange={() => {}}
          availableThisWeek={false}
          onAvailableThisWeekChange={() => {}}
          gender="Any"
          onGenderChange={() => {}}
          clinic="All clinics"
          onClinicChange={() => {}}
          onClearAll={() => {
            setSpecialty('All specialties');
            setAvailableToday(false);
            setConsultation('Any type');
          }}
        />

        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold">
              <span className="text-primary">{filtered.length}</span> doctors found
            </p>
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground hidden items-center gap-2 text-xs font-semibold sm:flex">
                Sort by{' '}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border-border bg-card text-foreground rounded-lg border px-2 py-2 font-bold outline-none"
                >
                  <option>Recommended</option>
                  <option>Experience</option>
                  <option>Fee: low to high</option>
                </select>
              </label>
              <div className="border-border bg-card flex rounded-lg border p-1">
                <button
                  onClick={() => setView('grid')}
                  className={cn(
                    'rounded-md p-1.5',
                    view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  )}
                  aria-label="Grid view"
                >
                  <Grid2X2 className="size-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={cn(
                    'rounded-md p-1.5',
                    view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  )}
                  aria-label="List view"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>
          {/* Loading state */}
          {isLoading && (
            <div className={view === 'grid' ? 'grid gap-4 xl:grid-cols-2' : 'flex flex-col gap-4'}>
              {[...Array(6)].map((_, i) => (
                <DoctorCardSkeleton key={i} list={view === 'list'} />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-6 text-center">
              <AlertCircle className="text-destructive mx-auto size-8" aria-hidden="true" />
              <h2 className="text-destructive mt-4 text-lg font-black">Failed to load doctors</h2>
              <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
                {error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred. Please try again.'}
              </p>
              <button
                onClick={() => void refetch()}
                className="bg-primary text-primary-foreground mt-5 rounded-xl px-4 py-2.5 text-xs font-bold"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              onClear={() => {
                setQuery('');
                setSpecialty('All specialties');
                setAvailableToday(false);
              }}
            />
          )}

          {/* Doctors list */}
          {!isLoading && !isError && filtered.length > 0 && (
            <>
              <div
                className={view === 'grid' ? 'grid gap-4 xl:grid-cols-2' : 'flex flex-col gap-4'}
              >
                {filtered.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} list={view === 'list'} />
                ))}
              </div>

              {/* Load more / Infinite scroll trigger */}
              {hasNextPage && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isFetchingNextPage}
                    className="border-border bg-card hover:bg-secondary flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Loading more...
                      </>
                    ) : (
                      'Load more doctors'
                    )}
                  </button>
                </div>
              )}

              {/* Results summary */}
              <div className="border-border bg-card mt-6 flex items-center justify-between rounded-xl border px-4 py-3">
                <p className="text-muted-foreground text-xs">
                  Showing {filtered.length} of {data?.pages[0].meta.total ?? filtered.length}{' '}
                  doctors
                </p>
                {hasNextPage && (
                  <span className="text-muted-foreground text-xs">
                    {isFetchingNextPage ? 'Loading...' : 'Scroll or click to load more'}
                  </span>
                )}
              </div>
            </>
          )}
        </section>
      </div>
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="bg-foreground/20 absolute inset-0"
            onClick={() => setMobileFilters(false)}
          />
          <div className="bg-card absolute inset-y-0 right-0 w-[min(88vw,360px)] overflow-y-auto p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black">Filter doctors</h2>
              <button
                onClick={() => setMobileFilters(false)}
                className="hover:bg-secondary rounded-lg p-2"
                aria-label="Close filters"
              >
                <X className="size-5" />
              </button>
            </div>
            <FilterSidebar
              specialty={specialty}
              onSpecialtyChange={setSpecialty}
              availableToday={availableToday}
              onAvailableTodayChange={setAvailableToday}
              consultation={consultation}
              onConsultationChange={setConsultation}
              designation="Any designation"
              onDesignationChange={() => {}}
              feeRange={150}
              onFeeRangeChange={() => {}}
              availableThisWeek={false}
              onAvailableThisWeekChange={() => {}}
              gender="Any"
              onGenderChange={() => {}}
              clinic="All clinics"
              onClinicChange={() => {}}
              onClearAll={() => {
                setSpecialty('All specialties');
                setAvailableToday(false);
                setConsultation('Any type');
              }}
              isOpen={true}
            />
            <button
              onClick={() => setMobileFilters(false)}
              className="bg-primary text-primary-foreground mt-8 w-full rounded-xl py-3 text-sm font-bold"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
