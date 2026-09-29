"use client";

import { cn } from "@/lib/utils";
import { Search, Stethoscope, CalendarDays, Filter, X, Plus } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
  showSearch?: boolean;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className,
  showSearch = false,
  onSearch,
  searchPlaceholder = "Search...",
}: EmptyStateProps) {
  const sizeStyles = {
    sm: "p-6",
    md: "p-10",
    lg: "p-12",
  };

  const iconSizes = {
    sm: "size-10",
    md: "size-14",
    lg: "size-16",
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const descSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const DefaultIcon = ({ className }: { className?: string }) => (
    <Search className={cn("text-muted-foreground/50", className)} />
  );

  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-card text-center",
        sizeStyles[size],
        className
      )}
    >
      <div className={cn("mx-auto", iconSizes[size])}>
        {icon || <DefaultIcon />}
      </div>
      <h3 className={cn("mt-4 font-bold", titleSizes[size])}>{title}</h3>
      {description && (
        <p className={cn("mx-auto mt-2 max-w-sm", descSizes[size], "text-muted-foreground")}>
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
                action.variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",
                action.variant === "secondary" && "border border-border bg-background hover:bg-secondary",
                action.variant === "outline" && "border border-border bg-transparent hover:bg-secondary"
              )}
            >
              {action.variant !== "outline" && action.label === "Find a doctor" && <Stethoscope className="size-4" />}
              {action.variant !== "outline" && action.label === "Book appointment" && <CalendarDays className="size-4" />}
              {action.variant !== "outline" && action.label === "Clear filters" && <X className="size-4" />}
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-secondary"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
      {showSearch && (
        <div className="mt-6 max-w-md mx-auto">
          <label htmlFor="empty-state-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="empty-state-search"
              type="search"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
              autoComplete="off"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function EmptyDoctorsState({
  onSearch,
  onClearFilters,
  hasFilters = false,
  className,
}: {
  onSearch?: (value: string) => void;
  onClearFilters?: () => void;
  hasFilters?: boolean;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Stethoscope className="size-14 text-primary/50" />}
      title={hasFilters ? "No doctors match your filters" : "No doctors found"}
      description={hasFilters
        ? "Try adjusting your filters or search terms to find more doctors."
        : "We couldn't find any doctors matching your search. Try a different keyword or specialty."}
      action={hasFilters ? { label: "Clear filters", onClick: onClearFilters!, variant: "outline" } : undefined}
      secondaryAction={!hasFilters ? { label: "Browse all specialties", onClick: () => {} } : undefined}
      showSearch={!hasFilters}
      onSearch={onSearch}
      searchPlaceholder="Search doctors, specialties, symptoms..."
      className={className}
    />
  );
}

export function EmptyAppointmentsState({
  tab,
  onBook,
  className,
}: {
  tab: "Upcoming" | "Completed" | "Cancelled";
  onBook?: () => void;
  className?: string;
}) {
  const messages = {
    Upcoming: {
      title: "No upcoming appointments",
      description: "When you book a visit, it will appear here.",
      actionLabel: "Book appointment",
    },
    Completed: {
      title: "No completed appointments",
      description: "Your completed appointment history will appear here.",
      actionLabel: "Book appointment",
    },
    Cancelled: {
      title: "No cancelled appointments",
      description: "Cancelled appointments will appear here.",
      actionLabel: "Book appointment",
    },
  };

  const { title, description, actionLabel } = messages[tab];

  return (
    <EmptyState
      icon={<CalendarDays className="size-14 text-primary/50" />}
      title={title}
      description={description}
      action={onBook ? { label: actionLabel, onClick: onBook, variant: "primary" } : undefined}
      className={className}
    />
  );
}

export function EmptySearchState({
  query,
  onClearSearch,
  className,
}: {
  query: string;
  onClearSearch?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Search className="size-14 text-muted-foreground/50" />}
      title={`No results for "${query}"`}
      description="Try a different search term or browse specialties below."
      action={onClearSearch ? { label: "Clear search", onClick: onClearSearch, variant: "outline" } : undefined}
      className={className}
    />
  );
}

export function EmptyPrescriptionsState({
  onUpload,
  className,
}: {
  onUpload?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<FileText className="size-14 text-primary/50" />}
      title="No prescriptions found"
      description="Your prescriptions will appear here after your visits."
      action={onUpload ? { label: "Upload prescription", onClick: onUpload, variant: "primary" } : undefined}
      className={className}
    />
  );
}

export function EmptyRecordsState({
  category,
  onUpload,
  className,
}: {
  category: string;
  onUpload?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<FileText className="size-14 text-primary/50" />}
      title={`No ${category.toLowerCase()}`}
      description={`Your ${category.toLowerCase()} will appear here when they are added to your secure record.`}
      action={onUpload ? { label: "Upload document", onClick: onUpload, variant: "primary" } : undefined}
      className={className}
    />
  );
}

// Need to import FileText
import { FileText } from "lucide-react";