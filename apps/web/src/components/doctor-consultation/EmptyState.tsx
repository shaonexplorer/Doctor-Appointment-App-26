'use client';

import { cn } from '@/lib/utils';
import { Stethoscope, ArrowRight, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export function ConsultationEmptyState({ className }: { className?: string }) {
  return (
    <div className={cn('border-border bg-card rounded-2xl border p-10 text-center', className)}>
      <div className="bg-primary/10 mx-auto mb-6 grid size-16 place-items-center rounded-full">
        <Stethoscope className="text-primary size-8" aria-hidden="true" />
      </div>
      <h3 className="text-foreground text-xl font-black">No active consultation</h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        Consultations are started from specific appointments. Select an appointment from your
        schedule to begin a clinical consultation.
      </p>
      <Link
        href="/doctor/appointments"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors"
      >
        <CalendarDays className="size-4" aria-hidden="true" />
        View appointments
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
