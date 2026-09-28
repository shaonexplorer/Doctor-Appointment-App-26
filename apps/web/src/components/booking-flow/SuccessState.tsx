'use client';

import { cn } from '@/lib/utils';
import { CalendarDays, Check, Download, FileText } from 'lucide-react';
import { SummaryRow } from './SummaryRow';

export interface SuccessStateProps {
  onDashboard: () => void;
  onBack: () => void;
  appointmentId?: string;
  doctor?: string;
  date?: string;
  time?: string;
  clinic?: string;
  className?: string;
}

export function SuccessState({
  onDashboard,
  onBack,
  appointmentId = 'APT-2026-004821',
  doctor = 'Dr. Michael Anderson',
  date = 'Thu, Sep 24',
  time = '10:30 AM',
  clinic = 'Heart & Vascular Center',
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card mx-auto max-w-2xl min-w-0 overflow-hidden rounded-2xl border p-6 text-center shadow-sm sm:mt-[18%] sm:p-10 xl:mt-[6%]',
        className
      )}
    >
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e9f8f3] text-[#218765]">
        <Check className="size-8" aria-hidden="true" />
      </div>
      <p className="text-primary mt-5 text-xs font-black tracking-wider uppercase">
        Step 5 of 5 &middot; Success
      </p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Appointment confirmed!</h1>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-6">
        Your appointment is reserved and ready. We&apos;ll send a confirmation to your email.
      </p>
      <div className="bg-secondary mt-7 rounded-2xl p-5 text-left">
        <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Appointment ID
        </p>
        <p className="mt-1 truncate text-xl font-black tracking-wide">{appointmentId}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <SummaryRow label="Doctor" value={doctor} />
          <SummaryRow label="Date" value={date} />
          <SummaryRow label="Time" value={time} />
          <SummaryRow className="sm:col-span-3" label="Clinic" value={clinic} />
        </div>
      </div>
      <div className="mt-7 grid gap-2 sm:grid-cols-2">
        <button
          onClick={() => undefined}
          className={cn(
            'border-border hover:bg-secondary rounded-xl border px-4 py-3 text-sm font-black',
            'flex items-center justify-center gap-2'
          )}
        >
          <FileText className="mr-2 inline size-4" aria-hidden="true" />
          View Appointment
        </button>
        <button
          onClick={() => undefined}
          className={cn(
            'border-border hover:bg-secondary rounded-xl border px-4 py-3 text-sm font-black',
            'flex items-center justify-center gap-2'
          )}
        >
          <CalendarDays className="mr-2 inline size-4" aria-hidden="true" />
          Add to Calendar
        </button>
        <button
          onClick={() => undefined}
          className={cn(
            'border-border hover:bg-secondary rounded-xl border px-4 py-3 text-sm font-black',
            'flex items-center justify-center gap-2'
          )}
        >
          <Download className="mr-2 inline size-4" aria-hidden="true" />
          Download Confirmation
        </button>
        <button
          onClick={onDashboard}
          className="bg-primary text-primary-foreground rounded-xl px-4 py-3 text-sm font-black hover:opacity-90"
        >
          Back to Dashboard
        </button>
      </div>
      <button
        onClick={onBack}
        className="text-muted-foreground hover:text-primary mt-5 text-sm font-bold"
      >
        Book another appointment
      </button>
    </div>
  );
}
