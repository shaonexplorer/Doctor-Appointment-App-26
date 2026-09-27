"use client";

import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export interface DateOption {
  label: string;
  day: number;
  value: string;
}

export interface TimeSlot {
  time: string;
  booked?: boolean;
  unavailable?: boolean;
}

export interface ScheduleCalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  dates: DateOption[];
  slots: Record<string, TimeSlot[]>;
  onBook: () => void;
  onViewMoreDates: () => void;
  onNotice?: (message: string) => void;
  className?: string;
}

export function ScheduleCalendar({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  dates,
  slots,
  onBook,
  onViewMoreDates,
  onNotice,
  className,
}: ScheduleCalendarProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">Choose a date & time</h2>
          <p className="mt-1 text-xs text-muted-foreground">Select one available slot to continue.</p>
        </div>
        <CalendarDays className="size-5 text-primary" aria-hidden="true" />
      </div>
      <div className="mt-5 grid grid-cols-6 gap-2">
        {dates.map((item, i) => (
          <button
            key={item.value}
            onClick={() => onDateChange(item.value)}
            className={cn(
              "rounded-xl border px-1 py-3 text-center transition",
              selectedDate === item.value
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-background hover:border-primary/50"
            )}
          >
            <span className="block text-[10px] font-bold uppercase">{item.label}</span>
            <span className="mt-1 block text-sm font-black">{item.day}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-5">
        {Object.entries(slots).map(([period, times]) => (
          <div key={period}>
            <p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">{period}</p>
            <div className="grid grid-cols-3 gap-2">
              {times.map((slot) => (
                <button
                  key={slot.time}
                  disabled={slot.booked || slot.unavailable}
                  onClick={() => onTimeChange(slot.time)}
                  className={cn(
                    "rounded-xl border py-3 text-xs font-black transition",
                    selectedTime === slot.time && !slot.booked && !slot.unavailable
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : slot.booked
                      ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through"
                      : slot.unavailable
                      ? "cursor-not-allowed border-border bg-background text-muted-foreground/50"
                      : "border-border bg-background hover:border-primary hover:text-primary"
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-[10px] font-bold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-full bg-primary" aria-hidden="true" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-full border border-border bg-background" aria-hidden="true" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-full bg-muted" aria-hidden="true" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-full bg-background ring-1 ring-border" aria-hidden="true" />
          Unavailable
        </span>
      </div>
      <button
        onClick={onViewMoreDates}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 py-3 text-xs font-black text-primary hover:bg-primary/5"
      >
        <CalendarDays className="size-4" aria-hidden="true" />
        View more dates
      </button>
      <button
        onClick={() => onNotice?.(`Appointment request started for ${selectedDate}, ${selectedTime}.`)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-black text-primary-foreground shadow-sm hover:opacity-90"
      >
        <CalendarDays className="size-4" aria-hidden="true" />
        Book Appointment
      </button>
    </section>
  );
}