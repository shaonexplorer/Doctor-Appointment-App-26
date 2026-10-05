'use client';

import { Eye, Download, MoreHorizontal } from 'lucide-react';
import type { PrescriptionUI } from '@/hooks/useDoctorPrescriptions';

interface PrescriptionCardProps {
  prescription: PrescriptionUI;
  onView?: (prescription: PrescriptionUI) => void;
  onDownloadPDF?: (id: string) => void;
  onMoreActions?: (prescription: PrescriptionUI) => void;
}

export function PrescriptionCard({
  prescription,
  onView,
  onDownloadPDF,
  onMoreActions,
}: PrescriptionCardProps) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="text-primary grid size-10 shrink-0 place-items-center rounded-full bg-[#d9e8ff] text-sm font-bold">
            {prescription.patient
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{prescription.patient}</p>
            <p className="text-muted-foreground truncate text-xs">
              Appointment: {prescription.appointmentId}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onDownloadPDF && (
            <button
              onClick={() => onDownloadPDF(prescription.id)}
              aria-label="Download PDF"
              className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
            >
              <Download className="size-4" />
            </button>
          )}
          {onView && (
            <button
              onClick={() => onView(prescription)}
              aria-label="View details"
              className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
            >
              <Eye className="size-4" />
            </button>
          )}
          {onMoreActions && (
            <button
              onClick={() => onMoreActions(prescription)}
              aria-label="More actions"
              className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
            >
              <MoreHorizontal className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="font-medium">Diagnosis:</span>
          <span className="truncate">{prescription.diagnosis}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="font-medium">Medications:</span>
          <span className="truncate">
            {prescription.medications.map((m) => m.name).join(', ') || 'None'}
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="font-medium">Date:</span>
          <span>{prescription.date}</span>
        </div>
        {prescription.tests && (
          <div className="text-muted-foreground flex items-center gap-2">
            <span className="font-medium">Tests:</span>
            <span className="truncate">{prescription.tests}</span>
          </div>
        )}
      </div>

      {onView && (
        <button
          onClick={() => onView(prescription)}
          className="border-border bg-background hover:bg-accent mt-3 w-full rounded-xl border py-2 text-center text-xs font-bold transition-colors"
        >
          View Details
        </button>
      )}
    </div>
  );
}
