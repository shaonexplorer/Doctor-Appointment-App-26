'use client';

import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';
import type { ConsultationFooterProps } from './types';

export function ConsultationFooter({
  onSaveDraft,
  onIssuePrescription,
  onCompleteConsultation,
  className,
}: ConsultationFooterProps) {
  return (
    <footer
      className={cn(
        'border-border bg-card/95 sticky bottom-0 z-20 flex flex-wrap items-center justify-end gap-2 rounded-2xl border p-3 shadow-lg backdrop-blur',
        className
      )}
    >
      <button
        onClick={onSaveDraft}
        className="border-border hover:bg-secondary flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold"
      >
        <Save className="size-4" />
        Save draft
      </button>
      <button
        onClick={onIssuePrescription}
        className="border-primary text-primary hover:bg-primary/5 rounded-xl border px-4 py-2.5 text-xs font-bold"
      >
        Issue prescription
      </button>
      <button
        onClick={onCompleteConsultation}
        className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold hover:opacity-90"
      >
        Complete consultation
      </button>
    </footer>
  );
}
