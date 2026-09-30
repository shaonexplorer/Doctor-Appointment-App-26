'use client';

import { cn } from '@/lib/utils';
import { Download, Printer, X } from 'lucide-react';
import { Info } from './Info';
import { Section } from './Section';

export interface PrescriptionPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  prescription?: {
    id: string;
    doctor: string;
    patient: string;
    diagnosis: string;
    created: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }>;
    tests: string[];
  };
  onDownload?: () => void;
  onPrint?: () => void;
  className?: string;
}

export function PrescriptionPreview({
  isOpen,
  onClose,
  prescription,
  onDownload,
  onPrint,
  className,
}: PrescriptionPreviewProps) {
  if (!isOpen) return null;

  const defaultPrescription = {
    id: 'RX-2026-003988',
    doctor: 'Dr. Sarah Williams &middot; General Medicine',
    patient: 'Sarah Johnson',
    diagnosis: 'Annual wellness check-up',
    created: 'August 18, 2026',
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500 mg',
        frequency: '3 times daily',
        duration: '7 days',
        instructions: 'After meals',
      },
    ],
    tests: ['CBC', 'ECG', 'Lipid Profile'],
  };

  const data = prescription || defaultPrescription;

  return (
    <div
      className="bg-foreground/30 fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Prescription preview"
    >
      <div
        className={cn(
          'bg-card max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6 shadow-2xl sm:p-8',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-xs font-black tracking-wider uppercase">Prescription</p>
            <h2 className="mt-2 text-2xl font-black">{data.id}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:bg-secondary rounded-xl p-2"
            aria-label="Close preview"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="bg-secondary mt-6 grid gap-3 rounded-2xl p-4 sm:grid-cols-2">
          <Info label="Doctor" value={data.doctor} />
          <Info label="Patient" value={data.patient} />
          <Info label="Diagnosis" value={data.diagnosis} />
          <Info label="Created" value={data.created} />
        </div>

        {/* Medications Table */}
        <Section title="Medication">
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-border text-muted-foreground border-b text-xs">
                  <th className="pb-3">Medication</th>
                  <th className="pb-3">Dosage</th>
                  <th className="pb-3">Frequency</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {data.medications.map((med, index) => (
                  <tr key={index} className="border-border border-b">
                    <td className="py-4 font-black">{med.name}</td>
                    <td className="py-4">{med.dosage}</td>
                    <td className="py-4">{med.frequency}</td>
                    <td className="py-4">{med.duration}</td>
                    <td className="py-4">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Test Recommendations */}
        <Section title="Test recommendations">
          <div className="mt-3 flex flex-wrap gap-2">
            {data.tests.map((test) => (
              <span key={test} className="bg-secondary rounded-full px-3 py-2 text-xs font-bold">
                {test}
              </span>
            ))}
          </div>
        </Section>

        {/* Actions */}
        <div className="border-border mt-8 flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onPrint}
            className="border-border hover:bg-secondary flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold"
          >
            <Printer className="size-4" aria-hidden="true" />
            Print
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold"
          >
            <Download className="size-4" aria-hidden="true" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
