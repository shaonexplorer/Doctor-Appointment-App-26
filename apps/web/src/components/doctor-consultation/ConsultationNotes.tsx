'use client';

import { cn } from '@/lib/utils';
import type { ConsultationNotesProps } from './types';

const TEXTAREA_ROWS: Record<string, number> = {
  'Clinical notes': 4,
  'Treatment plan': 4,
  'Chief complaint': 2,
  Symptoms: 2,
  Diagnosis: 3,
};

export function ConsultationNotes({ notes, onChange, className }: ConsultationNotesProps) {
  const fields = [
    'Chief complaint',
    'Symptoms',
    'Clinical notes',
    'Diagnosis',
    'Treatment plan',
  ] as const;

  return (
    <section
      className={cn('border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6', className)}
    >
      <div>
        <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
          Consultation notes
        </p>
        <h2 className="mt-1 text-xl font-black">Today&apos;s clinical assessment</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}{' '}
          · In-person consultation
        </p>
      </div>
      <div className="mt-6 grid gap-4">
        {fields.map((field) => (
          <label key={field} className="grid gap-1.5 text-xs font-bold">
            {field}
            <textarea
              rows={TEXTAREA_ROWS[field] || 2}
              placeholder={`Enter ${field.toLowerCase()}...`}
              value={notes[field as keyof typeof notes]}
              onChange={(event) => onChange(field as keyof typeof notes, event.target.value)}
              className="border-border bg-background focus:border-primary focus:ring-primary/15 resize-none rounded-xl border p-3 text-sm font-normal outline-none focus:ring-2"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
