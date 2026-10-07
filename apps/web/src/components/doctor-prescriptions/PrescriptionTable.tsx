'use client';

import { Eye, Download, FileText, MoreHorizontal } from 'lucide-react';
import type { PrescriptionUI } from '@/hooks/useDoctorPrescriptions';

interface PrescriptionTableProps {
  prescriptions: PrescriptionUI[];
  isLoading?: boolean;
  onView?: (prescription: PrescriptionUI) => void;
  onDownloadPDF?: (id: string) => void;
  onMoreActions?: (prescription: PrescriptionUI) => void;
  emptyMessage?: string;
}

export function PrescriptionTable({
  prescriptions,
  isLoading = false,
  onView,
  onDownloadPDF,
  onMoreActions,
  emptyMessage = 'No prescriptions found',
}: PrescriptionTableProps) {
  if (isLoading) {
    return (
      <div className="border-border bg-card overflow-hidden rounded-2xl border">
        <div className="border-border border-b px-4 py-3">
          <div className="text-primary grid grid-cols-[1fr_120px_100px_140px_100px] gap-4 text-xs font-bold tracking-wider uppercase">
            <div>Patient</div>
            <div>Diagnosis</div>
            <div>Medications</div>
            <div>Date</div>
            <div>Actions</div>
          </div>
        </div>
        <div className="space-y-3 p-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid animate-pulse grid-cols-[1fr_120px_100px_140px_100px] gap-4"
            >
              <div className="bg-muted h-4 w-3/4 rounded" />
              <div className="bg-muted h-4 w-full rounded" />
              <div className="bg-muted h-4 w-full rounded" />
              <div className="bg-muted h-4 w-full rounded" />
              <div className="bg-muted h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="border-border bg-card rounded-2xl border p-8 text-center">
        <FileText className="text-muted-foreground mx-auto mb-3 size-12" />
        <h3 className="mb-1 text-lg font-semibold">No prescriptions</h3>
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="border-border border-b px-4 py-3">
        <div className="text-primary grid grid-cols-[1fr_120px_100px_140px_100px] gap-4 text-xs font-bold tracking-wider uppercase">
          <div>Patient</div>
          <div>Diagnosis</div>
          <div>Medications</div>
          <div>Date</div>
          <div className="text-right">Actions</div>
        </div>
      </div>
      <div className="divide-border divide-y">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="hover:bg-accent/50 grid cursor-pointer grid-cols-[1fr_120px_100px_140px_100px] gap-4 px-4 py-3 transition-colors"
            onClick={() => onView?.(prescription)}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
                {prescription.patient
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{prescription.patient}</p>
                <p className="text-muted-foreground truncate text-xs">
                  Appt: {prescription.appointmentId}
                </p>
              </div>
            </div>
            <div className="max-w-[110px] truncate text-sm">{prescription.diagnosis}</div>
            <div className="text-muted-foreground text-sm">
              {prescription.medications.length} medication
              {prescription.medications.length !== 1 ? 's' : ''}
            </div>
            <div className="text-muted-foreground text-sm whitespace-nowrap">
              {prescription.date}
            </div>
            <div className="flex items-center justify-end gap-2">
              {onDownloadPDF && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadPDF(prescription.id);
                  }}
                  aria-label="Download PDF"
                  className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
                >
                  <Download className="size-4" />
                </button>
              )}
              {onView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(prescription);
                  }}
                  aria-label="View details"
                  className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
                >
                  <Eye className="size-4" />
                </button>
              )}
              {onMoreActions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoreActions(prescription);
                  }}
                  aria-label="More actions"
                  className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
