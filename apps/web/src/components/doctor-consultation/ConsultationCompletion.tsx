'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { ConsultationCompletionProps } from './types';

export function ConsultationCompletion({
  patientName,
  onBack,
  className,
}: ConsultationCompletionProps) {
  return (
    <div
      className={cn(
        'border-border bg-card mt-8 grid min-h-[520px] place-items-center rounded-2xl border p-8 text-center shadow-sm',
        className
      )}
    >
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e9f8f3] text-[#258c70]">
          <Check className="size-8" />
        </div>
        <h2 className="mt-5 text-2xl font-black">Consultation completed</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          {patientName}&apos;s consultation and prescription were securely saved to their medical
          record.
        </p>
        <button
          onClick={onBack}
          className="bg-primary text-primary-foreground mt-6 rounded-xl px-5 py-3 text-xs font-bold"
        >
          Return to appointments
        </button>
      </div>
    </div>
  );
}
