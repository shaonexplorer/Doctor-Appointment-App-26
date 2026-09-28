'use client';

import { cn } from '@/lib/utils';
import { BadgeCheck, Star } from 'lucide-react';
import { StepHeading } from './StepHeading';
import { ActionRow } from './ActionRow';

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

export function DoctorStep({ onContinue, doctor, className }: DoctorStepProps) {
  // If no doctor data is provided, render a placeholder
  if (!doctor) {
    return (
      <div className={cn(className)}>
        <StepHeading
          eyebrow="Step 1 of 5"
          title="Confirm your doctor"
          description="You are booking a visit with the selected provider."
        />
        <div className="border-primary/20 bg-primary/5 mt-7 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center">
          <div className="text-primary bg-muted grid size-16 shrink-0 place-items-center rounded-2xl text-lg font-black">
            DR
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black">Loading doctor...</h2>
            </div>
          </div>
        </div>
        <ActionRow label="Continue to date & time" onClick={onContinue} disabled />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <StepHeading
        eyebrow="Step 1 of 5"
        title="Confirm your doctor"
        description="You are booking a visit with the selected provider."
      />
      <div className="border-primary/20 bg-primary/5 mt-7 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center">
        <div
          className={cn(
            'text-primary grid size-16 shrink-0 place-items-center rounded-2xl text-lg font-black',
            doctor.initials ? 'bg-[#dce8ff]' : 'bg-muted'
          )}
        >
          {doctor.initials}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black">{doctor.name}</h2>
            <BadgeCheck className="fill-primary text-card size-5" aria-label="Verified doctor" />
          </div>
          <p className="text-primary mt-1 text-sm font-semibold">{doctor.designation}</p>
          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-[#c28a31]">
              <Star className="size-3.5 fill-current" aria-hidden="true" />
              {doctor.rating} ({doctor.reviews} reviews)
            </span>
            <span>{doctor.experience} experience</span>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">{doctor.clinic}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Consultation fee
          </p>
          <p className="text-xl font-black">{doctor.fee}</p>
        </div>
      </div>
      <ActionRow label="Continue to date & time" onClick={onContinue} />
    </div>
  );
}
