'use client';

import { useState, useCallback } from 'react';
import { X, Download, Printer, ChevronLeft } from 'lucide-react';
import type { PrescriptionUI } from '@/hooks/useDoctorPrescriptions';
import { prescriptionApi } from '@/lib/api';

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const generatePreview = useCallback(async () => {
    if (!prescription) return;

    setIsGeneratingPreview(true);
    try {
      const blob = await prescriptionApi.downloadPrescriptionPDF(prescription.id);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to generate PDF preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [prescription]);

  // Generate preview when drawer opens
  if (isOpen && prescription && !pdfUrl && !isGeneratingPreview) {
    void generatePreview();
  }

  // Cleanup on unmount
  if (typeof window !== 'undefined' && !isOpen && pdfUrl) {
    URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
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
      <div className="border-border bg-card animate-slide-in-right z-50 flex h-full w-full max-w-4xl flex-col shadow-xl">
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
              disabled={!pdfUrl}
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
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Prescription Details */}

          {/* Right Panel - PDF Viewer */}
          <div className="flex min-w-0 flex-1 flex-col">
            {pdfUrl ? (
              <iframe src={pdfUrl} className="w-full flex-1 border-0" title="Prescription PDF" />
            ) : (
              <div className="text-muted-foreground flex flex-1 items-center justify-center">
                <p className="text-sm">Generating PDF preview...</p>
              </div>
            )}
          </div>
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
