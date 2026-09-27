"use client";

import { CalendarDays, MapPin, Star, Stethoscope } from "lucide-react";

export interface DoctorCardProps {
  id: string;
  name: string;
  designation: string;
  specialty: string;
  photo?: string;
  rating?: number;
  reviewCount?: number;
  fee: number;
  nextAvailableSlot?: Date;
  isVerified?: boolean;
  clinic?: string;
  onClick?: () => void;
  className?: string;
}

export function DoctorCard({
  id,
  name,
  designation,
  specialty,
  photo,
  rating = 4.8,
  reviewCount = 124,
  fee,
  nextAvailableSlot,
  isVerified = true,
  clinic,
  onClick,
  className,
}: DoctorCardProps) {
  const formatFee = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNextSlot = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Available now";
    if (diffHours < 24) return `Available in ${diffHours}h`;
    if (diffDays < 7) return `Available in ${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <article
      className={`group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md ${className || ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="size-20 sm:size-24 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center">
            {photo ? (
              <img src={photo} alt={name} className="size-full object-cover" />
            ) : (
              <span className="text-xl sm:text-2xl font-black text-primary">
                {initials}
              </span>
            )}
          </div>
          {isVerified && (
            <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-secondary text-primary shadow-sm" aria-label="Verified doctor">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black truncate">{name}</h3>
                {isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary" aria-label="Verified">
                    <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-primary">{specialty}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{designation}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className={`rounded-xl px-3 py-2 text-right ${fee > 0 ? "bg-primary/5 border border-primary/20" : "bg-muted"}`}>
                <p className="text-lg font-black text-primary">{fee > 0 ? formatFee(fee) : "Free"}</p>
                <p className="text-[10px] text-muted-foreground">per visit</p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5" aria-label={`${rating} out of 5 stars, ${reviewCount} reviews`}>
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviewCount})</span>
            </div>
            {clinic && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span className="truncate max-w-[200px]">{clinic}</span>
              </div>
            )}
          </div>

          {nextAvailableSlot && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary p-3">
              <div className="shrink-0 grid size-9 place-items-center rounded-lg bg-card text-primary">
                <CalendarDays className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Next available</p>
                <p className="mt-0.5 text-sm font-semibold">{formatNextSlot(nextAvailableSlot)}</p>
              </div>
              <Stethoscope className="ml-auto size-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}