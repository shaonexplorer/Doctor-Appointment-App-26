'use client';

import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import type { Medication } from './types';

interface MedicationRowProps {
  index: number;
  medication: Medication;
  onUpdate: (index: number, key: keyof Medication, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function MedicationRow({
  index,
  medication,
  onUpdate,
  onRemove,
  canRemove,
}: MedicationRowProps) {
  const fields: Array<{ label: string; key: keyof Medication }> = [
    { label: 'Medicine', key: 'medicine' },
    { label: 'Dosage', key: 'dosage' },
    { label: 'Frequency', key: 'frequency' },
    { label: 'Duration', key: 'duration' },
    { label: 'Instructions', key: 'instructions' },
  ];

  return (
    <div className={cn('border-border bg-background rounded-xl border p-4', index > 0 && 'mt-3')}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold">Medicine {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Remove medicine ${index + 1}`}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(({ label, key }) => (
          <label key={key} className="text-muted-foreground grid gap-1.5 text-[11px] font-bold">
            {label}
            <input
              value={medication[key]}
              onChange={(e) => onUpdate(index, key, e.target.value)}
              className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary flex h-9 w-full rounded-lg border px-3 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              placeholder={label}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
