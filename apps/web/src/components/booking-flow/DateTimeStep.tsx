'use client';

import { cn } from '@/lib/utils';
import { CalendarDays, ShieldCheck } from 'lucide-react';
import { StepHeading } from './StepHeading';
import { ActionRow } from './ActionRow';

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

export function DateTimeStep({
  date,
  time,
  setDate,
  setTime,
  onBack,
  onContinue,
  dates = [],
  timeSlots = {},
  className,
}: DateTimeStepProps) {
  const hasDates = dates.length > 0;
  const hasTimeSlots = Object.keys(timeSlots).some((key) => timeSlots[key].length > 0);

  return (
    <div className={cn(className)}>
      <StepHeading
        eyebrow="Step 2 of 5"
        title="Choose your date & time"
        description="Available slots are reserved atomically when you confirm."
      />
      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <label className="text-muted-foreground text-xs font-black tracking-wider uppercase">
            Select a date
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {hasDates ? (
              dates.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setDate(item.value)}
                  className={cn(
                    'rounded-xl border px-3 py-4 text-left text-xs font-black',
                    date === item.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary'
                  )}
                >
                  <CalendarDays className="mb-2 size-4" aria-hidden="true" />
                  {item.label}
                </button>
              ))
            ) : (
              <div className="text-muted-foreground col-span-2 py-8 text-center sm:col-span-3">
                <CalendarDays className="mx-auto mb-2 size-8" aria-hidden="true" />
                <p>No available dates found</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="text-muted-foreground text-xs font-black tracking-wider uppercase">
            Available times
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {hasTimeSlots ? (
              Object.entries(timeSlots).flatMap(([_period, slots]) =>
                slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => !slot.disabled && !slot.booked && setTime(slot.time)}
                    disabled={slot.disabled || slot.booked}
                    className={cn(
                      'rounded-xl border px-3 py-3 text-xs font-black',
                      time === slot.time
                        ? 'border-primary bg-primary text-primary-foreground'
                        : slot.booked
                          ? 'bg-muted text-muted-foreground cursor-not-allowed line-through'
                          : slot.disabled
                            ? 'border-border bg-background text-muted-foreground/50 cursor-not-allowed'
                            : 'border-border hover:border-primary'
                    )}
                  >
                    {slot.time}
                  </button>
                ))
              )
            ) : (
              <div className="text-muted-foreground col-span-2 py-8 text-center sm:col-span-3">
                <p>Select a date to see available times</p>
              </div>
            )}
          </div>
          {hasTimeSlots && (
            <p className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
              <ShieldCheck className="size-4 text-[#218765]" aria-hidden="true" />
              Your selected slot is held during confirmation.
            </p>
          )}
        </div>
      </div>
      <ActionRow
        label="Continue to symptoms"
        onClick={onContinue}
        onBack={onBack}
        disabled={!hasDates || !hasTimeSlots}
      />
    </div>
  );
}
