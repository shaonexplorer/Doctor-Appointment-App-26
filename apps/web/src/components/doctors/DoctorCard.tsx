'use client';

import { CalendarDays, MapPin, Star, Stethoscope } from 'lucide-react';

export interface DoctorCardProps {
  id: string;
  name: string;
  designation: string;
  specialty: string;
  photo?: string;
  rating?: number;
  reviewCount?: number;
  fee: number;
  nextAvailableSlot?: string | Date;
  isVerified?: boolean;
  clinic?: string;
  onClick?: () => void;
  className?: string;
}

function toDate(value: string | Date | undefined): Date | undefined {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
}

export function DoctorCard({
  id: _id,
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNextSlot = (dateValue: string | Date) => {
    const date = toDate(dateValue);
    if (!date) return 'Check availability';
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Available now';
    if (diffHours < 24) return `Available in ${diffHours}h`;
    if (diffDays < 7) return `Available in ${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <article
      className={`group border-border bg-card hover:border-primary/40 relative rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${className || ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="bg-primary/10 flex size-20 items-center justify-center overflow-hidden rounded-xl sm:size-24">
            {photo ? (
              <img src={photo} alt={name} className="size-full object-cover" />
            ) : (
              <span className="text-primary text-xl font-black sm:text-2xl">{initials}</span>
            )}
          </div>
          {isVerified && (
            <span
              className="bg-secondary text-primary absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full shadow-sm"
              aria-label="Verified doctor"
            >
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-lg font-black">{name}</h3>
                {isVerified && (
                  <span
                    className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                    aria-label="Verified"
                  >
                    <svg
                      className="size-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-primary mt-1 text-sm font-semibold">{specialty}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{designation}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <div
                className={`rounded-xl px-3 py-2 text-right ${fee > 0 ? 'bg-primary/5 border-primary/20 border' : 'bg-muted'}`}
              >
                <p className="text-primary text-lg font-black">
                  {fee > 0 ? formatFee(fee) : 'Free'}
                </p>
                <p className="text-muted-foreground text-[10px]">per visit</p>
              </div>
            </div>
          </div>

          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-xs">
            <div
              className="flex items-center gap-1.5"
              aria-label={`${rating} out of 5 stars, ${reviewCount} reviews`}
            >
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-foreground font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviewCount})</span>
            </div>
            {clinic && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span className="max-w-[200px] truncate">{clinic}</span>
              </div>
            )}
          </div>

          {nextAvailableSlot && (
            <div className="bg-secondary mt-3 flex items-center gap-2 rounded-xl p-3">
              <div className="bg-card text-primary grid size-9 shrink-0 place-items-center rounded-lg">
                <CalendarDays className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
                  Next available
                </p>
                <p className="mt-0.5 text-sm font-semibold">{formatNextSlot(nextAvailableSlot)}</p>
              </div>
              <Stethoscope className="text-muted-foreground ml-auto size-4" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
