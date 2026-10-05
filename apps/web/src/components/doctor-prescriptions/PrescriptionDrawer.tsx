'use client';

import { X, Download, Printer, ChevronLeft } from 'lucide-react';
import type { PrescriptionUI } from '@/hooks/useDoctorPrescriptions';
import { usePrescriptionPDFPreview } from './PrescriptionPDFPreview';

interface PrescriptionDrawerProps {
  prescription: PrescriptionUI | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadPDF?: (id: string) => void;
  onPrint?: () => void;
}

export function PrescriptionDrawer({
  prescription,
  isOpen,
  onClose,
  onDownloadPDF,
  onPrint,
}: PrescriptionDrawerProps) {
  const { pdfPreviewUrl, isGeneratingPreview, generatePreview } =
    usePrescriptionPDFPreview(prescription);

  // Generate preview when drawer opens
  if (isOpen && prescription && !pdfPreviewUrl && !isGeneratingPreview) {
    void generatePreview();
  }

  if (!isOpen || !prescription) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="border-border bg-card animate-slide-in-right z-50 flex h-full w-full max-w-3xl flex-col shadow-xl">
        {/* Header */}
        <div className="border-border flex shrink-0 items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
              aria-label="Close drawer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div>
              <h2 id="drawer-title" className="text-lg font-bold">
                Prescription Details
              </h2>
              <p className="text-muted-foreground text-xs">
                {prescription.patient} · {prescription.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              disabled={!pdfPreviewUrl}
              className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors disabled:opacity-50"
              aria-label="Print prescription"
            >
              <Printer className="size-4" />
            </button>
            {onDownloadPDF && (
              <button
                onClick={() => onDownloadPDF(prescription.id)}
                className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
                aria-label="Download PDF"
              >
                <Download className="size-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors lg:hidden"
              aria-label="Close drawer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
          {/* Patient & Doctor Info */}
          <div className="border-border bg-background grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
            <div>
              <p className="text-primary text-[10px] font-bold tracking-wider uppercase">Patient</p>
              <p className="mt-1 font-semibold">{prescription.patient}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Appointment: {prescription.appointmentId}
              </p>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-primary text-[10px] font-bold tracking-wider uppercase">Doctor</p>
              <p className="mt-1 font-semibold">{prescription.doctorName}</p>
              <p className="text-muted-foreground mt-1 text-xs">{prescription.date}</p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="border-border bg-background rounded-xl border p-4">
            <p className="text-primary text-[10px] font-bold tracking-wider uppercase">Diagnosis</p>
            <p className="mt-2 text-base font-semibold">{prescription.diagnosis}</p>
          </div>

          {/* Medications Table */}
          <div className="border-border bg-background rounded-xl border p-4">
            <p className="text-primary mb-3 text-[10px] font-bold tracking-wider uppercase">
              Medications ({prescription.medications.length})
            </p>
            {prescription.medications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-primary border-border border-b">
                      <th className="px-2 py-2 text-left">Medicine</th>
                      <th className="px-2 py-2 text-left">Dosage</th>
                      <th className="px-2 py-2 text-left">Frequency</th>
                      <th className="px-2 py-2 text-left">Duration</th>
                      <th className="px-2 py-2 text-left">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.medications.map((med, index) => (
                      <tr key={index} className="border-border/50 border-b last:border-0">
                        <td className="px-2 py-2 font-semibold">{med.name}</td>
                        <td className="px-2 py-2">{med.dosage}</td>
                        <td className="px-2 py-2">{med.frequency}</td>
                        <td className="px-2 py-2">{med.duration}</td>
                        <td className="text-muted-foreground px-2 py-2">
                          {med.instructions || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground py-4 text-center">No medications prescribed</p>
            )}
          </div>

          {/* Test Recommendations */}
          {prescription.tests && (
            <div className="border-border bg-background rounded-xl border p-4">
              <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
                Test Recommendations
              </p>
              <p className="mt-2">{prescription.tests}</p>
            </div>
          )}

          {/* Additional Notes */}
          {prescription.notes && (
            <div className="border-border bg-background rounded-xl border p-4">
              <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
                Additional Notes
              </p>
              <p className="mt-2">{prescription.notes}</p>
            </div>
          )}

          {/* PDF Preview */}
          {pdfPreviewUrl && (
            <div className="border-border bg-background rounded-xl border p-4">
              <p className="text-primary mb-3 text-[10px] font-bold tracking-wider uppercase">
                PDF Preview
              </p>
              <div className="border-border overflow-hidden rounded-lg border bg-white">
                <iframe
                  src={pdfPreviewUrl}
                  className="h-96 w-full"
                  title="Prescription PDF Preview"
                  style={{ border: 'none' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add animation for slide-in
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in-right {
    animation: slide-in-right 0.2s ease-out;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
