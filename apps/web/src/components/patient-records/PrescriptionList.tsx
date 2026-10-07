'use client';

import { cn } from '@/lib/utils';
import { Pill, FileText, Download, Upload } from 'lucide-react';
import { Info } from './Info';

export interface Prescription {
  id: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medications: number;
  tests: string;
  created: string;
}

export interface PrescriptionListProps {
  items: Prescription[];
  onPreview: (prescription: Prescription) => void;
  onDownload?: (prescription: Prescription) => void;
  onPrint?: (prescription: Prescription) => void;
  onUpload?: () => void;
  className?: string;
}

export function PrescriptionList({
  items,
  onPreview,
  onDownload,
  onPrint: _onPrint,
  onUpload,
  className,
}: PrescriptionListProps) {
  return (
    <section className={cn('border-border bg-card rounded-2xl border shadow-sm', className)}>
      <div className="border-border flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="font-black">My prescriptions</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            {items.length} prescription record{items.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          type="button"
          onClick={onUpload}
          className="border-border hover:bg-secondary flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold"
        >
          <Upload className="size-4" aria-hidden="true" />
          Upload document
        </button>
      </div>
      {items.length ? (
        <div className="grid gap-3 p-5 sm:p-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="border-border hover:border-primary/40 rounded-2xl border p-4 transition hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e9f8f3] text-[#218765]">
                    <Pill className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-bold">{item.id}</h4>
                      <span className="text-primary rounded-full bg-[#eaf1ff] px-2 py-1 text-[10px] font-bold">
                        Active record
                      </span>
                    </div>
                    <p className="text-primary mt-1 text-xs font-bold">{item.doctor}</p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {item.date} &middot; {item.diagnosis}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 xl:w-[390px]">
                  <Info label="Medications" value={`${item.medications}`} />
                  <Info label="Tests" value={item.tests} />
                  <Info label="Created" value={item.created} />
                </div>
                <div className="border-border flex gap-2 border-t pt-3 xl:border-t-0 xl:pt-0">
                  <button
                    type="button"
                    onClick={() => onPreview(item)}
                    className="border-border hover:bg-secondary flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold"
                  >
                    <FileText className="size-4" aria-hidden="true" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownload?.(item)}
                    className="bg-primary text-primary-foreground flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold hover:opacity-90"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    PDF
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <FileText className="text-primary/50 mx-auto size-8" aria-hidden="true" />
          <h3 className="mt-4 font-black">No records found</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Try another search or upload a new document.
          </p>
        </div>
      )}
    </section>
  );
}
