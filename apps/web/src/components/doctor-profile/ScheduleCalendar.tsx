'use client';

import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

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

  className,
}: ScheduleCalendarProps) {
  return (
    <section
      className={cn('border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6', className)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">Choose a date & time</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            Select one available slot to continue.
          </p>
        </div>
        <CalendarDays className="text-primary size-5" aria-hidden="true" />
      </div>
      <div className="mt-5 grid grid-cols-6 gap-2">
        {dates.map((item, _i) => (
          <button
            key={item.value}
            onClick={() => onDateChange(item.value)}
            className={cn(
              'rounded-xl border px-1 py-3 text-center transition',
              selectedDate === item.value
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background hover:border-primary/50'
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
            <p className="text-muted-foreground mb-2 text-xs font-black tracking-wider uppercase">
              {period}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {times.map((slot) => (
                <button
                  key={`${period}-${slot.time}`}
                  disabled={slot.booked || slot.unavailable}
                  onClick={() => onTimeChange(slot.time)}
                  className={cn(
                    'rounded-xl border py-3 text-xs font-black transition',
                    selectedTime === slot.time && !slot.booked && !slot.unavailable
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : slot.booked
                        ? 'border-border bg-muted text-muted-foreground cursor-not-allowed line-through'
                        : slot.unavailable
                          ? 'border-border bg-background text-muted-foreground/50 cursor-not-allowed'
                          : 'border-border bg-background hover:border-primary hover:text-primary'
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-border text-muted-foreground mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-[10px] font-bold">
        <span className="flex items-center gap-1.5">
          <i className="bg-primary size-2 rounded-full" aria-hidden="true" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <i
            className="border-border bg-background size-2 rounded-full border"
            aria-hidden="true"
          />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <i className="bg-muted size-2 rounded-full" aria-hidden="true" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <i className="bg-background ring-border size-2 rounded-full ring-1" aria-hidden="true" />
          Unavailable
        </span>
      </div>
      <button
        onClick={onViewMoreDates}
        className="border-primary/30 text-primary hover:bg-primary/5 mt-5 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black"
      >
        <CalendarDays className="size-4" aria-hidden="true" />
        View more dates
      </button>
      <button
        onClick={onBook}
        disabled={!selectedDate || !selectedTime}
        className="bg-primary text-primary-foreground mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CalendarDays className="size-4" aria-hidden="true" />
        Book Appointment
      </button>
    </section>
  );
}
