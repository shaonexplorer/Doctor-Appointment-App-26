"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, ShieldCheck } from "lucide-react";
import { StepHeading } from "./StepHeading";
import { ActionRow } from "./ActionRow";

export interface TimeSlot {
  time: string;
  disabled?: boolean;
  booked?: boolean;
}

export interface DateOption {
  label: string;
  value: string;
}

export interface DateTimeStepProps {
  date: string;
  time: string;
  setDate: (value: string) => void;
  setTime: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  dates?: DateOption[];
  timeSlots?: Record<string, TimeSlot[]>;
  className?: string;
}

const defaultDates: DateOption[] = [
  { label: "Tue, Sep 22", value: "Tue, Sep 22" },
  { label: "Wed, Sep 23", value: "Wed, Sep 23" },
  { label: "Thu, Sep 24", value: "Thu, Sep 24" },
  { label: "Fri, Sep 25", value: "Fri, Sep 25" },
  { label: "Sat, Sep 26", value: "Sat, Sep 26" },
];

const defaultTimeSlots: Record<string, TimeSlot[]> = {
  Morning: [
    { time: "09:00 AM" },
    { time: "09:20 AM" },
    { time: "10:00 AM" },
    { time: "10:30 AM" },
  ],
  Afternoon: [
    { time: "02:00 PM" },
    { time: "02:40 PM", booked: true },
    { time: "04:20 PM" },
    { time: "05:00 PM" },
  ],
};

export function DateTimeStep({
  date,
  time,
  setDate,
  setTime,
  onBack,
  onContinue,
  dates = defaultDates,
  timeSlots = defaultTimeSlots,
  className,
}: DateTimeStepProps) {
  return (
    <div className={cn(className)}>
      <StepHeading
        eyebrow="Step 2 of 5"
        title="Choose your date & time"
        description="Available slots are reserved atomically when you confirm."
      />
      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Select a date</label>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {dates.map((item) => (
              <button
                key={item.value}
                onClick={() => setDate(item.value)}
                className={cn(
                  "rounded-xl border px-3 py-4 text-left text-xs font-black",
                  date === item.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                )}
              >
                <CalendarDays className="mb-2 size-4" aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Available times</label>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(timeSlots).flatMap(([period, slots]) =>
              slots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => !slot.disabled && !slot.booked && setTime(slot.time)}
                  disabled={slot.disabled || slot.booked}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-xs font-black",
                    time === slot.time
                      ? "border-primary bg-primary text-primary-foreground"
                      : slot.booked
                      ? "cursor-not-allowed bg-muted text-muted-foreground line-through"
                      : slot.disabled
                      ? "cursor-not-allowed border-border bg-background text-muted-foreground/50"
                      : "border-border hover:border-primary"
                  )}
                >
                  {slot.time}
                </button>
              ))
            )}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-[#218765]" aria-hidden="true" />
            Your selected slot is held during confirmation.
          </p>
        </div>
      </div>
      <ActionRow label="Continue to symptoms" onClick={onContinue} onBack={onBack} />
    </div>
  );
}