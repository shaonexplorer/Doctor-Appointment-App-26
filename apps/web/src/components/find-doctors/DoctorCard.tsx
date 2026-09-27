"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, Check, Clock3, MapPin, Star, Video } from "lucide-react";

export interface DoctorCardData {
  name: string;
  initials: string;
  designation: string;
  specialties: string[];
  symptoms: string[];
  experience: string;
  qualifications: string;
  fee: string;
  clinic: string;
  next: string;
  availability: string;
  color: string;
}

export interface DoctorCardProps {
  doctor: DoctorCardData;
  list?: boolean;
  onAction?: (label: string) => void;
  onOpenProfile?: () => void;
  onBook?: () => void;
  className?: string;
}

export function DoctorCard({
  doctor,
  list = false,
  onAction,
  onOpenProfile,
  onBook,
  className,
}: DoctorCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
        list ? "sm:flex sm:items-center sm:gap-5" : "",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-black", doctor.color)}>
          {doctor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-black">{doctor.name}</h3>
              <p className="mt-1 text-xs font-semibold text-primary">{doctor.designation}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#c28a31]">
              <Star className="size-3.5 fill-current" aria-hidden="true" />
              4.9
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.specialties.map((item) => (
              <span key={item} className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 border-y border-border py-4 text-xs sm:grid-cols-2">
        <Info icon={Clock3} label="Experience" value={doctor.experience} />
        <Info icon={Check} label="Qualifications" value={doctor.qualifications} />
        <Info icon={MapPin} label="Clinic" value={doctor.clinic} />
        <Info icon={CalendarDays} label="Next available" value={doctor.next} />
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        <span className="font-bold text-foreground">Treats:</span> {doctor.symptoms.join(" &middot; ")}
      </p>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Consultation fee</p>
          <p className="mt-1 text-lg font-black">{doctor.fee} <span className="text-[10px] font-semibold text-muted-foreground">/ visit</span></p>
          <p className={cn("mt-1 text-[10px] font-bold", doctor.availability === "Available today" ? "text-[#278e70]" : "text-primary")}>
            {doctor.availability}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onAction?.(`${doctor.name} profile`);
              onOpenProfile?.();
            }}
            className="rounded-xl border border-border px-3 py-2.5 text-xs font-bold hover:bg-secondary"
          >
            View profile
          </button>
          <button
            onClick={() => {
              onAction?.(`Booking with ${doctor.name}`);
              onBook?.();
            }}
            className="rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90"
          >
            Book appointment
          </button>
        </div>
      </div>
    </article>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 truncate font-bold">{value}</p>
      </div>
    </div>
  );
}