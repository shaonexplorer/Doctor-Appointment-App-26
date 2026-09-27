"use client";

import { useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MapPin, Filter, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DoctorCard,
  SpecialtyChip,
  AvailabilityIndicator,
  FeeDisplay,
  SearchInput,
  FilterSidebar,
  LoadingSkeleton,
  EmptyState,
  type DoctorCardProps,
  type DoctorFilters,
} from "@/components/doctors";

interface DoctorSearchResult {
  id: string;
  name: string;
  designation: string;
  specialty: string;
  photo?: string;
  rating?: number;
  reviewCount?: number;
  fee: number;
  nextAvailableSlot?: string;
  isVerified?: boolean;
  clinic?: string;
}

interface SearchResponse {
  success: boolean;
  data: DoctorSearchResult[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function DoctorSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<DoctorFilters>({
    specialty: [],
    minFee: null,
    maxFee: null,
    availableFrom: null,
    availableTo: null,
    consultationType: "all",
    sortBy: "relevance",
    onlyVerified: false,
    acceptsInsurance: false,
  });
  const [doctors, setDoctors] = useState<DoctorSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch doctors
  const fetchDoctors = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setDoctors([]);
      }
      setError(null);

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "12",
          ...(debouncedQuery && { search: debouncedQuery }),
          ...(filters.specialty.length > 0 && { specialty: filters.specialty.join(",") }),
          ...(filters.minFee !== null && { minFee: filters.minFee.toString() }),
          ...(filters.maxFee !== null && { maxFee: filters.maxFee.toString() }),
          ...(filters.availableFrom && { availableFrom: filters.availableFrom.toISOString() }),
          ...(filters.availableTo && { availableTo: filters.availableTo.toISOString() }),
          ...(filters.consultationType !== "all" && { consultationType: filters.consultationType }),
          ...(filters.sortBy !== "relevance" && { sortBy: filters.sortBy }),
          ...(filters.onlyVerified && { onlyVerified: "true" }),
          ...(filters.acceptsInsurance && { acceptsInsurance: "true" }),
        });

        // Use full-text search endpoint when there's a search query
        const endpoint = debouncedQuery ? "/api/doctors/search" : "/api/doctors";
        const response = await fetch(`${API_URL}${endpoint}?${params}`);
        const data: SearchResponse = await response.json();

        if (!data.success) {
          throw new Error("Failed to fetch doctors");
        }

        setDoctors((prev) => (isLoadMore ? [...prev, ...data.data] : data.data));
        setTotalPages(data.meta.totalPages);
        setTotalResults(data.meta.total);
        setHasSearched(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load doctors");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedQuery, filters]
  );

  // Initial load and when filters change
  useEffect(() => {
    setPage(1);
    fetchDoctors(1);
  }, [debouncedQuery, filters, fetchDoctors]);

  // Load more on scroll
  useEffect(() => {
    if (inView && page < totalPages && !loadingMore && hasSearched) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDoctors(nextPage, true);
    }
  }, [inView, page, totalPages, loadingMore, hasSearched, fetchDoctors]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilterChange = useCallback((newFilters: DoctorFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      specialty: [],
      minFee: null,
      maxFee: null,
      availableFrom: null,
      availableTo: null,
      consultationType: "all",
      sortBy: "relevance",
      onlyVerified: false,
      acceptsInsurance: false,
    });
  }, []);

  const activeFilterCount =
    filters.specialty.length +
    (filters.minFee !== null ? 1 : 0) +
    (filters.maxFee !== null ? 1 : 0) +
    (filters.availableFrom !== null ? 1 : 0) +
    (filters.availableTo !== null ? 1 : 0) +
    (filters.consultationType !== "all" ? 1 : 0) +
    (filters.sortBy !== "relevance" ? 1 : 0) +
    (filters.onlyVerified ? 1 : 0) +
    (filters.acceptsInsurance ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Find Doctors</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Search for Healthcare Providers
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Find the right doctor for your needs. Filter by specialty, availability, and more.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(true)}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-muted-foreground transition-colors",
                  "hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                )}
                aria-label="Open filters"
              >
                <Filter className="size-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="border-b border-border bg-background/50">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <SearchInput
              value={searchQuery}
              onChange={handleSearch}
              onSearch={() => {}}
              onFilterClick={() => setFilterOpen(true)}
              placeholder="Search doctors, specialties, symptoms..."
              showFilterButton={false}
              loading={loading}
            />
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {filters.specialty.map((s) => (
                  <SpecialtyChip
                    key={s}
                    label={s}
                    variant="primary"
                    size="sm"
                    selected
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        specialty: prev.specialty.filter((sp) => sp !== s),
                      }));
                    }}
                  />
                ))}
                {(filters.minFee !== null || filters.maxFee !== null) && (
                  <SpecialtyChip
                    label={`$${filters.minFee ?? 0} - $${filters.maxFee ?? 500}`}
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, minFee: null, maxFee: null }))}
                  />
                )}
                {filters.consultationType !== "all" && (
                  <SpecialtyChip
                    label={
                      filters.consultationType === "in_person"
                        ? "In-person"
                        : filters.consultationType === "video"
                        ? "Video"
                        : "Phone"
                    }
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, consultationType: "all" }))}
                  />
                )}
                {filters.onlyVerified && (
                  <SpecialtyChip
                    label="Verified only"
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, onlyVerified: false }))}
                  />
                )}
                {activeFilterCount > 3 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:px-10">
        {/* Results Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {hasSearched ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {totalResults} {totalResults === 1 ? "doctor" : "doctors"} found
                  {debouncedQuery && (
                    <> for <span className="font-semibold text-foreground">"{debouncedQuery}"</span></>
                  )}
                </p>
                {activeFilterCount > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Start searching to find doctors
              </p>
            )}
          </div>
          {hasSearched && (
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="sr-only">
                Sort by
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value as DoctorFilters["sortBy"] }))
                }
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
              >
                <option value="relevance">Relevance</option>
                <option value="fee_asc">Fee: Low to High</option>
                <option value="fee_desc">Fee: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="availability">Soonest Available</option>
              </select>
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        {loading && !hasSearched ? (
          <LoadingSkeleton count={6} variant="doctor-card" />
        ) : error ? (
          <EmptyState
            icon={<X className="size-14 text-destructive/50" />}
            title="Failed to load doctors"
            description={error}
            action={{ label: "Try again", onClick: () => fetchDoctors(1), variant: "primary" }}
          />
        ) : hasSearched && doctors.length === 0 ? (
          <EmptyState
            icon={<MapPin className="size-14 text-muted-foreground/50" />}
            title={debouncedQuery ? `No doctors found for "${debouncedQuery}"` : "No doctors available"}
            description={
              debouncedQuery
                ? "Try a different search term or adjust your filters."
                : "No doctors match your current filters. Try clearing them."
            }
            action={activeFilterCount > 0 ? { label: "Clear filters", onClick: handleClearFilters, variant: "outline" } : undefined}
            showSearch={!debouncedQuery && activeFilterCount === 0}
            onSearch={handleSearch}
            searchPlaceholder="Search doctors, specialties, symptoms..."
          />
        ) : (
          <>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
              }}
              role="list"
              aria-label="Doctors"
            >
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.name}
                  designation={doctor.designation}
                  specialty={doctor.specialty}
                  photo={doctor.photo}
                  rating={doctor.rating}
                  reviewCount={doctor.reviewCount}
                  fee={doctor.fee}
                  nextAvailableSlot={doctor.nextAvailableSlot ? new Date(doctor.nextAvailableSlot) : undefined}
                  isVerified={doctor.isVerified}
                  clinic={doctor.clinic}
                  onClick={() => {
                    // Navigate to doctor detail page
                    window.location.href = `/doctors/${doctor.id}`;
                  }}
                />
              ))}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="h-10" aria-hidden="true">
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <Loader2 className="size-6 text-primary animate-spin" />
                </div>
              )}
              {page >= totalPages && hasSearched && doctors.length > 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  You've seen all {totalResults} doctors
                </p>
              )}
            </div>
          </>
        )}
      </main>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterChange}
        initialFilters={filters}
      />
    </div>
  );
}