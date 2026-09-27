"use client";

import { cn } from "@/lib/utils";
import { BadgeCheck, MapPin, Star, ChevronLeft } from "lucide-react";

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
  onBack: () => void;
  onBook?: () => void;
  selectedTime?: string;
  onNotice?: (message: string) => void;
  className?: string;
}

export function DoctorHeader({
  doctor,
  onBack,
  onBook,
  selectedTime,
  onNotice,
  className,
}: DoctorHeaderProps) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-sm", className)}>
      <div className="h-28 bg-gradient-to-r from-[#dce8ff] via-[#edf3ff] to-[#e9f8f3]" />
      <div className="-mt-12 flex min-w-0 flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div className="flex min-w-0 flex-wrap items-end gap-4">
          <div className={cn("grid size-24 shrink-0 place-items-center rounded-3xl border-4 border-card text-2xl font-black text-primary shadow-sm", doctor.avatarColor)}>
            {doctor.initials}
          </div>
          <div className="min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight">{doctor.name}</h2>
              <BadgeCheck className="size-5 fill-primary text-card" aria-label="Verified doctor" />
            </div>
            <p className="mt-1 font-semibold text-primary">{doctor.designation}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1 text-[#c28a31]">
                <Star className="size-3.5 fill-current" aria-hidden="true" />
                {doctor.rating} ({doctor.reviews} reviews)
              </span>
              <span>{doctor.experience} experience</span>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Consultation fee</p>
            <p className="text-2xl font-black">{doctor.fee} <span className="text-xs font-semibold text-muted-foreground">/ visit</span></p>
          </div>
          <button
            onClick={() =>
              selectedTime
                ? onBook
                  ? onBook()
                  : onNotice?.(`Appointment request started for ${selectedTime}.`)
                : onNotice?.("Select an available time first.")
            }
            className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground shadow-sm hover:opacity-90"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </section>
  );
}