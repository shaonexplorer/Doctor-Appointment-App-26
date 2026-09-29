'use client';

import { cn } from '@/lib/utils';
import { BadgeCheck, Star } from 'lucide-react';

export interface DoctorHeaderProps {
  doctor: {
    name: string;
    initials: string;
    designation: string;
    specialties: string[];
    experience: string;
    qualifications: string;
    clinic: string;
    fee: string;
    rating: number;
    reviews: number;
    avatarColor: string;
  };
  onBook?: () => void;
  onBack?: () => void;
  selectedTime?: string;
  onNotice?: (message: string) => void;
  className?: string;
}

export function DoctorHeader({
  doctor,
  onBook,
  selectedTime,
  onNotice,
  className,
}: DoctorHeaderProps) {
  console.log(doctor);
  return (
    <section
      className={cn(
        'border-border bg-card overflow-hidden rounded-2xl border shadow-sm',
        className
      )}
    >
      <div className="h-28 bg-gradient-to-r from-[#527fd2] via-[#88a4dc] to-[#e9f8f3]" />
      <div className="-mt-12 flex min-w-0 flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div className="flex min-w-0 flex-wrap items-end gap-4">
          <div
            className={cn(
              'border-card text-primary grid size-24 shrink-0 place-items-center rounded-3xl border-4 text-2xl font-black shadow-sm',
              doctor.avatarColor
            )}
          >
            {doctor.initials}
          </div>
          <div className="min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight">{doctor.name}</h2>
              <BadgeCheck className="fill-primary text-card size-5" aria-label="Verified doctor" />
            </div>
            <p className="text-primary mt-1 font-semibold">{doctor.designation}</p>
            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-[#c28a31]">
                <Star className="size-3.5 fill-current" aria-hidden="true" />
                {doctor.rating} ({doctor.reviews} reviews)
              </span>
              {/* <span>{doctor.experience} experience</span> */}
              <span>12 Years experience</span>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Consultation fee
            </p>
            <p className="text-2xl font-black">
              {doctor.fee}{' '}
              <span className="text-muted-foreground text-xs font-semibold">/ visit</span>
            </p>
          </div>
          <button
            onClick={() =>
              selectedTime
                ? onBook
                  ? onBook()
                  : onNotice?.(`Appointment request started for ${selectedTime}.`)
                : onNotice?.('Select an available time first.')
            }
            className="bg-primary text-primary-foreground rounded-xl px-5 py-3 text-sm font-black shadow-sm hover:opacity-90"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </section>
  );
}
