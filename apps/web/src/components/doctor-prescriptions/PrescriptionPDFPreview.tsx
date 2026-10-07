'use client';

import { useState, useCallback } from 'react';
import { prescriptionApi } from '@/lib/api';
import type { PrescriptionUI } from '@/hooks/useDoctorPrescriptions';

interface UsePrescriptionPDFPreviewReturn {
  pdfPreviewUrl: string | null;
  isGeneratingPreview: boolean;
  generatePreview: () => Promise<void>;
  clearPreview: () => void;
}

/**
 * Hook for generating and managing prescription PDF preview
 */
export function usePrescriptionPDFPreview(
  prescription: PrescriptionUI | null
): UsePrescriptionPDFPreviewReturn {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const generatePreview = useCallback(async () => {
    if (!prescription) return;

    setIsGeneratingPreview(true);
    try {
      const blob = await prescriptionApi.downloadPrescriptionPDF(prescription.id);
      const url = URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
    } catch (error) {
      console.error('Failed to generate PDF preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [prescription]);

  const clearPreview = useCallback(() => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  }, [pdfPreviewUrl]);

  return {
    pdfPreviewUrl,
    isGeneratingPreview,
    generatePreview,
    clearPreview,
  };
}

/**
 * Component for displaying prescription PDF preview
 */
interface PrescriptionPDFPreviewProps {
  prescription: PrescriptionUI | null;
  onClose?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

export function PrescriptionPDFPreview({
  prescription,
  onClose,
  onDownload,
  onPrint,
}: PrescriptionPDFPreviewProps) {
  const { pdfPreviewUrl, isGeneratingPreview, generatePreview } =
    usePrescriptionPDFPreview(prescription);

  // Generate preview when prescription changes
  if (prescription && !pdfPreviewUrl && !isGeneratingPreview) {
    void generatePreview();
  }

  if (!prescription) {
    return (
      <div className="border-border bg-card rounded-2xl border p-8 text-center">
        <p className="text-muted-foreground">No prescription selected</p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      {/* Header */}
      <div className="border-border bg-background flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">Prescription Preview</h3>
          <span className="bg-secondary text-muted-foreground rounded-full px-2.5 py-1 text-[10px] font-bold">
            {prescription.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onPrint && (
            <button
              onClick={onPrint}
              disabled={!pdfPreviewUrl}
              className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors disabled:opacity-50"
              aria-label="Print prescription"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="text-muted-foreground hover:text-primary rounded-lg p-2 transition-colors"
              aria-label="Download PDF"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
              aria-label="Close preview"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isGeneratingPreview ? (
          <div className="flex justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
          </div>
        ) : pdfPreviewUrl ? (
          <div className="border-border aspect-[297/210] max-h-[600px] overflow-hidden rounded-lg border bg-white">
            <iframe
              src={pdfPreviewUrl}
              className="h-full w-full"
              title="Prescription PDF Preview"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <button
            onClick={generatePreview}
            className="border-primary/40 text-primary hover:bg-primary/5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-6 text-sm font-bold"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Generate PDF Preview
          </button>
        )}
      </div>
    </div>
  );
}
