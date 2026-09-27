"use client";

import { cn } from "@/lib/utils";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { StepHeading } from "./StepHeading";
import { ActionRow } from "./ActionRow";

export interface DoctorStepProps {
  onContinue: () => void;
  doctor?: {
    name: string;
    initials: string;
    designation: string;
    specialties: string[];
    experience: string;
    clinic: string;
    fee: string;
    rating: number;
    reviews: number;
  };
  className?: string;
}

export function DoctorStep({
  onContinue,
  doctor = {
    name: "Dr. Michael Anderson",
    initials: "MA",
    designation: "Senior Consultant Cardiologist",
    specialties: ["Cardiology"],
    experience: "18 years",
    clinic: "Heart & Vascular Center, New York",
    fee: "$85",
    rating: 4.9,
    reviews: 128,
  },
  className,
}: DoctorStepProps) {
  return (
    <div className={cn(className)}>
      <StepHeading
        eyebrow="Step 1 of 5"
        title="Confirm your doctor"
        description="You are booking a visit with the selected provider."
      />
      <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center">
        <div className={cn("grid size-16 shrink-0 place-items-center rounded-2xl text-lg font-black text-primary", doctor.initials === "MA" ? "bg-[#dce8ff]" : "")}>
          {doctor.initials}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black">{doctor.name}</h2>
            <BadgeCheck className="size-5 fill-primary text-card" aria-label="Verified doctor" />
          </div>
          <p className="mt-1 text-sm font-semibold text-primary">{doctor.designation}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1 text-[#c28a31]">
              <Star className="size-3.5 fill-current" aria-hidden="true" />
              {doctor.rating} ({doctor.reviews} reviews)
            </span>
            <span>{doctor.experience} experience</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{doctor.clinic}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Consultation fee</p>
          <p className="text-xl font-black">{doctor.fee}</p>
        </div>
      </div>
      <ActionRow label="Continue to date & time" onClick={onContinue} />
    </div>
  );
}